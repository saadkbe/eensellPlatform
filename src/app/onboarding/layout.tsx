import { getOrCreateUser } from "@/actions/user.actions";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Eensell Journey | Eensell University",
  description: "Begin your exclusive journey into the Eensell ecosystem.",
};

export const dynamic = "force-dynamic";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getOrCreateUser();

  // If not authenticated, they'll be caught by middleware
  if (!user) {
    redirect("/sign-in");
  }

  // If user is not ACTIVE and not ADMIN, redirect to pending
  if (
    user.role !== "ADMIN" &&
    (user.status === "PENDING" || user.status === "REJECTED" || user.status === "SUSPENDED")
  ) {
    redirect("/pending");
  }
  // If onboarding is already complete, direct to workspace onboarding guide
  if (user.onboardingCompleted) {
    redirect("/workspace/onboarding");
  }

  return <>{children}</>;
}
