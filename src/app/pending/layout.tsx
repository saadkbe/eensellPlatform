import { redirect } from "next/navigation";
import { syncUserToDB } from "@/actions/user.actions";

export default async function PendingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await syncUserToDB();
  
  if (user && !user.onboardingCompleted) {
    redirect("/onboarding");
  }

  return <>{children}</>;
}
