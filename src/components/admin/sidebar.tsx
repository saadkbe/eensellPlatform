"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignOutButton } from "@clerk/nextjs";
import {
  BarChart3, Users, Clock, GraduationCap, UserCheck,
  TrendingUp, Mail, Menu, X, Shield, LogOut,
  FolderOpen, PenLine, Video, FileCheck, Target, MoreHorizontal
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

type NavItem = { title: string; href: string; icon: any };
type NavSection = { label: string; items: NavItem[] };

const navSections: NavSection[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/admin", icon: BarChart3 },
      { title: "Analytics", href: "/admin/analytics", icon: TrendingUp },
      { title: "Referrals", href: "/admin/referrals", icon: Target },
      { title: "Admin Tracking", href: "/admin/tracking", icon: Target },
    ],
  },
  {
    label: "Users",
    items: [
      { title: "All Users", href: "/admin/users", icon: Users },
      { title: "Active Users", href: "/admin/active-users", icon: UserCheck },
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
    <div className="flex flex-col h-full">
      <div className="flex justify-center items-center px-6 py-6 border-b border-border">
        <img 
          src="/logo2.png" 
          alt="Eensell University" 
          className="h-14 sm:h-18 w-auto object-contain origin-center scale-[3] brightness-0 dark:invert my-2" 
        />
      </div>
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto no-scrollbar">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/60">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-medium transition-all duration-200 group relative",
                      active ? "text-primary-foreground bg-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}>
                    {active && (
                      <motion.div layoutId="adminTab"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary-foreground"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                    )}
                    <Icon className={cn("w-5 h-5 shrink-0", active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="px-3 py-3 border-t border-border">
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
          ← Back to Dashboard
        </Link>
      </div>
      <div className="px-4 py-4 border-t border-border mt-auto">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2">
            <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground font-medium truncate">Admin</p>
              <p className="text-xs text-muted-foreground truncate">Manage platform</p>
            </div>
            <ThemeToggle />
          </div>
          <SignOutButton>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-secondary">
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </Button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="flex items-center">
          <img src="/logo2.png" alt="Eensell University" className="h-10 w-auto object-contain origin-left scale-[3] brightness-0 dark:invert" />
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}
          className="text-muted-foreground hover:text-foreground hover:bg-secondary">
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
                      layoutId="adminBottomNavActive"
                      className="absolute inset-0 bg-primary/10 rounded-2xl -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                    <motion.div
                      layoutId="adminBottomNavDot"
                      className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  </>
                )}
                <Icon className={cn("w-5 h-5 transition-all duration-300", active && "scale-110 mb-0.5")} />
                <span className={cn("text-[10px] font-medium leading-tight", active ? "text-primary" : "text-muted-foreground")}>
                  {item.title}
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
            <span className="text-[10px] font-medium leading-tight">More</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)} className="lg:hidden fixed inset-0 z-40 bg-black/60" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed top-0 left-0 z-50 w-[280px] h-screen bg-card border-r border-border">
              <Content />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <aside className="hidden lg:flex lg:flex-col fixed left-0 top-0 h-screen w-[280px] bg-card border-r border-border z-30">
        <Content />
      </aside>
    </>
  );
}
