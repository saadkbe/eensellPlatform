import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/topbar";
import { getOrCreateUser } from "@/actions/user.actions";
import { getHasNewLesson } from "@/actions/module.actions";
import { redirect } from "next/navigation";

import { PageTransition } from "@/components/page-transition";
import { MainLayoutWrapper } from "@/components/dashboard/main-layout-wrapper";

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Run user lookup and new lesson check IN PARALLEL (not sequentially)
  const [user, hasNewLesson] = await Promise.all([
    getOrCreateUser(),
    getHasNewLesson(),
  ]);
  
  // Securely enforce pending status based on the database (truth) rather than just the cached Clerk token
  if (user && user.role !== "ADMIN" && (user.status === "PENDING" || user.status === "REJECTED" || user.status === "SUSPENDED")) {
    redirect("/pending");
  }

  if (user && !user.onboardingCompleted) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar hasNewLesson={hasNewLesson} />
      <MainLayoutWrapper>
        <TopBar />
        <div className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <PageTransition>
            {children}
          </PageTransition>
        </div>
      </MainLayoutWrapper>
    </div>
  );
}
