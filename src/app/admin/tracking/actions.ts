"use server";

import { db } from "@/lib/db";
import { format, startOfDay, endOfDay, subDays, isBefore } from "date-fns";

export async function getActiveCampaign() {
  return await db.campaign.findFirst({
    where: { status: "ACTIVE" },
    include: { snapshots: { orderBy: { date: "asc" } } },
  });
}

export async function getAllCampaigns() {
  return await db.campaign.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { snapshots: true } } },
  });
}

export async function createCampaign(data: {
  name: string;
  startDate: Date;
  endDate: Date;
  studentGoal: number;
  pricePerStudent: number;
}) {
  await db.campaign.updateMany({
    where: { status: "ACTIVE" },
    data: { status: "COMPLETED" },
  });

  return await db.campaign.create({
    data: {
      ...data,
      status: "ACTIVE",
    },
  });
}

export async function computeTodayStats(campaignId: string, startDate: Date) {
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const newAccounts = await db.user.count({
    where: {
      createdAt: { gte: todayStart, lte: todayEnd },
    },
  });

  const pendingPayments = await db.user.count({
    where: {
      status: "PENDING",
      createdAt: { gte: startDate },
    },
  });

  const paidStudents = await db.user.count({
    where: {
      status: "ACTIVE",
      createdAt: { gte: startDate },
    },
  });

  return {
    newAccounts,
    pendingPayments,
    paidStudents,
    activatedAccounts: paidStudents,
  };
}

export async function captureSnapshot(campaignId: string, targetDate: Date) {
  const campaign = await db.campaign.findUnique({ where: { id: campaignId } });
  if (!campaign) return null;

  const dateStr = format(targetDate, "yyyy-MM-dd");
  
  const existing = await db.campaignSnapshot.findUnique({
    where: { campaignId_date: { campaignId, date: dateStr } },
  });

  if (existing) return existing;

  const targetStart = startOfDay(targetDate);
  const targetEnd = endOfDay(targetDate);

  const newAccounts = await db.user.count({
    where: { createdAt: { gte: targetStart, lte: targetEnd } },
  });

  const pendingPayments = await db.user.count({
    where: { status: "PENDING", createdAt: { gte: campaign.startDate, lte: targetEnd } },
  });

  const paidStudents = await db.user.count({
    where: { status: "ACTIVE", createdAt: { gte: campaign.startDate, lte: targetEnd } },
  });

  const newPaidToday = await db.user.count({
    where: {
      status: "ACTIVE",
      updatedAt: { gte: targetStart, lte: targetEnd },
      createdAt: { gte: campaign.startDate },
    }
  });
  
  const dailyRevenue = newPaidToday * campaign.pricePerStudent;
  const runningTotal = paidStudents * campaign.pricePerStudent;
  const progress = Math.min((paidStudents / campaign.studentGoal) * 100, 100);

  return await db.campaignSnapshot.create({
    data: {
      campaignId,
      date: dateStr,
      newAccounts,
      pendingPayments,
      paidStudents,
      activatedAccounts: paidStudents,
      revenue: dailyRevenue,
      runningTotal,
      progress,
    },
  });
}

export async function ensureSnapshots(campaignId: string, startDate: Date) {
  const today = startOfDay(new Date());
  let current = startOfDay(startDate);
  
  while (isBefore(current, today)) {
    await captureSnapshot(campaignId, current);
    current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
  }
}

export async function getPendingUsers(startDate: Date) {
  return await db.user.findMany({
    where: {
      status: "PENDING",
      createdAt: { gte: startDate },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRecentPayments(startDate: Date) {
  return await db.user.findMany({
    where: {
      status: "ACTIVE",
      createdAt: { gte: startDate },
    },
    orderBy: { updatedAt: "desc" },
    take: 10,
  });
}
