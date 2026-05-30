import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/topbar";
import { syncUserToDB } from "@/actions/user.actions";
import { getHasNewLesson } from "@/actions/module.actions";
import { redirect } from "next/navigation";

import { PageTransition } from "@/components/page-transition";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await syncUserToDB();
  if (user && !user.onboardingCompleted) {
    redirect("/onboarding");
  }

  const hasNewLesson = await getHasNewLesson();

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar hasNewLesson={hasNewLesson} />
      <main className="lg:ml-[260px] pt-16 lg:pt-0 min-h-screen flex flex-col">
        <TopBar />
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[90rem] w-full mx-auto">
          <PageTransition>
            {children}
          </PageTransition>
        </div>
      </main>
    </div>
  );
}
