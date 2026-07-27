import { db } from "@/lib/db";
import { PendingList } from "@/components/admin/pending-list";

export default async function AdminPendingPage() {
  const pending = await db.user.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Pending Approvals</h1>
        <p className="text-muted-foreground mt-1 text-sm">Review and approve new user registrations.</p>
      </div>
      <PendingList initialUsers={pending.map(u => ({ ...u, createdAt: u.createdAt }))} />
    </div>
  );
}
