"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "./user.actions";
import { revalidatePath } from "next/cache";
import { sendBroadcastEmail } from "./email.actions";

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
  skipEmail?: boolean;
}) {
  const activeUsers = await db.user.findMany({
    where: { status: "ACTIVE" },
    select: { id: true, email: true },
  });

  if (activeUsers.length === 0) return;

  // 1. Create In-App Notifications
  await db.notification.createMany({
    data: activeUsers.map((user) => ({
      userId: user.id,
      title: data.title,
      message: data.message,
      linkUrl: data.linkUrl,
    })),
  });

  // 2. Send Broadcast Email (if not skipped)
  if (!data.skipEmail) {
    try {
    const emails = activeUsers.map((u) => u.email).filter(Boolean) as string[];
    let emailContent = `<p>${data.message}</p>`;
    
    if (data.linkUrl) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://eensell.com";
      const fullUrl = data.linkUrl.startsWith('http') ? data.linkUrl : `${appUrl}${data.linkUrl}`;
      emailContent += `<br><a href="${fullUrl}" style="display:inline-block;background:linear-gradient(135deg,#3B82F6,#2563EB);color:#FFFFFF;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px;">View details here</a>`;
    }

      await sendBroadcastEmail(emails, data.title, emailContent);
    } catch (error) {
      console.error("Failed to send broadcast emails with notifications:", error);
    }
  }
}
