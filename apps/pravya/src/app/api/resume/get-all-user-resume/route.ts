import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await prisma.resume.findMany({
        where : {
            userId : session.user.id,
            isDeleted : false
        }
    })

    return NextResponse.json({ success: true, resume : res });
}

