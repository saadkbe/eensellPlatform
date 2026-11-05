"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Compass,
  MapPin,
  Users,
  Send,
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
import { useLanguage } from "@/components/landing/LanguageProvider";
import { TranslationKey } from "@/lib/translations";

interface NavEntry {
  titleKey: TranslationKey;
  href: string;
  icon: any;
}

const workspaceNav: NavEntry[] = [
  { titleKey: "ws_nav_overview", href: "/workspace", icon: LayoutDashboard },
  { titleKey: "ws_nav_onboarding", href: "/workspace/onboarding", icon: Compass },
  { titleKey: "ws_nav_scraper", href: "/workspace/scraper", icon: MapPin },
  { titleKey: "ws_nav_crm", href: "/workspace/crm", icon: Users },
  { titleKey: "ws_nav_campaigns", href: "/workspace/campaigns", icon: Send },
  { titleKey: "ws_nav_sheets", href: "/workspace/sheets", icon: Table2 },
];

const outreachNav: NavEntry[] = [
  { titleKey: "ws_nav_drafter", href: "/workspace/drafter", icon: Mail },
  { titleKey: "ws_nav_whatsapp", href: "/workspace/whatsapp", icon: MessageSquare },
  { titleKey: "ws_nav_invoices", href: "/workspace/invoices", icon: Receipt },
  { titleKey: "ws_nav_notes", href: "/workspace/notes", icon: StickyNote },
];

export function WorkspaceSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useUser();
  const { theme, setTheme } = useTheme();
  const { t, dir, isRTL } = useLanguage();

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
    <div
      dir={dir}
      className={cn(
        "flex flex-col h-full bg-[#F7F6F3] dark:bg-[#1E1E1E] text-[#37352F] dark:text-[#E6E6E5] select-none text-[13px]",
        isRTL ? "border-l border-[#E9E9E7] dark:border-[#2E2E2E]" : "border-r border-[#E9E9E7] dark:border-[#2E2E2E]"
      )}
    >
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
                {t("nav_workspace")}
              </span>
              <span className="text-[10px] text-[#787774] dark:text-[#9B9A97] truncate leading-tight">
                {t("ws_sidebar_badge")}
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
          <span>{t("ws_new_scrape")}</span>
        </Link>
      </div>

      {/* ── Navigation Sections with Clean Black Icons ── */}
      <div className="flex-1 px-2.5 py-1 space-y-5 overflow-y-auto no-scrollbar">
        {/* Workspace Ecosystem */}
        <div className="space-y-0.5">
          <div className="px-2 py-1 text-[11px] font-semibold text-[#8C8B88] dark:text-[#787774] uppercase tracking-wider">
            {t("ws_sec_workspace")}
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
                <span className="truncate">{t(item.titleKey)}</span>
              </Link>
            );
          })}
        </div>

        {/* Outreach & Sales */}
        <div className="space-y-0.5">
          <div className="px-2 py-1 text-[11px] font-semibold text-[#8C8B88] dark:text-[#787774] uppercase tracking-wider">
            {t("ws_sec_acquisition")}
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
                <span className="truncate">{t(item.titleKey)}</span>
              </Link>
            );
          })}
        </div>

        {/* Settings & Academy */}
        <div className="space-y-0.5">
          <div className="px-2 py-1 text-[11px] font-semibold text-[#8C8B88] dark:text-[#787774] uppercase tracking-wider">
            {t("ws_sec_system")}
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
            <span>{t("ws_nav_settings")}</span>
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-[#55534E] dark:text-[#C5C5C4] hover:bg-[#EFEFEE] dark:hover:bg-[#262626] hover:text-[#111111] dark:hover:text-white transition-colors text-[13px] group"
          >
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-4 h-4 shrink-0 text-[#66645E] dark:text-[#A3A3A3] group-hover:text-[#111111] dark:group-hover:text-white stroke-[1.8]" />
              <span>{t("ws_back_academy")}</span>
            </div>
            <ChevronRight className={cn("w-3.5 h-3.5 opacity-60", isRTL && "rotate-180")} />
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
          title={t("ws_toggle_theme")}
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
          "lg:hidden fixed inset-y-0 w-64 z-50 transform transition-transform duration-200 ease-in-out",
          isRTL
            ? mobileOpen
              ? "translate-x-0 right-0"
              : "translate-x-full right-0"
            : mobileOpen
            ? "translate-x-0 left-0"
            : "-translate-x-full left-0"
        )}
      >
        {content}
      </div>

      {/* Desktop Fixed Sidebar */}
      <aside
        className={cn(
          "hidden lg:block fixed inset-y-0 w-60 z-30",
          isRTL ? "right-0" : "left-0"
        )}
      >
        {content}
      </aside>
    </>
  );
}
