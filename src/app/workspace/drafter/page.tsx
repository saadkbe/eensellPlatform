import { Metadata } from "next";
import { WorkspaceDrafterClient } from "@/components/workspace/workspace-drafter-client";

export const metadata: Metadata = {
  title: "Outreach & Cold Email Drafter | Eensell Workspace OS",
  description: "Generate high-converting cold emails, WhatsApp hooks, and calling scripts tailored to Moroccan and international clients.",
};

export default function WorkspaceDrafterPage() {
  return <WorkspaceDrafterClient />;
}
