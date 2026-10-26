import { getAllTaskReports } from "@/actions/report.actions";
import { ReportsClient } from "./reports-client";
import { ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const reports = await getAllTaskReports();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldAlert className="w-5 h-5 text-rose-500" />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Task & Problem Reports
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Real-time student issues, questions, and blockers submitted through the 60-Day Mission AI Coach.
        </p>
      </div>

      <ReportsClient initialReports={reports} />
    </div>
  );
}
