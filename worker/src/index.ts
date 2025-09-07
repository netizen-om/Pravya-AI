// src/index.ts
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { embedding } from "./lib/embedding";
import { qdrantClient } from "./lib/qdrant";
import { google } from "./lib/googleForAISDK";
import { prisma } from "./lib/prisma";
import { generateText } from "ai";
import { openrouter } from "./lib/openRouter";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const PORT = 8000;

type AnalysisJson = {
  grammarErrors?: { error: string; suggestion: string }[];
  spellingErrors?: { word: string; suggestion: string }[];
  formattingIssues?: { issue: string; suggestion?: string }[];
  missingKeywords?: string[];
  summary?: string;
};

app.post("/chat/:resumeId", async (req, res) => {
  const { resumeId } = req.params;
  const { question } = req.body;
  const { model = "gpt-oss-20b" } = req.body;

  if (!resumeId || !question) {
    return res
      .status(400)
      .json({ error: "resumeId and question are required." });
  }

  try {
    const queryEmbedding = await embedding.embedQuery(question);

    const searchResult = await qdrantClient.search("pravya-resume", {
      vector: queryEmbedding,
      limit: 5,
      filter: {
        must: [
          {
            key: "metadata.resumeId",
            match: { value: resumeId },
          },
        ],
      },
      with_payload: true,
    });

    const analysisRecord = await prisma.resumeAnalysis.findUnique({
      where: { resumeId: resumeId },
      select: { analysis: true },
    });

    if (
      !analysisRecord ||
      typeof analysisRecord.analysis !== "object" ||
      analysisRecord.analysis === null
    ) {
      return res.status(500).json({ message: "analysis Record not found" });
    }
    const fullAnalysis = analysisRecord!.analysis as AnalysisJson;
    
    // return { analysisContext: fullAnalysis };

    const prompt = `You are a helpful and encouraging resume assistant. Answer the user's question based on the provided context.
    
    If the question is about resume improvements, errors, or formatting, primarily use the "Resume Analysis Data".
    If the question is about skills, experience, or career advice, primarily use the "Relevant Resume Excerpts".
    And you are open to give your suggestions even if reference is not available in context.
    
    ## Resume Analysis Data:
    ${JSON.stringify(fullAnalysis, null, 2)}
    
    ## Relevant Resume Excerpts:
    ${JSON.stringify(searchResult, null, 2)}
    
    Answer:`;
    // const generation = await model.invoke(prompt);
    // return { generation: generation.content.toString() };

    let resText;

    if(model === "Gemini-2.5-flash") {
      const { text } = await generateText({
        model: google('gemini-2.5-flash'),
        system: prompt,
        prompt: question,
      });
      resText = text
    } else if (model === "gpt-oss-20b"){
      const { text } = await generateText({
        model: openrouter.chat("openai/gpt-oss-20b:free"),
        system: prompt,
        prompt: question,
      });
      resText = text;
    }

    res.status(200).json({ answer: resText });

  } catch (error) {
    console.error("Error during chat processing:", error);
    res.status(500).json({ error: "An internal error occurred." });
  }
});

app.listen(PORT, () => {
  console.log(`✨ Server is running on http://localhost:${PORT}`);
});
