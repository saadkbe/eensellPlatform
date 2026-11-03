import { Metadata } from "next";
import { WorkspaceNotesClient } from "@/components/workspace/workspace-notes-client";
import { getWorkspaceNotesAction } from "@/actions/workspace.actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Agency Notes & Playbooks | Eensell Workspace OS",
  description: "Keep meeting notes, client objection handling scripts, and agency strategies right inside your workspace.",
};

export default async function WorkspaceNotesPage() {
  const notes = await getWorkspaceNotesAction().catch(() => []);

  return <WorkspaceNotesClient initialNotes={notes} />;
}
