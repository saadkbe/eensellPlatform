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
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

type NavItem = { title: string; href: string; icon: any };
type NavSection = { label: string; items: NavItem[] };

const navSections: NavSection[] = [
  {
    label: "Learn",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Modules", href: "/dashboard/modules", icon: BookOpen },
      { title: "Resources", href: "/dashboard/resources", icon: FolderOpen },
    ],
  },
  {
    label: "Engage",
    items: [
      { title: "Community", href: "/dashboard/community", icon: MessageSquare },
      { title: "Live Calls", href: "/dashboard/live-calls", icon: Video },
      { title: "Goals", href: "/dashboard/goals", icon: Target },
      { title: "Nexus AI", href: "/dashboard/chat", icon: Bot },
    ],
  },
  {
    label: "Grow",
    items: [
      { title: "Career Paths", href: "/dashboard/career", icon: Compass },
      { title: "Settings", href: "/dashboard/settings", icon: Settings },
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
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex justify-center items-center px-6 py-6 border-b border-border">
        <img
          src="/logo.png"
          alt="Eensell University"
          className="h-20 w-auto object-contain origin-center scale-[1.5] dark:brightness-0 dark:invert"
        />
      </div>

      {/* Navigation with sections */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto no-scrollbar">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/60">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex justify-between items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                      active
                        ? "text-primary-foreground bg-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary-foreground"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "w-[18px] h-[18px] shrink-0 transition-colors",
                          active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      <span>{item.title}</span>
                    </div>
                    {item.title === "Modules" && hasNewLesson && (
                      <span className="bg-foreground text-background text-[10px] font-bold px-1.5 py-0.5 rounded ml-2">New Lesson</span>
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
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-200 border border-destructive/20"
            >
              <Shield className="w-[18px] h-[18px] shrink-0" />
              <span>Admin Panel</span>
            </Link>
          </div>
        )}
      </nav>

      {/* User section */}
      <div className="px-4 py-4 border-t border-border mt-auto">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground font-medium truncate">Account</p>
              <p className="text-xs text-muted-foreground truncate">Manage profile</p>
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
}

export function DashboardSidebar({ hasNewLesson = false }: { hasNewLesson?: boolean }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useUser();

  const isAdmin = user?.publicMetadata?.role === "ADMIN";

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="flex items-center">
          <img src="/logo.png" alt="Eensell University" className="h-16 w-auto object-contain origin-left scale-[1.5] dark:brightness-0 dark:invert" />
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
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed top-0 left-0 z-50 w-[280px] h-screen bg-card border-r border-border"
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
      <aside className="hidden lg:flex lg:flex-col fixed left-0 top-0 h-screen w-[260px] bg-card border-r border-border z-30">
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
