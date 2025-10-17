import dotenv from "dotenv";
dotenv.config();

import { Worker, Job } from "bullmq";
import fetch from "node-fetch";
import { z } from "zod";
import pdfParse from "pdf-parse";
import { generateObject } from "ai";
import { prisma } from "../lib/prisma";
import { google } from "../lib/googleForAISDK";
import { AnalysisSchema } from "../lib/zod"
import { publishResumeUpdate } from "../lib/redis";

// ----- Job Data Interface -----
interface ResumeAnalyseJobData {
  fileUrl: string;
  userId: string;
  resumeId: string;
}

// ----- Inferred type -----
type ResumeAnalysisType = z.infer<typeof AnalysisSchema>;

// ----- Worker -----
export const resumeAnalysis = async (job: Job<ResumeAnalyseJobData>) => {
    const { fileUrl, resumeId } = job.data;
    
    try {
      console.log("Job Data: ", job.data);

      // Update AnalysisStatus to analyzing
      await prisma.resume.update({
        where: { id: resumeId },
        data: { AnalysisStatus: "analyzing" }
      });

      // Publish status update
      await publishResumeUpdate(resumeId, { AnalysisStatus: "analyzing" });

      // 1) Download PDF
      console.log("Downloading from Cloudinary:", fileUrl);
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();

      // 2) Extract text
      const buffer = Buffer.from(arrayBuffer);
      const pdfData = await pdfParse(buffer);
      const resumeText = pdfData.text.trim();

      if (!resumeText || resumeText.length < 50) {
        throw new Error("Resume text is too short or unreadable");
      }

      // 3) Call Gemini 2.5 Flash for structured analysis
      const { object } = await generateObject({
        model: google("gemini-2.5-flash"),
        schema: AnalysisSchema as any,
        messages: [
          {
            role: "system",
            content:
              "You are a resume analysis assistant. Return only JSON matching the schema. Be precise, concise, and actionable.",
          },
          {
            role: "user",
            content: `Analyze the following resume for grammar, spelling, formatting, impact words, and ATS keyword match:\n${resumeText}`,
          },
        ],
      });

      // 4) Parse again to be 100% type-safe at runtime
      const validatedAnalysis: ResumeAnalysisType =
        AnalysisSchema.parse(object);

      // 5) Save to Postgres (upsert)
      await prisma.resumeAnalysis.upsert({
        where: { resumeId },
        create: {
          resumeId,
          atsScore: validatedAnalysis.atsScore ?? null,
          analysis: validatedAnalysis,
        },
        update: {
          atsScore: validatedAnalysis.atsScore ?? null,
          analysis: validatedAnalysis,
          updatedAt: new Date(),
        },
      });

      console.log(`Analysis saved for resume ${resumeId}`);

      // Update AnalysisStatus to completed
      await prisma.resume.update({
        where: { id: resumeId },
        data: { AnalysisStatus: "completed" }
      });

      // Publish status update
      await publishResumeUpdate(resumeId, { AnalysisStatus: "completed" });

    } catch (error) {
      console.error("ERROR:", error);
      
      // Update AnalysisStatus to error if analysis fails
      await prisma.resume.update({
        where: { id: resumeId },
        data: { AnalysisStatus: "error" }
      });

      // Publish error status
      await publishResumeUpdate(resumeId, { AnalysisStatus: "error" });
      
      throw error;
    }
  }
