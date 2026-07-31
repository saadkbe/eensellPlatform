import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { DashboardClient } from "@/components/dashboard/home/dashboard-client";
import { getLeaderboard } from "@/actions/user.actions";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  // Use auth() (fast JWT parse) instead of currentUser() (full Clerk API call)
  const { userId } = await auth();

  // Fire ALL queries in parallel — no sequential waterfalls
  const [
    dbUser,
    totalModules,
    totalLessons,
    announcements,
    upcomingCall,
    totalResources,
    leaderboard,
    recentProgress,
  ] = await Promise.all([
    db.user.findUnique({
      where: { clerkId: userId || "" },
      include: {
        progress: {
          where: { isCompleted: true },
          select: { id: true },
        },
      },
    }),
    db.module.count({ where: { isPublished: true } }),
    db.lesson.count({ where: { isPublished: true } }),
    db.announcement.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    db.liveCall.findFirst({
      where: { scheduledAt: { gte: new Date() }, isCompleted: false },
      orderBy: { scheduledAt: "asc" },
    }),
    db.resource.count(),
    getLeaderboard(),
    // Push sorting to DB instead of fetching ALL progress and sorting in JS
    db.progress.findMany({
      where: { user: { clerkId: userId || "" } },
      orderBy: { watchedAt: "desc" },
      take: 5,
      include: { lesson: { include: { module: true } } },
    }),
  ]);

  const firstName = dbUser?.firstName || "there";
  const completedLessons = dbUser?.progress.length || 0;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Find the most recent non-completed lesson for "Continue Learning"
  const inProgressResult = await db.progress.findFirst({
    where: { user: { clerkId: userId || "" }, isCompleted: false },
    orderBy: { watchedAt: "desc" },
    include: { lesson: { include: { module: true } } },
  });

  const continueLesson = inProgressResult?.lesson;
  const continueModule = inProgressResult?.lesson?.module;

  return (
    <DashboardClient
      firstName={firstName}
      greeting={getGreeting()}
      totalModules={totalModules}
      completedLessons={completedLessons}
      progressPercent={progressPercent}
      totalResources={totalResources}
      continueLesson={continueLesson}
      continueModule={continueModule}
      totalLessons={totalLessons}
      announcements={announcements}
      upcomingCall={upcomingCall}
      recentlyWatched={recentProgress}
      leaderboard={leaderboard}
    />
  );
}
