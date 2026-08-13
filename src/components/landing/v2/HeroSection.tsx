"use client";

import Link from "next/link";
import { motion } from "framer-motion";

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
          <div className="relative aspect-video w-full rounded-2xl bg-[#171717] border border-[#262626] shadow-[0_0_80px_rgba(249,115,22,0.15)] overflow-hidden">
            <iframe 
              src="https://player.vimeo.com/video/1217870233?autoplay=1&muted=0&title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479&dnt=1&rel=0"
              className="absolute top-0 left-0 w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              title="Challenge VSL Version 2"
            ></iframe>
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
