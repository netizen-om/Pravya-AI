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
      .json(new ApiResponse(200, "AI answer already exists.", question.AIanswer));
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
    .json(new ApiResponse(200, "AI answer generated successfully.",  updatedQuestion.AIanswer));
});


export const generateQuestions = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res
      .status(401)
      .json(new ApiResponse(401, "userId is required to generate questions."));
  }
  const isUserPresent = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!isUserPresent) {
    return res.status(402).json(new ApiResponse(402, "userId does not exist."));
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
