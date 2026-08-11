"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Camera, Sparkles, TrendingUp, DollarSign } from "lucide-react";

export function UgcSection() {
  return (
    <section className="relative w-full bg-[#0a0a0a] py-24 overflow-hidden border-t border-[#262626]">
      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
              <Camera className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-orange-400">AI UGC Creation</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
              Tsayeb UGC 100% wa9i3i b l&apos;IA w <span className="text-orange-500">bi3o b taman ghali.</span>
            </h2>
            
            <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
              Les marques kaykhellsou zbel d l&apos;flous 3la les vidéos w tsawer UGC l les Ads dialhom. Ghadi tat3lem kifach t&apos;générer des modèles marocaines (dark features) b l&apos;IA, kaybanou b7al ila tsowro b l&apos;iPhone. 0 photoshoot, 0 mannequins.
            </p>

            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#171717] border border-[#262626] flex items-center justify-center mt-1">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Qualité d&apos;image iPhone</h4>
                  <p className="text-sm text-zinc-500">Des prompts exacts bach tjiib dik l&apos;grain w l&apos;éclairage naturel dial l&apos;iPhone.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#171717] border border-[#262626] flex items-center justify-center mt-1">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Profils 100% Marocains</h4>
                  <p className="text-sm text-zinc-500">Tsayeb des personnages b mlam7 mgharba (olive skin, dark features) li kayti9o fihom les clients.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#171717] border border-[#262626] flex items-center justify-center mt-1">
                  <DollarSign className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">High-Ticket Service</h4>
                  <p className="text-sm text-zinc-500">Les e-commerçants msta3din ikhelsou ktr men 5,000 Dh 3la pack dial les UGC.</p>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* Right: Images Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] aspect-square bg-orange-500/10 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="relative w-full max-w-md">
              {/* Image 1 (Skincare) */}
              <div className="relative z-10 rounded-2xl overflow-hidden border-4 border-[#171717] shadow-2xl transform rotate-[-4deg] w-[70%] ml-auto">
                <div className="relative aspect-[4/5] w-full">
                  <Image 
                    src="/ugc-skincare.jpg" 
                    alt="AI UGC Skincare"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* TikTok UI Overlay */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent">
                    <div className="absolute bottom-4 left-4 right-16">
                      <p className="text-white font-bold text-sm drop-shadow-md">@glow_maroc</p>
                      <p className="text-white text-xs mt-1 drop-shadow-md line-clamp-2">Had le sérum bedel lia wjhi f simana w7da ✨ #skincare #maroc</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image 2 (Coffee/Tech) */}
              <div className="relative z-20 rounded-2xl overflow-hidden border-4 border-[#171717] shadow-2xl transform rotate-[6deg] w-[70%] -mt-32">
                <div className="relative aspect-[4/5] w-full">
                  <Image 
                    src="/ugc-coffee.jpg" 
                    alt="AI UGC Coffee"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Insta UI Overlay */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent">
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full border border-white/50 overflow-hidden relative">
                         <Image src="/ugc-coffee.jpg" alt="avatar" fill className="object-cover" />
                      </div>
                      <p className="text-white font-bold text-xs drop-shadow-md">aesthetic.casa</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badge */}
              <div className="absolute top-1/2 left-0 -translate-y-1/2 z-30 transform -rotate-12">
                <div className="bg-orange-500 text-white font-black text-sm px-4 py-2 rounded-xl shadow-xl flex flex-col items-center border-2 border-[#171717]">
                  <span>100%</span>
                  <span className="uppercase text-[10px] opacity-90">Généré b l&apos;IA</span>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
