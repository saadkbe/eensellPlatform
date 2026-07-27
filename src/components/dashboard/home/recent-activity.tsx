"use client";

import { motion } from "framer-motion";
import { Activity, CheckCircle2 } from "lucide-react";

interface RecentActivityProps {
  activities: any[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="bg-[#0a0b10] border border-white/[0.08] rounded-3xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <Activity className="w-4 h-4 text-emerald-500" />
        </div>
        <h2 className="text-lg font-bold text-white tracking-tight">Recent Activity</h2>
      </div>

      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <motion.div 
              key={activity.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center shrink-0 border border-white/[0.08] text-xs font-bold text-white">
                {(activity.user?.firstName?.[0] || "U").toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">
                  <span className="font-bold">{activity.user?.firstName || "A student"}</span> completed{" "}
                  <span className="text-emerald-400">{activity.lesson?.title || "a lesson"}</span>
                </p>
                <span className="text-xs text-white/40">
                  {new Date(activity.watchedAt).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-sm text-white/40 text-center py-4">No recent activity yet.</p>
        )}
      </div>
    </div>
  );
}
