"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight"
        >
          Katchouf les vidéos dial l'IA kol nhar, walakin mazal madkhlti{" "}
          <span className="text-orange-500">hta derhem?</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-lg sm:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto"
        >
          Baraka ma tconsomi f les tutos. Copier l&apos;systeme d&apos;automation exact li kankhdem bih bach n9ad des réceptionnistes IA w nbi3hom l les business locaux b 4,000 Dh.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full mb-12 relative"
        >
          {/* Video Player Placeholder */}
          <div className="relative aspect-video w-full rounded-2xl bg-[#171717] border border-[#262626] shadow-[0_0_80px_rgba(249,115,22,0.15)] overflow-hidden group cursor-pointer flex items-center justify-center">
            {/* Play Button */}
            <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white transition-transform group-hover:scale-110 group-hover:bg-orange-400 z-10 shadow-lg">
              <Play className="w-8 h-8 ml-2 fill-current" />
            </div>

            {/* Optional Overlay for better look */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/80 to-transparent pointer-events-none" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <Link href="/sign-up" className="inline-block relative">
              <motion.div
              animate={{
                boxShadow: [
                  "0px 0px 10px 0px rgba(249,115,22,0.4)",
                  "0px 0px 30px 5px rgba(249,115,22,0.7)",
                  "0px 0px 10px 0px rgba(249,115,22,0.4)",
                ],
              }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute inset-0 rounded-lg pointer-events-none"
            />
            <div className="relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors w-full sm:w-auto text-center">
              Start my 60 day challenge 200Dh
            </div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
