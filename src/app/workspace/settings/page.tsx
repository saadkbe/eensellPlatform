import { getWorkspaceAccount } from "@/actions/workspace.actions";
import { WorkspaceSettingsClient } from "@/components/workspace/workspace-settings-client";

export const dynamic = "force-dynamic";

export default async function WorkspaceSettingsPage() {
  const account = await getWorkspaceAccount();

  return <WorkspaceSettingsClient initialAccount={account} />;
}
