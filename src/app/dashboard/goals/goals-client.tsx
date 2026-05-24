"use client";

import { useState, useTransition } from "react";
import { createGoal, toggleGoal, deleteGoal } from "@/actions/goal.actions";
import { toast } from "sonner";
import {
  CheckCircle2,
  Circle,
  Flame,
  Trophy,
  CalendarDays,
  TrendingUp,
  Zap,
  Plus,
  Trash2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Goal = { id: string; title: string; completed: boolean; category: string; date: Date; createdAt: Date };
type WeekDay = { date: Date; label: string; completed: boolean; total: number; done: number };

const CATEGORIES = [
  { value: "Learning", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  { value: "Review", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  { value: "Practical", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  { value: "Engagement", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
];

export function GoalsClient({
  initialGoals,
  initialStreak,
  weeklyData,
}: {
  initialGoals: Goal[];
  initialStreak: number;
  weeklyData: WeekDay[];
}) {
  const [goals, setGoals] = useState(initialGoals);
  const [streak, setStreak] = useState(initialStreak);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Learning");
  const [isPending, startTransition] = useTransition();

  const completedCount = goals.filter((g) => g.completed).length;
  const progressPercent = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    const title = newTitle.trim();
    const category = newCategory;
    setNewTitle("");

    startTransition(async () => {
      try {
        const goal = await createGoal(title, category);
        setGoals((prev) => [...prev, goal]);
        toast.success("Goal added!");
      } catch {
        toast.error("Failed to add goal");
      }
    });
  };

  const handleToggle = (goalId: string) => {
    // Optimistic update
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, completed: !g.completed } : g))
    );

    startTransition(async () => {
      try {
        await toggleGoal(goalId);
      } catch {
        // Revert
        setGoals((prev) =>
          prev.map((g) => (g.id === goalId ? { ...g, completed: !g.completed } : g))
        );
        toast.error("Failed to update goal");
      }
    });
  };

  const handleDelete = (goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));

    startTransition(async () => {
      try {
        await deleteGoal(goalId);
        toast.success("Goal removed");
      } catch {
        toast.error("Failed to delete goal");
      }
    });
  };

  // Progress ring
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT — Main Tracker (2 cols) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Add Goal Form */}
        <Card className="bg-card/50 border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Add a daily goal... e.g., Watch 1 lesson"
                className="bg-muted/30 border-border text-foreground h-10 flex-1"
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
              <div className="flex gap-2">
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="h-10 px-3 rounded-md border border-border bg-muted/30 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.value}</option>
                  ))}
                </select>
                <Button onClick={handleAdd} disabled={isPending || !newTitle.trim()} className="gap-1.5 h-10 px-5">
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Goals */}
        <Card className="bg-card/50 border-border shadow-sm">
          <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Today's Goals</CardTitle>
              <CardDescription className="text-xs mt-0.5">Complete your daily tasks to maintain your streak.</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs font-medium text-muted-foreground">Progress</span>
                <p className="text-sm font-bold text-foreground">{completedCount}/{goals.length}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {goals.length === 0 ? (
              <div className="text-center py-14 px-4">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3 border border-border">
                  <Sparkles className="w-7 h-7 text-muted-foreground/40" />
                </div>
                <p className="text-sm font-medium text-foreground">No goals for today</p>
                <p className="text-xs text-muted-foreground mt-1">Add your first daily goal above to start tracking!</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {goals.map((goal) => {
                  const catStyle = CATEGORIES.find((c) => c.value === goal.category)?.color || CATEGORIES[0].color;

                  return (
                    <div
                      key={goal.id}
                      className="flex items-center justify-between px-5 py-4 hover:bg-muted/20 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleToggle(goal.id)}
                          className={`transition-all duration-300 ${
                            goal.completed
                              ? "text-emerald-500 scale-110"
                              : "text-muted-foreground hover:text-emerald-500/70"
                          }`}
                        >
                          {goal.completed ? (
                            <CheckCircle2 className="w-6 h-6" />
                          ) : (
                            <Circle className="w-6 h-6" />
                          )}
                        </button>
                        <div>
                          <h4
                            className={`text-sm font-medium transition-colors ${
                              goal.completed ? "text-muted-foreground line-through" : "text-foreground"
                            }`}
                          >
                            {goal.title}
                          </h4>
                          <Badge variant="secondary" className={`mt-1 text-[10px] px-2 py-0 border ${catStyle}`}>
                            {goal.category}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDelete(goal.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Objectives */}
        <Card className="bg-card/50 border-border shadow-sm">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border bg-muted/20">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="text-[10px] font-semibold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-md">
                    {weeklyData.filter((d) => d.completed).length}/7 Days
                  </span>
                </div>
                <h4 className="font-semibold text-sm text-foreground mb-1">Active Days This Week</h4>
                <div className="w-full bg-muted h-1.5 rounded-full mt-2">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${(weeklyData.filter((d) => d.completed).length / 7) * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-muted/20">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <Zap className="w-4 h-4 text-purple-500" />
                  </div>
                  <span className="text-[10px] font-semibold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-md">
                    {completedCount} Today
                  </span>
                </div>
                <h4 className="font-semibold text-sm text-foreground mb-1">Goals Completed Today</h4>
                <div className="w-full bg-muted h-1.5 rounded-full mt-2">
                  <div
                    className="bg-purple-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT — Streak + Calendar (1 col) */}
      <div className="space-y-6">
        {/* Streak Card */}
        <Card className="bg-gradient-to-br from-amber-500/15 to-card border-amber-500/20 overflow-hidden relative shadow-sm">
          <div className="absolute right-0 top-0 p-3 opacity-10 pointer-events-none">
            <Flame className="w-28 h-28 text-amber-500" />
          </div>
          <CardContent className="p-6 relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-amber-500/15 rounded-full flex items-center justify-center mb-3 border-4 border-amber-500/25 shadow-[0_0_25px_rgba(245,158,11,0.15)]">
              <Flame className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-0.5">{streak}</h2>
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Day Streak
            </p>
            <p className="text-[10px] text-muted-foreground mt-3">
              {progressPercent === 100
                ? "🎉 You nailed every goal today!"
                : "Complete all goals to extend your streak!"}
            </p>
          </CardContent>
        </Card>

        {/* Progress Ring */}
        <Card className="bg-card/50 border-border shadow-sm">
          <CardContent className="p-6 flex flex-col items-center">
            <div className="relative w-24 h-24 mb-3">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="7" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-foreground">{progressPercent}%</span>
              </div>
            </div>
            <p className="text-xs font-medium text-foreground">Today's Progress</p>
            <p className="text-[10px] text-muted-foreground">{completedCount} of {goals.length} goals</p>
          </CardContent>
        </Card>

        {/* Weekly Calendar */}
        <Card className="bg-card/50 border-border shadow-sm">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-primary" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              {weeklyData.map((day, i) => {
                const isToday = i === weeklyData.length - 1;
                let stateClass = "";

                if (day.completed) {
                  stateClass = "bg-primary text-primary-foreground";
                } else if (isToday) {
                  stateClass = progressPercent === 100
                    ? "bg-primary text-primary-foreground shadow-[0_0_8px_hsl(var(--primary)/0.4)]"
                    : "border-2 border-primary text-primary font-bold";
                } else if (day.total > 0) {
                  stateClass = "bg-muted/80 text-muted-foreground border border-border";
                } else {
                  stateClass = "bg-muted/40 text-muted-foreground/50 border border-border/50";
                }

                return (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px] font-medium text-muted-foreground">{day.label}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] transition-all ${stateClass}`}>
                      {day.completed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : day.total > 0 ? (
                        `${day.done}/${day.total}`
                      ) : (
                        "—"
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
