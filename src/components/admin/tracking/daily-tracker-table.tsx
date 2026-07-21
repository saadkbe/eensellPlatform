"use client";

import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { CheckCircle2, Clock } from "lucide-react";

interface SnapshotData {
  date: string;
  newAccounts: number;
  pendingPayments: number;
  paidStudents: number;
  activatedAccounts: number;
  revenue: number;
  runningTotal: number;
  progress: number;
}

export function DailyTrackerTable({ snapshots, studentGoal }: { snapshots: SnapshotData[], studentGoal: number }) {
  // Sort descending so most recent is at the top
  const sorted = [...snapshots].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden"
    >
      <div className="p-6 md:p-8 border-b border-border/50">
        <h3 className="text-lg font-black text-foreground">Daily Campaign Tracker</h3>
        <p className="text-sm text-muted-foreground font-medium">Historical breakdown of your campaign's performance.</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground font-bold tracking-wider border-b border-border/50">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">New Accounts</th>
              <th className="px-6 py-4">Pending</th>
              <th className="px-6 py-4">Paid Students</th>
              <th className="px-6 py-4">Activated</th>
              <th className="px-6 py-4">Revenue</th>
              <th className="px-6 py-4">Running Total</th>
              <th className="px-6 py-4">Remaining</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {sorted.map((row, index) => {
              const previousRow = sorted[index + 1];
              const dailyPaidStudents = previousRow ? row.paidStudents - previousRow.paidStudents : row.paidStudents;
              const dailyActivated = previousRow ? row.activatedAccounts - previousRow.activatedAccounts : row.activatedAccounts;

              const remaining = Math.max(studentGoal - row.paidStudents, 0);
              const isGoalMet = row.paidStudents >= studentGoal;

              return (
                <tr key={row.date} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 font-bold text-foreground whitespace-nowrap">
                    {format(parseISO(row.date), "dd MMM")}
                  </td>
                  <td className="px-6 py-4 font-medium text-purple-500">{row.newAccounts}</td>
                  <td className="px-6 py-4 font-medium text-amber-500">{row.pendingPayments}</td>
                  <td className="px-6 py-4 font-medium text-brand">{dailyPaidStudents}</td>
                  <td className="px-6 py-4 font-medium text-blue-500">{dailyActivated}</td>
                  <td className="px-6 py-4 font-bold text-emerald-500">{row.revenue.toLocaleString()} MAD</td>
                  <td className="px-6 py-4 font-bold text-foreground">{row.runningTotal.toLocaleString()} MAD</td>
                  <td className="px-6 py-4 font-medium text-muted-foreground">{remaining}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {isGoalMet ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-muted-foreground/50" />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            
            {sorted.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-muted-foreground">
                  No tracking data available yet. Data will appear after the first daily snapshot.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
