import { z } from "zod";

enum AdminRoleType {
  SUPER_ADMIN = "SUPER_ADMIN",
  MANAGER = "MANAGER",
  SUPPORT = "SUPPORT",
}

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const createAdminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.nativeEnum(AdminRoleType),
  expiresAt: z.date().optional().nullable(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateAdminInput = z.infer<typeof createAdminSchema>;

