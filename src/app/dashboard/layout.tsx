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
  
  // Pending, suspended or rejected users are blocked and directed to payment verification
  if (dbUser && dbUser.role !== "ADMIN" && (dbUser.status === "PENDING" || dbUser.status === "REJECTED" || dbUser.status === "SUSPENDED")) {
    redirect("/pending");
  }

  // All active students have full access to the V2 Dashboard.
  // Approved V2 members who haven't finished onboarding complete the flow
  if (dbUser && dbUser.tier === "UNIVERSITY_V2" && !dbUser.onboardingCompleted) {
    redirect("/onboarding");
  }

  const isPro = Boolean(dbUser?.isPro || dbUser?.tier === "PRO" || dbUser?.role === "ADMIN");

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar 
        hasNewLesson={hasNewLesson} 
        userTier={dbUser?.tier}
        userRole={dbUser?.role}
        isPro={isPro}
      />
      <MainLayoutWrapper>
        <TopBar isPro={isPro} />
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
