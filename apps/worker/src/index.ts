// src/index.ts
import dotenv from "dotenv";
dotenv.config();

import { Worker } from "bullmq";
import express from "express";
import cors from "cors";

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

// Routes
import resumeRouter from "./routes/resume.routes";
import { resumeParser } from "./utils/parseResume";
import { resumeAnalysis } from "./utils/analyseResume";

app.use("/api/v1/resume", resumeRouter);

const ParseingWorker = new Worker("resume-processing", resumeParser, {
  concurrency: 100,
  connection: {
    host: "localhost",
    port: 6379,
  },
});

const AnalysingWorker = new Worker("resume-analyse", resumeAnalysis, {
  concurrency: 5,
  connection: {
    host: "localhost",
    port: 6379,
  },
});

app.listen(PORT, () => {
  console.log(`✨ Server is running on http://localhost:${PORT}`);
});
