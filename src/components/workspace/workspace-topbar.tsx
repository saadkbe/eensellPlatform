"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Settings,
  Sun,
  Moon,
  Menu,
  Check,
  CheckCheck,
  ExternalLink,
  Sparkles,
  Command,
  Search,
  X,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useTheme } from "next-themes";
import { UserButton, useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/actions/notification.actions";
import { toast } from "sonner";

const ROUTE_LABELS: Record<string, { title: string; emoji: string }> = {
  "/workspace": { title: "Overview & Revenue", emoji: "🏢" },
  "/workspace/scraper": { title: "Google Maps Scraper", emoji: "📍" },
  "/workspace/crm": { title: "Clients & CRM", emoji: "💼" },
  "/workspace/sheets": { title: "Agency Master Sheets", emoji: "📊" },
  "/workspace/drafter": { title: "Cold Email Drafter", emoji: "✉️" },
  "/workspace/whatsapp": { title: "WhatsApp Outreach", emoji: "💬" },
  "/workspace/invoices": { title: "Invoices & Billing", emoji: "🧾" },
  "/workspace/notes": { title: "Notes & Playbooks", emoji: "📝" },
  "/workspace/settings": { title: "Settings & API Keys", emoji: "⚙️" },
  "/workspace/campaigns": { title: "Campaigns", emoji: "🚀" },
};

export function WorkspaceTopBar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user } = useUser();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isOpenNotifications, setIsOpenNotifications] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  const notificationsRef = useRef<HTMLDivElement | null>(null);

  // Close notifications on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsOpenNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notifications
  const loadNotifications = async () => {
    setIsLoadingNotifications(true);
    try {
      const [list, count] = await Promise.all([
        getUserNotifications(),
        getUnreadNotificationCount(),
      ]);
      setNotifications(list || []);
      setUnreadCount(count || 0);
    } catch {
      // fallback
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [pathname]);

  const handleMarkAsRead = async (id: string, linkUrl?: string | null) => {
    // Optimistic
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await markNotificationAsRead(id);
    } catch {
      // silent
    }

    if (linkUrl) {
      setIsOpenNotifications(false);
      window.location.href = linkUrl;
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      await markAllNotificationsAsRead();
      toast.success("Toutes les notifications sont marquées comme lues !");
    } catch {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("eensell-workspace-theme-preference", nextTheme);
  };

  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent("toggle-workspace-sidebar"));
  };

  const currentRouteInfo = ROUTE_LABELS[pathname] || {
    title: "Eensell Workspace",
    emoji: "⚡",
  };

  return (
    <header className="sticky top-0 z-30 h-14 w-full bg-[#FFFFFF]/90 dark:bg-[#191919]/90 backdrop-blur-md border-b border-[#EDEDEB] dark:border-[#2E2E2E] flex items-center justify-between px-4 sm:px-6 transition-colors">
      {/* ── Left Side: Hamburger (Mobile) + Breadcrumb ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-1.5 -ml-1 rounded-md text-[#787774] hover:text-[#37352F] dark:hover:text-[#E6E6E5] hover:bg-[#F7F6F3] dark:hover:bg-[#2A2A2A] transition-colors"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-base select-none">{currentRouteInfo.emoji}</span>
          <span className="font-semibold text-[#37352F] dark:text-[#E6E6E5]">
            {currentRouteInfo.title}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Operational
          </span>
        </div>
      </div>

      {/* ── Right Side: Functional Actions ── */}
      <div className="flex items-center gap-2">
        {/* Functional Notifications Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => {
              setIsOpenNotifications((prev) => !prev);
              if (!isOpenNotifications) loadNotifications();
            }}
            className="relative p-2 rounded-lg text-[#787774] hover:text-[#37352F] dark:hover:text-[#E6E6E5] hover:bg-[#F7F6F3] dark:hover:bg-[#2A2A2A] transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Popover Panel */}
          <AnimatePresence>
            {isOpenNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] shadow-2xl overflow-hidden z-50 text-xs"
              >
                {/* Panel Header */}
                <div className="p-3.5 bg-[#FAF9F7] dark:bg-[#1A1A1A] border-b border-[#EDEDEB] dark:border-[#2E2E2E] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#37352F] dark:text-[#E6E6E5]">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark all as read</span>
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-[#EDEDEB] dark:divide-[#2E2E2E]">
                  {isLoadingNotifications ? (
                    <div className="p-6 text-center text-[#787774] dark:text-[#9B9A97]">
                      Loading notifications...
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-6 text-center text-[#787774] dark:text-[#9B9A97] space-y-1">
                      <p className="font-semibold text-[#37352F] dark:text-[#E6E6E5]">
                        No notifications yet
                      </p>
                      <p className="text-[11px]">
                        Updates about leads, retainers, and campaigns will appear here.
                      </p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleMarkAsRead(n.id, n.linkUrl)}
                        className={`p-3.5 transition-colors cursor-pointer flex items-start gap-2.5 ${
                          !n.isRead
                            ? "bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/70 dark:hover:bg-blue-950/30"
                            : "hover:bg-[#FAF9F7] dark:hover:bg-[#252525]"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            !n.isRead ? "bg-blue-500" : "bg-transparent"
                          }`}
                        />
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex items-center justify-between gap-2">
                            <h4
                              className={`text-xs truncate ${
                                !n.isRead
                                  ? "font-bold text-[#37352F] dark:text-[#E6E6E5]"
                                  : "font-medium text-[#787774] dark:text-[#9B9A97]"
                              }`}
                            >
                              {n.title}
                            </h4>
                            <span className="text-[10px] text-[#9B9A97] shrink-0">
                              {new Date(n.createdAt).toLocaleDateString([], {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#787774] dark:text-[#9B9A97] line-clamp-2 leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="p-2.5 bg-[#FAF9F7] dark:bg-[#1A1A1A] border-t border-[#EDEDEB] dark:border-[#2E2E2E] text-center">
                  <Link
                    href="/workspace/settings"
                    onClick={() => setIsOpenNotifications(false)}
                    className="text-[11px] text-[#787774] hover:text-[#37352F] dark:hover:text-[#E6E6E5] font-medium"
                  >
                    Notification preferences in Settings &rarr;
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Settings Button */}
        <Link
          href="/workspace/settings"
          className={`p-2 rounded-lg transition-colors ${
            pathname === "/workspace/settings"
              ? "bg-[#EFEFEE] dark:bg-[#2A2A2A] text-[#111111] dark:text-[#FFFFFF]"
              : "text-[#787774] hover:text-[#37352F] dark:hover:text-[#E6E6E5] hover:bg-[#F7F6F3] dark:hover:bg-[#2A2A2A]"
          }`}
          title="Workspace Settings & API Keys"
        >
          <Settings className="w-4 h-4" />
        </Link>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-[#787774] hover:text-[#37352F] dark:hover:text-[#E6E6E5] hover:bg-[#F7F6F3] dark:hover:bg-[#2A2A2A] transition-colors cursor-pointer"
          title="Toggle Light/Dark Theme"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-[#37352F]" />
          )}
        </button>

        {/* User Profile Avatar */}
        <div className="ml-1 pl-2 border-l border-[#EDEDEB] dark:border-[#2E2E2E] flex items-center">
          <UserButton />
        </div>
      </div>
    </header>
  );
}
