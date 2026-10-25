"use client";

import { motion } from "framer-motion";
import { MessageSquareX, Building2, ArrowRight, X, TrendingUp, CheckCircle2 } from "lucide-react";
import { Eyebrow, SectionHeading } from "./primitives";

export function OpportunitySection() {
  return (
    <section id="opportunity" className="relative px-5 py-20 sm:px-6 sm:py-28 border-t border-white/[0.05]">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Forssa dyal bessa7"
          title={
            <>
              Les entreprises <span className="text-[#D6A15D]">3ndhom rass l&apos;mal</span>, w hna fin ghatdkhel nta.
            </>
          }
          intro="Cliniques dial snane w agents immobiliers kaykhassrou des clients kol nhar 7it 7ta wa7ed ma kayjaweb 3la messages WhatsApp f lil. Hadchi kaydir lihom khssara f l'mdakhol."
        />

        {/* 2-Column interactive demonstration widget */}
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          
          {/* Left: The real Problem happening right now */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 flex flex-col gap-4"
          >
            <div className="rounded-2xl border border-red-500/20 bg-[#0A0D14] p-5 shadow-lg">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-white/[0.06] mb-3">
                <span className="font-semibold text-red-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                  Mochkil #1: Cabinet Dentaire
                </span>
                <span className="text-zinc-500">22:47</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
                  <MessageSquareX className="h-5 w-5" />
                </div>
                <div className="flex-1 text-xs sm:text-sm">
                  <p className="font-semibold text-white">Patient jdid: &ldquo;Bghit nakhod rdv m3a docteur urgent...&rdquo;</p>
                  <p className="mt-1 text-red-400/90 text-xs">7ta jawab ma kayn. L&apos;patient mcha 3nd clinique khra. (Khssara: ~1,500 Dh)</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-red-500/20 bg-[#0A0D14] p-5 shadow-lg">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-white/[0.06] mb-3">
                <span className="font-semibold text-red-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                  Mochkil #2: Agence Immobilière
                </span>
                <span className="text-zinc-500">21:05</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="flex-1 text-xs sm:text-sm">
                  <p className="font-semibold text-white">Acheteur: &ldquo;3endi budget 850K, bghit nchouf l&apos;appartement f Maarif...&rdquo;</p>
                  <p className="mt-1 text-red-400/90 text-xs">Makaynch li yjaweb. Deal dyal commission 25,000 Dh tay7.</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-center">
              <p className="text-xs sm:text-sm font-bold text-red-400">
                +37 message bla jawab kol simana f ay business katsowlo!
              </p>
            </div>
          </motion.div>

          {/* Right: The AI Solution you build and get paid 4,000 Dh for */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-6"
          >
            <div className="rounded-3xl border border-[#D6A15D]/40 bg-[#0A0D14] p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D6A15D]/10 blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Système Kheddam 24/7
                  </span>
                </div>
                <span className="text-xs font-mono text-[#D6A15D] bg-[#D6A15D]/10 px-2.5 py-1 rounded-full border border-[#D6A15D]/20">
                  Make.com + WhatsApp API
                </span>
              </div>

              {/* Chat Simulation */}
              <div className="mt-5 space-y-3 text-xs sm:text-sm">
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-white/[0.06] p-3 text-[#F7F8FA]">
                    <p className="text-[10px] text-zinc-500 mb-0.5">22:47 · Patient</p>
                    Salam, bghit ndir détartrage gheda m3a 16h wash momkin?
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-[#D6A15D]/15 border border-[#D6A15D]/30 p-3 text-white">
                    <p className="text-[10px] text-[#D6A15D] mb-0.5 font-bold">22:47 · Réceptionniste IA</p>
                    Salam! Merhba bik f Cabinet Dr. Bennani 🦷 Ah momkin, 16h kayna blassa khawya. 3tini ghir smitk l&apos;kamla bach nssjel lik l&apos;RDV daba direct.
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-white/[0.06] p-3 text-[#F7F8FA]">
                    Karim Alami, numéro 0661...
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-emerald-500/15 border border-emerald-500/30 p-3 text-white">
                    <p className="flex items-center gap-1.5 font-bold text-emerald-400 text-xs">
                      <CheckCircle2 className="h-4 w-4" /> RDV Confirmed f Google Calendar
                    </p>
                    <p className="text-xs text-zinc-300 mt-1">
                      Tssjel f l&apos;agenda, w tssift SMS de rappel automatique.
                    </p>
                  </div>
                </div>
              </div>

              {/* The Business Value */}
              <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs">
                <span className="text-[#A7AFBE]">Khelsa dyalk 3la had l&apos;installation:</span>
                <span className="font-extrabold text-emerald-400 text-sm sm:text-base">
                  4,000 Dh Setup + 400 Dh/ch&apos;her
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Concluding Insight */}
        <div className="mt-10 p-5 rounded-2xl bg-[#0A0D14] border border-white/[0.08] text-center">
          <p className="text-sm sm:text-base text-white">
            <strong className="text-[#D6A15D]">F l&apos;Challenge:</strong> Ghadi tat3lem tbni had l&apos;système exact, t-téléchargi l&apos;fichier JSON dial Make.com li kankhdem bih, w tbi3o l les business locaux.
          </p>
        </div>
      </div>
    </section>
  );
}
