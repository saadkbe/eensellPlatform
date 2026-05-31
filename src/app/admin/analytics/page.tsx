import { db } from "@/lib/db";
import { ActivityDashboardClient } from "@/components/admin/activity-dashboard-client";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const today = new Date().toISOString().split("T")[0];

  const [totalUsers, activeUsers, sessionsToday, activities] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { status: "ACTIVE" } }),
    db.userSession.findMany({
      where: { date: today },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
      },
      orderBy: { totalTime: "desc" },
    }),
    db.userActivity.findMany({
      take: 100,
      orderBy: { timestamp: "desc" },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
      },
    }),
  ]);

  const activeUsersToday = sessionsToday.length;
  const totalTimeToday = sessionsToday.reduce((acc, s) => acc + s.totalTime, 0);
  const avgSessionTime = activeUsersToday > 0 ? Math.round(totalTimeToday / activeUsersToday) : 0;

  const overviewStats = {
    totalUsers,
    activeUsers,
    activeUsersToday,
    totalTimeToday,
    avgSessionTime,
  };

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">User Activity Hub</h1>
        <p className="text-muted-foreground mt-1 text-sm">Monitor platform engagement, active sessions, and generate reports.</p>
      </div>

      <ActivityDashboardClient 
        overviewStats={overviewStats}
        topUsers={sessionsToday.slice(0, 10)}
        recentActivities={activities}
      />
    </div>
  );
}
