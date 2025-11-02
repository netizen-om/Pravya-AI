import { Job } from "bullmq";
import { InterviewAnalyseJobData } from "../types";
import { prisma } from "@repo/db";

export const analyseInterview = async(job: Job<InterviewAnalyseJobData>) => {
    const { interviewId } = job.data;

    const interview = await prisma.interview.findUnique({
        where :{ 
            interviewId
        }
    })

    console.log("Interview : ", interview);

    console.log("Transcribe : ", interview?.transcribe);
    
    
}