// app/api/user/update-username/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // make sure this points to your auth config
import { prisma } from "@/lib/prismadb";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { username } = body;

  if (!username || typeof username !== "string") {
    return NextResponse.json({ error: "Invalid username" }, { status: 400 });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { name: username }, // This is correct - the database field is 'name'
    });

    return NextResponse.json({
      message: "Username updated successfully",
      user: updatedUser,
    }, {status : 200});
  } catch (error) {
    console.error("Error updating username:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}