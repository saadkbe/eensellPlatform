import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";
import { Metadata } from "next";
import { getOrCreateUser } from "@/actions/user.actions";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Eensell Workspace | Autonomous Client Outreach OS",
  description:
    "Plan, scrape, draft, and dispatch. AI Voice Outreach Agent and high-converting client acquisition CRM.",
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
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-150">
      {/* Left Sidebar */}
      <WorkspaceSidebar />

      {/* Main Viewport */}
      <main className="flex-1 min-w-0 pt-14 lg:pt-0 lg:pl-60 flex flex-col min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
