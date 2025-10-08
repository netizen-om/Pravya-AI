
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