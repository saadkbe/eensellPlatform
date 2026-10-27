import { getWorkspaceOverview } from "@/actions/workspace.actions";
import { WorkspaceCrmClient } from "@/components/workspace/workspace-crm-client";

export const dynamic = "force-dynamic";

export default async function WorkspaceCrmPage() {
  const overview = await getWorkspaceOverview();

  return (
    <WorkspaceCrmClient
      initialLeads={overview.recentLeads}
      stats={overview.stats}
    />
  );
}
