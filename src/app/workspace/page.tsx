import { getWorkspaceOverview } from "@/actions/workspace.actions";
import { WorkspaceDashboardClient } from "@/components/workspace/workspace-dashboard-client";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const overview = await getWorkspaceOverview().catch(() => null);

  return <WorkspaceDashboardClient initialData={overview} />;
}
