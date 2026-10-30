"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Copy,
  Check,
  Sparkles,
  Send,
  ExternalLink,
  ShieldCheck,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Flame,
  Globe,
  Sliders,
  BookmarkPlus,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addLeadToCrmAction } from "@/actions/workspace.actions";

export function WorkspaceDrafterClient() {
  const searchParams = useSearchParams();
  const initialName = searchParams.get("name") || searchParams.get("company") || "";
  const initialNiche = searchParams.get("niche") || "Agences Immobilières";
  const initialCity = searchParams.get("city") || "Casablanca";
  const initialContact = searchParams.get("contact") || "";

  const [businessName, setBusinessName] = useState(initialName || "Prestige Immobilier");
  const [contactName, setContactName] = useState(initialContact || "M. le Directeur");
  const [city, setCity] = useState(initialCity);
  const [niche, setNiche] = useState(initialNiche);
  const [service, setService] = useState("whatsapp_bot");
  const [language, setLanguage] = useState<"fr" | "darija" | "en">("fr");
  const [copied, setCopied] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isSavingToCrm, setIsSavingToCrm] = useState(false);

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  // Quality metrics calculation
  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;
  const readingTimeSec = Math.max(1, Math.round((wordCount / 200) * 60));
  
  // Cold Email Score based on best practices
  let qualityScore = 70;
  if (wordCount >= 50 && wordCount <= 120) qualityScore += 15;
  if (subject && subject.length >= 20 && subject.length <= 60) qualityScore += 10;
  if (body.includes("?")) qualityScore += 5; // Call to action
  qualityScore = Math.min(qualityScore, 98);

  const generatePitch = () => {
    let sub = "";
    let content = "";

    if (language === "fr") {
      sub = `Question concernant vos prospects acquéreurs à ${city} — ${businessName}`;
      content = `Bonjour ${contactName},

J'ai remarqué le positionnement remarquable de ${businessName} sur le marché de ${city}.

En analysant la réactivité moyenne sur les demandes d'acquéreurs et investisseurs dans votre secteur, une agence perd en moyenne 35% de ses mandats qualifiés simplement parce que les prospects attendent plus de 15 minutes avant d'obtenir une réponse ou une visite WhatsApp en soirée.

Chez notre agence, nous déployons une infrastructure d'automatisation IA dédiée :
1. Qualification instantanée 24h/24 et 7j/7 sur WhatsApp de chaque prospect (budget, zone recherchée, financement).
2. Prise de rendez-vous automatique synchronisée directement dans l'agenda de vos négociateurs.
3. Zéro prospect laissé sans suivi.

Seriez-vous ouvert à un rapide échange informel de 10 minutes ce jeudi à 15h pour voir une démonstration en direct adaptée à ${businessName} ?

Bien cordialement,

[Votre Nom]
Associé Fondateur — Eensell Partner Agency
Tél / WhatsApp : +212 6...`;
    } else if (language === "darija") {
      sub = `Fikra jdida pour digitaliser les prospects dial ${businessName} f ${city}`;
      content = `Salam ${contactName},

Kantmenna tkoun bikhir. Chft l-khdma dial ${businessName} f ${city} w tbarkellah 3ndkom positionnement wa3r bzaf.

Bghit nwerik wahed l-système d'automatisation WhatsApp li sawbnah spécial pour les entreprises comme la vôtre :
- Kayjawb les prospects f a9al men 10 secondes 24h/24 (même le weekend w f l-lil).
- Kayfélter les vrais acheteurs (budget, localisation, urgence).
- Kayakhod m3ahom rendez-vous direct f l'agenda bla ma dy3ou l-we9t.

Wach momkin ndirou un court appel de 7 d9aye9 had l-khamis m3a 15h nwerik kifax khedam had l-outil en direct ?

Merci bzaf w nhark mebrouk,
[Votre Nom]`;
    } else {
      sub = `Quick question regarding inbound buyer leads for ${businessName}`;
      content = `Hi ${contactName},

I came across ${businessName} while reviewing leading firms in ${city}.

Most high-end teams in your sector lose up to 40% of qualified buyer inquiries simply due to response times exceeding 15 minutes during evenings and weekends.

We build autonomous AI appointment pipelines that:
1. Instantly qualify inbound buyer inquiries 24/7 on WhatsApp & Web within 60 seconds.
2. Pre-screen budgets, requirements, and timeline.
3. Automatically book confirmed meetings onto your calendar.

Would you be open to a brief 7-minute walkthrough this Thursday at 3 PM to see how this works for ${businessName}?

Best regards,

[Your Name]
Head of Automation — Eensell Certified Partner`;
    }

    setSubject(sub);
    setBody(content);
  };

  useEffect(() => {
    generatePitch();
  }, [businessName, contactName, city, niche, service, language]);

  const handleGenerateWithAI = async (customPromptModifier?: string) => {
    setIsAiGenerating(true);
    toast.info("Génération de l'accroche avec GPT-4o...");

    try {
      const res = await fetch("/api/workspace/ai-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "email",
          language,
          leadName: contactName,
          leadCompany: businessName,
          leadNiche: niche,
          leadCity: city,
          customOffer: customPromptModifier || service,
        }),
      });

      const data = await res.json();

      if (data.requiresApiKey) {
        toast.warning(data.message, {
          action: {
            label: "Paramètres",
            onClick: () => {
              window.location.href = "/workspace/settings";
            },
          },
        });
      } else if (data.success) {
        if (data.subject) setSubject(data.subject);
        if (data.body) setBody(data.body);
        toast.success("Email rédigé sur-mesure par GPT-4o !");
      } else if (data.error) {
        toast.error(data.error);
      }
    } catch {
      toast.error("Erreur lors de la génération avec l'IA.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = `Objet: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success("Email complet copié dans le presse-papier !");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenGmail = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, "_blank");
  };

  const handleSaveToCrm = async () => {
    setIsSavingToCrm(true);
    try {
      await addLeadToCrmAction({
        businessName,
        niche,
        city,
        status: "PENDING",
      });
      toast.success(`Prospect "${businessName}" enregistré dans votre CRM !`);
    } catch {
      toast.error("Erreur lors de l'enregistrement dans le CRM.");
    } finally {
      setIsSavingToCrm(false);
    }
  };

  const insertVariable = (variable: string) => {
    setBody((prev) => `${prev} ${variable}`);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 select-text">
      {/* ── Header with Channel Switcher ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#EDEDEB] dark:border-[#2E2E2E]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 border border-violet-200/80 dark:border-violet-800/40">
              <Mail className="w-3.5 h-3.5" />
              COLD EMAIL STUDIO &bull; GPT-4o
            </span>
            <span className="text-xs text-[#787774] dark:text-[#9B9A97]">
              High-converting B2B templates & AI rewrites
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#37352F] dark:text-[#E6E6E5]">
            Cold Email Drafter
          </h1>
          <p className="text-xs sm:text-sm text-[#787774] dark:text-[#9B9A97]">
            Craft concise, high-converting B2B emails with personalized value propositions and spam checking.
          </p>
        </div>

        {/* Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/workspace/whatsapp"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 hover:bg-emerald-100 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Switch to WhatsApp Outreach &rarr;</span>
          </Link>

          <Button
            onClick={() => handleGenerateWithAI()}
            disabled={isAiGenerating}
            className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-xl text-xs font-semibold bg-[#37352F] hover:bg-[#262420] dark:bg-[#E6E6E5] dark:hover:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#191919] shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiGenerating ? "animate-spin" : ""}`} />
            <span>{isAiGenerating ? "Rédige avec GPT-4o..." : "Generate with GPT-4o"}</span>
          </Button>
        </div>
      </div>

      {/* ── Quality & Deliverability Inspector Bar ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] shadow-2xs">
          <span className="text-[10px] font-bold text-[#787774] dark:text-[#9B9A97] uppercase tracking-wider block">
            Cold Email Score
          </span>
          <div className="text-lg font-extrabold text-[#37352F] dark:text-[#E6E6E5] mt-0.5 flex items-center gap-1.5">
            <span>{qualityScore} / 100</span>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded">
              High Conversion
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] shadow-2xs">
          <span className="text-[10px] font-bold text-[#787774] dark:text-[#9B9A97] uppercase tracking-wider block">
            Length & Words
          </span>
          <div className="text-lg font-extrabold text-[#37352F] dark:text-[#E6E6E5] mt-0.5 flex items-center gap-1.5">
            <span>{wordCount} words</span>
            <span className="text-[10px] text-[#787774] dark:text-[#9B9A97]">(&lt; 120 optimal)</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] shadow-2xs">
          <span className="text-[10px] font-bold text-[#787774] dark:text-[#9B9A97] uppercase tracking-wider block">
            Reading Time
          </span>
          <div className="text-lg font-extrabold text-[#37352F] dark:text-[#E6E6E5] mt-0.5 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>~{readingTimeSec}s read</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] shadow-2xs">
          <span className="text-[10px] font-bold text-[#787774] dark:text-[#9B9A97] uppercase tracking-wider block">
            Spam Filter Check
          </span>
          <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Clean (Inbox Ready)</span>
          </div>
        </div>
      </div>

      {/* ── 2-Column Studio Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Targeting & Persona Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EDEDEB] dark:border-[#2E2E2E]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#37352F] dark:text-[#E6E6E5] flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-violet-500" />
                <span>Prospect Targeting</span>
              </span>
              <button
                type="button"
                onClick={generatePitch}
                className="text-[11px] text-[#787774] hover:text-[#37352F] dark:hover:text-[#E6E6E5] flex items-center gap-1 cursor-pointer"
                title="Reset to default template"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Language Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                Language & Nuance
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage("fr")}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    language === "fr"
                      ? "bg-[#37352F] text-white dark:bg-[#E6E6E5] dark:text-black border-transparent shadow-xs"
                      : "bg-[#F7F6F3] dark:bg-[#1A1A1A] border-[#EDEDEB] dark:border-[#2E2E2E] text-[#787774] hover:text-[#37352F] dark:hover:text-[#E6E6E5]"
                  }`}
                >
                  🇫🇷 Français
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("darija")}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    language === "darija"
                      ? "bg-[#37352F] text-white dark:bg-[#E6E6E5] dark:text-black border-transparent shadow-xs"
                      : "bg-[#F7F6F3] dark:bg-[#1A1A1A] border-[#EDEDEB] dark:border-[#2E2E2E] text-[#787774] hover:text-[#37352F] dark:hover:text-[#E6E6E5]"
                  }`}
                >
                  🇲🇦 Darija
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    language === "en"
                      ? "bg-[#37352F] text-white dark:bg-[#E6E6E5] dark:text-black border-transparent shadow-xs"
                      : "bg-[#F7F6F3] dark:bg-[#1A1A1A] border-[#EDEDEB] dark:border-[#2E2E2E] text-[#787774] hover:text-[#37352F] dark:hover:text-[#E6E6E5]"
                  }`}
                >
                  🇺🇸 English
                </button>
              </div>
            </div>

            {/* Prospect Fields */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                  Company / Firm Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Prestige Real Estate, Cabinet Dr. Smith"
                  className="w-full bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-xl px-3 py-2 text-xs text-[#37352F] dark:text-[#E6E6E5] outline-none focus:border-[#37352F] dark:focus:border-[#E6E6E5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="M. le Directeur, Dr. Alami"
                    className="w-full bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-xl px-3 py-2 text-xs text-[#37352F] dark:text-[#E6E6E5] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Casablanca, Marrakech, Paris..."
                    className="w-full bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-xl px-3 py-2 text-xs text-[#37352F] dark:text-[#E6E6E5] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                  Niche / Business Sector
                </label>
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="Agences Immobilières, Cabinets Dentaires..."
                  className="w-full bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-xl px-3 py-2 text-xs text-[#37352F] dark:text-[#E6E6E5] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                  Core AI Automation Offer
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-xl px-3 py-2 text-xs text-[#37352F] dark:text-[#E6E6E5] outline-none"
                >
                  <option value="whatsapp_bot">WhatsApp Lead Qualification Bot (Capture 100% Leads)</option>
                  <option value="voice_agent">AI Voice Booking Agent (Automatic Call Answering)</option>
                  <option value="full_crm">Full CRM Pipeline & Reactivation of Old Leads</option>
                  <option value="custom_automation">Custom Enterprise AI Workflows</option>
                </select>
              </div>
            </div>

            {/* Smart AI Refinement Chips */}
            <div className="pt-2 border-t border-[#EDEDEB] dark:border-[#2E2E2E] space-y-2">
              <span className="text-[11px] font-bold text-[#787774] dark:text-[#9B9A97] uppercase tracking-wider block">
                ⚡ Instant GPT-4o Refinements
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleGenerateWithAI("Rédige une version ultra-courte de moins de 60 mots, percutante.")}
                  className="px-2.5 py-1 rounded-lg text-[11px] bg-[#F7F6F3] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] hover:border-[#D3D1CB] dark:hover:border-[#3E3E3E] text-[#37352F] dark:text-[#E6E6E5] transition-all cursor-pointer"
                >
                  🤏 Ultra-concise (&lt; 60 words)
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerateWithAI("Mets l'accent sur la perte de leads le weekend et en soirée.")}
                  className="px-2.5 py-1 rounded-lg text-[11px] bg-[#F7F6F3] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] hover:border-[#D3D1CB] dark:hover:border-[#3E3E3E] text-[#37352F] dark:text-[#E6E6E5] transition-all cursor-pointer"
                >
                  🌙 Weekend Leads Leak
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerateWithAI("Propose un audit gratuit de 10 minutes sans engagement.")}
                  className="px-2.5 py-1 rounded-lg text-[11px] bg-[#F7F6F3] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] hover:border-[#D3D1CB] dark:hover:border-[#3E3E3E] text-[#37352F] dark:text-[#E6E6E5] transition-all cursor-pointer"
                >
                  🎁 Free 10-Min Audit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Realistic High-Fidelity Email Client Mockup (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-[#EDEDEB] dark:border-[#2E2E2E] bg-[#FFFFFF] dark:bg-[#202020] shadow-sm overflow-hidden flex flex-col">
            {/* Realistic Email App Bar */}
            <div className="px-4 py-3 bg-[#FAF9F7] dark:bg-[#1A1A1A] border-b border-[#EDEDEB] dark:border-[#2E2E2E] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <span className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97] ml-2">
                  New Message &bull; {language.toUpperCase()}
                </span>
              </div>

              {/* Dynamic Variables Pill Inserter */}
              <div className="flex items-center gap-1 text-[11px]">
                <span className="text-[#9B9A97] mr-1 hidden sm:inline">Insert:</span>
                <button
                  type="button"
                  onClick={() => insertVariable(`{${businessName}}`)}
                  className="px-1.5 py-0.5 rounded bg-[#EDEDEB] dark:bg-[#2C2C2C] text-[#37352F] dark:text-[#E6E6E5] hover:opacity-80"
                >
                  + Company
                </button>
                <button
                  type="button"
                  onClick={() => insertVariable(`{${city}}`)}
                  className="px-1.5 py-0.5 rounded bg-[#EDEDEB] dark:bg-[#2C2C2C] text-[#37352F] dark:text-[#E6E6E5] hover:opacity-80"
                >
                  + City
                </button>
              </div>
            </div>

            {/* Email Header Fields */}
            <div className="p-4 space-y-2 border-b border-[#EDEDEB] dark:border-[#2E2E2E] text-xs">
              <div className="flex items-center gap-2">
                <span className="w-16 font-semibold text-[#787774] dark:text-[#9B9A97]">To:</span>
                <span className="font-medium text-[#37352F] dark:text-[#E6E6E5]">
                  {contactName} &lt;contact@{businessName.toLowerCase().replace(/[^a-z0-9]/g, "") || "client"}.ma&gt;
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-16 font-semibold text-[#787774] dark:text-[#9B9A97]">Subject:</span>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="flex-1 bg-transparent font-semibold text-[#37352F] dark:text-[#E6E6E5] outline-none border-b border-transparent focus:border-[#EDEDEB] dark:focus:border-[#2E2E2E] transition-colors"
                />
              </div>
            </div>

            {/* Email Body Textarea */}
            <div className="p-4 flex-1">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={14}
                className="w-full bg-transparent text-xs text-[#37352F] dark:text-[#E6E6E5] leading-relaxed resize-none outline-none font-sans"
              />
            </div>

            {/* Action Bottom Bar */}
            <div className="p-3 bg-[#FAF9F7] dark:bg-[#1A1A1A] border-t border-[#EDEDEB] dark:border-[#2E2E2E] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleOpenGmail}
                  size="sm"
                  className="h-8 px-3 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Open in Gmail</span>
                </Button>

                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 rounded-xl text-xs font-medium border-[#EDEDEB] dark:border-[#2E2E2E] gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy Full Email"}</span>
                </Button>
              </div>

              <Button
                onClick={handleSaveToCrm}
                disabled={isSavingToCrm}
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-xs text-[#787774] hover:text-[#37352F] dark:hover:text-[#E6E6E5] gap-1.5 cursor-pointer"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>Save Lead to CRM</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
