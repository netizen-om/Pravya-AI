import { asyncHandler } from "../utils/asyncHandler";
import { embedding } from "../lib/embedding";
import { qdrantClient } from "../lib/qdrant";
import { google } from "../lib/googleForAISDK";
import { prisma } from "../lib/prisma";
import { generateText } from "ai";
import { openrouter } from "../lib/openRouter";

export const handleChat = asyncHandler(async (req, res) => {
  const { resumeId } = req.params;
  const { question } = req.body;
  const { model = "gemini-2.5-flash" } = req.body;

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

    let resText;

    if (model === "gemini-2.5-flash") {
      console.log("USING 2.5");
      const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        system: prompt,
        prompt: question,
      });
      resText = text;
    } else if (model === "gpt-oss-20b") {
      console.log("USING 20B");
      const { text } = await generateText({
        model: openrouter.chat("openai/gpt-oss-20b:free"),
        system: prompt,
        prompt: question,
      });
      resText = text;
    } else if (model === "x-ai/grok-4.1-fast") {
      console.log("USING Grok 4.1");
      
      const { text } = await generateText({
        model: openrouter.chat("x-ai/grok-4.1-fast:free"),
        system: prompt,
        prompt: question,
      });
      resText = text;
    } else if (model === "nvidia/nemotron-nano-12b-v2-vl") {
      console.log("USING Nvidia");
      const { text } = await generateText({
        model: openrouter.chat("nvidia/nemotron-nano-12b-v2-vl:free"),
        system: prompt,
        prompt: question,
      });
      resText = text;
    } else if (model === "mistralai/mistral-small-3.1-24b-instruct") {
      console.log("USING Mistral");
      const { text } = await generateText({
        model: openrouter.chat("mistralai/mistral-small-3.1-24b-instruct:free"),
        system: prompt,
        prompt: question,
      });
      resText = text;
    } else if (model === "deepseek-r1t") {
      console.log("USING DEEPSEAK r1t");
      const { text } = await generateText({
        model: openrouter.chat("tngtech/deepseek-r1t-chimera:free"),
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
})