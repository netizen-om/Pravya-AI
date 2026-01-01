import "server-only";

import { prisma } from "@repo/db";
import { cookies } from "next/headers";
import { AdminRoleType, verifyToken } from "./auth";

export async function getCurrentAdmin(): Promise<{
  id: string;
  email: string;
  name: string;
  role: AdminRoleType;
  expiresAt: Date | null;
} | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return null;
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return null;
    }

    // Check if admin exists and account hasn't expired
    const admin = await prisma.admin.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        expiresAt: true,
      },
    });

    if (!admin) {
      return null;
    }

    // Check if account has expired (for temporary admins)
    if (admin.expiresAt && admin.expiresAt < new Date()) {
      return null;
    }

    // Verify role matches token (compare as strings to handle enum properly)
    const adminRole = String(admin.role);
    const payloadRole = String(payload.role);
    
    if (adminRole !== payloadRole) {
      console.error("Role mismatch:", { adminRole, payloadRole });
      return null;
    }

    return {
      ...admin,
      role: adminRole as AdminRoleType,
    };
  } catch (error) {
    console.error("Error getting current admin:", error);
    return null;
  }
}

