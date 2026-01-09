import { asyncHandler } from "../utils/asyncHandler";
import { embedding } from "../lib/embedding";
import { qdrantClient } from "../lib/qdrant";
import { google } from "../lib/googleForAISDK";
import { prisma } from "../lib/prisma";
import { streamText } from "ai";
import { openrouter } from "../lib/openRouter";
import { groqClient } from "../lib/groqForrAISDK";


export const handleChat = asyncHandler(async (req, res) => {
  const { resumeId } = req.params;
  const { question, model = "llama-3.1-8b-instant" } = req.body;

  if (!resumeId || !question) {
    return res
      .status(400)
      .json({ error: "resumeId and question are required." });
  }

  // 🔴 Abort controller for STOP support
  const abortController = new AbortController();

  // Fired when frontend aborts fetch / tab closes
  res.on("close", () => {
    if (!res.writableEnded) {
      abortController.abort();
    }
  });

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
      where: { resumeId },
      select: { analysis: true },
    });

    if (
      !analysisRecord ||
      typeof analysisRecord.analysis !== "object" ||
      analysisRecord.analysis === null
    ) {
      return res.status(500).json({ message: "analysis Record not found" });
    }

    const fullAnalysis = analysisRecord.analysis;

    const prompt = `You are a helpful and encouraging resume assistant. Answer the user's question based on the provided context.
    
If the question is about resume improvements, errors, or formatting, primarily use the "Resume Analysis Data".
If the question is about skills, experience, or career advice, primarily use the "Relevant Resume Excerpts".
You are allowed to give suggestions even if reference is not available.

## Resume Analysis Data:
${JSON.stringify(fullAnalysis, null, 2)}

## Relevant Resume Excerpts:
${JSON.stringify(searchResult, null, 2)}

Answer:
`;

    // ✅ Model resolver (clean + scalable)
    const modelResolver = {
      // "gemini-2.5-flash": google("gemini-2.5-flash"),
      "gemini-2.5-flash": groqClient("llama-3.1-8b-instant"),
      "llama-3.1-8b-instant": groqClient("llama-3.1-8b-instant"),
      "gpt-oss-20b": openrouter.chat("openai/gpt-oss-20b:free"),
      "x-ai/grok-4.1-fast": openrouter.chat("x-ai/grok-4.1-fast:free"),
      "nvidia/nemotron-nano-12b-v2-vl": openrouter.chat(
        "nvidia/nemotron-nano-12b-v2-vl:free"
      ),
      "mistralai/mistral-small-3.1-24b-instruct": openrouter.chat(
        "mistralai/mistral-small-3.1-24b-instruct:free"
      ),
      "deepseek-r1t": openrouter.chat("tngtech/deepseek-r1t-chimera:free"),
    } as const;

    const selectedModel =
      modelResolver[model as keyof typeof modelResolver] ??
      modelResolver["gemini-2.5-flash"];

    // ✅ STREAM + STOP SUPPORT
    console.log(abortController.signal);

    const result = await streamText({
      model: selectedModel,
      system: prompt,
      prompt: question,
      abortSignal: abortController.signal,
    });

    let resText = "";

    try {
      resText = await result.text;
    } catch (err: any) {
      // ✅ User stopped generation before output
      if (err?.name === "AI_NoOutputGeneratedError") {
        console.log("⚠️ Generation stopped before output");
        return res.status(200).json({ answer: "" });
      }

      throw err;
    }

    console.log("resText : ", resText);

    res.status(200).json({ answer: resText });
  } catch (error) {
    console.error("Error during chat processing:", error);
    res.status(500).json({ error: "An internal error occurred." });
  }
});
