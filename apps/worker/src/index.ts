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
    origin: "*",
    credentials: true,
  })
);

const PORT = 8000;

// Routes
import resumeRouter from "./routes/resume.routes";
import interviewRouter from "./routes/interview.routes";
import { resumeParser } from "./utils/parseResume";
import { resumeAnalysis } from "./utils/analyseResume";
import { analyseInterview } from "./utils/analyseInterview";
// import { redis } from "./lib/redis";

app.use("/api/v1/resume", resumeRouter);
app.use("/api/v1/interview", interviewRouter);

const connection = {
  url: process.env.REDIS_URL!,
  skipVersionCheck : true
};

const ParseingWorker = new Worker("resume-processing", resumeParser, {
  connection : {
    url : process.env.REDIS_URL!,
    skipVersionCheck : true
  },
  concurrency : 1,
});

const resumeAnalysingWorker = new Worker("resume-analyse", resumeAnalysis, {
  concurrency: 2,
  connection
});

const interviewAnalysingWorker = new Worker("interview-analyse", analyseInterview, {
  concurrency: 2,
  connection
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
