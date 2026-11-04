"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/components/landing/LanguageProvider";
import { Hourglass, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function MotivationSection() {
  const { dir, language, isRTL } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.6, 1]);

  return (
    <section
      ref={containerRef}
      dir={dir}
      className="relative py-24 sm:py-36 bg-[#FAFBFE] text-slate-900 overflow-hidden border-t border-slate-200/70"
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-amber-100/30 via-orange-50/20 to-indigo-100/30 rounded-full blur-[150px] pointer-events-none" />

      <div className="container max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Hourglass Web3 Icon Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="w-16 h-16 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center mb-8 shadow-md"
          >
            <Hourglass className="w-8 h-8 text-[#FF6B4A]" />
          </motion.div>

          {/* Section Sub-badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 tracking-wide uppercase mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B4A]" />
            <span>
              {language === "ar"
                ? "فرصة 2026 الذهبية بالمغرب"
                : language === "fr"
                ? "L'Opportunité Clé 2026 au Maroc"
                : "The 2026 Window of Opportunity"}
            </span>
          </div>

          {/* Massive Clean Headline */}
          <motion.h2
            style={{ scale, opacity }}
            className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-950 tracking-tight leading-[1.12] mb-10 max-w-4xl text-balance"
          >
            {language === "ar" ? (
              <>
                ثورة الذكاء الاصطناعي بالمغرب تحدث الآن.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-indigo-900 to-[#FF6B4A]">
                  هل ستكتفي بالمشاهدة أم ستبني مشروعك؟
                </span>
              </>
            ) : language === "fr" ? (
              <>
                La Vague IA au Maroc Se Joue Maintenant.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-indigo-900 to-[#FF6B4A]">
                  Allez-Vous Regarder ou Bâtir ?
                </span>
              </>
            ) : (
              <>
                The Moroccan AI Goldrush Is Happening Right Now.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-indigo-900 to-[#FF6B4A]">
                  Will You Watch Or Will You Build?
                </span>
              </>
            )}
          </motion.h2>

          {/* Core Manifesto Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="relative w-full max-w-3xl rounded-[2.5rem] bg-white border border-slate-200/90 p-8 sm:p-12 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.08)] text-left rtl:text-right space-y-6"
          >
            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
              {language === "ar"
                ? "كل تحول تكنولوجي كبير يفتح نافذة زمنية مدتها 18 شهراً تتساوى فيها الفرص للجميع. الشركات التي تتردد ستتراجع، بينما الشباب الذين يسبقون بتعلم الأتمتة يسيطرون على السوق المحلي بالكامل."
                : language === "fr"
                ? "Chaque tournant technologique ouvre une fenêtre de 18 mois où les cartes sont redistribuées. Les entreprises hésitantes perdent du terrain, tandis que les fondateurs qui maîtrisent l'automatisation s'emparent du marché local."
                : "Every major shift in business creates a brief 18-month window where the playing field is completely leveled. The businesses that hesitate get left behind, while those who adopt automation early capture the entire local market."}
            </p>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-900 font-bold text-sm sm:text-base leading-relaxed">
              {language === "ar"
                ? "«في المغرب حالياً، الأطباء والمحامون وشركات العقار وكراء السيارات يملكون ميزانيات جاهزة — لكن ليس لديهم أي وقت للرد على مئات الرسائل. نظام واتساب ذكي واحد يحل أكبر مشكلة تؤرقهم.»"
                : language === "fr"
                ? "« Au Maroc aujourd'hui, les médecins, avocats, agences et commerces ont du budget — mais zéro temps pour traiter les leads. Un seul système WhatsApp autonome résout leur plus gros point de douleur. »"
                : "“In Morocco right now, doctors, lawyers, auto dealers, and real estate developers have budget — but zero time to answer leads. A single automated WhatsApp and Email system solves their #1 pain point.”"}
            </div>

            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              {language === "ar"
                ? "لست بحاجة لأن تكون مبرمجاً، ولست بحاجة لرأس مال كبير. تحتاج فقط إلى الأدوات الصحيحة الموحدة، نصوص التواصل المجربة بالدارجة، والانضباط لتنفيذ خطة الـ 60 يوماً."
                : language === "fr"
                ? "Vous n'avez pas besoin de savoir coder ni de lever des fonds. Vous avez simplement besoin des bons outils intégrés, de scripts prouvés en Darija et de la discipline d'exécuter pendant 60 jours."
                : "You do not need to be a programmer. You do not need to raise venture capital. You simply need the proven workspace tools, the localized Darija scripts, and the discipline to execute for 60 days."}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                <span>
                  {language === "ar"
                    ? "+350 مؤسس مغربي نشطون حالياً في مجتمعنا"
                    : language === "fr"
                    ? "350+ fondateurs marocains actifs dans notre réseau"
                    : "350+ Moroccan founders already active in our network"}
                </span>
              </div>

              <Link href="/sign-up">
                <Button
                  size="sm"
                  className="h-10 px-5 rounded-xl text-xs font-bold bg-slate-950 hover:bg-slate-900 text-white shadow-xs cursor-pointer flex items-center gap-2"
                >
                  <span>
                    {language === "ar"
                      ? "ابدأ رحلة وكالتك الآن"
                      : language === "fr"
                      ? "Démarrer Votre Agence"
                      : "Start Your Agency Journey"}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
