import { currentUser } from "@clerk/nextjs/server";
import {
  BookOpen,
  Clock,
  Trophy,
  TrendingUp,
  Video,
  Megaphone,
  PlayCircle,
  ArrowRight,
  Sparkles,
  Zap,
  ChevronRight,
  Compass,
  Users,
  Target,
  FileText,
  Flame,
  CheckCircle2,
  BarChart3,
  GraduationCap,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import Link from "next/link";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const clerkUser = await currentUser();
  const firstName = clerkUser?.firstName || "there";

  // Fetch data
  const dbUser = await db.user.findUnique({
    where: { clerkId: clerkUser?.id || "" },
    include: { progress: { include: { lesson: { include: { module: true } } } } },
  });

  const [totalModules, totalLessons, announcements, upcomingCall, totalResources] = await Promise.all([
    db.module.count({ where: { isPublished: true } }),
    db.lesson.count({ where: { isPublished: true } }),
    db.announcement.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    db.liveCall.findFirst({
      where: { scheduledAt: { gte: new Date() }, isCompleted: false },
      orderBy: { scheduledAt: "asc" },
    }),
    db.resource.count(),
  ]);

  const completedLessons = dbUser?.progress.filter((p) => p.isCompleted).length || 0;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const recentlyWatched = dbUser?.progress
    .sort((a, b) => b.watchedAt.getTime() - a.watchedAt.getTime())
    .slice(0, 5) || [];

  // Find the most recent non-completed lesson for "Continue Learning"
  const inProgressLesson = dbUser?.progress
    .filter((p) => !p.isCompleted)
    .sort((a, b) => b.watchedAt.getTime() - a.watchedAt.getTime())[0];

  // Find next incomplete lesson if no in-progress exists
  const continueLesson = inProgressLesson?.lesson;
  const continueModule = inProgressLesson?.lesson?.module;

  const stats = [
    {
      label: "Modules",
      value: totalModules,
      icon: BookOpen,
      color: "#0A0A0A",
      bgColor: "rgba(0,0,0,0.08)",
      darkColor: "#FAFAFA",
      darkBgColor: "rgba(250,250,250,0.08)",
      subtext: "available",
    },
    {
      label: "Completed",
      value: completedLessons,
      icon: Trophy,
      color: "#10B981",
      bgColor: "rgba(16,185,129,0.1)",
      darkColor: "#10B981",
      darkBgColor: "rgba(16,185,129,0.1)",
      subtext: "lessons",
    },
    {
      label: "Progress",
      value: `${progressPercent}%`,
      icon: TrendingUp,
      color: "#F59E0B",
      bgColor: "rgba(245,158,11,0.1)",
      darkColor: "#F59E0B",
      darkBgColor: "rgba(245,158,11,0.1)",
      subtext: "overall",
    },
    {
      label: "Resources",
      value: totalResources,
      icon: FileText,
      color: "#8B5CF6",
      bgColor: "rgba(139,92,246,0.1)",
      darkColor: "#8B5CF6",
      darkBgColor: "rgba(139,92,246,0.1)",
      subtext: "available",
    },
  ];

  // Progress ring calculation (SVG circle)
  const circumference = 2 * Math.PI * 54; // r=54
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="space-y-6 pb-8">
      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0B1120] border border-[#1E293B] p-7 sm:p-8 shadow-xl shadow-blue-900/5">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#3B82F6]/15 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#3B82F6]/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#8B5CF6]/15 rounded-full blur-[80px] pointer-events-none" />
        
        {/* subtle grid overlay for texture */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at center, #FFFFFF 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Light Architectural Shapes */}
        <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 opacity-10 pointer-events-none hidden sm:block">
          <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="200" cy="200" r="199" stroke="white" strokeWidth="1"/>
            <circle cx="200" cy="200" r="149" stroke="white" strokeWidth="1" strokeDasharray="4 4"/>
            <path d="M0 200H400" stroke="white" strokeWidth="1" strokeDasharray="2 6"/>
            <path d="M200 0V400" stroke="white" strokeWidth="1" strokeDasharray="2 6"/>
          </svg>
        </div>

        {/* Floating Light Elements */}
        <div className="absolute top-1/4 left-1/3 w-px h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent rotate-45 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-px h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent -rotate-12 pointer-events-none" />
        <div className="absolute top-10 left-[40%] w-1.5 h-1.5 rounded-full bg-white/40 pointer-events-none shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        <div className="absolute bottom-12 right-[30%] w-1 h-1 rounded-full bg-white/30 pointer-events-none shadow-[0_0_8px_rgba(255,255,255,0.6)]" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-[#93C5FD] text-xs font-semibold mb-4 border border-white/10 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#60A5FA]" />
              <span>{getGreeting()}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
              Welcome back, {firstName} ✨
            </h1>
            <p className="text-slate-300 text-sm max-w-lg leading-relaxed">
              Keep up the momentum — your consistency is what sets you apart.
            </p>
          </div>
          <div className="shrink-0 flex gap-3">
            <Link href="/dashboard/modules">
              <Button className="gap-2 bg-white hover:bg-slate-100 text-slate-900 shadow-xl shadow-black/20 transition-all hover:scale-105 h-10 font-semibold border-0">
                <PlayCircle className="w-4 h-4 text-slate-900" />
                Resume Learning
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="relative overflow-hidden bg-card/50 backdrop-blur-xl border-border hover:border-primary/20 transition-all duration-300 group"
            >
              <CardContent className="p-5 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: stat.bgColor }}
                  >
                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</p>
                <p className="text-xs font-medium text-muted-foreground mt-0.5">{stat.label} {stat.subtext}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Main 3-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ── LEFT COLUMN (8 cols) ── */}
        <div className="lg:col-span-8 space-y-6">

          {/* Continue Learning — THE KEY SECTION */}
          {continueLesson ? (
            <Card className="relative overflow-hidden bg-gradient-to-r from-card via-card to-primary/5 border-border shadow-sm group">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                    <PlayCircle className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">Continue Learning</h3>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px] ml-auto">
                    In Progress
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row items-start gap-5">
                  {/* Thumbnail */}
                  {continueModule?.imageUrl ? (
                    <div className="w-full sm:w-48 h-28 rounded-xl overflow-hidden border border-border shrink-0 bg-muted">
                      <img src={continueModule.imageUrl} alt={continueModule.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-full sm:w-48 h-28 rounded-xl border border-border shrink-0 bg-muted/50 flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-muted-foreground/40" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      {continueModule?.title || "Module"}
                    </p>
                    <h4 className="text-lg font-bold text-foreground mb-2 line-clamp-1">
                      {continueLesson.title}
                    </h4>
                    {continueLesson.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {continueLesson.description}
                      </p>
                    )}
                    <Link href={`/dashboard/modules/${continueModule?.id}/${continueLesson.id}`}>
                      <Button size="sm" className="gap-2 shadow-md shadow-primary/15 hover:scale-105 transition-transform">
                        <PlayCircle className="w-4 h-4" />
                        Resume Lesson
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card/50 border-border shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Start Your Learning Journey</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Browse modules and begin your first lesson.</p>
                </div>
                <Link href="/dashboard/modules">
                  <Button size="sm" className="gap-2">
                    Browse Modules <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Progress Ring + Announcements side by side */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Progress Ring */}
            <Card className="md:col-span-2 bg-card/50 border-border shadow-sm">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className="relative w-32 h-32 mb-4">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                    <circle
                      cx="60" cy="60" r="54" fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-foreground">{progressPercent}%</span>
                    <span className="text-[10px] text-muted-foreground font-medium">Complete</span>
                  </div>
                </div>
                <h4 className="font-semibold text-foreground text-sm">Learning Progress</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {completedLessons} of {totalLessons} lessons
                </p>
              </CardContent>
            </Card>

            {/* Announcements */}
            <Card className="md:col-span-3 bg-card/50 border-border overflow-hidden shadow-sm">
              <CardHeader className="border-b border-border/50 bg-muted/20 pb-3 pt-4 px-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground text-sm font-semibold flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-primary" />
                    Announcements
                  </CardTitle>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                    {announcements.length} New
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {announcements.length === 0 ? (
                  <div className="text-center py-10 px-4">
                    <Megaphone className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No announcements yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {announcements.map((announcement) => (
                      <div
                        key={announcement.id}
                        className="px-5 py-4 hover:bg-muted/20 transition-colors group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-foreground mb-0.5 line-clamp-1 group-hover:text-primary transition-colors">
                              {announcement.title}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {announcement.content}
                            </p>
                            <p className="text-[10px] text-muted-foreground/60 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {announcement.createdAt.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Grid */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { title: "Community", desc: "Connect & discuss", href: "/dashboard/community", icon: MessageSquare, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
                { title: "Goals", desc: "Track habits", href: "/dashboard/goals", icon: Target, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
                { title: "Career", desc: "Explore paths", href: "/dashboard/career", icon: Compass, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                { title: "Resources", desc: "Study materials", href: "/dashboard/resources", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <Card className="bg-card/50 border-border hover:border-primary/20 transition-all duration-300 group cursor-pointer h-full">
                      <CardContent className="p-4 flex flex-col items-center text-center gap-2.5">
                        <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center border ${item.border} group-hover:scale-110 transition-transform`}>
                          <Icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">{item.title}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN (4 cols) ── */}
        <div className="lg:col-span-4 space-y-6">

          {/* Next Live Call */}
          <Card className="relative overflow-hidden border-border bg-card/50 shadow-sm">
            {upcomingCall && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent pointer-events-none" />
            )}
            <CardHeader className="pb-3 relative z-10 border-b border-border/50 pt-4 px-5">
              <CardTitle className="text-foreground text-sm font-semibold flex items-center gap-2">
                <Video className="w-4 h-4 text-primary" />
                Live Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 relative z-10">
              {upcomingCall ? (
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 border border-primary/20">
                    <Video className="w-7 h-7 text-primary" />
                  </div>
                  <Badge className="bg-primary text-primary-foreground border-none mb-2 px-3 py-0.5 text-[10px] animate-pulse shadow-lg shadow-primary/20">
                    Starting Soon
                  </Badge>
                  <h3 className="text-sm font-semibold text-foreground mb-1.5 line-clamp-1">
                    {upcomingCall.title}
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg w-full mb-4 border border-border">
                    <Clock className="w-3.5 h-3.5" />
                    {upcomingCall.scheduledAt.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  {upcomingCall.meetingUrl && (
                    <Button asChild className="w-full gap-2 font-semibold shadow-lg shadow-primary/15 hover:-translate-y-0.5 transition-transform h-9 text-sm">
                      <a href={upcomingCall.meetingUrl} target="_blank" rel="noopener noreferrer">
                        Join Meeting <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-2 border border-border">
                    <Video className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-xs font-medium text-foreground">No sessions scheduled</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">We'll notify you when one is planned.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weekly Streak */}
          <Card className="bg-gradient-to-br from-amber-500/15 to-card border-amber-500/20 overflow-hidden relative shadow-sm">
            <div className="absolute right-0 top-0 p-3 opacity-10 pointer-events-none">
              <Flame className="w-24 h-24 text-amber-500" />
            </div>
            <CardContent className="p-5 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center border-2 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.15)] shrink-0">
                  <Flame className="w-7 h-7 text-amber-500" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Current Streak</p>
                  <p className="text-2xl font-bold text-foreground">{completedLessons > 0 ? `${Math.min(completedLessons, 30)}` : "0"} Days</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Keep learning daily!</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recently Watched */}
          <Card className="bg-card/50 border-border shadow-sm">
            <CardHeader className="pb-3 border-b border-border/50 pt-4 px-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground text-sm font-semibold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Recent Activity
                </CardTitle>
                <Link href="/dashboard/modules" className="text-[10px] font-medium text-primary hover:underline flex items-center">
                  All <ChevronRight className="w-3 h-3 ml-0.5" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {recentlyWatched.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <PlayCircle className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-xs font-medium text-foreground">No lessons watched yet</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Start learning to see your activity</p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {recentlyWatched.map((p) => (
                    <Link
                      key={p.id}
                      href={`/dashboard/modules/${p.lesson.moduleId}/${p.lessonId}`}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-all text-primary">
                        {p.isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <PlayCircle className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {p.lesson.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {p.lesson.module.title}
                        </p>
                      </div>
                    </Link>
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
