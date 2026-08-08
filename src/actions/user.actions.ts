"use server";

import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";

function generateReferralCode(firstName: string | null, email: string) {
  const base = (firstName || email.split("@")[0]).toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 4);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${base}${random}`;
}

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

  // Generate a code for new users
  let referralCode = generateReferralCode(clerkUser.firstName, email);

  // Check for referral cookie
  const cookieStore = await cookies();
  const refCookie = cookieStore.get("eensell_ref")?.value;
  let referrerId: string | undefined;

  if (refCookie) {
    try {
      const referrer = await db.user.findUnique({ where: { referralCode: refCookie } });
      if (referrer) {
        referrerId = referrer.id;
      }
    } catch (e) {
      console.error("Error finding referrer:", e);
    }
  }

  let user;
  let retries = 0;
  
  while (retries < 3) {
    try {
      user = await db.user.upsert({
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
          referralCode,
        },
      });
      break; // Success
    } catch (e: any) {
      if (e.code === "P2002" && retries < 2) {
        // Unique constraint violation (likely referralCode collision), generate a new one and retry
        referralCode = generateReferralCode(clerkUser.firstName, email);
        retries++;
      } else {
        console.error("Failed to sync user:", e);
        // Fallback to updating only if create fails due to a weird race condition
        const existing = await db.user.findUnique({ where: { email } });
        if (existing) {
          user = await db.user.update({
            where: { email },
            data: { clerkId: clerkUser.id }
          });
          break;
        }
        throw e;
      }
    }
  }

  if (!user) return null;

  // If this was a new registration and they have a valid referrer, attribute it
  // We check if the cookie existed and we haven't already attributed this user
  if (referrerId) {
    // Only create referral if it doesn't already exist for this user
    const existingReferral = await db.referral.findUnique({
      where: { referredUserId: user.id }
    });

    if (!existingReferral && user.id !== referrerId) { // prevent self referral just in case
      // Get current commission rate or default to 50
      const commissionSetting = await db.systemSetting.findUnique({ where: { key: "COMMISSION_RATE" }});
      const commissionAmount = commissionSetting ? parseInt(commissionSetting.value) : 50;

      await db.referral.create({
        data: {
          referrerId,
          referredUserId: user.id,
          status: "PENDING",
          commissionAmount,
        }
      });
    }
  }

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

// Check user status (lightweight poll)
export async function checkUserStatus() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: { status: true },
  });

  return user?.status || null;
}

// Get top 10 leaderboard (cached 30s — same for all users)
export async function completeWalkthrough() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.user.update({
    where: { clerkId: userId },
    data: { hasSeenWalkthrough: true },
  });

  return { success: true };
}
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
