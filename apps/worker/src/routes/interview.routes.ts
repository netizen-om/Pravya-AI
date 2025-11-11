import { Router } from "express";
import { generateAiAnswer, generatePersonalisedQuestions, generateQuestions } from "../controller/interview.controller";

const router = Router()

router.route("/questions/generate").post(generateQuestions)
router.route("/questions/get-ai-answer").post(generateAiAnswer)
router.route("/questions/generate-personalised-questions").post(generatePersonalisedQuestions)

export default router