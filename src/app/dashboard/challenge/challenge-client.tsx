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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROADMAP_DAYS, ROADMAP_PHASES, RoadmapDay, RoadmapPhase } from "@/data/roadmap-data";
import { toggleDayCompletion } from "@/actions/challenge.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ChallengeClientProps {
  initialCompletedDays: number[];
  initialUserXp: number;
}

export function ChallengeClient({
  initialCompletedDays,
  initialUserXp,
}: ChallengeClientProps) {
  const [completedDays, setCompletedDays] = useState<number[]>(initialCompletedDays);
  const [userXp, setUserXp] = useState<number>(initialUserXp);
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({});
  const [isPending, startTransition] = useTransition();

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

  // Filter roadmap days
  const filteredDays = selectedPhase === "all"
    ? ROADMAP_DAYS
    : ROADMAP_DAYS.filter((d) => d.phaseId === selectedPhase);

  // Linear segmented bar
  const totalSegments = 20;
  const activeSegments = Math.round((progressPercentage / 100) * totalSegments);

  return (
    <div className="space-y-8 pb-16 w-full">
      {/* ── Top Hero / Milestone Banner ── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0A0B10] p-6 sm:p-10 shadow-2xl">
        {/* Glow Effects - Orangish Yellow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/[0.08] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-orange-500/[0.05] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold tracking-wide uppercase mb-4 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              <Zap className="w-3.5 h-3.5" />
              60-Day AI Agency Sprint
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-3">
              Your 60-Day <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400">Mastery Roadmap</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl">
              From zero to a cash-flowing AI Automation Agency. Complete one high-impact milestone daily to systematically build, launch, and scale.
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap lg:flex-nowrap gap-3 sm:gap-4 shrink-0 w-full lg:w-auto">
            <div className="flex-1 lg:flex-none p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md min-w-[130px]">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                Progress
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white font-mono">
                {totalCompleted} <span className="text-sm text-slate-500 font-normal">/ 60</span>
              </p>
              <p className="text-[11px] text-amber-400 font-bold mt-0.5">{progressPercentage}% Finished</p>
            </div>

            <div className="flex-1 lg:flex-none p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md min-w-[130px]">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Total XP
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white font-mono">
                {userXp.toLocaleString()}
              </p>
              <p className="text-[11px] text-amber-400 font-bold mt-0.5">+50 XP Per Day</p>
            </div>

            <div className="flex-1 lg:flex-none p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md min-w-[130px]">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                Active Focus
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white font-mono">
                Day {currentDay}
              </p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Next Milestone</p>
            </div>
          </div>
        </div>

        {/* ── Linear Segmented Neon Orangish-Yellow Progress Bar ── */}
        <div className="mt-8 pt-6 border-t border-white/[0.06] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">
              Overall Roadmap Completion: <strong className="text-amber-400">{progressPercentage}% Completed</strong> (Day {currentDay} / 60)
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
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
                      ? "bg-gradient-to-r from-amber-500 to-orange-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                      : isCurrent
                      ? "bg-amber-400/40 border border-amber-400 animate-pulse"
                      : "bg-white/[0.04] border border-white/[0.04]"
                  )}
                />
              );
            })}
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pt-1">
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
          <span>All Days (60)</span>
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
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
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
    </div>
  );
}
