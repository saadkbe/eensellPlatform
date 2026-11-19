"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignOutButton, useUser } from "@clerk/nextjs";
import {
  LayoutDashboard,
  TrendingUp,
  Target,
  DollarSign,
  Users,
  UserCheck,
  Clock,
  Mail,
  GraduationCap,
  FolderOpen,
  Video,
  FileCheck,
  AlertCircle,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  MoreHorizontal,
  X,
  Layers,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

type NavItem = {
  title: string;
  href: string;
  icon: any;
  badge?: string;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    label: "Overview & Growth",
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { title: "Analytics", href: "/admin/analytics", icon: TrendingUp },
      { title: "Financial Tracking", href: "/admin/tracking", icon: DollarSign },
      { title: "Referrals & Payouts", href: "/admin/referrals", icon: Target },
    ],
  },
  {
    label: "Students & Admissions",
    items: [
      { title: "All Users", href: "/admin/users", icon: Users },
      { title: "Active Paid Users", href: "/admin/active-users", icon: UserCheck },
      { title: "Pending Approvals", href: "/admin/pending", icon: Clock },
      { title: "Student Emails", href: "/admin/emails", icon: Mail },
    ],
  },
  {
    label: "Curriculum & Assets",
    items: [
      { title: "Video Courses", href: "/admin/courses", icon: GraduationCap },
      { title: "Resource Vault", href: "/admin/resources", icon: FolderOpen },
      { title: "Live Office Hours", href: "/admin/live-calls", icon: Video },
      { title: "Homework Reviews", href: "/admin/homeworks", icon: FileCheck },
    ],
  },
  {
    label: "Community & Support",
    items: [
      { title: "Problem Reports", href: "/admin/reports", icon: AlertCircle },
      { title: "Community Forum", href: "/admin/posts", icon: MessageSquare },
    ],
  },
];

