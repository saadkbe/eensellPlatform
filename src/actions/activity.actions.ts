"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export async function trackActivity(path: string, duration: number) {
  const clerkUser = await currentUser();
  if (!clerkUser) return;

  const user = await db.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (!user) return;

  // Track page activity
  const recentActivity = await db.userActivity.findFirst({
    where: {
      userId: user.id,
      path: path,
      timestamp: {
        gte: new Date(Date.now() - 60000), // last 1 minute
      },
    },
    orderBy: { timestamp: "desc" },
  });

  if (recentActivity) {
    await db.userActivity.update({
      where: { id: recentActivity.id },
      data: {
        duration: { increment: duration },
        timestamp: new Date(),
      },
    });
  } else {
    await db.userActivity.create({
      data: {
        userId: user.id,
        path,
        duration,
      },
    });
  }

  // Handle session tracking
  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  const session = await db.userSession.findUnique({
    where: {
      userId_date: {
        userId: user.id,
        date: today,
      },
    },
  });

  if (session) {
    await db.userSession.update({
      where: { id: session.id },
      data: {
        totalTime: { increment: duration },
      },
    });
  } else {
    await db.userSession.create({
      data: {
        userId: user.id,
        date: today,
        totalTime: duration,
      },
    });
  }
}
