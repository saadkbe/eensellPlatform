import { Metadata } from "next";
import { WorkspaceInvoicesClient } from "@/components/workspace/workspace-invoices-client";
import { getWorkspaceAccount, getWorkspaceInvoicesAction } from "@/actions/workspace.actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Agency Invoices & Agreements | Eensell Workspace OS",
  description: "Create, customize, and export professional client invoices with Moroccan bank RIB and payment terms.",
};

export default async function WorkspaceInvoicesPage() {
  const [account, invoices] = await Promise.all([
    getWorkspaceAccount().catch(() => null),
    getWorkspaceInvoicesAction().catch(() => []),
  ]);

  return (
    <WorkspaceInvoicesClient
      initialAccount={account}
      initialInvoices={invoices}
    />
  );
}
