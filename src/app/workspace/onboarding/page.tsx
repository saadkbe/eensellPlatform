import { WorkspaceOnboardingGuide } from "@/components/workspace/workspace-onboarding-guide";

export const metadata = {
  title: "Agency Onboarding Guide | Eensell Workspace",
  description: "The complete step-by-step onboarding guide to scale your Moroccan AI agency.",
};

export default function WorkspaceOnboardingPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <WorkspaceOnboardingGuide />
    </div>
  );
}
