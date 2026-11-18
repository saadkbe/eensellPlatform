"use client";

import { useLanguage } from "@/components/landing/LanguageProvider";
import { cn } from "@/lib/utils";

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { dir } = useLanguage();
  return (
    <main className={cn("pb-24 lg:pb-6 min-h-screen flex flex-col", dir === "rtl" ? "lg:mr-[270px]" : "lg:ml-[270px]")}>
      {children}
    </main>
  );
}
