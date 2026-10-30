"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  LayoutDashboard,
  MapPin,
  Users,
  Table2,
  Mail,
  MessageSquare,
  Receipt,
  StickyNote,
  Settings,
  GraduationCap,
  Plus,
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const workspaceNav = [
  { title: "Overview & Revenue", href: "/workspace", icon: LayoutDashboard },
  { title: "Google Maps Scraper", href: "/workspace/scraper", icon: MapPin },
  { title: "Clients & CRM", href: "/workspace/crm", icon: Users },
  { title: "Agency Sheets", href: "/workspace/sheets", icon: Table2 },
];

const outreachNav = [
  { title: "Cold Email Drafter", href: "/workspace/drafter", icon: Mail },
  { title: "WhatsApp Outreach", href: "/workspace/whatsapp", icon: MessageSquare },
  { title: "Invoices & Contracts", href: "/workspace/invoices", icon: Receipt },
  { title: "Notes & Playbooks", href: "/workspace/notes", icon: StickyNote },
];

export function WorkspaceSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useUser();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleToggle = () => setMobileOpen((prev) => !prev);
    const handleClose = () => setMobileOpen(false);
    window.addEventListener("toggle-workspace-sidebar", handleToggle);
    window.addEventListener("close-workspace-sidebar", handleClose);
    return () => {
      window.removeEventListener("toggle-workspace-sidebar", handleToggle);
      window.removeEventListener("close-workspace-sidebar", handleClose);
    };
  }, []);

  const isActive = (href: string) => {
    if (href === "/workspace") return pathname === "/workspace";
    return pathname.startsWith(href);
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("eensell-workspace-theme-preference", nextTheme);
  };

  const content = (
    <div className="flex flex-col h-full bg-[#F7F6F3] dark:bg-[#1E1E1E] border-r border-[#E9E9E7] dark:border-[#2E2E2E] text-[#37352F] dark:text-[#E6E6E5] select-none text-[13px]">
      {/* ── Brand Workspace Header ── */}
      <div className="p-3 border-b border-[#E9E9E7]/80 dark:border-[#2E2E2E]">
        <Link
          href="/workspace"
          className="flex items-center justify-between p-1.5 rounded-md hover:bg-[#EFEFEE] dark:hover:bg-[#2A2A2A] transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded bg-[#111111] dark:bg-[#E6E6E5] text-[#FFFFFF] dark:text-[#111111] flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
              E
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-xs text-[#111111] dark:text-[#E6E6E5] truncate leading-tight">
                Eensell Workspace
              </span>
              <span className="text-[10px] text-[#787774] dark:text-[#9B9A97] truncate leading-tight">
                Agency Operating System
              </span>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#787774] dark:text-[#9B9A97] shrink-0" />
        </Link>
      </div>

      {/* ── Quick Action Button ── */}
      <div className="p-3 space-y-2">
        <Link
          href="/workspace/scraper"
          className="flex items-center justify-center gap-2 w-full py-1.5 px-3 rounded-md bg-[#111111] hover:bg-[#242424] dark:bg-[#E6E6E5] dark:hover:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#111111] font-medium text-xs shadow-xs transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Lead Scrape</span>
        </Link>
      </div>

      {/* ── Navigation Sections with Clean Black Icons ── */}
      <div className="flex-1 px-2.5 py-1 space-y-5 overflow-y-auto no-scrollbar">
        {/* Workspace Ecosystem */}
        <div className="space-y-0.5">
          <div className="px-2 py-1 text-[11px] font-semibold text-[#8C8B88] dark:text-[#787774] uppercase tracking-wider">
            Workspace
          </div>
          {workspaceNav.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors font-medium text-[13px] group",
                  active
                    ? "bg-[#EBEAE7] dark:bg-[#2A2A2A] text-[#111111] dark:text-[#FFFFFF] font-semibold shadow-2xs"
                    : "text-[#55534E] dark:text-[#C5C5C4] hover:bg-[#EFEFEE] dark:hover:bg-[#262626] hover:text-[#111111] dark:hover:text-white"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-colors stroke-[1.8]",
                    active
                      ? "text-[#111111] dark:text-white"
                      : "text-[#66645E] dark:text-[#A3A3A3] group-hover:text-[#111111] dark:group-hover:text-white"
                  )}
                />
                <span className="truncate">{item.title}</span>
              </Link>
            );
          })}
        </div>

        {/* Outreach & Sales */}
        <div className="space-y-0.5">
          <div className="px-2 py-1 text-[11px] font-semibold text-[#8C8B88] dark:text-[#787774] uppercase tracking-wider">
            Client Acquisition
          </div>
          {outreachNav.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors font-medium text-[13px] group",
                  active
                    ? "bg-[#EBEAE7] dark:bg-[#2A2A2A] text-[#111111] dark:text-[#FFFFFF] font-semibold shadow-2xs"
                    : "text-[#55534E] dark:text-[#C5C5C4] hover:bg-[#EFEFEE] dark:hover:bg-[#262626] hover:text-[#111111] dark:hover:text-white"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-colors stroke-[1.8]",
                    active
                      ? "text-[#111111] dark:text-white"
                      : "text-[#66645E] dark:text-[#A3A3A3] group-hover:text-[#111111] dark:group-hover:text-white"
                  )}
                />
                <span className="truncate">{item.title}</span>
              </Link>
            );
          })}
        </div>

        {/* Settings & Academy */}
        <div className="space-y-0.5">
          <div className="px-2 py-1 text-[11px] font-semibold text-[#8C8B88] dark:text-[#787774] uppercase tracking-wider">
            System
          </div>
          <Link
            href="/workspace/settings"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors font-medium text-[13px] group",
              isActive("/workspace/settings")
                ? "bg-[#EBEAE7] dark:bg-[#2A2A2A] text-[#111111] dark:text-[#FFFFFF] font-semibold shadow-2xs"
                : "text-[#55534E] dark:text-[#C5C5C4] hover:bg-[#EFEFEE] dark:hover:bg-[#262626] hover:text-[#111111] dark:hover:text-white"
            )}
          >
            <Settings
              className={cn(
                "w-4 h-4 shrink-0 transition-colors stroke-[1.8]",
                isActive("/workspace/settings")
                  ? "text-[#111111] dark:text-white"
                  : "text-[#66645E] dark:text-[#A3A3A3] group-hover:text-[#111111] dark:group-hover:text-white"
              )}
            />
            <span>Settings & API Keys</span>
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-[#55534E] dark:text-[#C5C5C4] hover:bg-[#EFEFEE] dark:hover:bg-[#262626] hover:text-[#111111] dark:hover:text-white transition-colors text-[13px] group"
          >
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-4 h-4 shrink-0 text-[#66645E] dark:text-[#A3A3A3] group-hover:text-[#111111] dark:group-hover:text-white stroke-[1.8]" />
              <span>Back to Academy</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </Link>
        </div>
      </div>

      {/* ── User & Theme Footer ── */}
      <div className="p-2.5 border-t border-[#E9E9E7] dark:border-[#2E2E2E] flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <UserButton />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-[#111111] dark:text-[#E6E6E5] truncate">
              {user?.fullName || user?.firstName || "Agency Founder"}
            </span>
            <span className="text-[10px] text-[#787774] dark:text-[#9B9A97] truncate">
              Eensell OS V2
            </span>
          </div>
        </div>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          title="Toggle Light / Dark mode"
          className="p-1.5 rounded-md hover:bg-[#EFEFEE] dark:hover:bg-[#2A2A2A] text-[#787774] dark:text-[#9B9A97] hover:text-[#111111] dark:hover:text-[#E6E6E5] transition-colors cursor-pointer"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-[#111111]" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer Panel */}
      <div
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 w-64 z-50 transform transition-transform duration-200 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {content}
      </div>

      {/* Desktop Fixed Left Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-60 z-30">
        {content}
      </aside>
    </>
  );
}
