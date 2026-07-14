import { AdminOverviewClient } from "@/components/admin/admin-overview-client";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <div className="space-y-8 pb-8">
      <AdminOverviewClient />
    </div>
  );
}
