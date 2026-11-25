"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/landing/LanguageProvider";

export function Navbar({ hideLinks = false }: { hideLinks?: boolean } = {}) {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { t, language, dir } = useLanguage();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const priceText = language === "ar" ? "499 درهم" : "499 MAD";

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      dir={dir}
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs text-slate-900"
          : "bg-slate-950/60 backdrop-blur-md border-b border-white/10 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* 1. The Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo2-cropped-black.webp"
              alt="Eensell University"
              width={376}
              height={106}
              priority
              className={`h-9 sm:h-11 w-auto object-contain transition-all duration-300 ${
                scrolled ? "" : "brightness-0 invert"
              }`}
            />
          </Link>
        </div>

        {/* Right side: 2. The Price & 3. The Start Button */}
        <div className="flex items-center gap-2.5 sm:gap-4 flex-shrink-0">
          {/* 2. The Price */}
          <a
            href="#pricing"
            className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-extrabold tracking-tight transition-all duration-200 border cursor-pointer ${
              scrolled
                ? "bg-orange-50 text-orange-600 border-orange-200/80 hover:bg-orange-100 hover:border-orange-300"
                : "bg-white/10 text-amber-300 border-white/20 hover:bg-white/15 hover:border-amber-400/40"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="font-black text-sm sm:text-base">{priceText}</span>
          </a>

          {/* 3. The Start Button */}
          <Link href="#pricing">
            <Button className="rounded-full px-4 sm:px-6 h-9 sm:h-10 text-xs sm:text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-md hover:shadow-orange-500/25 transition-all duration-200 cursor-pointer border border-orange-400/30 flex items-center gap-1.5">
              <span>{t("nav_cta")}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
