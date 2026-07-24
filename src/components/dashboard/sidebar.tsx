"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignOutButton, useUser } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  FolderOpen,
  Video,
  Settings,
  Menu,
  X,
  Shield,
  MessageSquare,
  Target,
  Compass,
  Bot,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLanguage } from "@/components/landing/LanguageProvider";
import { TranslationKey } from "@/lib/translations";

/* ── Mobile Bottom Nav Tabs ── */
const bottomNavItems = [
  { labelKey: "nav_dashboard" as TranslationKey, href: "/dashboard", icon: LayoutDashboard },
  { labelKey: "nav_modules" as TranslationKey, href: "/dashboard/modules", icon: BookOpen },
  { labelKey: "nav_community" as TranslationKey, href: "/dashboard/community", icon: MessageSquare },
  { labelKey: "nav_live_calls" as TranslationKey, href: "/dashboard/live-calls", icon: Video },
];

type NavItem = { titleKey: TranslationKey; href: string; icon: any };
type NavSection = { labelKey: TranslationKey; items: NavItem[] };

const navSections: NavSection[] = [
  {
    labelKey: "nav_learn",
    items: [
      { titleKey: "nav_dashboard", href: "/dashboard", icon: LayoutDashboard },
      { titleKey: "nav_modules", href: "/dashboard/modules", icon: BookOpen },
      { titleKey: "nav_resources", href: "/dashboard/resources", icon: FolderOpen },
    ],
  },
  {
    labelKey: "nav_engage",
    items: [
      { titleKey: "nav_community", href: "/dashboard/community", icon: MessageSquare },
      { titleKey: "nav_live_calls", href: "/dashboard/live-calls", icon: Video },
      { titleKey: "nav_goals", href: "/dashboard/goals", icon: Target },
      { titleKey: "nav_chat", href: "/dashboard/chat", icon: Bot },
    ],
  },
  {
    labelKey: "nav_grow",
    items: [
      { titleKey: "nav_career", href: "/dashboard/career", icon: Compass },
      { titleKey: "nav_settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

// Extracted as a top-level component to satisfy React 19's static-components rule
function SidebarContent({
  pathname,
  setMobileOpen,
  isAdmin,
  isActive,
  hasNewLesson,
}: {
  pathname: string;
  setMobileOpen: (open: boolean) => void;
  isAdmin: boolean;
  isActive: (href: string) => boolean;
  hasNewLesson: boolean;
}) {
  const { t, dir } = useLanguage();

  return (
    <div className="flex flex-col h-full" dir={dir}>
      {/* Logo */}
      <div className="flex justify-center items-center px-4 py-6 border-b border-border">
        <img
          src="/logo.png"
          alt="Eensell University"
          className="h-18 sm:h-22 w-auto object-contain origin-center scale-[1.4] sm:scale-[1.7] dark:brightness-0 dark:invert my-1"
        />
      </div>

      {/* Navigation with sections */}
      <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto no-scrollbar">
        {navSections.map((section) => (
          <div key={section.labelKey}>
            <p className="px-4 mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground/60">
              {t(section.labelKey)}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex justify-between items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 group relative",
                      active
                        ? "text-primary-foreground bg-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className={cn(
                          "absolute top-1/2 -translate-y-1/2 w-[4px] h-6 rounded-r-full bg-primary-foreground",
                          dir === "rtl" ? "right-0 rounded-l-full rounded-r-none" : "left-0"
                        )}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <div className="flex items-center gap-4">
                      <Icon
                        className={cn(
                          "w-6 h-6 shrink-0 transition-colors",
                          active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      <span>{t(item.titleKey)}</span>
                    </div>
                    {item.titleKey === "nav_modules" && hasNewLesson && (
                      <span className="bg-foreground text-background text-[11px] font-bold px-2 py-0.5 rounded mx-2">{t("nav_new_lesson")}</span>
                    )}
                    {active && (
                      <div className="absolute inset-0 rounded-lg bg-white/10 pointer-events-none" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {isAdmin && (
          <div>
            <div className="h-px bg-border my-2" />
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-4 px-4 py-3 rounded-lg text-base font-medium text-destructive hover:bg-destructive/10 transition-all duration-200 border border-destructive/20"
            >
              <Shield className="w-6 h-6 shrink-0" />
              <span>{t("nav_admin")}</span>
            </Link>
          </div>
        )}
      </nav>

      {/* User section */}
      <div className="px-5 py-5 border-t border-border mt-auto">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 px-2">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-base text-foreground font-medium truncate">{t("nav_account")}</p>
              <p className="text-sm text-muted-foreground truncate">{t("nav_manage_profile")}</p>
            </div>
            <ThemeToggle />
          </div>
          <SignOutButton>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-secondary text-base py-6">
              <LogOut className={cn("w-5 h-5", dir === "rtl" ? "ml-3" : "mr-3")} />
              {t("nav_logout")}
            </Button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}

export function DashboardSidebar({ hasNewLesson = false }: { hasNewLesson?: boolean }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useUser();
  const { dir, t } = useLanguage();

  const isAdmin = user?.publicMetadata?.role === "ADMIN";

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="flex items-center">
          <img src="/logo.png" alt="Eensell University" className="h-12 w-auto object-contain origin-left scale-[1.3] dark:brightness-0 dark:invert" />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-muted-foreground hover:text-foreground hover:bg-secondary"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className={cn(
        "lg:hidden fixed bottom-4 left-4 right-4 z-50 bg-background/80 backdrop-blur-2xl border border-border shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-3xl safe-area-pb",
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
                  "flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-2xl transition-all duration-300 relative min-w-[64px] z-10",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active && (
                  <>
                    <motion.div
                      layoutId="bottomNavActive"
                      className="absolute inset-0 bg-primary/10 rounded-2xl -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                    <motion.div
                      layoutId="bottomNavDot"
                      className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  </>
                )}
                <Icon className={cn("w-5 h-5 transition-all duration-300", active && "scale-110 mb-0.5")} />
                <span className={cn("text-[10px] font-semibold leading-tight", active ? "text-primary" : "text-muted-foreground")}>
                  {t(item.labelKey)}
                </span>
              </Link>
            );
          })}
          {/* More button — opens sidebar */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-2xl text-muted-foreground hover:text-foreground transition-all duration-300 min-w-[64px] z-10"
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-tight">{t("nav_settings")}</span>
          </button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={cn("lg:hidden fixed top-0 z-50 w-[320px] h-screen bg-card border-border", dir === "rtl" ? "right-0 border-l" : "left-0 border-r")}
            >
              <SidebarContent
                pathname={pathname}
                setMobileOpen={setMobileOpen}
                isAdmin={isAdmin}
                isActive={isActive}
                hasNewLesson={hasNewLesson}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className={cn("hidden lg:flex lg:flex-col fixed top-0 h-screen w-[320px] bg-card border-border z-30", dir === "rtl" ? "right-0 border-l" : "left-0 border-r")}>
        <SidebarContent
          pathname={pathname}
          setMobileOpen={setMobileOpen}
          isAdmin={isAdmin}
          isActive={isActive}
          hasNewLesson={hasNewLesson}
        />
      </aside>
    </>
  );
}
