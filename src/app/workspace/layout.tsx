import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eensell Workspace | Autonomous Client Outreach OS",
  description:
    "AI Voice Outreach Agent, autonomous lead scraping, personalized email dispatching, and high-converting client acquisition CRM.",
};

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar Navigation */}
      <WorkspaceSidebar />

      {/* Main Content Viewport */}
      <main className="flex-1 min-w-0 pt-16 lg:pt-0 lg:pl-64 xl:pl-72 flex flex-col">
        {children}
      </main>
    </div>
  );
}
