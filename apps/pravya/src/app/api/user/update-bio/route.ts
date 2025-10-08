import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { newBio } = await req.json();

    if (typeof newBio !== "string") {
      return NextResponse.json(
        { error: "Invalid bio format. A string is required." },
        { status: 400 } 
      );
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        bio: newBio,
      },
    });

    return NextResponse.json(
      { message: "Bio updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating Bio : ", error);
    return NextResponse.json(
      { error: "Error updating Bio" },
      { status: 500 }
    );
  }
}
