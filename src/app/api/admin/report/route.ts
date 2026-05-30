import { db } from "@/lib/db";
import { getCurrentUser } from "@/actions/user.actions";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [
    totalUsers,
    activeUsers,
    pendingUsers,
    suspendedUsers,
    rejectedUsers,
    totalModules,
    publishedModules,
    totalLessons,
    publishedLessons,
    totalProgress,
    completedProgress,
    recentUsers,
    moduleData,
  ] = await Promise.all([
    db.user.count({ where: { role: { not: "ADMIN" } } }),
    db.user.count({ where: { role: "ACTIVE_USER" } }),
    db.user.count({ where: { status: "PENDING" } }),
    db.user.count({ where: { status: "SUSPENDED" } }),
    db.user.count({ where: { status: "REJECTED" } }),
    db.module.count(),
    db.module.count({ where: { isPublished: true } }),
    db.lesson.count(),
    db.lesson.count({ where: { isPublished: true } }),
    db.progress.count(),
    db.progress.count({ where: { isCompleted: true } }),
    db.user.findMany({
      where: { role: { not: "ADMIN" } },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        role: true,
        createdAt: true,
        _count: { select: { progress: { where: { isCompleted: true } } } },
      },
    }),
    db.module.findMany({
      orderBy: { order: "asc" },
      select: {
        title: true,
        isPublished: true,
        _count: { select: { lessons: true } },
        lessons: {
          select: {
            _count: { select: { progress: { where: { isCompleted: true } } } },
          },
        },
      },
    }),
  ]);

  const revenue = activeUsers * 200;

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    stats: {
      totalUsers,
      activeUsers,
      pendingUsers,
      suspendedUsers,
      rejectedUsers,
      revenue,
      totalModules,
      publishedModules,
      totalLessons,
      publishedLessons,
      totalProgress,
      completedProgress,
    },
    recentUsers: recentUsers.map((u) => ({
      name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || "—",
      email: u.email,
      status: u.status,
      role: u.role,
      joinedAt: u.createdAt.toISOString(),
      completedLessons: u._count.progress,
    })),
    modules: moduleData.map((m) => ({
      title: m.title,
      isPublished: m.isPublished,
      lessonCount: m._count.lessons,
      totalCompletions: m.lessons.reduce((sum, l) => sum + l._count.progress, 0),
    })),
  });
}
