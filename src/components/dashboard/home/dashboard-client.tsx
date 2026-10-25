"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/landing/LanguageProvider";
import { LeaderboardWidget } from "../leaderboard-widget";
import { ReferralPromoModal } from "../referrals/referral-promo-modal";
import { HeroSection } from "./hero-section";
import { PromoHeroBanner } from "./promo-hero-banner";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 280, damping: 24 },
  },
};

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 22 },
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
  announcements = [],
  upcomingCall,
  recentlyWatched = [],
  leaderboard = [],
  challengeProgress,
  userTier,
}: any) {
  const { t } = useLanguage();
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const getNextLessonDropDate = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      let daysToAdd = 0;

      if (day === 1) {
        daysToAdd = hour < 20 ? 0 : 4;
      } else if (day > 1 && day < 5) {
        daysToAdd = 5 - day;
      } else if (day === 5) {
        daysToAdd = hour < 20 ? 0 : 3;
      } else if (day === 6) {
        daysToAdd = 2;
      } else if (day === 0) {
        daysToAdd = 1;
      }

      return new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysToAdd, 20, 0, 0);
    };

    const updateCountdown = () => {
      const target = getNextLessonDropDate();
      const diff = target.getTime() - new Date().getTime();
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: t("dash_modules_label"),
      value: totalModules,
      icon: BookOpen,
      color: "#38BDF8",
      bgColor: "rgba(56,189,248,0.12)",
      subtext: t("dash_modules_subtext"),
    },
    {
      label: t("dash_completed_label"),
      value: completedLessons,
      icon: Trophy,
      color: "#10B981",
      bgColor: "rgba(16,185,129,0.12)",
      subtext: t("dash_completed_subtext"),
    },
    {
      label: t("dash_progress_label"),
      value: `${progressPercent}%`,
      icon: TrendingUp,
      color: "#F59E0B",
      bgColor: "rgba(245,158,11,0.12)",
      subtext: t("dash_progress_subtext"),
    },
    {
      label: t("dash_resources_label"),
      value: totalResources,
      icon: FileText,
      color: "#8B5CF6",
      bgColor: "rgba(139,92,246,0.12)",
      subtext: t("dash_resources_subtext"),
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 sm:space-y-8 pb-16 max-w-7xl mx-auto"
    >
      <ReferralPromoModal />

      {/* ── Top Affiliate Promotional Hero Banner ── */}
      <motion.div variants={itemVariants}>
        <PromoHeroBanner />
      </motion.div>

      {/* ── Welcome & 60-Day Challenge Banner ── */}
      <motion.div variants={itemVariants}>
        <HeroSection 
          firstName={firstName}
          greeting={greeting}
          challengeProgress={challengeProgress}
        />
      </motion.div>

      {/* ── Referral CTA Banner ── */}
      <motion.div variants={itemVariants}>
        <Link href="/dashboard/referrals" className="block">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 p-[1px] group transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/15">
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/95 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/[0.06]">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-orange-500/10 text-xl border border-orange-500/20 group-hover:scale-105 transition-transform shrink-0">
                  💰
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-orange-500 transition-colors">
                    Refer & Earn
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    Earn <span className="font-bold text-foreground">50 MAD</span> for every colleague or student who joins!
                  </p>
                </div>
              </div>
              <Button size="sm" className="w-full sm:w-auto shrink-0 font-bold gap-2 bg-orange-500 text-white hover:bg-orange-600 border-0 shadow-md shadow-orange-500/20 transition-all rounded-xl h-10 px-5">
                <span>Get Your Link</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* ── Stats Grid ── */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((stat: any) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={scaleVariants}>
              <Card className="relative overflow-hidden bg-card/70 backdrop-blur-xl border-border/60 hover:border-border transition-all duration-300 group shadow-sm hover:shadow-md hover:-translate-y-0.5 rounded-2xl">
                <div
                  className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ backgroundImage: `linear-gradient(to bottom right, transparent, ${stat.bgColor})` }}
                />
                <CardContent className="p-5 relative z-10">
                  <div className="flex flex-col gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-inner"
                      style={{ backgroundColor: stat.bgColor }}
                    >
                      <Icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                    <div>
                      <p className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mb-0.5">{stat.value}</p>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label} <span className="text-muted-foreground/60">· {stat.subtext}</span></p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Main Layout Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* ── LEFT COLUMN (65% width) ── */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Continue Learning or Next Drop */}
          <motion.div variants={itemVariants}>
            {continueLesson ? (
              <Card className="relative overflow-hidden bg-card/70 backdrop-blur-xl border-border/60 shadow-md group rounded-2xl">
                <CardContent className="p-2 sm:p-3">
                  <div className="flex flex-col sm:flex-row bg-background/50 rounded-xl overflow-hidden border border-border/40">
                    {/* Thumbnail */}
                    <div className="relative w-full sm:w-1/3 min-h-[160px] overflow-hidden bg-[#030712] flex items-center justify-center shrink-0">
                      {continueModule?.imageUrl ? (
                        <>
                          <img src={continueModule.imageUrl} alt={continueModule.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted/40">
                          <BookOpen className="w-10 h-10 text-muted-foreground/40" />
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3">
                        <Badge variant="secondary" className="bg-black/70 text-white backdrop-blur-md border-white/10 font-bold tracking-wider text-[10px]">
                          IN PROGRESS
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-center">
                      <div className="flex items-center gap-2 text-primary mb-2">
                        <PlayCircle className="w-4 h-4 animate-pulse text-emerald-500" />
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">{t("dash_continue_watching")}</span>
                      </div>
                      
                      <h4 className="text-xl sm:text-2xl font-bold text-foreground mb-2 leading-tight group-hover:text-primary transition-colors">
                        {continueLesson.title}
                      </h4>
                      
                      <p className="text-xs font-medium text-muted-foreground mb-4 line-clamp-1">
                        Module: <span className="text-foreground/80">{continueModule?.title || "Module"}</span>
                      </p>
                      
                      <div>
                        <Link href={`/dashboard/modules/${continueModule?.id}/${continueLesson.id}`}>
                          <Button size="sm" className="w-full sm:w-auto gap-2 rounded-xl font-bold text-xs h-10 px-6 shadow-sm">
                            <PlayCircle className="w-4 h-4" />
                            <span>{t("dash_jump_right_in")}</span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="relative overflow-hidden border-border/80 shadow-lg rounded-2xl bg-gradient-to-br from-[#0c0f17] to-[#080a0f]">
                <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />
                <CardContent className="p-6 sm:p-8 relative z-10 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-4">
                      <div className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                      <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-orange-300">Next Lesson Drop Countdown</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                      {t("dash_begin_evolution")}
                    </h3>
                    <p className="text-slate-300 text-sm max-w-xl leading-relaxed mb-6 font-light">
                      {t("dash_begin_evolution_sub")}
                    </p>

                    {/* Countdown Display */}
                    <div className="grid grid-cols-4 gap-2.5 sm:gap-3 max-w-md mb-6">
                      {[
                        { label: 'Days', value: isClient ? String(timeLeft.days).padStart(2, '0') : '--' },
                        { label: 'Hours', value: isClient ? String(timeLeft.hours).padStart(2, '0') : '--' },
                        { label: 'Minutes', value: isClient ? String(timeLeft.minutes).padStart(2, '0') : '--' },
                        { label: 'Seconds', value: isClient ? String(timeLeft.seconds).padStart(2, '0') : '--' },
                      ].map((item) => (
                        <div key={item.label} className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
                          <span className="text-xl sm:text-2xl font-black text-white tracking-tight font-mono">
                            {item.value}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-1">
                    <Link href="/dashboard/modules">
                      <Button className="h-11 px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm shadow-md shadow-orange-500/20 border-0 gap-2">
                        <span>{t("dash_browse_curriculum")}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-slate-400 pl-1">
                      <Clock className="w-3.5 h-3.5 text-orange-400" />
                      <span>Lessons drop Monday & Friday at 20:00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Progress Ring & Announcements */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Progress Ring */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <Card className="h-full bg-card/70 backdrop-blur-xl border-border/60 shadow-sm relative overflow-hidden rounded-2xl">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                  <div className="relative w-36 h-36 mb-4">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" className="text-muted/20" strokeWidth="6" />
                      <motion.circle
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        cx="60" cy="60" r="54" fill="none"
                        stroke="url(#progressRingGradient)"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                      />
                      <defs>
                        <linearGradient id="progressRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#10B981" />
                          <stop offset="100%" stopColor="#06B6D4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-foreground">{progressPercent}%</span>
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{t("dash_mastered")}</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-foreground text-base mb-0.5">{t("dash_global_mastery")}</h4>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-foreground font-semibold">{completedLessons}</span> {t("dash_out_of")} <span className="text-foreground font-semibold">{totalLessons}</span> {t("dash_milestones")}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Announcements */}
            <motion.div variants={itemVariants} className="md:col-span-3">
              <Card className="h-full bg-card/70 backdrop-blur-xl border-border/60 shadow-sm overflow-hidden flex flex-col rounded-2xl">
                <CardHeader className="border-b border-border/40 py-3.5 px-5 bg-muted/10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-foreground text-sm font-bold flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                        <Megaphone className="w-3.5 h-3.5 text-indigo-500" />
                      </div>
                      <span>{t("dash_updates_intel")}</span>
                    </CardTitle>
                    {announcements.length > 0 && (
                      <Badge variant="default" className="bg-indigo-500 text-white border-0 font-bold px-2 py-0.5 text-[10px]">
                        {announcements.length} {t("dash_new")}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex-1 overflow-hidden">
                  {announcements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                      <p className="text-xs font-semibold text-foreground">{t("dash_all_caught_up")}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{t("dash_check_back_later")}</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/30 h-full overflow-auto no-scrollbar">
                      {announcements.map((announcement: any) => (
                        <div key={announcement.id} className="p-4 hover:bg-muted/20 transition-colors">
                          <div className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <h5 className="text-xs font-bold text-foreground leading-snug">{announcement.title}</h5>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{announcement.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Command Center */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>{t("dash_command_center")}</span>
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { title: t("dash_community"), desc: t("dash_network_grow"), href: "/dashboard/community", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
                { title: t("dash_missions"), desc: t("dash_track_objectives"), href: "/dashboard/goals", icon: Target, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                { title: t("dash_career_path"), desc: t("dash_map_future"), href: "/dashboard/career", icon: Compass, color: "text-purple-500", bg: "bg-purple-500/10" },
                { title: t("dash_vault"), desc: t("dash_access_resources"), href: "/dashboard/resources", icon: FileText, color: "text-amber-500", bg: "bg-amber-500/10" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className="block group">
                    <Card className="h-full bg-card/70 backdrop-blur-xl border-border/60 hover:border-border transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md">
                      <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                        <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center transition-transform group-hover:scale-105`}>
                          <Icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{item.title}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{item.desc}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants}>
            <Card className="bg-card/70 backdrop-blur-xl border-border/60 shadow-sm rounded-2xl">
              <CardHeader className="py-3.5 px-5 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground text-sm font-bold flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-500" />
                    <span>{t("dash_activity_log")}</span>
                  </CardTitle>
                  <Link href="/dashboard/modules" className="text-xs font-semibold text-emerald-500 hover:text-emerald-600 flex items-center gap-1">
                    <span>{t("dash_view_all")}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-3">
                {recentlyWatched.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-xs font-semibold text-foreground">{t("dash_canvas_blank")}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{t("dash_start_consuming")}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {recentlyWatched.map((p: any) => (
                      <Link
                        key={p.id}
                        href={`/dashboard/modules/${p.lesson.moduleId}/${p.lessonId}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 hover:bg-muted/40 border border-border/30 transition-all group"
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          p.isCompleted ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                        }`}>
                          {p.isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                            {p.lesson.title}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wider">
                            {p.lesson.module?.title}
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

        {/* ── RIGHT COLUMN (35% width) ── */}
        <div className="lg:col-span-4 space-y-6">

          {/* Momentum Streak Flame */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-orange-500/15 via-card to-card border-orange-500/25 shadow-sm rounded-2xl relative overflow-hidden group">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-15 pointer-events-none group-hover:scale-105 transition-transform">
                <Flame className="w-32 h-32 text-orange-500" />
              </div>
              <CardContent className="p-5 sm:p-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0 p-3">
                    <Flame className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">{t("dash_momentum")}</p>
                    <p className="text-3xl font-black text-foreground tracking-tight">
                      {completedLessons > 0 ? `${Math.min(completedLessons, 30)}` : "0"} <span className="text-base font-bold text-muted-foreground">{t("dash_days")}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Leaderboard */}
          <motion.div variants={itemVariants}>
            <LeaderboardWidget users={leaderboard} />
          </motion.div>

          {/* Live Sessions */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/60 bg-card/70 backdrop-blur-xl shadow-sm rounded-2xl">
              <CardHeader className="py-3.5 px-5 border-b border-border/40">
                <CardTitle className="text-foreground text-sm font-bold flex items-center gap-2">
                  <Video className="w-4 h-4 text-rose-500" />
                  <span>{t("dash_live_broadcasts")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                {upcomingCall ? (
                  <div className="flex flex-col items-center text-center space-y-3">
                    <Badge className="bg-rose-500 text-white font-bold text-[10px] animate-pulse">
                      {t("dash_live")}
                    </Badge>
                    <h4 className="text-sm font-bold text-foreground leading-snug">{upcomingCall.title}</h4>
                    <div className="text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-lg w-full">
                      {new Date(upcomingCall.scheduledAt).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    {upcomingCall.meetingUrl && (
                      <a href={upcomingCall.meetingUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button size="sm" className="w-full font-bold text-xs h-9 bg-foreground text-background hover:bg-foreground/90 gap-1.5 rounded-xl">
                          <span>{t("dash_join_broadcast")}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Video className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-foreground">{t("dash_no_broadcasts")}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{t("dash_stay_tuned")}</p>
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
