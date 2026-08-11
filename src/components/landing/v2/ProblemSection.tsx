"use client";

import { motion } from "framer-motion";
import { Save, X, ArrowRight, AlertTriangle } from "lucide-react";
import Image from "next/image";

export function ProblemSection() {
  return (
    <section className="relative w-full bg-[#0a0a0a] py-24 md:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[200vw] max-w-[800px] h-[600px] bg-red-500/[0.04] blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-5xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-red-400 tracking-wide">Reality Check</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Katchouf nass khdama o kadkhel Floss...<br className="hidden md:block" />
            <span className="text-zinc-500">walakin l&apos;compte bancaire mazal fih </span>
            <span className="text-red-500">0 Dh.</span>
          </h2>
          <p className="mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            L&apos;mouchkil machi 7it nta makat3refch l&apos;IA. L&apos;mouchkil howa katl3eb f terrain ghalat.
          </p>
        </motion.div>

        {/* Pain Point Cards 2 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Consuming, not building */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative rounded-2xl bg-[#171717] border border-[#262626] overflow-hidden hover:border-red-500/30 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[60px] rounded-full pointer-events-none" />
            <div className="relative w-full h-48 sm:h-56 mb-6 overflow-hidden border-b border-[#262626]">
              <Image 
                src="/images/sad_thumbnail.jpg" 
                alt="Consuming tutorials without results" 
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col p-8 pt-0">
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Kat-consomi, ma kat-bnich walou.</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Video YouTube kol nhar. Prompt template msajla. Thread m7fouda. 
                  Dossier dyal &ldquo;AI&rdquo; 3amr, walakin jiybek mazal{" "}
                  <span className="text-red-400 font-semibold">khawi</span>. Kat7ess b rassek bloqué 7it ghir katjemme3 f l&apos;ma3loumat.
                </p>
              </div>
            {/* Visual: scrolling feed mockup */}
            <div className="mt-6 flex flex-wrap gap-2">
              {["Tuto #47", "Prompt Pack", "Cours Gratuit", "AI Hack"].map((label, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#262626] text-xs text-zinc-500 border border-[#333]"
                >
                  <Save className="w-3 h-3" />
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
            className="group relative rounded-2xl bg-[#171717] border border-[#262626] overflow-hidden hover:border-orange-500/30 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-[60px] rounded-full pointer-events-none" />
            <div className="relative w-full h-48 sm:h-56 mb-6 overflow-hidden border-b border-[#262626]">
              <Image 
                src="/images/confident_thumbnail_cinematic.jpg" 
                alt="Building systems and getting paid" 
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col p-8 pt-0">
              <div>
                <h3 className="text-xl font-bold text-white mb-3">
                  L&apos;marché ma kaykhelessekch 7it <em className="not-italic text-zinc-500">kat3ref</em> tkhdem b ChatGPT.
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Kaykhelssek bach t7ell{" "}
                  <span className="text-orange-500 font-semibold">machakil ghalya dial les business</span>. 
                  T3ref tekteb prompts machi skill. T9ad des Systemes automatisés li Kaydekhlo l&apos;flous l charikat, hadchi howa l&apos;skill li kaytba3.
                </p>
              </div>
            {/* Visual: equation */}
            <div className="mt-6 flex items-center flex-wrap gap-2 md:gap-3 text-sm">
              <span className="px-3 py-1.5 rounded-lg bg-[#262626] text-zinc-500 border border-[#333] line-through whitespace-nowrap">
                Tkteb les prompts
              </span>
              <X className="w-4 h-4 text-red-500/60" />
              <span className="px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 font-medium whitespace-nowrap">
                T9ad Systemes Automatisés
              </span>
              <ArrowRight className="w-4 h-4 text-orange-500/60 hidden sm:block" />
              <span className="px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 font-medium whitespace-nowrap mt-2 sm:mt-0">
                💰 Dkhel L&apos;Flous
              </span>
            </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
