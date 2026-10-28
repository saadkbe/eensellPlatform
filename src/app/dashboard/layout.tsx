import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/topbar";
import { WalkthroughProvider } from "@/components/dashboard/walkthrough-provider";
import { getOrCreateUser } from "@/actions/user.actions";
import { getHasNewLesson } from "@/actions/module.actions";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { PageTransition } from "@/components/page-transition";
import { MainLayoutWrapper } from "@/components/dashboard/main-layout-wrapper";
import { getUserChallengeProgress } from "@/actions/challenge.actions";
import { TaskAiChatbot } from "@/components/dashboard/challenge/task-ai-chatbot";

export const dynamic = 'force-dynamic';

const V2_ONLY_ROUTES = [
  '/dashboard/challenge',
  '/dashboard/resources',
  '/dashboard/community',
  '/dashboard/live-calls',
  '/dashboard/career',
  '/dashboard/goals',
  '/dashboard/chat',
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Run user lookup, new lesson check, challenge progress, and headers lookup in parallel
  const [dbUser, hasNewLesson, headerList, challengeProgress] = await Promise.all([
    getOrCreateUser(),
    getHasNewLesson(),
    headers(),
    getUserChallengeProgress(),
  ]);
  
  // Suspended or rejected users are blocked
  if (dbUser && dbUser.role !== "ADMIN" && (dbUser.status === "REJECTED" || dbUser.status === "SUSPENDED")) {
    redirect("/pending");
  }

  // Tier-based route protection for FREE_LIBRARY members (always allow access to free AI Library)
  const pathname = headerList.get("x-pathname") || "";
  if (dbUser && dbUser.role !== "ADMIN" && dbUser.tier === "FREE_LIBRARY") {
    const isExactDashboard = pathname === "/dashboard" || pathname === "/dashboard/";
    const isV2Route = V2_ONLY_ROUTES.some((route) => pathname.startsWith(route));
    if (isExactDashboard || isV2Route) {
      redirect("/dashboard/modules?upgrade=true");
    }
  } else if (dbUser && dbUser.tier === "UNIVERSITY_V2") {
    // Only paid V2 members undergo the 60-Day Challenge onboarding flow
    if (!dbUser.onboardingCompleted) {
      redirect("/onboarding");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar 
        hasNewLesson={hasNewLesson} 
        userTier={dbUser?.tier}
        userRole={dbUser?.role}
      />
      <MainLayoutWrapper>
        <TopBar />
        {dbUser && <WalkthroughProvider hasSeenWalkthrough={dbUser.hasSeenWalkthrough} />}
        <div className="flex-1 px-3 sm:px-5 lg:px-6 py-5 w-full">
          <PageTransition>
            {children}
          </PageTransition>
        </div>
        <TaskAiChatbot currentDayNumber={challengeProgress?.currentDay || 1} />
      </MainLayoutWrapper>
    </div>
  );
}
