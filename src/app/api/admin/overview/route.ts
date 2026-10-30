import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

// Baseline paid students from the initial cohort: 115 students @ 200 MAD
const BASELINE_PAID_STUDENTS = 115;
const PRICE_PER_STUDENT = 200;
const BASELINE_REVENUE = BASELINE_PAID_STUDENTS * PRICE_PER_STUDENT; // 23,000 MAD

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
      // Newly paid students in current challenge (non-admin, UNIVERSITY_V2 tier, ACTIVE)
      db.user.count({
        where: {
          role: { not: "ADMIN" },
          tier: "UNIVERSITY_V2",
          status: "ACTIVE",
          ...dateFilter,
        },
      }),
    ]);

    // Calculate real revenue and active paid students
    const activeUsers = hasDateFilter
      ? newChallengePaidStudents
      : BASELINE_PAID_STUDENTS + newChallengePaidStudents;

    const revenue = hasDateFilter
      ? newChallengePaidStudents * PRICE_PER_STUDENT
      : BASELINE_REVENUE + newChallengePaidStudents * PRICE_PER_STUDENT;

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
