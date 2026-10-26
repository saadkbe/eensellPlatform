'use server';

import { db } from '@/lib/db';
import { getCurrentUser } from './user.actions';
import { revalidatePath } from 'next/cache';
import { CHALLENGE_DAYS } from '@/data/challenge-roadmap';

export async function getChallengeProgress(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: {
        challengeStartDate: true,
        challengeDayCompletions: {
          select: {
            challengeDayId: true,
          }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const completedDayIds = user.challengeDayCompletions.map((c: any) => c.challengeDayId);
    const completedDays = completedDayIds.length;
    const remainingDays = Math.max(0, 60 - completedDays);
    const progressPercent = Math.round((completedDays / 60) * 100);

    let currentDay = 1;
    if (user.challengeStartDate) {
      const start = new Date(user.challengeStartDate);
      const now = new Date();
      // Ensure positive diff
      const diffTime = Math.max(0, now.getTime() - start.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      // Days are 1-indexed (day 1 is start day)
      currentDay = Math.min(60, Math.max(1, diffDays + 1));
    }

    // Find current phase from CHALLENGE_DAYS
    const challengeDayData = CHALLENGE_DAYS?.find((d) => d.dayNumber === currentDay);
    const currentPhase = challengeDayData ? challengeDayData.phase : 'learn_ai';

    const todaysChallengeDay = await db.challengeDay.findUnique({
      where: { dayNumber: currentDay }
    });

    return {
      challengeStartDate: user.challengeStartDate,
      currentDay,
      completedDays,
      remainingDays,
      progressPercent,
      currentPhase,
      todaysChallengeDay,
      completedDayIds,
    };
  } catch (error) {
    console.error('[GET_CHALLENGE_PROGRESS]', error);
    return {
      challengeStartDate: null,
      currentDay: 1,
      completedDays: 0,
      remainingDays: 60,
      progressPercent: 0,
      currentPhase: 'learn_ai',
      todaysChallengeDay: null,
      completedDayIds: [],
    };
  }
}

export async function getChallengeDays(userId?: string) {
  try {
    const challengeDays = await db.challengeDay.findMany({
      orderBy: { dayNumber: 'asc' },
    });

    if (!userId) {
      return challengeDays.map(day => ({ ...day, isCompleted: false }));
    }

    // userId here is clerkId, resolve to internal CUID
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) {
      return challengeDays.map(day => ({ ...day, isCompleted: false }));
    }

    const completions = await db.challengeDayCompletion.findMany({
      where: { userId: user.id },
      select: { challengeDayId: true }
    });

    const completedDayIds = new Set(completions.map(c => c.challengeDayId));

    return challengeDays.map(day => ({
      ...day,
      isCompleted: completedDayIds.has(day.id)
    }));
  } catch (error) {
    console.error('[GET_CHALLENGE_DAYS]', error);
    return [];
  }
}

export async function completeChallengeDay(challengeDayId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const challengeDay = await db.challengeDay.findUnique({
      where: { id: challengeDayId }
    });

    if (!challengeDay) {
      throw new Error('Challenge day not found');
    }

    const completion = await db.challengeDayCompletion.upsert({
      where: {
        userId_challengeDayId: {
          userId: user.id,
          challengeDayId: challengeDay.id
        }
      },
      update: {},
      create: {
        userId: user.id,
        challengeDayId: challengeDay.id,
      }
    });

    if (challengeDay.lessonId) {
      await db.progress.upsert({
        where: {
          userId_lessonId: {
            userId: user.id,
            lessonId: challengeDay.lessonId
          }
        },
        update: { isCompleted: true },
        create: {
          userId: user.id,
          lessonId: challengeDay.lessonId,
          isCompleted: true,
        }
      });
    }

    // Award +25 XP
    try {
      await db.user.update({
        where: { id: user.id },
        data: { xp: { increment: 25 } }
      });
    } catch (xpError) {
      console.warn('[COMPLETE_CHALLENGE_DAY] Failed to increment XP', xpError);
    }

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/challenge');

    return completion;
  } catch (error) {
    console.error('[COMPLETE_CHALLENGE_DAY]', error);
    throw new Error('Failed to complete challenge day');
  }
}

