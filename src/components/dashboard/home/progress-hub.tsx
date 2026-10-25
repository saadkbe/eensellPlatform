"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles, Wallet, ShieldCheck, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProgressHubProps {
  completedDays?: number;
  totalDays?: number;
  currentPhaseName?: string;
  activeDayNumber?: number;
  userXp?: number;
  referralEarnings?: number;
  tierStatus?: string;
  activeLessonUrl?: string;
}

export function ProgressHub({
  completedDays = 8,
  totalDays = 60,
  currentPhaseName = "Phase 1 — Technical Foundations",
  activeDayNumber = 9,
  userXp = 12450,
  referralEarnings = 2400,
  tierStatus = "V2 Founding Member",
  activeLessonUrl = "/dashboard/challenge",
}: ProgressHubProps) {
  const percentage = Math.min(100, Math.round((completedDays / totalDays) * 100));

  // Generate 20 segmented steps for the sleek glowing bar
  const totalSegments = 20;
  const activeSegments = Math.round((percentage / 100) * totalSegments);

  const stats = [
    {
      label: "Completed Milestones",
      value: `${completedDays} / ${totalDays}`,
      subtext: "Challenge Days",
      icon: CheckCircle2,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      label: "Earned Platform XP",
      value: `${userXp.toLocaleString()} XP`,
      subtext: "Global Rank Top 5%",
      icon: Sparkles,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      label: "Referral Balance",
      value: `${referralEarnings.toLocaleString()} MAD`,
      subtext: "Available for Payout",
      icon: Wallet,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      label: "Community Rank",
      value: tierStatus,
      subtext: "Verified Access",
      icon: ShieldCheck,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
  ];

  return (
    <div className="space-y-4">
      {/* ── Main Linear Roadmap Progress Card ── */}
      <div className="rounded-2xl bg-[#0F1117] border border-white/[0.06] p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)] relative overflow-hidden backdrop-blur-xl">
        {/* Subtle ambient gradient glow */}
        <div className="absolute top-0 left-1/3 w-64 h-32 bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Top Row: Sprint Info, Day Count & Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Current Sprint:
                </span>
                <span className="text-xs font-semibold text-white/90">
                  {currentPhaseName}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-300">
                Day {completedDays} of {totalDays} Completed
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                {percentage}% Completed
              </div>
              <Link href={activeLessonUrl}>
                <Button
                  size="sm"
                  className="h-8 px-4 rounded-xl text-xs font-bold bg-white text-slate-950 hover:bg-slate-200 transition-all shadow-sm gap-1.5"
                >
                  <span>Continue Today&apos;s Task</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Continuous Glowing Neon Emerald Segmented Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-1.5 w-full">
              {Array.from({ length: totalSegments }).map((_, index) => {
                const isCompleted = index < activeSegments;
                const isCurrent = index === activeSegments;
                return (
                  <div
                    key={index}
                    className={`h-2.5 rounded-full flex-1 transition-all duration-500 ${
                      isCompleted
                        ? "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                        : isCurrent
                        ? "bg-emerald-400/40 border border-emerald-400 animate-pulse"
                        : "bg-white/[0.04] border border-white/[0.04]"
                    }`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>Day 1 — Onboarding</span>
              <span>Day 30 — Client Outreach</span>
              <span>Day 60 — Agency Scale</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Metric Stat Row (4 Compact Cards) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-4 rounded-2xl bg-[#0F1117] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 shadow-sm relative group overflow-hidden"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className={`w-8 h-8 rounded-xl ${stat.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${stat.iconColor}`} />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {stat.value}
              </p>
              <p className="text-[11px] font-medium text-slate-400/80 mt-0.5">
                {stat.subtext}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
