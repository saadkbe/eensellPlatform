"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, Calendar, ChevronRight, HelpCircle, MessageSquare } from "lucide-react";
import { NotificationBell } from "./notification-bell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { CommandMenu } from "./command-menu";

export function TopBar() {
  const pathname = usePathname();
  const [currentDate, setCurrentDate] = useState("");

  // Render date client-side only to avoid hydration mismatch
  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      })
    );
  }, []);
  
  // Basic breadcrumb generation, ignoring long database IDs
  const paths = pathname.split('/').filter(Boolean).filter(p => !p.match(/^[a-z0-9]{20,}$/i));
  const breadcrumbs = paths.map((path, index) => {
    const isLast = index === paths.length - 1;
    const title = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
    return (
      <div key={path} className="flex items-center text-sm">
        {index > 0 && <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground shrink-0" />}
        <span className={`truncate max-w-[150px] sm:max-w-none ${isLast ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
          {title}
        </span>
      </div>
    );
  });

  return (
    <div className="sticky top-0 z-30 w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 bg-card border-b border-border transition-all duration-300 shadow-sm">
      <div className="flex items-center">
        {breadcrumbs.length > 0 ? breadcrumbs : <span className="text-foreground font-semibold">Home</span>}
      </div>
      
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden md:flex items-center relative">
          <CommandMenu />
        </div>
        
        {currentDate && (
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border">
            <Calendar className="w-3.5 h-3.5" />
            <span>{currentDate}</span>
          </div>
        )}

        <Link href="/dashboard/community" className="hidden sm:flex items-center justify-center text-muted-foreground hover:text-foreground h-9 w-9 rounded-full bg-muted/50 border border-border transition-colors">
          <HelpCircle className="w-4 h-4" />
        </Link>

        <Link href="/dashboard/community" className="flex items-center justify-center text-muted-foreground hover:text-foreground h-9 w-9 rounded-full bg-muted/50 border border-border transition-colors">
          <MessageSquare className="w-4 h-4" />
        </Link>

        <NotificationBell />
      </div>
    </div>
  );
}
