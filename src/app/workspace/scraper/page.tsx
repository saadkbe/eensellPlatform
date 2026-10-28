import { Metadata } from "next";
import { WorkspaceScraperClient } from "@/components/workspace/workspace-scraper-client";

export const metadata: Metadata = {
  title: "Google Maps Client Scraper | Eensell Workspace OS",
  description: "Extract phone numbers, ratings, websites, and addresses for dental clinics, real estate, and local businesses in any city.",
};

export default function WorkspaceScraperPage() {
  return <WorkspaceScraperClient />;
}
