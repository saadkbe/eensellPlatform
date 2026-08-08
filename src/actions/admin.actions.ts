"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "./user.actions";
import { sendApprovalEmail, sendRejectionEmail } from "./email.actions";
import { clerkClient } from "@clerk/nextjs/server";
import { UserRole, UserStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Check if current user is admin
async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }
  return user;
}

// Get all users with optional filters
export async function getAllUsers(filters?: {
  status?: UserStatus;
  role?: UserRole;
  search?: string;
}) {
  await requireAdmin();

  const where: Record<string, unknown> = {};

  if (filters?.status) where.status = filters.status;
  if (filters?.role) where.role = filters.role;
  if (filters?.search) {
    where.OR = [
      { email: { contains: filters.search, mode: "insensitive" } },
      { firstName: { contains: filters.search, mode: "insensitive" } },
      { lastName: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return db.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

// Get pending users
export async function getPendingUsers() {
  await requireAdmin();

  return db.user.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });
}

// Approve a user
export async function approveUser(userId: string) {
  let user;
  try {
    await requireAdmin();

    user = await db.user.update({
      where: { id: userId },
      data: {
        status: "ACTIVE",
        role: "ACTIVE_USER",
      },
    });

    try {
      // Handle Referral Commission
      const pendingReferral = await db.referral.findUnique({
        where: { referredUserId: userId }
      });

      if (pendingReferral && pendingReferral.status === "PENDING") {
        await db.referral.update({
          where: { id: pendingReferral.id },
          data: { status: "SUCCESSFUL" }
        });
      }
    } catch (referralError) {
      console.error("[approveUser] Failed to update referral status:", referralError);
      // We don't throw here, as the primary user approval succeeded.
    }

  } catch (error: any) {
    console.error("[approveUser] Core failure:", error);
    throw new Error(`Core failure: ${error.message}`);
  }

  // Update Clerk user metadata
  try {
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(user.clerkId, {
      publicMetadata: {
        role: "ACTIVE_USER",
        status: "ACTIVE",
      },
    });
  } catch (error) {
    console.error("Error updating Clerk metadata:", error);
  }

  // Send approval email
  try {
    await sendApprovalEmail(
      user.email,
      user.firstName || "User"
    );
  } catch (error) {
    console.error("Error sending approval email:", error);
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/pending");
  revalidatePath("/admin");

  return user;
}

// Reject a user
export async function rejectUser(userId: string) {
  await requireAdmin();

  const user = await db.user.update({
    where: { id: userId },
    data: { status: "REJECTED" },
  });

  // Update Clerk metadata
  try {
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(user.clerkId, {
      publicMetadata: {
        role: "PENDING_USER",
        status: "REJECTED",
      },
    });
  } catch (error) {
    console.error("Error updating Clerk metadata:", error);
  }

  // Send rejection email
  try {
    await sendRejectionEmail(
      user.email,
      user.firstName || "User"
    );
  } catch (error) {
    console.error("Error sending rejection email:", error);
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/pending");
  revalidatePath("/admin");

  return user;
}

// Suspend a user
export async function suspendUser(userId: string) {
  await requireAdmin();

  const user = await db.user.update({
    where: { id: userId },
    data: { status: "SUSPENDED" },
  });

  // Update Clerk metadata
  try {
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(user.clerkId, {
      publicMetadata: {
        role: "ACTIVE_USER",
        status: "SUSPENDED",
      },
    });
  } catch (error) {
    console.error("Error updating Clerk metadata:", error);
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin");

  return user;
}

// Delete a user
export async function deleteUser(userId: string) {
  await requireAdmin();

  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  // Delete from Clerk
  try {
    const clerk = await clerkClient();
    await clerk.users.deleteUser(user.clerkId);
  } catch (error) {
    console.error("Error deleting from Clerk:", error);
  }

  // Delete from DB
  await db.user.delete({
    where: { id: userId },
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin");
}

// Get admin dashboard stats
export async function getAdminStats() {
  await requireAdmin();

  const [
    totalUsers,
    activeUsers,
    pendingUsers,
    totalModules,
    totalLessons,
    recentSignups,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { status: "ACTIVE" } }),
    db.user.count({ where: { status: "PENDING" } }),
    db.module.count(),
    db.lesson.count(),
    db.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return {
    totalUsers,
    activeUsers,
    pendingUsers,
    totalModules,
    totalLessons,
    recentSignups,
  };
}
