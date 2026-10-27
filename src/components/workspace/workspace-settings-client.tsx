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
  User,
  Building,
  Volume2,
  Lock,
} from "lucide-react";
import {
  WorkspaceAccountData,
  updateWorkspaceSettings,
  testGmailConnection,
} from "@/actions/workspace.actions";
import { toast } from "sonner";

interface WorkspaceSettingsClientProps {
  initialAccount: WorkspaceAccountData;
}

export function WorkspaceSettingsClient({
  initialAccount,
}: WorkspaceSettingsClientProps) {
  const [gmailAddress, setGmailAddress] = useState(
    initialAccount.gmailAddress || ""
  );
  const [gmailAppPassword, setGmailAppPassword] = useState(
    initialAccount.isGmailConnected ? "••••••••••••••••" : ""
  );
  const [senderName, setSenderName] = useState(
    initialAccount.senderName || ""
  );
  const [agencyName, setAgencyName] = useState(
    initialAccount.agencyName || ""
  );
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState(
    initialAccount.elevenLabsApiKey || ""
  );
  const [voiceId, setVoiceId] = useState(
    initialAccount.voiceId || "21m00Tcm4TlvDq8ikWAM"
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isGmailConnected, setIsGmailConnected] = useState(
    initialAccount.isGmailConnected
  );

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateWorkspaceSettings({
        gmailAddress,
        gmailAppPassword,
        senderName,
        agencyName,
        elevenLabsApiKey,
        voiceId,
      });
      if (res.success) {
        toast.success("Paramètres enregistrés avec succès !");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestGmail = async () => {
    setIsTesting(true);
    try {
      // First save current inputs
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
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Paramètres & Intégrations
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Workspace Config
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Connectez votre boîte Gmail pour l'envoi d'emails réels et configurez la voix de votre agent.
          </p>
        </div>

        <button
          onClick={() => handleSave()}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all cursor-pointer disabled:opacity-50"
        >
          {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </div>

      {/* Gmail Connection Card */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Connexion Gmail (SMTP Authentifié)
              </h2>
              <p className="text-xs text-slate-400">
                L'agent envoie vos emails depuis votre propre compte Gmail. Les réponses arrivent directement dans votre boîte de réception.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isGmailConnected ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>GMAIL CONNECTÉ</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-bold font-mono">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>NON CONNECTÉ</span>
              </span>
            )}
          </div>
        </div>

        {/* 3-Step Setup Explainer */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs space-y-2 text-slate-300">
          <div className="font-bold text-amber-300 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Comment obtenir votre mot de passe d'application Google (30 secondes) :</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-1">
            <li>
              Ouvrez votre{" "}
              <a
                href="https://myaccount.google.com/security"
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:underline font-medium inline-flex items-center gap-0.5"
              >
                Compte Google &gt; Sécurité <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>Assurez-vous que la validation en 2 étapes est activée.</li>
            <li>
              Recherchez{" "}
              <a
                href="https://myaccount.google.com/apppasswords"
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:underline font-medium inline-flex items-center gap-0.5"
              >
                Mots de passe des applications <ExternalLink className="w-3 h-3" />
              </a>
              , nommez-le <strong>"Eensell Workspace"</strong> et collez le code de 16 lettres ci-dessous.
            </li>
          </ol>
        </div>

        {/* Gmail Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Adresse Gmail
            </label>
            <input
              type="email"
              value={gmailAddress}
              onChange={(e) => setGmailAddress(e.target.value)}
              placeholder="votre-nom@gmail.com"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Mot de passe d'application Google (16 lettres)
            </label>
            <input
              type="password"
              value={gmailAppPassword}
              onChange={(e) => setGmailAppPassword(e.target.value)}
              placeholder="ex: abcd efgh ijkl mnop"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/50 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Nom d'expéditeur affiché
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="ex: Saad | Eensell AI Partner"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Nom de votre Agence / Marque
            </label>
            <input
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              placeholder="ex: Eensell Automations Maroc"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>

        {/* Gmail Test Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleTestGmail}
            disabled={isTesting || !gmailAddress}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? "animate-spin" : ""}`} />
            <span>{isTesting ? "Test en cours..." : "Tester la connexion Gmail"}</span>
          </button>
        </div>
      </div>

      {/* ElevenLabs Voice Settings Card */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Synthèse Vocale & ElevenLabs API
              </h2>
              <p className="text-xs text-slate-400">
                Optionnel. Par défaut, le workspace utilise la voix native fluide de votre navigateur (100% gratuit).
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Clé API ElevenLabs (Optionnel)
            </label>
            <input
              type="password"
              value={elevenLabsApiKey}
              onChange={(e) => setElevenLabsApiKey(e.target.value)}
              placeholder="xi-api-key..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/50 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Modèle de Voix
            </label>
            <select
              value={voiceId}
              onChange={(e) => setVoiceId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500/50"
            >
              <option value="21m00Tcm4TlvDq8ikWAM">Rachel (Clair, Professionnel, Voix Standard)</option>
              <option value="AZnzlk1XvdvUeBnXmlld">Domi (Énergique, Dynamique)</option>
              <option value="EXAVITQu4vr4xnSDxMaL">Bella (Douce, Commerciale)</option>
              <option value="ErXwobaYiN019PkySvjV">Antoni (Masculin, Autorité)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
