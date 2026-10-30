"use client";

import { useState } from "react";
import {
  Mail,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Building,
  Lock,
  Cpu,
  HelpCircle,
  Eye,
  EyeOff,
  Radio,
  Server,
  Zap,
  Check,
  Compass,
  Volume2,
} from "lucide-react";
import {
  WorkspaceAccountData,
  updateWorkspaceSettings,
  testGmailConnection,
} from "@/actions/workspace.actions";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface WorkspaceSettingsClientProps {
  initialAccount: WorkspaceAccountData;
}

export function WorkspaceSettingsClient({
  initialAccount,
}: WorkspaceSettingsClientProps) {
  const [activeTab, setActiveTab] = useState<"api" | "email" | "agency" | "security">("api");

  // API Keys state
  const [outscraperApiKey, setOutscraperApiKey] = useState(
    initialAccount.outscraperApiKey || ""
  );
  const [openaiApiKey, setOpenaiApiKey] = useState(
    initialAccount.openaiApiKey || ""
  );
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState(
    initialAccount.elevenLabsApiKey || ""
  );
  const [voiceId, setVoiceId] = useState(
    initialAccount.voiceId || "21m00Tcm4TlvDq8ikWAM"
  );

  // Email / SMTP state
  const [gmailAddress, setGmailAddress] = useState(
    initialAccount.gmailAddress || ""
  );
  const [gmailAppPassword, setGmailAppPassword] = useState(
    initialAccount.isGmailConnected ? "••••••••••••••••" : ""
  );

  // Agency profile state
  const [senderName, setSenderName] = useState(
    initialAccount.senderName || ""
  );
  const [agencyName, setAgencyName] = useState(
    initialAccount.agencyName || ""
  );

  // Reveal toggles
  const [showOpenAiKey, setShowOpenAiKey] = useState(false);
  const [showOutscraperKey, setShowOutscraperKey] = useState(false);
  const [showGmailPassword, setShowGmailPassword] = useState(false);

  // Status flags
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isGmailConnected, setIsGmailConnected] = useState(
    initialAccount.isGmailConnected
  );
  const [isOutscraperConnected, setIsOutscraperConnected] = useState(
    initialAccount.isOutscraperConnected
  );
  const [isOpenAIConnected, setIsOpenAIConnected] = useState(
    initialAccount.isOpenAIConnected
  );

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateWorkspaceSettings({
        outscraperApiKey,
        openaiApiKey,
        elevenLabsApiKey,
        voiceId,
        gmailAddress,
        gmailAppPassword,
        senderName,
        agencyName,
      });

      if (res.success) {
        if (outscraperApiKey && !outscraperApiKey.includes("•")) {
          setIsOutscraperConnected(true);
        }
        if (openaiApiKey && !openaiApiKey.includes("•")) {
          setIsOpenAIConnected(true);
        }
        toast.success("Paramètres et clés API enregistrés avec succès !");
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la sauvegarde.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestGmail = async () => {
    setIsTesting(true);
    try {
      await updateWorkspaceSettings({
        gmailAddress,
        gmailAppPassword,
        senderName,
        agencyName,
      });

      const res = await testGmailConnection();
      if (res.success) {
        setIsGmailConnected(true);
        toast.success(res.message);
      } else {
        setIsGmailConnected(false);
        toast.error(res.error);
      }
    } catch (err: any) {
      setIsGmailConnected(false);
      toast.error(err.message);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 select-text">
      {/* ── Executive Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EDEDEB] dark:border-[#2E2E2E]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/40">
              <Key className="w-3.5 h-3.5" />
              SYSTEM INFRASTRUCTURE &bull; CREDENTIALS
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#37352F] dark:text-[#E6E6E5]">
            Workspace Settings & Integrations
          </h1>
          <p className="text-xs sm:text-sm text-[#787774] dark:text-[#9B9A97]">
            Configure your AI keys, Google Maps scraper tokens, and Gmail SMTP for autonomous client acquisition.
          </p>
        </div>

        <Button
          onClick={() => handleSave()}
          disabled={isSaving}
          className="h-9 px-4 rounded-xl text-xs font-semibold bg-[#37352F] hover:bg-[#262420] dark:bg-[#E6E6E5] dark:hover:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#191919] shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shrink-0"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Save All Changes</span>
            </>
          )}
        </Button>
      </div>

      {/* ── Quick Health & Integration Status Pills ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* OpenAI Status */}
        <div className="p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-[#787774] dark:text-[#9B9A97] uppercase tracking-wider block">
              OpenAI GPT-4o
            </span>
            <span className="text-xs font-bold text-[#37352F] dark:text-[#E6E6E5]">
              AI Drafter & Pitch
            </span>
          </div>
          {isOpenAIConnected ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
              <AlertCircle className="w-3 h-3 text-amber-500" />
              Required
            </span>
          )}
        </div>

        {/* Outscraper Status */}
        <div className="p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-[#787774] dark:text-[#9B9A97] uppercase tracking-wider block">
              Outscraper Maps
            </span>
            <span className="text-xs font-bold text-[#37352F] dark:text-[#E6E6E5]">
              Lead Scraper
            </span>
          </div>
          {isOutscraperConnected ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
              <AlertCircle className="w-3 h-3 text-amber-500" />
              Required
            </span>
          )}
        </div>

        {/* Gmail SMTP Status */}
        <div className="p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-[#787774] dark:text-[#9B9A97] uppercase tracking-wider block">
              Gmail SMTP
            </span>
            <span className="text-xs font-bold text-[#37352F] dark:text-[#E6E6E5]">
              Direct Send
            </span>
          </div>
          {isGmailConnected ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Handshake OK
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F5F5F4] dark:bg-[#2A2A2A] text-[#787774] dark:text-[#9B9A97]">
              Optional
            </span>
          )}
        </div>

        {/* Database Status */}
        <div className="p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-[#787774] dark:text-[#9B9A97] uppercase tracking-wider block">
              PostgreSQL Neon
            </span>
            <span className="text-xs font-bold text-[#37352F] dark:text-[#E6E6E5]">
              Prisma ORM
            </span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Synchronized
          </span>
        </div>
      </div>

      {/* ── Category Tabs Navigation ── */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F7F6F3] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab("api")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
            activeTab === "api"
              ? "bg-[#FFFFFF] dark:bg-[#2C2C2C] text-[#37352F] dark:text-[#E6E6E5] shadow-xs"
              : "text-[#787774] dark:text-[#9B9A97] hover:text-[#37352F] dark:hover:text-[#E6E6E5]"
          }`}
        >
          <Key className="w-3.5 h-3.5 text-blue-500" />
          <span>API Keys & AI Models</span>
        </button>

        <button
          onClick={() => setActiveTab("email")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
            activeTab === "email"
              ? "bg-[#FFFFFF] dark:bg-[#2C2C2C] text-[#37352F] dark:text-[#E6E6E5] shadow-xs"
              : "text-[#787774] dark:text-[#9B9A97] hover:text-[#37352F] dark:hover:text-[#E6E6E5]"
          }`}
        >
          <Mail className="w-3.5 h-3.5 text-red-500" />
          <span>Gmail SMTP Dispatch</span>
        </button>

        <button
          onClick={() => setActiveTab("agency")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
            activeTab === "agency"
              ? "bg-[#FFFFFF] dark:bg-[#2C2C2C] text-[#37352F] dark:text-[#E6E6E5] shadow-xs"
              : "text-[#787774] dark:text-[#9B9A97] hover:text-[#37352F] dark:hover:text-[#E6E6E5]"
          }`}
        >
          <Building className="w-3.5 h-3.5 text-amber-500" />
          <span>Agency Profile & Brand</span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
            activeTab === "security"
              ? "bg-[#FFFFFF] dark:bg-[#2C2C2C] text-[#37352F] dark:text-[#E6E6E5] shadow-xs"
              : "text-[#787774] dark:text-[#9B9A97] hover:text-[#37352F] dark:hover:text-[#E6E6E5]"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Security & Data Sovereignty</span>
        </button>
      </div>

      {/* ── TAB 1: API KEYS & AI MODELS ── */}
      {activeTab === "api" && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          {/* OpenAI GPT-4o Card */}
          <div className="rounded-2xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EDEDEB] dark:border-[#2E2E2E]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#37352F] dark:text-[#E6E6E5]">
                    OpenAI API Key (GPT-4o & GPT-4o-mini)
                  </h2>
                  <p className="text-xs text-[#787774] dark:text-[#9B9A97]">
                    Powers cold email generation, WhatsApp hooks, and objection handling scripts in Darija & French.
                  </p>
                </div>
              </div>

              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Get API Key</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                Secret Key (Starts with sk-proj-...)
              </label>
              <div className="relative">
                <input
                  type={showOpenAiKey ? "text" : "password"}
                  value={openaiApiKey}
                  onChange={(e) => setOpenaiApiKey(e.target.value)}
                  placeholder="sk-proj-..."
                  className="w-full bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-xl px-3.5 py-2.5 text-xs text-[#37352F] dark:text-[#E6E6E5] font-mono outline-none focus:border-emerald-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowOpenAiKey(!showOpenAiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B9A97] hover:text-[#37352F] dark:hover:text-[#E6E6E5]"
                >
                  {showOpenAiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-[#787774] dark:text-[#9B9A97]">
                Tip: With GPT-4o-mini, $5 of OpenAI credits generates over 10,000 highly personalized outreach emails.
              </p>
            </div>
          </div>

          {/* Outscraper Google Maps Card */}
          <div className="rounded-2xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EDEDEB] dark:border-[#2E2E2E]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#37352F] dark:text-[#E6E6E5]">
                    Outscraper API Key (Google Maps Scraper)
                  </h2>
                  <p className="text-xs text-[#787774] dark:text-[#9B9A97]">
                    Extracts verified phone numbers, business ratings, and decision-maker contacts in real time.
                  </p>
                </div>
              </div>

              <a
                href="https://outscraper.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Get 500 Free Leads</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                API Token
              </label>
              <div className="relative">
                <input
                  type={showOutscraperKey ? "text" : "password"}
                  value={outscraperApiKey}
                  onChange={(e) => setOutscraperApiKey(e.target.value)}
                  placeholder="e.g. ZGFhMWQ4NDRlNWI1..."
                  className="w-full bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-xl px-3.5 py-2.5 text-xs text-[#37352F] dark:text-[#E6E6E5] font-mono outline-none focus:border-blue-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowOutscraperKey(!showOutscraperKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B9A97] hover:text-[#37352F] dark:hover:text-[#E6E6E5]"
                >
                  {showOutscraperKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-[#787774] dark:text-[#9B9A97]">
                Outscraper provides a free tier of 500 business extractions per month without requiring a credit card.
              </p>
            </div>
          </div>

          {/* ElevenLabs Voice AI Card */}
          <div className="rounded-2xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EDEDEB] dark:border-[#2E2E2E]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#37352F] dark:text-[#E6E6E5]">
                    ElevenLabs Voice Synthesis (WhatsApp Audio Notes)
                  </h2>
                  <p className="text-xs text-[#787774] dark:text-[#9B9A97]">
                    Optional: Generates ultra-realistic voice note pitches to send prospects via WhatsApp.
                  </p>
                </div>
              </div>

              <a
                href="https://elevenlabs.io"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline inline-flex items-center gap-1"
              >
                <span>ElevenLabs Console</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                  ElevenLabs API Key
                </label>
                <input
                  type="password"
                  value={elevenLabsApiKey}
                  onChange={(e) => setElevenLabsApiKey(e.target.value)}
                  placeholder="xi-api-key..."
                  className="w-full bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-xl px-3.5 py-2.5 text-xs text-[#37352F] dark:text-[#E6E6E5] font-mono outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                  Default Voice ID
                </label>
                <input
                  type="text"
                  value={voiceId}
                  onChange={(e) => setVoiceId(e.target.value)}
                  placeholder="21m00Tcm4TlvDq8ikWAM (Rachel)"
                  className="w-full bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-xl px-3.5 py-2.5 text-xs text-[#37352F] dark:text-[#E6E6E5] font-mono outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── TAB 2: GMAIL SMTP DISPATCH ── */}
      {activeTab === "email" && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] p-6 shadow-2xs space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EDEDEB] dark:border-[#2E2E2E]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#37352F] dark:text-[#E6E6E5]">
                  Google SMTP Relay & App Password
                </h2>
                <p className="text-xs text-[#787774] dark:text-[#9B9A97]">
                  Enables 1-click email dispatch directly from your personal Gmail address with 100% DKIM reputation.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={handleTestGmail}
                disabled={isTesting || !gmailAddress}
                variant="outline"
                className="h-8 text-xs font-semibold border-[#EDEDEB] dark:border-[#2E2E2E] gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? "animate-spin" : ""}`} />
                <span>{isTesting ? "Testing Handshake..." : "Test SMTP Connection"}</span>
              </Button>
            </div>
          </div>

          {/* Step by step guide */}
          <div className="p-4 rounded-xl bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] text-xs space-y-2">
            <div className="font-bold text-[#37352F] dark:text-[#E6E6E5] flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              <span>How to generate your 16-character Google App Password in 60 seconds:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[#787774] dark:text-[#9B9A97] pl-1">
              <li>
                Open{" "}
                <a
                  href="https://myaccount.google.com/apppasswords"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 dark:text-blue-400 font-semibold underline inline-flex items-center gap-0.5"
                >
                  myaccount.google.com/apppasswords <ExternalLink className="w-3 h-3" />
                </a>.
              </li>
              <li>Type an app name like <strong>Eensell Workspace</strong> and click <strong>Create</strong>.</li>
              <li>Google gives you a 16-character password (e.g. <code className="bg-[#EDEDEB] dark:bg-[#2C2C2C] px-1 py-0.5 rounded font-mono">abcd efgh ijkl mnop</code>).</li>
              <li>Paste your Gmail and the 16-character password below, then click <strong>Test SMTP Connection</strong>.</li>
            </ol>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                Your Gmail Address
              </label>
              <input
                type="email"
                value={gmailAddress}
                onChange={(e) => setGmailAddress(e.target.value)}
                placeholder="founder@gmail.com"
                className="w-full bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-xl px-3.5 py-2.5 text-xs text-[#37352F] dark:text-[#E6E6E5] outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                16-Character App Password
              </label>
              <div className="relative">
                <input
                  type={showGmailPassword ? "text" : "password"}
                  value={gmailAppPassword}
                  onChange={(e) => setGmailAppPassword(e.target.value)}
                  placeholder="abcd efgh ijkl mnop"
                  className="w-full bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-xl px-3.5 py-2.5 text-xs text-[#37352F] dark:text-[#E6E6E5] font-mono outline-none focus:border-red-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowGmailPassword(!showGmailPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B9A97] hover:text-[#37352F] dark:hover:text-[#E6E6E5]"
                >
                  {showGmailPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── TAB 3: AGENCY BRAND & SENDER PROFILE ── */}
      {activeTab === "agency" && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] p-6 shadow-2xs space-y-5"
        >
          <div className="pb-3 border-b border-[#EDEDEB] dark:border-[#2E2E2E]">
            <h2 className="text-sm font-bold text-[#37352F] dark:text-[#E6E6E5]">
              Agency Brand & Default Signature
            </h2>
            <p className="text-xs text-[#787774] dark:text-[#9B9A97]">
              Injected automatically into your invoices, cold email templates, and CRM contact cards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                Agency / Company Name
              </label>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                placeholder="e.g. Atlas AI Automations"
                className="w-full bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-xl px-3.5 py-2.5 text-xs text-[#37352F] dark:text-[#E6E6E5] outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                Sender / Founder Name & Title
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Saad K. | Head of AI Solutions"
                className="w-full bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-xl px-3.5 py-2.5 text-xs text-[#37352F] dark:text-[#E6E6E5] outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* ── TAB 4: SECURITY & DATA SOVEREIGNTY ── */}
      {activeTab === "security" && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] p-6 shadow-2xs space-y-4"
        >
          <div className="pb-3 border-b border-[#EDEDEB] dark:border-[#2E2E2E]">
            <h2 className="text-sm font-bold text-[#37352F] dark:text-[#E6E6E5] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Data Sovereignty & Zero Vendor Lock-in</span>
            </h2>
            <p className="text-xs text-[#787774] dark:text-[#9B9A97]">
              How your credentials, leads, and agency cashflow data are managed.
            </p>
          </div>

          <div className="space-y-3 text-xs text-[#787774] dark:text-[#9B9A97] leading-relaxed">
            <div className="p-3.5 rounded-xl bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] space-y-1.5">
              <h4 className="font-bold text-[#37352F] dark:text-[#E6E6E5]">
                🔒 100% User-Owned API Credentials
              </h4>
              <p>
                Unlike generic software platforms that bill you marked-up credits, Eensell Workspace uses your direct API keys. You never pay intermediate fees, and you retain complete ownership of your Google Maps leads and AI pitch logs.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] space-y-1.5">
              <h4 className="font-bold text-[#37352F] dark:text-[#E6E6E5]">
                🗄️ Isolated PostgreSQL Storage
              </h4>
              <p>
                Your leads, retainers, and tasks are persisted in dedicated Neon PostgreSQL tables under your authenticated user record. Deleting a lead or campaign removes it permanently.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
