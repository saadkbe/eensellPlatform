"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, Sparkles, Check, Trophy, Zap, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { recordDailyCheckIn, type StreakData } from "@/actions/streak.actions";

interface Props {
  initialStreak: StreakData;
}

export function StreakWidget({ initialStreak }: Props) {
  const [streak, setStreak] = useState<StreakData>(initialStreak);
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaim = async () => {
    try {
      setIsClaiming(true);
      const res = await recordDailyCheckIn();
      if (res?.rewarded) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });
        toast.success("🔥 Daily streak checked in! +25 XP awarded!");
        setStreak((prev) => ({
          ...prev,
          currentStreak: prev.isActiveToday ? prev.currentStreak : prev.currentStreak + 1,
          isActiveToday: true,
          weekDays: prev.weekDays.map((d) => (d.isToday ? { ...d, isActive: true } : d)),
        }));
      } else {
        toast.info("You have already checked in today! Keep learning to maintain your momentum.");
      }
    } catch {
      toast.error("Failed to check in. Please try again.");
    } finally {
      setIsClaiming(false);
    }
  };

  const hasStreak = streak.currentStreak > 0;

  return (
    <Card className="bg-gradient-to-br from-orange-500/15 via-card to-card border-orange-500/25 shadow-sm rounded-3xl relative overflow-hidden group">
      {/* Background ambient glow */}
      <div className="absolute right-0 top-0 w-36 h-36 bg-orange-500/10 blur-3xl pointer-events-none rounded-full" />
      
      <CardContent className="p-5 sm:p-6 relative z-10 space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={hasStreak ? { scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] } : {}}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/25 shrink-0"
            >
              <Flame className="w-6 h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
            </motion.div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-orange-500">
                  Daily Streak
                </span>
                {streak.longestStreak > 2 && (
                  <Badge variant="outline" className="text-[10px] font-bold py-0 h-4 border-orange-500/30 text-orange-400 gap-1 bg-orange-500/10">
                    <Trophy className="w-2.5 h-2.5" />
                    <span>Best: {streak.longestStreak}d</span>
                  </Badge>
                )}
              </div>
              <p className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                {streak.currentStreak}{" "}
                <span className="text-sm font-bold text-muted-foreground">
                  {streak.currentStreak === 1 ? "Day Active" : "Days Streak"}
                </span>
              </p>
            </div>
          </div>

          {!streak.isActiveToday && (
            <Button
              onClick={handleClaim}
              disabled={isClaiming}
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs h-9 px-3.5 rounded-xl shadow-md shadow-orange-500/20 shrink-0 gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Check In (+25 XP)</span>
            </Button>
          )}

          {streak.isActiveToday && (
            <Badge className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 font-bold text-xs py-1 px-2.5 gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Active Today</span>
            </Badge>
          )}
        </div>

        {/* 7-Day Activity Dots */}
        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center justify-between gap-1 sm:gap-2">
            {streak.weekDays.map((d, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                <span className={`text-[11px] font-bold ${d.isToday ? "text-orange-500" : "text-muted-foreground"}`}>
                  {d.dayName}
                </span>
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                    d.isActive
                      ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-500/30 ring-2 ring-orange-500/20"
                      : d.isToday
                      ? "bg-orange-500/10 border-2 border-dashed border-orange-500 text-orange-500"
                      : "bg-muted/60 border border-border/50 text-muted-foreground/60"
                  }`}
                >
                  {d.isActive ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : d.isToday ? "•" : ""}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Motivation note */}
        <p className="text-[11px] text-muted-foreground leading-normal">
          {streak.isActiveToday
            ? "Great job! You maintained your streak for today. Come back tomorrow to keep the flame alive."
            : "Complete any lesson or click check-in today to extend your streak and earn +25 XP bonus."}
        </p>
      </CardContent>
    </Card>
  );
}
