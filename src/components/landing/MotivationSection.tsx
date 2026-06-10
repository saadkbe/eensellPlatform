import { ScrollReveal } from "@/components/animations/ScrollReveal";

export function MotivationSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-32 overflow-hidden bg-black text-white">
      {/* Starfield Background */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className="starfield w-full h-full" />
      </div>

      {/* Cinematic Lighting Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-brand/30 blur-[150px] rounded-[100%] pointer-events-none opacity-60 z-0" />
      
      {/* Vertical tracking line */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand/50 to-transparent opacity-40 hidden md:block z-0" />

      <div className="container max-w-4xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        
        <ScrollReveal
          animation="scale"
          className="w-16 h-16 rounded-full bg-brand/10 border border-brand/30 flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(59,130,246,0.5)] glow-brand"
        >
          <div className="w-3 h-3 rounded-full bg-brand animate-ping" />
        </ScrollReveal>

        <ScrollReveal
          animation="slide-up"
          delay={0.2}
          className="text-5xl sm:text-7xl md:text-8xl font-black mb-10 leading-tight tracking-tight text-white drop-shadow-2xl"
        >
          بعد 5 سنوات من الآن.. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white/80 to-white/20">
            أين ستكون؟
          </span>
        </ScrollReveal>

        <div className="space-y-6 text-xl sm:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed font-medium">
          <ScrollReveal
            animation="slide-up"
            delay={0.4}
          >
            معظم الناس يعيشون نفس السنة 75 مرة ويسمون ذلك حياة. يستيقظون، يذهبون لعمل لا يحبونه، يعودون متعبين، ويشاهدون أحلامهم تتلاشى يوماً بعد يوم.
          </ScrollReveal>
          <ScrollReveal
            animation="slide-up"
            delay={0.5}
            className="text-white font-bold"
          >
            لكنك لست "معظم الناس".
          </ScrollReveal>
          <ScrollReveal
            animation="slide-up"
            delay={0.6}
          >
            وجودك في هذه الصفحة اليوم ليس صدفة. إنه دليل على أنك تبحث عن مخرج. عن طريق يمنحك الحرية لتعمل بشروطك، في وقتك، ومن أي مكان.
          </ScrollReveal>
        </div>

        <ScrollReveal
          animation="slide-up"
          delay={0.8}
          className="mt-20 w-full"
        >
          <div className="glass-card rounded-[2.5rem] p-10 sm:p-16 border border-white/10 relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-brand/10 to-success/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Decorative Quotes */}
            <div className="absolute top-4 right-8 text-[8rem] leading-none font-serif text-white/5 pointer-events-none">"</div>
            <div className="absolute bottom-4 left-8 text-[8rem] leading-none font-serif text-white/5 pointer-events-none rotate-180">"</div>
            
            <h3 className="relative z-10 text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
              القرار الذي تتخذه الآن، سيحدد شكل حياتك غداً.
            </h3>
            <p className="relative z-10 text-xl sm:text-2xl text-brand-light font-bold">
              لا تؤجل نجاحك. العالم الرقمي لا ينتظر المترددين.
            </p>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
