import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { oldPassword, newPassword } = await req.json();
  
    const session = await getServerSession(authOptions);
  
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 501 }
      );
    }
  
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!user || !user.password) throw new Error("No user found");
  
    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) {
      return NextResponse.json({ message : "Invalid Password"}, {status : 401});
    }
  
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
  
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        password: newHashedPassword,
      },
    });
  
    return NextResponse.json({ message : "Password reset successful"}, {status : 200});
  } catch (error) {
    return NextResponse.json({ error : "Error resetting Password"}, {status : 500});
    
  }
}
