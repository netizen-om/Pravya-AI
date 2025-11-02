import { Job } from "bullmq";
import { DetailedInterviewFeedback, InterviewAnalyseJobData } from "../types";
import { prisma } from "@repo/db";
import { generateObject } from "ai";
import { google } from "../lib/googleForAISDK";
import { detailedInterviewFeedbackSchema } from "../lib/zod";

export const analyseInterview = async (job: Job<InterviewAnalyseJobData>) => {
  const { interviewId } = job.data;

    console.log(interviewId);
    

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
      data: { status: "Analysing" },
    });

    // 3️⃣ Clean transcript (remove unwanted props)
    //@ts-ignore
    const cleanedTranscript = interview.transcribe.map(({ role, text }) => ({
      role,
      text,
    }));

    const transcriptText = cleanedTranscript
      .map(
        (t) => `${t.role === "user" ? "Candidate" : "Interviewer"}: ${t.text}`
      )
      .join("\n");

    // 4️⃣ Generate structured feedback
    let generated;
    try {
      generated = await generateObject({
        model: google("gemini-2.5-flash"),
        system: `You are an AI interview feedback analyst. 
                Your job is to analyze an interview transcript and produce a structured JSON that strictly matches the provided schema.
                DO NOT include any explanations, reasoning, markdown, or text outside the JSON object.

                ### Output Format Rules:
                - Return **only** valid JSON that conforms 100% to the provided schema.
                - If the schema specifies a minimum number of items (e.g., at least 3 strengths), always include that many or more.
                - Ensure all required fields are present and non-empty.
                - Avoid null, undefined, or missing keys.
                - Keep text concise, specific, and professional.
                - Numbers (scores) must be within realistic interview scoring ranges (0–10 or 0–100 depending on schema).
                - Never output partial JSON or comments.

                ### Task:
                You will receive the full interview transcript below.
                Analyze the candidate’s communication, technical depth, confidence, and problem-solving ability.
                Then fill every field in the JSON **completely**, making sure arrays meet the minimum length requirements.

                IMPORTANT: Do not skip any required field. 
                Even if the interview was very poor, generate at least 3 strengths and 3 improvement areas.
                `,
        schema: detailedInterviewFeedbackSchema as any,
        prompt: `Here is the interview transcript:\n${transcriptText}`,
      });
    } catch (modelError) {
      console.error("AI model generation failed:", modelError);
      throw new Error("AI model failed to generate feedback");
    }

    const { object } = generated;

    // 5️⃣ Validate output
    let validatedAnalysis: DetailedInterviewFeedback;
    try {
      validatedAnalysis = detailedInterviewFeedbackSchema.parse(object);
    } catch (validationError) {
      console.error("Schema validation failed:", validationError);
      throw new Error("Generated feedback did not match expected schema");
    }

    // 6️⃣ Save feedback to DB
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

    // 7️⃣ Update interview status
    if (feedback) {
      await prisma.interview.update({
        where: { interviewId },
        data: { status: "Completed" },
      });
    }

    console.log(`✅ Interview analysis completed for ${interviewId}`);
  } catch (error: any) {
    console.error(`❌ Interview analysis failed for ${interviewId}:`, error);

    // 8️⃣ Ensure DB status reflects the failure
    try {
      await prisma.interview.update({
        where: { interviewId },
        data: { status: "Failed" },
      });
    } catch (updateError) {
      console.error(
        "Failed to update interview status after error:",
        updateError
      );
    }

    // Optionally rethrow to let BullMQ handle retries
    throw error;
  }
};
