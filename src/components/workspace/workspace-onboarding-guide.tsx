"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  CheckCircle2,
  Circle,
  Key,
  MapPin,
  MessageSquare,
  Users,
  Receipt,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Play,
  Pause,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Building2,
  Phone,
  FileText,
  Clock,
  Volume2,
  Calendar,
  Zap,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/components/landing/LanguageProvider";
import { cn } from "@/lib/utils";

interface StepItem {
  id: number;
  badge: { ar: string; fr: string; en: string };
  title: { ar: string; fr: string; en: string };
  desc: { ar: string; fr: string; en: string };
  icon: any;
  actionText: { ar: string; fr: string; en: string };
  actionHref: string;
}

const STEPS: StepItem[] = [
  {
    id: 1,
    badge: { ar: "الخطوة 1 • مفاتيح الربط", fr: "Étape 1 • Clés API", en: "Step 1 • API Keys" },
    title: {
      ar: "ربط مفاتيح الذكاء الاصطناعي الخاصة بك (BYOK)",
      fr: "Connectez Vos Propres Clés API (BYOK)",
      en: "Connect Your Own API Keys (BYOK)",
    },
    desc: {
      ar: "اربط مفاتيحك المباشرة في OpenAI أو Gemini أو Groq. أنت تدفع السعر الحقيقي الخام مباشرة للمزود بدون أي هوامش ربح وسيطة أو قيود خفية.",
      fr: "Connectez vos clés directes OpenAI, Gemini ou Groq. Vous payez le coût brut du fournisseur sans marge intermédiaire ni restrictions cachées.",
      en: "Connect your direct OpenAI, Gemini, or Groq API keys. You pay raw provider wholesale costs with zero platform markups.",
    },
    icon: Key,
    actionText: {
      ar: "إعداد المفاتيح في الإعدادات",
      fr: "Configurer les Clés dans Paramètres",
      en: "Configure Keys in Settings",
    },
    actionHref: "/workspace/settings",
  },
  {
    id: 2,
    badge: { ar: "الخطوة 2 • استهداف السوق", fr: "Étape 2 • Ciblage Marché", en: "Step 2 • Market Niche" },
    title: {
      ar: "تحديد المدينة والنشاط التجاري المستهدف",
      fr: "Définissez Votre Ville & Niche Cibles",
      en: "Select Your Target Moroccan City & Niche",
    },
    desc: {
      ar: "اختر مدينتك (كازا، الرباط، مراكش، طنجة) والنشاط الذي يحقق أعلى عائد شهري (عيادات الأسنان، وكالات العقار، كراء السيارات).",
      fr: "Choisissez votre ville marocaine (Casablanca, Rabat, Marrakech, Tanger) et la niche la plus rentable (cliniques, immobilier, location de voitures).",
      en: "Pick your target Moroccan market (Casablanca, Rabat, Marrakech, Tangier) and high-ticket niche (clinics, real estate, car rentals).",
    },
    icon: Building2,
    actionText: {
      ar: "تصفح جداول بيانات الوكالة",
      fr: "Consulter les Tableurs Agence",
      en: "Explore Agency Sheets",
    },
    actionHref: "/workspace/sheets",
  },
  {
    id: 3,
    badge: { ar: "الخطوة 3 • استخراج الشركات", fr: "Étape 3 • Scraping Google Maps", en: "Step 3 • Lead Scraping" },
    title: {
      ar: "استخراج 50+ شركة مؤهلة مع أرقام الواتساب",
      fr: "Extrayez 50+ Entreprises Qualifiées sur Maps",
      en: "Extract 50+ Qualified Local Leads on Google Maps",
    },
    desc: {
      ar: "استخدم رادار خرائط جوجل للبحث عن الأنشطة التجارية والحصول فوراً على أرقام الواتساب المباشرة والتقييمات والعناوين بنقرة زر واحدة.",
      fr: "Utilisez le radar Maps pour localiser les entreprises cibles et récupérer instantanément leurs numéros WhatsApp directs et notes.",
      en: "Deploy the Maps Intelligence Scraper to extract direct WhatsApp numbers, ratings, and physical addresses in minutes.",
    },
    icon: MapPin,
    actionText: {
      ar: "تشغيل مستخرج الخرائط",
      fr: "Lancer le Scraper Maps",
      en: "Launch Maps Scraper",
    },
    actionHref: "/workspace/scraper",
  },
  {
    id: 4,
    badge: { ar: "الخطوة 4 • رسائل الواتساب بالدارجة", fr: "Étape 4 • Outreach Darija", en: "Step 4 • WhatsApp Outreach" },
    title: {
      ar: "إرسال التسجيل الصوتي بالدارجة (نسبة رد 84%+)",
      fr: "Envoyez l'Audio en Darija (84%+ de Taux de Réponse)",
      en: "Deploy Proven Darija Audio Pitches (84%+ Open Rate)",
    },
    desc: {
      ar: "أصحاب الشركات بالمغرب يتجاهلون الإيميلات الطويلة ويتفاعلون فوراً مع الرسائل والتسجيلات الصوتية بالدارجة التي تعالج ضياع الزبائن.",
      fr: "Les patrons marocains ignorent les emails formels et répondent immédiatement aux vocaux ciblés en Darija qui résolvent la perte de clients.",
      en: "Moroccan decision-makers ignore cold text emails but convert rapidly to 35-second localized Darija audio pitch notes.",
    },
    icon: MessageSquare,
    actionText: {
      ar: "فتح استوديو الواتساب",
      fr: "Ouvrir le Studio WhatsApp",
      en: "Open WhatsApp Studio",
    },
    actionHref: "/workspace/whatsapp",
  },
  {
    id: 5,
    badge: { ar: "الخطوة 5 • إدارة الصفقات والـ Devis", fr: "Étape 5 • CRM & Devis MAD", en: "Step 5 • CRM & Devis MAD" },
    title: {
      ar: "إدارة المراحل وإنشاء Devis مغربي بدفعة 50%",
      fr: "Gérez les Deals & Créez des Devis (50% d'Acompte)",
      en: "Track Deals in CRM & Send Legal Moroccan Devis",
    },
    desc: {
      ar: "نظم العملاء في الـ CRM من مرحلة النقاش حتى الإغلاق. أنشئ عروض أسعار (Devis) رسمية بالدرهم مع شرط دفعة مقدمة 50% قبل البدء.",
      fr: "Suivez vos prospects dans le CRM. Générez des devis officiels en MAD avec clause d'acompte 50% obligatoire à la signature.",
      en: "Organize clients in the Moroccan CRM. Generate compliant quotes (Devis) with mandatory 50% upfront deposits before starting.",
    },
    icon: Receipt,
    actionText: {
      ar: "إنشاء Devis وفاتورة جديدة",
      fr: "Créer un Devis ou Facture",
      en: "Create Devis & Invoices",
    },
    actionHref: "/workspace/invoices",
  },
  {
    id: 6,
    badge: { ar: "الخطوة 6 • تحدي الـ 60 يوماً", fr: "Étape 6 • Challenge 60 Jours", en: "Step 6 • 60-Day Sprint" },
    title: {
      ar: "الانضمام للمكالمات الأسبوعية وتحدي أول عميل",
      fr: "Participez aux Lives & Signez Votre Premier Client",
      en: "Attend Weekly Live Strategy Rooms & Land Client #1",
    },
    desc: {
      ar: "احضر الجلسات المباشرة كل ثلاثاء وسبت مع سعد، والتزم بخطة المهام اليومية في التحدي حتى تتأكد من دخول أول تحويل بنكي لحسابك.",
      fr: "Rejoignez les sessions live du mardi et samedi avec Saad, et suivez la feuille de route quotidienne du challenge 60 jours.",
      en: "Join Tuesday & Saturday live deal strategy rooms with Saad, and execute the daily accountability sprint until your first client clears.",
    },
    icon: GraduationCap,
    actionText: {
      ar: "فتح خريطة تحدي الـ 60 يوماً",
      fr: "Ouvrir le Challenge 60 Jours",
      en: "Open 60-Day Challenge Sprint",
    },
    actionHref: "/dashboard/challenge",
  },
];

