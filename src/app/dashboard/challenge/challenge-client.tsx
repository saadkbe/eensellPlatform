"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award,
  Zap,
  Filter,
  Check,
  Flame,
  Layers,
  ArrowRight,
  Share2,
  Trophy,
  X,
  MessageSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import confetti from "canvas-confetti";
import { ROADMAP_DAYS, ROADMAP_PHASES, RoadmapDay, RoadmapPhase, getRoadmapDay } from "@/data/roadmap-data";
import { toggleDayCompletion } from "@/actions/challenge.actions";
import { shareMilestoneWinToCommunity } from "@/actions/community.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/landing/LanguageProvider";

interface ChallengeClientProps {
  initialCompletedDays: number[];
  initialUserXp: number;
}

export function ChallengeClient({
  initialCompletedDays,
  initialUserXp,
}: ChallengeClientProps) {
  const { t, dir, isRTL } = useLanguage();
  const [completedDays, setCompletedDays] = useState<number[]>(initialCompletedDays);
  const [userXp, setUserXp] = useState<number>(initialUserXp);
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({});
  const [isPending, startTransition] = useTransition();

  // 1-Click "Share Win to Community" Celebration State
  const [celebrationDay, setCelebrationDay] = useState<number | null>(null);
  const [reflectionText, setReflectionText] = useState("");
  const [isSharingWin, setIsSharingWin] = useState(false);
  const [sharedPostId, setSharedPostId] = useState<string | null>(null);

  const celebrationRoadmap = celebrationDay ? getRoadmapDay(celebrationDay) : null;

  const totalCompleted = completedDays.length;
  const progressPercentage = Math.min(100, Math.round((totalCompleted / 60) * 100));

  // Determine current day (first uncompleted day, 1..60)
  const completedSet = new Set(completedDays);
  let currentDay = 1;
  for (let d = 1; d <= 60; d++) {
    if (!completedSet.has(d)) {
      currentDay = d;
      break;
    }
  }
  if (totalCompleted >= 60) currentDay = 60;

  // Toggle card expansion
  const toggleExpand = (dayNumber: number) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayNumber]: !prev[dayNumber],
    }));
  };

  // Toggle day completion with optimistic UI
  const handleToggleDay = (dayNumber: number) => {
    const isCurrentlyCompleted = completedSet.has(dayNumber);

    // Optimistic state updates
    if (isCurrentlyCompleted) {
      setCompletedDays((prev) => prev.filter((d) => d !== dayNumber));
      setUserXp((prev) => Math.max(0, prev - 50));
    } else {
      setCompletedDays((prev) => [...prev, dayNumber].sort((a, b) => a - b));
      setUserXp((prev) => prev + 50);
    }

    startTransition(async () => {
      try {
        const result = await toggleDayCompletion(dayNumber);
        if (result.success) {
          setCompletedDays(result.completedDays);
          setUserXp(result.updatedXp);
          if (result.isCompleted) {
            toast.success(`Day ${dayNumber} completed! +50 XP earned 🔥`);

            // Trigger celebratory confetti burst
            try {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ["#F59E0B", "#F97316", "#10B981", "#3B82F6", "#FFFFFF"],
              });
            } catch (e) {}

            // Open 1-Click "Share Win to Community" Modal
            setCelebrationDay(dayNumber);
            setReflectionText("");
            setSharedPostId(null);
          } else {
            toast.info(`Day ${dayNumber} marked uncompleted (-50 XP)`);
          }
        }
      } catch (error) {
        // Revert on error
        setCompletedDays(initialCompletedDays);
        setUserXp(initialUserXp);
        toast.error("Failed to update challenge progress. Please try again.");
      }
    });
  };

  const openShareModal = (dayNumber: number) => {
    setCelebrationDay(dayNumber);
    setReflectionText("");
    setSharedPostId(null);
  };

  const handleShareWin = () => {
    if (!celebrationDay) return;
    setIsSharingWin(true);
    startTransition(async () => {
      try {
        const res = await shareMilestoneWinToCommunity(celebrationDay, reflectionText);
        if (res.success) {
          setSharedPostId(res.postId || "shared");
          toast.success(t("win_modal_btn_shared"));
        } else {
          toast.error("Failed to share win to community");
        }
      } catch (e) {
        toast.error("Error sharing win. Please try again.");
      } finally {
        setIsSharingWin(false);
      }
    });
  };

  // Filter roadmap days
  const filteredDays = selectedPhase === "all"
    ? ROADMAP_DAYS
    : ROADMAP_DAYS.filter((d) => d.phaseId === selectedPhase);

  // Linear segmented bar
  const totalSegments = 20;
  const activeSegments = Math.round((progressPercentage / 100) * totalSegments);

  return (
    <div className="space-y-8 pb-16 w-full">
      {/* ── Top Hero / Milestone Banner in Orangish-Yellow Accent ── */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-400/40 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 p-6 sm:p-10 shadow-2xl shadow-amber-500/20 text-slate-950">
        {/* Subtle mesh & glow highlights */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.12] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/[0.15] rounded-full blur-[80px] pointer-events-none" />
        <div 
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/20 border border-slate-950/25 text-slate-950 text-xs font-black tracking-wide uppercase mb-4 backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              {t("roadmap_hero_badge")}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight mb-3">
              {t("roadmap_hero_title")}
            </h1>
            <p className="text-sm sm:text-base text-slate-950/85 font-medium leading-relaxed max-w-xl">
              {t("roadmap_hero_sub")}
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap lg:flex-nowrap gap-3 sm:gap-4 shrink-0 w-full lg:w-auto">
            <div className="flex-1 lg:flex-none p-4 sm:p-5 rounded-2xl bg-slate-950/30 border border-white/20 backdrop-blur-xl min-w-[130px] shadow-lg">
              <div className="flex items-center gap-2 text-amber-200 text-xs font-bold uppercase tracking-wider mb-1">
                <Target className="w-3.5 h-3.5 text-amber-300" />
                {t("roadmap_stat_progress")}
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white font-mono">
                {totalCompleted} <span className="text-sm text-amber-200/70 font-normal">/ 60</span>
              </p>
              <p className="text-[11px] text-white font-bold mt-0.5">{progressPercentage}% {t("roadmap_stat_finished")}</p>
            </div>

            <div className="flex-1 lg:flex-none p-4 sm:p-5 rounded-2xl bg-slate-950/30 border border-white/20 backdrop-blur-xl min-w-[130px] shadow-lg">
              <div className="flex items-center gap-2 text-amber-200 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {t("roadmap_stat_xp")}
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white font-mono">
                {userXp.toLocaleString()}
              </p>
              <p className="text-[11px] text-white font-bold mt-0.5">{t("roadmap_stat_per_day")}</p>
            </div>

            <div className="flex-1 lg:flex-none p-4 sm:p-5 rounded-2xl bg-slate-950/30 border border-white/20 backdrop-blur-xl min-w-[130px] shadow-lg">
              <div className="flex items-center gap-2 text-amber-200 text-xs font-bold uppercase tracking-wider mb-1">
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                Active Focus
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white font-mono">
                Day {currentDay}
              </p>
              <p className="text-[11px] text-white font-bold mt-0.5">Next Milestone</p>
            </div>
          </div>
        </div>

        {/* ── Linear Segmented High-Contrast Progress Bar ── */}
        <div className="mt-8 pt-6 border-t border-slate-950/15 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-950">
              Overall Roadmap Completion: <strong className="text-white drop-shadow-sm">{progressPercentage}% Completed</strong> (Day {currentDay} / 60)
            </span>
            <span className="text-slate-950 font-mono text-[11px] font-bold">
              {60 - totalCompleted} days remaining
            </span>
          </div>

          <div className="flex items-center gap-1.5 w-full">
            {Array.from({ length: totalSegments }).map((_, index) => {
              const isCompleted = index < activeSegments;
              const isCurrent = index === activeSegments;
              return (
                <div
                  key={index}
                  className={cn(
                    "h-2.5 rounded-full flex-1 transition-all duration-500",
                    isCompleted
                      ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                      : isCurrent
                      ? "bg-slate-950 border border-white animate-pulse"
                      : "bg-slate-950/25 border border-slate-950/10"
                  )}
                />
              );
            })}
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-slate-950/80 font-bold pt-1">
            <span>Phase 1: Foundation (1–10)</span>
            <span>Phase 2: Core Builds (11–25)</span>
            <span>Phase 3: Acquisition (26–40)</span>
            <span>Phase 4: Sales & Scale (41–60)</span>
          </div>
        </div>
      </div>

      {/* ── Phase Filter Tabs ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedPhase("all")}
          className={cn(
            "px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border",
            selectedPhase === "all"
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] font-black"
              : "bg-white/[0.03] text-slate-300 border-white/[0.06] hover:bg-white/[0.06]"
          )}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{t("roadmap_phase_all")}</span>
        </button>

        {ROADMAP_PHASES.map((phase) => {
          const isActive = selectedPhase === phase.id;
          return (
            <button
              key={phase.id}
              type="button"
              onClick={() => setSelectedPhase(phase.id)}
              className={cn(
                "px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border",
                isActive
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] font-black"
                  : "bg-white/[0.03] text-slate-300 border-white/[0.06] hover:bg-white/[0.06]"
              )}
            >
              <span>{phase.shortTitle}</span>
              <span className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-md",
                isActive ? "bg-slate-950/20 text-slate-950 font-bold" : "bg-white/[0.06] text-slate-400"
              )}>
                {phase.dayRange}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── 60-Day Grid / Card Feed ── */}
      <div className="space-y-4">
        {filteredDays.map((day) => {
          const isCompleted = completedSet.has(day.dayNumber);
          const isCurrent = day.dayNumber === currentDay && !isCompleted;
          const isExpanded = !!expandedDays[day.dayNumber];

          return (
            <Card
              key={day.dayNumber}
              className={cn(
                "overflow-hidden transition-all duration-300 rounded-2xl border",
                isCurrent
                  ? "bg-[#0F1117] border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/30"
                  : isCompleted
                  ? "bg-card/40 border-amber-500/20 backdrop-blur-md opacity-90 hover:opacity-100"
                  : "bg-[#0B0C10]/80 border-white/[0.06] hover:border-white/[0.12] backdrop-blur-md"
              )}
            >
              <CardContent className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Left: Checkbox & Info */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Toggle Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleDay(day.dayNumber)}
                      className={cn(
                        "mt-1 w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 border",
                        isCompleted
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 border-amber-400 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                          : isCurrent
                          ? "bg-white/[0.04] border-amber-400/60 text-slate-400 hover:border-amber-400 hover:bg-amber-500/10"
                          : "bg-white/[0.02] border-white/[0.1] text-slate-500 hover:border-white/30"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500" />
                      )}
                    </button>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-black text-amber-400">
                          DAY {day.dayNumber}
                        </span>
                        <span className="text-white/20">•</span>
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          {day.phaseShort}
                        </span>
                        <span className="text-white/20">•</span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>{day.estimatedTime}</span>
                        </div>

                        {isCurrent && (
                          <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                            Active Mission
                          </Badge>
                        )}
                        {isCompleted && (
                          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px] font-semibold">
                            +50 XP Earned
                          </Badge>
                        )}
                      </div>

                      <h3
                        className={cn(
                          "text-base sm:text-lg font-bold tracking-tight transition-colors",
                          isCompleted
                            ? "text-slate-300 line-through opacity-80"
                            : isCurrent
                            ? "text-white"
                            : "text-slate-200"
                        )}
                      >
                        {day.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
                        {day.summary}
                      </p>
                    </div>
                  </div>

                  {/* Right: Expand / Action */}
                  <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                    {isCompleted && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openShareModal(day.dayNumber)}
                        className="text-xs font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 h-9 px-3 rounded-xl gap-1.5 cursor-pointer shadow-sm transition-all hover:scale-105"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{t("win_card_share_btn")}</span>
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(day.dayNumber)}
                      className="text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.05] h-9 px-3 rounded-xl gap-1.5 border border-white/[0.04]"
                    >
                      <span>{isExpanded ? "Hide Details" : "View Deliverables"}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* ── Expandable Deliverables Drawer ── */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="mt-5 pt-5 border-t border-white/[0.06] space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                              <Target className="w-3.5 h-3.5 text-amber-400" />
                              Required Deliverables & Checklist
                            </h4>
                            <span className="text-[11px] font-mono text-amber-400">
                              Reward: +{day.xpReward} XP
                            </span>
                          </div>

                          <div className="space-y-2">
                            {day.deliverables.map((item, idx) => (
                              <div
                                key={idx}
                                className={cn(
                                  "flex items-start gap-3 p-3 rounded-xl border text-xs sm:text-sm transition-colors",
                                  isCompleted
                                    ? "bg-amber-500/[0.03] border-amber-500/10 text-slate-300"
                                    : "bg-white/[0.02] border-white/[0.04] text-slate-300"
                                )}
                              >
                                <span className="flex h-5 w-5 rounded-md bg-white/[0.05] items-center justify-center text-[10px] font-mono font-bold text-slate-400 shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <span className="leading-relaxed">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bottom Action inside Drawer */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                          <span className="text-xs text-slate-400 font-medium">
                            {isCompleted
                              ? "Marked as completed. You can uncheck if you need to revisit."
                              : "Complete all deliverables then click below to record progress."}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => handleToggleDay(day.dayNumber)}
                            className={cn(
                              "w-full sm:w-auto h-9 px-5 rounded-xl text-xs font-bold transition-all border-0",
                              isCompleted
                                ? "bg-white/[0.06] hover:bg-white/[0.1] text-slate-300"
                                : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                            )}
                          >
                            {isCompleted ? "Unmark Day" : `Complete Day ${day.dayNumber} (+50 XP)`}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── 1-Click "Share Win to Community" Celebration Modal ── */}
      <AnimatePresence>
        {celebrationDay !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" dir={dir}>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCelebrationDay(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
              className="relative w-full max-w-lg rounded-3xl bg-[#0c0e15] border border-amber-500/40 p-6 sm:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.85)] z-10 overflow-hidden text-slate-100"
            >
              {/* Glowing ambient background auras */}
              <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/20 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-orange-500/20 rounded-full blur-[80px] pointer-events-none" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setCelebrationDay(null)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative z-10 space-y-5">
                {/* Header Icon + XP Badge */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30 shrink-0">
                    <Trophy className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
                        {t("win_modal_xp")}
                      </span>
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                      {t("win_modal_title")}
                    </h3>
                  </div>
                </div>

                {/* Milestone Detail Card */}
                {celebrationRoadmap && (
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-amber-400 font-bold uppercase tracking-wider">
                      <span>Day {celebrationRoadmap.dayNumber}</span>
                      <span>{celebrationRoadmap.phaseShort}</span>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-white leading-snug">
                      {celebrationRoadmap.title}
                    </p>
                  </div>
                )}

                {/* Subtitle Prompt */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {t("win_modal_sub")}
                </p>

                {/* Optional Reflection Textarea (only if not yet shared) */}
                {!sharedPostId ? (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                      {t("win_modal_note_label")}
                    </label>
                    <Textarea
                      value={reflectionText}
                      onChange={(e) => setReflectionText(e.target.value)}
                      placeholder={t("win_modal_note_placeholder")}
                      rows={3}
                      className="w-full bg-[#141724] border-white/15 rounded-2xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-amber-500/50 resize-none p-3.5 leading-relaxed"
                    />
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-sm font-bold">
                      {t("win_modal_btn_shared")}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  {!sharedPostId ? (
                    <>
                      <Button
                        onClick={handleShareWin}
                        disabled={isSharingWin}
                        className="w-full sm:flex-1 h-12 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 border-0 gap-2 cursor-pointer transition-transform hover:scale-[1.02]"
                      >
                        <Flame className="w-4 h-4 fill-slate-950" />
                        <span>
                          {isSharingWin ? t("win_modal_btn_sharing") : t("win_modal_btn_share")}
                        </span>
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setCelebrationDay(null)}
                        className="w-full sm:w-auto h-12 rounded-2xl text-xs sm:text-sm font-bold text-slate-400 hover:text-white cursor-pointer"
                      >
                        {t("win_modal_btn_skip")}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/dashboard/community" className="w-full sm:flex-1">
                        <Button className="w-full h-12 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm gap-2 cursor-pointer">
                          <MessageSquare className="w-4 h-4" />
                          <span>{t("win_modal_btn_view_community")}</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        onClick={() => setCelebrationDay(null)}
                        className="w-full sm:w-auto h-12 rounded-2xl text-xs sm:text-sm font-bold text-slate-400 hover:text-white cursor-pointer"
                      >
                        {t("win_modal_btn_skip")}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
