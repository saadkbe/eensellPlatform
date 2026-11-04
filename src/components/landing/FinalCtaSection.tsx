"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Key,
  Star,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/landing/LanguageProvider";

export function FinalCtaSection() {
  const { dir } = useLanguage();

  return (
    <section
      dir={dir}
      className="relative py-24 sm:py-36 bg-white text-slate-900 overflow-hidden border-t border-slate-200/70"
    >
      {/* ── Web3 Luminous Ambient Aura ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-gradient-to-tr from-indigo-100/40 via-violet-50/30 to-emerald-50/30 rounded-full blur-[140px] pointer-events-none" />

      <div className="container max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center flex flex-col items-center">
        {/* Luminous Web3 Box */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative w-full rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-14 lg:p-16 bg-gradient-to-b from-white to-slate-50 border border-slate-200/90 shadow-[0_20px_70px_-15px_rgba(15,23,42,0.08)] flex flex-col items-center text-center overflow-hidden"
        >
          {/* Top ambient highlight line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-[#FF6B4A] to-emerald-500" />

          {/* Web3 Announcement Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-bold text-slate-800 tracking-wide uppercase mb-6">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>FOUNDING COHORT ENROLLMENT &bull; INSTANT ACCESS</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.15] mb-6 max-w-3xl text-balance">
            Your Autonomous AI Agency{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-indigo-900 to-[#FF6B4A]">
              Starts Right Now.
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto mb-10 leading-relaxed text-balance">
            Stop waiting for the &ldquo;perfect moment.&rdquo; Over 350 Moroccan agency founders are already using the Workspace to extract leads, launch Darija WhatsApp pitches, and close 15,000 MAD retainers.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xl mx-auto mb-10">
            <Link href="/sign-up" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-13 px-9 text-sm sm:text-base font-bold bg-slate-950 hover:bg-slate-900 text-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.18)] transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4 rtl:ml-1 ltr:mr-1" />
                <span>Get Immediate Access &bull; 200 MAD</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Button>
            </Link>

            <a
              href="https://wa.me/212666065608?text=Bonjour%20Saad,%20j'aimerais%20en%20savoir%20plus%20sur%20Eensell%20University"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-13 px-8 text-sm sm:text-base font-bold bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-2xs rounded-2xl transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp VIP Advisory</span>
              </Button>
            </a>
          </div>

          {/* Trust points */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-semibold text-slate-500 pt-4 border-t border-slate-100 w-full">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Full 2-Month Membership</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Instant Discord & Workspace Onboarding</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>2 Live Zoom Deal Rooms Per Week</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
