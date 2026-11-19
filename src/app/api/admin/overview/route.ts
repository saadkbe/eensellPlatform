import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Baseline paid students from the initial cohort: 116 students @ 200 MAD
const BASELINE_PAID_STUDENTS = 116;
const HISTORICAL_PRICE_PER_STUDENT = 200; // Historical cohort kept at 200 MAD previously paid
const BASELINE_REVENUE = BASELINE_PAID_STUDENTS * HISTORICAL_PRICE_PER_STUDENT; // 23,200 MAD

// Every PRO upgrade and every new confirmed student is worth 499 MAD
const PRO_UPGRADE_PRICE = 499;
const NEW_STUDENT_PRICE = 499;

export async function GET(req: Request) {
  try {
    const user = await currentUser();

    if (!user || user.publicMetadata?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const fromStr = searchParams.get("from");
    const toStr = searchParams.get("to");

    let dateFilter: { createdAt?: { gte: Date; lt: Date } } = {};
    const hasDateFilter = Boolean(fromStr && toStr);

    if (hasDateFilter && fromStr && toStr) {
      const startDate = new Date(fromStr);
      const endDate = new Date(toStr);
      endDate.setDate(endDate.getDate() + 1); // include the entire end day

      dateFilter = {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      };
    }

    const [
      totalUsers,
      pendingUsers,
      suspendedUsers,
      totalModules,
      totalLessons,
      recentSignups,
      totalProUsers,
      newConfirmedStudents,
      completedLessonsCount,
      challengeCompletionsCount,
      pendingHomeworksCount,
      pendingReportsCount,
      pendingWithdrawalsCount,
      pendingStudentsList,
      pendingHomeworksList,
      topXPStudents,
      recentActivity,
    ] = await Promise.all([
      db.user.count({ where: { role: { not: "ADMIN" }, ...dateFilter } }),
      db.user.count({ where: { status: "PENDING", ...dateFilter } }),
      db.user.count({ where: { status: "SUSPENDED", ...dateFilter } }),
      db.module.count(),
      db.lesson.count(),
      db.user.findMany({
        where: { role: { not: "ADMIN" }, ...dateFilter },
        orderBy: { createdAt: "desc" },
        take: 12,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          imageUrl: true,
          status: true,
          tier: true,
          isPro: true,
          goal: true,
          incomeGoal: true,
          xp: true,
          createdAt: true,
        },
      }),
      // Pro members: each user marked as PRO adds 499 MAD to the balance
      db.user.count({
        where: {
          role: { not: "ADMIN" },
          status: "ACTIVE",
          OR: [{ isPro: true }, { tier: "PRO" }],
          ...(hasDateFilter && dateFilter.createdAt ? { updatedAt: dateFilter.createdAt } : {}),
        },
      }),
      // Newly activated non-pro students (beyond the 116)
      db.user.count({
        where: {
          role: { not: "ADMIN" },
          status: "ACTIVE",
          tier: "UNIVERSITY_V2",
          isPro: false,
          ...(hasDateFilter && dateFilter.createdAt ? { createdAt: dateFilter.createdAt } : {}),
        },
      }),
      db.progress.count({ where: { isCompleted: true } }),
      db.challengeDayCompletion.count(),
      db.homework.count({ where: { status: "PENDING" } }),
      db.taskReport.count({ where: { status: "PENDING" } }),
      db.withdrawalRequest.count({ where: { status: "PENDING" } }),
      // Immediate pending student approvals
      db.user.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          imageUrl: true,
          createdAt: true,
          goal: true,
        },
      }),
      // Immediate pending homework reviews
      db.homework.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        take: 4,
        select: {
          id: true,
          fileUrl: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              imageUrl: true,
            },
          },
          lesson: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      }),
      // Top 5 XP leaders
      db.user.findMany({
        where: { role: { not: "ADMIN" } },
        orderBy: { xp: "desc" },
        take: 5,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          imageUrl: true,
          xp: true,
          status: true,
          tier: true,
          isPro: true,
        },
      }),
      // Recent platform activity
      db.userActivity.findMany({
        orderBy: { timestamp: "desc" },
        take: 6,
        select: {
          id: true,
          path: true,
          duration: true,
          timestamp: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              imageUrl: true,
              email: true,
            },
          },
        },
      }),
    ]);

    // Calculate active paid students and total revenue balance
    const activeUsers = hasDateFilter
      ? newConfirmedStudents
      : BASELINE_PAID_STUDENTS + newConfirmedStudents;

    // Balance calculation
    const historicalRevenue = BASELINE_REVENUE;
    const proRevenue = totalProUsers * PRO_UPGRADE_PRICE;
    const v2Revenue = newConfirmedStudents * NEW_STUDENT_PRICE;
    const revenue = hasDateFilter
      ? proRevenue + v2Revenue
      : historicalRevenue + proRevenue + v2Revenue;

    const conversionRate = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

    return NextResponse.json(
      {
        stats: {
          totalUsers,
          activeUsers,
          pendingUsers,
          suspendedUsers,
          totalModules,
          totalLessons,
          totalProUsers,
          newConfirmedStudents,
          completedLessonsCount,
          challengeCompletionsCount,
          pendingHomeworksCount,
          pendingReportsCount,
          pendingWithdrawalsCount,
          revenue,
          conversionRate,
          revenueBreakdown: {
            historical: historicalRevenue,
            pro: proRevenue,
            v2: v2Revenue,
            total: revenue,
          },
          tierBreakdown: {
            pro: totalProUsers,
            v2: newConfirmedStudents,
            free: Math.max(0, totalUsers - (totalProUsers + newConfirmedStudents)),
          },
        },
        recentSignups,
        pendingStudentsList,
        pendingHomeworksList,
        topXPStudents,
        recentActivity,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("[ADMIN_OVERVIEW_GET]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
