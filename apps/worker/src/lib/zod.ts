
import { z } from "zod";

export const AnalysisSchema = z.object({
  // --- Extracted Resume Content ---
  contactInfo: z.object({
    name: z.string().optional().describe("Full name of the candidate"),
    
    email: z.string().optional().describe("Primary email address"),
    phone: z.string().optional().describe("Contact phone number"),
    location: z.string().optional().describe("City, State, Country"),
    links: z.array(z.object({
      label: z.string().optional().describe("The name of the site (e.g., GitHub, LinkedIn, Portfolio)"),
      
      url: z.string().describe("The direct URL"),
    })).default([]).describe("Array of personal or professional links"),
  }).optional(),

  professionalSummary: z.string().optional().describe("The professional summary or objective statement from the resume"),
  
  workExperience: z.array(z.object({
    role: z.string().describe("Job title or position"),
    company: z.string().describe("Name of the company"),
    location: z.string().optional().describe("Location of the company"),
    startDate: z.string().describe("Start date (e.g., 'Month YYYY')"),
    endDate: z.string().describe("End date (e.g., 'Month YYYY' or 'Present')"),
    description: z.array(z.string()).describe("List of responsibilities, achievements, or bullet points"),
  })).default([]),

  education: z.array(z.object({
    institution: z.string().describe("Name of the university or school"),
    degree: z.string().describe("Degree obtained (e.g., Bachelor of Science)"),
    fieldOfStudy: z.string().optional().describe("Major or field of study"),
    graduationDate: z.string().optional().describe("Graduation date (e.g., 'Month YYYY')"),
    gpa: z.string().optional().describe("GPA, if mentioned"),
  })).default([]),

  projects: z.array(z.object({
    name: z.string().describe("Name of the project"),
    description: z.string().describe("A brief description of the project"),
    technologies: z.array(z.string()).default([]).describe("List of technologies or skills used"),
    
    link: z.string().optional().describe("A direct URL to the project (e.g., GitHub, live demo)"),
  })).default([]),

  skills: z.object({
    languages: z.array(z.string()).default([]).describe("Programming languages"),
    frameworksAndLibraries: z.array(z.string()).default([]).describe("Frameworks and libraries (e.g., React, Node.js)"),
    databases: z.array(z.string()).default([]).describe("Databases (e.g., PostgreSQL, MongoDB)"),
    toolsAndPlatforms: z.array(z.string()).default([]).describe("Other tools (e.g., Docker, AWS, Git)"),
  }).optional(),

  certifications: z.array(z.string()).default([]).describe("List of certifications"),
  
  // --- AI-Powered Analysis ---
  atsScore: z.number().min(0).max(100).optional().describe("An estimated ATS-friendliness score from 0 to 100"),
  summary: z.string().optional().describe("A concise AI-generated summary of the candidate's profile"),
  
  grammarErrors: z.array(z.object({
    error: z.string(),
    suggestion: z.string(),
  })).default([]),
  
  spellingErrors: z.array(z.object({
    word: z.string(),
    suggestion: z.string(),
  })).default([]),
  
  formattingIssues: z.array(z.object({
    issue: z.string(),
    suggestion: z.string().optional(),
  })).default([]),
  
  impactWords: z.array(z.string()).default([]).describe("List of strong action verbs or impact words found"),
  missingKeywords: z.array(z.string()).default([]).describe("Relevant keywords that could be added"),
  matchingKeywords: z.array(z.string()).default([]).describe("Keywords found that match common job descriptions for the role"),
});


// This schema defines the structure for a single metric (score + comment)
const metricSchema = z.object({
  score: z
    .number()
    .min(0)
    .max(10)
    .describe(
      'A quantitative score from 0-10 for this specific metric (0=Poor, 10=Excellent).'
    ),
  comment: z
    .string()
    .describe('Detailed qualitative feedback explaining the score.'),
});

// Schema for the detailed question-by-question analysis
const questionBreakdownSchema = z.object({
  questionId: z
    .string()
    .describe('The unique identifier for the question being analyzed.'),
  questionText: z
    .string()
    .describe('The full text of the question that was asked.'),
  userAnswerTranscript: z
    .string()
    .describe("The full transcribed text of the user's answer to this question."),
  specificFeedback: z.object({
    relevance: metricSchema.describe(
      'How well the answer directly addressed the question that was asked.'
    ),
    clarity: metricSchema.describe(
      'How clear, articulate, and easy to understand the answer was.'
    ),
    depthAndExamples: metricSchema.describe(
      'The level of detail, use of concrete examples, and demonstration of expertise.'
    ),
    structure: metricSchema.describe(
      "Analysis of the answer's structure (e.g., use of STAR method, logical flow)."
    ),
  }),
  positivePoints: z
    .string()
    .describe(
      'Specific praise for what the candidate did well in *this* particular answer.'
    ),
  suggestedImprovement: z
    .string()
    .describe(
      'A concrete, actionable suggestion for how to improve *this* specific answer.'
    ),
  modelAnswerExample: z
    .string()
    .optional()
    .describe(
      'An ideal, concise model answer for this question, which the user can use as a learning example.'
    ),
});

