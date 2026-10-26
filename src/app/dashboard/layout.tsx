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
  
  // Securely enforce pending status based on the database (truth) rather than just the cached Clerk token
  if (dbUser && dbUser.role !== "ADMIN" && (dbUser.status === "PENDING" || dbUser.status === "REJECTED" || dbUser.status === "SUSPENDED")) {
    redirect("/pending");
  }

  if (dbUser && !dbUser.onboardingCompleted) {
    redirect("/onboarding");
  }

  // Tier-based route protection for FREE_LIBRARY members
  const pathname = headerList.get("x-pathname") || "";
  if (dbUser && dbUser.role !== "ADMIN" && dbUser.tier === "FREE_LIBRARY") {
    const isExactDashboard = pathname === "/dashboard" || pathname === "/dashboard/";
    const isV2Route = V2_ONLY_ROUTES.some((route) => pathname.startsWith(route));
    if (isExactDashboard || isV2Route) {
      redirect("/dashboard/modules?upgrade=true");
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
