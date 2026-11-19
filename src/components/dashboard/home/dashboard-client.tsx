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
  ExternalLink,
  Layers,
  Award,
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
import { StreakWidget } from "./streak-widget";
import { CertificateCard } from "../certificate/certificate-modal";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 280, damping: 24 },
  },
};

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 320, damping: 22 },
  },
};

export function DashboardClient({
  firstName,
  studentName,
  userClerkId,
  greeting,
  greetingKey,
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
  streakData,
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
      } else {
        daysToAdd = (1 + 7 - day) % 7;
      }

      const nextDate = new Date(now);
      nextDate.setDate(now.getDate() + daysToAdd);
      nextDate.setHours(20, 0, 0, 0);
      return nextDate;
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

  // Determine mastery rank level
  const getMasteryRank = (pct: number) => {
    if (pct >= 100) return { title: "Mastery Certified", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" };
    if (pct >= 75) return { title: "Senior Practitioner", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30" };
    if (pct >= 50) return { title: "Advanced Specialist", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/30" };
    if (pct >= 25) return { title: "Rising Scholar", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" };
    return { title: "Initiate Explorer", color: "text-zinc-400", bg: "bg-zinc-500/10 border-zinc-500/20" };
  };

  const masteryRank = getMasteryRank(progressPercent);

  // Upgraded Stats Definition with individual modern themes
  const stats = [
    {
      label: t("dash_modules_label"),
      value: totalModules,
      icon: BookOpen,
      accent: "from-sky-500/20 to-blue-600/5",
      iconBg: "bg-sky-500/10 text-sky-500 border-sky-500/25",
      badge: "Full Curriculum",
      subtext: t("dash_modules_subtext"),
      glow: "hover:shadow-sky-500/10 hover:border-sky-500/40",
    },
    {
      label: t("dash_completed_label"),
      value: completedLessons,
      icon: Trophy,
      accent: "from-amber-500/20 to-orange-600/5",
      iconBg: "bg-amber-500/10 text-amber-500 border-amber-500/25",
      badge: totalLessons > 0 ? `${Math.round((completedLessons / totalLessons) * 100)}% Done` : "0%",
      subtext: t("dash_completed_subtext"),
      glow: "hover:shadow-amber-500/10 hover:border-amber-500/40",
    },
    {
      label: t("dash_progress_label"),
      value: `${progressPercent}%`,
      icon: TrendingUp,
      accent: "from-emerald-500/20 to-teal-600/5",
      iconBg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/25",
      badge: progressPercent > 0 ? "Pacing Well" : "Ready to Start",
      subtext: t("dash_progress_subtext"),
      glow: "hover:shadow-emerald-500/10 hover:border-emerald-500/40",
      isProgress: true,
    },
    {
      label: t("dash_resources_label"),
      value: totalResources,
      icon: FileText,
      accent: "from-purple-500/20 to-violet-600/5",
      iconBg: "bg-purple-500/10 text-purple-500 border-purple-500/25",
      badge: "Vault Access",
      subtext: t("dash_resources_subtext"),
      glow: "hover:shadow-purple-500/10 hover:border-purple-500/40",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 sm:space-y-8 pb-16 w-full max-w-[1600px] mx-auto"
    >
      <ReferralPromoModal />

      {/* ── Welcome & 60-Day Challenge Banner ── */}
      <motion.div variants={itemVariants}>
        <HeroSection 
          firstName={firstName}
          greeting={greeting}
          greetingKey={greetingKey}
          challengeProgress={challengeProgress}
        />
      </motion.div>

      {/* ── Referral High-Impact Banner ── */}
      <motion.div variants={itemVariants}>
        <Link href="/dashboard/referrals" className="block group">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 p-[1.5px] transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20">
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-card via-card/95 to-card rounded-[22px] px-6 sm:px-8 py-4 sm:py-5 border border-white/[0.08] backdrop-blur-xl">
              <div className="flex items-center gap-4 sm:gap-5 text-center sm:text-left">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 text-2xl border border-orange-500/30 group-hover:scale-110 transition-transform shadow-inner shrink-0">
                  💰
                </div>
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-wider border-orange-500/40 text-orange-400 bg-orange-500/10 px-2 py-0.5">
                      Partner Affiliate Program
                    </Badge>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-foreground group-hover:text-orange-500 transition-colors tracking-tight">
                    {t("dash_refer_banner_title")}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
                    {t("dash_refer_banner_desc")}
                  </p>
                </div>
              </div>

              <Button size="sm" className="w-full sm:w-auto shrink-0 font-black gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 border-0 shadow-lg shadow-orange-500/25 transition-all rounded-xl h-11 px-6 text-xs sm:text-sm">
                <span>{t("dash_refer_banner_btn")}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* ── 10X Upgraded Stats Cards Grid ── */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat: any) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={scaleVariants} whileHover={{ y: -4 }}>
              <Card className={cn(
                "relative overflow-hidden bg-gradient-to-b from-card via-card/90 to-card/70 backdrop-blur-2xl border border-border/80 shadow-sm transition-all duration-300 rounded-3xl p-0",
                stat.glow
              )}>
                {/* Hairline Top Light Reflection */}
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                
                {/* Subtle Ambient Radial Glow */}
                <div
                  className="absolute inset-0 bg-gradient-to-br opacity-40 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundImage: `linear-gradient(to bottom right, ${stat.accent})` }}
                />

                <CardContent className="p-5 sm:p-6 relative z-10 flex flex-col justify-between h-full space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm transition-transform group-hover:scale-105", stat.iconBg)}>
                      <Icon className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <Badge variant="outline" className="text-[10px] font-bold py-0.5 px-2 bg-background/50 border-border/60 text-muted-foreground uppercase tracking-wider backdrop-blur-sm">
                      {stat.badge}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-1 font-mono">
                      {stat.value}
                    </p>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <span>{stat.label}</span>
                      <span className="text-muted-foreground/40 font-normal">·</span>
                      <span className="text-muted-foreground/60 font-medium normal-case">{stat.subtext}</span>
                    </p>
                  </div>

                  {/* Micro Progress Bar for Progress Card */}
                  {stat.isProgress && (
                    <div className="w-full bg-muted/40 h-1.5 rounded-full overflow-hidden border border-border/40 pt-0">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Main Layout Grid (Left: 65% / Right: 35%) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* ── LEFT COLUMN (65% width) ── */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          
          {/* ── Continue Learning Cinema Card or Next Drop HUD ── */}
          <motion.div variants={itemVariants}>
            {continueLesson ? (
              <Card className="relative overflow-hidden bg-gradient-to-b from-card to-card/80 backdrop-blur-2xl border-2 border-border/80 shadow-xl rounded-3xl group transition-all duration-300 hover:border-amber-500/40">
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col md:flex-row bg-background/60 rounded-2xl overflow-hidden border border-border/50">
                    {/* Cinematic Media Thumbnail Frame */}
                    <div className="relative w-full md:w-2/5 min-h-[190px] sm:min-h-[220px] overflow-hidden bg-black flex items-center justify-center shrink-0 group/thumb">
                      {continueModule?.imageUrl ? (
                        <>
                          <img
                            src={continueModule.imageUrl}
                            alt={continueModule.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover/thumb:scale-110 opacity-90"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
                          <BookOpen className="w-12 h-12 text-zinc-600" />
                        </div>
                      )}

                      {/* Radar Pulse Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 border border-white/15 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
                          {t("dash_in_progress")}
                        </span>
                      </div>

                      {/* Hover Center Play Button */}
                      <Link
                        href={`/dashboard/modules/${continueModule?.id}/${continueLesson.id}`}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="w-14 h-14 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xl shadow-amber-500/40 transform transition-all duration-300 group-hover/thumb:scale-110 hover:bg-amber-400">
                          <PlayCircle className="w-7 h-7 fill-white/20" />
                        </div>
                      </Link>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-amber-500 mb-2">
                          <Zap className="w-4 h-4 fill-amber-500" />
                          <span className="text-xs font-black uppercase tracking-widest">{t("dash_continue_watching")}</span>
                        </div>
                        
                        <h4 className="text-xl sm:text-2xl font-black text-foreground mb-2 leading-tight tracking-tight group-hover:text-amber-500 transition-colors">
                          {continueLesson.title}
                        </h4>
                        
                        <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 line-clamp-1">
                          <span className="text-muted-foreground/60 uppercase tracking-wider">{t("dash_module_prefix")}</span>
                          <span className="text-foreground font-bold">{continueModule?.title || "Module"}</span>
                        </p>
                      </div>
                      
                      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <Link href={`/dashboard/modules/${continueModule?.id}/${continueLesson.id}`} className="flex-1">
                          <Button size="lg" className="w-full gap-2 rounded-2xl font-black text-xs sm:text-sm h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25 border-0">
                            <PlayCircle className="w-5 h-5" />
                            <span>{t("dash_jump_right_in")}</span>
                            <ArrowRight className="w-4 h-4 ml-auto" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Futuristic Countdown HUD */
              <Card className="relative overflow-hidden border-2 border-white/10 shadow-2xl rounded-3xl bg-gradient-to-br from-[#0a0d14] via-[#07090e] to-black">
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-500/15 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
                
                <CardContent className="p-6 sm:p-10 relative z-10 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] backdrop-blur-md mb-4">
                      <div className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                      <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                      <span className="text-[11px] font-black uppercase tracking-wider text-orange-300">
                        {t("dash_countdown_badge")}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
                      {t("dash_begin_evolution")}
                    </h3>
                    <p className="text-slate-300 text-sm max-w-xl leading-relaxed font-normal">
                      {t("dash_begin_evolution_sub")}
                    </p>
                  </div>

                  {/* High-Tech Digital Timer Blocks */}
                  <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-lg">
                    {[
                      { label: t("dash_unit_days"), value: isClient ? String(timeLeft.days).padStart(2, '0') : '--' },
                      { label: t("dash_unit_hours"), value: isClient ? String(timeLeft.hours).padStart(2, '0') : '--' },
                      { label: t("dash_unit_minutes"), value: isClient ? String(timeLeft.minutes).padStart(2, '0') : '--' },
                      { label: t("dash_unit_seconds"), value: isClient ? String(timeLeft.seconds).padStart(2, '0') : '--' },
                    ].map((item) => (
                      <div key={item.label} className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/[0.1] backdrop-blur-xl shadow-inner">
                        <span className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono text-center">
                          {item.value}
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-bold text-orange-300/80 uppercase tracking-widest mt-1">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                    <Link href="/dashboard/modules">
                      <Button className="h-12 px-7 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-orange-500/25 border-0 gap-2">
                        <span>{t("dash_browse_curriculum")}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                      <Clock className="w-4 h-4 text-orange-400" />
                      <span>{t("dash_lessons_drop_schedule")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* ── Mastery Progress Hub & Updates Split (5-col grid) ── */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            
            {/* Circular Mastery Ring Card (2 Cols) */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <Card className="h-full bg-gradient-to-b from-card to-card/80 backdrop-blur-2xl border border-border/80 shadow-md rounded-3xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
                
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full space-y-4">
                  {/* Glowing SVG Ring */}
                  <div className="relative w-36 h-36">
                    <svg className="w-full h-full -rotate-90 transform drop-shadow-md" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" className="text-muted/20" strokeWidth="7" />
                      <motion.circle
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.4, ease: "easeOut" }}
                        cx="60" cy="60" r="54" fill="none"
                        stroke="url(#progressRingGradient10x)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                      />
                      <defs>
                        <linearGradient id="progressRingGradient10x" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#F59E0B" />
                          <stop offset="100%" stopColor="#FF6B4A" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-foreground font-mono tracking-tight">{progressPercent}%</span>
                      <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest mt-0.5">{t("dash_mastered")}</span>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2">
                      <Badge variant="outline" className={cn("text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full", masteryRank.bg, masteryRank.color)}>
                        {masteryRank.title}
                      </Badge>
                    </div>
                    <h4 className="font-black text-foreground text-base tracking-tight mb-0.5">{t("dash_global_mastery")}</h4>
                    <p className="text-xs text-muted-foreground font-medium">
                      <span className="text-foreground font-black">{completedLessons}</span> {t("dash_out_of")} <span className="text-foreground font-black">{totalLessons}</span> {t("dash_milestones")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Updates & Intel Announcements Card (3 Cols) */}
            <motion.div variants={itemVariants} className="md:col-span-3">
              <Card className="h-full bg-gradient-to-b from-card to-card/80 backdrop-blur-2xl border border-border/80 shadow-md rounded-3xl overflow-hidden flex flex-col">
                <CardHeader className="border-b border-border/40 py-4 px-6 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-foreground text-sm font-black flex items-center gap-2.5 tracking-tight">
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
                        <Megaphone className="w-4 h-4" />
                      </div>
                      <span>{t("dash_updates_intel")}</span>
                    </CardTitle>
                    {announcements.length > 0 && (
                      <Badge className="bg-indigo-500 text-white font-black px-2.5 py-0.5 text-[10px] rounded-lg">
                        {announcements.length} {t("dash_new")}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-0 flex-1 overflow-hidden">
                  {announcements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-2">
                      <div className="w-10 h-10 rounded-full bg-muted/40 flex items-center justify-center text-muted-foreground">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      </div>
                      <p className="text-xs font-bold text-foreground">{t("dash_all_caught_up")}</p>
                      <p className="text-[11px] text-muted-foreground">{t("dash_check_back_later")}</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/30 h-full overflow-auto no-scrollbar">
                      {announcements.map((announcement: any) => (
                        <div key={announcement.id} className="p-4 sm:p-5 hover:bg-muted/25 transition-colors group">
                          <div className="flex items-start gap-3.5">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0 shadow-sm shadow-indigo-500/50" />
                            <div className="min-w-0 flex-1 space-y-1">
                              <h5 className="text-xs sm:text-sm font-black text-foreground group-hover:text-indigo-400 transition-colors leading-snug">
                                {announcement.title}
                              </h5>
                              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                {announcement.content}
                              </p>
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

          {/* ── Command Center Bento Grid ── */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-3.5 px-1">
              <h3 className="text-xs sm:text-sm font-black text-foreground flex items-center gap-2 uppercase tracking-widest">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{t("dash_command_center")}</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { title: t("dash_community"), desc: t("dash_network_grow"), href: "/dashboard/community", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20", glow: "hover:border-blue-500/40 hover:shadow-blue-500/10", pill: "Active" },
                { title: t("dash_missions"), desc: t("dash_track_objectives"), href: "/dashboard/goals", icon: Target, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20", glow: "hover:border-amber-500/40 hover:shadow-amber-500/10", pill: "Goals" },
                { title: t("dash_career_path"), desc: t("dash_map_future"), href: "/dashboard/career", icon: Compass, color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/20", glow: "hover:border-purple-500/40 hover:shadow-purple-500/10", pill: "Path" },
                { title: t("dash_vault"), desc: t("dash_access_resources"), href: "/dashboard/resources", icon: FileText, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20", glow: "hover:border-emerald-500/40 hover:shadow-emerald-500/10", pill: "Files" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className="block group">
                    <Card className={cn(
                      "h-full bg-gradient-to-b from-card via-card/90 to-card/70 backdrop-blur-xl border border-border/80 transition-all duration-300 rounded-3xl shadow-sm hover:shadow-lg hover:-translate-y-1 p-0 overflow-hidden",
                      item.glow
                    )}>
                      <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-3">
                        <div className="flex items-center justify-between">
                          <div className={cn("w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110", item.bg)}>
                            <Icon className={cn("w-5 h-5", item.color)} />
                          </div>
                          <div className="w-6 h-6 rounded-full bg-muted/40 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>

                        <div>
                          <p className="text-xs sm:text-sm font-black text-foreground group-hover:text-primary transition-colors tracking-tight">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5 font-bold">
                            {item.desc}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* ── Recent Activity Timeline ── */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-b from-card to-card/80 backdrop-blur-2xl border border-border/80 shadow-md rounded-3xl overflow-hidden">
              <CardHeader className="py-4 px-6 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground text-sm font-black flex items-center gap-2.5 tracking-tight">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <span>{t("dash_activity_log")}</span>
                  </CardTitle>
                  <Link href="/dashboard/modules" className="text-xs font-bold text-amber-500 hover:text-amber-600 flex items-center gap-1 transition-colors">
                    <span>{t("dash_view_all")}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-5">
                {recentlyWatched.length === 0 ? (
                  <div className="text-center py-10 space-y-1">
                    <p className="text-xs font-bold text-foreground">{t("dash_canvas_blank")}</p>
                    <p className="text-[11px] text-muted-foreground">{t("dash_start_consuming")}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {recentlyWatched.map((p: any) => (
                      <Link
                        key={p.id}
                        href={`/dashboard/modules/${p.lesson.moduleId}/${p.lessonId}`}
                        className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-muted/20 hover:bg-muted/40 border border-border/40 hover:border-border transition-all duration-200 group"
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105",
                          p.isCompleted ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/25" : "bg-blue-500/10 text-blue-500 border-blue-500/25"
                        )}>
                          {p.isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                        </div>
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <p className="text-xs font-bold text-foreground truncate group-hover:text-amber-500 transition-colors">
                            {p.lesson.title}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate uppercase tracking-widest font-bold">
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
        <div className="lg:col-span-4 space-y-6 sm:space-y-8">

          {/* 1. Real Gamification Streak Tracker */}
          <motion.div variants={itemVariants}>
            {streakData && <StreakWidget initialStreak={streakData} />}
          </motion.div>

          {/* 2. Official Course Completion Certificate Card */}
          <motion.div variants={itemVariants}>
            <CertificateCard
              studentName={studentName || firstName}
              userClerkId={userClerkId}
              isCompleted={progressPercent === 100}
              progressPercent={progressPercent}
            />
          </motion.div>

          {/* 3. Global Academy Leaderboard */}
          <motion.div variants={itemVariants}>
            <LeaderboardWidget users={leaderboard} />
          </motion.div>

          {/* 4. Live Broadcasts & Masterclass Stage Card */}
          <motion.div variants={itemVariants}>
            <Card className="border border-border/80 bg-gradient-to-b from-card to-card/80 backdrop-blur-2xl shadow-md rounded-3xl overflow-hidden">
              <CardHeader className="py-4 px-6 border-b border-border/40 bg-muted/20">
                <CardTitle className="text-foreground text-sm font-black flex items-center gap-2.5 tracking-tight">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20">
                    <Video className="w-4 h-4" />
                  </div>
                  <span>{t("dash_live_broadcasts")}</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                {upcomingCall ? (
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-500 text-xs font-black animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>{t("dash_live")}</span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-black text-foreground leading-snug tracking-tight">
                        {upcomingCall.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Interactive Live Workshop & Direct Q&A
                      </p>
                    </div>

                    <div className="text-xs font-bold text-foreground bg-muted/50 border border-border/60 px-4 py-2 rounded-xl w-full font-mono">
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
                        <Button size="lg" className="w-full font-black text-xs sm:text-sm h-11 bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20 gap-2 rounded-xl">
                          <span>{t("dash_join_broadcast")}</span>
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto text-muted-foreground/40">
                      <Video className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-black text-foreground tracking-tight">{t("dash_no_broadcasts")}</p>
                    <p className="text-[11px] text-muted-foreground">{t("dash_stay_tuned")}</p>
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
