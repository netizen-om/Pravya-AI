import { Router } from "express";
import { handleChat } from "../controller/resume.controller";


const router = Router()

router.route("/chat/:resumeId").post(handleChat)


export default router