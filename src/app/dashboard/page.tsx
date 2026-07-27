import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { DashboardClient } from "@/components/dashboard/home/dashboard-client";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const clerkUser = await currentUser();
  const firstName = clerkUser?.firstName || "there";
  const userId = clerkUser?.id || "";

  // Fetch all required data in parallel
  const [
    dbUser,
    totalModules,
    totalLessons,
    upcomingCall,
    activeCampaign,
    dailyProgresses,
    weeklyChallenge,
    recentActivity,
  ] = await Promise.all([
    db.user.findUnique({
      where: { clerkId: userId },
      include: { progress: { include: { lesson: { include: { module: true } } } } },
    }),
    db.module.count({ where: { isPublished: true } }),
    db.lesson.count({ where: { isPublished: true } }),
    db.liveCall.findFirst({
      where: { scheduledAt: { gte: new Date() }, isCompleted: false },
      orderBy: { scheduledAt: "asc" },
    }),
    db.campaign.findFirst({
      where: { status: "ACTIVE" },
      orderBy: { startDate: "desc" },
    }),
    db.user.findUnique({
      where: { clerkId: userId },
    }).then(u => {
      if (!u) return [];
      return db.dailyProgress.findMany({
        where: { userId: u.id, completed: true },
        orderBy: { date: "desc" },
      });
    }),
    db.weeklyChallenge.findFirst({
      where: { isActive: true },
      orderBy: { deadline: "asc" },
    }),
    // Fetch recent completions by other users to power "Recent Activity"
    db.progress.findMany({
      where: { isCompleted: true },
      include: { user: true, lesson: true },
      orderBy: { watchedAt: "desc" },
      take: 5,
    }),
  ]);

  const completedLessons = dbUser?.progress.filter((p) => p.isCompleted).length || 0;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Find the next incomplete lesson for "Today's Mission" and "Continue Learning"
  const inProgressLesson = dbUser?.progress
    .filter((p) => !p.isCompleted)
    .sort((a, b) => b.watchedAt.getTime() - a.watchedAt.getTime())[0];

  const continueLesson = inProgressLesson?.lesson;
  const continueModule = inProgressLesson?.lesson?.module;

  return (
    <DashboardClient
      firstName={firstName}
      greeting={getGreeting()}
      completedLessons={completedLessons}
      continueLesson={continueLesson}
      continueModule={continueModule}
      totalLessons={totalLessons}
      upcomingCall={upcomingCall}
      activeCampaign={activeCampaign}
      dailyProgresses={dailyProgresses}
      weeklyChallenge={weeklyChallenge}
      recentActivity={recentActivity}
    />
  );
}
