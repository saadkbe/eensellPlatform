"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignOutButton } from "@clerk/nextjs";
import {
  BarChart3,
  Users,
  Clock,
  GraduationCap,
  UserCheck,
  TrendingUp,
  Mail,
  Menu,
  X,
  Shield,
  LogOut,
  FolderOpen,
  PenLine,
  Video,
  FileCheck,
  Target,
  MoreHorizontal,
  AlertCircle,
  DollarSign,
  ArrowLeft,
  Sparkles,
  Layers,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

type NavItem = {
  title: string;
  href: string;
  icon: any;
  color?: string;
  badge?: string;
};

type NavSection = {
  label: string;
  color: string;
  dotColor: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    label: "Overview & Growth",
    color: "text-sky-400",
    dotColor: "bg-sky-400",
    items: [
      { title: "Dashboard", href: "/admin", icon: BarChart3, color: "text-sky-400" },
      { title: "Analytics", href: "/admin/analytics", icon: TrendingUp, color: "text-cyan-400" },
      { title: "Referrals & Payouts", href: "/admin/referrals", icon: Target, color: "text-blue-400" },
      { title: "Financial Tracking", href: "/admin/tracking", icon: DollarSign, color: "text-indigo-400" },
    ],
  },
  {
    label: "Students & Cohort",
    color: "text-amber-400",
    dotColor: "bg-amber-400",
    items: [
      { title: "All Users", href: "/admin/users", icon: Users, color: "text-amber-400" },
      { title: "Active Paid Users", href: "/admin/active-users", icon: UserCheck, color: "text-orange-400" },
      { title: "Pending Approvals", href: "/admin/pending", icon: Clock, color: "text-amber-500" },
      { title: "Student Emails", href: "/admin/emails", icon: Mail, color: "text-yellow-400" },
    ],
  },
  {
    label: "Curriculum & Assets",
    color: "text-emerald-400",
    dotColor: "bg-emerald-400",
    items: [
      { title: "Video Courses", href: "/admin/courses", icon: GraduationCap, color: "text-emerald-400" },
      { title: "Resource Vault", href: "/admin/resources", icon: FolderOpen, color: "text-teal-400" },
      { title: "Live Office Hours", href: "/admin/live-calls", icon: Video, color: "text-emerald-500" },
      { title: "Homework Reviews", href: "/admin/homeworks", icon: FileCheck, color: "text-teal-500" },
    ],
  },
  {
    label: "Support & Community",
    color: "text-rose-400",
    dotColor: "bg-rose-400",
    items: [
      {
        title: "Task Problem Reports",
        href: "/admin/reports",
        icon: AlertCircle,
        color: "text-rose-400",
      },
      { title: "Community Forum", href: "/admin/posts", icon: PenLine, color: "text-purple-400" },
    ],
  },
];

const bottomNavItems = [
  { title: "Overview", href: "/admin", icon: BarChart3 },
  { title: "Students", href: "/admin/users", icon: Users },
  { title: "Courses", href: "/admin/courses", icon: GraduationCap },
  { title: "Reports", href: "/admin/reports", icon: AlertCircle },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const Content = () => (
    <div className="flex flex-col h-full bg-card">
      {/* Brand Header - Matches student dashboard logo scale and size */}
      <div className="flex flex-col items-center justify-center px-4 py-4 sm:py-5 border-b border-border bg-card">
        <Link href="/admin" className="flex items-center justify-center">
          <img
            src="/logo2.png"
            alt="Eensell University"
            className="h-12 sm:h-14 w-auto object-contain origin-center scale-[2.2] brightness-0 dark:invert my-1"
          />
        </Link>
        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[11px] font-bold tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          <span>Admin Command Center</span>
        </div>
      </div>

      {/* Nav Sections */}
      <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto no-scrollbar">
        {navSections.map((section) => (
          <div key={section.label} className="space-y-1.5">
            <div className="flex items-center gap-2 px-4 mb-2.5">
              <span className={cn("w-2 h-2 rounded-full", section.dotColor)} />
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground/70">
                {section.label}
              </p>
            </div>

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
                      "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                      active
                        ? "bg-amber-500/15 text-amber-500 dark:text-amber-400 font-bold border border-amber-500/30 shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    {active && (
                      <motion.div
                        layoutId="adminActiveIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-6 rounded-r-full bg-gradient-to-b from-amber-400 to-orange-500"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}

                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                          active
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-muted/60 text-muted-foreground group-hover:text-foreground"
                        )}
                      >
                        <Icon className={cn("w-5 h-5", active ? "text-amber-500 dark:text-amber-400" : item.color)} />
                      </div>
                      <span className="truncate">{item.title}</span>
                    </div>

                    {item.badge && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Back to Student Dashboard */}
      <div className="px-4 py-3.5 border-t border-border bg-card">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-bold text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 transition-all border border-transparent hover:border-amber-500/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Student Dashboard</span>
        </Link>
      </div>

      {/* Footer Profile & Toggle - Matching student sidebar scale */}
      <div className="px-5 py-5 border-t border-border mt-auto bg-card">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 px-2">
            <UserButton appearance={{ elements: { avatarBox: "w-10 h-10 rounded-lg" } }} />
            <div className="flex-1 min-w-0">
              <p className="text-base text-foreground font-medium truncate">Super Admin</p>
              <p className="text-sm text-muted-foreground truncate">saadkbe1@gmail.com</p>
            </div>
            <ThemeToggle />
          </div>

          <SignOutButton>
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 text-base py-5 rounded-xl"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="flex items-center gap-3">
          <img
            src="/logo2.png"
            alt="Eensell University"
            className="h-10 w-auto object-contain origin-left scale-[3] brightness-0 dark:invert"
          />
          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] font-black uppercase ml-12">
            Admin
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50 bg-background/80 backdrop-blur-2xl border border-border shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-3xl safe-area-pb">
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
                  active ? "text-amber-500 font-bold" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active && (
                  <>
                    <motion.div
                      layoutId="adminBottomNavActive"
                      className="absolute inset-0 bg-amber-500/15 rounded-2xl -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                    <motion.div
                      layoutId="adminBottomNavDot"
                      className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  </>
                )}
                <Icon className={cn("w-5 h-5 transition-all duration-300", active && "scale-110 mb-0.5")} />
                <span className="text-[10px] font-semibold leading-tight">{item.title}</span>
              </Link>
            );
          })}

          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-2xl text-muted-foreground hover:text-foreground transition-all duration-300 min-w-[64px] z-10"
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] font-semibold leading-tight">More</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
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
              initial={{ x: -270 }}
              animate={{ x: 0 }}
              exit={{ x: -270 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed top-0 left-0 z-50 w-[270px] h-screen bg-card border-r border-border shadow-2xl"
            >
              <Content />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - Matches 270px width of Student Sidebar */}
      <aside className="hidden lg:flex lg:flex-col fixed left-0 top-0 h-screen w-[270px] bg-card border-r border-border z-30">
        <Content />
      </aside>
    </>
  );
}
