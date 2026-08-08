import { redirect } from "next/navigation";
import { syncUserToDB } from "@/actions/user.actions";

export default async function PendingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await syncUserToDB();
  
  // Allow them to stay on the pending page to wait for approval

  return <>{children}</>;
}
