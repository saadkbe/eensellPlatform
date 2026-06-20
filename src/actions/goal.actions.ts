"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

async function getAuthUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("User not found");
  return user;
}

// Get today's goals for the current user
export async function getGoalsForToday() {
  const user = await getAuthUser();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return db.goal.findMany({
    where: {
      userId: user.id,
      date: { gte: today, lt: tomorrow },
    },
    orderBy: { createdAt: "asc" },
  });
}

// Create a new goal for today
export async function createGoal(title: string, category: string = "Learning") {
  const user = await getAuthUser();

  const goal = await db.goal.create({
    data: {
      title,
      category,
      userId: user.id,
      date: new Date(),
    },
  });

  revalidatePath("/dashboard/goals");
  return goal;
}

// Toggle goal completion
export async function toggleGoal(goalId: string) {
  const user = await getAuthUser();

  const goal = await db.goal.findUnique({ where: { id: goalId } });
  if (!goal || goal.userId !== user.id) throw new Error("Goal not found");

  const newCompletedState = !goal.completed;

  const updated = await db.goal.update({
    where: { id: goalId },
    data: { completed: newCompletedState },
  });

  if (newCompletedState) {
    await db.user.update({
      where: { id: user.id },
      data: { xp: { increment: 20 } },
    });
  } else {
    await db.user.update({
      where: { id: user.id },
      data: { xp: { decrement: 20 } },
    });
  }

  revalidatePath("/dashboard/goals");
  return updated;
}

// Delete a goal
export async function deleteGoal(goalId: string) {
  const user = await getAuthUser();

  const goal = await db.goal.findUnique({ where: { id: goalId } });
  if (!goal || goal.userId !== user.id) throw new Error("Goal not found");

  await db.goal.delete({ where: { id: goalId } });
  revalidatePath("/dashboard/goals");
}

// Get streak: count consecutive past days (including today) where all goals were completed
export async function getStreakDays() {
  const user = await getAuthUser();

  let streak = 0;
  const now = new Date();

  for (let i = 0; i < 60; i++) {
    const dayStart = new Date(now);
    dayStart.setDate(dayStart.getDate() - i);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const goalsForDay = await db.goal.findMany({
      where: {
        userId: user.id,
        date: { gte: dayStart, lt: dayEnd },
      },
    });

    // If no goals were set for this day, skip (don't break streak for days with no goals)
    if (goalsForDay.length === 0) {
      if (i === 0) continue; // Today with no goals yet doesn't break streak
      break;
    }

    const allCompleted = goalsForDay.every((g) => g.completed);
    if (allCompleted) {
      streak++;
    } else {
      if (i === 0) continue; // Today not done yet doesn't break streak
      break;
    }
  }

  return streak;
}

// Get weekly completion data (last 7 days)
export async function getWeeklyData() {
  const user = await getAuthUser();
  const days: { date: Date; label: string; completed: boolean; total: number; done: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const dEnd = new Date(d);
    dEnd.setDate(dEnd.getDate() + 1);

    const goals = await db.goal.findMany({
      where: {
        userId: user.id,
        date: { gte: d, lt: dEnd },
      },
    });

    days.push({
      date: d,
      label: d.toLocaleDateString("en-US", { weekday: "short" }).charAt(0),
      total: goals.length,
      done: goals.filter((g) => g.completed).length,
      completed: goals.length > 0 && goals.every((g) => g.completed),
    });
  }

  return days;
}
