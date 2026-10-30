"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Send,
  Phone,
  Copy,
  Check,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ExternalLink,
  ShieldCheck,
  Clock,
  RotateCcw,
  CheckCheck,
  User,
  Sliders,
  BookmarkPlus,
  Mail,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addLeadToCrmAction } from "@/actions/workspace.actions";

export function WorkspaceWhatsappClient() {
  const searchParams = useSearchParams();
  const initialName = searchParams.get("name") || searchParams.get("company") || "";
  const initialPhone = searchParams.get("phone") || "";
  const initialCity = searchParams.get("city") || "Casablanca";
  const initialNiche = searchParams.get("niche") || "Agences Immobilières";

  const [businessName, setBusinessName] = useState(initialName || "Atlas Prime Immobilier");
  const [contactName, setContactName] = useState("M. le Directeur");
  const [phoneNumber, setPhoneNumber] = useState(initialPhone || "0661234567");
  const [countryCode, setCountryCode] = useState("+212");
  const [city, setCity] = useState(initialCity);
  const [niche, setNiche] = useState(initialNiche);
  const [language, setLanguage] = useState<"darija" | "fr" | "en">("darija");
  const [hookType, setHookType] = useState<"leak" | "demo" | "voicenote" | "competitor">("leak");

  const [messageText, setMessageText] = useState("");
  const [copied, setCopied] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isSavingToCrm, setIsSavingToCrm] = useState(false);

  // Audio voice note state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Generate hook template
  const generateMessage = () => {
    let msg = "";

    if (language === "darija") {
      if (hookType === "leak") {
        msg = `Salam ${contactName} 👋 Kantmenna tkoun bikhir.
Chft l-positionnement dial ${businessName} f ${city} w tbarkellah 3ndkom demande kbira.

Suis un spécialiste en automatisation IA pour les ${niche}.
Une petite question : ch7al men prospect kay-sift msg f WhatsApp f l-lil wla le weekend w kay-mchi 7it kay-tsnna l-jawb ?

Sawbna un assistant WhatsApp intelligent li kayjawb f 3 secondes, kayfélter les budgets sérieux, w kay-fixer les rendez-vous direct f l'agenda.

Momkin n-sift lik une petite vidéo de 2 min tchouf kifax kheddam direct pour ${businessName} ?`;
      } else if (hookType === "demo") {
        msg = `Salam ${contactName} ! J'espère que vous allez bien.
3ndi fikra rapide pour digitaliser la qualification des clients dial ${businessName} f ${city}.

Est-ce que vous seriez ouvert à ce que je vous montre une démo de 3 minutes de notre bot WhatsApp en live ?
Zéro engagement, juste pour voir le potentiel pour votre équipe. 🔥`;
      } else if (hookType === "voicenote") {
        msg = `[Script Note Vocale - 25 secondes] :
"Salam ${contactName}, c'est [Votre Prénom] de l'agence Eensell Automations à ${city}. Je vous envoie ce court vocal direct car j'ai vu votre travail chez ${businessName}. On vient de déployer un système WhatsApp qui qualifie 100% des prospects en moins de 10 secondes. Si vous êtes dispo ce jeudi, je vous envoie un aperçu vidéo. Bonne journée !"`;
      } else {
        msg = `Salam ${contactName} 👋
Les meilleurs cabinets et agences à ${city} perdent souvent 30% à 40% de leurs clients qualifiés simplement par manque de réactivité après 19h.

Notre infrastructure WhatsApp IA s'occupe de tout 24h/24.
Si vous avez 5 minutes cette semaine, je vous partage le cas d'usage adapté à ${businessName} !`;
      }
    } else if (language === "fr") {
      if (hookType === "leak") {
        msg = `Bonjour ${contactName} 👋
J'espère que vous allez bien. J'ai remarqué le positionnement remarquable de ${businessName} à ${city}.

Une entreprise dans votre secteur perd en moyenne 35% de ses prospects qualifiés simplement parce que les demandes WhatsApp du soir et du weekend restent sans réponse immédiate.

Nous avons développé une infrastructure IA WhatsApp qui :
• Répond et qualifie chaque prospect en 3 secondes 24h/24 (budget, urgence, besoin).
• Réserve le rendez-vous directement dans votre calendrier.

Seriez-vous ouvert à ce que je vous partage une démo vidéo de 2 minutes adaptée à ${businessName} ?`;
      } else if (hookType === "demo") {
        msg = `Bonjour ${contactName},
Nous venons de finaliser une démonstration en direct d'assistant WhatsApp spécialisée pour les ${niche} à ${city}.

Puis-je vous envoyer le lien de la simulation de 2 minutes pour tester vous-même la réactivité de l'IA pour ${businessName} ?`;
      } else if (hookType === "voicenote") {
        msg = `[Script Message Vocal WhatsApp — 30 secondes] :
"Bonjour ${contactName}, je me permets ce court message vocal personnalisé car je suis avec attention le travail de ${businessName}. Nous avons créé un agent WhatsApp qui qualifie les demandes entrantes 24h/24 sans faire attendre vos clients. Si le sujet vous parle, je serais ravi de vous partager un aperçu de 2 minutes. Belle journée à vous !"`;
      } else {
        msg = `Bonjour ${contactName},
Les leaders dans votre secteur à ${city} automatisent désormais 70% du premier contact sur WhatsApp afin de ne laisser aucun lead qualifié filer vers la concurrence.

Avez-vous 5 minutes ce jeudi pour un rapide tour d'horizon adapté à ${businessName} ?`;
      }
    } else {
      msg = `Hi ${contactName} 👋
Quick question: how does your team at ${businessName} handle inbound WhatsApp inquiries received on evenings and weekends?

We build 24/7 autonomous WhatsApp bots that qualify budgets and schedule consultations within 60 seconds.

Open to seeing a 2-minute live interactive demo tailored for ${businessName} in ${city}?`;
    }

    setMessageText(msg);
  };

  useEffect(() => {
    generateMessage();
  }, [businessName, contactName, city, niche, language, hookType]);

  const handleGenerateWithAI = async () => {
    setIsAiGenerating(true);
    toast.info("Génération d'un message WhatsApp percutant avec GPT-4o...");

    try {
      const res = await fetch("/api/workspace/ai-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "whatsapp",
          language,
          leadName: contactName,
          leadCompany: businessName,
          leadNiche: niche,
          leadCity: city,
          customOffer: `WhatsApp Outreach Hook: ${hookType}`,
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
      } else if (data.success && data.body) {
        setMessageText(data.body);
        toast.success("Accroche WhatsApp rédigée avec GPT-4o !");
      }
    } catch {
      toast.error("Erreur lors de la génération avec l'IA.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleLaunchWhatsApp = () => {
    // Format full phone
    let cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = cleanPhone.slice(1);
    }
    const fullPhone = `${countryCode.replace("+", "")}${cleanPhone}`;
    const encodedText = encodeURIComponent(messageText);

    const waUrl = fullPhone.length > 5
      ? `https://wa.me/${fullPhone}?text=${encodedText}`
      : `https://wa.me/?text=${encodedText}`;

    window.open(waUrl, "_blank");
    toast.success("WhatsApp ouvert avec le message pré-rempli !");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    toast.success("Message copié dans le presse-papier !");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToCrm = async () => {
    setIsSavingToCrm(true);
    try {
      await addLeadToCrmAction({
        businessName,
        niche,
        city,
        phone: `${countryCode} ${phoneNumber}`,
        status: "PENDING",
      });
      toast.success(`Prospect "${businessName}" enregistré dans le CRM !`);
    } catch {
      toast.error("Erreur lors de l'enregistrement dans le CRM.");
    } finally {
      setIsSavingToCrm(false);
    }
  };

  // Voice note synthesis
  const handleGenerateVoice = async () => {
    setIsGeneratingVoice(true);
    toast.info("Génération de la note vocale avec ElevenLabs...");

    try {
      const res = await fetch("/api/workspace/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: messageText.replace(/\[.*?\]/g, ""), // strip script labels
        }),
      });

      if (res.headers.get("Content-Type")?.includes("audio")) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        toast.success("Note vocale prête à écouter !");
      } else {
        const json = await res.json();
        if (json.useWebSpeech) {
          // Fallback to native browser speech
          if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(messageText);
            utterance.lang = language === "en" ? "en-US" : "fr-FR";
            window.speechSynthesis.speak(utterance);
            toast.info("Lecture via synthèse vocale native.");
          }
        }
      }
    } catch {
      toast.error("Erreur de synthèse vocale.");
    } finally {
      setIsGeneratingVoice(false);
    }
  };

  const togglePlayAudio = () => {
    if (!audioRef.current && audioUrl) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlayingAudio(false);
    }

    if (audioRef.current) {
      if (isPlayingAudio) {
        audioRef.current.pause();
        setIsPlayingAudio(false);
      } else {
        audioRef.current.play();
        setIsPlayingAudio(true);
      }
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 select-text">
      {/* ── Top Bar ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#EDEDEB] dark:border-[#2E2E2E]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/40">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              WHATSAPP OUTREACH STUDIO &bull; 1-CLICK LAUNCH
            </span>
            <span className="text-xs text-[#787774] dark:text-[#9B9A97]">
              Pre-approved Darija & French hooks for Moroccan decision-makers
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#37352F] dark:text-[#E6E6E5]">
            WhatsApp Outreach Studio
          </h1>
          <p className="text-xs sm:text-sm text-[#787774] dark:text-[#9B9A97]">
            Launch direct WhatsApp conversations, test audio voice notes, and bypass email filters with direct owner access.
          </p>
        </div>

        {/* Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/workspace/drafter"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 border border-violet-200 dark:border-violet-800/40 hover:bg-violet-100 transition-all"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Switch to Cold Email &rarr;</span>
          </Link>

          <Button
            onClick={handleLaunchWhatsApp}
            className="inline-flex items-center gap-1.5 h-8 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Launch on WhatsApp</span>
          </Button>
        </div>
      </div>

      {/* ── 2-Column WhatsApp Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Targeting, Strategy & Hooks (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EDEDEB] dark:border-[#2E2E2E]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#37352F] dark:text-[#E6E6E5] flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-500" />
                <span>Target Prospect & Strategy</span>
              </span>
              <button
                type="button"
                onClick={generateMessage}
                className="text-[11px] text-[#787774] hover:text-[#37352F] dark:hover:text-[#E6E6E5] flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Language & Dialect Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                Language & Nuance
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage("darija")}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    language === "darija"
                      ? "bg-emerald-600 text-white border-transparent shadow-xs"
                      : "bg-[#F7F6F3] dark:bg-[#1A1A1A] border-[#EDEDEB] dark:border-[#2E2E2E] text-[#787774] hover:text-[#37352F] dark:hover:text-[#E6E6E5]"
                  }`}
                >
                  🇲🇦 Darija Business
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("fr")}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    language === "fr"
                      ? "bg-emerald-600 text-white border-transparent shadow-xs"
                      : "bg-[#F7F6F3] dark:bg-[#1A1A1A] border-[#EDEDEB] dark:border-[#2E2E2E] text-[#787774] hover:text-[#37352F] dark:hover:text-[#E6E6E5]"
                  }`}
                >
                  🇫🇷 Français Pro
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    language === "en"
                      ? "bg-emerald-600 text-white border-transparent shadow-xs"
                      : "bg-[#F7F6F3] dark:bg-[#1A1A1A] border-[#EDEDEB] dark:border-[#2E2E2E] text-[#787774] hover:text-[#37352F] dark:hover:text-[#E6E6E5]"
                  }`}
                >
                  🇺🇸 English
                </button>
              </div>
            </div>

            {/* Strategic Hook Angles */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                Proven Outreach Angle
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setHookType("leak")}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    hookType === "leak"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold"
                      : "bg-[#FAF9F7] dark:bg-[#1A1A1A] border-[#EDEDEB] dark:border-[#2E2E2E] text-[#787774]"
                  }`}
                >
                  🌙 Weekend Leak
                  <span className="block text-[10px] text-[#9B9A97] font-normal mt-0.5">Focus on lost inquiries</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHookType("demo")}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    hookType === "demo"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold"
                      : "bg-[#FAF9F7] dark:bg-[#1A1A1A] border-[#EDEDEB] dark:border-[#2E2E2E] text-[#787774]"
                  }`}
                >
                  ⚡ Instant Demo Link
                  <span className="block text-[10px] text-[#9B9A97] font-normal mt-0.5">Interactive bot walkthrough</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHookType("voicenote")}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    hookType === "voicenote"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold"
                      : "bg-[#FAF9F7] dark:bg-[#1A1A1A] border-[#EDEDEB] dark:border-[#2E2E2E] text-[#787774]"
                  }`}
                >
                  🎙️ Voice Note Pitch
                  <span className="block text-[10px] text-[#9B9A97] font-normal mt-0.5">High trust 25s audio</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHookType("competitor")}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    hookType === "competitor"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold"
                      : "bg-[#FAF9F7] dark:bg-[#1A1A1A] border-[#EDEDEB] dark:border-[#2E2E2E] text-[#787774]"
                  }`}
                >
                  🏢 Market Proof
                  <span className="block text-[10px] text-[#9B9A97] font-normal mt-0.5">Competitor speed benchmark</span>
                </button>
              </div>
            </div>

            {/* Prospect Inputs */}
            <div className="space-y-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                  Company / Agency
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Casablanca Prime Immobilier..."
                  className="w-full bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-xl px-3 py-2 text-xs text-[#37352F] dark:text-[#E6E6E5] outline-none focus:border-emerald-500"
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
                    placeholder="Dr. Mehdi, M. Berrada..."
                    className="w-full bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-xl px-3 py-2 text-xs text-[#37352F] dark:text-[#E6E6E5] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                    Target City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Casablanca, Rabat, Marrakech..."
                    className="w-full bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-xl px-3 py-2 text-xs text-[#37352F] dark:text-[#E6E6E5] outline-none"
                  />
                </div>
              </div>

              {/* Direct Phone Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                  Prospect WhatsApp Number
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-xl px-2.5 py-2 text-xs text-[#37352F] dark:text-[#E6E6E5] outline-none shrink-0"
                  >
                    <option value="+212">🇲🇦 +212 (Maroc)</option>
                    <option value="+33">🇫🇷 +33 (France)</option>
                    <option value="+971">🇦🇪 +971 (UAE)</option>
                    <option value="+1">🇺🇸 +1 (US/Canada)</option>
                  </select>

                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="06 61 23 45 67"
                    className="flex-1 bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-xl px-3 py-2 text-xs text-[#37352F] dark:text-[#E6E6E5] font-mono outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* AI Generator Button */}
            <div className="pt-2 border-t border-[#EDEDEB] dark:border-[#2E2E2E]">
              <Button
                onClick={handleGenerateWithAI}
                disabled={isAiGenerating}
                className="w-full h-8 rounded-xl text-xs font-semibold bg-[#37352F] hover:bg-[#262420] dark:bg-[#E6E6E5] dark:hover:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#191919] gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAiGenerating ? "animate-spin" : ""}`} />
                <span>{isAiGenerating ? "Rédige avec GPT-4o..." : "AI Personalize Message"}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: High-Fidelity WhatsApp Phone Chat Simulator (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl border border-[#EDEDEB] dark:border-[#2E2E2E] bg-[#EFEAE2] dark:bg-[#0B141A] shadow-lg overflow-hidden flex flex-col min-h-[500px]">
            {/* WhatsApp App Bar */}
            <div className="px-4 py-3 bg-[#008069] dark:bg-[#202C33] text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 text-white font-bold flex items-center justify-center text-xs">
                  {contactName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <span>{contactName}</span>
                    <span className="text-[10px] text-white/80 font-normal">({businessName})</span>
                  </div>
                  <div className="text-[10px] text-emerald-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    <span>en ligne</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerateVoice}
                  disabled={isGeneratingVoice}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  title="Generate ElevenLabs Audio"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isGeneratingVoice ? "Synthèse..." : "Audio Vocal"}</span>
                </button>
              </div>
            </div>

            {/* WhatsApp Chat Canvas */}
            <div className="p-4 sm:p-6 flex-1 flex flex-col justify-end space-y-3">
              {/* Voice Note Simulation Widget if Audio is ready */}
              {audioUrl && (
                <div className="self-end max-w-[85%] sm:max-w-[70%] p-3 rounded-2xl rounded-tr-xs bg-[#E7FFDB] dark:bg-[#005C4B] shadow-xs text-xs space-y-2">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={togglePlayAudio}
                      className="w-8 h-8 rounded-full bg-[#008069] text-white flex items-center justify-center cursor-pointer shadow-xs shrink-0"
                    >
                      {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>
                    <div className="flex-1 space-y-1">
                      <div className="h-2 bg-emerald-600/30 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-emerald-600 rounded-full transition-all ${
                            isPlayingAudio ? "w-full duration-5000" : "w-1/3"
                          }`}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-[#667781] dark:text-emerald-200">
                        <span>Note vocale IA (ElevenLabs)</span>
                        <span>0:24</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Realistic Outbound WhatsApp Bubble */}
              <div className="self-end max-w-[90%] sm:max-w-[75%] p-3.5 rounded-2xl rounded-tr-xs bg-[#E7FFDB] dark:bg-[#005C4B] shadow-xs text-xs text-[#111B21] dark:text-[#E9EDEF] space-y-2">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={8}
                  className="w-full bg-transparent resize-none outline-none leading-relaxed font-sans text-xs"
                />

                <div className="flex items-center justify-end gap-1 text-[10px] text-[#667781] dark:text-emerald-200 font-mono">
                  <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  <CheckCheck className="w-3.5 h-3.5 text-blue-500 inline" />
                </div>
              </div>
            </div>

            {/* Action Bottom Bar */}
            <div className="p-3.5 bg-[#F0F2F5] dark:bg-[#202C33] border-t border-[#EDEDEB] dark:border-[#2E2E2E] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleLaunchWhatsApp}
                  className="h-8 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Launch on WhatsApp Web</span>
                </Button>

                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="h-8 px-3 rounded-xl text-xs font-medium bg-white dark:bg-[#2A3942] border-[#D1D7DB] dark:border-[#374248] text-[#111B21] dark:text-[#E9EDEF] gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copié !" : "Copier"}</span>
                </Button>
              </div>

              <Button
                onClick={handleSaveToCrm}
                disabled={isSavingToCrm}
                variant="ghost"
                className="h-8 px-3 text-xs text-[#667781] dark:text-[#AEBAC1] hover:text-[#111B21] dark:hover:text-white gap-1.5 cursor-pointer"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>Save to CRM</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
