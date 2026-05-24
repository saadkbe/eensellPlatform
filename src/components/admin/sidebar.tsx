"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignOutButton } from "@clerk/nextjs";
import {
  BarChart3, Users, Clock, GraduationCap,
  TrendingUp, Mail, Menu, X, Shield, LogOut
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { title: "Overview", href: "/admin", icon: BarChart3 },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Pending", href: "/admin/pending", icon: Clock },
  { title: "Courses", href: "/admin/courses", icon: GraduationCap },
  { title: "Analytics", href: "/admin/analytics", icon: TrendingUp },
  { title: "Emails", href: "/admin/emails", icon: Mail },
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
          src="/logo.png" 
          alt="Eensell University" 
          className="h-20 w-auto object-contain origin-center scale-[1.5]" 
        />
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                active ? "text-primary-foreground bg-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}>
              {active && (
                <motion.div layoutId="adminTab"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary-foreground"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }} />
              )}
              <Icon className={cn("w-[18px] h-[18px] shrink-0", active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
              <span>{item.title}</span>
            </Link>
          );
        })}
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
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="flex items-center">
          <img src="/logo.png" alt="Eensell University" className="h-16 w-auto object-contain origin-left scale-[1.5]" />
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}
          className="text-muted-foreground hover:text-foreground hover:bg-secondary">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
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
      <aside className="hidden lg:flex lg:flex-col fixed left-0 top-0 h-screen w-[260px] bg-card border-r border-border z-30">
        <Content />
      </aside>
    </>
  );
}
