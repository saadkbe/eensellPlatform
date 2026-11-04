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
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      dir={dir}
      className={`fixed top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-300 ${scrolled ? "top-3" : "top-5"}`}
    >
      <div className={`pointer-events-auto backdrop-blur-xl rounded-full px-4 sm:px-6 py-2 flex items-center justify-between border max-w-[1140px] w-full transition-all duration-500 relative ${scrolled ? "bg-white/95 shadow-md border-slate-200/90" : "bg-white/80 shadow-xs border-slate-200/70"}`}>
        {/* Left side Logo */}
        <div className="flex-shrink-0 mr-3 sm:mr-6 rtl:mr-0 rtl:ml-3 sm:rtl:ml-6 flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo2.png"
              alt="Eensell University"
              width={160}
              height={36}
              priority
              className="h-6 sm:h-7 w-auto object-contain brightness-0 dark:invert transition-all duration-200"
            />
          </Link>
        </div>

        {/* Center Navigation Links */}
        {!hideLinks && (
          <div className="hidden lg:flex items-center gap-1">
            <a href="#vsl-player" className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>12-Min VSL</span>
            </a>
            <a href="#workspace" className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors">Workspace OS</a>
            <a href="#university" className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors">University V2</a>
            <a href="#pricing" className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors">Pricing</a>
            <a href="#testimonials" className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors">Testimonials</a>
            <a href="#faq" className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors">FAQ</a>
            <Link href="/contact" className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors">Contact</Link>
          </div>
        )}

        {/* Right side Actions & Language (Desktop) */}
        <div className={`flex items-center gap-2 flex-shrink-0 ${hideLinks ? "" : "hidden lg:flex"}`}>
          {/* Lang selector toggle */}
          <div className={`relative mr-1 rtl:ml-1 rtl:mr-0 pr-1.5 rtl:pl-1.5 rtl:pr-0 ${!hideLinks ? "border-r rtl:border-l rtl:border-r-0 border-slate-200" : ""}`}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <img src={languages.find((l) => l.code === language)?.flagUrl} alt={language} className="w-4 h-auto rounded-[2px] shadow-2xs border border-slate-200" />
              <span className="font-bold text-xs text-slate-800 hidden sm:block">{language.toUpperCase()}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isLangOpen ? "rotate-180" : ""}`} />
            </button>

            {isLangOpen && (
              <div className="absolute top-full mt-3 right-0 rtl:right-auto rtl:left-0 bg-white shadow-xl border border-slate-100 rounded-2xl py-1.5 w-36 flex flex-col z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 transition-colors w-full text-left ${
                      language === lang.code ? "bg-slate-50 font-bold text-slate-950" : "font-medium text-slate-600"
                    }`}
                  >
                    <img src={lang.flagUrl} alt={lang.code} className="w-4 h-auto rounded-[2px] shadow-2xs border border-slate-200" />
                    <span className="text-xs">{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {!hideLinks && (
            <>
              <Link href="/sign-in" prefetch={true}>
                <Button variant="ghost" className="hidden sm:flex rounded-full px-3.5 h-8 text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100 cursor-pointer">
                  {t("nav_signIn")}
                </Button>
              </Link>
              <Link href="/sign-up" prefetch={true}>
                <Button className="rounded-full px-4 sm:px-5 h-8 text-xs font-bold bg-slate-950 hover:bg-slate-900 text-white shadow-xs transition-transform hover:-translate-y-0.5 cursor-pointer">
                  {t("nav_cta")}
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        {!hideLinks && (
          <div className="lg:hidden pr-2 rtl:pr-0 rtl:pl-2">
            <button 
              className="p-3 rounded-xl bg-black/5 hover:bg-black/10 text-zinc-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full mt-4 w-full px-4 lg:hidden pointer-events-auto"
        >
          <div className="bg-white/95 backdrop-blur-2xl border border-zinc-200/50 rounded-3xl shadow-2xl p-6 flex flex-col gap-6">
            {/* Mobile Links */}
            <div className="flex flex-col gap-4 text-base font-bold text-slate-800">
              <a href="#vsl-player" onClick={() => setIsMobileMenuOpen(false)}>12-Min VSL</a>
              <a href="#workspace" onClick={() => setIsMobileMenuOpen(false)}>Workspace OS</a>
              <a href="#university" onClick={() => setIsMobileMenuOpen(false)}>University V2</a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
              <a href="#testimonials" onClick={() => setIsMobileMenuOpen(false)}>Testimonials</a>
              <a href="#faq" onClick={() => setIsMobileMenuOpen(false)}>FAQ</a>
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            </div>

            <div className="h-px w-full bg-zinc-200/60" />

            {/* Mobile Language & Buttons */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-2">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setIsMobileMenuOpen(false); }}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border ${language === lang.code ? "bg-zinc-100 border-zinc-200 shadow-sm" : "bg-transparent border-transparent hover:bg-zinc-50"}`}
                  >
                    <img src={lang.flagUrl} className="w-5 h-auto rounded-[2px] shadow-sm" />
                    <span className="text-sm font-bold text-zinc-800">{lang.code.toUpperCase()}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <Link href="/sign-in" prefetch={true} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full rounded-xl h-12 font-bold text-zinc-800 bg-white border-zinc-200 shadow-sm">
                    {t("nav_signIn")}
                  </Button>
                </Link>
                <Link href="/sign-up" prefetch={true} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full rounded-xl h-12 font-bold bg-[#FF6B4A] hover:bg-[#E85A3B] text-white shadow-[0_4px_10px_rgba(255,107,74,0.3)]">
                    {t("nav_cta")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
