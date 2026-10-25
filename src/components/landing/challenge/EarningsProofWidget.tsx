"use client";

import { motion } from "framer-motion";
import { Banknote, TrendingUp, Users, ArrowUpRight } from "lucide-react";
import Image from "next/image";

export function EarningsProofWidget() {
  return (
    <div className="mt-14 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#D6A15D] bg-[#D6A15D]/10 px-3.5 py-1.5 rounded-full border border-[#D6A15D]/20">
          Modèle d&apos;affaire wad7
        </span>
        <h3 className="text-2xl sm:text-3xl font-bold text-white mt-3">
          Hna ma kanbi3ouch l&apos;hdra. Kan9ado des Systemes li kayjibo l&apos;flous.
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Setup Fee Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/[0.08] bg-[#0A0D14] p-6 hover:border-emerald-500/30 transition-all group"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Banknote className="h-5 w-5" />
            </div>
            <span className="text-xs uppercase font-semibold text-zinc-400">Setup Fee (Khelsa l&apos;wla)</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-black text-white">4,000</span>
            <span className="text-lg font-bold text-emerald-400">Dh</span>
          </div>
          <p className="mt-2 text-xs text-[#A7AFBE] leading-relaxed">
            Katchedha kach fach katsayeb l&apos;système l&apos;client. Flousk 9bel tbda l&apos;khedma.
          </p>
          <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-1 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Clinique Dentaire</span>
              <span className="text-emerald-400 font-semibold">+4,000 Dh</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Agence Immo</span>
              <span className="text-emerald-400 font-semibold">+4,500 Dh</span>
            </div>
          </div>
        </motion.div>

        {/* Retainer Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/[0.08] bg-[#0A0D14] p-6 hover:border-emerald-500/30 transition-all group"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-xs uppercase font-semibold text-zinc-400">Retainer (Khelsa dima)</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-black text-white">400</span>
            <span className="text-lg font-bold text-emerald-400">Dh / ch&apos;her</span>
          </div>
          <p className="mt-2 text-xs text-[#A7AFBE] leading-relaxed">
            Flous dakhla kol ch&apos;her 7it l&apos;système khdam 24/7 w kayjib lihom les clients f lil w nhar.
          </p>
          <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-1 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Maintenance & hosting</span>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
              </span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>API Markup profit</span>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
              </span>
            </div>
          </div>
        </motion.div>

        {/* Community Proof Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/[0.08] bg-[#0A0D14] p-6 hover:border-[#D6A15D]/30 transition-all group"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-[#D6A15D]/10 border border-[#D6A15D]/20 text-[#D6A15D] flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-xs uppercase font-semibold text-zinc-400">Builders m3ana</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-black text-white">650</span>
            <span className="text-xl font-bold text-[#D6A15D]">+</span>
          </div>
          <p className="mt-2 text-xs text-[#A7AFBE] leading-relaxed">
            Drari f l&apos;groupe kaytebb9ou hadchi w kayjibo clients. Ma katb9ach bo7dek m7assar.
          </p>
          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
            <span>Environnement &gt; Willpower</span>
            <span className="text-[#D6A15D] font-bold">24/7 Active</span>
          </div>
        </motion.div>
      </div>

      {/* Builder Proof Image Showcase from Old ProofSection */}
      <div className="mt-8 rounded-3xl border border-white/[0.08] bg-[#0A0D14] overflow-hidden flex flex-col md:flex-row items-center">
        <div className="relative w-full md:w-5/12 h-64 md:h-80">
          <Image
            src="/proof-builder-v2.jpg"
            alt="Builder kaykhdem f Eensell University"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
        <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-400 font-bold">
            <ArrowUpRight className="h-4 w-4" />
            Objectif 60 Youm
          </div>
          <h4 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Men tatbiq l&apos;awel virement f compte CIH dyalk.
          </h4>
          <p className="text-xs sm:text-sm text-[#A7AFBE] mt-2 leading-relaxed">
            Koulchi f had l&apos;programme mhndes 3la hadaf wa7ed: ma tb9ach mzyyer f blastek, t3lem skill ma3roufa f sou9, w twelli tbi3 des services li 3ndhom qima 7a9iqiya.
          </p>
        </div>
      </div>
    </div>
  );
}
