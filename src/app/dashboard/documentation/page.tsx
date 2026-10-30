import { Metadata } from "next";
import { DocumentationHubClient } from "@/components/documentation/documentation-hub-client";

export const metadata: Metadata = {
  title: "Automation Documentation & Troubleshooting Hub | Eensell University",
  description:
    "Official Make.com blueprints, error handling directives, API troubleshooting, OpenAI schemas, and production agency SOPs.",
};

export default function DocumentationPage() {
  return <DocumentationHubClient />;
}
