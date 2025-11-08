import jwt from "jsonwebtoken";
import { prisma } from "@repo/db";
import { cookies } from "next/headers";

enum AdminRoleType {
  SUPER_ADMIN = "SUPER_ADMIN",
  MANAGER = "MANAGER",
  SUPPORT = "SUPPORT",
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

export interface AdminJWTPayload {
  id: string;
  email: string;
  role: AdminRoleType;
}

export function generateToken(payload: AdminJWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string): AdminJWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminJWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

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

    const payload = verifyToken(token);
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

    // Verify role matches token
    if (admin.role !== payload.role) {
      return null;
    }

    return admin;
  } catch (error) {
    console.error("Error getting current admin:", error);
    return null;
  }
}

