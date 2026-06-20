"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

async function getAuthUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("User not found");
  return user;
}

export async function submitHomework(lessonId: string, fileUrl: string) {
  const user = await getAuthUser();

  // Upsert homework so a user can re-submit if previously rejected or pending
  const homework = await db.homework.upsert({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId: lessonId,
      },
    },
    update: {
      fileUrl,
      status: "PENDING",
      feedback: null, // Clear feedback on resubmission
    },
    create: {
      userId: user.id,
      lessonId,
      fileUrl,
      status: "PENDING",
    },
  });

  revalidatePath(`/dashboard/modules`);
  return homework;
}

export async function getHomeworkForLesson(lessonId: string) {
  const user = await getAuthUser();

  return db.homework.findUnique({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId,
      },
    },
  });
}

// Admin Actions
export async function getPendingHomeworks() {
  const user = await getAuthUser();
  if (user.role !== "ADMIN") throw new Error("Only admins can view pending homeworks");

  return db.homework.findMany({
    where: { status: "PENDING" },
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true, email: true, imageUrl: true },
      },
      lesson: {
        select: { id: true, title: true, module: { select: { title: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllHomeworks() {
  const user = await getAuthUser();
  if (user.role !== "ADMIN") throw new Error("Only admins can view homeworks");

  return db.homework.findMany({
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true, email: true, imageUrl: true },
      },
      lesson: {
        select: { id: true, title: true, module: { select: { title: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function reviewHomework(homeworkId: string, status: "APPROVED" | "REJECTED", feedback?: string) {
  const user = await getAuthUser();
  if (user.role !== "ADMIN") throw new Error("Only admins can review homework");

  const existing = await db.homework.findUnique({ where: { id: homeworkId } });
  if (!existing) throw new Error("Homework not found");

  const homework = await db.homework.update({
    where: { id: homeworkId },
    data: {
      status,
      feedback,
    },
  });

  if (status === "APPROVED" && existing.status !== "APPROVED") {
    await db.user.update({
      where: { id: existing.userId },
      data: { xp: { increment: 100 } },
    });
  } else if (status !== "APPROVED" && existing.status === "APPROVED") {
    await db.user.update({
      where: { id: existing.userId },
      data: { xp: { decrement: 100 } },
    });
  }

  revalidatePath("/admin/homeworks");
  revalidatePath("/dashboard");
  return homework;
}
