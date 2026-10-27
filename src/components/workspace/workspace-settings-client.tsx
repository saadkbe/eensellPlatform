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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Paramètres & Intégrations
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Workspace Config
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Connectez votre compte Gmail pour l'envoi direct et personnalisez la voix de votre agent.
          </p>
        </div>

        <button
          onClick={() => handleSave()}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
        >
          {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </div>

      {/* Gmail Connection Card */}
      <div className="rounded-3xl bg-card border border-border p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Connexion Gmail (SMTP Sécurisé)
              </h2>
              <p className="text-xs text-muted-foreground">
                L'agent expédie vos emails directement depuis votre propre boîte Gmail.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isGmailConnected ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>GMAIL CONNECTÉ</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border text-xs font-bold font-mono">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>NON CONNECTÉ</span>
              </span>
            )}
          </div>
        </div>

        {/* 3-Step Setup Explainer */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border text-xs space-y-2 text-foreground">
          <div className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>Comment obtenir votre mot de passe d'application Google (30 secondes) :</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground pl-1">
            <li>
              Ouvrez votre{" "}
              <a
                href="https://myaccount.google.com/security"
                target="_blank"
                rel="noreferrer"
                className="text-amber-600 dark:text-amber-400 font-medium hover:underline inline-flex items-center gap-0.5"
              >
                Compte Google &gt; Sécurité <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>Assurez-vous que la validation en 2 étapes est activée.</li>
            <li>
              Ouvrez{" "}
              <a
                href="https://myaccount.google.com/apppasswords"
                target="_blank"
                rel="noreferrer"
                className="text-amber-600 dark:text-amber-400 font-medium hover:underline inline-flex items-center gap-0.5"
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
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Adresse Gmail
            </label>
            <input
              type="email"
              value={gmailAddress}
              onChange={(e) => setGmailAddress(e.target.value)}
              placeholder="votre-nom@gmail.com"
              className="w-full px-4 py-2.5 rounded-xl bg-muted/40 border border-border text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Mot de passe d'application Google (16 lettres)
            </label>
            <input
              type="password"
              value={gmailAppPassword}
              onChange={(e) => setGmailAppPassword(e.target.value)}
              placeholder="ex: abcd efgh ijkl mnop"
              className="w-full px-4 py-2.5 rounded-xl bg-muted/40 border border-border text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Nom d'expéditeur affiché
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="ex: Saad | Eensell Partner"
              className="w-full px-4 py-2.5 rounded-xl bg-muted/40 border border-border text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Nom de votre Agence / Marque
            </label>
            <input
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              placeholder="ex: Eensell Automations"
              className="w-full px-4 py-2.5 rounded-xl bg-muted/40 border border-border text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Gmail Test Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleTestGmail}
            disabled={isTesting || !gmailAddress}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card hover:bg-muted text-foreground border border-border text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? "animate-spin" : ""}`} />
            <span>{isTesting ? "Test en cours..." : "Tester la connexion Gmail"}</span>
          </button>
        </div>
      </div>

      {/* ElevenLabs Voice Settings Card */}
      <div className="rounded-3xl bg-card border border-border p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Synthèse Vocale & ElevenLabs API
              </h2>
              <p className="text-xs text-muted-foreground">
                Optionnel. Par défaut, le workspace utilise la voix native fluide de votre navigateur (100% gratuit).
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Clé API ElevenLabs (Optionnel)
            </label>
            <input
              type="password"
              value={elevenLabsApiKey}
              onChange={(e) => setElevenLabsApiKey(e.target.value)}
              placeholder="xi-api-key..."
              className="w-full px-4 py-2.5 rounded-xl bg-muted/40 border border-border text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Modèle de Voix
            </label>
            <select
              value={voiceId}
              onChange={(e) => setVoiceId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-muted/40 border border-border text-xs text-foreground focus:outline-none focus:border-amber-500"
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
