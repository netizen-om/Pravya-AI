import { Router } from "express";
import { generateAiAnswer, generateQuestions } from "../controller/interview.controller";

const router = Router()

router.route("/questions/generate").post(generateQuestions)
router.route("/questions/get-ai-answer").post(generateAiAnswer)

export default router