import { NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { getCurrentAdmin } from "@/lib/auth";

enum AdminRoleType {
  SUPER_ADMIN = "SUPER_ADMIN",
  MANAGER = "MANAGER",
  SUPPORT = "SUPPORT",
}

export async function GET() {
  try {
    // Check if user is authenticated and is SUPER_ADMIN
    const currentAdmin = await getCurrentAdmin();

    if (!currentAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (currentAdmin.role !== AdminRoleType.SUPER_ADMIN) {
      return NextResponse.json(
        { error: "Forbidden: Only SUPER_ADMIN can view admins" },
        { status: 403 }
      );
    }

    // Get all admins (excluding passwords)
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ admins }, { status: 200 });
  } catch (error) {
    console.error("List admins error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

