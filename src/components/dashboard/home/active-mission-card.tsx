"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRoadmapDay } from "@/data/roadmap-data";

interface ActiveMissionCardProps {
  dayNumber?: number;
  missionTitle?: string;
  missionDescription?: string;
  estimatedTime?: string;
  actionUrl?: string;
  onComplete?: () => void;
  isCompleted?: boolean;
}

export function ActiveMissionCard({
  dayNumber = 1,
  missionTitle,
  missionDescription,
  estimatedTime,
  actionUrl = "/dashboard/challenge",
  onComplete,
  isCompleted = false,
}: ActiveMissionCardProps) {
  const roadmapDay = getRoadmapDay(dayNumber);
  const title = missionTitle || roadmapDay.title;
  const description = missionDescription || roadmapDay.summary;
  const time = estimatedTime || roadmapDay.estimatedTime;

  // Deliverables checklist
  const [completedIndices, setCompletedIndices] = useState<number[]>([]);

  const toggleTask = (index: number) => {
    setCompletedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const tasks = roadmapDay.deliverables || [];
  const completedCount = completedIndices.length;

  return (
    <div className="rounded-2xl bg-[#0F1117] border border-white/[0.06] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)] relative overflow-hidden backdrop-blur-xl">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/[0.05] rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
          <h3 className="text-xs font-black tracking-widest text-amber-400 uppercase">
            Today&apos;s Mission
          </h3>
          <span className="text-xs text-white/30">•</span>
          <span className="text-xs font-bold text-slate-300">Day {dayNumber} of 60</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs font-semibold text-slate-400">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>⏱ {time}</span>
        </div>
      </div>

      {/* Mission Body */}
      <div className="pt-5 space-y-4">
        <div>
          <h4 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-snug">
            {title}
          </h4>
          {description && (
            <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Deliverables Checklist */}
        {tasks.length > 0 && (
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Core Deliverables</span>
              <span className="text-amber-400 font-mono">
                {completedCount} / {tasks.length} Completed
              </span>
            </div>

            <div className="space-y-2">
              {tasks.map((task, idx) => {
                const isTaskDone = completedIndices.includes(idx);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleTask(idx)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200 group ${
                      isTaskDone
                        ? "bg-amber-500/[0.05] border-amber-500/20 text-slate-300"
                        : "bg-white/[0.02] border-white/[0.04] text-slate-300 hover:border-white/[0.1] hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isTaskDone ? (
                        <CheckCircle2 className="w-4 h-4 text-amber-400 fill-amber-500/20" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                      )}
                    </div>
                    <span
                      className={`text-xs sm:text-sm leading-relaxed ${
                        isTaskDone ? "line-through text-slate-400" : "font-medium text-slate-200"
                      }`}
                    >
                      {task}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link href={actionUrl} className="flex-1 block">
            <Button
              className="w-full h-11 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.45)] transition-all gap-2 border-0"
            >
              <span>Open Blueprint & Instructions</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          {onComplete && (
            <Button
              type="button"
              onClick={onComplete}
              variant="outline"
              className="h-11 rounded-xl text-xs font-bold border-white/10 hover:bg-white/[0.06] text-white"
            >
              {isCompleted ? "Marked Done ✓" : `Complete Day ${dayNumber}`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
