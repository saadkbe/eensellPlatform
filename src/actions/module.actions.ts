"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "./user.actions";
import { revalidatePath } from "next/cache";
import { unstable_cache } from "next/cache";

// Check if current user is admin
async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }
  return user;
}

// =====================
// MODULE ACTIONS
// =====================

// Get all modules (with lesson counts)
export async function getModules() {
  return db.module.findMany({
    where: { isPublished: true },
    include: {
      lessons: {
        where: { isPublished: true },
        orderBy: { order: "asc" },
        select: { id: true, title: true, duration: true },
      },
    },
    orderBy: { order: "asc" },
  });
}

// Get all modules for admin (including unpublished)
export async function getAdminModules() {
  await requireAdmin();

  return db.module.findMany({
    include: {
      lessons: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
  });
}

// Get single module with lessons
export async function getModule(moduleId: string) {
  return db.module.findUnique({
    where: { id: moduleId },
    include: {
      lessons: {
        where: { isPublished: true },
        orderBy: { order: "asc" },
        include: {
          resources: true,
        },
      },
    },
  });
}

// Create module (admin)
export async function createModule(data: {
  title: string;
  description?: string;
  imageUrl?: string;
}) {
  await requireAdmin();

  const lastModule = await db.module.findFirst({
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const module = await db.module.create({
    data: {
      ...data,
      order: (lastModule?.order ?? -1) + 1,
    },
  });

  revalidatePath("/admin/courses");
  revalidatePath("/dashboard/modules");

  return module;
}

// Update module (admin)
export async function updateModule(
  moduleId: string,
  data: {
    title?: string;
    description?: string;
    imageUrl?: string;
    isPublished?: boolean;
  }
) {
  await requireAdmin();

  // Check if we are publishing the module for the first time
  let wasJustPublished = false;
  if (data.isPublished === true) {
    const existing = await db.module.findUnique({
      where: { id: moduleId },
      select: { isPublished: true },
    });
    if (existing && !existing.isPublished) {
      wasJustPublished = true;
    }
  }

  const module = await db.module.update({
    where: { id: moduleId },
    data,
  });

  // Notify all active users when a module goes live
  if (wasJustPublished) {
    // Get the first published lesson to build the correct URL
    const firstLesson = await db.lesson.findFirst({
      where: { moduleId: module.id, isPublished: true },
      orderBy: { order: "asc" },
      select: { id: true },
    });

    const linkUrl = firstLesson
      ? `/dashboard/modules/${module.id}/${firstLesson.id}`
      : `/dashboard/modules`;

    const { notifyAllActiveUsers } = await import("./notification.actions");
    await notifyAllActiveUsers({
      title: "🎉 محتوى جديد متاح!",
      message: `الموديول "${module.title}" أصبح متاحاً الآن. شاهده الآن!`,
      linkUrl,
      skipEmail: true, // We send the premium custom email instead
    });

    // Send Premium Email Template
    const activeUsers = await db.user.findMany({
      where: { status: "ACTIVE" },
      select: { email: true, firstName: true },
    });
    
    if (activeUsers.length > 0) {
      const { sendModuleDroppedEmail } = await import("./email.actions");
      const recipients = activeUsers.map(u => ({ 
        email: u.email!, 
        name: u.firstName || "Student" 
      }));
      await sendModuleDroppedEmail(recipients, module.title, linkUrl);
    }
  }

  revalidatePath("/admin/courses");
  revalidatePath("/dashboard/modules");
  revalidatePath("/dashboard");

  return module;
}

// Delete module (admin)
export async function deleteModule(moduleId: string) {
  await requireAdmin();

  await db.module.delete({
    where: { id: moduleId },
  });

  revalidatePath("/admin/courses");
  revalidatePath("/dashboard/modules");
}

// Reorder modules (admin)
export async function reorderModules(
  orderedIds: { id: string; order: number }[]
) {
  await requireAdmin();

  await Promise.all(
    orderedIds.map(({ id, order }) =>
      db.module.update({ where: { id }, data: { order } })
    )
  );

  revalidatePath("/admin/courses");
  revalidatePath("/dashboard/modules");
}

// =====================
// LESSON ACTIONS
// =====================

// Check if there is a new lesson published in the last 7 days (cached 60s)
export const getHasNewLesson = unstable_cache(
  async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const newLessonCount = await db.lesson.count({
      where: {
        isPublished: true,
        createdAt: { gte: sevenDaysAgo },
      },
    });

    return newLessonCount > 0;
  },
  ["has-new-lesson"],
  { revalidate: 60 }
);

// Get lesson with module context
export async function getLesson(lessonId: string) {
  return db.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: {
        include: {
          lessons: {
            where: { isPublished: true },
            orderBy: { order: "asc" },
            select: { id: true, title: true, order: true, duration: true },
          },
        },
      },
      resources: true,
    },
  });
}

