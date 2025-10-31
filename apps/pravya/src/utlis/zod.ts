import { z } from "zod";

export const signupSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

export const signinSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const profileImageSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "File size must be less than 5MB"
    )
    .refine(
      (file) => ["image/jpeg", "image/png"].includes(file.type),
      "Only JPG, and PNG files are allowed"
    ),
});

export const usernameSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
});

export const bioSchema = z.object({
  bio: z.string().max(500, "Bio must be less than 500 characters"),
});

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const forgetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });


const metricSchema = z.object({
  score: z
    .number()
    .min(0)
    .max(10)
    .describe("A quantitative score from 0-10 for this specific metric (0=Poor, 10=Excellent)."),
  comment: z.string().describe("Detailed qualitative feedback explaining the score."),
})

const questionBreakdownSchema = z.object({
  questionId: z.string().describe("The unique identifier for the question being analyzed."),
  questionText: z.string().describe("The full text of the question that was asked."),
  userAnswerTranscript: z.string().describe("The full transcribed text of the user's answer to this question."),
  specificFeedback: z.object({
    relevance: metricSchema.describe("How well the answer directly addressed the question that was asked."),
    clarity: metricSchema.describe("How clear, articulate, and easy to understand the answer was."),
    depthAndExamples: metricSchema.describe(
      "The level of detail, use of concrete examples, and demonstration of expertise.",
    ),
    structure: metricSchema.describe("Analysis of the answer's structure (e.g., use of STAR method, logical flow)."),
  }),
  positivePoints: z.string().describe("Specific praise for what the candidate did well in *this* particular answer."),
  suggestedImprovement: z
    .string()
    .describe("A concrete, actionable suggestion for how to improve *this* specific answer."),
  modelAnswerExample: z
    .string()
    .optional()
    .describe("An ideal, concise model answer for this question, which the user can use as a learning example."),
})

export const detailedInterviewFeedbackSchema = z.object({
  overallPerformance: z.object({
    overallScore: z
      .number()
      .min(0)
      .max(100)
      .describe("A holistic score from 0-100 for the entire interview performance."),
    summary: z
      .string()
      .describe("A 2-3 sentence executive summary of the candidate's performance, highlighting the main takeaway."),
    keyStrengths: z
      .array(z.string())
      .min(3)
      .describe("A bulleted list of the top 3-5 key strengths the candidate demonstrated."),
    keyAreasForImprovement: z
      .array(z.string())
      .min(3)
      .describe("A bulleted list of the 3-5 most critical areas for the candidate to focus on for improvement."),
  }),
  dashboardMetrics: z.object({
    communication: metricSchema.describe(
      "Overall score for general communication skills, synthesizing clarity, articulation, pace, and tone.",
    ),
    technicalCommunication: metricSchema.describe(
      "Overall score for the ability to explain complex technical concepts clearly and concisely.",
    ),
    hardSkills: metricSchema.describe(
      "Overall score for role-specific hard skills and technical knowledge demonstrated.",
    ),
    problemSolving: metricSchema.describe(
      "Overall score for analytical skills, logical reasoning, and structuring solutions.",
    ),
    softSkills: metricSchema.describe(
      "Overall score for behavioral competencies like teamwork, leadership, and adaptability.",
    ),
    confidence: metricSchema.describe("Overall score for perceived confidence, poise, and self-assurance."),
  }),
  communicationAndDelivery: z.object({
    pace: z.object({
      rating: z
        .enum(["Too Slow", "Just Right", "Too Fast"])
        .describe("A qualitative rating of the candidate's speaking pace."),
      comment: z.string().describe("Specific feedback on their speaking pace and its impact on the listener."),
    }),
    fillerWords: z.object({
      frequency: z
        .enum(["Low", "Medium", "High"])
        .describe('The overall frequency of filler words (e.g., "um", "ah").'),
      commonFillers: z
        .array(z.string())
        .describe("A list of the most common filler words the user relied on, if any (e.g., ['like', 'so'])."),
      comment: z.string().describe("How the use of filler words impacted their perceived confidence and clarity."),
    }),
    toneAndConfidence: z.object({
      score: z
        .number()
        .min(0)
        .max(10)
        .describe(
          "A 0-10 score for perceived confidence, enthusiasm, and professionalism. This feeds into the main dashboard confidence score.",
        ),
      comment: z
        .string()
        .describe(
          "Analysis of their tone (e.g., enthusiastic, monotone, nervous, professional) and how confidently they came across.",
        ),
    }),
    clarityAndArticulation: metricSchema.describe(
      "Feedback on enunciation, volume, and how easy they were to understand. This feeds into the main dashboard communication score.",
    ),
  }),
  questionBreakdown: z
    .array(questionBreakdownSchema)
    .describe("A detailed, itemized analysis of the user's performance on each individual question."),
  roleSpecificFit: z.object({
    technicalCompetency: z
      .string()
      .describe(
        "Analysis of how well the user demonstrated the required *technical skills* for the specified role and level. This provides the qualitative backing for the dashboard's 'hardSkills' and 'technicalCommunication' scores.",
      ),
    behavioralCompetency: z
      .string()
      .describe(
        "Analysis of how well the user demonstrated the required *soft skills* (e.g., leadership, teamwork, problem-solving). This provides the qualitative backing for the dashboard's 'softSkills' and 'problemSolving' scores.",
      ),
    overallFitMessage: z
      .string()
      .describe(
        "A final summary of the candidate's suitability for this specific role and level, based on their performance.",
      ),
  }),
})

export type DetailedInterviewFeedback = z.infer<typeof detailedInterviewFeedbackSchema>