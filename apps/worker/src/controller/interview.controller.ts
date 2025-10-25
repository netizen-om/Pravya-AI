import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from ". ./utils/ApiError.js";
import { z } from "zod";
import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

// Initialize the Google Gemini model from your stack
const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

// Define a pre-written list of questions as a fallback
const fallbackQuestions = [
    {
        question: "Can you tell me about yourself and your background?",
        suggestedAnswer: "Look for a concise summary of their relevant experience, skills, and career goals. It should be a confident 'elevator pitch'."
    },
    {
        question: "What are your biggest strengths?",
        suggestedAnswer: "Candidate should mention strengths relevant to the job, providing specific examples of how they've used them in past roles."
    },
    {
        question: "What is your biggest weakness?",
        suggestedAnswer: "A good answer involves self-awareness, acknowledging a real weakness, and describing concrete steps they are taking to improve."
    },
    {
        question: "Where do you see yourself in 5 years?",
        suggestedAnswer: "Look for answers that show ambition and a desire for growth that aligns with the opportunities the company can offer."
    },
    {
        question: "Why are you interested in this role and our company?",
        suggestedAnswer: "The candidate should demonstrate that they've researched the company and can connect their skills and interests directly to the job description."
    }
];


export const generateQuestions = asyncHandler(async (req, res) => {
    let { 
        description, 
        title, 
        tags, 
        level = 'Intermediate', 
        noOfQuestions = 5, 
        type = 'Behavioral' 
    } = req.body;

    // Zod schema to validate the AI's output. 
    // We ask the AI for an object containing the array, which is a more reliable pattern for generateObject.
    const InterviewQuestionsSchema = z.object({
        questions: z.array(z.object({
            question: z.string().describe("The interview question text."),
            suggestedAnswer: z.string().describe("A brief hint or key points for a good answer.")
        })).min(1).describe(`An array of ${noOfQuestions} questions.`)
    });

    try {
        let prompt;

        // Fallback 1: If title or description are missing, create a generic prompt.
        if (!title || !description) {
            prompt = `
                Please generate a list of ${noOfQuestions} generic, universally applicable ${type} interview questions.
                These questions should be suitable for a candidate at the ${level} experience level.
                For each question, provide the question text and a brief suggested answer or key points to look for.
                Format the output as a JSON object with a single key "questions" which is an array of objects, where each object has "question" and "suggestedAnswer" keys.
            `;
        } else {
            // The detailed prompt when we have enough information
            prompt = `
                Based on the following job details, please generate a list of interview questions.
                Job Title: "${title}"
                Job Description: "${description}"
                Key Skills (Tags): "${tags?.join(", ")}"
                Experience Level: "${level}"
                Type of Questions: "${type}"
                
                Generate exactly ${noOfQuestions} questions. For each question, provide the question text and a brief suggested answer.
                Format the output as a JSON object with a single key "questions" which is an array of objects, where each object has "question" and "suggestedAnswer" keys.
            `;
        }
        
        const { object } = await generateObject({
            model: google('models/gemini-1.5-flash-latest'),
            schema: InterviewQuestionsSchema,
            prompt: prompt,
        });

        // The final output is the validated array of questions
        return res.status(200).json(
            new ApiResponse(
                200, 
                object.questions, 
                "Interview questions generated successfully"
            )
        );

    } catch (error) {
        // Fallback 2: If the AI service fails, return the pre-written generic questions.
        console.error("AI service failed to generate questions:", error);
        
        const questionsToReturn = fallbackQuestions.slice(0, noOfQuestions);

        return res.status(200).json(
            new ApiResponse(
                200,
                questionsToReturn,
                "AI service is currently unavailable. Providing generic fallback questions."
            )
        );
    }
});