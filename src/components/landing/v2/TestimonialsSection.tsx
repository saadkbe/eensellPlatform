"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    video: "/FEEDBACK1.mp4",
  },
  {
    id: 2,
    video: "/FEEDBACK2.mp4",
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
            Sme3 chno galo drari 3la l'programme.
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Mu7adathat 1-on-1 m3a drari li m3ana f l&apos;groupe.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "100px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="group flex flex-col gap-5"
            >
              {/* Video Container */}
              <div className="relative rounded-2xl overflow-hidden bg-[#171717] border border-[#262626] group-hover:border-[#f97316]/50 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all duration-300">
                <video
                  src={testimonial.video}
                  controls
                  preload="metadata"
                  playsInline
                  className="w-full h-auto object-cover"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
