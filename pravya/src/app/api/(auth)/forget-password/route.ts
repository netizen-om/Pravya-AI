import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    // const { searchParams } = new URL(req.url);
    // const token = searchParams.get("token");

    const {token, newPassword} = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token missing" }, { status: 400 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: newHashedPassword },
    });
    
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard`);
  } catch (error) {
    console.error("[VERIFY_EMAIL]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
