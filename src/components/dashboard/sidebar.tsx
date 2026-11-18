"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { UserButton, SignOutButton, useUser } from "@clerk/nextjs";
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
  FileText,
  Wrench,
  Share2,
  Sparkles,
  LogOut,
  MoreHorizontal,
  Zap,
  ArrowUpRight,
  Crown,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLanguage } from "@/components/landing/LanguageProvider";
import { TranslationKey } from "@/lib/translations";
import { WorkspaceProModal } from "@/components/workspace/workspace-pro-modal";

export interface DashboardSidebarProps {
  hasNewLesson?: boolean;
  userTier?: "FREE_LIBRARY" | "UNIVERSITY_V2" | "PRO" | string;
  userRole?: "ADMIN" | "ACTIVE_USER" | "PENDING_USER" | string;
  isPro?: boolean;
}

type NavItem = {
  title: string;
  titleKey?: TranslationKey;
  href: string;
  icon: any;
};

type NavSection = {
  label: string;
  labelKey?: TranslationKey;
  items: NavItem[];
};

/* ── Navigation definitions for UNIVERSITY_V2 and ADMIN ── */
const v2NavSections: NavSection[] = [
  {
    label: "LEARN",
    labelKey: "nav_learn",
    items: [
      { title: "Dashboard", titleKey: "nav_dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "AI Library", titleKey: "nav_modules", href: "/dashboard/modules", icon: BookOpen },
      { title: "60-Day Roadmap", titleKey: "nav_challenge", href: "/dashboard/challenge", icon: Target },
    ],
  },
  {
    label: "BUILD & EARN",
    labelKey: "nav_build_earn",
    items: [
      { title: "Eensell Workspace", titleKey: "nav_workspace" as TranslationKey, href: "/workspace", icon: Zap },
      { title: "Resources & Blueprints", titleKey: "nav_resources", href: "/dashboard/resources", icon: FolderOpen },
      { title: "Documentation", titleKey: "nav_documentation", href: "/dashboard/documentation", icon: FileText },
      { title: "Deals & Tools", titleKey: "nav_tools", href: "/dashboard/tools", icon: Wrench },
    ],
  },
  {
    label: "COMMUNITY & ACCOUNT",
    labelKey: "nav_community_account",
    items: [
      { title: "Community & Wins", titleKey: "nav_community", href: "/dashboard/community", icon: MessageSquare },
      { title: "Live Coaching Calls", titleKey: "nav_live_calls", href: "/dashboard/live-calls", icon: Video },
      { title: "Refer & Earn", titleKey: "nav_referrals", href: "/dashboard/referrals", icon: Share2 },
      { title: "Settings", titleKey: "nav_settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

/* ── Navigation definitions for FREE_LIBRARY members ── */
const freeLibraryNavSections: NavSection[] = [
  {
    label: "AI LIBRARY",
    items: [
      { title: "AI Library", titleKey: "nav_modules", href: "/dashboard/modules", icon: BookOpen },
      { title: "Refer & Earn", titleKey: "nav_referrals", href: "/dashboard/referrals", icon: Share2 },
      { title: "Settings", titleKey: "nav_settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

/* ── Mobile Bottom Navigation items ── */
const v2BottomNavItems = [
  { label: "Dashboard", labelKey: "nav_dashboard" as TranslationKey, href: "/dashboard", icon: LayoutDashboard },
  { label: "AI Library", labelKey: "nav_modules" as TranslationKey, href: "/dashboard/modules", icon: BookOpen },
  { label: "Roadmap", labelKey: "nav_challenge" as TranslationKey, href: "/dashboard/challenge", icon: Target },
  { label: "Community", labelKey: "nav_community" as TranslationKey, href: "/dashboard/community", icon: MessageSquare },
];

const freeBottomNavItems = [
  { label: "AI Library", labelKey: "nav_modules" as TranslationKey, href: "/dashboard/modules", icon: BookOpen },
  { label: "Refer & Earn", labelKey: "nav_referrals" as TranslationKey, href: "/dashboard/referrals", icon: Share2 },
  { label: "Settings", labelKey: "nav_settings" as TranslationKey, href: "/dashboard/settings", icon: Settings },
];

function SidebarContent({
  pathname,
  setMobileOpen,
  isAdmin,
  isPro,
  onOpenProModal,
  isActive,
  hasNewLesson,
}: {
  pathname: string;
  setMobileOpen: (open: boolean) => void;
  isAdmin: boolean;
  isPro: boolean;
  onOpenProModal: () => void;
  isActive: (href: string) => boolean;
  hasNewLesson: boolean;
}) {
  const { t, dir } = useLanguage();
  // All active students have full access to all V2 dashboard sections
  const sections = v2NavSections;

  return (
    <div className="flex flex-col h-full" dir={dir}>
      {/* Logo */}
      <div className="flex justify-center items-center px-4 py-4 sm:py-5 border-b border-border shrink-0">
        <img
          src="/logo2.png"
          alt="Eensell University"
          className="h-12 sm:h-14 w-auto object-contain origin-center scale-[2.2] brightness-0 dark:invert my-1"
        />
      </div>

      {/* ── Eensell Workspace OS Quick Launch / PRO Upgrade Button ── */}
      <div className="px-3.5 pt-3 pb-1 shrink-0">
        {isPro ? (
          <Link
            href="/workspace"
            onClick={() => setMobileOpen(false)}
            className="group flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-violet-500/10 via-primary/5 to-purple-500/10 hover:from-violet-500/15 hover:to-primary/15 dark:from-violet-950/40 dark:to-slate-900/40 border border-violet-500/25 dark:border-violet-500/30 hover:border-violet-500/50 transition-all duration-200 shadow-sm hover:shadow"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {t("nav_workspace")}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                </div>
                <p className="text-[10px] text-muted-foreground truncate font-medium">
                  {t("nav_workspace_sub")}
                </p>
              </div>
            </div>
            <div className="w-6 h-6 rounded-md bg-white/80 dark:bg-white/5 border border-border/80 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/40 shrink-0 transition-all">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onOpenProModal();
            }}
            className="w-full text-left group flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 hover:from-amber-500/20 hover:to-orange-500/20 dark:from-amber-950/40 dark:to-slate-900/40 border border-amber-500/35 hover:border-amber-500/60 transition-all duration-200 shadow-sm hover:shadow cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                <Crown className="w-4 h-4 fill-slate-950 text-slate-950" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-foreground group-hover:text-amber-500 transition-colors truncate">
                    {t("nav_workspace")}
                  </span>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-500 text-slate-950">
                    PRO 499 MAD
                  </span>
                </div>
                <p className="text-[10px] text-amber-500/90 truncate font-semibold">
                  Upgrade to unlock OS
                </p>
              </div>
            </div>
            <div className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-slate-950 shrink-0 transition-all">
              <Crown className="w-3.5 h-3.5" />
            </div>
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 min-h-0 px-4 py-4 space-y-6 overflow-y-auto no-scrollbar">
        {sections.map((section, sIndex) => (
          <div key={section.label || sIndex}>
            <p className="px-4 mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground/60">
              {section.labelKey ? t(section.labelKey) : section.label}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    id={
                      item.href === "/dashboard"
                        ? "tour-sidebar-dashboard"
                        : item.href === "/dashboard/modules"
                        ? "tour-sidebar-modules"
                        : item.href === "/dashboard/community"
                        ? "tour-sidebar-community"
                        : undefined
                    }
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex justify-between items-center px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
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
                      <span>{item.titleKey ? t(item.titleKey) : item.title}</span>
                    </div>
                    {item.href === "/dashboard/modules" && hasNewLesson && (
                      <span className="bg-foreground text-background text-[11px] font-bold px-2 py-0.5 rounded mx-2">
                        {t("nav_new_lesson")}
                      </span>
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

      {/* User section with PRO badge */}
      <div className="px-5 py-5 border-t border-border mt-auto">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 px-2">
            <div className="relative shrink-0">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
              {isPro && (
                <span className="absolute -top-1.5 -right-1.5 z-10 flex items-center justify-center px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.6)] border border-amber-300/50 pointer-events-none">
                  PRO
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-base text-foreground font-medium truncate">{t("nav_account")}</p>
                {isPro && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-amber-500/15 text-amber-500 border border-amber-500/30">
                    <Crown className="w-2.5 h-2.5 fill-amber-500" /> PRO
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">{t("nav_manage_profile")}</p>
            </div>
            <ThemeToggle />
          </div>
          <SignOutButton>
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-secondary text-base py-6"
            >
              <LogOut className={cn("w-5 h-5", dir === "rtl" ? "ml-3" : "mr-3")} />
              {t("nav_logout")}
            </Button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}

export function DashboardSidebar({
  hasNewLesson = false,
  userTier,
  userRole,
  isPro = false,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [proModalOpen, setProModalOpen] = useState(false);
  const { user } = useUser();
  const { dir, t, isRTL, language } = useLanguage();

  const effectiveRole = userRole || (user?.publicMetadata?.role as string) || "PENDING_USER";
  const isAdmin = effectiveRole === "ADMIN";
  const effectiveTier = userTier || (user?.publicMetadata?.tier as string) || "FREE_LIBRARY";
  const isProUser = Boolean(
    isPro ||
    isAdmin ||
    effectiveTier === "PRO" ||
    (user?.publicMetadata?.isPro as boolean) ||
    (user?.publicMetadata?.tier === "PRO")
  );

  // Automatically trigger PRO modal if redirected with ?upgrade_pro=true
  useEffect(() => {
    if (searchParams?.get("upgrade_pro") === "true") {
      setProModalOpen(true);
    }
  }, [searchParams]);

  // All active students get the full V2 bottom navigation items
  const bottomNavItems = v2BottomNavItems;

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Workspace PRO Upgrade Modal */}
      <WorkspaceProModal
        isOpen={proModalOpen}
        onClose={() => setProModalOpen(false)}
      />

      {/* ── Native Mobile Bottom Navigation Bar ── */}
      <nav
        dir={dir}
        aria-label="Mobile Navigation"
        className={cn(
          "lg:hidden fixed bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-8 max-w-lg mx-auto z-40 bg-card/95 backdrop-blur-2xl border border-border shadow-[0_8px_32px_rgba(0,0,0,0.16)] rounded-2xl sm:rounded-3xl p-1.5 safe-area-pb"
        )}
      >
        <div className="flex items-center justify-around">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-1.5 px-2.5 sm:px-3 rounded-xl sm:rounded-2xl transition-all duration-300 relative min-w-[56px] sm:min-w-[64px] z-10",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active && (
                  <>
                    <motion.div
                      layoutId="bottomNavActive"
                      className="absolute inset-0 bg-primary/10 rounded-xl sm:rounded-2xl -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                    <motion.div
                      layoutId="bottomNavDot"
                      className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  </>
                )}
                <Icon className={cn("w-5 h-5 transition-all duration-300", active && "scale-110 mb-0.5")} />
                <span
                  className={cn(
                    "text-[10px] font-semibold leading-tight",
                    active ? "text-primary font-bold" : "text-muted-foreground"
                  )}
                >
                  {item.labelKey ? t(item.labelKey) : item.label}
                </span>
              </Link>
            );
          })}

          {/* More button — opens mobile-native bottom sheet (NOT a desktop sidebar) */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col items-center justify-center gap-1 py-1.5 px-2.5 sm:px-3 rounded-xl sm:rounded-2xl text-muted-foreground hover:text-foreground transition-all duration-300 min-w-[56px] sm:min-w-[64px] z-10 cursor-pointer"
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-tight">{t("nav_settings")}</span>
          </button>
        </div>
      </nav>

      {/* ── Native Mobile Bottom Sheet (Slides up, not a side drawer) ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
            />

            {/* Bottom Sheet Modal */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              dir={dir}
              className="lg:hidden fixed bottom-0 inset-x-0 z-50 max-h-[85vh] bg-card border-t border-border rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Grab Handle */}
              <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30 mx-auto mt-3 mb-1 shrink-0" />

              {/* Sheet Header */}
              <div className="px-5 py-3 border-b border-border flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/logo2.png"
                    alt="Eensell University"
                    className="h-8 w-auto object-contain brightness-0 dark:invert"
                  />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {isRTL
                      ? "كافة الوحدات والأدوات"
                      : language === "fr"
                      ? "Tous les Modules & Outils"
                      : "All Modules & Navigation"}
                  </span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sheet Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar">
                {/* Eensell Workspace OS Quick Action */}
                <div className="shrink-0">
                  {isProUser ? (
                    <Link
                      href="/workspace"
                      onClick={() => setMobileOpen(false)}
                      className="group flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-violet-500/10 via-primary/5 to-purple-500/10 border border-violet-500/25 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                          <Zap className="w-4 h-4 fill-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-foreground">
                              {t("nav_workspace")}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          </div>
                          <p className="text-xs text-muted-foreground font-medium">
                            {t("nav_workspace_sub")}
                          </p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-primary" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        setProModalOpen(true);
                      }}
                      className="w-full text-left group flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-500/35 shadow-sm cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 shadow-sm">
                          <Crown className="w-4 h-4 fill-slate-950 text-slate-950" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-foreground">
                              {t("nav_workspace")}
                            </span>
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-500 text-slate-950">
                              PRO 499 MAD
                            </span>
                          </div>
                          <p className="text-xs text-amber-500 font-semibold">
                            Upgrade to unlock OS
                          </p>
                        </div>
                      </div>
                      <Crown className="w-4 h-4 text-amber-500" />
                    </button>
                  )}
                </div>

                {/* All Sections */}
                {v2NavSections.map((section, sIndex) => (
                  <div key={section.label || sIndex} className="space-y-2">
                    <p className="px-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
                      {section.labelKey ? t(section.labelKey) : section.label}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "flex items-center gap-2.5 p-2.5 rounded-xl border transition-all text-xs font-medium",
                              active
                                ? "bg-primary text-primary-foreground border-primary font-bold shadow-sm"
                                : "border-border/60 hover:bg-secondary text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span className="truncate">{item.titleKey ? t(item.titleKey) : item.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {isAdmin && (
                  <div>
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-destructive hover:bg-destructive/10 border border-destructive/20"
                    >
                      <Shield className="w-5 h-5 shrink-0" />
                      <span>{t("nav_admin")}</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Sheet Footer */}
              <div className="p-4 border-t border-border bg-card/95 shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <UserButton />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{user?.fullName || "Student"}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <SignOutButton>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </SignOutButton>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Desktop Sidebar (Only visible on lg screens and up) ── */}
      <aside
        className={cn(
          "hidden lg:flex lg:flex-col fixed top-0 h-screen w-[270px] bg-card border-border z-30",
          dir === "rtl" ? "right-0 border-l" : "left-0 border-r"
        )}
      >
        <SidebarContent
          pathname={pathname}
          setMobileOpen={setMobileOpen}
          isAdmin={isAdmin}
          isPro={isProUser}
          onOpenProModal={() => setProModalOpen(true)}
          isActive={isActive}
          hasNewLesson={hasNewLesson}
        />
      </aside>
    </>
  );
}
