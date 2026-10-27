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
  Copy,
  Check,
  Globe,
  Sliders,
  ChevronRight,
  Bot,
  Search,
  Bell,
  Code2,
  FileText,
  Flame,
  X,
  Maximize2,
  ThumbsUp,
  ArrowUp,
  CheckCheck,
  Clock,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";
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

type CanvasTab = "plan" | "code" | "leads";
type AgentState = "idle" | "listening" | "processing" | "speaking";

export function WorkspaceAgentConsole({ initialData }: WorkspaceAgentConsoleProps) {
  const [activeTab, setActiveTab] = useState<CanvasTab>("plan");
  const [agentState, setAgentState] = useState<AgentState>("idle");
  const [inputPrompt, setInputPrompt] = useState("");
  const [transcript, setTranscript] = useState("");
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [leads, setLeads] = useState<any[]>(initialData.recentLeads.slice(0, 5));
  const [stats, setStats] = useState(initialData.stats);
  const [selectedLeadPreview, setSelectedLeadPreview] = useState<any | null>(null);

  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize Web Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "fr-FR";

        recognition.onstart = () => setAgentState("listening");
        recognition.onresult = (event: any) => {
          const currentTranscript = Array.from(event.results)
            .map((res: any) => res[0].transcript)
            .join("");
          setInputPrompt(currentTranscript);
          setTranscript(currentTranscript);
        };
        recognition.onerror = () => setAgentState("idle");
        recognition.onend = () => {
          setAgentState("idle");
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Voice output via ElevenLabs or native fallback
  const speakOutLoud = async (text: string) => {
    if (isAudioMuted) return;
    setAgentState("speaking");

    try {
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
        audio.onended = () => setAgentState("idle");
        audio.onerror = () => fallbackWebSpeech(text);
        await audio.play();
        return;
      }

      fallbackWebSpeech(text);
    } catch {
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
    utterance.lang = "fr-FR";
    utterance.rate = 1.05;
    utterance.onend = () => setAgentState("idle");
    utterance.onerror = () => setAgentState("idle");
    speechSynthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const toggleMic = () => {
    if (agentState === "listening") {
      recognitionRef.current?.stop();
      setAgentState("idle");
    } else {
      setInputPrompt("");
      try {
        recognitionRef.current?.start();
      } catch {
        toast.error("Microphone non accessible.");
        setAgentState("idle");
      }
    }
  };

  const handleRunCampaign = async (promptToRun?: string) => {
    const text = promptToRun || inputPrompt;
    if (!text.trim()) return;

    setIsRunning(true);
    setAgentState("processing");

    try {
      const result = await runAutonomousOutreach({
        prompt: text,
        sendRealEmails: Boolean(initialData.account?.isGmailConnected),
      });

      if (result.success) {
        setLeads(result.leads);
        setStats((prev) => ({
          ...prev,
          totalCampaigns: prev.totalCampaigns + 1,
          totalLeads: prev.totalLeads + result.leadsCount,
          sentEmails: prev.sentEmails + result.dispatchedCount,
        }));
        speakOutLoud(result.summaryMessage);
        toast.success(`${result.leadsCount} agences qualifiées avec succès !`);
        setActiveTab("leads");
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'exécution");
    } finally {
      setIsRunning(false);
      setAgentState("idle");
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast.success("Copié dans le presse-papier");
  };

  const sampleLead = leads[0] || {
    businessName: "Atlas Prestige Immobilier",
    city: "Casablanca",
    email: "direction@atlasprestige.ma",
    phone: "+212 5 22 45 88 12",
    emailSubject: "Question sur la conversion de vos leads à Casablanca — Atlas Prestige Immobilier",
    emailBody: `Bonjour M. Youssef Berrada,

J'ai remarqué le positionnement remarquable d'Atlas Prestige Immobilier sur le marché immobilier de Casablanca.

En analysant la réactivité moyenne sur les demandes d'acquéreurs et investisseurs, nous avons constaté qu'une agence perd en moyenne 40% de ses mandats qualifiés simplement parce que les prospects attendent plus de 15 minutes avant d'obtenir une réponse ou une visite WhatsApp.

Chez Eensell AI, nous avons développé une infrastructure d'automatisation IA dédiée aux agences immobilières d'élite :
1. Qualification instantanée 24/7 sur WhatsApp de chaque prospect (budget, zone souhaitée, financement validé).
2. Synchronisation automatique des fiches biens et prise de rendez-vous directe dans l'agenda de vos négociateurs.
3. Zéro prospect laissé sans suivi.

Seriez-vous ouvert à un échange informel de 10 minutes ce jeudi à 15h pour voir une démonstration en direct adaptée à Atlas Prestige Immobilier ?

Bien cordialement,
Saad | Eensell AI Partner`,
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background text-foreground overflow-hidden">
      {/* ─────────────────────────────────────────────────────────── */}
      {/* TOP BAR (Matches Screenshot Header) */}
      {/* ─────────────────────────────────────────────────────────── */}
      <header className="h-14 border-b border-border/80 px-4 sm:px-6 flex items-center justify-between shrink-0 bg-card">
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="font-bold text-sm sm:text-base tracking-tight text-foreground truncate">
            Agences Immobilières Casablanca
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-border text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            morocco-realestate
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/40 border border-border text-muted-foreground text-xs w-48">
            <Search className="w-3.5 h-3.5" />
            <span className="flex-1">Search...</span>
            <kbd className="px-1.5 py-0.2 rounded bg-background border border-border text-[10px] font-mono">
              ⌘K
            </kbd>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notification Button */}
          <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2-COLUMN SPLIT SCREEN: Chat on Left, Canvas on Right */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
        {/* LEFT PANE: Conversational Chat Canvas (5.5 Cols) */}
        <div className="lg:col-span-6 xl:col-span-6 border-r border-border flex flex-col h-full min-h-0 bg-background/50">
          {/* Conversation Stream */}
          <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto no-scrollbar">
            {/* User Message Bubble */}
            <div className="flex flex-col items-end">
              <div className="p-4 rounded-2xl bg-card border border-border shadow-xs text-xs sm:text-sm text-foreground max-w-[85%] leading-relaxed">
                J'ai un blueprint d'automatisation pour les agences immobilières au Maroc et je veux lancer l'outreach.
              </div>
              <span className="text-[11px] text-muted-foreground mt-1.5 px-1">
                You · 10:04
              </span>
            </div>

            {/* Agent Response (Exact Layout from Screenshot) */}
            <div className="flex items-start gap-3.5">
              {/* Agent Avatar */}
              <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>

              {/* Agent Bubble Content */}
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs sm:text-sm text-foreground">
                    Eensell AI
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    ✓ Task complete
                  </span>
                  <span className="text-[11px] text-muted-foreground ml-auto">
                    10:05
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                  Nous avons scanné et qualifié les 5 meilleures agences immobilières à Casablanca et Marrakech. Les décideurs clés ont été extraits et les cold emails personnalisés ont été rédigés pour maximiser la prise de rendez-vous démo.
                </p>

                {/* Checklist with checkmarks */}
                <div className="space-y-1.5 text-xs text-foreground/80 pl-0.5">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Scraped 5 verified real estate agencies in Casablanca & Marrakech</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Extracted decision-maker managers & direct verified emails</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Drafted personalized French cold emails targeting WhatsApp 24/7 qualification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>SMTP deliverability check passed — ready to dispatch via connected Gmail</span>
                  </div>
                </div>

                {/* Embedded Canvas Artifact Card (Exact Screenshot Design) */}
                <div className="p-3.5 rounded-2xl bg-card border border-border shadow-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-foreground truncate">
                        campagne-casablanca.mail
                      </div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                        <span>5 leads</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">+5 ready</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("code")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/60 hover:bg-muted text-foreground border border-border text-xs font-semibold transition-colors cursor-pointer shrink-0"
                  >
                    <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Open canvas</span>
                  </button>
                </div>

                {/* Interaction Footer Icons */}
                <div className="flex items-center gap-3 pt-1 text-muted-foreground text-xs">
                  <button
                    onClick={() => handleCopy(sampleLead.emailBody)}
                    className="hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer ${
                      isLiked ? "text-amber-500 font-bold" : ""
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleRunCampaign()}
                    className="hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Bottom Input Bar (Exact Screenshot Design) */}
          <div className="p-4 border-t border-border/80 bg-card/60">
            <div className="rounded-2xl border border-border bg-card p-3 shadow-xs space-y-2.5 focus-within:border-amber-500/50 transition-colors">
              <textarea
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleRunCampaign();
                  }
                }}
                rows={2}
                placeholder="Reply or describe the next outreach campaign..."
                className="w-full bg-transparent text-xs sm:text-sm text-foreground placeholder-muted-foreground focus:outline-none resize-none leading-relaxed"
              />

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/60 text-muted-foreground hover:text-foreground border border-border text-xs font-medium cursor-pointer">
                    <Sliders className="w-3 h-3" />
                    <span>Tools</span>
                    <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                      2
                    </span>
                  </button>

                  <button
                    onClick={toggleMic}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                      agentState === "listening"
                        ? "bg-rose-500 text-white border-rose-500"
                        : "bg-muted/60 text-muted-foreground hover:text-foreground border border-border"
                    }`}
                  >
                    {agentState === "listening" ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3 text-amber-500" />}
                    <span>{agentState === "listening" ? "Listening..." : "Voice"}</span>
                  </button>
                </div>

                <button
                  onClick={() => handleRunCampaign()}
                  disabled={isRunning || !inputPrompt.trim()}
                  className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: Consequences / Live Action Canvas (6.5 Cols) */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col h-full min-h-0 bg-card">
          {/* Canvas Top Bar */}
          <div className="h-12 border-b border-border px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Code2 className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-bold text-xs text-foreground truncate">
                  campagne-casablanca.mail
                </span>
                <span className="text-[11px] text-muted-foreground">
                  French Cold Email · 18 lines
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <button
                onClick={() => handleCopy(sampleLead.emailBody)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-muted text-xs font-medium cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
              <button className="p-1 rounded-md hover:bg-muted text-xs cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Segmented Control Tabs (Plan / Code / Diff) */}
          <div className="px-4 py-2 border-b border-border/80 flex items-center gap-2 bg-muted/30">
            <button
              onClick={() => setActiveTab("plan")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === "plan"
                  ? "bg-card text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Plan</span>
              <span className="px-1.5 py-0.2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                4
              </span>
            </button>

            <button
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === "code"
                  ? "bg-card text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Email Copy</span>
            </button>

            <button
              onClick={() => setActiveTab("leads")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === "leads"
                  ? "bg-card text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Leads CRM</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                {leads.length}
              </span>
            </button>
          </div>

          {/* Canvas Content Area */}
          <div className="flex-1 p-5 overflow-y-auto no-scrollbar text-xs">
            {/* TAB 1: Plan Stepper (Exact Connected Timeline from Screenshot) */}
            {activeTab === "plan" && (
              <div className="space-y-6 max-w-lg">
                {[
                  {
                    step: "Analyze market & real estate niche",
                    desc: "Read Casablanca agency directories and evaluated buyer lead drop-off rates.",
                  },
                  {
                    step: "Locate decision-makers & verified emails",
                    desc: "Identified executive directors, agency managers, and verified MX-record emails.",
                  },
                  {
                    step: "Draft personalized WhatsApp AI copy",
                    desc: "Tailored value proposition addressing 40% lead drop outside working hours.",
                  },
                  {
                    step: "Validate deliverability & dispatch",
                    desc: "Visual check across 5 contacts — zero spam triggers detected.",
                  },
                ].map((item, index, arr) => (
                  <div key={item.step} className="relative flex items-start gap-3.5">
                    {/* Connecting Vertical Line */}
                    {index < arr.length - 1 && (
                      <div className="absolute left-3.5 top-7 bottom-0 w-0.5 bg-blue-500/30 -mb-6" />
                    )}

                    {/* Step Icon */}
                    <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 z-10 shadow-xs">
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </div>

                    {/* Text Details */}
                    <div className="space-y-0.5 pt-0.5">
                      <h4 className="font-bold text-foreground text-xs sm:text-sm">
                        {item.step}
                      </h4>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: Email Copy View (Syntax Style) */}
            {activeTab === "code" && (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-muted/40 border border-border">
                  <span className="text-muted-foreground">Subject: </span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">
                    {sampleLead.emailSubject}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-muted/40 border border-border text-foreground leading-relaxed whitespace-pre-wrap font-sans text-xs sm:text-sm">
                  {sampleLead.emailBody}
                </div>
              </div>
            )}

            {/* TAB 3: Leads CRM Pipeline View */}
            {activeTab === "leads" && (
              <div className="space-y-2.5">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3.5 rounded-2xl bg-muted/30 hover:bg-muted/60 border border-border transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="font-bold text-foreground text-xs truncate">
                          {lead.businessName}
                        </span>
                        <span className="text-[10px] px-2 py-0.2 rounded bg-muted text-muted-foreground border border-border">
                          {lead.city}
                        </span>
                      </div>
                      <div className="text-muted-foreground text-[11px] truncate mt-0.5">
                        {lead.email} • {lead.phone}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          lead.status === "MEETING_BOOKED"
                            ? "bg-amber-500 text-slate-950"
                            : lead.status === "REPLIED"
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                            : "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                        }`}
                      >
                        {lead.status === "MEETING_BOOKED"
                          ? "RDV CONFIRMÉ"
                          : lead.status === "REPLIED"
                          ? "RÉPONSE"
                          : "DISPATCHÉ"}
                      </span>

                      <button
                        onClick={() => setSelectedLeadPreview(lead)}
                        className="px-2 py-1 rounded-lg bg-card hover:bg-muted text-foreground border border-border text-[11px] font-semibold"
                      >
                        Email
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Action Bar (Exact Screenshot Layout) */}
          <div className="h-14 border-t border-border px-4 flex items-center justify-between shrink-0 bg-card">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>All checks passed</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toast.info("Modifications rejetées")}
                className="px-3.5 py-1.5 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-semibold transition-colors cursor-pointer"
              >
                Reject
              </button>

              <button
                onClick={() => handleRunCampaign()}
                disabled={isRunning}
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isRunning ? "Running..." : "Apply changes"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Lead Email Inspector */}
      <AnimatePresence>
        {selectedLeadPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-xl rounded-3xl bg-card border border-border p-6 shadow-2xl flex flex-col space-y-4 text-foreground"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-sm">
                    {selectedLeadPreview.businessName}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedLeadPreview(null)}
                  className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-muted-foreground">Subject: </span>
                  <span className="font-semibold text-foreground">
                    {selectedLeadPreview.emailSubject}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">To: </span>
                  <span className="font-mono text-muted-foreground">
                    {selectedLeadPreview.email}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/40 border border-border text-xs leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">
                {selectedLeadPreview.emailBody}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