// The main, top-level schema for the entire interview feedback
export const detailedInterviewFeedbackSchema = z.object({
  overallPerformance: z.object({
    overallScore: z
      .number()
      .min(0)
      .max(100)
      .describe(
        'A holistic score from 0-100 for the entire interview performance.'
      ),
    summary: z
      .string()
      .describe(
        "A 2-3 sentence executive summary of the candidate's performance, highlighting the main takeaway."
      ),
    keyStrengths: z
      .array(z.string())
      .min(3)
      .describe(
        'A bulleted list of the top 3-5 key strengths the candidate demonstrated.'
      ),
    keyAreasForImprovement: z
      .array(z.string())
      .min(3)
      .describe(
        'A bulleted list of the 3-5 most critical areas for the candidate to focus on for improvement.'
      ),
  }),
  // UPDATED: High-level metrics for dashboard display
  dashboardMetrics: z.object({
    communication: metricSchema.describe(
      'Overall score for general communication skills, synthesizing clarity, articulation, pace, and tone.'
    ),
    technicalCommunication: metricSchema.describe(
      'NEW: Overall score for the ability to explain complex technical concepts clearly and concisely.'
    ),
    hardSkills: metricSchema.describe(
      'Overall score for role-specific hard skills and technical knowledge demonstrated.'
    ),
    problemSolving: metricSchema.describe(
      'Overall score for analytical skills, logical reasoning, and structuring solutions.'
    ),
    softSkills: metricSchema.describe(
      'Overall score for behavioral competencies like teamwork, leadership, and adaptability.'
    ),
    confidence: metricSchema.describe(
      'Overall score for perceived confidence, poise, and self-assurance.'
    ),
  }),
  communicationAndDelivery: z.object({
    pace: z.object({
      rating: z
        .enum(['Too Slow', 'Just Right', 'Too Fast'])
        .describe("A qualitative rating of the candidate's speaking pace."),
      comment: z
        .string()
        .describe(
          'Specific feedback on their speaking pace and its impact on the listener.'
        ),
    }),
    fillerWords: z.object({
      frequency: z
        .enum(['Low', 'Medium', 'High'])
        .describe('The overall frequency of filler words (e.g., "um", "ah").'),
      commonFillers: z
        .array(z.string())
        .describe(
          "A list of the most common filler words the user relied on, if any (e.g., ['like', 'so'])."
        ),
      comment: z
        .string()
        .describe(
          'How the use of filler words impacted their perceived confidence and clarity.'
        ),
    }),
    toneAndConfidence: z.object({
      score: z
        .number()
        .min(0)
        .max(10)
        .describe(
          'A 0-10 score for perceived confidence, enthusiasm, and professionalism. This feeds into the main dashboard confidence score.'
        ),
      comment: z
        .string()
        .describe(
          'Analysis of their tone (e.g., enthusiastic, monotone, nervous, professional) and how confidently they came across.'
        ),
    }),
    clarityAndArticulation: metricSchema.describe(
      'Feedback on enunciation, volume, and how easy they were to understand. This feeds into the main dashboard communication score.'
    ),
  }),
  questionBreakdown: z
    .array(questionBreakdownSchema)
    .describe(
      "A detailed, itemized analysis of the user's performance on each individual question."
    ),
  roleSpecificFit: z.object({
    technicalCompetency: z
      .string()
      .describe(
        "Analysis of how well the user demonstrated the required *technical skills* for the specified role and level. This provides the qualitative backing for the dashboard's 'hardSkills' and 'technicalCommunication' scores."
      ),
    behavioralCompetency: z
      .string()
      .describe(
        "Analysis of how well the user demonstrated the required *soft skills* (e.g., leadership, teamwork, problem-solving). This provides the qualitative backing for the dashboard's 'softSkills' and 'problemSolving' scores."
      ),
    overallFitMessage: z
      .string()
      .describe(
        "A final summary of the candidate's suitability for this specific role and level, based on their performance."
      ),
  }),
});


