import { Target } from "lucide-react";
import { getGoalsForToday, getStreakDays, getWeeklyData } from "@/actions/goal.actions";
import { GoalsClient } from "./goals-client";

export default async function GoalsPage() {
  const [todayGoals, streak, weeklyData] = await Promise.all([
    getGoalsForToday(),
    getStreakDays(),
    getWeeklyData(),
  ]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight flex items-center gap-3 mb-1">
          <Target className="w-7 h-7 text-amber-500" />
          Daily Goals & Accountability
        </h1>
        <p className="text-sm text-muted-foreground">
          Set daily habits, track your consistency, and build momentum.
        </p>
      </div>

      <GoalsClient
        initialGoals={todayGoals}
        initialStreak={streak}
        weeklyData={weeklyData}
      />
    </div>
  );
}
