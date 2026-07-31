"use server";

import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { unstable_cache } from "next/cache";

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

// ─── FAST PATH: lightweight user lookup for layout/page rendering ───
// Does a simple READ (findUnique). Only falls back to the full
// syncUserToDB upsert if the user doesn't exist in DB yet (first login).
// This replaces the old pattern of calling syncUserToDB on every navigation.
export async function getOrCreateUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  // Fast path: user already exists in DB (99% of requests)
  const existingUser = await db.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (existingUser) return existingUser;

  // Slow path: first-ever login — do the full sync
  return syncUserToDB();
}

// Sync Clerk user to database (only needed on first login or explicit sync)
export async function syncUserToDB() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  const user = await db.user.upsert({
    where: { email },
    update: {
      clerkId: clerkUser.id,
      firstName: clerkUser.firstName || undefined,
      lastName: clerkUser.lastName || undefined,
      imageUrl: clerkUser.imageUrl || undefined,
    },
    create: {
      clerkId: clerkUser.id,
      email,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
      role: "PENDING_USER",
      status: "PENDING",
    },
  });

  // Sync metadata to Clerk — fire-and-forget (don't block page rendering)
  syncClerkMetadata(user, clerkUser).catch((e) =>
    console.error("Background Clerk metadata sync error:", e)
  );

  return user;
}

// Non-blocking Clerk metadata sync
async function syncClerkMetadata(user: any, clerkUser: any) {
  try {
    const { sessionClaims } = await auth();
    const clerkRole = (sessionClaims?.metadata as any)?.role;
    const clerkStatus = (sessionClaims?.metadata as any)?.status;

    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();

    // Sync Role/Status Metadata
    if (clerkRole !== user.role || clerkStatus !== user.status) {
      await client.users.updateUserMetadata(user.clerkId, {
        publicMetadata: {
          role: user.role,
          status: user.status,
        }
      });
    }

    // Sync Name back to Clerk if needed
    if (!clerkUser.firstName && user.firstName) {
      await client.users.updateUser(user.clerkId, {
        firstName: user.firstName,
        lastName: user.lastName || "",
      });
    }
  } catch (e) {
    console.error("Error syncing Clerk metadata:", e);
  }
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

  const existingProgress = await db.progress.findUnique({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId,
      },
    },
  });

  const result = await db.progress.upsert({
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

  if (!existingProgress?.isCompleted) {
    await db.user.update({
      where: { id: user.id },
      data: { xp: { increment: 50 } },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/modules");
  
  return result;
}

// Mark lesson as incomplete
export async function markLessonIncomplete(lessonId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const existingProgress = await db.progress.findUnique({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId,
      },
    },
  });

  if (existingProgress?.isCompleted) {
    await db.user.update({
      where: { id: user.id },
      data: { xp: { decrement: 50 } },
    });
  }
  const updated = await db.progress.update({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId,
      },
    },
    data: { isCompleted: false },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/modules");

  return updated;
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

// Get top 10 leaderboard (cached 30s — same for all users)
export const getLeaderboard = unstable_cache(
  async () => {
    return db.user.findMany({
      where: { 
        status: "ACTIVE",
        role: { not: "ADMIN" }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        imageUrl: true,
        xp: true,
      },
      orderBy: { xp: "desc" },
      take: 10,
    });
  },
  ["leaderboard-top-10"],
  { revalidate: 30 }
);
