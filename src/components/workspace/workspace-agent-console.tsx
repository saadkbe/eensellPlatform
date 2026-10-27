"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Send,
  Building2,
  Mail,
  RefreshCw,
  Settings,
  Flame,
  ArrowRight,
  TrendingUp,
  Clock,
  Check,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  runAutonomousOutreach,
  simulateNextDayResponses,
} from "@/actions/workspace.actions";

interface WorkspaceAgentConsoleProps {
  initialData: {
    account: {
      gmailAddress: string | null;
      isGmailConnected: boolean;
      senderName: string | null;
      agencyName: string | null;
      hasElevenLabs: boolean;
      voiceId: string | null;
    } | null;
    stats: {
      totalCampaigns: number;
      totalLeads: number;
      sentEmails: number;
      replies: number;
      meetingsBooked: number;
      conversionRate: number;
    };
    recentLeads: any[];
    campaigns: any[];
    debriefText: string;
  };
}

type AgentState = "idle" | "listening" | "processing" | "speaking";

interface OutreachLogStep {
  id: string;
  stage: "intent" | "hunting" | "copy" | "dispatch" | "completed";
  label: string;
  details?: string;
  timestamp: string;
}

export function WorkspaceAgentConsole({ initialData }: WorkspaceAgentConsoleProps) {
  const [agentState, setAgentState] = useState<AgentState>("idle");
  const [transcript, setTranscript] = useState("");
  const [agentSpeech, setAgentSpeech] = useState(initialData.debriefText);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [logs, setLogs] = useState<OutreachLogStep[]>([]);
  const [scrapedLeads, setScrapedLeads] = useState<any[]>(initialData.recentLeads.slice(0, 5));
  const [stats, setStats] = useState(initialData.stats);
  const [isSimulatingNextDay, setIsSimulatingNextDay] = useState(false);
  const [selectedLeadPreview, setSelectedLeadPreview] = useState<any | null>(null);

  const recognitionRef = useRef<any>(null);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Speech Recognition (Web Speech API)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "fr-FR"; // Default to French for Morocco/France, recognizes English too

        recognition.onstart = () => {
          setAgentState("listening");
        };

        recognition.onresult = (event: any) => {
          const currentTranscript = Array.from(event.results)
            .map((res: any) => res[0].transcript)
            .join("");
          setTranscript(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          setAgentState("idle");
        };

        recognition.onend = () => {
          if (transcript.trim().length > 0) {
            handleVoiceCommand(transcript);
          } else {
            setAgentState("idle");
          }
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [transcript]);

  // Play audio out loud via ElevenLabs or fallback to Web Speech
  const speakOutLoud = async (text: string) => {
    if (isAudioMuted) return;

    setAgentState("speaking");

    try {
      // 1. Try ElevenLabs API route first
      const res = await fetch("/api/workspace/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("audio")) {
        const blob = await res.blob();
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audioPlayerRef.current = audio;

        audio.onended = () => {
          setAgentState("idle");
        };
        audio.onerror = () => {
          fallbackWebSpeech(text);
        };
        await audio.play();
        return;
      }

      // If response says useWebSpeech or no audio
      fallbackWebSpeech(text);
    } catch (e) {
      fallbackWebSpeech(text);
    }
  };

  const fallbackWebSpeech = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setAgentState("idle");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    // Auto-detect language
    if (/^[A-Za-z0-9\s.,?!']+$/.test(text) && !/[àâçéèêëîïôûùüÿñæœ]/i.test(text)) {
      utterance.lang = "en-US";
    } else {
      utterance.lang = "fr-FR";
    }
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setAgentState("idle");
    };
    utterance.onerror = () => {
      setAgentState("idle");
    };

    speechSynthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setAgentState("idle");
  };

  const toggleListening = () => {
    if (agentState === "speaking") {
      stopSpeaking();
      return;
    }

    if (agentState === "listening") {
      recognitionRef.current?.stop();
      setAgentState("idle");
    } else {
      setTranscript("");
      try {
        recognitionRef.current?.start();
      } catch (e) {
        toast.error("Microphone non disponible. Vous pouvez aussi taper ou cliquer sur une suggestion !");
        setAgentState("idle");
      }
    }
  };

  // Main autonomous pipeline handler
  const handleVoiceCommand = async (commandText: string) => {
    setAgentState("processing");
    const now = () => new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    // Step 1: Parsing
    setLogs([
      {
        id: "1",
        stage: "intent",
        label: "Analyse de la commande vocale par le modèle IA",
        details: `Instruction reçue : "${commandText}"`,
        timestamp: now(),
      },
    ]);

    // Check Gmail connection
    const hasGmail = initialData.account?.isGmailConnected;

    // Agent response guidance
    let promptFeedback = "";
    if (!hasGmail) {
      promptFeedback = `Excellente initiative ! C'est exactement le meilleur secteur pour commencer. Je lance le scraping et la rédaction d'emails personnalisés pour les agences immobilières. Pensez aussi à connecter votre compte Gmail dans les Paramètres pour l'envoi direct depuis votre adresse.`;
    } else {
      promptFeedback = `Parfait, je lance immédiatement la chasse aux leads qualifiés pour les agences immobilières au Maroc et l'envoi direct depuis votre boîte Gmail !`;
    }

    setAgentSpeech(promptFeedback);
    speakOutLoud(promptFeedback);

    // Step 2: Lead Scraping simulation & execution
    setTimeout(async () => {
      setLogs((prev) => [
        ...prev,
        {
          id: "2",
          stage: "hunting",
          label: "Scraping & qualification des agences immobilières cibles",
          details: "Filtrage des directeurs d'agence, emails vérifiés et téléphones à Casablanca et Marrakech...",
          timestamp: now(),
        },
      ]);

      // Call server action
      try {
        const result = await runAutonomousOutreach({
          prompt: commandText,
          sendRealEmails: Boolean(hasGmail),
        });

        if (result.success) {
          // Step 3: Copywriting
          setTimeout(() => {
            setLogs((prev) => [
              ...prev,
              {
                id: "3",
                stage: "copy",
                label: "Rédaction des emails de prospection personnalisés",
                details: "Génération de copies ultra-convertissantes en français axées sur la qualification WhatsApp 24/7...",
                timestamp: now(),
              },
            ]);

            // Step 4: Dispatch
            setTimeout(() => {
              setLogs((prev) => [
                ...prev,
                {
                  id: "4",
                  stage: "dispatch",
                  label: hasGmail
                    ? `Expédition SMTP en direct via ${initialData.account?.gmailAddress}`
                    : "Préparation des emails et enregistrement dans votre CRM Workspace",
                  details: `${result.leadsCount} agences contactées avec succès. Synchronisation du pipeline...`,
                  timestamp: now(),
                },
                {
                  id: "5",
                  stage: "completed",
                  label: "Campagne d'outreach terminée avec succès",
                  details: result.summaryMessage,
                  timestamp: now(),
                },
              ]);

              setScrapedLeads(result.leads);
              setStats((prev) => ({
                ...prev,
                totalCampaigns: prev.totalCampaigns + 1,
                totalLeads: prev.totalLeads + result.leadsCount,
                sentEmails: prev.sentEmails + result.dispatchedCount,
              }));

              const completionSpeech = `Tout est prêt ! J'ai qualifié ${result.leadsCount} agences immobilières d'élite et envoyé les emails d'approche personnalisés. Revenez demain pour le débrief des premières réponses !`;
              setAgentSpeech(completionSpeech);
              speakOutLoud(completionSpeech);
              setAgentState("idle");
              toast.success(`${result.leadsCount} leads ajoutés au CRM Workspace !`);
            }, 1200);
          }, 1200);
        }
      } catch (err: any) {
        toast.error("Erreur lors de l'exécution: " + err.message);
        setAgentState("idle");
      }
    }, 1500);
  };

  const handleSimulateNextDay = async () => {
    setIsSimulatingNextDay(true);
    try {
      const res = await simulateNextDayResponses();
      if (res.success) {
        toast.success("Simulation du lendemain activée ! 2 réponses clients générées.");
        const nextDayDebrief = `Bonjour Saad ! Excellente nouvelle aujourd'hui : nous avons reçu 2 réponses. Atlas Prestige Immobilier a confirmé un rendez-vous démo pour jeudi à 15h30, et Casablanca Prime Properties demande votre grille tarifaire !`;
        setAgentSpeech(nextDayDebrief);
        speakOutLoud(nextDayDebrief);
        setStats((prev) => ({
          ...prev,
          replies: prev.replies + 2,
          meetingsBooked: prev.meetingsBooked + 1,
        }));
      } else {
        toast.error(res.error || "Une erreur est survenue");
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsSimulatingNextDay(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Eensell Workspace
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Autonomous Outreach OS
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Parlez à votre agent vocal d'acquisition IA. Il prospecte, rédige et conclut vos premiers clients en autonomie.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleSimulateNextDay}
            disabled={isSimulatingNextDay}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-semibold shadow-sm transition-all hover:border-amber-500/60 cursor-pointer disabled:opacity-50"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{isSimulatingNextDay ? "Simulation..." : "Simuler Débrief Lendemain"}</span>
          </button>

          <Link
            href="/workspace/crm"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all cursor-pointer"
          >
            <span>Voir Leads CRM</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-inner">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Campagnes Actives
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {stats.totalCampaigns}
          </div>
          <div className="text-[10px] text-amber-400 mt-0.5 font-medium">
            Acquisition multicanal
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-inner">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Prospects Qualifiés
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {stats.totalLeads}
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5 font-medium">
            Agences & décideurs vérifiés
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-inner">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Emails Envoyés
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {stats.sentEmails}
          </div>
          <div className="text-[10px] text-blue-400 mt-0.5 font-medium">
            {initialData.account?.isGmailConnected ? "Via Gmail SMTP Connecté" : "Prêts dans le pipeline"}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 to-transparent border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
            <span>Rendez-vous Conclus</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 mt-1">
            {stats.meetingsBooked}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
            {stats.replies} réponses qualifiées
          </div>
        </div>
      </div>

      {/* Gmail Status Warning Banner if not connected */}
      {!initialData.account?.isGmailConnected && (
        <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs sm:text-sm">
              <span className="font-bold">Connectez votre compte Gmail :</span> L'agent d'outreach peut envoyer les emails directement depuis votre vraie adresse Gmail (avec mot de passe d'application).
            </div>
          </div>
          <Link
            href="/workspace/settings"
            className="shrink-0 ml-3 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Connecter Gmail
          </Link>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* HORIZONTAL SPLIT SCREEN: Live AI Call & Autonomous Console */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANEL: Live AI Voice Agent Call (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col rounded-3xl bg-slate-900/80 border border-amber-500/20 backdrop-blur-xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
          {/* Subtle glow orb background */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Panel Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <span className="text-sm font-bold text-white tracking-wide">
                Agent Vocal Eensell
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
                title={isAudioMuted ? "Activer l'audio" : "Couper l'audio"}
              >
                {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>
          </div>

          {/* Pulsing Orb Visualizer */}
          <div className="flex flex-col items-center justify-center py-8 sm:py-10">
            <div className="relative flex items-center justify-center">
              {/* Outer wave rings */}
              <motion.div
                animate={{
                  scale: agentState === "speaking" ? [1, 1.35, 1] : agentState === "listening" ? [1, 1.25, 1] : [1, 1.08, 1],
                  opacity: agentState === "idle" ? 0.2 : 0.6,
                }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute w-44 h-44 rounded-full border-2 border-amber-500/30"
              />
              <motion.div
                animate={{
                  scale: agentState === "speaking" ? [1, 1.5, 1] : agentState === "listening" ? [1, 1.4, 1] : [1, 1.15, 1],
                  opacity: agentState === "idle" ? 0.1 : 0.4,
                }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.2 }}
                className="absolute w-56 h-56 rounded-full border border-amber-500/20"
              />

              {/* Core Pulsing Mic Orb */}
              <motion.button
                onClick={toggleListening}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer ${
                  agentState === "listening"
                    ? "bg-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.6)] text-white"
                    : agentState === "speaking"
                    ? "bg-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.6)] text-slate-950"
                    : agentState === "processing"
                    ? "bg-indigo-600 shadow-[0_0_40px_rgba(99,102,241,0.6)] text-white animate-pulse"
                    : "bg-gradient-to-br from-amber-500 to-amber-600 shadow-[0_0_30px_rgba(245,158,11,0.35)] text-slate-950"
                }`}
              >
                {agentState === "listening" ? (
                  <MicOff className="w-9 h-9" />
                ) : agentState === "speaking" ? (
                  <Volume2 className="w-9 h-9 animate-bounce" />
                ) : (
                  <Mic className="w-9 h-9" />
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider mt-1">
                  {agentState === "listening"
                    ? "Écoute..."
                    : agentState === "speaking"
                    ? "Parle..."
                    : agentState === "processing"
                    ? "IA Réfléchit"
                    : "Parler"}
                </span>
              </motion.button>
            </div>

            <div className="mt-6 text-center">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {agentState === "listening"
                  ? "Parlez à voix haute... (Français, Arabe, Anglais)"
                  : agentState === "speaking"
                  ? "L'agent vocal vous répond en direct"
                  : agentState === "processing"
                  ? "Recherche de leads & rédaction en cours..."
                  : "Cliquez sur le micro pour lancer un appel en direct"}
              </span>
            </div>
          </div>

          {/* Transcript / Agent Speech Bubble */}
          <div className="flex-1 flex flex-col space-y-3 pt-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Dialogue en direct</span>
              {agentSpeech && (
                <button
                  onClick={() => speakOutLoud(agentSpeech)}
                  className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Play className="w-3 h-3" />
                  <span>Réécouter</span>
                </button>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed max-h-44 overflow-y-auto">
              {transcript && (
                <div className="text-amber-300 font-medium mb-2 border-b border-slate-800 pb-2">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Vous :</span>
                  "{transcript}"
                </div>
              )}
              <div>
                <span className="text-[10px] text-amber-400 block uppercase font-mono font-bold">Agent IA :</span>
                {agentSpeech}
              </div>
            </div>

            {/* Suggested Voice Triggers */}
            <div className="space-y-1.5 pt-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Suggestions en 1-clic :
              </div>
              <button
                onClick={() =>
                  handleVoiceCommand(
                    "J'ai un blueprint d'automatisation pour les agences immobilières au Maroc et je veux lancer l'outreach"
                  )
                }
                className="w-full text-left p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs transition-colors flex items-center justify-between group cursor-pointer"
              >
                <span className="truncate">
                  🏢 "J'ai un blueprint d'automatisation pour les agences immobilières au Maroc..."
                </span>
                <Send className="w-3 h-3 text-amber-400 shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() =>
                  handleVoiceCommand("Lance l'outreach pour les cabinets dentaires à Casablanca")
                }
                className="w-full text-left p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs transition-colors flex items-center justify-between group cursor-pointer"
              >
                <span className="truncate">
                  🦷 "Lance l'outreach pour les cabinets dentaires à Casablanca"
                </span>
                <Send className="w-3 h-3 text-amber-400 shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Horizontal Split-Screen Autonomous Console (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl p-5 sm:p-6 shadow-2xl space-y-5">
          {/* Console Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white tracking-wide uppercase">
                Console d'Exécution Autonome (Split-Screen)
              </h2>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Pipeline Live
            </span>
          </div>

          {/* Step Progress Tracker */}
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { num: "1", title: "Niche & Paramètres" },
              { num: "2", title: "Scraper Qualifié" },
              { num: "3", title: "Copywriting IA" },
              { num: "4", title: "Expédition Gmail" },
            ].map((step, idx) => {
              const isActiveStep = logs.length > idx;
              return (
                <div
                  key={step.num}
                  className={`p-2.5 rounded-xl border text-xs transition-all ${
                    isActiveStep
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-300 font-semibold"
                      : "bg-slate-950/40 border-slate-800 text-slate-400"
                  }`}
                >
                  <div className="text-[10px] font-mono mb-0.5">ÉTAPE {step.num}</div>
                  <div className="truncate text-[11px]">{step.title}</div>
                </div>
              );
            })}
          </div>

          {/* Live Action Terminal Logs */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2 max-h-48 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-slate-400 italic py-4 text-center">
                En attente d'une commande vocale ou écrite... Parlez à l'agent vocal à gauche pour démarrer.
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex items-start gap-2.5 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-amber-300 font-bold">{log.label}</span>
                      <span className="text-slate-400">{log.timestamp}</span>
                    </div>
                    {log.details && (
                      <div className="text-[10px] text-slate-400 mt-0.5">{log.details}</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Scraped Leads & Cold Emails Pipeline */}
          <div className="flex-1 flex flex-col space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
              <span>Prospects Générés ({scrapedLeads.length})</span>
              <Link
                href="/workspace/crm"
                className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                <span>Pipeline Complet</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {scrapedLeads.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-800 text-center text-slate-400 text-xs">
                  Aucun prospect actif. Lancez une campagne vocale pour voir les entreprises ciblées en temps réel.
                </div>
              ) : (
                scrapedLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/40 transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="font-bold text-white truncate">
                          {lead.businessName}
                        </span>
                        <span className="text-[10px] px-2 py-0.2 rounded bg-slate-800 text-slate-300">
                          {lead.city}
                        </span>
                      </div>
                      <div className="text-slate-400 text-[11px] truncate mt-0.5">
                        {lead.email} • {lead.phone || "Directeur"}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          lead.status === "MEETING_BOOKED"
                            ? "bg-amber-500 text-slate-950"
                            : lead.status === "REPLIED"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : lead.status === "DECLINED"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        }`}
                      >
                        {lead.status === "MEETING_BOOKED"
                          ? "RDV CONFIRMÉ"
                          : lead.status === "REPLIED"
                          ? "RÉPONSE REÇUE"
                          : lead.status === "DECLINED"
                          ? "DÉCLINÉ"
                          : "DISPATCHÉ"}
                      </span>

                      <button
                        onClick={() => setSelectedLeadPreview(lead)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        Voir Email
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Cold Email Preview */}
      <AnimatePresence>
        {selectedLeadPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-3xl bg-slate-900 border border-amber-500/30 p-6 shadow-2xl flex flex-col space-y-4 text-slate-200"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-amber-400" />
                  <span className="font-bold text-white text-sm">
                    Aperçu de l'Email Envoyé
                  </span>
                </div>
                <button
                  onClick={() => setSelectedLeadPreview(null)}
                  className="text-slate-400 hover:text-white text-xs font-mono px-2 py-1 rounded bg-slate-800"
                >
                  Fermer
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 font-mono">Destinataire : </span>
                  <span className="font-semibold text-white">{selectedLeadPreview.businessName} ({selectedLeadPreview.email})</span>
                </div>
                <div>
                  <span className="text-slate-400 font-mono">Objet : </span>
                  <span className="font-semibold text-amber-300">{selectedLeadPreview.emailSubject}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-300 whitespace-pre-wrap font-sans max-h-72 overflow-y-auto leading-relaxed">
                {selectedLeadPreview.emailBody}
              </div>

              {selectedLeadPreview.replyNotes && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
                  <span className="font-bold block text-amber-300">Note de Réponse :</span>
                  {selectedLeadPreview.replyNotes}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
