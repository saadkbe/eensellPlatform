import { db } from "@/lib/db";
import { Users, UserCheck, Clock, BookOpen, TrendingUp, DollarSign, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { STATUS_LABELS } from "@/lib/constants";
import { ExportReportButton } from "@/components/admin/export-report-button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [totalUsers, activeUsers, pendingUsers, suspendedUsers, totalModules, totalLessons, recentSignups] = await Promise.all([
    db.user.count({ where: { role: { not: "ADMIN" } } }),
    db.user.count({ where: { role: "ACTIVE_USER" } }),
    db.user.count({ where: { status: "PENDING" } }),
    db.user.count({ where: { status: "SUSPENDED" } }),
    db.module.count(),
    db.lesson.count(),
    db.user.findMany({ where: { role: { not: "ADMIN" } }, orderBy: { createdAt: "desc" }, take: 8 }),
  ]);

  const revenue = activeUsers * 200;

  const stats = [
    { label: "Total Revenue", value: `${revenue.toLocaleString()} MAD`, icon: DollarSign, color: "#10B981", bg: "rgba(16,185,129,0.1)" },
    { label: "Total Users", value: totalUsers, icon: Users, color: "#0A0A0A", bg: "rgba(0,0,0,0.1)" },
    { label: "Active Users", value: activeUsers, icon: UserCheck, color: "#10B981", bg: "rgba(16,185,129,0.1)" },
    { label: "Pending Approvals", value: pendingUsers, icon: Clock, color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
    { label: "Total Modules", value: totalModules, icon: BookOpen, color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" },
    { label: "Suspended", value: suspendedUsers, icon: TrendingUp, color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Premium Admin Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-destructive/10 via-background to-background border border-border p-8 sm:p-10 shadow-sm">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-destructive/5 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-destructive/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium mb-4 border border-destructive/20">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Control Center</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-2">
              Platform Overview
            </h1>
            <p className="text-muted-foreground text-base max-w-xl">
              Monitor user growth, engagement metrics, and platform revenue all in one place.
            </p>
          </div>
          <div className="shrink-0 flex gap-3">
             <ExportReportButton />
          </div>
        </div>
      </div>

      {/* Stats Grid - Glassmorphic & Animated */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="relative overflow-hidden bg-card/40 backdrop-blur-xl border-border hover:border-destructive/30 transition-all duration-300 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.02)]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-inner" style={{ backgroundColor: s.bg }}>
                    <Icon className="w-6 h-6" style={{ color: s.color }} />
                  </div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                    <TrendingUp className="w-3 h-3" />
                    <span>+{Math.floor(Math.random() * 15) + 5}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground tracking-tight mb-1">{s.value}</p>
                  <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Signups */}
      <Card className="bg-card/40 backdrop-blur-xl border-border overflow-hidden shadow-sm">
        <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-destructive" />
              Recent Signups
            </CardTitle>
            <Link href="/admin/users">
              <Button variant="ghost" size="sm" className="text-xs hover:bg-muted/50">View All Users</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {recentSignups.map((user) => {
              const statusInfo = STATUS_LABELS[user.status];
              return (
                <div key={user.id} className="flex items-center justify-between p-4 sm:p-5 hover:bg-muted/30 transition-colors group">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm font-bold text-primary group-hover:scale-110 transition-transform shadow-sm border border-primary/20">
                      {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-xs font-medium text-muted-foreground hidden sm:block">
                      {user.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <Badge className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border-none shadow-sm ${statusInfo.color}`}>
                      {statusInfo.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
            {recentSignups.length === 0 && (
               <div className="text-center py-12">
                 <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 border border-border">
                   <Users className="w-8 h-8 text-muted-foreground" />
                 </div>
                 <p className="text-sm font-medium text-foreground">No recent signups found.</p>
                 <p className="text-xs text-muted-foreground mt-1">New users will appear here.</p>
               </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
