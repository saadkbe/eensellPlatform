"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "./user.actions";
import { revalidatePath } from "next/cache";

// Get notifications for the current user (latest 20)
export async function getUserNotifications() {
  const user = await getCurrentUser();
  if (!user) return [];

  return db.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

// Get unread notification count for the current user
export async function getUnreadNotificationCount() {
  const user = await getCurrentUser();
  if (!user) return 0;

  return db.notification.count({
    where: { userId: user.id, isRead: false },
  });
}

// Mark a single notification as read
export async function markNotificationAsRead(notificationId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  await db.notification.update({
    where: { id: notificationId, userId: user.id },
    data: { isRead: true },
  });

  revalidatePath("/dashboard");
}

// Mark all notifications as read
export async function markAllNotificationsAsRead() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  await db.notification.updateMany({
    where: { userId: user.id, isRead: false },
    data: { isRead: true },
  });

  revalidatePath("/dashboard");
}

// Send a notification to all active users (admin utility)
export async function notifyAllActiveUsers(data: {
  title: string;
  message: string;
  linkUrl?: string;
}) {
  const activeUsers = await db.user.findMany({
    where: { status: "ACTIVE" },
    select: { id: true },
  });

  if (activeUsers.length === 0) return;

  await db.notification.createMany({
    data: activeUsers.map((user) => ({
      userId: user.id,
      title: data.title,
      message: data.message,
      linkUrl: data.linkUrl,
    })),
  });
}
