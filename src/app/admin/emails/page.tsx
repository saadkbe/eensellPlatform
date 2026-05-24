import { db } from "@/lib/db";
import { EmailComposer } from "@/components/admin/email-composer";

export default async function AdminEmailsPage() {
  const activeUsers = await db.user.findMany({
    where: { status: "ACTIVE" },
    select: { email: true },
  });

  return <EmailComposer activeEmails={activeUsers.map((u) => u.email)} />;
}
