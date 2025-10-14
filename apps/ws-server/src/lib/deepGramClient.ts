import { createClient } from "@deepgram/sdk";
import dotenv from "dotenv";
dotenv.config();

export const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY!);