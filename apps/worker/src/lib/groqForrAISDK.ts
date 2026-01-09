import { createGroq } from "@ai-sdk/groq";

export const groqClient = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});
