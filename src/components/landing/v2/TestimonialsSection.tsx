"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

const testimonials = [
  {
    id: 1,
    caption: "Jabo l'khelsa l'wla dial 4,000 Dh f 14 yom",
  },
  {
    id: 2,
    caption: "Awal réceptionniste IA khdama f 48 sa3a",
  },
  {
    id: 3,
    caption: "Sayeb système l 3 dial les cliniques f simana we7da",
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-[#0a0a0a] py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Drari li dija bdaw Kaydekhlo flous.
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Mu7adathat 1-on-1 m3a drari li m3ana f l&apos;groupe.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="group cursor-pointer flex flex-col gap-5"
            >
              {/* Video Container */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#171717] border border-[#262626] group-hover:border-[#f97316]/50 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all duration-300">
                
                {/* CSS Split Screen Mockup */}
                <div className="absolute inset-0 flex">
                  {/* Left Person */}
                  <div className="w-1/2 h-full bg-zinc-800/80 border-r border-[#262626] flex items-center justify-center relative overflow-hidden">
                    <div className="w-16 h-16 rounded-full bg-zinc-700/50 flex items-center justify-center">
                      <svg className="w-8 h-8 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Right Person */}
                  <div className="w-1/2 h-full bg-zinc-900/80 flex items-center justify-center relative overflow-hidden">
                    <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center">
                      <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Scanline Overlay */}
                <div 
                  className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" 
                  style={{
                    backgroundImage: 'linear-gradient(transparent 50%, rgba(0,0,0,0.8) 50%)',
                    backgroundSize: '100% 4px'
                  }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                    <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>

              {/* Caption */}
              <p className="text-zinc-300 font-medium text-lg leading-snug px-1 group-hover:text-white transition-colors duration-300">
                "{testimonial.caption}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
