import { Metadata } from "next";
import { WorkspaceWhatsappClient } from "@/components/workspace/workspace-whatsapp-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "WhatsApp Outreach Studio | Eensell Workspace OS",
  description:
    "Direct WhatsApp outreach simulator, phone launcher, and AI voice note pitch generator for Moroccan decision-makers.",
};

export default function WorkspaceWhatsappPage() {
  return <WorkspaceWhatsappClient />;
}
