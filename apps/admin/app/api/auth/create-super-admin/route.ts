import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/db";
import bcrypt from "bcryptjs";
import { getCurrentAdmin } from "@/lib/auth";
import { z } from "zod";

const createSuperAdminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = createSuperAdminSchema.parse(body);

    // Check if any SUPER_ADMIN already exists
    const existingSuperAdmin = await prisma.admin.findFirst({
      where: { role: "SUPER_ADMIN" },
    });

    // If SUPER_ADMIN exists, require authentication
    if (existingSuperAdmin) {
      const currentAdmin = await getCurrentAdmin();

      if (!currentAdmin) {
        return NextResponse.json(
          { error: "Unauthorized: Authentication required to create additional SUPER_ADMIN" },
          { status: 401 }
        );
      }

      if (currentAdmin.role !== "SUPER_ADMIN") {
        return NextResponse.json(
          { error: "Forbidden: Only SUPER_ADMIN can create additional SUPER_ADMIN accounts" },
          { status: 403 }
        );
      }
    }

    // Check if email already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: validatedData.email },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create SUPER_ADMIN
    const newAdmin = await prisma.admin.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: "SUPER_ADMIN",
        expiresAt: null, // SUPER_ADMIN accounts don't expire
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: existingSuperAdmin 
          ? "SUPER_ADMIN created successfully" 
          : "Initial SUPER_ADMIN created successfully",
        admin: newAdmin,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Create SUPER_ADMIN error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

