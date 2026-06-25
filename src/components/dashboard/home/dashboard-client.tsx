"use client";

import { motion } from "framer-motion";
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
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/landing/LanguageProvider";
import { LeaderboardWidget } from "../leaderboard-widget";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(12px)", scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: { type: "spring" as const, stiffness: 260, damping: 25 },
  },
};

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.85, filter: "blur(8px)" },
  show: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 280, damping: 20 },
  },
};

export function DashboardClient({
  firstName,
  greeting,
  totalModules,
  completedLessons,
  progressPercent,
  totalResources,
  continueLesson,
  continueModule,
  totalLessons,
  announcements,
  upcomingCall,
  recentlyWatched,
  leaderboard,
}: any) {
  const { t } = useLanguage();
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const stats = [
    {
      label: t("dash_modules_label"),
      value: totalModules,
      icon: BookOpen,
      color: "#3B82F6",
      bgColor: "rgba(59,130,246,0.15)",
      subtext: t("dash_modules_subtext"),
    },
    {
      label: t("dash_completed_label"),
      value: completedLessons,
      icon: Trophy,
      color: "#10B981",
      bgColor: "rgba(16,185,129,0.15)",
      subtext: t("dash_completed_subtext"),
    },
    {
      label: t("dash_progress_label"),
      value: `${progressPercent}%`,
      icon: TrendingUp,
      color: "#F59E0B",
      bgColor: "rgba(245,158,11,0.15)",
      subtext: t("dash_progress_subtext"),
    },
    {
      label: t("dash_resources_label"),
      value: totalResources,
      icon: FileText,
      color: "#8B5CF6",
      bgColor: "rgba(139,92,246,0.15)",
      subtext: t("dash_resources_subtext"),
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-12"
    >
      {/* ── Welcome Banner ── */}
      <motion.div 
        variants={itemVariants} 
        className="relative overflow-hidden rounded-3xl border border-orange-500/30 p-8 sm:p-10 shadow-2xl"
        style={{
          backgroundImage: `url('/welcome-bg.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark Overlay for Text Legibility */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />

        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Floating Accents */}
        <motion.div 
          animate={{ y: [0, -10, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-12 left-1/4 w-2.5 h-2.5 rounded-full bg-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.9)]"
        />
        <motion.div 
          animate={{ y: [0, 15, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-16 right-1/3 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.9)]"
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-semibold text-orange-100">{greeting}</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-amber-200 tracking-tight mb-4"
            >
              {t("dash_welcome_back")}, {firstName}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg text-slate-200 leading-relaxed font-light"
            >
              {t("dash_welcome_sub")}
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="shrink-0"
          >
            <Link href="/dashboard/modules">
              <Button className="group relative h-14 px-8 bg-white text-black hover:bg-slate-100 rounded-2xl font-bold text-lg shadow-[0_0_40px_rgba(251,146,60,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(251,146,60,0.5)] border-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                <span className="relative flex items-center gap-3">
                  <PlayCircle className="w-5 h-5 text-orange-600" />
                  {t("dash_resume_journey")}
                </span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Stats Grid ── */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat: any, i: number) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={scaleVariants}>
              <Card className="relative overflow-hidden bg-card/60 backdrop-blur-xl border-border/50 hover:border-primary/30 transition-all duration-500 group shadow-lg hover:shadow-xl hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ backgroundImage: `linear-gradient(to bottom right, transparent, ${stat.bgColor})` }} />
                <CardContent className="p-6 relative z-10">
                  <div className="flex flex-col gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner"
                      style={{ backgroundColor: stat.bgColor }}
                    >
                      <Icon className="w-6 h-6" style={{ color: stat.color }} />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-foreground tracking-tighter mb-1">{stat.value}</p>
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label} <span className="text-muted-foreground/60">{stat.subtext}</span></p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Main Layout Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-8 space-y-6 lg:space-y-8">
          
          {/* Continue Learning */}
          <motion.div variants={itemVariants}>
            {continueLesson ? (
              <Card className="relative overflow-hidden bg-card/60 backdrop-blur-md border-border/50 shadow-xl group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors duration-700 pointer-events-none" />
                <CardContent className="p-1 sm:p-2">
                  <div className="flex flex-col sm:flex-row bg-background/40 rounded-2xl overflow-hidden border border-border/50">
                    
                    {/* Thumbnail Area */}
                    <div className="relative w-full sm:w-1/3 overflow-hidden bg-[#030712] group-hover:shadow-inner transition-all flex items-center justify-center">
                      {continueModule?.imageUrl ? (
                        <>
                          <img src={continueModule.imageUrl} alt={continueModule.title} className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                          <BookOpen className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-md border-white/10 hover:bg-black/80 font-semibold tracking-wide">
                          IN PROGRESS
                        </Badge>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center">
                      <div className="flex items-center gap-2 text-primary mb-3">
                        <PlayCircle className="w-5 h-5 animate-pulse" />
                        <span className="text-sm font-bold uppercase tracking-widest text-primary/80">{t("dash_continue_watching")}</span>
                      </div>
                      
                      <h4 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors duration-300">
                        {continueLesson.title}
                      </h4>
                      
                      <p className="text-sm font-medium text-muted-foreground mb-6 line-clamp-2">
                        From: <span className="text-foreground/80">{continueModule?.title || "Module"}</span>
                      </p>
                      
                      <div className="mt-auto">
                        <Link href={`/dashboard/modules/${continueModule?.id}/${continueLesson.id}`}>
                          <Button className="w-full sm:w-auto gap-3 h-12 px-8 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all">
                            <PlayCircle className="w-5 h-5" />
                            {t("dash_jump_right_in")}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card/60 backdrop-blur-md border-border/50 shadow-xl overflow-hidden relative">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
                <CardContent className="p-10 flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 shadow-inner shrink-0">
                    <GraduationCap className="w-12 h-12 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{t("dash_begin_evolution")}</h3>
                    <p className="text-muted-foreground max-w-md">{t("dash_begin_evolution_sub")}</p>
                  </div>
                  <Link href="/dashboard/modules" className="shrink-0">
                    <Button size="lg" className="h-14 px-8 rounded-xl font-bold gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                      {t("dash_browse_curriculum")} <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Progress & Announcements Row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 lg:gap-8">
            
            {/* Advanced Progress Ring */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <Card className="h-full bg-card/60 backdrop-blur-md border-border/50 shadow-lg relative overflow-hidden group">
                <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full">
                  <div className="relative w-40 h-40 mb-6 drop-shadow-2xl">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                      {/* Background track */}
                      <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" className="text-muted/30" strokeWidth="6" />
                      {/* Progress track */}
                      <motion.circle
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                        cx="60" cy="60" r="54" fill="none"
                        stroke="url(#progressGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                      />
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="hsl(var(--primary))" />
                          <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/70">{progressPercent}%</span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{t("dash_mastered")}</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-foreground text-lg mb-1">{t("dash_global_mastery")}</h4>
                  <p className="text-sm font-medium text-muted-foreground">
                    <span className="text-foreground">{completedLessons}</span> {t("dash_out_of")} <span className="text-foreground">{totalLessons}</span> {t("dash_milestones")}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Premium Announcements */}
            <motion.div variants={itemVariants} className="md:col-span-3">
              <Card className="h-full bg-card/60 backdrop-blur-md border-border/50 overflow-hidden shadow-lg flex flex-col">
                <CardHeader className="border-b border-border/30 bg-muted/10 pb-4 pt-5 px-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-foreground text-base font-bold flex items-center gap-3 tracking-tight">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                        <Megaphone className="w-4 h-4 text-indigo-500" />
                      </div>
                      {t("dash_updates_intel")}
                    </CardTitle>
                    {announcements.length > 0 && (
                      <Badge variant="default" className="bg-indigo-500 text-white border-none font-bold px-3 shadow-md shadow-indigo-500/20 animate-pulse">
                        {announcements.length} {t("dash_new")}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex-1 overflow-hidden">
                  {announcements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Megaphone className="w-8 h-8 text-muted-foreground/30" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">{t("dash_all_caught_up")}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t("dash_check_back_later")}</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/30 h-full overflow-auto no-scrollbar">
                      {announcements.map((announcement: any, i: number) => (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i }}
                          key={announcement.id}
                          className="px-6 py-5 hover:bg-muted/30 transition-all duration-300 group cursor-default"
                        >
                          <div className="flex gap-4">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-bold text-foreground mb-1.5 group-hover:text-indigo-400 transition-colors">
                                {announcement.title}
                              </h3>
                              <p className="text-sm text-muted-foreground/90 leading-relaxed mb-3 line-clamp-2">
                                {announcement.content}
                              </p>
                              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                <Clock className="w-3.5 h-3.5" />
                                {new Date(announcement.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric"
                                })}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Interactive Quick Actions */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                {t("dash_command_center")}
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
              {[
                { title: t("dash_community"), desc: t("dash_network_grow"), href: "/dashboard/community", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", hoverBg: "hover:bg-blue-500", hoverBorder: "group-hover:border-blue-500/50", shadow: "group-hover:shadow-blue-500/20" },
                { title: t("dash_missions"), desc: t("dash_track_objectives"), href: "/dashboard/goals", icon: Target, color: "text-emerald-500", bg: "bg-emerald-500/10", hoverBg: "hover:bg-emerald-500", hoverBorder: "group-hover:border-emerald-500/50", shadow: "group-hover:shadow-emerald-500/20" },
                { title: t("dash_career_path"), desc: t("dash_map_future"), href: "/dashboard/career", icon: Compass, color: "text-purple-500", bg: "bg-purple-500/10", hoverBg: "hover:bg-purple-500", hoverBorder: "group-hover:border-purple-500/50", shadow: "group-hover:shadow-purple-500/20" },
                { title: t("dash_vault"), desc: t("dash_access_resources"), href: "/dashboard/resources", icon: FileText, color: "text-amber-500", bg: "bg-amber-500/10", hoverBg: "hover:bg-amber-500", hoverBorder: "group-hover:border-amber-500/50", shadow: "group-hover:shadow-amber-500/20" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div key={item.href} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                    <Link href={item.href} className="block h-full">
                      <Card className={`h-full bg-card/40 backdrop-blur-sm border-border/50 ${item.hoverBorder} transition-all duration-300 group cursor-pointer shadow-sm ${item.shadow}`}>
                        <CardContent className="p-5 sm:p-6 flex flex-col items-center text-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${item.hoverBg} group-hover:text-white`}>
                            <Icon className={`w-7 h-7 ${item.color} group-hover:text-white transition-colors duration-300`} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{item.title}</p>
                            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{item.desc}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Refined Recent Activity */}
          <motion.div variants={itemVariants} className="flex-1">
            <Card className="h-full bg-card/60 backdrop-blur-md border-border/50 shadow-lg flex flex-col">
              <CardHeader className="pb-4 border-b border-border/30 pt-5 px-6 bg-muted/5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground text-base font-bold flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-emerald-500" />
                    </div>
                    {t("dash_activity_log")}
                  </CardTitle>
                  <Link href="/dashboard/modules" className="text-xs font-bold text-emerald-500 hover:text-emerald-400 flex items-center gap-1 transition-colors">
                    {t("dash_view_all")} <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1">
                {recentlyWatched.length === 0 ? (
                  <div className="text-center py-12 px-6">
                    <div className="w-16 h-16 bg-muted/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <PlayCircle className="w-8 h-8 text-muted-foreground/40" />
                    </div>
                    <p className="text-sm font-bold text-foreground">{t("dash_canvas_blank")}</p>
                    <p className="text-xs font-medium text-muted-foreground mt-2">{t("dash_start_consuming")}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                    {recentlyWatched.map((p: any) => (
                      <Link
                        key={p.id}
                        href={`/dashboard/modules/${p.lesson.moduleId}/${p.lessonId}`}
                        className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 hover:bg-muted/40 border border-border/30 hover:border-border/50 transition-all duration-300 group shadow-sm"
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-110 ${
                          p.isCompleted 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white" 
                            : "bg-blue-500/10 border-blue-500/20 text-blue-500 group-hover:bg-blue-500 group-hover:text-white"
                        }`}>
                          {p.isCompleted ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <PlayCircle className="w-5 h-5" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                            {p.lesson.title}
                          </p>
                          <p className="text-xs font-medium text-muted-foreground truncate mt-0.5 uppercase tracking-wider">
                            {p.lesson.module.title}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="lg:col-span-4 space-y-6 lg:space-y-8">

          {/* Animated Streak Widget */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-orange-500/20 via-card to-card border-orange-500/30 overflow-hidden relative shadow-lg group hover:shadow-orange-500/10 transition-shadow duration-500">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none transform group-hover:scale-110 group-hover:rotate-12">
                <Flame className="w-40 h-40 text-orange-500" />
              </div>
              <CardContent className="p-6 sm:p-8 relative z-10">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.3)] shrink-0 animate-pulse">
                    <Flame className="w-8 h-8 text-white drop-shadow-md" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-orange-500 dark:text-orange-400 uppercase tracking-widest mb-1">{t("dash_momentum")}</p>
                    <p className="text-4xl font-black text-foreground tracking-tighter">
                      {completedLessons > 0 ? `${Math.min(completedLessons, 30)}` : "0"} <span className="text-xl font-bold text-muted-foreground">{t("dash_days")}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Gamification Leaderboard */}
          <motion.div variants={itemVariants} className="w-full">
            <LeaderboardWidget users={leaderboard} />
          </motion.div>

          {/* Premium Live Sessions */}
          <motion.div variants={itemVariants}>
            <Card className="relative overflow-hidden border-border/50 bg-card/60 backdrop-blur-md shadow-lg">
              <CardHeader className="pb-4 relative z-10 border-b border-border/30 pt-5 px-6 bg-muted/5">
                <CardTitle className="text-foreground text-base font-bold flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                    <Video className="w-4 h-4 text-rose-500" />
                  </div>
                  {t("dash_live_broadcasts")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 relative z-10">
                {upcomingCall ? (
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-5 group">
                      <div className="absolute inset-0 bg-rose-500/20 rounded-3xl blur-xl group-hover:bg-rose-500/30 transition-colors animate-pulse" />
                      <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-card to-muted flex items-center justify-center border border-border shadow-xl">
                        <Video className="w-10 h-10 text-rose-500" />
                      </div>
                      <Badge className="absolute -top-3 -right-3 bg-rose-500 text-white border-2 border-background shadow-lg px-3 py-1 font-bold animate-bounce">
                        {t("dash_live")}
                      </Badge>
                    </div>
                    
                    <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
                      {upcomingCall.title}
                    </h3>
                    
                    <div className="flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground bg-muted/50 px-4 py-2 rounded-xl w-full mb-6 border border-border/50">
                      <Clock className="w-4 h-4 text-foreground" />
                      {new Date(upcomingCall.scheduledAt).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    
                    {upcomingCall.meetingUrl && (
                      <a 
                        href={upcomingCall.meetingUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button className="w-full h-12 text-base font-bold bg-foreground text-background hover:bg-foreground/90 gap-2 shadow-xl hover:shadow-foreground/20 transition-all hover:-translate-y-1 rounded-xl">
                          {t("dash_join_broadcast")} <ArrowRight className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4 border border-border/50 border-dashed">
                      <Video className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                    <p className="text-sm font-bold text-foreground">{t("dash_no_broadcasts")}</p>
                    <p className="text-xs font-medium text-muted-foreground mt-2 max-w-[200px] mx-auto leading-relaxed">{t("dash_stay_tuned")}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
