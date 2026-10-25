"use client";

import { motion } from "framer-motion";
import { MessageSquare, Users, Video, Target } from "lucide-react";
import Image from "next/image";

export function LiveCommunityWidget() {
  return (
    <div className="mt-16 rounded-3xl border border-white/[0.08] bg-[#0A0D14] p-6 sm:p-10 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#D6A15D]/[0.05] blur-[120px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Copy side */}
        <div className="lg:col-span-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6A15D]/10 border border-[#D6A15D]/20 text-xs font-bold uppercase tracking-wider text-[#D6A15D] mb-4">
            <Users className="h-3.5 w-3.5" />
            Environnement &gt; Willpower
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            Ma ghadich tbni bo7dek. <br />
            <span className="text-[#D6A15D]">L&apos;groupe ghadi ijerek bzez.</span>
          </h3>

          <p className="mt-4 text-xs sm:text-sm text-[#A7AFBE] leading-relaxed">
            Katbda chi 7aja w makatkmlhach? Normal, 7it nta bo7dek. Hna, ghadi tkoun m3a drari li kaysehro 7ta l&apos;lil kay9ado des Systemes. Mnin katchoufhom kayjibo des clients, ghatbzez 3la rassek tkhdem.
          </p>

          <div className="mt-6 space-y-3.5 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#D6A15D] shrink-0">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <strong className="text-white block font-semibold">Discord & WhatsApp 24/7</strong>
                <span className="text-[#A7AFBE]">Accès direct l network dial drari li 7ar9in l&apos;mra7il.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#477CFF] shrink-0">
                <Video className="h-4 w-4" />
              </div>
              <div>
                <strong className="text-white block font-semibold">Live Troubleshooting Calls</strong>
                <span className="text-[#A7AFBE]">Kan7ello l&apos;mouchkil dialek live f screen share.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-emerald-400 shrink-0">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <strong className="text-white block font-semibold">Accountability (L&apos;M7assba)</strong>
                <span className="text-[#A7AFBE]">Kol simana khassek tbe3 l&apos;objectif bla t3gaz.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Chat Simulation Box */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl border border-white/[0.08] bg-[#05080D] shadow-2xl overflow-hidden max-w-md mx-auto">
            {/* Header */}
            <div className="bg-[#121620] px-4 py-3 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-1.5">
                  <div className="w-7 h-7 rounded-full bg-[#D6A15D] flex items-center justify-center text-[10px] font-bold text-black border-2 border-[#121620]">EU</div>
                  <div className="w-7 h-7 rounded-full bg-[#477CFF] flex items-center justify-center text-[10px] font-bold text-white border-2 border-[#121620]">650+</div>
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs sm:text-sm">60-Day Challenge Builders</h4>
                  <p className="text-emerald-400 text-[11px] flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> 24 builders en ligne
                  </p>
                </div>
              </div>
            </div>

            {/* Chat messages stream */}
            <div className="p-4 space-y-3.5 text-xs">
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-[11px] font-bold text-white shrink-0">O</div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[#D6A15D] font-bold">Oussama</span>
                    <span className="text-zinc-600 text-[10px]">01:42</span>
                  </div>
                  <div className="bg-[#121620] border border-white/[0.06] text-zinc-300 rounded-2xl rounded-tl-none px-3.5 py-2 mt-1">
                    Drari, salit l&apos;automation dial dental clinic m3a Google Calendar! Khedama 100%!
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-[11px] font-bold text-white shrink-0">A</div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[#477CFF] font-bold">Amine</span>
                    <span className="text-zinc-600 text-[10px]">01:48</span>
                  </div>
                  <div className="bg-[#121620] border border-white/[0.06] text-zinc-300 rounded-2xl rounded-tl-none px-3.5 py-2 mt-1">
                    Nadi a khay 🔥 Ana yalah sift 20 cold messages l agences immo lyoma.
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 flex-row-reverse">
                <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">Y</div>
                <div className="flex flex-col items-end">
                  <div className="flex items-baseline gap-2">
                    <span className="text-zinc-600 text-[10px]">02:10</span>
                    <span className="text-emerald-400 font-bold">You (Talib)</span>
                  </div>
                  <div className="bg-emerald-600/30 border border-emerald-500/40 text-white rounded-2xl rounded-tr-none px-3.5 py-2 mt-1">
                    L&apos;client jawbni f WhatsApp! Bgha demo gheda f Google Meet!! 🚀
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
