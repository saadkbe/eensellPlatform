"use client";

import { useState, useEffect, Fragment } from "react";
import { SignOutButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Copy, Check, Building2, User, CreditCard, Hash, Globe,
  FileCode2, CheckCircle2, Sparkles, Video, Users, Map, FileText,
  Target, ChevronDown, Banknote, Send, ShieldCheck, GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/landing/LanguageProvider";
import { Navbar } from "@/components/landing/Navbar";
import { toast } from "sonner";

/* ──────────────────────────────────────────
   Animation Variants
   ────────────────────────────────────────── */

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ──────────────────────────────────────────
   WhatsApp SVG Icon
   ────────────────────────────────────────── */

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`shrink-0 ${className ?? ""}`}>
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-5.824 4.74-10.563 10.564-10.563 5.826 0 10.564 4.741 10.564 10.564 0 5.824-4.74 10.564-10.564 10.564z" />
    </svg>
  );
}

/* ──────────────────────────────────────────
   Main Component
   ────────────────────────────────────────── */

function PendingContent() {
  const { t, language, dir, isRTL } = useLanguage();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  /** Tri-lingual text helper */
  const tx = (ar: string, fr: string, en: string) =>
    language === "ar" ? ar : language === "fr" ? fr : en;

  /* ── WhatsApp (unchanged) ── */
  const whatsappNumber = "212666065608";
  const whatsappMessage = encodeURIComponent(t("pending_whatsapp_message"));
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  /* ── Sticky CTA scroll listener ── */
  useEffect(() => {
    const onScroll = () => setShowStickyCta(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Copy handler (unchanged) ── */
  const handleCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(value);
    toast.success(language === "ar" ? `تم نسخ ${label} بنجاح!` : `Copied ${label}!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  /* ═══════════════════════════════════════
     DATA
     ═══════════════════════════════════════ */

  const progressSteps = [
    { label: tx("إنشاء الحساب", "Compte créé", "Account Created"), status: "completed" as const },
    { label: tx("إتمام الدفع", "Paiement", "Complete Payment"), status: "current" as const },
    { label: tx("التفعيل", "Activation", "Activation"), status: "upcoming" as const },
    { label: tx("ابدأ التعلم", "Commencer", "Start Learning"), status: "upcoming" as const },
  ];

  const nextSteps = [
    {
      icon: Banknote,
      title: tx("تحويل 200 درهم", "Transférer 200 MAD", "Transfer 200 MAD"),
      desc: tx("عبر CIH Bank أو Wafacash أو Cash Plus", "Via CIH Bank, Wafacash ou Cash Plus", "Via CIH Bank, Wafacash, or Cash Plus"),
    },
    {
      icon: Send,
      title: tx("إرسال الوصل عبر واتساب", "Envoyer le reçu sur WhatsApp", "Send receipt on WhatsApp"),
      desc: tx("التقط صورة للوصل وأرسلها", "Prenez une photo du reçu et envoyez-la", "Take a photo of your receipt and send it"),
    },
    {
      icon: ShieldCheck,
      title: tx("تفعيل الحساب بعد التحقق", "Activation après vérification", "Account activated after verification"),
      desc: tx("سيتم التحقق وتفعيل حسابك في دقائق", "Vérifié et activé en quelques minutes", "Verified and activated within minutes"),
    },
    {
      icon: GraduationCap,
      title: tx("الوصول لجامعة إنسل", "Accéder à Eensell University", "Access Eensell University"),
      desc: tx("ابدأ رحلة التعلم مع جميع الدورات", "Commencez avec tous les cours et ressources", "Start learning with all courses and resources"),
    },
  ];

  const features = [
    {
      icon: Sparkles,
      title: tx("دورات الذكاء الاصطناعي", "Cours d'IA", "AI Courses"),
      desc: tx("تعلم أحدث أدوات وتقنيات الذكاء الاصطناعي", "Apprenez les derniers outils et techniques d'IA", "Learn the latest AI tools and techniques"),
      gradient: "linear-gradient(135deg, #A78BFA, #7C3AED)",
    },
    {
      icon: Video,
      title: tx("مكالمات أسبوعية مباشرة", "Appels live hebdomadaires", "Weekly Live Calls"),
      desc: tx("جلسات تفاعلية مباشرة كل أسبوع مع الفريق", "Sessions interactives en direct chaque semaine", "Interactive live sessions every week with the team"),
      gradient: "linear-gradient(135deg, #7DD3FC, #0EA5E9)",
    },
    {
      icon: Users,
      title: tx("مجتمع خاص", "Communauté privée", "Private Community"),
      desc: tx("تواصل مع أعضاء طموحين يشاركونك نفس الأهداف", "Connectez-vous avec des membres ambitieux", "Connect with ambitious members who share your goals"),
      gradient: "linear-gradient(135deg, #6EE7B7, #10B981)",
    },
    {
      icon: Map,
      title: tx("خارطة اكتساب العملاء", "Feuille de route acquisition clients", "Client Acquisition Roadmap"),
      desc: tx("خطة عمل واضحة للحصول على أول عملائك", "Plan d'action pour obtenir vos premiers clients", "Clear action plan to get your first clients"),
      gradient: "linear-gradient(135deg, #FDBA74, #F97316)",
    },
    {
      icon: FileText,
      title: tx("قوالب وموارد", "Modèles & Ressources", "Templates & Resources"),
      desc: tx("قوالب جاهزة وموارد حصرية لتسريع عملك", "Modèles prêts à l'emploi et ressources exclusives", "Ready-made templates and exclusive resources"),
      gradient: "linear-gradient(135deg, #FDE68A, #F59E0B)",
    },
    {
      icon: Target,
      title: tx("تحدي 60 يوم", "Défi 60 jours", "60-Day Challenge"),
      desc: tx("تحدي منظم لمدة 60 يوماً لبناء مشروعك", "Défi structuré de 60 jours pour votre projet", "Structured 60-day challenge to build your business"),
      gradient: "linear-gradient(135deg, #FCA5A5, #EF4444)",
    },
  ];

  const paymentMethods = [
    { name: "CIH Bank", logo: "/Cih-bank.png" },
    { name: "Wafacash", logo: "/wafacash-logo-png_seeklogo-251985.png" },
    { name: "Cash Plus", logo: "/cashplus-logo-png_seeklogo-384674.png" },
  ];

  const bankDetails = [
    { label: tx("البنك", "Banque", "Bank"), value: "CIH Bank", icon: Building2 },
    { label: tx("الاسم الكامل", "Nom complet", "Name"), value: "MONSIEUR SAAD KAABOUCHE", icon: User },
    { label: tx("رقم الحساب (Compte)", "Compte", "Compte"), value: "3546303211005900", icon: CreditCard },
    { label: tx("رمز البنك (RIB)", "RIB", "RIB"), value: "230825354630321100590031", icon: Hash },
    { label: tx("رقم الحساب الدولي (IBAN)", "IBAN", "IBAN"), value: "MA64 2308 2535 4630 3211 0059 0031", icon: Globe },
    { label: tx("رمز السويفت (SWIFT)", "SWIFT", "SWIFT"), value: "CIHMMAMC", icon: FileCode2 },
  ];

  const faqItems = [
    {
      question: tx("كم يستغرق تفعيل الحساب؟", "Combien de temps prend l'activation ?", "How long does activation take?"),
      answer: tx(
        "عادةً يتم تفعيل حسابك خلال 5 دقائق بعد إرسال وصل الدفع. في أوقات الذروة، قد يستغرق الأمر حتى 60 دقيقة.",
        "Votre compte est généralement activé dans les 5 minutes suivant l'envoi du reçu. Aux heures de pointe, cela peut prendre jusqu'à 60 minutes.",
        "Your account is usually activated within 5 minutes of sending the receipt. During peak hours, it may take up to 60 minutes."
      ),
    },
    {
      question: tx("هل يمكنني الدفع عبر CashPlus أو Wafacash؟", "Puis-je payer via CashPlus ou Wafacash ?", "Can I pay through CashPlus or Wafacash?"),
      answer: tx(
        "نعم! يمكنك الدفع عبر CashPlus أو Wafacash. تواصل معنا عبر واتساب للحصول على تفاصيل التحويل.",
        "Oui ! Vous pouvez payer via CashPlus ou Wafacash. Contactez-nous sur WhatsApp pour les détails du transfert.",
        "Yes! You can pay via CashPlus or Wafacash. Contact us on WhatsApp for transfer details."
      ),
    },
    {
      question: tx("هل أحتفظ بالوصول بعد الانضمام؟", "Est-ce que je garde l'accès après avoir rejoint ?", "Do I keep access after joining?"),
      answer: tx(
        "نعم، عضويتك التأسيسية تمنحك وصولاً مدى الحياة إلى جميع المحتويات والتحديثات وميزات المجتمع.",
        "Oui, votre adhésion fondateur vous donne un accès à vie à tout le contenu, mises à jour et fonctionnalités communautaires.",
        "Yes, your founding membership gives you lifetime access to all content, updates, and community features."
      ),
    },
    {
      question: tx("ماذا لو احتجت مساعدة؟", "Et si j'ai besoin d'aide ?", "What if I need help?"),
      answer: tx(
        "فريقنا متاح على مدار الساعة عبر واتساب. فقط اضغط على الزر الأخضر أسفل هذه الصفحة.",
        "Notre équipe est disponible 24/7 sur WhatsApp. Cliquez simplement sur le bouton vert en bas de cette page.",
        "Our team is available 24/7 on WhatsApp. Just click the green button at the bottom of this page."
      ),
    },
  ];

  /* ═══════════════════════════════════════
     RENDER
     ═══════════════════════════════════════ */

  return (
    <div dir={dir} className={`min-h-screen bg-background relative overflow-hidden ${isRTL ? "font-arabic" : ""}`}>
      <Navbar hideLinks={true} />

      {/* ── Background Decoration ── */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[150px] opacity-[0.12] bg-brand pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px] opacity-[0.08] bg-success pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-40">

        {/* ═══════════════════════════════════════
            SECTION 1 — HERO
            ═══════════════════════════════════════ */}
        <section className="text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring", bounce: 0.4 }}
            className="mx-auto mb-8 relative inline-flex"
          >
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-[1.75rem] bg-card border-2 border-emerald-500/30 flex items-center justify-center relative z-10"
              style={{ boxShadow: "0 0 40px rgba(16,185,129,0.15), 0 20px 40px -12px rgba(0,0,0,0.08)" }}
            >
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0, 0.35] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-[1.75rem] border-2 border-emerald-500/30"
            />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.15] mb-4"
          >
            {tx(
              "تم إنشاء حسابك بنجاح 🎉",
              "Votre compte a été créé 🎉",
              "Your account has been created 🎉"
            )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="text-muted-foreground text-base sm:text-lg leading-relaxed font-medium max-w-xl mx-auto mb-12"
          >
            {tx(
              "خطوة واحدة فقط تفصلك عن الوصول إلى التحدي. أكمل الدفع للبدء فوراً.",
              "Une seule étape vous sépare d'accéder au challenge. Complétez le paiement pour commencer.",
              "You're just one step away from accessing the challenge. Complete your payment to get started."
            )}
          </motion.p>

          {/* Progress Stepper */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            dir="ltr"
            className="flex items-start justify-between max-w-lg mx-auto bg-card/70 backdrop-blur-sm rounded-2xl sm:rounded-[1.5rem] border border-border/60 px-4 sm:px-8 py-5 sm:py-6 shadow-sm"
          >
            {progressSteps.map((step, i) => (
              <Fragment key={i}>
                {/* Step */}
                <div className="flex flex-col items-center gap-2.5 relative z-10">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                      step.status === "completed"
                        ? "bg-emerald-500 text-white shadow-md"
                        : step.status === "current"
                          ? "bg-brand text-white shadow-lg ring-[3px] ring-brand/20"
                          : "bg-muted text-muted-foreground border border-border/80"
                    }`}
                  >
                    {step.status === "completed" ? (
                      <Check className="w-4 h-4 sm:w-[18px] sm:h-[18px]" strokeWidth={3} />
                    ) : (
                      <span className="text-xs sm:text-sm">{i + 1}</span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs leading-tight text-center max-w-[64px] sm:max-w-[80px] ${
                      step.status === "completed"
                        ? "text-emerald-600 font-semibold"
                        : step.status === "current"
                          ? "text-brand font-bold"
                          : "text-muted-foreground font-medium"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector Line */}
                {i < progressSteps.length - 1 && (
                  <div
                    className={`flex-1 h-[2px] rounded-full mt-[18px] sm:mt-[19px] mx-1.5 sm:mx-3 ${
                      i === 0 ? "bg-emerald-400" : "bg-border"
                    }`}
                  />
                )}
              </Fragment>
            ))}
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════
            SECTION 2 — WELCOME VIDEO
            ═══════════════════════════════════════ */}
        <section className="mt-16 sm:mt-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeInUp}
          >
            <p className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
              <span className="inline-flex w-5 h-5 rounded-md bg-brand/10 items-center justify-center">
                <Video className="w-3 h-3 text-brand" />
              </span>
              {tx(
                "شاهد هذا قبل إتمام الدفع (دقيقتان)",
                "Regardez ceci avant de finaliser votre paiement (2 minutes)",
                "Watch this before completing your payment (2 minutes)"
              )}
            </p>
            <div className="bg-card rounded-2xl sm:rounded-[1.75rem] border border-border/60 shadow-xl overflow-hidden p-1.5 sm:p-2">
              <div className="aspect-video rounded-xl sm:rounded-[1.25rem] overflow-hidden bg-muted">
                {/* ▼ Replace VIDEO_ID_HERE with your YouTube video ID ▼ */}
                <iframe
                  src="https://www.youtube.com/embed/VIDEO_ID_HERE?autoplay=1"
                  title={tx("فيديو ترحيبي", "Vidéo de bienvenue", "Welcome video")}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════
            SECTION 3 — WHAT HAPPENS NEXT
            ═══════════════════════════════════════ */}
        <section className="mt-16 sm:mt-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
          >
            {/* Section Header */}
            <motion.div variants={fadeInUp} className="text-center mb-10">
              <span className="inline-block text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-brand mb-3">
                {tx("الخطوات التالية", "Prochaines étapes", "Next Steps")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                {tx("ماذا يحدث بعد ذلك", "Que se passe-t-il ensuite", "What Happens Next")}
              </h2>
            </motion.div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {nextSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    className="bg-card rounded-2xl p-5 sm:p-6 border border-border/50 hover:border-brand/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5 text-brand" />
                      </div>
                      <span className="text-xs font-bold text-brand/60 uppercase tracking-wider">
                        {tx(`الخطوة ${i + 1}`, `Étape ${i + 1}`, `Step ${i + 1}`)}
                      </span>
                    </div>
                    <h3 className="font-bold text-foreground text-[15px] mb-1.5">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════
            SECTION 4 — WHAT YOU'LL UNLOCK
            ═══════════════════════════════════════ */}
        <section className="mt-16 sm:mt-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
          >
            {/* Section Header */}
            <motion.div variants={fadeInUp} className="text-center mb-10">
              <span className="inline-block text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-brand mb-3">
                {tx("المميزات", "Fonctionnalités", "Features")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                {tx("ما الذي ستحصل عليه", "Ce que vous débloquerez", "What You'll Unlock")}
              </h2>
              <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
                {tx(
                  "كل ما تحتاجه للبدء في بناء دخلك عبر الإنترنت",
                  "Tout ce dont vous avez besoin pour construire votre revenu en ligne",
                  "Everything you need to start building your online income"
                )}
              </p>
            </motion.div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    className="bg-card rounded-2xl p-5 sm:p-6 border border-border/50 hover:border-border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg group"
                  >
                    <div
                      className="w-11 h-11 rounded-[0.875rem] flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300"
                      style={{ background: feature.gradient }}
                    >
                      <Icon className="w-[22px] h-[22px] text-white" />
                    </div>
                    <h3 className="font-bold text-foreground text-[15px] mb-1.5">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════
            SECTION 5 — PAYMENT METHODS
            ═══════════════════════════════════════ */}
        <section className="mt-16 sm:mt-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="text-center mb-10">
              <span className="inline-block text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-brand mb-3">
                {tx("طرق الدفع", "Méthodes de paiement", "Payment")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                {tx("اختر طريقة الدفع", "Choisissez votre méthode", "Choose Your Payment Method")}
              </h2>
            </motion.div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {paymentMethods.map((method, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="bg-card rounded-xl sm:rounded-2xl p-3 sm:p-6 md:p-8 border border-border/50 flex items-center justify-center hover:border-brand/30 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg cursor-default min-h-[80px] sm:min-h-[120px]"
                >
                  <img
                    src={method.logo}
                    alt={method.name}
                    className="h-10 sm:h-16 md:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════
            SECTION 6 — PAYMENT DETAILS
            ═══════════════════════════════════════ */}
        <section className="mt-16 sm:mt-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeInUp}
            className="bg-card/90 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 md:p-10 border border-border/60 shadow-xl relative overflow-hidden"
          >
            {/* Gradient accent bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand via-emerald-500 to-brand opacity-80" />

            <div className="mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-black text-foreground mb-2">
                {tx("معلومات الحساب البنكي (CIH Bank)", "Informations bancaires CIH Bank", "CIH Bank Information")}
              </h3>
              <p className="text-sm text-muted-foreground font-medium">
                {tx(
                  "انسخ المعلومات أدناه لإتمام عملية التحويل البنكي بسهولة.",
                  "Copiez les informations ci-dessous pour effectuer votre virement facilement.",
                  "Copy the details below to complete your bank transfer easily."
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {bankDetails.map((item, index) => {
                const Icon = item.icon;
                const isCopied = copiedKey === item.value;

                return (
                  <div
                    key={index}
                    className="bg-background/60 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/40 hover:border-brand/20 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5 text-brand" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-muted-foreground mb-0.5">{item.label}</p>
                        <p className="text-sm sm:text-[15px] font-normal text-foreground tracking-wide break-all sm:break-words select-all leading-snug">
                          {item.value}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleCopy(item.value, item.label)}
                      variant="ghost"
                      className={`h-9 px-4 rounded-lg font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 transition-all duration-200 w-full sm:w-auto cursor-pointer ${
                        isCopied
                          ? "bg-emerald-500 text-white hover:bg-emerald-500 hover:text-white"
                          : "bg-secondary/80 text-foreground hover:bg-brand hover:text-white border border-border/60"
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white animate-scale-in" />
                          <span>{tx("تم النسخ ✓", "Copié ✓", "Copied ✓")}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{tx("نسخ", "Copier", "Copy")}</span>
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Inline WhatsApp CTA inside card */}
            <div className="mt-8 pt-6 border-t border-border/40">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-14 sm:h-16 text-base sm:text-lg font-black bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgba(37,211,102,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(37,211,102,0.35)] flex items-center justify-center gap-2.5 group"
              >
                <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7 group-hover:rotate-12 transition-transform" />
                <span>{tx("لقد أتممت الدفع — أرسل الوصل", "J'ai effectué mon paiement", "I've Completed My Payment")}</span>
              </a>
              <p className="mt-3 text-center text-xs sm:text-sm text-muted-foreground font-medium">
                {tx(
                  "دعم مباشر عبر الواتساب • تفعيل في أقل من 5 دقائق",
                  "Support direct via WhatsApp • Activation en moins de 5 minutes",
                  "Direct WhatsApp support • Activation in under 5 minutes"
                )}
              </p>
            </div>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════
            SECTION 7 — FAQ
            ═══════════════════════════════════════ */}
        <section className="mt-16 sm:mt-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="text-center mb-10">
              <span className="inline-block text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-brand mb-3">
                {tx("أسئلة شائعة", "Questions fréquentes", "FAQ")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                {tx("هل لديك أسئلة؟", "Des questions ?", "Have Questions?")}
              </h2>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-card rounded-2xl sm:rounded-[1.75rem] border border-border/60 overflow-hidden divide-y divide-border/40"
            >
              {faqItems.map((item, index) => (
                <div key={index}>
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-start hover:bg-muted/30 transition-colors duration-200 cursor-pointer"
                  >
                    <span className="text-[15px] sm:text-base font-semibold text-foreground pe-4">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                        openFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-muted-foreground leading-relaxed">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ═══════ SIGN OUT ═══════ */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <SignOutButton>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 text-sm font-bold rounded-xl cursor-pointer"
            >
              <LogOut className={`w-4 h-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
              {t("pending_logout")}
            </Button>
          </SignOutButton>
        </motion.div>
      </main>

      {/* ═══════════════════════════════════════
          STICKY WHATSAPP CTA
          ═══════════════════════════════════════ */}
      <AnimatePresence>
        {showStickyCta && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-0 inset-x-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border/60 px-4 py-3 sm:py-4"
          >
            <div className="max-w-xl mx-auto">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-12 sm:h-14 text-sm sm:text-base font-black bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgba(37,211,102,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(37,211,102,0.4)] flex items-center justify-center gap-2.5 animate-pulse-ring"
                style={{ animationDuration: "3s" }}
              >
                <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>{tx("لقد أتممت الدفع ✓", "J'ai effectué mon paiement ✓", "I've Completed My Payment ✓")}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PendingPage() {
  return <PendingContent />;
}
