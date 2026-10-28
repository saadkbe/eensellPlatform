import { Metadata } from "next";
import { getWorkspaceOverview } from "@/actions/workspace.actions";
import { WorkspaceSheetsClient } from "@/components/workspace/workspace-sheets-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Agency Master Sheets | Eensell Workspace OS",
  description: "Notion and Airtable-style live data grid to track and calculate your agency leads and retainers.",
};

export default async function WorkspaceSheetsPage() {
  const overview = await getWorkspaceOverview().catch(() => null);

  return (
    <WorkspaceSheetsClient
      initialLeads={overview?.recentLeads || []}
      initialRetainers={overview?.retainers || []}
    />
  );
}
