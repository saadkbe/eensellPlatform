"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Save, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Eyebrow, SectionHeading } from "./primitives";

export function ProblemSection() {
  return (
    <section id="problem" className="relative px-5 py-20 sm:px-6 sm:py-28">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] max-w-[700px] h-[500px] bg-red-500/[0.03] blur-[150px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-5xl relative z-10">
        <SectionHeading
          eyebrow="Reality Check"
          title={
            <>
              Katchouf nass khdama o kadkhel l&apos;flous...<br className="hidden md:block" />
              <span className="text-zinc-500">walakin l&apos;compte bancaire mazal fih </span>
              <span className="text-red-500 font-black">0 Dh.</span>
            </>
          }
          intro="L'mouchkil machi 7it nta makat3refch l'IA. L'mouchkil howa katl3eb f terrain ghalat: kat-consomi bla ma tbni."
        />

        {/* 2 Comparison Cards with real images from old landing */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Consuming, not building */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative rounded-3xl bg-[#0A0D14] border border-white/[0.08] overflow-hidden hover:border-red-500/30 transition-all duration-300"
          >
            <div className="relative w-full h-52 sm:h-60 overflow-hidden border-b border-white/[0.06]">
              <Image 
                src="/images/sad_thumbnail.jpg" 
                alt="Kat-consomi bla natija" 
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute top-4 left-4 rounded-full bg-red-500/20 border border-red-500/40 px-3 py-1 text-xs font-bold text-red-400 backdrop-blur-md">
                Ghalat #1
              </div>
            </div>

            <div className="p-7">
              <h3 className="text-xl font-bold text-white mb-3">Kat-consomi, ma kat-bnich walou.</h3>
              <p className="text-[#A7AFBE] leading-relaxed text-sm">
                Vidéo YouTube kol nhar. Prompt template msjjla. Dossier dyal &ldquo;AI&rdquo; 3amr, walakin jiybek mazal <strong className="text-red-400">khawi</strong>. Kat7ess b rassek bloqué 7it ghir katjemme3 f l&apos;ma3loumat bla tatbiq.
              </p>

              {/* Feed simulation mockup */}
              <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-white/[0.06]">
                {["Tuto #47", "Prompt Pack", "Cours Gratuit", "AI Hack"].map((label, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] text-xs text-zinc-500 border border-white/[0.06]"
                  >
                    <Save className="w-3 h-3 text-red-400/70" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 2: Knowing ≠ Earning */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group relative rounded-3xl bg-[#0A0D14] border border-white/[0.08] overflow-hidden hover:border-[#D6A15D]/40 transition-all duration-300"
          >
            <div className="relative w-full h-52 sm:h-60 overflow-hidden border-b border-white/[0.06]">
              <Image 
                src="/images/confident_thumbnail_cinematic.jpg" 
                alt="Tbni systeme kheddam" 
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute top-4 left-4 rounded-full bg-[#D6A15D]/20 border border-[#D6A15D]/40 px-3 py-1 text-xs font-bold text-[#D6A15D] backdrop-blur-md">
                L&apos;7ell dyal Eensell
              </div>
            </div>

            <div className="p-7">
              <h3 className="text-xl font-bold text-white mb-3">L&apos;marché ma kaykhelessekch 7it kat3ref ChatGPT.</h3>
              <p className="text-[#A7AFBE] leading-relaxed text-sm">
                Kaykhelssek bach t7ell <strong className="text-[#D6A15D]">machakil ghalya dial les business</strong>. Tkteb prompts machi skill li kaytba3. T9ad des Systemes automatisés li Kaydekhlo l&apos;flous l charikat, hadchi howa l&apos;khedma li katkhles.
              </p>

              {/* Equation widget */}
              <div className="mt-6 flex items-center justify-between gap-2 p-3 rounded-2xl bg-[#D6A15D]/10 border border-[#D6A15D]/20 text-xs sm:text-sm font-semibold text-white">
                <span className="text-zinc-400">Make.com + AI Agent</span>
                <span className="text-[#D6A15D]">&rarr;</span>
                <span className="text-emerald-400">4,000 Dh Setup Fee</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Transition callout */}
        <div className="mt-12 rounded-3xl border border-white/[0.08] bg-gradient-to-r from-[#D6A15D]/10 via-[#0A0D14] to-[#477CFF]/10 p-8 sm:p-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl">
              <Eyebrow tone="amber">Dakchi lach 9addina Challenge 60 Youm</Eyebrow>
              <h3 className="text-2xl font-bold text-white">
                Mn nhar l&apos;wel: Katbni, kat-testi, w katzid l&apos;9dam.
              </h3>
              <p className="mt-2 text-sm text-[#A7AFBE] leading-relaxed">
                Machi cours tfrrej fih w tnsah. Ghadi tkhdem over-the-shoulder m3aya f Make.com, tcopier les workflows, w ttbbaq step-by-step.
              </p>
            </div>
            <a
              href="#pricing"
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#D6A15D] px-6 py-3 text-sm font-bold text-black hover:bg-[#E59835] transition-colors"
            >
              Chouf l&apos;offre <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
