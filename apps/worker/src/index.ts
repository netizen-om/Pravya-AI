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

import resumeRouter from "./routes/resume.routes"

app.use("/api/v1/resume", resumeRouter)

app.listen(PORT, () => {
  console.log(`✨ Server is running on http://localhost:${PORT}`);
});
