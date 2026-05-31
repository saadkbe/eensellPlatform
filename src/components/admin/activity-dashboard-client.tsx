"use client";

import { motion } from "framer-motion";
import { Users, Clock, Activity, FileText, Download, Target, TrendingUp, MonitorPlay } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Ensure date-fns is in package.json... if not, I'll write a small utility. Wait, let me write a small utility instead just in case date-fns isn't there.
function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function timeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function ActivityDashboardClient({
  overviewStats,
  topUsers,
  recentActivities,
}: any) {
  
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Eensell University", 14, 20);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 200, 200);
    doc.text("Premium Platform Activity Report", 14, 28);
    
    // Stats Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Global Overview (Today)", 14, 55);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Active Users Today: ${overviewStats.activeUsersToday}`, 14, 65);
    doc.text(`Average Session Time: ${formatTime(overviewStats.avgSessionTime)}`, 14, 72);
    doc.text(`Total Platform Usage Today: ${formatTime(overviewStats.totalTimeToday)}`, 14, 79);
    
    // Top Users Table
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Top Active Users Today", 14, 95);
    
    const topUsersData = topUsers.map((u: any, i: number) => [
      i + 1,
      `${u.user.firstName || ""} ${u.user.lastName || ""}`.trim() || u.user.email,
      u.user.email,
      formatTime(u.totalTime)
    ]);
    
    autoTable(doc, {
      startY: 100,
      head: [["#", "User", "Email", "Total Time"]],
      body: topUsersData,
      theme: "grid",
      headStyles: { fillColor: [99, 102, 241], textColor: [255, 255, 255], fontStyle: "bold" },
      styles: { fontSize: 10, cellPadding: 4 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });
    
    // Recent Activities Table
    const finalY = (doc as any).lastAutoTable.finalY || 100;
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Recent Activity Log", 14, finalY + 15);
    
    const activityData = recentActivities.slice(0, 50).map((a: any) => [
      `${a.user.firstName || ""} ${a.user.lastName || ""}`.trim() || a.user.email,
      a.path,
      formatTime(a.duration),
      new Date(a.timestamp).toLocaleString()
    ]);
    
    autoTable(doc, {
      startY: finalY + 20,
      head: [["User", "Page Path", "Duration", "Timestamp"]],
      body: activityData,
      theme: "grid",
      headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: "bold" },
      styles: { fontSize: 9, cellPadding: 4 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });
    
    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Generated on ${new Date().toLocaleString()} - Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }
    
    doc.save(`Activity_Report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const stats = [
    { label: "Active Today", value: overviewStats.activeUsersToday, icon: Users, color: "#10B981", bg: "rgba(16,185,129,0.15)", desc: "Users logged in" },
    { label: "Avg Session", value: formatTime(overviewStats.avgSessionTime), icon: Clock, color: "#3B82F6", bg: "rgba(59,130,246,0.15)", desc: "Time spent per user" },
    { label: "Total Usage", value: formatTime(overviewStats.totalTimeToday), icon: Activity, color: "#8B5CF6", bg: "rgba(139,92,246,0.15)", desc: "Combined learning time" },
    { label: "Total Accounts", value: overviewStats.totalUsers, icon: Target, color: "#F59E0B", bg: "rgba(245,158,11,0.15)", desc: "Registered globally" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-card/60 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div>
          <h2 className="text-xl font-bold text-foreground">Analytics Overview</h2>
          <p className="text-sm text-muted-foreground mt-1">Deep dive into real-time platform activity.</p>
        </div>
        <Button onClick={generatePDF} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all hover:-translate-y-0.5 gap-2 shrink-0">
          <Download className="w-4 h-4" /> Generate PDF Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="relative overflow-hidden bg-card/60 backdrop-blur-md border-border/50 shadow-xl group hover:shadow-2xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ backgroundImage: `linear-gradient(to bottom right, transparent, ${s.bg})` }} />
                <CardContent className="p-6 relative z-10 flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-inner shrink-0" style={{ backgroundColor: s.bg }}>
                    <Icon className="w-7 h-7" style={{ color: s.color }} />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-foreground tracking-tighter mb-0.5">{s.value}</p>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Top Users */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-card/60 backdrop-blur-md border-border/50 shadow-xl overflow-hidden flex flex-col h-[600px]">
            <CardHeader className="border-b border-border/30 bg-muted/5 pb-4">
              <CardTitle className="text-foreground text-lg font-bold flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                Top Active Users Today
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto no-scrollbar">
              {topUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <Users className="w-12 h-12 text-muted-foreground/30 mb-3" />
                  <p className="text-sm font-medium text-foreground">No active users today.</p>
                </div>
              ) : (
                <div className="divide-y divide-border/30 p-2">
                  {topUsers.map((u: any, i: number) => (
                    <div key={u.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/40 transition-all duration-300 group">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-all text-emerald-600 font-bold">
                        #{i + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                          {u.user.firstName} {u.user.lastName}
                        </p>
                        <p className="text-xs font-medium text-muted-foreground truncate mt-0.5">{u.user.email}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <Badge className="bg-muted text-foreground border-border shadow-sm px-2.5 py-1 text-xs">
                          {formatTime(u.totalTime)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Feed */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-card/60 backdrop-blur-md border-border/50 shadow-xl overflow-hidden flex flex-col h-[600px] relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
            <CardHeader className="border-b border-border/30 bg-muted/5 pb-4">
              <CardTitle className="text-foreground text-lg font-bold flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <MonitorPlay className="w-4 h-4 text-blue-500" />
                </div>
                Live Activity Feed
                <span className="relative flex h-3 w-3 ml-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto no-scrollbar relative z-10">
              {recentActivities.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <Activity className="w-12 h-12 text-muted-foreground/30 mb-3" />
                  <p className="text-sm font-medium text-foreground">Waiting for activity...</p>
                </div>
              ) : (
                <div className="divide-y divide-border/30 p-2">
                  {recentActivities.map((act: any) => (
                    <div key={act.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/40 transition-all duration-300 group">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-bold text-foreground truncate group-hover:text-blue-500 transition-colors">
                            {act.user.firstName} {act.user.lastName}
                          </p>
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0">
                            {timeAgo(act.timestamp)}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1.5">
                          <Badge variant="outline" className="text-[10px] w-fit font-mono bg-background">
                            {act.path}
                          </Badge>
                          <span className="text-xs text-muted-foreground font-medium">
                            Duration: <span className="text-foreground">{formatTime(act.duration)}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
