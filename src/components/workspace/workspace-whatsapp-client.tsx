"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  MessageSquare,
  Send,
  Phone,
  Video,
  ChevronLeft,
  Plus,
  Camera,
  Mic,
  Copy,
  Check,
  Sparkles,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  CheckCheck,
  Sliders,
  BookmarkPlus,
  Mail,
  Lock,
  Smile,
  Paperclip,
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
  const [currentTime, setCurrentTime] = useState("09:41");

  // Audio voice note state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // References for iPhone chat scroll and auto-resizing bubble textarea
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const phoneBubbleTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Live time for iPhone status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Generate hook template
  const generateMessage = () => {
    let msg = "";

    if (language === "darija") {
      if (hookType === "leak") {
        msg = `Salam ${contactName} 👋 Kantmenna tkoun bikhir.\nChft l-positionnement dial ${businessName} f ${city} w tbarkellah 3ndkom demande kbira.\n\nSuis un spécialiste en automatisation IA pour les ${niche}.\nUne petite question : ch7al men prospect kay-sift msg f WhatsApp f l-lil wla le weekend w kay-mchi 7it kay-tsnna l-jawb ?\n\nSawbna un assistant WhatsApp intelligent li kayjawb f 3 secondes, kayfélter les budgets sérieux, w kay-fixer les rendez-vous direct f l'agenda.\n\nMomkin n-sift lik une petite vidéo de 2 min tchouf kifax kheddam direct pour ${businessName} ?`;
      } else if (hookType === "demo") {
        msg = `Salam ${contactName} ! J'espère que vous allez bien.\n3ndi fikra rapide pour digitaliser la qualification des clients dial ${businessName} f ${city}.\n\nEst-ce que vous seriez ouvert à ce que je vous montre une démo de 3 minutes de notre bot WhatsApp en live ?\nZéro engagement, juste pour voir le potentiel pour votre équipe. 🔥`;
      } else if (hookType === "voicenote") {
        msg = `[Script Note Vocale - 25 secondes] :\n"Salam ${contactName}, c'est [Votre Prénom] de l'agence Eensell Automations à ${city}. Je vous envoie ce court vocal direct car j'ai vu votre travail chez ${businessName}. On vient de déployer un système WhatsApp qui qualifie 100% des prospects en moins de 10 secondes. Si vous êtes dispo ce jeudi, je vous envoie un aperçu vidéo. Bonne journée !"`;
      } else {
        msg = `Salam ${contactName} 👋\nLes meilleurs cabinets et agences à ${city} perdent souvent 30% à 40% de leurs clients qualifiés simplement par manque de réactivité après 19h.\n\nNotre infrastructure WhatsApp IA s'occupe de tout 24h/24.\nSi vous avez 5 minutes cette semaine, je vous partage le cas d'usage adapté à ${businessName} !`;
      }
    } else if (language === "fr") {
      if (hookType === "leak") {
        msg = `Bonjour ${contactName} 👋\nJ'espère que vous allez bien. J'ai remarqué le positionnement remarquable de ${businessName} à ${city}.\n\nUne entreprise dans votre secteur perd en moyenne 35% de ses prospects qualifiés simplement parce que les demandes WhatsApp du soir et du weekend restent sans réponse immédiate.\n\nNous avons développé une infrastructure IA WhatsApp qui :\n• Répond et qualifie chaque prospect en 3 secondes 24h/24 (budget, urgence, besoin).\n• Réserve le rendez-vous directement dans votre calendrier.\n\nSeriez-vous ouvert à ce que je vous partage une démo vidéo de 2 minutes adaptée à ${businessName} ?`;
      } else if (hookType === "demo") {
        msg = `Bonjour ${contactName},\nNous venons de finaliser une démonstration en direct d'assistant WhatsApp spécialisée pour les ${niche} à ${city}.\n\nPuis-je vous envoyer le lien de la simulation de 2 minutes pour tester vous-même la réactivité de l'IA pour ${businessName} ?`;
      } else if (hookType === "voicenote") {
        msg = `[Script Message Vocal WhatsApp — 30 secondes] :\n"Bonjour ${contactName}, je me permets ce court message vocal personnalisé car je suis avec attention le travail de ${businessName}. Nous avons créé un agent WhatsApp qui qualifie les demandes entrantes 24h/24 sans faire attendre vos clients. Si le sujet vous parle, je serais ravi de vous partager un aperçu de 2 minutes. Belle journée à vous !"`;
      } else {
        msg = `Bonjour ${contactName},\nLes leaders dans votre secteur à ${city} automatisent désormais 70% du premier contact sur WhatsApp afin de ne laisser aucun lead qualifié filer vers la concurrence.\n\nAvez-vous 5 minutes ce jeudi pour un rapide tour d'horizon adapté à ${businessName} ?`;
      }
    } else {
      msg = `Hi ${contactName} 👋\nQuick question: how does your team at ${businessName} handle inbound WhatsApp inquiries received on evenings and weekends?\n\nWe build 24/7 autonomous WhatsApp bots that qualify budgets and schedule consultations within 60 seconds.\n\nOpen to seeing a 2-minute live interactive demo tailored for ${businessName} in ${city}?`;
    }

    setMessageText(msg);
  };

  useEffect(() => {
    generateMessage();
  }, [businessName, contactName, city, niche, language, hookType]);

  // Automatically resize bubble textarea to fit content with zero scrollbars on the bubble
  useEffect(() => {
    if (phoneBubbleTextareaRef.current) {
      phoneBubbleTextareaRef.current.style.height = "auto";
      phoneBubbleTextareaRef.current.style.height = `${phoneBubbleTextareaRef.current.scrollHeight}px`;
    }
  }, [messageText]);

  // Scroll chat screen down smoothly when message or audio updates
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messageText, audioUrl]);

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
    let cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = cleanPhone.slice(1);
    }
    const fullPhone = `${countryCode.replace("+", "")}${cleanPhone}`;
    const encodedText = encodeURIComponent(messageText);

    const waUrl =
      fullPhone.length > 5
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
          text: messageText.replace(/\[.*?\]/g, ""),
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
            Launch direct WhatsApp conversations, test audio voice notes, and preview hooks inside an iPhone 18 Pro Max frame.
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Targeting, Strategy & Text Sync (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
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
                <span>Reset Template</span>
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

            {/* Synced Text Editor & AI */}
            <div className="space-y-1.5 pt-2 border-t border-[#EDEDEB] dark:border-[#2E2E2E]">
              <div className="flex items-center justify-between text-xs text-[#787774] dark:text-[#9B9A97]">
                <span className="font-semibold">Full Message Script (Live iPhone Sync)</span>
                <span className="font-mono text-[11px]">{messageText.length} caractères</span>
              </div>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={5}
                placeholder="Écrivez ou modifiez le message ici..."
                className="w-full bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-xl p-3 text-xs text-[#37352F] dark:text-[#E6E6E5] outline-none focus:border-emerald-500 leading-relaxed font-sans"
              />
            </div>

            {/* AI Generator Button */}
            <Button
              onClick={handleGenerateWithAI}
              disabled={isAiGenerating}
              className="w-full h-9 rounded-xl text-xs font-semibold bg-[#37352F] hover:bg-[#262420] dark:bg-[#E6E6E5] dark:hover:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#191919] gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAiGenerating ? "animate-spin" : ""}`} />
              <span>{isAiGenerating ? "Rédige avec GPT-4o..." : "AI Personalize Message"}</span>
            </Button>
          </div>
        </div>

        {/* Right Column: iPhone 18 Pro Max Frame (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center">
          {/* ── iPhone 18 Pro Max Chassis ── */}
          <div className="relative w-full max-w-[390px] rounded-[54px] p-[10px] bg-gradient-to-b from-[#404248] via-[#232428] to-[#121316] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.12)_inset] border border-[#52545c]">
            {/* iPhone Hardware Side Buttons Simulation */}
            {/* Action Button */}
            <div className="absolute -left-[3px] top-[108px] w-[3px] h-[26px] bg-gradient-to-r from-[#2a2b30] to-[#484a54] rounded-l-[3px]" />
            {/* Volume Up */}
            <div className="absolute -left-[3px] top-[148px] w-[3px] h-[50px] bg-gradient-to-r from-[#2a2b30] to-[#484a54] rounded-l-[3px]" />
            {/* Volume Down */}
            <div className="absolute -left-[3px] top-[210px] w-[3px] h-[50px] bg-gradient-to-r from-[#2a2b30] to-[#484a54] rounded-l-[3px]" />
            {/* Power / Siri Button */}
            <div className="absolute -right-[3px] top-[165px] w-[3px] h-[72px] bg-gradient-to-l from-[#2a2b30] to-[#484a54] rounded-r-[3px]" />

            {/* Inner Display Screen with Bezel */}
            <div className="relative w-full rounded-[44px] overflow-hidden bg-[#EFEAE2] dark:bg-[#0B141A] border-[4px] border-black flex flex-col h-[670px] shadow-inner select-text">
              {/* ── iOS Status Bar with Dynamic Island ── */}
              <div className="relative pt-2.5 px-6 pb-1 bg-[#008069] dark:bg-[#1F2C34] text-white flex items-center justify-between text-[11px] font-semibold select-none z-30">
                {/* Time */}
                <span className="w-12 text-left font-medium tracking-tight">
                  {currentTime}
                </span>

                {/* iPhone 18 Pro Max Dynamic Island Pill */}
                <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-[96px] h-[22px] bg-black rounded-full flex items-center justify-between px-2.5 shadow-md">
                  {/* Camera lens */}
                  <div className="w-2.5 h-2.5 rounded-full bg-[#121214] border border-[#232328] flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-[#1e293b]" />
                  </div>
                  {/* Sensor */}
                  <div className="w-2 h-2 rounded-full bg-[#0a0a0c]" />
                </div>

                {/* Status Icons: Signal, 5G, Battery */}
                <div className="w-12 flex items-center justify-end gap-1.5 text-white/95">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M2 19h2.5v-3H2v3zm4.5 0H9v-6H6.5v6zm4.5 0h2.5v-9H11v9zm4.5 0H18v-12h-2.5v12zm4.5 0H22V4h-2.5v15z" />
                  </svg>
                  <span className="text-[9px] font-bold tracking-tight">5G</span>
                  <div className="w-5 h-2.5 rounded-xs border border-white/80 p-0.5 flex items-center">
                    <div className="h-full w-full bg-white rounded-2xs" />
                  </div>
                </div>
              </div>

              {/* ── WhatsApp iOS Navigation Bar ── */}
              <div className="px-3 py-2 bg-[#008069] dark:bg-[#1F2C34] text-white flex items-center justify-between shadow-xs z-20">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleLaunchWhatsApp}
                    className="flex items-center text-white text-xs hover:opacity-80 transition-opacity cursor-pointer mr-0.5"
                    title="Ouvrir dans WhatsApp"
                  >
                    <ChevronLeft className="w-5 h-5 -ml-1" />
                    <span className="text-[11px] font-medium hidden xs:inline">12</span>
                  </button>

                  {/* Contact Avatar */}
                  <div className="w-8 h-8 rounded-full bg-white/20 text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
                    {contactName.charAt(0) || "M"}
                  </div>

                  {/* Name and Online Status */}
                  <div className="leading-tight overflow-hidden">
                    <div className="font-bold text-xs truncate max-w-[140px] flex items-center gap-1">
                      <span>{contactName}</span>
                    </div>
                    <div className="text-[10px] text-emerald-100 dark:text-emerald-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                      <span className="truncate max-w-[120px]">{businessName || "en ligne"}</span>
                    </div>
                  </div>
                </div>

                {/* Right Call & Audio Actions */}
                <div className="flex items-center gap-2 text-white">
                  <button
                    type="button"
                    onClick={handleGenerateVoice}
                    disabled={isGeneratingVoice}
                    className="p-1.5 rounded-full hover:bg-white/15 transition-all text-white cursor-pointer"
                    title="Générer une note vocale audio"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleLaunchWhatsApp}
                    className="p-1.5 rounded-full hover:bg-white/15 transition-all text-white cursor-pointer"
                    title="Appel vidéo"
                  >
                    <Video className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleLaunchWhatsApp}
                    className="p-1.5 rounded-full hover:bg-white/15 transition-all text-white cursor-pointer"
                    title="Appel WhatsApp"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* ── WhatsApp Chat History (SCROLLS LIKE IN A REAL PHONE) ── */}
              <div
                ref={chatScrollRef}
                className="flex-1 overflow-y-auto px-3.5 py-4 space-y-3 bg-[#EFEAE2] dark:bg-[#0B141A] relative scroll-smooth"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.02) 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              >
                {/* Date separator pill */}
                <div className="flex justify-center">
                  <span className="px-3 py-1 rounded-lg text-[10px] font-medium bg-[#FFFFFF]/80 dark:bg-[#182229]/90 text-[#54656F] dark:text-[#8696A0] shadow-2xs backdrop-blur-xs select-none">
                    Aujourd&apos;hui
                  </span>
                </div>

                {/* End-to-end encryption note */}
                <div className="flex justify-center px-4">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFEECD] dark:bg-[#182229] text-[10px] text-[#54656F] dark:text-[#FFD279] shadow-2xs text-center select-none leading-tight">
                    <Lock className="w-3 h-3 shrink-0" />
                    <span>Les messages sont chiffrés de bout en bout.</span>
                  </div>
                </div>

                {/* Voice Note Simulation Widget (if Audio generated) */}
                {audioUrl && (
                  <div className="self-end ml-auto max-w-[85%] p-3 rounded-2xl rounded-tr-xs bg-[#E7FFDB] dark:bg-[#005C4B] shadow-xs text-xs space-y-2">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={togglePlayAudio}
                        className="w-8 h-8 rounded-full bg-[#008069] dark:bg-[#00A884] text-white flex items-center justify-center cursor-pointer shadow-xs shrink-0"
                      >
                        {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>
                      <div className="flex-1 space-y-1">
                        <div className="h-1.5 bg-emerald-600/30 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-emerald-600 dark:bg-emerald-300 rounded-full transition-all ${
                              isPlayingAudio ? "w-full duration-5000" : "w-1/3"
                            }`}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-[#667781] dark:text-emerald-100 font-mono">
                          <span>Note vocale (ElevenLabs)</span>
                          <span>0:25</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Realistic Outbound WhatsApp Bubble (NO SCROLLBAR ON BUBBLE) ── */}
                <div className="self-end ml-auto max-w-[88%] p-3 rounded-2xl rounded-tr-xs bg-[#DCF8C6] dark:bg-[#005C4B] shadow-xs text-xs text-[#111B21] dark:text-[#E9EDEF] space-y-1 relative">
                  {/* Auto-growing textarea with NO overflow scroll on bubble */}
                  <textarea
                    ref={phoneBubbleTextareaRef}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full bg-transparent resize-none overflow-hidden outline-none leading-relaxed font-sans text-xs text-[#111B21] dark:text-[#E9EDEF]"
                    style={{ minHeight: "60px" }}
                  />

                  {/* Bubble Timestamp & Double Blue Ticks */}
                  <div className="flex items-center justify-end gap-1 text-[10px] text-[#667781] dark:text-emerald-200 font-mono select-none pt-0.5">
                    <span>{currentTime}</span>
                    <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb] inline" />
                  </div>
                </div>
              </div>

              {/* ── iOS WhatsApp Bottom Input Bar ── */}
              <div className="p-2 bg-[#F0F2F5] dark:bg-[#1F2C34] border-t border-black/5 dark:border-white/5 flex items-center gap-2 select-none z-20">
                <button
                  type="button"
                  className="p-1 text-[#007AFF] hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                </button>

                <div className="flex-1 bg-white dark:bg-[#2A3942] rounded-full px-3 py-1.5 flex items-center justify-between text-xs text-[#8696A0] shadow-2xs border border-black/5 dark:border-white/5">
                  <span className="truncate">Message...</span>
                  <div className="flex items-center gap-1.5 text-[#8696A0]">
                    <Paperclip className="w-3.5 h-3.5" />
                  </div>
                </div>

                <button
                  type="button"
                  className="p-1 text-[#007AFF] hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleGenerateVoice}
                  className="p-1 text-[#007AFF] hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>

              {/* ── iOS Home Indicator Bar ── */}
              <div className="bg-[#F0F2F5] dark:bg-[#1F2C34] pb-1.5 pt-0.5 flex justify-center">
                <div className="w-32 h-1 bg-black/70 dark:bg-white/60 rounded-full" />
              </div>
            </div>
          </div>

          {/* Quick Action Buttons Below iPhone Frame */}
          <div className="w-full max-w-[390px] mt-4 flex items-center justify-between gap-2">
            <Button
              onClick={handleLaunchWhatsApp}
              className="flex-1 h-9 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Launch WhatsApp</span>
            </Button>

            <Button
              onClick={handleCopy}
              variant="outline"
              className="h-9 px-3.5 rounded-xl text-xs font-medium bg-white dark:bg-[#202020] border-[#EDEDEB] dark:border-[#2E2E2E] text-[#37352F] dark:text-[#E6E6E5] gap-1.5 cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copié" : "Copier"}</span>
            </Button>

            <Button
              onClick={handleSaveToCrm}
              disabled={isSavingToCrm}
              variant="outline"
              className="h-9 px-3 rounded-xl text-xs font-medium bg-white dark:bg-[#202020] border-[#EDEDEB] dark:border-[#2E2E2E] text-[#37352F] dark:text-[#E6E6E5] gap-1.5 cursor-pointer shadow-2xs"
              title="Enregistrer ce prospect dans le CRM"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CRM</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
