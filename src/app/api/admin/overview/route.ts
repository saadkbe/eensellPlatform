import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

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
    if (fromStr && toStr) {
      const startDate = new Date(fromStr);
      const endDate = new Date(toStr);
      endDate.setDate(endDate.getDate() + 1); // include the entire end day
      
      dateFilter = {
        createdAt: {
          gte: startDate,
          lt: endDate,
        }
      };
    }

    const [totalUsers, activeUsers, pendingUsers, suspendedUsers, totalModules, totalLessons, recentSignups] = await Promise.all([
      db.user.count({ where: { role: { not: "ADMIN" }, ...dateFilter } }),
      db.user.count({ where: { role: "ACTIVE_USER", ...dateFilter } }),
      db.user.count({ where: { status: "PENDING", ...dateFilter } }),
      db.user.count({ where: { status: "SUSPENDED", ...dateFilter } }),
      db.module.count(), // Modules and lessons remain all-time
      db.lesson.count(),
      db.user.findMany({ 
        where: { role: { not: "ADMIN" }, ...dateFilter }, 
        orderBy: { createdAt: "desc" }, 
        take: 8 
      }),
    ]);

    const revenue = activeUsers * 200;

    return NextResponse.json({
      stats: {
        totalUsers,
        activeUsers,
        pendingUsers,
        suspendedUsers,
        totalModules,
        totalLessons,
        revenue
      },
      recentSignups
    });

  } catch (error) {
    console.error("[ADMIN_OVERVIEW_GET]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
