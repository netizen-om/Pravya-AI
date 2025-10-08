import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { getRandomInterviewCover } from "@/lib/utils";
import { prisma } from "@/lib/prismadb";

export async function   GET() {
    return Response.json(
        {success : true, data : "GGs"},
        { status : 200 }
    )
}

export async function POST(req : Request) {
    const { type, role, level, techstack, amount, userid } = await req.json()

    try {
        const { text: questions } = await generateText({
        model: google("gemini-2.0-flash-001"),
        prompt: `Prepare questions for a job interview.
            The job role is ${role}.
            The job experience level is ${level}.
            The tech stack used in the job is: ${techstack}.
            The focus between behavioural and technical questions should lean towards: ${type}.
            The amount of questions required is: ${amount}.
            Please return only the questions, without any additional text.
            The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
            Return the questions formatted like this:
            ["Question 1", "Question 2", "Question 3"]
            
            Thank you! <3
        `,
    });

    // const interview = {
    //     role, level, type,
    //     techstack : techstack.split(','),
    //     questions : JSON.parse(questions),
    //     userid,
    //     finalized : true,
    //     coverImage : getRandomInterviewCover(),
    //     createdAt : new Date().toISOString()
    // }

    const createdInterview = await prisma.interview.create({
       data: {
            role,
            level,
            type,
            amount,
            techstack,       
            questionArray: JSON.parse(questions),      
            createdAt: new Date(),                 
            userId : userid
        },
    })
    
    return Response.json({ success: true, data: createdInterview }, { status: 201 });

    } catch (error) {
        console.error(error)
        return Response.json({success : false, error}, {status:500});
    }
}