export async function getUserChallengeProgress() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        completedDays: [] as number[],
        totalCompleted: 0,
        progressPercentage: 0,
        currentDay: 1,
        userXp: 0,
      };
    }

    const completions = await db.challengeDayCompletion.findMany({
      where: { userId: user.id },
      include: {
        challengeDay: {
          select: { dayNumber: true },
        },
      },
    });

    const completedDays = completions
      .map((c: any) => c.challengeDay.dayNumber)
      .sort((a: number, b: number) => a - b);
    const totalCompleted = completedDays.length;
    const progressPercentage = Math.min(100, Math.round((totalCompleted / 60) * 100));

    const completedSet = new Set(completedDays);
    let currentDay = 1;
    for (let d = 1; d <= 60; d++) {
      if (!completedSet.has(d)) {
        currentDay = d;
        break;
      }
    }
    if (totalCompleted >= 60) {
      currentDay = 60;
    }

    return {
      completedDays,
      totalCompleted,
      progressPercentage,
      currentDay,
      userXp: user.xp || 0,
    };
  } catch (error) {
    console.error('[GET_USER_CHALLENGE_PROGRESS]', error);
    return {
      completedDays: [] as number[],
      totalCompleted: 0,
      progressPercentage: 0,
      currentDay: 1,
      userXp: 0,
    };
  }
}

export async function toggleDayCompletion(dayNumber: number) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    // Find challengeDay by dayNumber or create if missing
    let challengeDay = await db.challengeDay.findUnique({
      where: { dayNumber },
    });

    if (!challengeDay) {
      challengeDay = await db.challengeDay.create({
        data: {
          dayNumber,
          title: `Day ${dayNumber}`,
          missionTitle: `Day ${dayNumber} Mission`,
          phase: dayNumber <= 10 ? 'learn_ai' : dayNumber <= 25 ? 'build_agent' : dayNumber <= 40 ? 'portfolio' : 'client_outreach',
        },
      });
    }

    // Check if user has already completed this day
    const existing = await db.challengeDayCompletion.findUnique({
      where: {
        userId_challengeDayId: {
          userId: user.id,
          challengeDayId: challengeDay.id,
        },
      },
    });

    let isCompleted = false;

    if (existing) {
      // Unmark: delete completion and decrement XP by 50 (floor at 0)
      await db.challengeDayCompletion.delete({
        where: { id: existing.id },
      });

      const currentXp = user.xp || 0;
      const newXp = Math.max(0, currentXp - 50);

      await db.user.update({
        where: { id: user.id },
        data: { xp: newXp },
      });

      isCompleted = false;
    } else {
      // Mark complete: create completion and increment XP by 50
      await db.challengeDayCompletion.create({
        data: {
          userId: user.id,
          challengeDayId: challengeDay.id,
        },
      });

      await db.user.update({
        where: { id: user.id },
        data: { xp: { increment: 50 } },
      });

      isCompleted = true;
    }

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/challenge');

    // Retrieve fresh progress state
    const completions = await db.challengeDayCompletion.findMany({
      where: { userId: user.id },
      include: {
        challengeDay: {
          select: { dayNumber: true },
        },
      },
    });

    const completedDays = completions
      .map((c: any) => c.challengeDay.dayNumber)
      .sort((a: number, b: number) => a - b);

    const freshUser = await db.user.findUnique({
      where: { id: user.id },
      select: { xp: true },
    });

    return {
      success: true,
      completedDays,
      totalCompleted: completedDays.length,
      updatedXp: freshUser?.xp || 0,
      isCompleted,
    };
  } catch (error) {
    console.error('[TOGGLE_DAY_COMPLETION]', error);
    throw error;
  }
}

export async function getChallengeDayByLessonId(lessonId: string) {
  try {
    const challengeDay = await db.challengeDay.findFirst({
      where: { lessonId }
    });
    return challengeDay;
  } catch (error) {
    console.error('[GET_CHALLENGE_DAY_BY_LESSON_ID]', error);
    return null;
  }
}

export async function autoCompleteChallengeForLesson(_userId: string, _lessonId: string) {
  // Roadmap days are tracked through conscious mission checklist toggling in V2
  return false;
}
