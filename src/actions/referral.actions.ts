"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "./user.actions";
import { revalidatePath } from "next/cache";

// --- Student Referral Actions ---

export async function getStudentReferralStats() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const referrals = await db.referral.findMany({
    where: { referrerId: user.id },
    include: { referredUser: { select: { firstName: true, lastName: true, createdAt: true, imageUrl: true } } },
    orderBy: { createdAt: "desc" },
  });

  const withdrawals = await db.withdrawalRequest.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const payoutInfo = await db.payoutInfo.findUnique({
    where: { userId: user.id },
  });

  let totalEarned = 0;
  let pendingCommissions = 0;
  let totalWithdrawn = 0;
  let processingWithdrawals = 0;

  referrals.forEach((r) => {
    if (r.status === "SUCCESSFUL") totalEarned += r.commissionAmount;
    if (r.status === "PENDING") pendingCommissions += r.commissionAmount;
  });

  withdrawals.forEach((w) => {
    if (w.status === "PAID") totalWithdrawn += w.amount;
    if (w.status === "PROCESSING" || w.status === "PENDING") processingWithdrawals += w.amount;
  });

  const availableBalance = totalEarned - totalWithdrawn - processingWithdrawals;

  const totalRegistered = referrals.length;
  const successfulReferrals = referrals.filter(r => r.status === "SUCCESSFUL").length;
  const pendingReferrals = referrals.filter(r => r.status === "PENDING").length;

  return {
    referrals,
    withdrawals,
    payoutInfo,
    stats: {
      totalEarned,
      totalWithdrawn,
      availableBalance,
      pendingCommissions,
      totalRegistered,
      successfulReferrals,
      pendingReferrals,
      referralCode: user.referralCode,
    }
  };
}

export async function savePayoutInfo(data: { bankName: string; accountName: string; rib: string }) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  await db.payoutInfo.upsert({
    where: { userId: user.id },
    update: {
      bankName: data.bankName,
      accountName: data.accountName,
      rib: data.rib,
    },
    create: {
      userId: user.id,
      bankName: data.bankName,
      accountName: data.accountName,
      rib: data.rib,
    },
  });

  revalidatePath("/dashboard/referrals");
  return { success: true };
}

export async function requestWithdrawal(amount: number) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  if (amount <= 0) throw new Error("Invalid amount");

  const stats = await getStudentReferralStats();

  if (stats.stats.availableBalance < amount) {
    throw new Error("Insufficient available balance");
  }

  if (!stats.payoutInfo) {
    throw new Error("Payout information required");
  }

  // Prevent multiple pending withdrawals at once
  const existingPending = stats.withdrawals.find(w => w.status === "PENDING" || w.status === "PROCESSING");
  if (existingPending) {
    throw new Error("You already have a pending withdrawal request");
  }

  // Create the withdrawal transaction
  await db.withdrawalRequest.create({
    data: {
      userId: user.id,
      amount,
      status: "PENDING",
      payoutInfo: {
        bankName: stats.payoutInfo.bankName,
        accountName: stats.payoutInfo.accountName,
        rib: stats.payoutInfo.rib,
      } as any,
    },
  });

  revalidatePath("/dashboard/referrals");
  return { success: true };
}

// --- Admin Referral Actions ---

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }
  return user;
}

export async function getAdminReferralStats() {
  await requireAdmin();

  const allReferrals = await db.referral.findMany({
    include: {
      referrer: { select: { firstName: true, lastName: true, email: true, referralCode: true } },
      referredUser: { select: { firstName: true, lastName: true, email: true, createdAt: true } },
    }
  });

  const allWithdrawals = await db.withdrawalRequest.findMany();

  let totalCommissionsGenerated = 0;
  let totalCommissionsPaid = 0;
  let outstandingBalance = 0;

  allReferrals.forEach((r) => {
    if (r.status === "SUCCESSFUL") totalCommissionsGenerated += r.commissionAmount;
  });

  allWithdrawals.forEach((w) => {
    if (w.status === "PAID") {
      totalCommissionsPaid += w.amount;
    }
  });

  outstandingBalance = totalCommissionsGenerated - totalCommissionsPaid;

  const commissionSetting = await db.systemSetting.findUnique({ where: { key: "COMMISSION_RATE" }});
  const commissionRate = commissionSetting ? parseInt(commissionSetting.value) : 50;

  return {
    referrals: allReferrals,
    stats: {
      totalReferred: allReferrals.length,
      successfulReferrals: allReferrals.filter(r => r.status === "SUCCESSFUL").length,
      pendingReferrals: allReferrals.filter(r => r.status === "PENDING").length,
      totalCommissionsGenerated,
      totalCommissionsPaid,
      outstandingBalance,
      commissionRate,
      pendingWithdrawalsCount: allWithdrawals.filter(w => w.status === "PENDING").length,
    }
  };
}

export async function updateCommissionRate(rate: number) {
  await requireAdmin();
  
  if (rate < 0) throw new Error("Invalid rate");

  await db.systemSetting.upsert({
    where: { key: "COMMISSION_RATE" },
    update: { value: rate.toString() },
    create: { key: "COMMISSION_RATE", value: rate.toString() },
  });

  revalidatePath("/admin/referrals");
  return { success: true };
}

export async function getAdminWithdrawals() {
  await requireAdmin();
  
  return db.withdrawalRequest.findMany({
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateWithdrawalStatus(id: string, status: string, adminNote?: string) {
  const admin = await requireAdmin();

  // Validate status transition safely
  const allowedStatuses = ["PENDING", "PROCESSING", "PAID", "REJECTED", "CANCELLED"];
  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid status");
  }

  // Idempotent update
  await db.withdrawalRequest.update({
    where: { id },
    data: {
      status,
      adminNote,
      processedBy: admin.id,
      processedAt: new Date(),
    },
  });

  revalidatePath("/admin/referrals/withdrawals");
  revalidatePath("/admin/referrals");
  return { success: true };
}
