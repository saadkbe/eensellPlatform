"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  LayoutDashboard,
  MapPin,
  Users,
  Table2,
  Send,
  Receipt,
  StickyNote,
  Settings,
  GraduationCap,
  Plus,
  Compass,
  Sparkles,
  Layers,
  ChevronRight,
  Menu,
  X,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const mainNav = [
  { title: "Overview & Income", href: "/workspace", icon: LayoutDashboard },
  { title: "Maps Lead Scraper", href: "/workspace/scraper", icon: MapPin },
  { title: "Clients & Outreach", href: "/workspace/crm", icon: Users },
  { title: "Agency Sheets", href: "/workspace/sheets", icon: Table2 },
  { title: "Email & DM Drafter", href: "/workspace/drafter", icon: Send },
  { title: "Invoices & Contracts", href: "/workspace/invoices", icon: Receipt },
  { title: "Notes & Scratchpad", href: "/workspace/notes", icon: StickyNote },
  { title: "Settings", href: "/workspace/settings", icon: Settings },
];

const quickTools = [
  { title: "Dental Clinics Casablanca", href: "/workspace/scraper", tag: "casa-dental" },
  { title: "Real Estate Rabat", href: "/workspace/scraper", tag: "rabat-immo" },
  { title: "Standard Service Agreement", href: "/workspace/invoices", tag: "invoice-tmp" },
];

export function WorkspaceSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useUser();

  const isActive = (href: string) => {
    if (href === "/workspace") return pathname === "/workspace";
    return pathname.startsWith(href);
  };

  const content = (
    <div className="flex flex-col h-full bg-card border-r border-border text-foreground select-none">
      {/* Workspace Brand Header */}
      <div className="px-4 py-4 border-b border-border/80 flex items-center justify-between">
        <Link href="/workspace" className="flex items-center w-full">
          <img
            src="/workspace-logo-cropped.png"
            alt="Eensell Workspace"
            className="h-7 w-auto object-contain dark:hidden"
          />
          <img
            src="/workspace-logo-cropped-white.png"
            alt="Eensell Workspace"
            className="h-7 w-auto object-contain hidden dark:block"
          />
        </Link>
      </div>

      {/* Top Scrape Leads Button */}
      <div className="p-3">
        <Link
          href="/workspace/scraper"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-xs transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Scrape New Clients</span>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 px-3 py-2 space-y-6 overflow-y-auto no-scrollbar text-xs">
        {/* Main Nav */}
        <div className="space-y-1">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary font-bold border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0", active ? "text-primary" : "text-muted-foreground")} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>

        {/* Quick Tools & Presets */}
        <div className="space-y-2">
          <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
            Presets & Shortcuts
          </div>
          <div className="space-y-0.5">
            {quickTools.map((tool) => (
              <Link
                key={tool.tag}
                href={tool.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors",
                  "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary/70 shrink-0" />
                <span className="truncate flex-1">{tool.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Exit back to Academy */}
        <div className="pt-2">
          <div className="h-px bg-border/60 mb-3" />
          <Link
            href="/dashboard"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-4 h-4 text-muted-foreground" />
              <span>Back to Academy</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          </Link>
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-border/80">
        <div className="flex items-center justify-between p-2 rounded-xl bg-muted/40 border border-border/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <UserButton />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-foreground truncate">
                {user?.fullName || user?.firstName || "Founder"}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono truncate">
                Pro AI OS
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 z-50 flex items-center justify-between px-4 bg-card/95 border-b border-border backdrop-blur-xl">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg text-foreground hover:bg-muted"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center">
          <img
            src="/workspace-logo-cropped.png"
            alt="Eensell Workspace"
            className="h-6 w-auto object-contain dark:hidden"
          />
          <img
            src="/workspace-logo-cropped-white.png"
            alt="Eensell Workspace"
            className="h-6 w-auto object-contain hidden dark:block"
          />
        </div>

        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-medium"
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Academy</span>
        </Link>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 top-14 bg-black/40 backdrop-blur-xs">
          <div className="w-64 h-[calc(100vh-3.5rem)]">{content}</div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 fixed inset-y-0 left-0 z-30">
        {content}
      </aside>
    </>
  );
}
