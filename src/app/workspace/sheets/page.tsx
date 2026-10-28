import { Metadata } from "next";
import { WorkspaceSheetsClient } from "@/components/workspace/workspace-sheets-client";

export const metadata: Metadata = {
  title: "Agency Master Sheets | Eensell Workspace OS",
  description: "Notion and Airtable-style live data grid to track and calculate your agency leads and retainers.",
};

export default function WorkspaceSheetsPage() {
  return <WorkspaceSheetsClient />;
}
