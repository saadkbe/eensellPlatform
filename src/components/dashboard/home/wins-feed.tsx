"use client";

import Link from "next/link";
import { Trophy, TrendingUp, Sparkles, MessageSquare, ArrowRight } from "lucide-react";

export function WinsFeed() {
  const memberWins = [
    {
      id: "w1",
      name: "Mehdi T.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
      initials: "MT",
      actionBadge: "Closed 15,000 MAD Client",
      actionType: "DEAL CLOSED",
      time: "2h ago",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    {
      id: "w2",
      name: "Yassine B.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
      initials: "YB",
      actionBadge: "Deployed 1st WhatsApp Bot",
      actionType: "BLUEPRINT LIVE",
      time: "4h ago",
      badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    },
    {
      id: "w3",
      name: "Sara K.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
      initials: "SK",
      actionBadge: "Signed 8,000 MAD/mo Retainer",
      actionType: "RETAINER WIN",
      time: "7h ago",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    {
      id: "w4",
      name: "Othmane M.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
      initials: "OM",
      actionBadge: "Generated 47 Leads for E-com Client",
      actionType: "LEAD MACHINE",
      time: "12h ago",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
  ];

  return (
    <div className="rounded-2xl bg-[#0F1117] border border-white/[0.06] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.3)] backdrop-blur-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Cohort Momentum & Wins
            </h4>
          </div>
        </div>
        <Link
          href="/dashboard/community"
          className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
        >
          <span>Feed</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Wins List */}
      <div className="space-y-2.5">
        {memberWins.map((win) => (
          <div
            key={win.id}
            className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.03] transition-all flex items-center justify-between gap-3 group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0 overflow-hidden">
                {win.avatar ? (
                  <img
                    src={win.avatar}
                    alt={win.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  win.initials
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white truncate">
                    {win.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {win.time}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-300 truncate mt-0.5">
                  {win.actionBadge}
                </p>
              </div>
            </div>

            <span
              className={`shrink-0 text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${win.badgeColor}`}
            >
              {win.actionType}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