// Create lesson (admin)
export async function createLesson(data: {
  title: string;
  description?: string;
  videoUrl?: string;
  duration?: number;
  moduleId: string;
  requiresHomework?: boolean;
}) {
  await requireAdmin();

  const lastLesson = await db.lesson.findFirst({
    where: { moduleId: data.moduleId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const lesson = await db.lesson.create({
    data: {
      ...data,
      order: (lastLesson?.order ?? -1) + 1,
    },
  });

  revalidatePath("/admin/courses");
  revalidatePath("/dashboard/modules");

  return lesson;
}

// Update lesson (admin)
export async function updateLesson(
  lessonId: string,
  data: {
    title?: string;
    description?: string;
    videoUrl?: string;
    duration?: number;
    isPublished?: boolean;
    isFree?: boolean;
    requiresHomework?: boolean;
  }
) {
  await requireAdmin();

  const lesson = await db.lesson.update({
    where: { id: lessonId },
    data,
  });

  revalidatePath("/admin/courses");
  revalidatePath("/dashboard/modules");

  return lesson;
}

// Delete lesson (admin)
export async function deleteLesson(lessonId: string) {
  await requireAdmin();

  await db.lesson.delete({
    where: { id: lessonId },
  });

  revalidatePath("/admin/courses");
  revalidatePath("/dashboard/modules");
}

// Reorder lessons (admin)
export async function reorderLessons(
  orderedIds: { id: string; order: number }[]
) {
  await requireAdmin();

  await Promise.all(
    orderedIds.map(({ id, order }) =>
      db.lesson.update({ where: { id }, data: { order } })
    )
  );

  revalidatePath("/admin/courses");
  revalidatePath("/dashboard/modules");
}

// =====================
// RESOURCE ACTIONS
// =====================

// Get all resources
export async function getResources(type?: string) {
  const where = type ? { type } : {};
  return db.resource.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

// Create resource (admin)
export async function createResource(data: {
  title: string;
  description?: string;
  type: string;
  fileUrl?: string;
  lessonId?: string;
}) {
  await requireAdmin();

  const resource = await db.resource.create({ data });

  revalidatePath("/admin/courses");
  revalidatePath("/dashboard/resources");

  return resource;
}

// Delete resource (admin)
export async function deleteResource(resourceId: string) {
  await requireAdmin();

  await db.resource.delete({ where: { id: resourceId } });

  revalidatePath("/admin/courses");
  revalidatePath("/dashboard/resources");
}

// =====================
// LIVE CALL ACTIONS
// =====================

// Get upcoming live calls
export async function getUpcomingLiveCalls() {
  return db.liveCall.findMany({
    where: {
      scheduledAt: { gte: new Date() },
      isCompleted: false,
    },
    orderBy: { scheduledAt: "asc" },
  });
}

// Get past live calls (replays)
export async function getPastLiveCalls() {
  return db.liveCall.findMany({
    where: {
      OR: [
        { scheduledAt: { lt: new Date() } },
        { isCompleted: true },
      ],
      replayUrl: { not: null },
    },
    orderBy: { scheduledAt: "desc" },
  });
}

// Create live call (admin)
export async function createLiveCall(data: {
  title: string;
  description?: string;
  scheduledAt: Date;
  meetingUrl?: string;
}) {
  await requireAdmin();

  const call = await db.liveCall.create({ data });

  revalidatePath("/admin");
  revalidatePath("/dashboard/live-calls");
  revalidatePath("/dashboard");

  return call;
}

// =====================
// ANNOUNCEMENT ACTIONS
// =====================

// Get published announcements
export async function getAnnouncements() {
  return db.announcement.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
}

// Create announcement (admin)
export async function createAnnouncement(data: {
  title: string;
  content: string;
}) {
  await requireAdmin();

  const announcement = await db.announcement.create({ data });

  const { notifyAllActiveUsers } = await import("./notification.actions");
  await notifyAllActiveUsers({
    title: "📢 " + data.title,
    message: data.content,
    linkUrl: "/dashboard",
    skipEmail: false, // Broadcast an email as well
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");

  return announcement;
}
