"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Users, Banknote, TrendingUp, Zap, Shield, ArrowUpRight } from "lucide-react";

export function ProofSection() {
  return (
    <section className="bg-[#0a0a0a] py-24 sm:py-32 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] max-w-[600px] aspect-video bg-green-500/[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 mb-6"
          >
            <Zap className="w-3.5 h-3.5 text-green-400" />
            <span className="text-sm font-medium text-green-400">Making Money Now</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Hna ma kanbi3ouch l&apos;hdra.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-lg leading-8 text-zinc-400"
          >
            Kan9ado des Systemes li Kaydekhlo <span className="text-green-500 font-semibold">l&apos;flous</span> l jiybek nhar lwel.
          </motion.p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Card 1: Setup Fee */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group relative flex flex-col rounded-2xl border border-[#262626] bg-[#171717] p-8 transition-all duration-300 hover:border-green-500/30 hover:shadow-[0_0_40px_rgba(34,197,94,0.08)] overflow-hidden"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-green-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 transition-all group-hover:bg-green-500/20 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                <Banknote className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Setup Fee (L&apos;khelsa l&apos;wla)</span>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-5xl font-black tracking-tight text-white">4,000</span>
              <span className="text-xl font-bold text-green-500">Dh</span>
            </div>
            <p className="text-base text-zinc-400">
              Katchedha kach fach katsayeb l&apos;système l&apos;client. Flousk 9bel tbda lkhdma.
            </p>

            {/* Mini log */}
            <div className="flex flex-col gap-2 mt-6 pt-5 border-t border-[#262626]">
              {[
                { name: "Clinique Dentaire", amount: "+4,000 Dh" },
                { name: "Agence Immo", amount: "+4,500 Dh" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">{item.name}</span>
                  <div className="flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3 text-green-500" />
                    <span className="text-green-400 font-medium">{item.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 2: Retainer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group relative flex flex-col rounded-2xl border border-[#262626] bg-[#171717] p-8 transition-all duration-300 hover:border-green-500/30 hover:shadow-[0_0_40px_rgba(34,197,94,0.08)] overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-green-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 transition-all group-hover:bg-green-500/20 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                <TrendingUp className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Retainer (L&apos;khelsa dima)</span>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-5xl font-black tracking-tight text-white">400</span>
              <span className="text-xl font-bold text-green-500">Dh / ch&apos;her</span>
            </div>
            <p className="text-base text-zinc-400">
              Flous dakhla kol ch&apos;her hit l&apos;système khdam 24/7 o kayjib lihom l&apos;khedma.
            </p>

            {/* Mini status indicators */}
            <div className="flex flex-col gap-2 mt-6 pt-5 border-t border-[#262626]">
              {[
                { label: "Abonnement Maintenance", status: "Active" },
                { label: "API Costs Markup", status: "Active" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">{item.label}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-green-400">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 3: Active Students */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group relative flex flex-col rounded-2xl border border-[#262626] bg-[#171717] p-8 transition-all duration-300 hover:border-orange-500/30 hover:shadow-[0_0_40px_rgba(249,115,22,0.08)] overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 transition-all group-hover:bg-orange-500/20 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]">
                <Users className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Drari li bdaw</span>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-5xl font-black tracking-tight text-white">150</span>
              <span className="text-2xl font-bold text-orange-500">+</span>
            </div>
            <p className="text-base text-zinc-400">
              Builders f l&apos;groupe kaytebb9ou hadchi w kayjibo clients lyoma. Flous d bessa7.
            </p>

            {/* Mini avatar stack */}
            <div className="flex items-center mt-6 pt-5 border-t border-[#262626]">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#171717] flex items-center justify-center text-[10px] font-bold"
                    style={{
                      background: [
                        "linear-gradient(135deg, #f97316, #ea580c)",
                        "linear-gradient(135deg, #3b82f6, #2563eb)",
                        "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                        "linear-gradient(135deg, #10b981, #059669)",
                        "linear-gradient(135deg, #f43f5e, #e11d48)",
                      ][i],
                      color: "white",
                    }}
                  >
                    {["S", "A", "M", "K", "Y"][i]}
                  </div>
                ))}
              </div>
              <span className="ml-3 text-xs text-zinc-500">+145 kaykhdmo</span>
            </div>
          </motion.div>
        </div>

        {/* The New Big Asset Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto max-w-5xl mt-6"
        >
          <div className="flex flex-col lg:flex-row bg-[#171717] rounded-2xl border border-[#262626] overflow-hidden shadow-2xl relative group">
            
            {/* Subtle highlight border */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/0 to-green-500/0 group-hover:from-green-500/10 group-hover:via-transparent group-hover:to-transparent transition-all duration-500 pointer-events-none" />

            {/* Left Image Side */}
            <div className="w-full lg:w-5/12 relative min-h-[300px] lg:min-h-[400px]">
              <Image 
                src="/proof-builder-v2.jpg" 
                alt="Builder working" 
                fill 
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              {/* Gradient overlay to blend into right side */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-transparent lg:bg-gradient-to-r" />
            </div>

            {/* Right Dashboard Mockup Side */}
            <div className="w-full lg:w-7/12 p-8 lg:p-12 relative flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-[#262626]">
              {/* Background Stripe-like glow */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-500/40 via-transparent to-transparent pointer-events-none" />
              
              <div className="relative z-10 w-full">
                <div className="flex items-center justify-between border-b border-[#262626] pb-4 mb-6">
                  <div className="flex items-center gap-2 text-zinc-300 font-bold text-sm lg:text-base">
                    <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                    l2arba7 li t9der dkhlhom kola chher f scaling
                  </div>
                  <span className="text-xs bg-green-500/10 text-green-400 px-3 py-1 rounded-full border border-green-500/20 font-semibold tracking-wide uppercase">
                    Today
                  </span>
                </div>
                
                <div>
                  <h3 className="text-4xl lg:text-6xl font-black text-white flex items-baseline gap-2 tracking-tight">
                    12,500 <span className="text-xl lg:text-2xl text-zinc-500 font-bold">MAD</span>
                  </h3>
                  <div className="flex items-center gap-2 mt-3 text-sm font-medium text-green-400 bg-green-500/10 w-fit px-3 py-1.5 rounded-lg border border-green-500/20">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>+4,000 Dh lyouma (Setup Fee)</span>
                  </div>
                </div>
                
                {/* Bar chart mockup */}
                <div className="flex items-end gap-1.5 lg:gap-2 h-24 lg:h-32 mt-10 w-full">
                  {[20, 35, 25, 60, 45, 80, 100].map((h, i) => (
                    <div key={i} className="flex-1 bg-green-500/5 rounded-t-sm relative group/bar overflow-hidden h-full">
                      <motion.div 
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.1, type: "spring" }}
                        className={`absolute bottom-0 left-0 w-full rounded-t-sm transition-colors ${
                          i === 6 ? 'bg-green-500' : 'bg-green-500/40 group-hover/bar:bg-green-500/60'
                        }`}
                      />
                    </div>
                  ))}
                </div>
                
                {/* Chart labels */}
                <div className="flex justify-between mt-3 text-xs text-zinc-500 font-medium px-1">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span className="text-green-500 font-bold">Sun</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
