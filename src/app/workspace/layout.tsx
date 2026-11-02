import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";
import { WorkspaceTopBar } from "@/components/workspace/workspace-topbar";
import { WorkspaceThemeInit } from "@/components/workspace/workspace-theme-init";
import { WorkspaceLayoutWrapper, WorkspaceMainWrapper } from "@/components/workspace/workspace-layout-wrapper";
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
    <WorkspaceLayoutWrapper>
      <WorkspaceThemeInit />
      {/* Left / Right Sidebar */}
      <WorkspaceSidebar />

      {/* Main Viewport with sticky topbar */}
      <WorkspaceMainWrapper>
        <WorkspaceTopBar />
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </WorkspaceMainWrapper>
    </WorkspaceLayoutWrapper>
  );
}
