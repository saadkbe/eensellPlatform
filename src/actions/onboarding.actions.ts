"use server";

import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// ══════════════════════════════════════════════
// The Eensell Journey — Server Actions
// ══════════════════════════════════════════════

// ─── Fetch all onboarding data for the current user ───
export async function getOnboardingData() {
  const { userId } = await auth();
  if (!userId) return null;

  const [user, config, milestones] = await Promise.all([
    db.user.findUnique({
      where: { clerkId: userId },
      include: {
        missions: { orderBy: { order: "asc" } },
        weeklySchedules: true,
      },
    }),
    db.onboardingConfig.findMany({
      where: { isActive: true },
      orderBy: { stepNumber: "asc" },
    }),
    db.roadmapMilestone.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
  ]);

  if (!user) return null;

  // Get the first lesson for the completion screen
  const firstLesson = await db.lesson.findFirst({
    where: { isPublished: true },
    orderBy: [
      { module: { order: "asc" } },
      { order: "asc" },
    ],
    include: { module: true },
  });

  return {
    user,
    config,
    milestones,
    firstLesson,
  };
}

// ─── Save data for a specific onboarding step ───
export async function saveOnboardingStep(
  step: number,
  data?: Record<string, unknown>
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("User not found");

  switch (step) {
    case 1:
      // Welcome step — set challenge start date
      await db.user.update({
        where: { clerkId: userId },
        data: {
          onboardingStep: 2,
          challengeStartDate: user.challengeStartDate || new Date(),
        },
      });
      break;

    case 2:
      // Video step — save watch time (optional), advance
      await db.user.update({
        where: { clerkId: userId },
        data: {
          onboardingStep: 3,
          videoWatchTime: (data?.watchTime as number) || user.videoWatchTime,
        },
      });
      break;

    case 3:
      // Profile step — save all profile fields
      const profileData: Record<string, unknown> = { onboardingStep: 4 };
      if (data?.phone) profileData.phone = data.phone;
      if (data?.goal) profileData.goal = data.goal;
      if (data?.experienceLevel) profileData.experienceLevel = data.experienceLevel;
      if (data?.weeklyHours) profileData.weeklyHours = data.weeklyHours;
      if (data?.incomeGoal) profileData.incomeGoal = data.incomeGoal;
      if (data?.imageUrl) profileData.imageUrl = data.imageUrl;
      if (data?.firstName) profileData.firstName = data.firstName;
      if (data?.lastName) profileData.lastName = data.lastName;

      await db.user.update({
        where: { clerkId: userId },
        data: profileData,
      });

      // Sync profile image and name to Clerk if provided
      if (data?.imageUrl || data?.firstName) {
        try {
          const { clerkClient } = await import("@clerk/nextjs/server");
          const client = await clerkClient();
          const updatePayload: Record<string, string> = {};
          if (data?.firstName) updatePayload.firstName = data.firstName as string;
          if (data?.lastName) updatePayload.lastName = (data.lastName as string) || "";
          if (Object.keys(updatePayload).length > 0) {
            await client.users.updateUser(userId, updatePayload);
          }
        } catch (e) {
          console.error("Error syncing profile to Clerk:", e);
        }
      }
      break;

    case 4:
      // Roadmap step — just advance
      await db.user.update({
        where: { clerkId: userId },
        data: { onboardingStep: 5 },
      });
      break;

    case 5:
      // Schedule step — upsert weekly schedules
      const schedules = data?.schedules as Array<{ dayOfWeek: number; timeBlock: string }> | undefined;
      if (schedules && schedules.length > 0) {
        // Delete existing schedules for clean upsert
        await db.weeklySchedule.deleteMany({ where: { userId: user.id } });
        await db.weeklySchedule.createMany({
          data: schedules.map((s) => ({
            userId: user.id,
            dayOfWeek: s.dayOfWeek,
            timeBlock: s.timeBlock,
          })),
        });
      }
      await db.user.update({
        where: { clerkId: userId },
        data: { onboardingStep: 6 },
      });
      break;

    case 6:
      // First Mission step — auto-generate missions
      const existingMissions = await db.mission.count({ where: { userId: user.id } });
      if (existingMissions === 0) {
        await db.mission.createMany({
          data: [
            {
              userId: user.id,
              title: "Watch the Welcome Lesson",
              description: "Get introduced to the Eensell ecosystem and understand the path ahead.",
              type: "watch_welcome",
              isCompleted: true, // They just watched the video in step 2
              order: 1,
            },
            {
              userId: user.id,
              title: "Complete Your Profile",
              description: "Set up your profile so the community knows who you are.",
              type: "complete_profile",
              isCompleted: true, // They completed it in step 3
              order: 2,
            },
            {
              userId: user.id,
              title: "Join the Community",
              description: "Connect with fellow students and start your network.",
              type: "join_community",
              isCompleted: false,
              order: 3,
            },
            {
              userId: user.id,
              title: "Begin Your First Lesson",
              description: "Start your AI journey with the first lesson in the curriculum.",
              type: "first_lesson",
              isCompleted: false,
              order: 4,
            },
          ],
        });
      }
      await db.user.update({
        where: { clerkId: userId },
        data: { onboardingStep: 7 },
      });
      break;

    case 7:
      // Completion — mark onboarding as complete, set goals text for backward compat
      const goalLabels: Record<string, string> = {
        learning_ai: "Learn AI Automation & Engineering",
        freelancer: "Become a Freelancer",
        agency: "Build an Agency",
        exploring: "Explore AI Opportunities",
        automations: "Build Automations",
      };
      await db.user.update({
        where: { clerkId: userId },
        data: {
          onboardingCompleted: true,
          onboardingStep: 7,
          goals: user.goal ? goalLabels[user.goal] || user.goal : user.goals,
        },
      });
      revalidatePath("/dashboard");
      break;

    default:
      throw new Error(`Invalid step: ${step}`);
  }

  return { success: true };
}

// ─── Track video watch time (called periodically during playback) ───
export async function trackVideoWatchTime(seconds: number) {
  const { userId } = await auth();
  if (!userId) return;

  await db.user.update({
    where: { clerkId: userId },
    data: {
      videoWatchTime: seconds,
    },
  });
}

// ─── Get onboarding config (admin-facing) ───
export async function getOnboardingConfig() {
  return db.onboardingConfig.findMany({
    orderBy: { stepNumber: "asc" },
  });
}

// ─── Update onboarding config (admin-facing) ───
export async function updateOnboardingConfig(
  id: string,
  data: { title?: string; subtitle?: string; metadata?: string; isActive?: boolean }
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.onboardingConfig.update({
    where: { id },
    data,
  });
}
