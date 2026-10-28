import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/challenge(.*)",
  "/60dayschallenge(.*)",
  "/ai-ugc(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/uploadthing(.*)",
  "/terms(.*)",
  "/privacy(.*)",
  "/refund(.*)",
  "/contact(.*)",
  "/upgrade(.*)",
]);

// Admin-only routes
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

// Dashboard and Workspace routes (active users only)
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);
const isWorkspaceRoute = createRouteMatcher(["/workspace(.*)"]);

const V2_ONLY_ROUTES = [
  "/dashboard/challenge",
  "/dashboard/resources",
  "/dashboard/community",
  "/dashboard/live-calls",
  "/dashboard/career",
  "/dashboard/goals",
  "/dashboard/chat",
  "/workspace",
];

// Pending route
const isPendingRoute = createRouteMatcher(["/pending"]);

export default clerkMiddleware(async (auth, req) => {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);

  // Allow public routes immediately — no auth overhead
  if (isPublicRoute(req)) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  const { userId, sessionClaims } = await auth();

  // If not logged in, redirect to sign-in
  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Get user role, status, and tier from session claims metadata
  const userRole = (sessionClaims?.metadata as { role?: string })?.role;
  const userStatus = (sessionClaims?.metadata as { status?: string })?.status;
  const userTier = (sessionClaims?.metadata as { tier?: string })?.tier;

  // Admin routes — only admin can access
  if (isAdminRoute(req)) {
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Dashboard & Workspace routes — only active users and admins
  if (isDashboardRoute(req) || isWorkspaceRoute(req)) {
    // New signups & pending accounts MUST complete payment/verification on /pending
    if (userStatus === "PENDING" || userStatus === "REJECTED" || userStatus === "SUSPENDED") {
      return NextResponse.redirect(new URL("/pending", req.url));
    }

    // Active legacy/V1 members (FREE_LIBRARY tier) only access the AI Library & uploads
    if (userRole !== "ADMIN" && userTier === "FREE_LIBRARY") {
      const pathname = req.nextUrl.pathname;
      const isExactDashboard = pathname === "/dashboard" || pathname === "/dashboard/";
      const isV2Route = V2_ONLY_ROUTES.some((route) => pathname.startsWith(route));
      if (isExactDashboard || isV2Route) {
        return NextResponse.redirect(new URL("/dashboard/modules?upgrade=true", req.url));
      }
    }

    // If no status set yet (new user), we let them pass to the dashboard.
    // The dashboard/layout.tsx will verify their actual database status and redirect if necessary.
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Pending route — active users get redirected to dashboard unless previewing or admin
  if (isPendingRoute(req)) {
    const isPreview = req.nextUrl.searchParams.get("preview") === "true";
    if (!isPreview && userRole !== "ADMIN" && userStatus === "ACTIVE") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
