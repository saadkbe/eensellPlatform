"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "./user.actions";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }
  return user;
}

export interface SubmitReportInput {
  dayNumber: number;
  taskTitle: string;
  type?: "PROBLEM" | "QUESTION" | "FEEDBACK";
  message: string;
}

// Student submission from the chatbot widget
export async function submitTaskReport(input: SubmitReportInput) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("You must be signed in to submit a report.");
    }

    if (!input.message || input.message.trim().length === 0) {
      throw new Error("Report message cannot be empty.");
    }

    const report = await (db as any).taskReport.create({
      data: {
        userId: user.id,
        dayNumber: input.dayNumber,
        taskTitle: input.taskTitle,
        type: input.type || "PROBLEM",
        message: input.message.trim(),
        status: "PENDING",
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            imageUrl: true,
          },
        },
      },
    });

    revalidatePath("/admin/reports");
    revalidatePath("/admin");

    return { success: true, report };
  } catch (error: any) {
    console.error("[SUBMIT_TASK_REPORT]", error);
    return { success: false, error: error.message || "Failed to submit report" };
  }
}

// Admin queries
export async function getAllTaskReports(filters?: {
  status?: "PENDING" | "IN_REVIEW" | "RESOLVED";
  search?: string;
}) {
  await requireAdmin();

  const where: Record<string, unknown> = {};

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.search) {
    where.OR = [
      { message: { contains: filters.search, mode: "insensitive" } },
      { taskTitle: { contains: filters.search, mode: "insensitive" } },
      {
        user: {
          OR: [
            { email: { contains: filters.search, mode: "insensitive" } },
            { firstName: { contains: filters.search, mode: "insensitive" } },
            { lastName: { contains: filters.search, mode: "insensitive" } },
          ],
        },
      },
    ];
  }

  const reports = await (db as any).taskReport.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          imageUrl: true,
        },
      },
    },
  });

  return reports;
}

export async function getPendingReportsCount(): Promise<number> {
  try {
    return await (db as any).taskReport.count({
      where: { status: "PENDING" },
    });
  } catch (error) {
    return 0;
  }
}

export async function updateTaskReportStatus(
  reportId: string,
  status: "PENDING" | "IN_REVIEW" | "RESOLVED",
  adminNotes?: string
) {
  await requireAdmin();

  const report = await (db as any).taskReport.update({
    where: { id: reportId },
    data: {
      status,
      ...(adminNotes !== undefined ? { adminNotes } : {}),
    },
  });

  revalidatePath("/admin/reports");
  revalidatePath("/admin");

  return { success: true, report };
}

export async function deleteTaskReport(reportId: string) {
  await requireAdmin();

  await (db as any).taskReport.delete({
    where: { id: reportId },
  });

  revalidatePath("/admin/reports");
  revalidatePath("/admin");

  return { success: true };
}
