"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  isActiveToday: boolean;
  weekDays: {
    dayName: string; // "M", "T", "W", "T", "F", "S", "S"
    dateStr: string; // "YYYY-MM-DD"
    isActive: boolean;
    isToday: boolean;
  }[];
  totalActiveDays: number;
}

export async function getUserStreak(): Promise<StreakData> {
  const { userId } = await auth();
  if (!userId) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      isActiveToday: false,
      weekDays: [],
      totalActiveDays: 0,
    };
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!user) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      isActiveToday: false,
      weekDays: [],
      totalActiveDays: 0,
    };
  }

  // Fetch all completed daily progress records for this user
  const records = await db.dailyProgress.findMany({
    where: {
      userId: user.id,
      completed: true,
    },
    select: { date: true },
    orderBy: { date: "asc" },
  });

  const activeDates = new Set(records.map((r) => r.date));
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const isActiveToday = activeDates.has(todayStr);

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = new Date(today);

  // If not active today, check if active yesterday to maintain streak
  if (!isActiveToday) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dStr = checkDate.toISOString().split("T")[0];
    if (activeDates.has(dStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate longest streak
  const sortedDates = Array.from(activeDates).sort();
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  for (const dStr of sortedDates) {
    const cur = new Date(dStr + "T00:00:00");
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffDays = Math.round(
        (cur.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) longestStreak = tempStreak;
    prevDate = cur;
  }

  if (currentStreak > longestStreak) longestStreak = currentStreak;

  // Generate current week view (Monday to Sunday)
  const currentDayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday
  const distanceToMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - distanceToMonday);

  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];
  const weekDays = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dStr = d.toISOString().split("T")[0];
    weekDays.push({
      dayName: dayLabels[i],
      dateStr: dStr,
      isActive: activeDates.has(dStr),
      isToday: dStr === todayStr,
    });
  }

  return {
    currentStreak,
    longestStreak,
    isActiveToday,
    weekDays,
    totalActiveDays: activeDates.size,
  };
}

export async function recordDailyCheckIn() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: { id: true, xp: true },
  });

  if (!user) return null;

  const todayStr = new Date().toISOString().split("T")[0];

  // Upsert today's daily progress
  const existing = await db.dailyProgress.findUnique({
    where: {
      userId_date: {
        userId: user.id,
        date: todayStr,
      },
    },
  });

  if (!existing || !existing.completed) {
    await db.dailyProgress.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: todayStr,
        },
      },
      update: { completed: true },
      create: {
        userId: user.id,
        date: todayStr,
        completed: true,
      },
    });

    // Award +25 XP daily check-in bonus
    await db.user.update({
      where: { id: user.id },
      data: { xp: { increment: 25 } },
    });

    return { rewarded: true, xpEarned: 25 };
  }

  return { rewarded: false, xpEarned: 0 };
}
