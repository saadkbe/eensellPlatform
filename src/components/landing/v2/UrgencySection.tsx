"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

export function UrgencySection() {
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial scroll position

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <section className="relative py-24 md:py-32 px-6 overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-[#111111] border-t border-white/5">
        {/* Subtle orange radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] max-w-[600px] aspect-square bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-8"
          >
            L'inscription ghatsed f 5 jours.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed">
              We already have <span className="text-orange-500 font-bold">150+ builders</span> inside. This cohort is filling fast. Once we hit capacity, the <span className="text-orange-500">200 Dh</span> offer <span className="text-white font-bold">disappears permanently</span>.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-md mx-auto mb-12"
          >
            <div className="flex justify-between text-sm text-zinc-400 mb-2 font-medium">
              <span>150+ Enrolled</span>
              <span>200 Capacity</span>
            </div>
            <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 relative p-0.5">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "75%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-orange-600 to-orange-500 rounded-full relative overflow-hidden"
              >
                {/* Shimmer effect inside progress bar */}
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
              </motion.div>
            </div>
            <p className="text-sm text-zinc-500 mt-3">Filling fast, limited spots left</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center relative w-full"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="relative w-full md:w-auto"
            >
              {/* Outer pulsing glow */}
              <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full animate-pulse" />
              
              <Link 
              href="/sign-up"
              className="group relative w-full md:w-auto inline-flex items-center justify-center px-8 py-5 text-lg md:text-xl font-bold text-white bg-orange-600 rounded-xl overflow-hidden shadow-[0_0_40px_-10px_rgba(249,115,22,0.5)] hover:shadow-[0_0_60px_-10px_rgba(249,115,22,0.7)] transition-all duration-300 transform hover:scale-[1.02] border border-orange-400/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] transition-opacity" />
              <span className="relative flex items-center gap-2">
                Start my 60 day challenge 200Dh
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
          y: showSticky ? 0 : 100,
          opacity: showSticky ? 1 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-white/10 md:hidden"
      >
        {/* Floating Arrow & Hint */}
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce pointer-events-none">
          <div className="bg-[#171717] border border-orange-500/30 text-orange-500 text-xs font-bold px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.2)] mb-1 whitespace-nowrap">
            9ad compte mn hna
          </div>
          <svg className="w-6 h-6 text-orange-500 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        <Link
          href="/sign-up"
          className="flex items-center justify-center w-full px-6 py-4 text-base font-bold text-white bg-orange-600 rounded-xl shadow-[0_0_30px_-10px_rgba(249,115,22,0.5)] active:scale-95 transition-transform"
        >
          Start my 60 day challenge 200Dh
        </Link>
      </motion.div>
      
      {/* Global styles for animations if they don't exist yet */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}} />
    </>
  );
}
