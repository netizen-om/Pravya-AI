import { Queue } from "bullmq";
import { redis } from "./redis";

export const resumeProcessingQueue = new Queue("resume-processing", {
  connection: redis,
});

export const resumeAnalyseQueue = new Queue("resume-analyse", {
  connection: redis,
});

export const interviewAnalyseQueue = new Queue("interview-analyse", {
  connection: redis,
});
