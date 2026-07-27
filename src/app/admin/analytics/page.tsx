import { ActivityDashboardClient } from "@/components/admin/activity-dashboard-client";
import { TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8 pb-8">
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-8 sm:p-10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.08] via-transparent to-indigo-500/[0.05]" />
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/8 rounded-full blur-[60px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-4 border border-cyan-500/20 backdrop-blur-sm">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">User Activity Hub</h1>
          <p className="text-white/40 text-sm sm:text-base max-w-xl leading-relaxed">Monitor platform engagement, active sessions, and generate reports.</p>
        </div>
      </div>

      <ActivityDashboardClient />
    </div>
  );
}
