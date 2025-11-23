import { z } from "zod";
import { generateObject } from "ai";
import { asyncHandler } from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";
import { prisma } from "../lib/prisma";
import { google } from "../lib/googleForAISDK";

export const generateAiAnswer = asyncHandler(async (req, res) => {
  const { questionId } = req.body;

  // 3. Find question
  const question = await prisma.question.findUnique({
    where: { questionId },
  });

  if (!question) {
    return res.status(404).json(new ApiResponse(404, "Question not found."));
  }

  // 4. If AI answer already exists, return it
  if (question.AIanswer) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, "AI answer already exists.", question.AIanswer)
      );
  }

  // 5. Define Zod schema for AI response
  const answerSchema = z.object({
    answer: z.string().min(10),
  });

  // 6. Generate AI Answer using AI SDK
  const aiResponse = await generateObject({
    model: google("gemini-2.0-flash"),
    schema: answerSchema,
    prompt: `You are an expert interview assistant. Answer the following question in a professional and concise manner.\n\nQuestion: ${question.questionText}`,
  });

  const aiAnswer = aiResponse.object.answer;

  // 7. Save AI answer in DB
  const updatedQuestion = await prisma.question.update({
    where: { questionId },
    data: { AIanswer: aiAnswer },
  });

  // 8. Respond
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "AI answer generated successfully.",
        updatedQuestion.AIanswer
      )
    );
});

export const generateQuestions = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res
      .status(401)
      .json(new ApiResponse(401, "userId is required to generate questions."));
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const isSubscribed =
    user.subscription?.status === "ACTIVE" &&
    (!user.subscription.endDate || user.subscription.endDate > new Date());

  console.log("isSubscribe : ", isSubscribed);

  // If not subscribed → check interview limit
  if (!isSubscribed) {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const interviewCount = await prisma.interview.count({
      where: {
        userId,
        createdAt: { gte: oneMonthAgo },
        isDeleted: false,
      },
    });

    if (interviewCount >= 3) {
      return res.status(403).json({
        error:
          "You have reached the free limit of 3 interviews this month. Upgrade to continue.",
      });
    }
  }

  let {
    description,
    title,
    interviewTemplateId,
    tags,
    level = "Intermediate",
    noOfQuestions = 5,
    type = "Technical",
  } = req.body;

  // Zod schema: array of question strings
  const InterviewQuestionsSchema = z.object({
    questions: z
      .array(z.string().describe("An interview question text."))
      .min(1)
      .describe(`An array of ${noOfQuestions} interview questions.`),
  });

  try {
    let prompt: string;

    if (!title || !description) {
      prompt = `
          Please generate a list of ${noOfQuestions} generic ${type} interview questions.
          The questions should be suitable for a candidate at the ${level} experience level.
          Do not include numbering, indexing, or suggested answers.
        `;
    } else {
      prompt = `
          Based on the following job details, generate a list of interview questions.
          Job Title: "${title}"
          Job Description: "${description}"
          Key Skills: "${tags}"
          Experience Level: "${level}"
          Type of Questions: "${type}"

          Generate exactly ${noOfQuestions} questions.
          Do not include numbering, indexing, or suggested answers.
        `;
    }

    // Generate and validate AI response
    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: InterviewQuestionsSchema,
      prompt,
    });

    console.log("AI Generated Questions:", object.questions);

    const createdInterview = await prisma.interview.create({
      data: {
        userId: userId,
        role: title,
        interviewTemplateId: interviewTemplateId,
        level: level,
        noOfQuestions: parseInt(noOfQuestions),
        type: type,
        questions: {
          create: object.questions.map((que, index) => ({
            questionText: que,
            order: index + 1,
          })),
        },
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { interviewId: createdInterview.interviewId },
          "Interview questions generated successfully"
        )
      );
  } catch (error) {
    console.error("AI service failed to generate questions:", error);

    return res
      .status(402)
      .json(
        new ApiResponse(
          402,
          "AI service unavailable. Returning fallback questions."
        )
      );
  }
});