const mobileBottomNavItems = [
  { title: "Overview", href: "/admin", icon: LayoutDashboard },
  { title: "Pending", href: "/admin/pending", icon: Clock },
  { title: "Students", href: "/admin/users", icon: Users },
  { title: "Courses", href: "/admin/courses", icon: GraduationCap },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useUser();
  const { theme, setTheme } = useTheme();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  const content = (
    <div className="flex flex-col h-full bg-[#F7F6F3] dark:bg-[#1E1E1E] text-[#37352F] dark:text-[#E6E6E5] select-none text-[13px] border-r border-[#E9E9E7] dark:border-[#2E2E2E]">
      {/* ── Brand Admin Workspace Switcher Header ── */}
      <div className="p-3 border-b border-[#E9E9E7]/80 dark:border-[#2E2E2E]">
        <Link
          href="/admin"
          className="flex items-center justify-between p-1.5 rounded-md hover:bg-[#EFEFEE] dark:hover:bg-[#2A2A2A] transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded bg-[#111111] dark:bg-[#E6E6E5] text-[#FFFFFF] dark:text-[#111111] flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-xs text-[#111111] dark:text-[#E6E6E5] truncate leading-tight">
                Eensell Admin
              </span>
              <span className="text-[10px] text-[#787774] dark:text-[#9B9A97] truncate leading-tight">
                Command OS
              </span>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#787774] dark:text-[#9B9A97] shrink-0" />
        </Link>
      </div>

      {/* ── Quick Action: Pending Approvals Button ── */}
      <div className="p-3 space-y-2">
        <Link
          href="/admin/pending"
          className="flex items-center justify-center gap-2 w-full py-1.5 px-3 rounded-md bg-[#111111] hover:bg-[#242424] dark:bg-[#E6E6E5] dark:hover:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#111111] font-medium text-xs shadow-xs transition-all"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Approvals</span>
        </Link>
      </div>

      {/* ── Navigation Sections (Notion / Workspace Clean Style) ── */}
      <div className="flex-1 px-2.5 py-1 space-y-5 overflow-y-auto no-scrollbar">
        {navSections.map((section) => (
          <div key={section.label} className="space-y-0.5">
            <div className="px-2 py-1 text-[11px] font-semibold text-[#8C8B88] dark:text-[#787774] uppercase tracking-wider">
              {section.label}
            </div>

            {section.items.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors font-medium text-[13px] group",
                    active
                      ? "bg-[#EBEAE7] dark:bg-[#2A2A2A] text-[#111111] dark:text-[#FFFFFF] font-semibold shadow-2xs"
                      : "text-[#55534E] dark:text-[#C5C5C4] hover:bg-[#EFEFEE] dark:hover:bg-[#262626] hover:text-[#111111] dark:hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0 transition-colors stroke-[1.8]",
                        active
                          ? "text-[#111111] dark:text-white"
                          : "text-[#66645E] dark:text-[#A3A3A3] group-hover:text-[#111111] dark:group-hover:text-white"
                      )}
                    />
                    <span className="truncate">{item.title}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#E2E1DE] dark:bg-[#333333] text-[#37352F] dark:text-[#E6E6E5] font-semibold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}

        {/* ── Portals & Shortcuts ── */}
        <div className="space-y-0.5">
          <div className="px-2 py-1 text-[11px] font-semibold text-[#8C8B88] dark:text-[#787774] uppercase tracking-wider">
            Portals & System
          </div>

          <Link
            href="/dashboard"
            className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-[#55534E] dark:text-[#C5C5C4] hover:bg-[#EFEFEE] dark:hover:bg-[#262626] hover:text-[#111111] dark:hover:text-white transition-colors text-[13px] group"
          >
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-4 h-4 shrink-0 text-[#66645E] dark:text-[#A3A3A3] group-hover:text-[#111111] dark:group-hover:text-white stroke-[1.8]" />
              <span>Student Dashboard</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </Link>

          <Link
            href="/workspace"
            className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-[#55534E] dark:text-[#C5C5C4] hover:bg-[#EFEFEE] dark:hover:bg-[#262626] hover:text-[#111111] dark:hover:text-white transition-colors text-[13px] group"
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 shrink-0 text-[#66645E] dark:text-[#A3A3A3] group-hover:text-[#111111] dark:group-hover:text-white stroke-[1.8]" />
              <span>Workspace OS</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </Link>
        </div>
      </div>

      {/* ── Footer: Profile & Theme Toggle ── */}
      <div className="p-2.5 border-t border-[#E9E9E7] dark:border-[#2E2E2E] flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <UserButton appearance={{ elements: { avatarBox: "w-7 h-7 rounded-md" } }} />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-[#111111] dark:text-[#E6E6E5] truncate">
              {user?.fullName || user?.firstName || "Super Admin"}
            </span>
            <span className="text-[10px] text-[#787774] dark:text-[#9B9A97] truncate">
              Admin Access
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            title="Toggle theme"
            className="p-1.5 rounded-md hover:bg-[#EFEFEE] dark:hover:bg-[#2A2A2A] text-[#787774] dark:text-[#9B9A97] hover:text-[#111111] dark:hover:text-[#E6E6E5] transition-colors cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-[#111111]" />
            )}
          </button>

          <SignOutButton>
            <button
              title="Sign out"
              className="p-1.5 rounded-md hover:bg-[#EFEFEE] dark:hover:bg-[#2A2A2A] text-[#787774] dark:text-[#9B9A97] hover:text-rose-500 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile Bottom Navigation Bar (Workspace Style) ── */}
      <nav
        aria-label="Admin Mobile Navigation"
        className="lg:hidden fixed bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-8 max-w-lg mx-auto z-40 bg-white/95 dark:bg-[#1E1E1E]/95 backdrop-blur-2xl border border-[#E9E9E7] dark:border-[#2E2E2E] rounded-2xl sm:rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-1.5 safe-area-pb"
      >
        <div className="flex items-center justify-around">
          {mobileBottomNavItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-1.5 px-2.5 sm:px-3 rounded-xl sm:rounded-2xl transition-all duration-200 relative min-w-[56px] sm:min-w-[64px] z-10",
                  active
                    ? "text-[#111111] dark:text-[#FFFFFF]"
                    : "text-[#787774] dark:text-[#9B9A97] hover:text-[#111111] dark:hover:text-[#FFFFFF]"
                )}
              >
                {active && (
                  <>
                    <motion.div
                      layoutId="adminBottomNavActive"
                      className="absolute inset-0 bg-[#EBEAE7] dark:bg-[#2A2A2A] rounded-xl sm:rounded-2xl -z-10 shadow-2xs"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                    <motion.div
                      layoutId="adminBottomNavDot"
                      className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-[#111111] dark:bg-[#FFFFFF]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  </>
                )}
                <Icon className={cn("w-5 h-5 transition-transform stroke-[1.8]", active && "scale-110 mb-0.5")} />
                <span
                  className={cn(
                    "text-[10px] font-semibold leading-tight truncate max-w-[60px]",
                    active ? "font-bold text-[#111111] dark:text-white" : "text-[#787774] dark:text-[#9B9A97]"
                  )}
                >
                  {item.title}
                </span>
              </Link>
            );
          })}

          {/* More Items Button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col items-center justify-center gap-1 py-1.5 px-2.5 sm:px-3 rounded-xl sm:rounded-2xl text-[#787774] dark:text-[#9B9A97] hover:text-[#111111] dark:hover:text-[#FFFFFF] transition-all min-w-[56px] sm:min-w-[64px] z-10 cursor-pointer"
          >
            <MoreHorizontal className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[10px] font-medium leading-tight truncate max-w-[60px]">
              More
            </span>
          </button>
        </div>
      </nav>

      {/* ── Mobile Slide-Up Bottom Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="lg:hidden fixed bottom-0 inset-x-0 z-50 max-h-[85vh] bg-[#F7F6F3] dark:bg-[#1E1E1E] border-t border-[#E9E9E7] dark:border-[#2E2E2E] rounded-t-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Drawer Handle */}
              <div className="w-10 h-1 rounded-full bg-[#D3D1CB] dark:bg-[#3E3E3E] mx-auto mt-2.5 mb-1 shrink-0" />

              {/* Drawer Header */}
              <div className="px-4 py-2.5 border-b border-[#E9E9E7] dark:border-[#2E2E2E] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-[#111111] dark:bg-[#E6E6E5] text-white dark:text-[#111111] flex items-center justify-center font-bold text-[10px]">
                    <Shield className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-semibold text-[#111111] dark:text-[#E6E6E5]">
                    Admin Navigation
                  </span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 rounded-md hover:bg-[#EFEFEE] dark:hover:bg-[#2A2A2A] text-[#787774] dark:text-[#9B9A97] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                <Link
                  href="/admin/pending"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-md bg-[#111111] hover:bg-[#242424] dark:bg-[#E6E6E5] dark:hover:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#111111] font-semibold text-xs shadow-xs transition-all"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending Approvals</span>
                </Link>

                {navSections.map((section) => (
                  <div key={section.label} className="space-y-1.5">
                    <div className="px-1 text-[11px] font-semibold text-[#8C8B88] dark:text-[#787774] uppercase tracking-wider">
                      {section.label}
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {section.items.map((item) => {
                        const active = isActive(item.href);
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "flex items-center gap-2 p-2 rounded-lg border transition-all text-xs font-medium",
                              active
                                ? "bg-[#EBEAE7] dark:bg-[#2A2A2A] border-[#111111]/20 dark:border-white/20 text-[#111111] dark:text-white font-bold shadow-2xs"
                                : "border-[#EDEDEB] dark:border-[#2A2A2A] hover:bg-[#F7F6F3] dark:hover:bg-[#262626] text-[#55534E] dark:text-[#C5C5C4]"
                            )}
                          >
                            <Icon className="w-3.5 h-3.5 shrink-0 stroke-[1.8]" />
                            <span className="truncate">{item.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Portals */}
                <div className="space-y-1.5 pt-2 border-t border-[#E9E9E7] dark:border-[#2E2E2E]">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg border border-[#EDEDEB] dark:border-[#2A2A2A] text-xs font-medium text-[#55534E] dark:text-[#C5C5C4] hover:bg-[#EFEFEE] dark:hover:bg-[#2A2A2A]"
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 stroke-[1.8]" />
                      <span>Student Dashboard</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </Link>

                  <Link
                    href="/workspace"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg border border-[#EDEDEB] dark:border-[#2A2A2A] text-xs font-medium text-[#55534E] dark:text-[#C5C5C4] hover:bg-[#EFEFEE] dark:hover:bg-[#2A2A2A]"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 stroke-[1.8]" />
                      <span>Workspace OS</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </Link>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-3 border-t border-[#E9E9E7] dark:border-[#2E2E2E] bg-[#F7F6F3] dark:bg-[#1E1E1E] shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <UserButton appearance={{ elements: { avatarBox: "w-7 h-7 rounded-md" } }} />
                  <span className="text-xs font-medium text-[#111111] dark:text-[#E6E6E5] truncate">
                    {user?.fullName || user?.firstName || "Super Admin"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleTheme}
                    title="Toggle theme"
                    className="p-1.5 rounded-md hover:bg-[#EFEFEE] dark:hover:bg-[#2A2A2A] text-[#787774] dark:text-[#9B9A97]"
                  >
                    {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#111111]" />}
                  </button>
                  <SignOutButton>
                    <button
                      title="Sign out"
                      className="p-1.5 rounded-md hover:bg-[#EFEFEE] dark:hover:bg-[#2A2A2A] text-[#787774] dark:text-[#9B9A97] hover:text-rose-500"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </SignOutButton>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Desktop Fixed Sidebar (Matching Workspace Clean Notion aesthetic) ── */}
      <aside className="hidden lg:flex lg:flex-col fixed left-0 top-0 h-screen w-[270px] z-30">
        {content}
      </aside>
    </>
  );
}
