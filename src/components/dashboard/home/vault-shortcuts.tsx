"use client";

import Link from "next/link";
import { ArrowUpRight, Bot, FileText, Video, Sparkles, FolderDown } from "lucide-react";

export function VaultShortcuts() {
  const shortcuts = [
    {
      title: "WhatsApp Bot Blueprint",
      subtitle: "Make.com JSON Flow",
      tag: "AUTOMATION",
      href: "/dashboard/resources",
      icon: Bot,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "High-Ticket Client Proposal",
      subtitle: "Full Agency Deck & SOPs",
      tag: "CLOSING",
      href: "/dashboard/documentation",
      icon: FileText,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Live Call Schedule & Replays",
      subtitle: "Weekly Office Hours Vault",
      tag: "RECORDINGS",
      href: "/dashboard/live-calls",
      icon: Video,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <FolderDown className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Quick Vault Shortcuts
          </h4>
        </div>
        <span className="text-[11px] font-semibold text-slate-400">Direct Assets</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {shortcuts.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="group p-4 rounded-2xl bg-[#0F1117] border border-white/[0.06] hover:border-white/[0.14] hover:bg-[#141822] transition-all duration-300 shadow-sm flex flex-col justify-between gap-3 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-bold text-slate-400 tracking-wider bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.04]">
                    {item.tag}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                </div>
              </div>

              <div>
                <h5 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                  {item.title}
                </h5>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                  {item.subtitle}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
