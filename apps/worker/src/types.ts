import { z } from "zod";
import { AnalysisSchema, detailedInterviewFeedbackSchema } from "./lib/zod";

export type AnalysisJson = {
  grammarErrors?: { error: string; suggestion: string }[];
  spellingErrors?: { word: string; suggestion: string }[];
  formattingIssues?: { issue: string; suggestion?: string }[];
  missingKeywords?: string[];
  summary?: string;
};
export interface ResumeAnalyseJobData {
  fileUrl: string;
  userId: string;
  resumeId: string;
}

export interface InterviewAnalyseJobData {
  interviewId: string;
}

// ----- Inferred type -----
export type ResumeAnalysisType = z.infer<typeof AnalysisSchema>;
export type DetailedInterviewFeedback = z.infer<
  typeof detailedInterviewFeedbackSchema
>;
