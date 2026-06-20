"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { translations, Language, TranslationKey } from "@/lib/translations";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  dir: "rtl" | "ltr";
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "ar";
  const stored = document.cookie
    .split("; ")
    .find((row) => row.startsWith("eensell_lang="));
  if (stored) {
    const val = stored.split("=")[1] as Language;
    if (["ar", "fr", "en"].includes(val)) return val;
  }
  return "ar";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ar");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLanguageState(getInitialLanguage());
    setMounted(true);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    document.cookie = `eensell_lang=${lang};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[language]?.[key] ?? translations.ar[key] ?? key;
    },
    [language]
  );

  const dir = language === "ar" ? "rtl" : "ltr";
  const isRTL = language === "ar";

  // Prevent flash of wrong language
  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ language: "ar", setLanguage, t: (key) => translations.ar[key] ?? key, dir: "rtl", isRTL: true }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
