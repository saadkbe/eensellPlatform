"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/landing/LanguageProvider";

export function Footer() {
  const { dir, t } = useLanguage();

  return (
    <footer dir={dir} className="relative py-14 sm:py-20 bg-white border-t border-slate-200/80 text-slate-600">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-slate-100">
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo2-cropped.png"
                alt="Eensell University"
                width={376}
                height={106}
                className="h-9 sm:h-11 w-auto object-contain brightness-0 dark:invert"
              />
            </Link>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm text-center md:text-left rtl:md:text-right leading-relaxed">
              {t("footer_tagline")}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs sm:text-sm font-semibold text-slate-700">
            <a href="#vsl-player" className="hover:text-slate-950 transition-colors">
              {t("nav_vsl")}
            </a>
            <a href="#workspace" className="hover:text-slate-950 transition-colors">
              {t("nav_workspace_os")}
            </a>
            <a href="#university" className="hover:text-slate-950 transition-colors">
              {t("nav_university")}
            </a>
            <a href="#pricing" className="hover:text-slate-950 transition-colors">
              {t("nav_pricing")}
            </a>
            <Link href="/terms" className="hover:text-slate-950 transition-colors">
              Terms of Use
            </Link>
            <Link href="/privacy" className="hover:text-slate-950 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-slate-950 transition-colors">
              {t("nav_contact")}
            </Link>
          </div>
        </div>

        {/* Bottom copyright & contact */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} Eensell University. {t("footer_copyright")}</p>

          <div className="flex items-center gap-4">
            <span>
              {t("footer_support")}{" "}
              <a href="mailto:contact@eensell.com" className="font-semibold text-slate-700 hover:text-slate-950 transition-colors">
                contact@eensell.com
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
