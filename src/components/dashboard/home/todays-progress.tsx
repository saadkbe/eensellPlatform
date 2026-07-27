"use client";
import { motion } from "framer-motion";
import { Target } from "lucide-react";

export function TodaysProgress({ completedTasks, totalTasks }: { completedTasks: number; totalTasks: number }) {
  const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center justify-between p-6 rounded-3xl bg-[#0a0b10] border border-white/[0.08]">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-white/50" />
          <h3 className="text-sm font-medium text-white/70">Today's Progress</h3>
        </div>
        <div className="text-2xl font-semibold text-white">
          {completedTasks} <span className="text-white/30 text-lg">/ {totalTasks}</span>
        </div>
        <p className="text-xs text-white/40 mt-1">tasks completed</p>
      </div>

      <div className="relative flex items-center justify-center w-24 h-24">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-white/[0.05]"
          />
          <motion.circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            className="text-white"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
          {Math.round(percentage)}%
        </div>
      </div>
    </div>
  );
}
