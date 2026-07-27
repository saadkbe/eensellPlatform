"use client";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

export function LearningStreak({ streakDays }: { streakDays: number }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-[#0a0b10] border border-white/[0.08] relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full" />
      
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, -5, 5, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 mb-4"
      >
        <Flame className="w-8 h-8 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
      </motion.div>

      <div className="text-3xl font-bold text-white mb-1">{streakDays}</div>
      <div className="text-sm text-white/50 font-medium">Day Streak</div>
    </div>
  );
}
