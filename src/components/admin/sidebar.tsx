"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignOutButton } from "@clerk/nextjs";
import {
  BarChart3, Users, Clock, GraduationCap,
  TrendingUp, Mail, Menu, X, LogOut,
  FolderOpen, PenLine, Video, FileCheck, Target, MoreHorizontal,
  Sparkles, ChevronRight
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

type NavItem = { title: string; href: string; icon: any; badge?: string };
type NavSection = { label: string; items: NavItem[] };

const navSections: NavSection[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/admin", icon: BarChart3 },
      { title: "Analytics", href: "/admin/analytics", icon: TrendingUp },
      { title: "Admin Tracking", href: "/admin/tracking", icon: Target },
    ],
  },
  {
    label: "Users",
    items: [
      { title: "All Users", href: "/admin/users", icon: Users },
      { title: "Pending", href: "/admin/pending", icon: Clock },
      { title: "Emails", href: "/admin/emails", icon: Mail },
    ],
  },
  {
    label: "Content",
    items: [
      { title: "Courses", href: "/admin/courses", icon: GraduationCap },
      { title: "Resources", href: "/admin/resources", icon: FolderOpen },
      { title: "Posts", href: "/admin/posts", icon: PenLine },
      { title: "Live Calls", href: "/admin/live-calls", icon: Video },
      { title: "Homeworks", href: "/admin/homeworks", icon: FileCheck },
    ],
  },
];

const bottomNavItems = [
  { title: "Overview", href: "/admin", icon: BarChart3 },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Courses", href: "/admin/courses", icon: GraduationCap },
  { title: "Posts", href: "/admin/posts", icon: PenLine },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const Content = () => (
    <div className="flex flex-col h-full admin-sidebar-v2">
      {/* Logo area */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-4.5 h-4.5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-[13px] font-bold text-white tracking-tight">Eensell University</span>
          <span className="text-[10px] text-white/40 font-medium">Admin Console</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto no-scrollbar">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group relative",
                      active
                        ? "text-white bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                        : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                    )}>
                    {active && (
                      <motion.div layoutId="adminTab"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                    )}
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0",
                      active
                        ? "bg-indigo-500/20 text-indigo-300"
                        : "bg-white/[0.04] text-white/40 group-hover:text-white/60 group-hover:bg-white/[0.06]"
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="flex-1">{item.title}</span>
                    {active && (
                      <ChevronRight className="w-3.5 h-3.5 text-white/30" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Back to Dashboard */}
      <div className="px-3 py-2 border-t border-white/[0.06]">
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-all font-medium">
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
            <ChevronRight className="w-4 h-4 rotate-180" />
          </div>
          Back to Dashboard
        </Link>
      </div>

      {/* User section */}
      <div className="px-4 py-4 border-t border-white/[0.06]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 px-1">
            <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 ring-2 ring-white/10" } }} />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-white font-semibold truncate">Admin</p>
              <p className="text-[10px] text-white/30 truncate">Manage platform</p>
            </div>
            <ThemeToggle />
          </div>
          <SignOutButton>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all font-medium">
              <LogOut className="w-3.5 h-3.5" />
              Log out
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-[#0c0e14]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-[13px] font-bold text-white">Eensell Admin</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white/60 hover:text-white hover:bg-white/[0.06]">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className={cn(
        "lg:hidden fixed bottom-4 left-4 right-4 z-50 bg-[#0c0e14]/90 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl",
      )}>
        <div className="flex items-center justify-around px-2 py-2">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-all duration-300 relative min-w-[64px] z-10",
                  active
                    ? "text-indigo-400"
                    : "text-white/30 hover:text-white/60"
                )}
              >
                {active && (
                  <>
                    <motion.div
                      layoutId="adminBottomNavActive"
                      className="absolute inset-0 bg-indigo-500/10 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                    <motion.div
                      layoutId="adminBottomNavDot"
                      className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(129,140,248,0.6)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  </>
                )}
                <Icon className={cn("w-5 h-5 transition-all duration-300", active && "scale-110")} />
                <span className={cn("text-[10px] font-medium leading-tight", active ? "text-indigo-400" : "text-white/30")}>
                  {item.title}
                </span>
              </Link>
            );
          })}
          {/* More button — opens sidebar */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl text-white/30 hover:text-white/60 transition-all duration-300 min-w-[64px] z-10"
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-tight">More</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)} className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed top-0 left-0 z-50 w-[280px] h-screen bg-[#0c0e14] border-r border-white/[0.06]">
              <Content />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <aside className="hidden lg:flex lg:flex-col fixed left-0 top-0 h-screen w-[280px] bg-[#0c0e14] border-r border-white/[0.06] z-30">
        <Content />
      </aside>
    </>
  );
}
