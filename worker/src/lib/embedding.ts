// import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

// export const embedding = new GoogleGenerativeAIEmbeddings({
//   model: "embedding-001",
//   apiKey: process.env.GOOGLE_API_KEY,
// });

// lib/embeddings.ts
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

export const embedding = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HUGGINGFACE_API_KEY,
  model: "sentence-transformers/all-MiniLM-L6-v2",
});