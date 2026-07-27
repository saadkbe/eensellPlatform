"use client";

import { Target, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeeklyChallengeProps {
  challenge: any | null;
}

export function WeeklyChallenge({ challenge }: WeeklyChallengeProps) {
  if (!challenge) return null;

  return (
    <div className="bg-[#0a0b10] border border-white/[0.08] rounded-3xl p-8 shadow-xl relative overflow-hidden group">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-500/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-sky-500/20 transition-colors duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center">
            <Target className="w-4 h-4 text-sky-400" />
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">Weekly Challenge</h2>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 leading-tight">
          {challenge.title}
        </h3>
        
        <p className="text-sm font-medium text-white/60 mb-6 line-clamp-2">
          {challenge.description}
        </p>

        {challenge.reward && (
          <div className="flex items-center gap-2 text-sm font-bold text-sky-400 mb-6 bg-sky-500/10 w-fit px-3 py-1.5 rounded-lg border border-sky-500/20">
            <Gift className="w-4 h-4" />
            Reward: {challenge.reward}
          </div>
        )}

        <Button className="w-full bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.1] rounded-xl font-semibold shadow-none transition-all hover:border-sky-500/50">
          Accept Challenge
        </Button>
      </div>
    </div>
  );
}
