"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Calendar,
  Layers,
  BookOpen,
  Video,
  Users,
  Award,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Clock,
  Play,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/landing/LanguageProvider";

export function UniversitySection() {
  const { dir, t } = useLanguage();

  const courses = [
    {
      code: "M1",
      title: t("uni_m1_title"),
      desc: t("uni_m1_desc"),
      image: "/modules/mod1_foundations.png",
      lessons: t("uni_m1_lessons"),
      tag: t("uni_m1_tag"),
    },
    {
      code: "M2",
      title: t("uni_m2_title"),
      desc: t("uni_m2_desc"),
      image: "/modules/mod2_tools.png",
      lessons: t("uni_m2_lessons"),
      tag: t("uni_m2_tag"),
    },
    {
      code: "M3",
      title: t("uni_m3_title"),
      desc: t("uni_m3_desc"),
      image: "/modules/mod16_website.png",
      lessons: t("uni_m3_lessons"),
      tag: t("uni_m3_tag"),
    },
    {
      code: "M4",
      title: t("uni_m4_title"),
      desc: t("uni_m4_desc"),
      image: "/modules/mod6_automation.png",
      lessons: t("uni_m4_lessons"),
      tag: t("uni_m4_tag"),
    },
    {
      code: "M5",
      title: t("uni_m5_title"),
      desc: t("uni_m5_desc"),
      image: "/modules/mod13_video.png",
      lessons: t("uni_m5_lessons"),
      tag: t("uni_m5_tag"),
    },
    {
      code: "M6",
      title: t("uni_m6_title"),
      desc: t("uni_m6_desc"),
      image: "/modules/mod17_marketing.png",
      lessons: t("uni_m6_lessons"),
      tag: t("uni_m6_tag"),
    },
    {
      code: "M7",
      title: t("uni_m7_title"),
      desc: t("uni_m7_desc"),
      image: "/modules/mod8_business.png",
      lessons: t("uni_m7_lessons"),
      tag: t("uni_m7_tag"),
    },
    {
      code: "M8",
      title: t("uni_m8_title"),
      desc: t("uni_m8_desc"),
      image: "/modules/mod9_client.png",
      lessons: t("uni_m8_lessons"),
      tag: t("uni_m8_tag"),
    },
    {
      code: "M9",
      title: t("uni_m9_title"),
      desc: t("uni_m9_desc"),
      image: "/modules/mod15_money.png",
      lessons: t("uni_m9_lessons"),
      tag: t("uni_m9_tag"),
    },
  ];

  const universityPillars = [
    {
      icon: Calendar,
      title: "60-Day Implementation Challenge",
      desc: "A daily execution roadmap taking you from zero to landing your first paid Moroccan B2B retainer within 60 days.",
      badge: "CHALLENGE",
    },
    {
      icon: Layers,
      title: "Student Dashboard & LMS Tracking",
      desc: "Track lesson completion percentages, quiz checkpoints, and download proprietary agency resources.",
      badge: "STUDENT PORTAL",
    },
    {
      icon: Video,
      title: "Community & Weekly Live Sessions",
      desc: "Weekly Tuesday & Saturday live strategy rooms with Saad, plus an on-demand archive of past student deal breakdowns.",
      badge: "REPLAY VAULT",
    },
  ];

  return (
    <section
      id="university"
      dir={dir}
      className="relative py-20 sm:py-32 bg-white text-slate-900 overflow-hidden border-t border-slate-200/70"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-10 w-[700px] h-[500px] bg-gradient-to-tr from-purple-100/40 via-indigo-50/30 to-transparent rounded-full blur-[150px] pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 shadow-2xs mb-4 text-xs font-bold text-slate-800 tracking-wide uppercase"
          >
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t("uni_badge")}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight mb-4"
          >
            {t("uni_title_1")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-indigo-900 to-[#FF6B4A]">
              {t("uni_title_2")}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            {t("uni_sub")}
          </motion.p>
        </div>

        {/* ── 9 AI LIBRARY COURSES WITH AI GENERATED THUMBNAILS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {courses.map((course, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)] hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Course Thumbnail Image Box */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient shadow for text overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                  {/* Top Badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-slate-950/80 backdrop-blur-md text-white border border-white/20 font-mono">
                      {course.code}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-slate-900 border border-slate-200">
                      {course.tag}
                    </span>
                  </div>

                  {/* Bottom Duration Badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] font-semibold text-white/90">
                    <Play className="w-3 h-3 fill-white text-white" />
                    <span>{course.lessons}</span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-5 sm:p-6">
                  <h3 className="text-base sm:text-lg font-black text-slate-950 mb-2 leading-snug group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {course.desc}
                  </p>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Full Access
                </span>
                <span className="text-[11px] text-slate-400 group-hover:text-slate-900 transition-colors">
                  V2 Included &rarr;
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── 3 UNIVERSITY PILLARS (Challenge, LMS, Live Replays) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {universityPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-50/80 rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-2xs">
                      <Icon className="w-4 h-4 text-slate-900" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white text-slate-700 border border-slate-200 font-mono">
                      {pillar.badge}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-950 mb-2 leading-snug">
                    {pillar.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-semibold text-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Included with V2 Program</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Bar */}
        <div className="text-center">
          <Link href="/sign-up">
            <Button
              size="lg"
              className="h-11 px-7 rounded-xl text-xs sm:text-sm font-bold bg-slate-950 hover:bg-slate-900 text-white shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <span>Unlock All 9 Courses with Eensell V2 &bull; 499 MAD</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
