import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

enum AdminRoleType {
  SUPER_ADMIN = "SUPER_ADMIN",
  MANAGER = "MANAGER",
  SUPPORT = "SUPPORT",
}

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/sign-in", "/api/auth/login", "/api/auth/create-super-admin"];

// Routes that require SUPER_ADMIN role
const SUPER_ADMIN_ROUTES = ["/admin/admins"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes (check exact matches first, then startsWith)
  const isPublicRoute = PUBLIC_ROUTES.some((route) => {
    if (pathname === route) return true;
    if (pathname.startsWith(route)) return true;
    return false;
  });

  if (isPublicRoute) {
    // If accessing sign-in and already authenticated, redirect to admin
    const token = request.cookies.get("admin_token")?.value;
    if (token && pathname === "/sign-in") {
      const payload = await verifyToken(token);
      if (payload) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    return NextResponse.next();
  }

  // Get token from cookie
  const token = request.cookies.get("admin_token")?.value;

  // If no token and trying to access protected route, redirect to sign-in
  if (!token) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin") || pathname === "/") {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.next();
  }

  // Verify token
  const payload = await verifyToken(token);
  
  if (!payload) {
    // Invalid token, clear cookie and redirect
    const response = NextResponse.redirect(new URL("/sign-in", request.url));
    response.cookies.set("admin_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
    return response;
  }

  // Check if route requires SUPER_ADMIN
  if (SUPER_ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (payload.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: SUPER_ADMIN access required" },
        { status: 403 }
      );
    }
  }

  // Check API routes that require SUPER_ADMIN
  if (pathname.startsWith("/api/admin/create") || pathname.startsWith("/api/admin/list")) {
    if (payload.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: SUPER_ADMIN access required" },
        { status: 403 }
      );
    }
  }

  // Allow authenticated users to access protected routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

