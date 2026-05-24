import { db } from "@/lib/db";
import { UserTable } from "@/components/admin/user-table";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await db.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">User Management</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage all platform users.</p>
      </div>
      <UserTable initialUsers={users.map(u => ({ ...u, createdAt: u.createdAt }))} />
    </div>
  );
}
