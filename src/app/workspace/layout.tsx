import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";
import { WorkspaceTopBar } from "@/components/workspace/workspace-topbar";
import { WorkspaceThemeInit } from "@/components/workspace/workspace-theme-init";
import { Metadata } from "next";
import { getOrCreateUser } from "@/actions/user.actions";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Eensell Workspace | Agency Operating System",
  description:
    "Agency operating system: scrape client leads, manage outreach CRM, create sheets, draft emails, and track agency MRR.",
};

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dbUser = await getOrCreateUser();

  if (!dbUser) {
    redirect("/sign-in");
  }

  if (dbUser.role !== "ADMIN" && (dbUser.status === "PENDING" || dbUser.status === "REJECTED" || dbUser.status === "SUSPENDED")) {
    redirect("/pending");
  }

  if (dbUser.role !== "ADMIN" && dbUser.tier === "FREE_LIBRARY") {
    redirect("/dashboard/modules?upgrade=true");
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#191919] text-[#37352F] dark:text-[#E6E6E5] flex transition-colors duration-150 antialiased font-sans">
      <WorkspaceThemeInit />
      {/* Left Sidebar */}
      <WorkspaceSidebar />

      {/* Main Viewport */}
      <main className="flex-1 min-w-0 lg:pl-60 flex flex-col min-h-screen overflow-y-auto">
        <WorkspaceTopBar />
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
}
