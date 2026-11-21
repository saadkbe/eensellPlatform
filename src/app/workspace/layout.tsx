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

  // STRICT ACCESS CHECK:
  // 1. Any user who is NOT ACTIVE is blocked immediately
  if (dbUser.role !== "ADMIN" && dbUser.status !== "ACTIVE") {
    redirect("/pending");
  }

  // 2. Only Admins, explicit PRO, or ACTIVE users with an active workspaceExpiresAt date get access
  const isAdmin = dbUser.role === "ADMIN";
  const isExplicitPro = dbUser.isPro || dbUser.tier === "PRO";
  let hasActiveWorkspace = isAdmin || isExplicitPro;

  if (!hasActiveWorkspace && dbUser.status === "ACTIVE" && dbUser.workspaceExpiresAt) {
    hasActiveWorkspace = new Date() <= new Date(dbUser.workspaceExpiresAt);
  }

  if (!hasActiveWorkspace) {
    redirect("/dashboard?workspace_expired=true");
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
