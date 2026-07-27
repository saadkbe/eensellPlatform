import { ActivityDashboardClient } from "@/components/admin/activity-dashboard-client";

export const dynamic = "force-dynamic";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">User Activity Hub</h1>
        <p className="text-muted-foreground mt-1 text-sm">Monitor platform engagement, active sessions, and generate reports.</p>
      </div>

      <ActivityDashboardClient />
    </div>
  );
}
