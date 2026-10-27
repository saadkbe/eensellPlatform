import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eensell Workspace | Autonomous Client Outreach OS",
  description:
    "Plan, scrape, draft, and dispatch. AI Voice Outreach Agent and high-converting client acquisition CRM.",
};

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-150">
      {/* Left Sidebar */}
      <WorkspaceSidebar />

      {/* Main Split-Screen Viewport */}
      <main className="flex-1 min-w-0 pt-14 lg:pt-0 lg:pl-60 flex flex-col h-screen overflow-hidden">
        {children}
      </main>
    </div>
  );
}
