import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { rateLimit } from "./lib/rateLimiter";

// Define public (unprotected) routes
const PUBLIC_ROUTES = ["/", "/auth/sign-in", "/auth/sign-up", "/auth/verify-email", "/auth/forget-password", "/auth/forget-password/email", "/about", "/contact"];
const ONBOARDING_ROUTE = "/auth/onboarding";
const DASHBOARD_ROUTE = "/dashboard"

export default withAuth(
  function middleware(req) {  
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    if (
      token &&
      (pathname === "/auth/sign-in" || pathname === "/auth/sign-up")
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Allow requests to public routes
    if (PUBLIC_ROUTES.includes(pathname)) {
      return NextResponse.next();
    }

    // Block unverified users from all other routes
    if (token && !token.emailVerified) {
      // Allow access to onboarding
      if (pathname === ONBOARDING_ROUTE) {
        return NextResponse.next();
      }

      // Redirect all other routes to onboarding
      return NextResponse.redirect(new URL(ONBOARDING_ROUTE, req.url));
    }

    // If user is verified and visits onboarding, redirect to dashboard
    if (token && token.emailVerified && pathname === ONBOARDING_ROUTE) {
      return NextResponse.redirect(new URL(DASHBOARD_ROUTE, req.url));
    }

    // Allow access to all other routes if authenticated & verified
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const { pathname } = req.nextUrl;

        // Allow access to public routes even if user is not authenticated
        if (PUBLIC_ROUTES.includes(pathname)) {
          return true;
        }

        // Block all other routes unless the user is authenticated
        return !!token;
      },
    },
  }
);

// Specify which routes the middleware applies to
export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|bgImg|.*\\.(?:jpg|jpeg|gif|png|svg|webp|ico)$).*)"],
};
