"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { PlayCircle } from "lucide-react";

export function ArsenalSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  return (
    <section id="arsenal" className="bg-[#0a0a0a] py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16 lg:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Chno ghadi takhod b <span className="text-[#f97316] whitespace-nowrap">200 Dh</span><br/>
            <span className="text-2xl text-zinc-500">(Taman dial 2 pitzat)</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-zinc-400"
          >
            Koulchi li ghat7taj bach tbni w tbi3 des Systemes d&apos;IA, mjmou3 f blassa we7da.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Card 1: 60-Day Curriculum */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-2 group rounded-3xl bg-[#171717] border border-[#262626] p-8 flex flex-col justify-between hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-64 sm:h-80 w-full rounded-2xl bg-[#0a0a0a] border border-[#262626] mb-8 relative overflow-hidden">
               <Image 
                  src="/images/course_modules.png" 
                  alt="60 Day Challenge Course Modules" 
                  fill
                  className="object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Programme dial 60 Yom.</h3>
              <p className="text-zinc-400">Vidéos over-the-shoulder. Choufni kifach kan-cliki, kan-bni, w kan-deployi étape par étape.</p>
            </div>
          </motion.div>

          {/* Card 2: Blueprints */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-1 group rounded-3xl bg-[#171717] border border-[#262626] p-8 flex flex-col justify-between hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1"
          >
             <div className="h-64 w-full rounded-2xl bg-[#0a0a0a] border border-[#262626] p-4 flex flex-col mb-8 relative font-mono text-xs overflow-hidden">
                {/* Window Controls */}
                <div className="flex gap-1.5 mb-4 border-b border-[#262626] pb-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/80"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/80"></div>
                </div>
                {/* Code Lines */}
                <div className="flex flex-col gap-2 opacity-80">
                  <div className="flex gap-2"><span className="text-zinc-600">1</span><span className="text-purple-400">{"{"}</span></div>
                  <div className="flex gap-2"><span className="text-zinc-600">2</span><span className="text-blue-400 ml-4">"name"</span><span className="text-zinc-400">:</span> <span className="text-green-400">"Make.com Workflow"</span><span className="text-zinc-400">,</span></div>
                  <div className="flex gap-2"><span className="text-zinc-600">3</span><span className="text-blue-400 ml-4">"version"</span><span className="text-zinc-400">:</span> <span className="text-orange-400">1.0</span><span className="text-zinc-400">,</span></div>
                  <div className="flex gap-2"><span className="text-zinc-600">4</span><span className="text-blue-400 ml-4">"modules"</span><span className="text-zinc-400">:</span> <span className="text-purple-400">[</span></div>
                  <div className="flex gap-2"><span className="text-zinc-600">5</span><span className="text-purple-400 ml-8">{"{"}</span></div>
                  <div className="flex gap-2"><span className="text-zinc-600">6</span><span className="text-blue-400 ml-12">"id"</span><span className="text-zinc-400">:</span> <span className="text-orange-400">1</span><span className="text-zinc-400">,</span></div>
                  <div className="flex gap-2"><span className="text-zinc-600">7</span><span className="text-blue-400 ml-12">"type"</span><span className="text-zinc-400">:</span> <span className="text-green-400">"webhook"</span></div>
                  <div className="flex gap-2"><span className="text-zinc-600">8</span><span className="text-purple-400 ml-8">{"}"}</span></div>
                  <div className="flex gap-2"><span className="text-zinc-600">9</span><span className="text-purple-400 ml-4">]</span></div>
                  <div className="flex gap-2"><span className="text-zinc-600">10</span><span className="text-purple-400">{"}"}</span></div>
                </div>
             </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Systemes Wajdin.</h3>
              <p className="text-zinc-400">Téléchargi les fichiers JSON dial Make.com li kankhdem bihom w importihom direct.</p>
            </div>
          </motion.div>

          {/* Card 3: Live Troubleshooting */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-1 group rounded-3xl bg-[#171717] border border-[#262626] p-8 flex flex-col justify-between hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1"
          >
             <div className="h-48 w-full rounded-2xl bg-[#0a0a0a] border border-[#262626] mb-8 relative overflow-hidden">
                <Image 
                  src="/images/google_meet.jpg" 
                  alt="Live Troubleshooting Call" 
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
             </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Live Troubleshooting.</h3>
              <p className="text-zinc-400">2 d les appels live kol simana bach n7ello lik les workflows li m7bsin.</p>
            </div>
          </motion.div>

          {/* Card 4: The Outreach Vault */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-1 group rounded-3xl bg-[#171717] border border-[#262626] p-8 flex flex-col justify-between hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1"
          >
             <div className="h-48 w-full rounded-2xl bg-[#0a0a0a] border border-[#262626] p-4 flex items-center justify-center mb-8 relative">
                <div className="w-3/4 h-[120%] bg-[#171717] border border-[#262626] rounded-lg shadow-2xl -rotate-3 p-4 flex flex-col gap-3 relative">
                  <div className="h-2 w-1/3 bg-zinc-700 rounded mb-2"></div>
                  <div className="h-2 w-full bg-zinc-800 rounded"></div>
                  <div className="h-2 w-5/6 bg-zinc-800 rounded"></div>
                  <div className="h-2 w-full bg-zinc-800 rounded"></div>
                  <div className="h-2 w-4/6 bg-zinc-800 rounded"></div>
                  <div className="h-2 w-full bg-zinc-800 rounded"></div>
                  
                  {/* Seal/Stamp */}
                  <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-orange-500/20 border border-orange-500 flex items-center justify-center rotate-12 backdrop-blur-sm">
                    <div className="h-12 w-12 rounded-full border border-dashed border-orange-500 flex items-center justify-center text-[8px] font-bold text-orange-500 tracking-wider">
                      PROVEN
                    </div>
                  </div>
                </div>
             </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">L&apos;Coffre dial l&apos;Outreach.</h3>
              <p className="text-zinc-400">Scripts mtestyin bach t-closi les cliniques w les agences.</p>
            </div>
          </motion.div>

          {/* Card 5: VIP Community */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-1 group rounded-3xl bg-[#171717] border border-[#262626] p-8 flex flex-col justify-between hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1"
          >
             <div className="h-48 w-full rounded-2xl bg-[#0a0a0a] border border-[#262626] mb-8 relative overflow-hidden">
                <Image 
                  src="/images/discord_chat.png" 
                  alt="Discord Community Chat" 
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#171717] to-transparent"></div>
             </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Community VIP.</h3>
              <p className="text-zinc-400">Accès direct l network dial drari li kay9ado w kaybi3o kol nhar.</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Modules List Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-24 pt-16 border-t border-[#262626] relative"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="text-center mb-12 relative z-10">
            <h3 className="text-3xl font-bold text-white mb-4">
              Chno Kayan F L'Programme <span className="text-[#f97316]">Exactement:</span>
            </h3>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              20 module kamil bach tbda w tmétrizi l'IA w t-monétiser les compétences dialk mn nhar lwel.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {[
              "Building an AI Business From Scratch",
              "AI Ads Video Generation",
              "AI Client Acquisition & Outreach",
              "AI Foundations & Opportunity Mindset",
              "AI-Powered Freelancing",
              "AI SaaS & Startup Ideas",
              "AI Tools Mastery",
              "AI Video Editing & Cinematic Content",
              "AI Chatbots & AI Agents",
              "AI Productivity & Life Systems",
              "Personal Branding With AI",
              "AI Money-Making Opportunities",
              "AI Content Creation Systems",
              "AI Automation & Workflows",
              "AI Website & Landing Page Creation",
              "Viral AI Short-Form Content",
              "AI Marketing & Copywriting",
              "AI Prompt Engineering Mastery",
              "Future AI Trends & Emerging Opportunities",
              "AI E-commerce & Digital Products"
            ].map((mod, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.1 }}
                className="group flex items-start gap-4 p-5 rounded-2xl bg-[#171717]/40 border border-[#262626] hover:border-[#f97316]/40 hover:bg-[#171717] hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] transition-all duration-300"
              >
                <div className="mt-0.5 shrink-0 h-7 w-7 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20 group-hover:bg-orange-500 group-hover:border-orange-500 transition-colors duration-300">
                  <PlayCircle className="w-4 h-4 text-orange-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <p className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors leading-snug">
                  {mod}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
