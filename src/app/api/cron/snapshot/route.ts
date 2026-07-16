import { NextResponse } from "next/server";
import { getActiveCampaign, ensureSnapshots } from "@/app/admin/tracking/actions";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    
    // Simple protection for cron job. In production, Vercel cron uses CRON_SECRET.
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activeCampaign = await getActiveCampaign();
    
    if (!activeCampaign) {
      return NextResponse.json({ message: "No active campaign found." });
    }

    // ensureSnapshots will generate missing snapshots up to today.
    await ensureSnapshots(activeCampaign.id, activeCampaign.startDate);

    return NextResponse.json({ success: true, message: "Snapshots verified and generated." });
  } catch (error) {
    console.error("Cron snapshot error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
