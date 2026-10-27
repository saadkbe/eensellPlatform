import { getWorkspaceOverview } from "@/actions/workspace.actions";
import { WorkspaceAgentConsole } from "@/components/workspace/workspace-agent-console";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const overview = await getWorkspaceOverview();

  return <WorkspaceAgentConsole initialData={overview} />;
}
