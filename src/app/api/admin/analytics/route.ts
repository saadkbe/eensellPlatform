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
    const dateParam = searchParams.get("date");
    
    // Default to today if no date is provided
    const targetDateStr = dateParam || new Date().toISOString().split("T")[0];
    
    // Parse the target date for activity filtering
    // Start of the target day (UTC)
    const startDate = new Date(targetDateStr);
    // End of the target day (UTC)
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const [totalUsers, activeUsers, sessionsForDate, activitiesForDate] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { status: "ACTIVE" } }),
      db.userSession.findMany({
        where: { date: targetDateStr },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
        },
        orderBy: { totalTime: "desc" },
      }),
      db.userActivity.findMany({
        where: {
          timestamp: {
            gte: startDate,
            lt: endDate,
          }
        },
        take: 100,
        orderBy: { timestamp: "desc" },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
        },
      }),
    ]);

    const activeUsersToday = sessionsForDate.length;
    const totalTimeToday = sessionsForDate.reduce((acc, s) => acc + s.totalTime, 0);
    const avgSessionTime = activeUsersToday > 0 ? Math.round(totalTimeToday / activeUsersToday) : 0;

    const overviewStats = {
      totalUsers,
      activeUsers,
      activeUsersToday,
      totalTimeToday,
      avgSessionTime,
    };

    return NextResponse.json({
      overviewStats,
      topUsers: sessionsForDate.slice(0, 10),
      recentActivities: activitiesForDate,
    });

  } catch (error) {
    console.error("[ADMIN_ANALYTICS_GET]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
