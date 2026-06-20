import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/uploadthing(.*)",
  "/terms(.*)",
  "/privacy(.*)",
]);

// Admin-only routes
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

// Dashboard routes (active users only)
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

// Pending route
const isPendingRoute = createRouteMatcher(["/pending"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // If not logged in, redirect to sign-in
  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Get user role from session claims metadata
  const userRole = (sessionClaims?.metadata as { role?: string })?.role;
  const userStatus = (sessionClaims?.metadata as { status?: string })?.status;

  // Admin routes — only admin can access
  if (isAdminRoute(req)) {
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Dashboard routes — only active users and admins
  if (isDashboardRoute(req)) {
    if (userStatus === "PENDING" || userStatus === "REJECTED" || userStatus === "SUSPENDED") {
      return NextResponse.redirect(new URL("/pending", req.url));
    }
    // If no status set yet (new user), we let them pass to the dashboard.
    // The dashboard/layout.tsx will verify their actual database status and redirect if necessary.
    return NextResponse.next();
  }

  // Pending route — if user is actually active, redirect to dashboard
  if (isPendingRoute(req)) {
    if (userStatus === "ACTIVE" || userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
