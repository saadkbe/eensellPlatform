import { currentUser } from "@clerk/nextjs/server";
import { BookOpen, Trophy, TrendingUp, FileText } from "lucide-react";
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

  // Fetch data
  const dbUser = await db.user.findUnique({
    where: { clerkId: clerkUser?.id || "" },
    include: { progress: { include: { lesson: { include: { module: true } } } } },
  });

  const [totalModules, totalLessons, announcements, upcomingCall, totalResources] = await Promise.all([
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
  ]);

  const completedLessons = dbUser?.progress.filter((p) => p.isCompleted).length || 0;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const recentlyWatched = dbUser?.progress
    .sort((a, b) => b.watchedAt.getTime() - a.watchedAt.getTime())
    .slice(0, 5) || [];

  // Find the most recent non-completed lesson for "Continue Learning"
  const inProgressLesson = dbUser?.progress
    .filter((p) => !p.isCompleted)
    .sort((a, b) => b.watchedAt.getTime() - a.watchedAt.getTime())[0];

  // Find next incomplete lesson if no in-progress exists
  const continueLesson = inProgressLesson?.lesson;
  const continueModule = inProgressLesson?.lesson?.module;

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
      recentlyWatched={recentlyWatched}
    />
  );
}
