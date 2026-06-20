"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.actions";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }
  return user;
}

export async function getAllLiveCalls() {
  return db.liveCall.findMany({
    orderBy: { scheduledAt: "desc" },
  });
}

export async function createLiveCall(data: {
  title: string;
  description?: string;
  scheduledAt: Date;
  meetingUrl?: string;
}) {
  await requireAdmin();
  const call = await db.liveCall.create({ data });

  // Send Premium Email Template for Live Session
  const activeUsers = await db.user.findMany({
    where: { status: "ACTIVE" },
    select: { email: true, firstName: true },
  });
  
  if (activeUsers.length > 0) {
    const { sendLiveSessionScheduledEmail } = await import("./email.actions");
    const recipients = activeUsers.map(u => ({ 
      email: u.email!, 
      name: u.firstName || "Student" 
    }));
    
    const formattedDate = new Date(data.scheduledAt).toLocaleString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
    
    await sendLiveSessionScheduledEmail(recipients, data.title, formattedDate, "/dashboard/live-calls");
    
    const { notifyAllActiveUsers } = await import("./notification.actions");
    await notifyAllActiveUsers({
      title: "New Live Session Scheduled",
      message: `A new live session "${data.title}" has been scheduled for ${formattedDate}.`,
      linkUrl: "/dashboard/live-calls",
      skipEmail: true,
    });
  }

  revalidatePath("/admin/live-calls");
  revalidatePath("/dashboard/live-calls");
  revalidatePath("/dashboard");
  return call;
}

export async function updateLiveCall(
  id: string,
  data: {
    title?: string;
    description?: string;
    scheduledAt?: Date;
    meetingUrl?: string;
    replayUrl?: string;
    isCompleted?: boolean;
  }
) {
  await requireAdmin();
  const call = await db.liveCall.update({ where: { id }, data });
  revalidatePath("/admin/live-calls");
  revalidatePath("/dashboard/live-calls");
  return call;
}

export async function deleteLiveCall(id: string) {
  await requireAdmin();
  await db.liveCall.delete({ where: { id } });
  revalidatePath("/admin/live-calls");
  revalidatePath("/dashboard/live-calls");
}
