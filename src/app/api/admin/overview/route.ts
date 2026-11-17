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
    ] = await Promise.all([
      db.user.count({ where: { role: { not: "ADMIN" }, ...dateFilter } }),
      db.user.count({ where: { status: "PENDING", ...dateFilter } }),
      db.user.count({ where: { status: "SUSPENDED", ...dateFilter } }),
      db.module.count(),
      db.lesson.count(),
      db.user.findMany({
        where: { role: { not: "ADMIN" }, ...dateFilter },
        orderBy: { createdAt: "desc" },
        take: 8,
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
    ]);

    // Calculate active paid students and total revenue balance
    const activeUsers = hasDateFilter
      ? newConfirmedStudents
      : BASELINE_PAID_STUDENTS + newConfirmedStudents;

    // Balance: 116 historical students @ 200 MAD + (499 MAD for each user marked as PRO) + (499 MAD for each new student)
    const revenue = hasDateFilter
      ? (totalProUsers * PRO_UPGRADE_PRICE) + (newConfirmedStudents * NEW_STUDENT_PRICE)
      : BASELINE_REVENUE + (totalProUsers * PRO_UPGRADE_PRICE) + (newConfirmedStudents * NEW_STUDENT_PRICE);

    return NextResponse.json(
      {
        stats: {
          totalUsers,
          activeUsers,
          pendingUsers,
          suspendedUsers,
          totalModules,
          totalLessons,
          revenue,
        },
        recentSignups,
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
