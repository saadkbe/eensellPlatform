"use client";

import { useLanguage } from "@/components/landing/LanguageProvider";
import { cn } from "@/lib/utils";

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { dir } = useLanguage();
  return (
    <main className={cn("pt-14 lg:pt-0 pb-20 lg:pb-0 min-h-screen flex flex-col", dir === "rtl" ? "lg:mr-[320px]" : "lg:ml-[320px]")}>
      {children}
    </main>
  );
}
