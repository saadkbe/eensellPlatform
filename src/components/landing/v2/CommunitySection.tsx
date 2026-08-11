"use client";

import { motion } from "framer-motion";
import { Users, MessagesSquare, Zap, Target } from "lucide-react";

export function CommunitySection() {
  return (
    <section id="community" className="relative w-full bg-[#0a0a0a] py-24 overflow-hidden border-t border-[#262626]">
      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
              <Users className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-orange-400">Environment &gt; Willpower</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
              Ma ghadich tbni bo7dek.<br />
              L&apos;groupe ghadi <span className="text-orange-500">ijerek bzez.</span>
            </h2>
            
            <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
              Katbda chi haja w makatkmlhach? Normal, hit nta bo7dek. Hna, ghadi tkoun m3a drari li kaysehro hta l 3 d sba7 kay9ado des Systemes. Mnin katchoufhom kayjibo des clients, ghatbzez 3la rassek tkhdem.
            </p>

            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#171717] border border-[#262626] flex items-center justify-center mt-1">
                  <MessagesSquare className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">WhatsApp & Discord 24/7</h4>
                  <p className="text-sm text-zinc-500">Accès direct l network dial drari li 7ar9in l'mra7il w kaysaybo l'flous.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#171717] border border-[#262626] flex items-center justify-center mt-1">
                  <Zap className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Live Troubleshooting Calls</h4>
                  <p className="text-sm text-zinc-500">2 marrat f simana, kan7ello l'mouchkil dialek live f screen share.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#171717] border border-[#262626] flex items-center justify-center mt-1">
                  <Target className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Accountability (L'M7assba)</h4>
                  <p className="text-sm text-zinc-500">Ma ghadich nkhaliwek t3gez. Kol simana khassek tbe3 l'objectif.</p>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* Right: Chat UI Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-orange-500/10 blur-[80px] rounded-full" />
            <div className="relative rounded-2xl bg-[#0a0a0a] border border-[#262626] shadow-2xl overflow-hidden max-w-md mx-auto">
              {/* Header */}
              <div className="bg-[#171717] px-4 py-3 border-b border-[#262626] flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold text-white border-2 border-[#171717]">EU</div>
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white border-2 border-[#171717]">75+</div>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">60-Day Challenge Builders</h3>
                  <p className="text-green-400 text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> 18 online
                  </p>
                </div>
              </div>
              
              {/* Messages */}
              <div className="p-4 space-y-4 h-[350px] overflow-hidden flex flex-col justify-end bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-5">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center text-xs text-white">O</div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-orange-400 font-bold text-sm">Oussama</span>
                      <span className="text-zinc-600 text-xs">02:14 AM</span>
                    </div>
                    <div className="bg-[#171717] border border-[#262626] text-zinc-300 rounded-2xl rounded-tl-none px-4 py-2 mt-1 text-sm">
                      Drari, salit l'automation dial dental clinic!
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center text-xs text-white">A</div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-blue-400 font-bold text-sm">Amine</span>
                      <span className="text-zinc-600 text-xs">02:16 AM</span>
                    </div>
                    <div className="bg-[#171717] border border-[#262626] text-zinc-300 rounded-2xl rounded-tl-none px-4 py-2 mt-1 text-sm">
                      Nadi a sat 🔥 Ana yalah sift 20 cold emails l youma.
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-orange-600 flex-shrink-0 flex items-center justify-center text-xs text-white">Y</div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-baseline gap-2">
                      <span className="text-zinc-600 text-xs">02:20 AM</span>
                      <span className="text-white font-bold text-sm">You</span>
                    </div>
                    <div className="bg-orange-600 text-white rounded-2xl rounded-tr-none px-4 py-2 mt-1 text-sm shadow-[0_0_15px_rgba(234,88,12,0.3)]">
                      L&apos;client jawbni! Bgha idir appel gheda m3a 10!! 🚀
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
