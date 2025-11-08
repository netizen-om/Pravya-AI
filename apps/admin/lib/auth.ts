import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@repo/db";
import { cookies } from "next/headers";

enum AdminRoleType {
  SUPER_ADMIN = "SUPER_ADMIN",
  MANAGER = "MANAGER",
  SUPPORT = "SUPPORT",
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

// Convert secret to Uint8Array for jose (required for Edge Runtime)
const getSecretKey = () => {
  return new TextEncoder().encode(JWT_SECRET);
};

export interface AdminJWTPayload {
  id: string;
  email: string;
  role: AdminRoleType;
}

export async function generateToken(payload: AdminJWTPayload): Promise<string> {
  // Ensure role is stored as a string in the token
  const secretKey = getSecretKey();
  const token = await new SignJWT({
    id: payload.id,
    email: payload.email,
    role: String(payload.role), // Ensure role is a string
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secretKey);

  return token;
}

export async function verifyToken(token: string): Promise<AdminJWTPayload | null> {
  try {
    const secretKey = getSecretKey();
    const { payload: decoded } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });

    // Ensure role is properly typed
    if (decoded && decoded.id && decoded.email && decoded.role) {
      return {
        id: decoded.id as string,
        email: decoded.email as string,
        role: decoded.role as AdminRoleType,
      };
    }
    return null;
  } catch (error) {
    console.error("Token verification error:", error);
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

