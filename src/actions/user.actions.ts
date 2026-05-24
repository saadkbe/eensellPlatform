"use server";

import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";

// Get the current user from DB
export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  return user;
}

// Get user by Clerk ID
export async function getUserByClerkId(clerkId: string) {
  return db.user.findUnique({
    where: { clerkId },
  });
}

// Get user by DB ID
export async function getUserById(id: string) {
  return db.user.findUnique({
    where: { id },
  });
}

// Sync Clerk user to database (fallback for webhook)
export async function syncUserToDB() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const existingUser = await db.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (existingUser) return existingUser;

  const newUser = await db.user.create({
    data: {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
      role: "PENDING_USER",
      status: "PENDING",
    },
  });

  return newUser;
}

// Get user's progress
export async function getUserProgress(userId: string) {
  const progress = await db.progress.findMany({
    where: { userId },
    include: { lesson: { include: { module: true } } },
  });

  return progress;
}

// Mark lesson as completed
export async function markLessonComplete(lessonId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  return db.progress.upsert({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId,
      },
    },
    update: { isCompleted: true, watchedAt: new Date() },
    create: {
      userId: user.id,
      lessonId,
      isCompleted: true,
    },
  });
}

// Mark lesson as incomplete
export async function markLessonIncomplete(lessonId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  return db.progress.update({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId,
      },
    },
    data: { isCompleted: false },
  });
}

// Complete onboarding
export async function completeOnboarding(data: { firstName: string; lastName: string; goals: string }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Ensure user exists in DB first (handles race condition with webhook)
  try {
    await syncUserToDB();
  } catch (error) {
    // If it fails (e.g. unique constraint because webhook just finished), ignore
    console.log("syncUserToDB error (likely race condition handled):", error);
  }

  // Attempt to sync to Clerk (optional fallback)
  try {
    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      firstName: data.firstName,
      lastName: data.lastName,
    });
  } catch (error) {
    console.error("Error syncing to Clerk:", error);
  }

  // Update DB
  await db.user.update({
    where: { clerkId: userId },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      goals: data.goals,
      onboardingCompleted: true,
    },
  });

  return { success: true };
}

// Update user's learning goals text
export async function updateUserGoals(goals: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.user.update({
    where: { clerkId: userId },
    data: { goals },
  });

  return { success: true };
}
