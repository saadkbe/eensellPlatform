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
      className={`fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-300 ${scrolled ? "top-4" : "top-6"}`}
    >
      <div className={`pointer-events-auto backdrop-blur-xl rounded-[2.5rem] px-5 py-4 flex items-center justify-between border max-w-[1250px] w-full transition-all duration-500 relative ${scrolled ? "bg-white/95 shadow-lg border-white/80" : "bg-white/40 shadow-pill border-white/40"}`}>
        {/* Left side Logo */}
        <div className="flex-shrink-0 mr-16 sm:mr-28 rtl:mr-0 rtl:ml-16 sm:rtl:ml-28">
          <Link href="/" className="pl-4 rtl:pl-0 rtl:pr-4 flex items-center">
            <Image
              src="/logo.png"
              alt="Eensell University"
              width={360}
              height={80}
              className="h-16 sm:h-20 w-auto scale-[1.7] sm:scale-[2.0] origin-left rtl:origin-right object-contain ml-4 transition-all duration-300"
            />
          </Link>
        </div>

        {/* Balanced Centered Links */}
        {!hideLinks && (
          <div className="hidden lg:flex flex-1 justify-center items-center gap-8 text-[17px] font-bold text-zinc-600 px-6 whitespace-nowrap">
            <Link href="/#pricing" className="hover:text-zinc-900 transition-colors">Pricing</Link>
            <Link href="/#features" className="hover:text-zinc-900 transition-colors">Features</Link>
            <Link href="/#how-it-works" className="hover:text-zinc-900 transition-colors">Process</Link>
            <Link href="/#testimonials" className="hover:text-zinc-900 transition-colors">Testimonials</Link>
            <Link href="/#faq" className="hover:text-zinc-900 transition-colors">FAQ</Link>
            <Link href="/contact" className="hover:text-zinc-900 transition-colors">Contact</Link>
          </div>
        )}

        {/* Right side Actions & Language (Desktop) */}
        <div className={`flex items-center gap-2 sm:gap-3 flex-shrink-0 pr-1 rtl:pr-0 rtl:pl-1 ${hideLinks ? "" : "hidden lg:flex"}`}>
          {/* Lang selector toggle */}
          <div className={`relative mr-2 rtl:ml-2 rtl:mr-0 pr-2 rtl:pl-2 rtl:pr-0 ${!hideLinks ? "border-r rtl:border-l rtl:border-r-0 border-zinc-300/50" : ""}`}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-black/5 transition-colors"
            >
              <img src={languages.find((l) => l.code === language)?.flagUrl} alt={language} className="w-5 h-auto rounded-[2px] shadow-sm border border-zinc-200/50" />
              <span className="font-bold text-base text-zinc-800 hidden sm:block">{language.toUpperCase()}</span>
              <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isLangOpen ? "rotate-180" : ""}`} />
            </button>

            {isLangOpen && (
              <div className="absolute top-full mt-4 right-0 rtl:right-auto rtl:left-0 bg-white shadow-xl border border-zinc-100 rounded-2xl py-2 w-40 flex flex-col z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors w-full text-left ${
                      language === lang.code ? "bg-zinc-50 font-bold text-zinc-900" : "font-semibold text-zinc-600"
                    }`}
                  >
                    <img src={lang.flagUrl} alt={lang.code} className="w-5 h-auto rounded-[2px] shadow-sm border border-zinc-200/50" />
                    <span className="text-sm">{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {!hideLinks && (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" className="hidden sm:flex rounded-full px-6 h-13 sm:h-14 text-base font-bold text-zinc-700 hover:text-zinc-900 hover:bg-white/50">
                  {t("nav_signIn")}
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="rounded-full px-7 sm:px-9 h-13 sm:h-14 text-base font-bold bg-[#FF6B4A] hover:bg-[#E85A3B] text-white shadow-md transition-transform hover:-translate-y-0.5">
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
            <div className="flex flex-col gap-5 text-lg font-bold text-zinc-700">
              <Link href="/#pricing" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
              <Link href="/#features" onClick={() => setIsMobileMenuOpen(false)}>Features</Link>
              <Link href="/#how-it-works" onClick={() => setIsMobileMenuOpen(false)}>Process</Link>
              <Link href="/#testimonials" onClick={() => setIsMobileMenuOpen(false)}>Testimonials</Link>
              <Link href="/#faq" onClick={() => setIsMobileMenuOpen(false)}>FAQ</Link>
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
                <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full rounded-xl h-12 font-bold text-zinc-800 bg-white border-zinc-200 shadow-sm">
                    {t("nav_signIn")}
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
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
