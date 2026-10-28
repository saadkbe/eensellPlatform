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
  Compass,
  Cpu,
  HelpCircle,
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
  const [outscraperApiKey, setOutscraperApiKey] = useState(
    initialAccount.outscraperApiKey || ""
  );
  const [openaiApiKey, setOpenaiApiKey] = useState(
    initialAccount.openaiApiKey || ""
  );
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
        gmailAddress,
        gmailAppPassword,
        senderName,
        agencyName,
      });
      if (res.success) {
        if (outscraperApiKey && !outscraperApiKey.includes("•")) {
          setIsOutscraperConnected(true);
          setOutscraperApiKey("••••••••••••••••");
        }
        if (openaiApiKey && !openaiApiKey.includes("•")) {
          setIsOpenAIConnected(true);
          setOpenaiApiKey("••••••••••••••••");
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
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Paramètres & Clés API
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              BYOK Config
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Connectez vos propres clés API (Scraper Google Maps & OpenAI) pour alimenter votre Workspace OS en toute autonomie.
          </p>
        </div>

        <button
          onClick={() => handleSave()}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Enregistrement...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Enregistrer les clés</span>
            </>
          )}
        </button>
      </div>

      {/* Concept Explainer Banner */}
      <div className="rounded-2xl bg-amber-500/10 border border-amber-500/25 p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-foreground">
            Principe Eensell Workspace : Vous gardez 100% du contrôle sur vos données et vos coûts
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Eensell Workspace fournit le moteur, les workflows et les algorithmes de prospection. En ajoutant votre propre clé Outscraper et OpenAI, vous ne dépendez d'aucun abonnement tiers bridé : vous bénéficiez des quotas gratuits de chaque plateforme et ne payez que quelques centimes si vous scalez.
          </p>
        </div>
      </div>

      {/* 1. OUTSCRAPER API KEY (GOOGLE MAPS SCRAPER) */}
      <div className="rounded-3xl bg-card border border-border p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                1. Scraper Google Maps (Clé API Outscraper)
              </h2>
              <p className="text-xs text-muted-foreground">
                Alimente la recherche de prospects en direct avec téléphones vérifiés, emails et notes.
              </p>
            </div>
          </div>

          <div>
            {isOutscraperConnected ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>SCRAPER ACTIF</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border text-xs font-bold font-mono">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>CLÉ NON CONFIGURÉE</span>
              </span>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border text-xs space-y-2 text-foreground">
          <div className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Comment obtenir votre clé Outscraper gratuite en 1 minute :</span>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 text-muted-foreground pl-1">
            <li>
              Créez un compte gratuit sur{" "}
              <a
                href="https://outscraper.com"
                target="_blank"
                rel="noreferrer"
                className="text-primary font-bold hover:underline inline-flex items-center gap-0.5"
              >
                Outscraper.com <ExternalLink className="w-3 h-3" />
              </a>{" "}
              (vous recevez un quota gratuit de 500 prospects sans carte bancaire requise).
            </li>
            <li>
              Rendez-vous dans votre onglet <strong>API Access / Profile</strong> et copiez votre <strong>API Key</strong>.
            </li>
            <li>Collez-la ci-dessous et cliquez sur "Enregistrer les clés".</li>
          </ol>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
            Clé API Outscraper
          </label>
          <div className="relative">
            <input
              type="password"
              value={outscraperApiKey}
              onChange={(e) => setOutscraperApiKey(e.target.value)}
              placeholder="ex: ZGFhMWQ4NDRl... ou collez votre clé"
              className="w-full px-4 py-2.5 rounded-xl bg-muted/40 border border-border text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* 2. OPENAI API KEY (AI DRAFTER) */}
      <div className="rounded-3xl bg-card border border-border p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                2. Intelligence Artificielle (Clé API OpenAI)
              </h2>
              <p className="text-xs text-muted-foreground">
                Utilisé par le Rédacteur IA pour générer des emails de vente, messages WhatsApp et scripts personnalisés en Darija, Français et Anglais.
              </p>
            </div>
          </div>

          <div>
            {isOpenAIConnected ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>IA ACTIVE (GPT-4o-mini)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border text-xs font-bold font-mono">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>CLÉ NON CONFIGURÉE</span>
              </span>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border text-xs space-y-2 text-foreground">
          <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Comment obtenir votre clé OpenAI :</span>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 text-muted-foreground pl-1">
            <li>
              Connectez-vous sur{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text-primary font-bold hover:underline inline-flex items-center gap-0.5"
              >
                platform.openai.com/api-keys <ExternalLink className="w-3 h-3" />
              </a>.
            </li>
            <li>
              Cliquez sur <strong>"Create new secret key"</strong>, donnez-lui un nom (ex: "Eensell Workspace") et copiez-la.
            </li>
            <li>
              Le système utilise le modèle <strong>GPT-4o-mini</strong> : 5$ de crédit OpenAI vous permettent de rédiger plus de 10 000 emails et scripts sans surcoût.
            </li>
          </ol>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
            Clé API OpenAI (commence par sk-...)
          </label>
          <input
            type="password"
            value={openaiApiKey}
            onChange={(e) => setOpenaiApiKey(e.target.value)}
            placeholder="sk-proj-..."
            className="w-full px-4 py-2.5 rounded-xl bg-muted/40 border border-border text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>
      </div>

      {/* 3. AGENCY & FOUNDER IDENTITY */}
      <div className="rounded-3xl bg-card border border-border p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">
              3. Profil Agence & Signature de Prospection
            </h2>
            <p className="text-xs text-muted-foreground">
              Ces informations seront automatiquement injectées dans vos factures, emails et devis.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Nom de votre Agence / Marque
            </label>
            <input
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              placeholder="ex: Eensell Automation Agency"
              className="w-full px-4 py-2.5 rounded-xl bg-muted/40 border border-border text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Nom complet du Fondateur / Expéditeur
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="ex: Saad K. | Fondateur"
              className="w-full px-4 py-2.5 rounded-xl bg-muted/40 border border-border text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* 4. GMAIL DIRECT DISPATCH (OPTIONAL) */}
      <div className="rounded-3xl bg-card border border-border p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                4. Envoi Direct Gmail SMTP (Optionnel)
              </h2>
              <p className="text-xs text-muted-foreground">
                Permet d'envoyer des emails en 1 clic sans quitter le workspace.
              </p>
            </div>
          </div>

          <div>
            {isGmailConnected ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>GMAIL CONNECTÉ</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border text-xs font-bold font-mono">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>NON CONNECTÉ</span>
              </span>
            )}
          </div>
        </div>

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
        </div>

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
    </div>
  );
}
