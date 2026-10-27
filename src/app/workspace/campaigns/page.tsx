import { getWorkspaceOverview } from "@/actions/workspace.actions";
import { WorkspaceCampaignsClient } from "@/components/workspace/workspace-campaigns-client";

export const dynamic = "force-dynamic";

export default async function WorkspaceCampaignsPage() {
  const overview = await getWorkspaceOverview();

  return <WorkspaceCampaignsClient campaigns={overview.campaigns} />;
}
