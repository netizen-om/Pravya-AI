"use server";

import { prisma } from "@repo/db";
import { getCurrentAdmin } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  isSubscribed: z.boolean().optional().default(false),
});

export async function getUsers() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }

    const users = await prisma.user.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        isSubscribed: true,
        createdAt: true,
        _count: {
          select: {
            interviews: {
              where: { isDeleted: false },
            },
            Resume: {
              where: { isDeleted: false },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name || "N/A",
      email: user.email || "N/A",
      subscription: user.isSubscribed ? "Subscribed" : "Not Subscribed",
      interviews: user._count.interviews,
      resumes: user._count.Resume,
      joined: user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) : "N/A",
    }));

    return { success: true, users: formattedUsers };
  } catch (error) {
    console.error("Get users error:", error);
    return { success: false, error: "Failed to fetch users" };
  }
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  isSubscribed?: boolean;
}) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedData = createUserSchema.parse(data);

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return { success: false, error: "User with this email already exists" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        isSubscribed: validatedData.isSubscribed || false,
        emailVerified: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isSubscribed: true,
        createdAt: true,
      },
    });

    revalidatePath("/admin/users");
    return { success: true, user: newUser };
  } catch (error: any) {
    if (error.name === "ZodError") {
      return { success: false, error: "Validation error", details: error.errors };
    }
    console.error("Create user error:", error);
    return { success: false, error: "Failed to create user" };
  }
}

export async function deleteUser(userId: string) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }

    // Soft delete user
    await prisma.user.update({
      where: { id: userId },
      data: { isDeleted: true },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Delete user error:", error);
    return { success: false, error: "Failed to delete user" };
  }
}

