import { getActiveCampaign, computeTodayStats, ensureSnapshots } from "./actions";
import { TrackingOverview } from "@/components/admin/tracking/tracking-overview";
import { DailyTrackerTable } from "@/components/admin/tracking/daily-tracker-table";
import { CreateCampaignModal } from "@/components/admin/tracking/create-campaign-modal";
import { differenceInDays } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminTrackingPage() {
  const activeCampaign = await getActiveCampaign();

  if (!activeCampaign) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-black mb-2">No Active Campaign</h2>
        <p className="text-muted-foreground mb-6">Create a new campaign to start tracking analytics.</p>
        <CreateCampaignModal />
      </div>
    );
  }

  // Ensure snapshots are generated up to today
  await ensureSnapshots(activeCampaign.id, activeCampaign.startDate);

  // Get real-time stats for today
  const todayStats = await computeTodayStats(activeCampaign.id, activeCampaign.startDate);
  
  // Calculate KPIs
  const totalRevenue = todayStats.paidStudents * activeCampaign.pricePerStudent;
  const daysRemaining = Math.max(differenceInDays(activeCampaign.endDate, new Date()), 1);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-12">
      <TrackingOverview 
        campaign={activeCampaign} 
        paidStudents={todayStats.paidStudents} 
        revenue={totalRevenue}
        daysRemaining={daysRemaining}
      />

      <DailyTrackerTable 
        snapshots={activeCampaign.snapshots} 
        studentGoal={activeCampaign.studentGoal} 
      />
    </div>
  );
}
