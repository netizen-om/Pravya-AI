import { Job } from "bullmq";
import { DetailedInterviewFeedback, InterviewAnalyseJobData } from "../types";
import { prisma } from "@repo/db";
import { generateObject } from "ai";
import { google } from "../lib/googleForAISDK";
import { z } from "zod";

// Import all our new and old schemas
import {
  detailedInterviewFeedbackSchema, // The original, full schema for final validation
  singleQuestionFeedbackSchema, // Type helper for Call 1
  communicationDeliverySchema, // Schema for Call 2
  finalSynthesisSchema, // Schema for Call 3
} from "../lib/zod";
import { groqClient } from "../lib/groqForrAISDK";

const llmQuestionAnalysisSchema = singleQuestionFeedbackSchema.omit({
  questionId: true,
  questionText: true,
  userAnswerTranscript: true,
});

export const analyseInterview = async (job: Job<InterviewAnalyseJobData>) => {
  const { interviewId } = job.data;
  console.log(`🚀 Starting analysis for interview: ${interviewId}`);

  try {
    // 1️⃣ Fetch interview
    const interview = await prisma.interview.findUnique({
      where: { interviewId },
    });

    if (!interview || !interview.transcribe) {
      throw new Error("Interview or transcript not found");
    }

    // 2️⃣ Mark status as 'Analysing'
    await prisma.interview.update({
      where: { interviewId },
      data: { status: "ANALYSING" },
    });

    // 3️⃣ Clean transcript and prepare inputs for LLM calls
    // @ts-ignore
    const cleanedTranscript: { role: "user" | "assistant"; text: string }[] =
      interview.transcribe.map(({ role, text }) => ({
        role,
        text,
      }));

    // --- Input for Call 1: Group questions and answers ---
    const questionAnswerPairs = [];
    for (let i = 0; i < cleanedTranscript.length; i++) {
      if (
        cleanedTranscript[i].role === "assistant" &&
        cleanedTranscript[i + 1]?.role === "user"
      ) {
        questionAnswerPairs.push({
          questionId: `q_${i + 1}`, // Generate a simple unique ID
          questionText: cleanedTranscript[i].text,
          userAnswerTranscript: cleanedTranscript[i + 1].text,
        });
        i++; // Skip the answer we just processed
      }
    }

    if (questionAnswerPairs.length === 0) {
      throw new Error("No valid question/answer pairs found in transcript.");
    }

    // --- Input for Call 2: Get all user answers for delivery analysis ---
    const allUserAnswers = cleanedTranscript
      .filter((t) => t.role === "user")
      .map((t) => t.text)
      .join("\n\n"); // Join with newlines for context

    // --- Context for Calls: Job Role ---
    const jobContext = `Role: ${
      interview.role || "Software Engineer"
    }, Level: ${interview.level || "Entry-level"}`;

    // 4️⃣ --- Execute 3-Call LLM Workflow ---
    let questionBreakdown: z.infer<typeof singleQuestionFeedbackSchema>[];
    let communicationAndDelivery: z.infer<typeof communicationDeliverySchema>;
    let finalSynthesis: z.infer<typeof finalSynthesisSchema>;

    const batchedQuestionFeedbackSchema = z.object({
      questions: z.array(singleQuestionFeedbackSchema),
    });

    try {
      // --- Call 1: Per-Question Analysis (in parallel) ---
      console.log(`[${interviewId}] Starting Call 1: Per-Question Analysis...`);
      // const questionBreakdownPromises = questionAnswerPairs.map((pair) =>
      //   generateObject({
      //     // model: google('gemini-2.5-flash'),
      //     model: groqClient("openai/gpt-oss-120b"),
      //     system: `You are an expert interview coach. Analyze the candidate's answer to the given question.
      //              Role Context: ${jobContext}
      //              Focus *only* on this single question and answer.
      //              Be specific, constructive, and fair.
      //              Provide a concise model answer if you can.`,
      //     schema: llmQuestionAnalysisSchema, // Use the OMITTED schema
      //     prompt: `Question: ${pair.questionText}\n\nAnswer: ${pair.userAnswerTranscript}`,
      //   }).then((result) => {
      //     // Merge the static data with the LLM's analysis
      //     const fullBreakdown: z.infer<typeof singleQuestionFeedbackSchema> = {
      //       ...pair, // This has questionId, questionText, userAnswerTranscript
      //       ...result.object, // This has specificFeedback, positivePoints, etc.
      //     };
      //     return fullBreakdown;
      //   })
      // );
      // questionBreakdown = await Promise.all(questionBreakdownPromises);

      const batchedResult = await generateObject({
        model: groqClient("openai/gpt-oss-120b"),
        temperature: 0,
        system: `
                You are an expert interview coach.

                You MUST return a SINGLE JSON OBJECT.
                The object MUST have a key called "questions".

                "questions" MUST be an array.
                Each array element corresponds to EXACTLY ONE input question.

                STRICT RULES:
                - Output VALID JSON ONLY
                - No commentary, no markdown
                - Do NOT omit any question
                - Do NOT merge questions
                - Preserve questionId, questionText, and userAnswerTranscript EXACTLY
                `,
        schema: batchedQuestionFeedbackSchema,
        prompt: `
                Job Context: ${jobContext}

                Here are the question–answer pairs:
                ${JSON.stringify(questionAnswerPairs, null, 2)}
                `,
      });

      questionBreakdown = batchedResult.object.questions;

      console.log(`[${interviewId}] Finished Call 1.`);

      // --- Call 2: Communication & Delivery ---
      console.log(
        `[${interviewId}] Starting Call 2: Communication & Delivery...`
      );
      const communicationResult = await generateObject({
        // model: google('gemini-2.5-flash'),
        model: groqClient("openai/gpt-oss-120b"),
        system: `You are a speech and communication coach.
                 Analyze the *entire* collection of the candidate's answers.
                 Focus *only* on delivery: pace, filler words, tone, and clarity.
                 Do *not* judge the content or correctness of the answers.`,
        schema: communicationDeliverySchema,
        prompt: `Here are all the candidate's answers, separated by newlines:
                 \n\n${allUserAnswers}`,
      });
      communicationAndDelivery = communicationResult.object;
      console.log(`[${interviewId}] Finished Call 2.`);

      // --- Call 3: Final Synthesis ---
      console.log(`[${interviewId}] Starting Call 3: Final Synthesis...`);
      const synthesisResult = await generateObject({
        // model: google('gemini-2.5-flash'),
        model: groqClient("openai/gpt-oss-120b"),
        system: `You are a senior hiring manager.
                 You have received detailed analysis from your team (per-question feedback and a communication report).
                 Your job is to synthesize all this information into a high-level summary.
                 Provide the final dashboard metrics, overall performance, and role-fit analysis.
                 You MUST provide at least 3 strengths and 3 improvement areas.`,
        schema: finalSynthesisSchema,
        prompt: `
              Job Context: ${jobContext}

              Here is the detailed per-question analysis:
              ${JSON.stringify(questionBreakdown, null, 2)}

              Here is the communication & delivery report:
              ${JSON.stringify(communicationAndDelivery, null, 2)}

              Please synthesize these inputs into the final report.
            `,
      });
      finalSynthesis = synthesisResult.object;
      console.log(`[${interviewId}] Finished Call 3.`);
    } catch (modelError) {
      console.error(`[${interviewId}] AI model generation failed:`, modelError);
      throw new Error("AI model failed to generate feedback");
    }

    // 5️⃣ --- Assemble Final Report ---
    // This combines the results from the 3 calls back into your
    // *original* detailedInterviewFeedbackSchema structure.
    console.log(`[${interviewId}] Assembling final report...`);
    const fullFeedbackObject = {
      ...finalSynthesis, // This has overallPerformance, dashboardMetrics, roleSpecificFit
      communicationAndDelivery: communicationAndDelivery, // From Call 2
      questionBreakdown: questionBreakdown, // From Call 1
    };

    // 6️⃣ Validate assembled output
    let validatedAnalysis: DetailedInterviewFeedback;
    try {
      // Validate against the *original* complete schema
      validatedAnalysis =
        detailedInterviewFeedbackSchema.parse(fullFeedbackObject);
    } catch (validationError) {
      console.error(
        `[${interviewId}] FINAL Schema validation failed:`,
        validationError
      );
      console.error(
        "Object that failed validation:",
        JSON.stringify(fullFeedbackObject, null, 2)
      );
      throw new Error("Assembled feedback did not match original schema");
    }
    console.log(`[${interviewId}] Final report assembled and validated.`);

    // 7️⃣ Save feedback to DB
    // This section is identical to your original code and should work perfectly.
    const feedback = await prisma.feedback.create({
      data: {
        interviewId,
        fullFeedbackJson: validatedAnalysis,
        overallScore: validatedAnalysis.overallPerformance.overallScore,
        summary: validatedAnalysis.overallPerformance.summary,
        keyStrengths: validatedAnalysis.overallPerformance.keyStrengths,
        improvementAreas:
          validatedAnalysis.overallPerformance.keyAreasForImprovement,
        communicationScore:
          validatedAnalysis.dashboardMetrics.communication.score,
        technicalScore: validatedAnalysis.dashboardMetrics.hardSkills.score,
        problemSolvingScore:
          validatedAnalysis.dashboardMetrics.problemSolving.score,
        behavioralScore: validatedAnalysis.dashboardMetrics.softSkills.score,
        confidenceScore: validatedAnalysis.dashboardMetrics.confidence.score,
      },
    });

    // 8️⃣ Update interview status
    if (feedback) {
      await prisma.interview.update({
        where: { interviewId },
        data: { status: "COMPLETED" },
      });
    }

    console.log(`✅ Interview analysis completed for ${interviewId}`);
  } catch (error: any) {
    console.error(
      `❌ Interview analysis failed for ${interviewId}:`,
      error.message
    );

    // 9️⃣ Ensure DB status reflects the failure
    try {
      await prisma.interview.update({
        where: { interviewId },
        data: { status: "ERROR" },
      });
    } catch (updateError) {
      console.error(
        `[${interviewId}] Failed to update interview status after error:`,
        updateError.message
      );
    }

    // Rethrow to let BullMQ handle retries
    throw error;
  }
};
