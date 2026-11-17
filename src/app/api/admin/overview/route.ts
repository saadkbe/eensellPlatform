import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

// Baseline paid students from the initial cohort: 115 students @ 200 MAD
const BASELINE_PAID_STUDENTS = 115;
const HISTORICAL_PRICE_PER_STUDENT = 200; // Historical cohort kept at 200 MAD previously paid
const BASELINE_REVENUE = BASELINE_PAID_STUDENTS * HISTORICAL_PRICE_PER_STUDENT; // 23,000 MAD

// Every new student confirmed and activated from now on is worth 499 MAD
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

    let dateFilter = {};
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
      newChallengePaidStudents,
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
      // Newly paid & confirmed students (non-admin, UNIVERSITY_V2 or PRO tier, ACTIVE)
      db.user.count({
        where: {
          role: { not: "ADMIN" },
          tier: { in: ["UNIVERSITY_V2", "PRO"] },
          status: "ACTIVE",
          ...dateFilter,
        },
      }),
    ]);

    // Calculate real revenue and active paid students (historical students @ 200 MAD, new students @ 499 MAD)
    const activeUsers = hasDateFilter
      ? newChallengePaidStudents
      : BASELINE_PAID_STUDENTS + newChallengePaidStudents;

    const revenue = hasDateFilter
      ? newChallengePaidStudents * NEW_STUDENT_PRICE
      : BASELINE_REVENUE + newChallengePaidStudents * NEW_STUDENT_PRICE;

    return NextResponse.json({
      stats: {
        totalUsers,
        activeUsers, // 115 for All Time (0 for new challenge)
        pendingUsers,
        suspendedUsers,
        totalModules,
        totalLessons,
        revenue, // 23,000 MAD for All Time (0 MAD for new challenge)
      },
      recentSignups,
    });
  } catch (error) {
    console.error("[ADMIN_OVERVIEW_GET]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
