import { Router } from "express";
import { generateQuestions } from "../controller/interview.controller";

const router = Router()

router.route("/questions/generate").post(generateQuestions)

export default router