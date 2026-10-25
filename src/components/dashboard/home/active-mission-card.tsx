"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Clock, ArrowRight, Zap, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActiveMissionCardProps {
  missionTitle?: string;
  missionDescription?: string;
  dayNumber?: number;
  estimatedTime?: string;
  actionUrl?: string;
}

export function ActiveMissionCard({
  missionTitle = "Day 9: Configure Inbound Webhooks & Meta WhatsApp Verification",
  missionDescription = "Set up your Meta Developer account, configure incoming webhook verification tokens, and test routing in Make.com.",
  dayNumber = 9,
  estimatedTime = "25 mins",
  actionUrl = "/dashboard/challenge",
}: ActiveMissionCardProps) {
  // Checkable deliverables state
  const [tasks, setTasks] = useState([
    {
      id: "t1",
      label: "Register WhatsApp Cloud API app inside Meta Developer Portal",
      completed: true,
    },
    {
      id: "t2",
      label: "Configure permanent System User Token & verify Webhook callback endpoint",
      completed: false,
    },
    {
      id: "t3",
      label: "Import inbound Webhook router into Make.com & trigger verified test payload",
      completed: false,
    },
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="rounded-2xl bg-[#0F1117] border border-white/[0.06] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)] relative overflow-hidden backdrop-blur-xl">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <h3 className="text-xs font-black tracking-widest text-emerald-400 uppercase">
            Today&apos;s Mission
          </h3>
          <span className="text-xs text-white/30">•</span>
          <span className="text-xs font-bold text-slate-300">Day {dayNumber} of 60</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs font-semibold text-slate-400">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>⏱ {estimatedTime}</span>
        </div>
      </div>

      {/* Mission Body */}
      <div className="pt-5 space-y-4">
        <div>
          <h4 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-snug">
            {missionTitle}
          </h4>
          {missionDescription && (
            <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
              {missionDescription}
            </p>
          )}
        </div>

        {/* Deliverables Checklist */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Core Deliverables</span>
            <span className="text-emerald-400 font-mono">
              {completedCount} / {tasks.length} Completed
            </span>
          </div>

          <div className="space-y-2">
            {tasks.map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => toggleTask(task.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200 group ${
                  task.completed
                    ? "bg-emerald-500/[0.04] border-emerald-500/20 text-slate-300"
                    : "bg-white/[0.02] border-white/[0.04] text-slate-300 hover:border-white/[0.1] hover:bg-white/[0.03]"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                  )}
                </div>
                <span
                  className={`text-xs sm:text-sm leading-relaxed ${
                    task.completed ? "line-through text-slate-400" : "font-medium text-slate-200"
                  }`}
                >
                  {task.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link href={actionUrl} className="block">
            <Button
              className="w-full h-11 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.45)] transition-all gap-2 border-0"
            >
              <span>Open Blueprint & Instructions</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
