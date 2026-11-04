"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";
import { useLanguage } from "@/components/landing/LanguageProvider";
import { Language } from "@/lib/translations";

const languages: { code: Language; label: string; flagUrl: string }[] = [
  { code: "ar", label: "العربية", flagUrl: "https://flagcdn.com/sa.svg" },
  { code: "fr", label: "Français", flagUrl: "https://flagcdn.com/fr.svg" },
  { code: "en", label: "English", flagUrl: "https://flagcdn.com/us.svg" },
];

export function Navbar({ hideLinks = false }: { hideLinks?: boolean } = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { t, language, setLanguage, dir } = useLanguage();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      dir={dir}
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs"
          : "bg-white/85 backdrop-blur-sm border-b border-slate-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left side Logo - Enlarged & High Quality */}
        <div className="flex-shrink-0 flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo2.png"
              alt="Eensell University"
              width={260}
              height={60}
              priority
              className="h-10 sm:h-12 w-auto object-contain brightness-0 dark:invert transition-all"
            />
          </Link>
        </div>

        {/* Center Navigation Links */}
        {!hideLinks && (
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            <a
              href="#vsl-player"
              className="px-3 py-1.5 text-xs sm:text-[13px] font-semibold text-slate-700 hover:text-slate-950 transition-colors flex items-center gap-1.5 rounded-lg hover:bg-slate-50"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>12-Min VSL</span>
            </a>
            <a
              href="#workspace"
              className="px-3 py-1.5 text-xs sm:text-[13px] font-semibold text-slate-700 hover:text-slate-950 transition-colors rounded-lg hover:bg-slate-50"
            >
              Workspace OS
            </a>
            <a
              href="#university"
              className="px-3 py-1.5 text-xs sm:text-[13px] font-semibold text-slate-700 hover:text-slate-950 transition-colors rounded-lg hover:bg-slate-50"
            >
              University V2
            </a>
            <a
              href="#pricing"
              className="px-3 py-1.5 text-xs sm:text-[13px] font-semibold text-slate-700 hover:text-slate-950 transition-colors rounded-lg hover:bg-slate-50"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="px-3 py-1.5 text-xs sm:text-[13px] font-semibold text-slate-700 hover:text-slate-950 transition-colors rounded-lg hover:bg-slate-50"
            >
              Testimonials
            </a>
            <a
              href="#faq"
              className="px-3 py-1.5 text-xs sm:text-[13px] font-semibold text-slate-700 hover:text-slate-950 transition-colors rounded-lg hover:bg-slate-50"
            >
              FAQ
            </a>
            <Link
              href="/contact"
              className="px-3 py-1.5 text-xs sm:text-[13px] font-semibold text-slate-700 hover:text-slate-950 transition-colors rounded-lg hover:bg-slate-50"
            >
              Contact
            </Link>
          </nav>
        )}

        {/* Right side Actions & Language (Desktop) */}
        <div className={`flex items-center gap-3 flex-shrink-0 ${hideLinks ? "" : "hidden lg:flex"}`}>
          {/* Lang selector toggle */}
          <div className="relative pr-2 rtl:pl-2 rtl:pr-0 border-r rtl:border-l rtl:border-r-0 border-slate-200">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <img
                src={languages.find((l) => l.code === language)?.flagUrl}
                alt={language}
                className="w-4 h-auto rounded-[2px] shadow-2xs border border-slate-200"
              />
              <span className="font-bold text-xs text-slate-800 hidden sm:block">
                {language.toUpperCase()}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  isLangOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isLangOpen && (
              <div className="absolute top-full mt-2 right-0 rtl:right-auto rtl:left-0 bg-white shadow-xl border border-slate-100 rounded-xl py-1.5 w-36 flex flex-col z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 transition-colors w-full text-left ${
                      language === lang.code
                        ? "bg-slate-50 font-bold text-slate-950"
                        : "font-medium text-slate-600"
                    }`}
                  >
                    <img
                      src={lang.flagUrl}
                      alt={lang.code}
                      className="w-4 h-auto rounded-[2px] shadow-2xs border border-slate-200"
                    />
                    <span className="text-xs">{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {!hideLinks && (
            <div className="flex items-center gap-2">
              <Link href="/sign-in" prefetch={true}>
                <Button
                  variant="ghost"
                  className="rounded-xl px-4 h-9 text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100 cursor-pointer"
                >
                  {t("nav_signIn")}
                </Button>
              </Link>
              <Link href="/sign-up" prefetch={true}>
                <Button className="rounded-xl px-5 h-9 text-xs font-bold bg-slate-950 hover:bg-slate-900 text-white shadow-xs transition-transform hover:-translate-y-0.5 cursor-pointer">
                  {t("nav_cta")}
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        {!hideLinks && (
          <div className="lg:hidden">
            <button
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 w-full px-4 py-4 bg-white/98 backdrop-blur-2xl border-b border-slate-200 shadow-xl lg:hidden"
        >
          <div className="flex flex-col gap-3 text-sm font-bold text-slate-800 pb-4 border-b border-slate-100">
            <a href="#vsl-player" onClick={() => setIsMobileMenuOpen(false)}>
              12-Min VSL
            </a>
            <a href="#workspace" onClick={() => setIsMobileMenuOpen(false)}>
              Workspace OS
            </a>
            <a href="#university" onClick={() => setIsMobileMenuOpen(false)}>
              University V2
            </a>
            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)}>
              Pricing
            </a>
            <a href="#testimonials" onClick={() => setIsMobileMenuOpen(false)}>
              Testimonials
            </a>
            <a href="#faq" onClick={() => setIsMobileMenuOpen(false)}>
              FAQ
            </a>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
              Contact
            </Link>
          </div>

          <div className="pt-4 flex items-center justify-between gap-3">
            <Link href="/sign-in" className="flex-1">
              <Button variant="outline" className="w-full h-10 text-xs font-bold">
                {t("nav_signIn")}
              </Button>
            </Link>
            <Link href="/sign-up" className="flex-1">
              <Button className="w-full h-10 text-xs font-bold bg-slate-950 text-white">
                {t("nav_cta")}
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
