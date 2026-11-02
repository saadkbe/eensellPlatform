"use client";

import { useLanguage } from "@/components/landing/LanguageProvider";
import { cn } from "@/lib/utils";

export function WorkspaceLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { dir, isRTL } = useLanguage();

  return (
    <div
      dir={dir}
      className="min-h-screen bg-[#FFFFFF] dark:bg-[#191919] text-[#37352F] dark:text-[#E6E6E5] flex transition-colors duration-150 antialiased font-sans"
    >
      {children}
    </div>
  );
}

export function WorkspaceMainWrapper({ children }: { children: React.ReactNode }) {
  const { isRTL } = useLanguage();

  return (
    <main
      className={cn(
        "flex-1 min-w-0 flex flex-col min-h-screen relative transition-all duration-150",
        isRTL ? "lg:pr-60" : "lg:pl-60"
      )}
    >
      {children}
    </main>
  );
}
