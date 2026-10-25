"use client";

import { motion } from "framer-motion";
import { PlayCircle, CheckCircle, Shield, Sparkles } from "lucide-react";
import { CHALLENGE_OFFER, CHALLENGE_PRICE_LABEL } from "@/data/challenge-offer";
import { FounderVideo } from "./FounderVideo";
import { EnrollButton, focusRing } from "./primitives";

export function ChallengeHero() {
  return (
    <section aria-labelledby="hero-title" className="relative px-4 pb-20 pt-28 sm:px-6 sm:pb-28 sm:pt-36">
      {/* Environmental lighting directly behind hero */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[550px] w-[900px] rounded-full bg-[#D6A15D]/[0.12] blur-[160px]" />
        <div className="absolute top-10 right-[5%] h-[450px] w-[500px] rounded-full bg-[#477CFF]/[0.10] blur-[160px]" />
        <div className="absolute top-64 left-[5%] h-[450px] w-[500px] rounded-full bg-[#D6A15D]/[0.08] blur-[160px]" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* Announcement pill with subtle amber glow */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#D6A15D]/30 bg-[#D6A15D]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#D6A15D] shadow-[0_0_20px_rgba(214,161,93,0.15)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D6A15D] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D6A15D]" />
            </span>
            YOUR NEXT 60 DAYS START HERE · BDA DABA
          </motion.div>

          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-7 text-balance text-[38px] font-black leading-[1.08] tracking-tight text-[#F7F8FA] sm:text-5xl lg:text-[66px]"
          >
            Baraka ma tconsomi f les tutos.{" "}
            <span className="bg-gradient-to-r from-[#F1D3A6] via-[#D6A15D] to-[#E59835] bg-clip-text text-transparent">
              Bda tbni service d&apos;IA li kaytba3.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-[#A7AFBE] sm:text-lg"
          >
            Copier l&apos;blueprint exact li kankhdem bih bach t9ad des réceptionnistes IA w automations l les business locaux, w tkhdem 3la awel client dyalk — wakha ma 3mrek ktebti ster d l&apos;code.
          </motion.p>
        </div>

        {/* Founder Video Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mx-auto mt-10 max-w-4xl sm:mt-12"
        >
          <FounderVideo />
        </motion.div>

        {/* Primary CTA Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-col items-center text-center"
        >
          <div className="relative">
            {/* Ambient pulse effect behind CTA */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#D6A15D] to-[#477CFF] opacity-35 blur-xl animate-pulse" />
            <EnrollButton trackingId="hero" className="relative shadow-[0_10px_40px_-5px_rgba(214,161,93,0.5)]">
              Bda Challenge dyalk daba — {CHALLENGE_PRICE_LABEL}
            </EnrollButton>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-[#A7AFBE]">
            <span className="flex items-center gap-1.5 text-[#F7F8FA]">
              <CheckCircle className="h-4 w-4 text-[#D6A15D]" /> Khlas wa7ed, bla abonnement
            </span>
            <span aria-hidden="true">&bull;</span>
            <span className="flex items-center gap-1.5 text-[#F7F8FA]">
              <Sparkles className="h-4 w-4 text-[#477CFF]" /> Workflows Make.com wajdin
            </span>
            <span aria-hidden="true">&bull;</span>
            <span className="flex items-center gap-1.5 text-[#F7F8FA]">
              <Shield className="h-4 w-4 text-emerald-400" /> Support f l&apos;groupe
            </span>
          </div>
        </motion.div>

        {/* Authentic Verifiable Social Proof Bar */}
        <div className="mx-auto mt-12 flex max-w-2xl flex-col items-center justify-between gap-4 border-t border-white/[0.08] pt-8 text-sm text-[#A7AFBE] sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["S", "A", "M", "Y", "K"].map((initial, i) => (
                <div
                  key={i}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#05080D] text-xs font-bold text-white shadow-md"
                  style={{
                    background: [
                      "linear-gradient(135deg, #D6A15D, #9E6B2A)",
                      "linear-gradient(135deg, #477CFF, #1D4ED8)",
                      "linear-gradient(135deg, #10B981, #047857)",
                      "linear-gradient(135deg, #F59E0B, #B45309)",
                      "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                    ][i],
                  }}
                >
                  {initial}
                </div>
              ))}
            </div>
            <span>
              <strong className="text-white">{CHALLENGE_OFFER.activeStudentsDisplay} builders</strong> m3ana kaytb9o f Eensell
            </span>
          </div>

          <a
            href="#feedback"
            className={`inline-flex items-center gap-2 rounded text-xs font-medium text-[#D6A15D] transition-colors hover:text-white ${focusRing}`}
          >
            <PlayCircle aria-hidden="true" className="h-4 w-4" />
            Sme3 l&apos;feedback dyal drari
          </a>
        </div>
      </div>
    </section>
  );
}
