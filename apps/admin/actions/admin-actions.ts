"use server";

import { prisma } from "@repo/db";
import { getCurrentAdmin } from "@/lib/auth";
import { createAdminSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

enum AdminRoleType {
  SUPER_ADMIN = "SUPER_ADMIN",
  MANAGER = "MANAGER",
  SUPPORT = "SUPPORT",
}

export async function getCurrentAdminAction() {
  try {
    const admin = await getCurrentAdmin();
    return { success: true, admin };
  } catch (error) {
    console.error("Get current admin error:", error);
    return { success: false, error: "Failed to get current admin" };
  }
}

export async function createAdminAction(data: {
  name: string;
  email: string;
  password: string;
  role: AdminRoleType;
  expiresAt?: Date | null;
}) {
  try {
    // Check if user is authenticated and is SUPER_ADMIN
    const currentAdmin = await getCurrentAdmin();

    if (!currentAdmin) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    if (currentAdmin.role !== AdminRoleType.SUPER_ADMIN) {
      return {
        success: false,
        error: "Forbidden: Only SUPER_ADMIN can create admins",
      };
    }

    // Validate input
    const validatedData = createAdminSchema.parse(data);

    // Check if email already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: validatedData.email },
    });

    if (existingAdmin) {
      return {
        success: false,
        error: "Admin with this email already exists",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create admin
    const newAdmin = await prisma.admin.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
        expiresAt: validatedData.expiresAt || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        expiresAt: true,
        createdAt: true,
      },
    });

    revalidatePath("/admin/admins");
    return {
      success: true,
      admin: newAdmin,
    };
  } catch (error: any) {
    if (error.name === "ZodError") {
      return {
        success: false,
        error: "Validation error",
        details: error.errors,
      };
    }

    console.error("Create admin error:", error);
    return {
      success: false,
      error: "Failed to create admin",
    };
  }
}

export async function listAdminsAction() {
  try {
    // Check if user is authenticated and is SUPER_ADMIN
    const currentAdmin = await getCurrentAdmin();

    if (!currentAdmin) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    if (currentAdmin.role !== AdminRoleType.SUPER_ADMIN) {
      return {
        success: false,
        error: "Forbidden: Only SUPER_ADMIN can view admins",
      };
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

    return {
      success: true,
      admins,
    };
  } catch (error) {
    console.error("List admins error:", error);
    return {
      success: false,
      error: "Failed to list admins",
    };
  }
}

export async function deleteAdminAction(adminId: string) {
  try {
    // Check if user is authenticated and is SUPER_ADMIN
    const currentAdmin = await getCurrentAdmin();

    if (!currentAdmin) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    if (currentAdmin.role !== AdminRoleType.SUPER_ADMIN) {
      return {
        success: false,
        error: "Forbidden: Only SUPER_ADMIN can delete admins",
      };
    }

    // Prevent self-deletion
    if (currentAdmin.id === adminId) {
      return {
        success: false,
        error: "Cannot delete your own account",
      };
    }

    // Delete admin
    await prisma.admin.delete({
      where: { id: adminId },
    });

    revalidatePath("/admin/admins");
    return {
      success: true,
    };
  } catch (error) {
    console.error("Delete admin error:", error);
    return {
      success: false,
      error: "Failed to delete admin",
    };
  }
}

