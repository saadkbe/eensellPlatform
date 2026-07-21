import { getActiveCampaign, computeTodayStats, ensureSnapshots, getPendingUsers, getRecentPayments } from "./actions";
import { TrackingOverview } from "@/components/admin/tracking/tracking-overview";
import { KpiGrid } from "@/components/admin/tracking/kpi-grid";
import { TrackingCharts } from "@/components/admin/tracking/tracking-charts";
import { ConversionFunnel } from "@/components/admin/tracking/conversion-funnel";
import { DailyTrackerTable } from "@/components/admin/tracking/daily-tracker-table";
import { PendingPaymentsTable } from "@/components/admin/tracking/pending-payments-table";
import { RecentPaymentsTable } from "@/components/admin/tracking/recent-payments-table";
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
  
  const pendingUsers = await getPendingUsers(activeCampaign.startDate);
  const recentPayments = await getRecentPayments(activeCampaign.startDate);

  // Calculate KPIs
  const totalRevenue = todayStats.paidStudents * activeCampaign.pricePerStudent;
  const daysElapsed = Math.max(differenceInDays(new Date(), activeCampaign.startDate), 1);
  const daysRemaining = Math.max(differenceInDays(activeCampaign.endDate, new Date()), 1);
  
  const averageSalesPerDay = todayStats.paidStudents / daysElapsed;
  const averageRevenuePerDay = totalRevenue / daysElapsed;
  
  const remainingStudents = Math.max(activeCampaign.studentGoal - todayStats.paidStudents, 0);
  const studentsNeededToday = remainingStudents / daysRemaining;

  const kpiData = {
    totalRevenue,
    paidStudents: todayStats.paidStudents,
    pendingPayments: todayStats.pendingPayments,
    activatedAccounts: todayStats.activatedAccounts,
    newAccountsToday: todayStats.newAccounts,
    averageSalesPerDay,
    studentsNeededToday,
    averageRevenuePerDay,
  };

  const funnelData = {
    accountsCreated: todayStats.paidStudents + todayStats.pendingPayments, // Approximation
    pendingPayments: todayStats.pendingPayments,
    paidStudents: todayStats.paidStudents,
    activatedAccounts: todayStats.activatedAccounts,
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-12">
      <TrackingOverview 
        campaign={activeCampaign} 
        paidStudents={todayStats.paidStudents} 
        revenue={totalRevenue}
        daysRemaining={daysRemaining}
      />
      
      <KpiGrid data={kpiData} />

      {activeCampaign.snapshots && activeCampaign.snapshots.length > 0 && (
        <TrackingCharts data={activeCampaign.snapshots.map(s => ({
          date: s.date,
          revenue: s.revenue,
          paidStudents: s.paidStudents
        }))} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ConversionFunnel data={funnelData} />
        </div>
        <div className="lg:col-span-2">
          {/* Insights could go here, or we let the funnel take more space */}
        </div>
      </div>

      <DailyTrackerTable 
        snapshots={activeCampaign.snapshots} 
        studentGoal={activeCampaign.studentGoal} 
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <PendingPaymentsTable users={pendingUsers} campaignId={activeCampaign.id} />
        <RecentPaymentsTable users={recentPayments} pricePerStudent={activeCampaign.pricePerStudent} />
      </div>
    </div>
  );
}
