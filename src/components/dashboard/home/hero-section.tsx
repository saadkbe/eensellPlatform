"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Target, Clock, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/components/landing/LanguageProvider";
import { getRoadmapDay } from "@/data/roadmap-data";
import { toggleDayCompletion } from "@/actions/challenge.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  firstName: string;
  greeting: string;
  challengeProgress: any;
}

export function HeroSection({
  firstName,
  greeting,
  challengeProgress,
}: HeroSectionProps) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();

  // Completed days array
  const initialCompletedDays: number[] = Array.isArray(challengeProgress?.completedDays)
    ? challengeProgress.completedDays
    : typeof challengeProgress?.completedDays === "number"
    ? Array.from({ length: challengeProgress.completedDays }, (_, i) => i + 1)
    : [];

  const [completedList, setCompletedList] = useState<number[]>(initialCompletedDays);

  const completedDays = completedList.length;
  const progressPercent = Math.min(100, Math.round((completedDays / 60) * 100));

  // Determine current day (first uncompleted day, 1..60)
  const completedSet = new Set(completedList);
  let currentDay = 1;
  for (let d = 1; d <= 60; d++) {
    if (!completedSet.has(d)) {
      currentDay = d;
      break;
    }
  }
  if (completedDays >= 60) currentDay = 60;

  const isTodayCompleted = completedSet.has(currentDay);
  const roadmapDay = getRoadmapDay(currentDay);
  const currentMission = roadmapDay?.title || "Continue your 60-day challenge journey";
  const currentPhase = roadmapDay?.phaseName || "Phase 1: Setup";
  const estimatedTime = roadmapDay?.estimatedTime || "25m";
  const daysRemaining = Math.max(0, 60 - completedDays);

  // Generate Segmented Progress Bar (20 segments)
  const totalSegments = 20;
  const activeSegments = Math.round((progressPercent / 100) * totalSegments);

  const handleToggleCurrentDay = () => {
    const targetDay = currentDay;
    const isAlreadyCompleted = completedSet.has(targetDay);

    // Optimistic UI
    if (isAlreadyCompleted) {
      setCompletedList((prev) => prev.filter((d) => d !== targetDay));
    } else {
      setCompletedList((prev) => [...prev, targetDay].sort((a, b) => a - b));
    }

    startTransition(async () => {
      try {
        const result = await toggleDayCompletion(targetDay);
        if (result.success) {
          setCompletedList(result.completedDays);
          if (result.isCompleted) {
            toast.success(`Day ${targetDay} completed! +50 XP awarded 🔥`);
          } else {
            toast.info(`Day ${targetDay} marked uncompleted (-50 XP)`);
          }
        }
      } catch (error) {
        setCompletedList(initialCompletedDays);
        toast.error("Failed to update challenge progress.");
      }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0a0b10] shadow-2xl"
    >
      {/* Background Gradients & Meshes - Orangish Yellow Accents */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.06] via-transparent to-orange-500/[0.06]" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-20 left-1/2 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none -translate-x-1/2" />
      
      {/* Linear Style Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col md:flex-row gap-8 md:gap-12">
        
        {/* Left Column: Greeting & Challenge Progress */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 backdrop-blur-md mb-4 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-semibold text-amber-200/90">{greeting}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-6">
              {t("dash_welcome_back")}, {firstName} 👋
            </h1>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 sm:p-6 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
                  {t("roadmap_hero_badge")}
                </h2>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-white font-bold font-mono">DAY {currentDay} / 60</span>
                  <span className="text-white/40">•</span>
                  <span className="text-slate-400">{completedDays} {t("dash_days")} {t("roadmap_stat_finished")}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 font-mono">
                  {progressPercent}%
                </span>
              </div>
            </div>

            {/* Segmented bar in glowing orangish yellow */}
            <div className="flex items-center gap-1.5 w-full mb-4">
              {Array.from({ length: totalSegments }).map((_, index) => {
                const isCompleted = index < activeSegments;
                const isCurrent = index === activeSegments;
                return (
                  <div
                    key={index}
                    className={cn(
                      "h-2 rounded-full flex-1 transition-all duration-300",
                      isCompleted
                        ? "bg-gradient-to-r from-amber-500 to-orange-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                        : isCurrent
                        ? "bg-amber-400/40 border border-amber-400 animate-pulse"
                        : "bg-white/[0.06]"
                    )}
                  />
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-white/50 uppercase tracking-wider text-[11px]">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {daysRemaining} {t("dash_days")}
              </div>
              <div className="text-[11px] font-bold px-2.5 py-1 bg-amber-500/10 rounded-md text-amber-400 border border-amber-500/20">
                {currentPhase}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Today's Focus & Action */}
        <div className="flex-1 flex flex-col justify-end">
          <div className="flex flex-col h-full justify-between bg-gradient-to-br from-amber-500/[0.05] to-transparent border border-amber-500/[0.15] rounded-2xl p-6 sm:p-7">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">{t("dash_missions")}</h3>
                </div>
                <span className="text-[11px] font-semibold text-amber-300 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                  {t("roadmap_day")} {currentDay} / 60
                </span>
              </div>
              
              <p className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug line-clamp-2">
                {currentMission}
              </p>

              {roadmapDay?.summary && (
                <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                  {roadmapDay.summary}
                </p>
              )}
              
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
                <Target className="w-4 h-4 text-amber-400" />
                <span>Estimated time: {estimatedTime} • XP Reward: +50 XP</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-auto">
              <Link href="/dashboard/challenge" className="w-full sm:w-auto flex-1">
                <Button className="w-full h-11 px-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all hover:scale-[1.02] group border-0 rounded-xl">
                  <span className="flex items-center justify-center gap-2">
                    Open 60-Day Roadmap
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-slate-950" />
                  </span>
                </Button>
              </Link>

              <Button
                type="button"
                onClick={handleToggleCurrentDay}
                disabled={isPending}
                variant="outline"
                className={cn(
                  "w-full sm:w-auto h-11 px-4 rounded-xl font-bold text-xs border transition-all gap-2",
                  isTodayCompleted
                    ? "bg-amber-500/15 border-amber-500/30 text-amber-400 hover:bg-amber-500/25"
                    : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06] text-white"
                )}
              >
                {isTodayCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>Completed ✓</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Mark Day {currentDay} Done (+50 XP)</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        
      </div>
    </motion.div>
  );
}
