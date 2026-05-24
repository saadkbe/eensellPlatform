import { db } from "@/lib/db";
import { Users, UserCheck, TrendingUp, BookOpen, PlayCircle, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminAnalyticsPage() {
  const [totalUsers, activeUsers, pendingUsers, totalModules, totalLessons, completions, recentUsers] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { status: "ACTIVE" } }),
    db.user.count({ where: { status: "PENDING" } }),
    db.module.count({ where: { isPublished: true } }),
    db.lesson.count({ where: { isPublished: true } }),
    db.progress.count({ where: { isCompleted: true } }),
    db.user.findMany({ orderBy: { createdAt: "desc" }, take: 30, select: { createdAt: true } }),
  ]);

  const completionRate = totalLessons > 0 && activeUsers > 0
    ? Math.round((completions / (totalLessons * activeUsers)) * 100)
    : 0;

  // Signups by day (last 7 days)
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return { date: d.toLocaleDateString("en-US", { weekday: "short" }), count: 0 };
  });
  recentUsers.forEach((u) => {
    const dayName = u.createdAt.toLocaleDateString("en-US", { weekday: "short" });
    const found = days.find((d) => d.date === dayName);
    if (found) found.count++;
  });
  const maxSignups = Math.max(...days.map((d) => d.count), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1 text-sm">Platform performance overview.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total Users", value: totalUsers, icon: Users, color: "#0A0A0A" },
          { label: "Active Users", value: activeUsers, icon: UserCheck, color: "#10B981" },
          { label: "Pending", value: pendingUsers, icon: TrendingUp, color: "#F59E0B" },
          { label: "Modules", value: totalModules, icon: BookOpen, color: "#8B5CF6" },
          { label: "Lessons", value: totalLessons, icon: PlayCircle, color: "#EC4899" },
          { label: "Completion Rate", value: `${completionRate}%`, icon: BarChart3, color: "#0A0A0A" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="bg-card/60 border-border">
              <CardContent className="p-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${s.color}15` }}>
                  <Icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Simple bar chart */}
      <Card className="bg-card/60 border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-base font-semibold">Signups — Last 7 Days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2 h-40">
            {days.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] text-muted-foreground">{d.count}</span>
                <div className="w-full rounded-t-md bg-primary/20 transition-all relative" style={{ height: `${(d.count / maxSignups) * 100}%`, minHeight: "4px" }}>
                  <div className="absolute inset-0 rounded-t-md gradient-primary opacity-80" />
                </div>
                <span className="text-[10px] text-muted-foreground">{d.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
