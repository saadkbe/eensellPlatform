"use client";

import { motion } from "framer-motion";
import { MessageSquareX, Stethoscope, Building2, ArrowRight, X } from "lucide-react";

export function DemandSection() {
  return (
    <section className="relative w-full bg-[#0a0a0a] py-16 md:py-24 overflow-hidden flex flex-col items-center">
      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-4xl text-center">
        
        {/* Big Impact Statement full width */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#171717] to-[#1a1a1a] border border-[#262626] p-6 sm:p-8 md:p-12 shadow-2xl"
        >
          {/* Background Glow - strictly contained */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-sm bg-orange-500/5 blur-[80px] rounded-full pointer-events-none" />

          {/* Gradient accent */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

          <div className="flex flex-col items-center">
            {/* Header Area */}
            <div className="relative z-10 flex flex-col items-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
                <TrendingUpIcon className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-medium text-orange-400">Immense Demand</span>
              </div>
              
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight tracking-tight">
                Les entreprises <span className="text-orange-500">3ndhom Rass lmal</span>, w hna fin ghatdkhel nta.
              </h3>
              
              <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl">
                Cliniques dial snane w agents immobiliers kaykhassrou des clients kol nhar hit 7ta wa7ed ma kayjaweb 3la messages WhatsApp f 11 d lil. Hadchi kaydir lihom machakil kbira f l&apos;mdakhol.
              </p>
            </div>

            {/* Mockups Container */}
            <div className="relative z-10 w-full max-w-md mx-auto flex flex-col gap-4">
              
              {/* Message 1 */}
              <div
                className="flex items-start gap-3 sm:gap-4 p-4 rounded-2xl bg-[#0a0a0a] border border-[#262626] shadow-lg text-left"
              >
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <MessageSquareX className="w-5 h-5 sm:w-6 sm:h-6 text-green-500/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                    <span className="text-sm font-bold text-white">Patient jdid</span>
                    <span className="text-xs font-semibold text-red-400 flex items-center gap-1 bg-red-500/10 px-2 py-0.5 rounded-full">
                      <X className="w-3 h-3" /> Missed
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 truncate">&ldquo;Bghit nakhod rdv m3a docteur...&rdquo;</p>
                  <p className="text-xs text-zinc-500 mt-2 font-medium">22:47 7ta jawab ma kayn</p>
                </div>
              </div>

              {/* Message 2 */}
              <div
                className="flex items-start gap-3 sm:gap-4 p-4 rounded-2xl bg-[#0a0a0a] border border-[#262626] shadow-lg text-left"
              >
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                    <span className="text-sm font-bold text-white">Ziyara dial dar</span>
                    <span className="text-xs font-semibold text-red-400 flex items-center gap-1 bg-red-500/10 px-2 py-0.5 rounded-full">
                      <X className="w-3 h-3" /> Missed
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 truncate">&ldquo;3endi budget 800K, bghit nchri...&rdquo;</p>
                  <p className="text-xs text-zinc-500 mt-2 font-medium">21:05 Deal dyal 800K tay7</p>
                </div>
              </div>

              {/* Counter badge */}
              <div
                className="flex items-center justify-center py-2 mt-2 w-full"
              >
                <span className="text-xs sm:text-sm font-bold text-red-400 px-4 py-2 sm:py-1.5 rounded-xl sm:rounded-full bg-red-500/10 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)] text-center w-full sm:w-auto">
                  +37 message bla jawab had simana
                </span>
              </div>
            </div>

            {/* Bottom Insight */}
            <div
              className="relative z-10 mt-10 p-4 rounded-xl bg-[#0a0a0a]/50 border border-[#262626] backdrop-blur-sm max-w-2xl text-left"
            >
              <p className="text-sm sm:text-base text-white font-medium flex gap-3 items-start">
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                <span>
                  Ghadi tat3lem tbni l&apos;système automatisé li Kay7el had l&apos;mochkil, w charikat <span className="text-orange-500 font-bold">ghadi ikhellssouk 4,000 Dh</span> aw ktr 3lih.
                </span>
              </p>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TrendingUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
