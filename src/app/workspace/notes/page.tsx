import { Metadata } from "next";
import { WorkspaceNotesClient } from "@/components/workspace/workspace-notes-client";

export const metadata: Metadata = {
  title: "Agency Notes & Playbooks | Eensell Workspace OS",
  description: "Keep meeting notes, client objection handling scripts, and agency strategies right inside your workspace.",
};

export default function WorkspaceNotesPage() {
  return <WorkspaceNotesClient />;
}
