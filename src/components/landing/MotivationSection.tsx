"use client";

import { motion } from "framer-motion";

export function MotivationSection() {
  return (
    <section className="relative py-32 sm:py-48 overflow-hidden bg-black text-white">
      {/* Cinematic Lighting Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-brand/20 blur-[150px] rounded-[100%] pointer-events-none opacity-50" />
      
      {/* Vertical tracking line */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand/50 to-transparent opacity-30 hidden md:block" />

      <div className="container max-w-4xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-16 h-16 rounded-full bg-brand/10 border border-brand/30 flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(59,130,246,0.3)]"
        >
          <div className="w-3 h-3 rounded-full bg-brand animate-ping" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black mb-8 leading-tight tracking-tight text-white"
        >
          بعد 5 سنوات من الآن.. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white/60 to-white/20">
            أين ستكون؟
          </span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-6 text-xl sm:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed font-medium"
        >
          <p>
            معظم الناس يعيشون نفس السنة 75 مرة ويسمون ذلك حياة. يستيقظون، يذهبون لعمل لا يحبونه، يعودون متعبين، ويشاهدون أحلامهم تتلاشى يوماً بعد يوم.
          </p>
          <p className="text-white font-bold">
            لكنك لست "معظم الناس".
          </p>
          <p>
            وجودك في هذه الصفحة اليوم ليس صدفة. إنه دليل على أنك تبحث عن مخرج. عن طريق يمنحك الحرية لتعمل بشروطك، في وقتك، ومن أي مكان.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 p-8 sm:p-12 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group w-full"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand/10 to-success/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <h3 className="relative z-10 text-2xl sm:text-4xl font-black text-white mb-4">
            القرار الذي تتخذه الآن، سيحدد شكل حياتك غداً.
          </h3>
          <p className="relative z-10 text-lg sm:text-xl text-brand-light font-medium">
            لا تؤجل نجاحك. العالم الرقمي لا ينتظر المترددين.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
