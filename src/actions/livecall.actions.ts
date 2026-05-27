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