export const generatePersonalisedQuestions = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res
      .status(401)
      .json(new ApiResponse(401, "userId is required to generate questions."));
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const isSubscribed =
    user.subscription?.status === "ACTIVE" &&
    (!user.subscription.endDate || user.subscription.endDate > new Date());

  console.log("isSubscribe : ", isSubscribed);

  // If not subscribed → check interview limit
  if (!isSubscribed) {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const interviewCount = await prisma.interview.count({
      where: {
        userId,
        createdAt: { gte: oneMonthAgo },
        isDeleted: false,
      },
    });

    if (interviewCount >= 3) {
      return res.status(403).json({
        error:
          "You have reached the free limit of 3 interviews this month. Upgrade to continue.",
      });
    }
  }

  const { resumeId, noOfQuestions = 4 } = req.body;

  if (!resumeId) {
    console.error("Resume ID is required to generate Personalised interview");

    return res
      .status(407)
      .json(
        new ApiResponse(
          407,
          "Resume ID is required to generate Personalised interview"
        )
      );
  }

  const resume = await prisma.resume.findUnique({
    where: { id: resumeId },
    include: { ResumeAnalysis: true },
  });

  if (!resume || !resume.ResumeAnalysis?.analysis) {
    console.error("Resume Not found to generate Personalised interview");

    return res
      .status(404)
      .json(
        new ApiResponse(
          404,
          "Resume Not found to generate Personalised interview"
        )
      );
  }

  // Zod schema: array of question strings
  const InterviewQuestionsSchema = z.object({
    title: z
      .string()
      .min(5)
      .describe(
        "A short, professional title for the interview based on the resume and role."
      ),
    questions: z
      .array(z.string().describe("An interview question text."))
      .min(1)
      .describe(`An array of ${noOfQuestions} interview questions.`),
  });

  // const ResumeAnalysis = resume.ResumeAnalysis.analysis;
  try {
    let prompt = `You are interviewing a candidate based ONLY on the resume analysis provided. 
      Your task is to generate:

      1. A **short interview title** (max 7 words) based on their stack and seniority.
      2. Exactly ${noOfQuestions} **high-depth, extremely technical, personalized interview questions**.

      ### Mandatory Rules (strictly follow):
      - Every question MUST reference: **their real tech stack, real projects, or real missing skills**
      - Minimum 1 of questions must mention a **specific project, tool, database, or architecture choice from their resume**
      - At least 2 questions must target their **missing skills**: ${resume.ResumeAnalysis.analysis?.missingKeywords.join(
        ", "
      )}
      - Avoid generic questions unless rewritten to include their own stack or project context
      - Questions must evaluate: **system design, edge cases, tradeoffs, scalability, failure handling, performance, security, or debugging**
      - No basic theory questions (e.g., "What is Node.js?" ❌)
      - No numbering, no answers

      ---

      ### Candidate Details You MUST Use:
      **Tech Stack:**  
      Languages: ${resume.ResumeAnalysis.analysis?.skills.languages.join(
        ", "
      )}  
      Frameworks: ${resume.ResumeAnalysis.analysis?.skills.frameworksAndLibraries.join(
        ", "
      )}  
      Databases: ${resume.ResumeAnalysis.analysis?.skills.databases.join(
        ", "
      )}  
      Tools/Platforms: ${resume.ResumeAnalysis.analysis?.skills.toolsAndPlatforms.join(
        ", "
      )}

      **Projects:**  
      ${resume.ResumeAnalysis.analysis?.projects
        .map((p) => `- ${p.name}: ${p.description}`)
        .join("\n")}

      **Missing Skills to Test:**  
      ${resume.ResumeAnalysis.analysis?.missingKeywords.join(", ")}

      **Strong Keywords Found:**  
      ${resume.ResumeAnalysis.analysis?.matchingKeywords
        .slice(0, 15)
        .join(", ")}

      ---

      ### Output Format (JSON enforced by schema):
      {
        "title": "Example Title",
        "questions": ["question1", "question2", ...]
      }
      `;

    // Generate and validate AI response
    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: InterviewQuestionsSchema,
      prompt,
    });

    console.log("AI Generated Questions:", object.questions);

    const createdInterview = await prisma.interview.create({
      data: {
        userId: userId,
        role: object.title,
        noOfQuestions: parseInt(noOfQuestions),
        questions: {
          create: object.questions.map((que, index) => ({
            questionText: que,
            order: index + 1,
          })),
        },
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { interviewId: createdInterview.interviewId },
          "Interview questions generated successfully"
        )
      );
  } catch (error) {
    console.error("AI service failed to generate questions:", error);

    return res
      .status(402)
      .json(
        new ApiResponse(
          402,
          "AI service unavailable. Returning fallback questions."
        )
      );
  }
});
