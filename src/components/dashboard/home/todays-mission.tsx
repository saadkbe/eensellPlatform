"use client";

import { motion } from "framer-motion";
import { PlayCircle, FileText, Video, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TodaysMissionProps {
  lesson: any | null;
  homeworkStatus: string | null;
  liveCall: any | null;
  estimatedTime: string;
}

export function TodaysMission({ lesson, homeworkStatus, liveCall, estimatedTime }: TodaysMissionProps) {
  return (
    <div className="bg-[#0a0b10] border border-white/[0.08] rounded-3xl p-8 shadow-xl flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-white tracking-tight">Today's Mission</h2>
        <span className="text-xs font-semibold text-white/40 uppercase tracking-widest px-3 py-1 rounded-full border border-white/10">
          ~ {estimatedTime}
        </span>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        {/* Lesson Task */}
        <div className={cn(
          "flex items-center gap-4 p-4 rounded-2xl border transition-colors",
          lesson ? "bg-white/[0.02] border-white/10" : "bg-emerald-500/5 border-emerald-500/20"
        )}>
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
            lesson ? "bg-white/10 text-white" : "bg-emerald-500/20 text-emerald-500"
          )}>
            {lesson ? <PlayCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-sm font-bold text-white">Watch Today's Lesson</p>
            <p className="text-xs text-white/50 truncate">
              {lesson ? lesson.title : "All caught up for today"}
            </p>
          </div>
        </div>

        {/* Homework Task */}
        <div className={cn(
          "flex items-center gap-4 p-4 rounded-2xl border transition-colors",
          homeworkStatus === "COMPLETED" ? "bg-emerald-500/5 border-emerald-500/20" : "bg-white/[0.02] border-white/10"
        )}>
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
            homeworkStatus === "COMPLETED" ? "bg-emerald-500/20 text-emerald-500" : "bg-white/10 text-white"
          )}>
            {homeworkStatus === "COMPLETED" ? <CheckCircle2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-sm font-bold text-white">Complete Challenge Assignment</p>
            <p className="text-xs text-white/50">
              {homeworkStatus === "COMPLETED" ? "Submitted & Approved" : "Action required"}
            </p>
          </div>
        </div>

        {/* Live Call Task */}
        {liveCall && (
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-rose-500/20 text-rose-500 animate-pulse">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Join Live Session</p>
              <p className="text-xs text-white/50 truncate">{liveCall.title}</p>
            </div>
          </div>
        )}
      </div>

      <Link href={lesson ? `/dashboard/modules/${lesson.moduleId}/${lesson.id}` : "/dashboard/modules"}>
        <Button className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-base shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] group">
          <span className="flex items-center justify-center gap-2">
            Start Mission
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </Button>
      </Link>
    </div>
  );
}
