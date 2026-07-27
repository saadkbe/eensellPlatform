"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, Calendar, ChevronRight, HelpCircle, MessageSquare, ChevronDown } from "lucide-react";
import { useLanguage } from "@/components/landing/LanguageProvider";
import { Language } from "@/lib/translations";
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

const languages: { code: Language; label: string; flagUrl: string }[] = [
  { code: "ar", label: "العربية", flagUrl: "https://flagcdn.com/sa.svg" },
  { code: "fr", label: "Français", flagUrl: "https://flagcdn.com/fr.svg" },
  { code: "en", label: "English", flagUrl: "https://flagcdn.com/us.svg" },
];

export function TopBar() {
  const pathname = usePathname();
  const [currentDate, setCurrentDate] = useState("");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

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
  
  const isAdmin = pathname.startsWith('/admin');

  // Basic breadcrumb generation, ignoring long database IDs
  const paths = pathname.split('/').filter(Boolean).filter(p => !p.match(/^[a-z0-9]{20,}$/i));
  const breadcrumbs = paths.map((path, index) => {
    const isLast = index === paths.length - 1;
    const title = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
    return (
      <div key={path} className="flex items-center text-sm">
        {index > 0 && <ChevronRight className={`w-4 h-4 mx-2 shrink-0 ${isAdmin ? 'text-white/20' : 'text-muted-foreground'}`} />}
        <span className={`truncate max-w-[150px] sm:max-w-none ${isLast ? (isAdmin ? 'text-white font-semibold' : 'text-foreground font-semibold') : (isAdmin ? 'text-white/40' : 'text-muted-foreground')}`}>
          {title}
        </span>
      </div>
    );
  });

  return (
    <div className={`sticky top-0 z-30 w-full flex items-center justify-between px-4 sm:px-8 lg:px-10 py-3 sm:py-5 transition-all duration-300 ${isAdmin ? 'admin-topbar border-b shadow-none' : 'bg-card/95 backdrop-blur-md border-b border-border shadow-sm'}`}>
      <div className="flex items-center">
        {breadcrumbs.length > 0 ? breadcrumbs : <span className={`font-bold text-xl sm:text-2xl tracking-tight ${isAdmin ? 'text-white' : 'text-foreground'}`}>{t("topbar_home")}</span>}
      </div>
      
      <div className="flex items-center gap-4 sm:gap-5">
        {/* Language Toggle */}
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className={`flex items-center justify-center gap-2.5 h-11 px-4 rounded-full transition-colors shadow-sm ${isAdmin ? 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/60 hover:text-white' : 'bg-muted/50 hover:bg-muted border border-border text-muted-foreground hover:text-foreground'}`}
          >
            <img src={languages.find((l) => l.code === language)?.flagUrl} alt={language} className="w-4.5 h-auto rounded-[2px] shadow-sm" />
            <span className="font-semibold text-sm hidden sm:block">{language.toUpperCase()}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isLangOpen ? "rotate-180" : ""}`} />
          </button>

          {isLangOpen && (
            <div className="absolute top-full mt-2 right-0 bg-popover shadow-md border border-border rounded-xl py-1.5 w-36 flex flex-col z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsLangOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 hover:bg-muted transition-colors w-full text-left ${
                    language === lang.code ? "bg-muted font-bold text-foreground" : "font-semibold text-muted-foreground text-sm"
                  }`}
                >
                  <img src={lang.flagUrl} alt={lang.code} className="w-4 h-auto rounded-[2px] shadow-sm border border-border/50" />
                  <span className="text-xs">{lang.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center relative">
          <CommandMenu />
        </div>
        
        {currentDate && (
          <div className={`hidden sm:flex items-center gap-2.5 text-sm font-medium px-4 py-2.5 rounded-full shadow-sm ${isAdmin ? 'text-white/40 bg-white/[0.04] border border-white/[0.08]' : 'text-muted-foreground bg-muted/50 border border-border'}`}>
            <Calendar className="w-4 h-4" />
            <span>{currentDate}</span>
          </div>
        )}

        <Link href="/dashboard/community" className={`hidden sm:flex items-center justify-center h-11 w-11 rounded-full transition-colors shadow-sm ${isAdmin ? 'text-white/40 hover:text-white bg-white/[0.04] border border-white/[0.08]' : 'text-muted-foreground hover:text-foreground bg-muted/50 border border-border'}`}>
          <HelpCircle className="w-5 h-5" />
        </Link>

        <Link href="/dashboard/community" className={`flex items-center justify-center h-11 w-11 rounded-full transition-colors shadow-sm ${isAdmin ? 'text-white/40 hover:text-white bg-white/[0.04] border border-white/[0.08]' : 'text-muted-foreground hover:text-foreground bg-muted/50 border border-border'}`}>
          <MessageSquare className="w-5 h-5" />
        </Link>

        <NotificationBell />
      </div>
    </div>
  );
}
