"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  Mic,
  Users,
  Send,
  Settings,
  GraduationCap,
  Sparkles,
  Layers,
  ChevronRight,
  Menu,
  X,
  Radio,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const workspaceNavItems = [
  {
    title: "AI Voice Agent",
    subtitle: "Live Call & Dispatcher",
    href: "/workspace",
    icon: Mic,
    badge: "LIVE",
  },
  {
    title: "Leads CRM",
    subtitle: "Client Pipeline & Replies",
    href: "/workspace/crm",
    icon: Users,
  },
  {
    title: "Campaigns",
    subtitle: "Autonomous Outreach",
    href: "/workspace/campaigns",
    icon: Send,
  },
  {
    title: "Integrations & Gmail",
    subtitle: "SMTP & ElevenLabs API",
    href: "/workspace/settings",
    icon: Settings,
  },
];

export function WorkspaceSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useUser();

  const isActive = (href: string) => {
    if (href === "/workspace") return pathname === "/workspace";
    return pathname.startsWith(href);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-slate-950/95 text-slate-100 border-r border-amber-500/20 backdrop-blur-2xl">
      {/* Workspace Brand Header */}
      <div className="flex flex-col items-center justify-center px-4 py-5 border-b border-slate-800/80 bg-gradient-to-b from-amber-500/10 to-transparent">
        <Link href="/workspace" className="flex flex-col items-center group">
          <div className="relative flex items-center justify-center h-14 w-full overflow-hidden">
            <img
              src="/logo2.png"
              alt="Eensell Workspace"
              className="h-12 w-auto object-contain origin-center scale-[2.1] brightness-0 invert transition-transform group-hover:scale-[2.2]"
            />
          </div>
          <div className="mt-1 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-amber-300">
              WORKSPACE AI
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto no-scrollbar">
        <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <span>Client Acquisition</span>
          <span className="text-[10px] text-amber-400 font-mono">v1.0</span>
        </div>

        {workspaceNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "group relative flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl transition-all duration-200",
                active
                  ? "bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)] font-semibold"
                  : "text-slate-300 hover:text-white hover:bg-slate-900/80 border border-transparent"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    active
                      ? "bg-amber-500/30 text-amber-300"
                      : "bg-slate-900 text-slate-400 group-hover:text-amber-400 group-hover:bg-slate-800"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-sm font-medium leading-tight truncate">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-slate-400 truncate">
                    {item.subtitle}
                  </span>
                </div>
              </div>

              {item.badge && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500 text-slate-950 animate-pulse">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Separator */}
        <div className="pt-4 pb-2">
          <div className="h-px bg-slate-800/80 mx-2" />
        </div>

        {/* Quick Link to Academy */}
        <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Education Hub
        </div>

        <Link
          href="/dashboard"
          className="group flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900/80 border border-slate-800/60 transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-900 text-slate-400 group-hover:text-amber-400 group-hover:bg-slate-800">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Exit to Academy</span>
              <span className="text-[11px] text-slate-400">Roadmap & Courses</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </nav>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <UserButton />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-200 truncate">
                {user?.fullName || user?.firstName || "Founder"}
              </span>
              <span className="text-[10px] text-amber-400 font-mono truncate">
                Agency Pro OS
              </span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-4 bg-slate-950/95 border-b border-amber-500/20 backdrop-blur-xl">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-bold text-sm tracking-wide text-white">
            Eensell Workspace
          </span>
        </div>

        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-amber-300 font-medium"
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Academy</span>
        </Link>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 top-16 bg-black/70 backdrop-blur-sm">
          <div className="w-72 h-[calc(100vh-4rem)]">
            {navContent}
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 fixed inset-y-0 left-0 z-30">
        {navContent}
      </aside>
    </>
  );
}
