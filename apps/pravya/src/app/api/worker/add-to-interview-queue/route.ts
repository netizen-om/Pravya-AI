import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";
import { interviewAnalyseQueue } from "@/lib/queues";

export async function GET(req: Request) {
  try {
    await interviewAnalyseQueue.add("interview-analyse", {
      interviewId: "cmi4m3col0001wfhsgjtbb9z6",
    });

    
    return NextResponse.json({ userResponse : "Done" }, { status: 200 });
  } catch (error) {
    console.log("Erroe getting user data : ", error);
    return NextResponse.json(
      { error: "Error getting user details" },
      { status: 500 }
    );
  }
}
