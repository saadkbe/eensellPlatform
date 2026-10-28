import { Metadata } from "next";
import { WorkspaceInvoicesClient } from "@/components/workspace/workspace-invoices-client";

export const metadata: Metadata = {
  title: "Agency Invoices & Agreements | Eensell Workspace OS",
  description: "Create, customize, and export professional client invoices with Moroccan bank RIB and payment terms.",
};

export default function WorkspaceInvoicesPage() {
  return <WorkspaceInvoicesClient />;
}