export function WorkspaceOnboardingGuide() {
  const { dir, language, isRTL } = useLanguage();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [copiedScript, setCopiedScript] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Selected Niche Simulator state
  const [selectedCity, setSelectedCity] = useState("Casablanca");
  const [selectedNiche, setSelectedNiche] = useState("Cliniques Dentaires");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("eensell_onboarding_completed_steps");
      if (saved) {
        setCompletedSteps(JSON.parse(saved));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const toggleStepCompleted = (stepId: number) => {
    setCompletedSteps((prev) => {
      const next = prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId];
      try {
        localStorage.setItem("eensell_onboarding_completed_steps", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const resetProgress = () => {
    setCompletedSteps([]);
    try {
      localStorage.removeItem("eensell_onboarding_completed_steps");
    } catch (e) {}
    toast.info(
      language === "ar"
        ? "تمت إعادة تعيين تقدم الدليل"
        : language === "fr"
        ? "Progression réinitialisée"
        : "Guide progress reset"
    );
  };

  const progressPercent = Math.round((completedSteps.length / STEPS.length) * 100);

  const darijaPitchScript = `Salam Dr. [Nom], tbarkellah 3la l'cabinet dyalkom f [Quartier].
Lahit fikom annahom bzaf d les patients kaykheliw des messages f WhatsApp f l'weekend wla mora 19h w makaylqawch jwab f l'waqt, chi li kaykhellihom ymchiw 3nd cabinet akhor.
Gadit wahd l'système IA automatique li kayjawb f WhatsApp 24/7 b Darija w Français, kaychreh l'tarifs w kay-réserver l'rendez-vous direct f l'agenda.
Wash Momkin nwrrih lik f 2 minutes f appel Zoom kiffash kaykheddem?`;

  const copyScriptToClipboard = () => {
    navigator.clipboard.writeText(darijaPitchScript);
    setCopiedScript(true);
    toast.success(
      language === "ar"
        ? "تم نسخ سيناريو الواتساب بالدارجة بنجاح!"
        : language === "fr"
        ? "Script WhatsApp en Darija copié !"
        : "Darija WhatsApp pitch script copied!"
    );
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <div dir={dir} className="w-full max-w-6xl mx-auto space-y-8 select-text pb-20">
      {/* ── Top Header Hero Banner ── */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-white dark:bg-[#1E1E1E] border border-slate-200/90 dark:border-[#2E2E2E] shadow-sm overflow-hidden">
        {/* Subtle decorative lighting */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-[#FF6B4A]" />
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold tracking-wide uppercase">
              <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>
                {language === "ar"
                  ? "دليل الإطلاق السريع • Eensell Workspace OS"
                  : language === "fr"
                  ? "Guide de Démarrage Rapide • Eensell OS"
                  : "Agency Fast-Track Onboarding • Eensell OS"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
              {language === "ar" ? (
                <>
                  خارطة الطريق العملية لإطلاق{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-indigo-600 to-[#FF6B4A]">
                    وكالتك للذكاء الاصطناعي بالمغرب.
                  </span>
                </>
              ) : language === "fr" ? (
                <>
                  La Feuille de Route pour Lancer{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-indigo-600 to-[#FF6B4A]">
                    Votre Agence IA au Maroc.
                  </span>
                </>
              ) : (
                <>
                  The Step-by-Step Blueprint to Scale{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-indigo-600 to-[#FF6B4A]">
                    Your Moroccan B2B AI Agency.
                  </span>
                </>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              {language === "ar"
                ? "دليل تطبيقي شامل لربط مفاتيحك، استخراج بيانات أصحاب القرار في كازا والرباط ومراكش، إرسال عروض الواتساب بالدارجة، وتوقيع عقود شهرية بين 10,000 و 30,000 درهم."
                : language === "fr"
                ? "Un guide d'implémentation complet pour connecter vos clés API, scraper les décideurs locaux, déployer les scripts WhatsApp en Darija et signer des forfaits de 10 000 à 30 000 MAD."
                : "A practical step-by-step onboarding guide to connect your API keys, scrape local Moroccan decision-makers, launch Darija WhatsApp pitches, and close 10,000 to 30,000 MAD retainers."}
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-slate-50 dark:bg-[#181818] p-5 rounded-2xl border border-slate-200/80 dark:border-[#2C2C2C] shrink-0 w-full md:w-64 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === "ar" ? "نسبة الإنجاز" : language === "fr" ? "Progression" : "Progress"}
              </span>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {progressPercent}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>
                {completedSteps.length} / {STEPS.length}{" "}
                {language === "ar" ? "خطوات مكتملة" : language === "fr" ? "étapes validées" : "steps completed"}
              </span>
              {completedSteps.length > 0 && (
                <button
                  onClick={resetProgress}
                  className="hover:text-rose-500 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{language === "ar" ? "إعادة" : language === "fr" ? "Réinitialiser" : "Reset"}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 6 Main Interactive Onboarding Steps ── */}
      <div className="grid grid-cols-1 gap-6">
        {STEPS.map((step) => {
          const isDone = completedSteps.includes(step.id);
          const isExpanded = activeStep === step.id;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={cn(
                "rounded-3xl border transition-all duration-300 bg-white dark:bg-[#1E1E1E] overflow-hidden",
                isDone
                  ? "border-emerald-500/40 shadow-xs"
                  : isExpanded
                  ? "border-slate-300 dark:border-slate-600 shadow-md ring-2 ring-slate-900/5 dark:ring-white/5"
                  : "border-slate-200/80 dark:border-[#2C2C2C] hover:border-slate-300"
              )}
            >
              {/* Step Header Accordion Toggle */}
              <div
                onClick={() => setActiveStep(isExpanded ? 0 : step.id)}
                className="p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 dark:hover:bg-[#252525] transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Step Completion Toggle Checkbox */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStepCompleted(step.id);
                    }}
                    title={isDone ? "Mark incomplete" : "Mark as completed"}
                    className="p-1 rounded-lg hover:scale-110 transition-transform cursor-pointer shrink-0"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-500/10" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600 hover:text-emerald-500" />
                    )}
                  </button>

                  {/* Icon */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                      isDone
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {step.badge[language]}
                      </span>
                      {isDone && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                          {language === "ar" ? "مكتمل ✓" : language === "fr" ? "Complété ✓" : "Done ✓"}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white truncate">
                      {step.title[language]}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                    {isExpanded
                      ? language === "ar"
                        ? "طي التفاصيل"
                        : language === "fr"
                        ? "Masquer"
                        : "Collapse"
                      : language === "ar"
                      ? "عرض التفاصيل"
                      : language === "fr"
                      ? "Détails"
                      : "Expand"}
                  </span>
                  <div className={cn("w-2 h-2 rounded-full", isDone ? "bg-emerald-500" : "bg-slate-300")} />
                </div>
              </div>

              {/* Step Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="border-t border-slate-100 dark:border-[#282828] p-5 sm:p-8 space-y-6 bg-[#FAFAF9]/60 dark:bg-[#1A1A1A]/60"
                  >
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {step.desc[language]}
                    </p>

                    {/* ── STEP-SPECIFIC INTERACTIVE WIDGETS ── */}

                    {/* Step 1: BYOK Simulation */}
                    {step.id === 1 && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#202020] border border-slate-200 dark:border-[#303030] space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                          <div className="flex items-center gap-2">
                            <Key className="w-4 h-4 text-amber-500" />
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {language === "ar"
                                ? "قائمة المزودين المدعومين (بدون عمولات)"
                                : language === "fr"
                                ? "Fournisseurs Supportés (Tarifs Bruts)"
                                : "Supported Providers (Direct Wholesale Pricing)"}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                            100% Data Privacy
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#181818] border border-slate-200/80 dark:border-[#2A2A2A] space-y-1">
                            <p className="font-bold text-slate-900 dark:text-white">OpenAI (GPT-4o)</p>
                            <p className="text-slate-500 text-[11px]">sk-proj-••••••••••••</p>
                            <span className="inline-block text-[10px] text-emerald-600 font-semibold">
                              ✓ Cold Email & WhatsApp
                            </span>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#181818] border border-slate-200/80 dark:border-[#2A2A2A] space-y-1">
                            <p className="font-bold text-slate-900 dark:text-white">Google Gemini 1.5</p>
                            <p className="text-slate-500 text-[11px]">AIzaSy••••••••••••</p>
                            <span className="inline-block text-[10px] text-emerald-600 font-semibold">
                              ✓ Fast Context Extraction
                            </span>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#181818] border border-slate-200/80 dark:border-[#2A2A2A] space-y-1">
                            <p className="font-bold text-slate-900 dark:text-white">Groq / Llama 3</p>
                            <p className="text-slate-500 text-[11px]">gsk_••••••••••••</p>
                            <span className="inline-block text-[10px] text-emerald-600 font-semibold">
                              ✓ Ultra-Low Latency
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Niche Selector & Retainer Calculator */}
                    {step.id === 2 && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#202020] border border-slate-200 dark:border-[#303030] space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                          <Building2 className="w-4 h-4 text-indigo-500" />
                          <span>
                            {language === "ar"
                              ? "محاكي اختيار النشاط والمدينة المغربية"
                              : language === "fr"
                              ? "Simulateur de Niche & Potentiel Mensuel"
                              : "Moroccan Niche & Monthly Retainer Estimator"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* City selector */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                              {language === "ar" ? "المدينة المستهدفة:" : language === "fr" ? "Ville :" : "City:"}
                            </label>
                            <select
                              value={selectedCity}
                              onChange={(e) => setSelectedCity(e.target.value)}
                              className="w-full text-xs font-semibold bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-[#333] rounded-xl p-2.5 text-slate-900 dark:text-white"
                            >
                              <option value="Casablanca">Casablanca (Anfa, Maarif, Gauthier)</option>
                              <option value="Rabat">Rabat (Agdal, Hay Riad, Souissi)</option>
                              <option value="Marrakech">Marrakech (Guéliz, Hivernage)</option>
                              <option value="Tanger">Tanger (Malabata, Centre Ville)</option>
                              <option value="Agadir">Agadir (Centre, Founty)</option>
                            </select>
                          </div>

                          {/* Niche selector */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                              {language === "ar" ? "النشاط التجاري:" : language === "fr" ? "Niche :" : "Niche:"}
                            </label>
                            <select
                              value={selectedNiche}
                              onChange={(e) => setSelectedNiche(e.target.value)}
                              className="w-full text-xs font-semibold bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-[#333] rounded-xl p-2.5 text-slate-900 dark:text-white"
                            >
                              <option value="Cliniques Dentaires">Cabinet / Clinique Dentaire</option>
                              <option value="Agences Immobilières">Agence Immobilière & Promotion</option>
                              <option value="Location de Voitures">Agence de Location de Voitures</option>
                              <option value="Centres Esthétiques">Centre Esthétique & Laser</option>
                            </select>
                          </div>
                        </div>

                        {/* Estimated Metric Card */}
                        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                              {selectedNiche} &bull; {selectedCity}
                            </p>
                            <p className="text-[11px] text-slate-600 dark:text-slate-300">
                              {language === "ar"
                                ? "متوسط قيمة العقد الشهري (Retainer):"
                                : language === "fr"
                                ? "Forfait mensuel recommandé :"
                                : "Recommended monthly retainer:"}
                            </p>
                          </div>
                          <span className="text-sm sm:text-base font-black text-emerald-600 font-mono">
                            12,000 – 18,000 MAD
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Maps Scraper Preview */}
                    {step.id === 3 && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#202020] border border-slate-200 dark:border-[#303030] space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-emerald-500" />
                            <span>
                              {language === "ar"
                                ? "مثال لبيانات المستخرج في كازا والرباط"
                                : language === "fr"
                                ? "Aperçu des données extraites (Maps Radar)"
                                : "Sample Extracted Leads in Casablanca & Rabat"}
                            </span>
                          </span>
                          <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-bold">
                            Live Demo Data
                          </span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left rtl:text-right text-xs">
                            <thead>
                              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400">
                                <th className="pb-2">Nom / Business</th>
                                <th className="pb-2">WhatsApp Direct</th>
                                <th className="pb-2">Avis Google</th>
                                <th className="pb-2">Statut</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                              <tr>
                                <td className="py-2.5 font-bold text-slate-900 dark:text-white">
                                  Cabinet Dentaire Dr. Alami Gauthier
                                </td>
                                <td className="py-2.5 font-mono text-emerald-600">+212 6 61 24 88 19</td>
                                <td className="py-2.5">⭐ 4.9 (184 avis)</td>
                                <td className="py-2.5">
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 font-bold">
                                    Qualifié
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2.5 font-bold text-slate-900 dark:text-white">
                                  Agence Immobilière Guéliz Prestige
                                </td>
                                <td className="py-2.5 font-mono text-emerald-600">+212 6 62 10 45 90</td>
                                <td className="py-2.5">⭐ 4.8 (92 avis)</td>
                                <td className="py-2.5">
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 font-bold">
                                    Qualifié
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Darija Pitch Script & Voice Note Simulator */}
                    {step.id === 4 && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#202020] border border-slate-200 dark:border-[#303030] space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <MessageSquare className="w-4 h-4 text-[#25D366]" />
                            <span>
                              {language === "ar"
                                ? "سيناريو الواتساب بالدارجة الأكثر تحويلاً"
                                : language === "fr"
                                ? "Script WhatsApp Darija Éprouvé"
                                : "Highest-Converting Darija WhatsApp Pitch"}
                            </span>
                          </span>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={copyScriptToClipboard}
                            className="h-8 text-xs font-bold flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800"
                          >
                            {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedScript ? (language === "ar" ? "تم النسخ!" : "Copié !") : language === "ar" ? "نسخ النص" : "Copier"}</span>
                          </Button>
                        </div>

                        {/* Script container */}
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#181818] border border-slate-200/80 dark:border-[#2A2A2A] font-mono text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-left rtl:text-right">
                          {darijaPitchScript}
                        </div>

                        {/* Simulated Audio Note Player Bar */}
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                            className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                          >
                            {isPlayingAudio ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-900 dark:text-white mb-1">
                              <span>voice_note_pitch_darija.mp3</span>
                              <span className="font-mono text-emerald-600">0:34 min</span>
                            </div>
                            <div className="w-full h-1.5 bg-emerald-200 dark:bg-emerald-950 rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  "h-full bg-[#25D366] rounded-full transition-all duration-300",
                                  isPlayingAudio ? "w-2/3 animate-pulse" : "w-1/4"
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 5: Devis & Invoicing Simulator */}
                    {step.id === 5 && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#202020] border border-slate-200 dark:border-[#303030] space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                          <span className="flex items-center gap-1.5">
                            <Receipt className="w-4 h-4 text-amber-500" />
                            <span>
                              {language === "ar"
                                ? "نموذج Devis مغربي رسمي بقيمة 15,000 درهم"
                                : language === "fr"
                                ? "Exemple de Devis Marocain Conforme"
                                : "Compliant Moroccan Devis & Invoicing Standard"}
                            </span>
                          </span>
                          <span className="text-[10px] font-mono text-amber-700 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full font-bold">
                            50% Deposit Clause
                          </span>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#181818] border border-slate-200/80 dark:border-[#2C2C2C] space-y-2 text-xs">
                          <div className="flex justify-between font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800">
                            <span>Mise en Place Bot WhatsApp IA + Scraping Leads</span>
                            <span className="font-mono">15,000 MAD</span>
                          </div>
                          <div className="flex justify-between text-slate-500 text-[11px]">
                            <span>Acompte exigible à la signature (50%) :</span>
                            <span className="font-bold text-emerald-600 font-mono">7,500 MAD</span>
                          </div>
                          <div className="flex justify-between text-slate-500 text-[11px]">
                            <span>Solde à la livraison (50%) :</span>
                            <span className="font-mono">7,500 MAD</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 6: 60-Day Sprint Details */}
                    {step.id === 6 && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#202020] border border-slate-200 dark:border-[#303030] space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                          <Calendar className="w-4 h-4 text-indigo-500" />
                          <span>
                            {language === "ar"
                              ? "مواعيد غرف الصفقات المباشرة (Zoom Live)"
                              : language === "fr"
                              ? "Sessions Stratégiques en Direct (Zoom)"
                              : "Weekly Live Deal Closing Rooms"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#181818] border border-slate-200/80 dark:border-[#2A2A2A] space-y-1">
                            <p className="font-bold text-slate-900 dark:text-white">
                              {language === "ar" ? "كل ثلاثاء • 20:30 مساءً" : "Chaque Mardi • 20h30"}
                            </p>
                            <p className="text-slate-500 text-[11px]">
                              {language === "ar"
                                ? "مراجعة العروض والـ Devis المباشرة"
                                : "Revue des devis & audit des pitches"}
                            </p>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#181818] border border-slate-200/80 dark:border-[#2A2A2A] space-y-1">
                            <p className="font-bold text-slate-900 dark:text-white">
                              {language === "ar" ? "كل سبت • 19:00 مساءً" : "Chaque Samedi • 19h00"}
                            </p>
                            <p className="text-slate-500 text-[11px]">
                              {language === "ar"
                                ? "تقنيات الأتمتة وإغلاق الصفقات الصعبة"
                                : "Déblocage technique Make.com & Closing"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => toggleStepCompleted(step.id)}
                        className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        {isDone ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>
                              {language === "ar" ? "تم وضع علامة إكمال" : "Étape marquée complétée"}
                            </span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-4 h-4 text-slate-400" />
                            <span>
                              {language === "ar" ? "تحديد هذه الخطوة كمكتملة" : "Marquer comme complétée"}
                            </span>
                          </>
                        )}
                      </button>

                      <Link href={step.actionHref}>
                        <Button
                          size="sm"
                          className="h-9 px-4 rounded-xl text-xs font-bold bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                          <span>{step.actionText[language]}</span>
                          <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* ── Bottom Fast Launch Card ── */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5 text-center sm:text-left rtl:sm:text-right">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-400 text-xs font-bold font-mono">
            <Zap className="w-3 h-3" />
            <span>{language === "ar" ? "جاهز للانطلاق" : "Prêt à Démarrer"}</span>
          </div>
          <h4 className="text-lg sm:text-xl font-bold">
            {language === "ar"
              ? "هل أكملت الخطوات؟ ابدأ استخراج أول 50 عميل الآن!"
              : language === "fr"
              ? "Prêt ? Lancez votre première recherche de 50 prospects !"
              : "Ready? Extract your first 50 local Moroccan leads now!"}
          </h4>
          <p className="text-xs text-slate-300">
            {language === "ar"
              ? "افتح مستخرج الخرائط وابدأ في جمع بيانات أصحاب القرار في مدينتك."
              : "Ouvrez le Scraper Maps et commencez à prospecter dans votre ville."}
          </p>
        </div>

        <Link href="/workspace/scraper" className="shrink-0 w-full sm:w-auto">
          <Button
            size="lg"
            className="w-full sm:w-auto h-11 px-6 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg cursor-pointer flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            <span>{language === "ar" ? "فتح مستخرج الخرائط" : "Lancer le Scraper Maps"}</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
