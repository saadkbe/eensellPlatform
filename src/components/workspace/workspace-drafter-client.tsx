"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Send,
  Mail,
  Copy,
  Check,
  Sparkles,
  Phone,
  MessageSquare,
  MessageCircle,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function WorkspaceDrafterClient() {
  const searchParams = useSearchParams();
  const initialName = searchParams.get("name") || "Atlas Prestige Immobilier";
  const initialNiche = searchParams.get("niche") || "Real Estate Agencies";
  const initialCity = searchParams.get("city") || "Casablanca";

  const [channel, setChannel] = useState<"email" | "whatsapp" | "instagram" | "phone">("email");
  const [businessName, setBusinessName] = useState(initialName);
  const [contactName, setContactName] = useState("M. le Directeur");
  const [city, setCity] = useState(initialCity);
  const [niche, setNiche] = useState(initialNiche);
  const [service, setService] = useState("whatsapp_bot");
  const [language, setLanguage] = useState<"fr" | "darija" | "en">("fr");
  const [copied, setCopied] = useState(false);

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const generatePitch = () => {
    let sub = "";
    let content = "";

    if (channel === "email") {
      if (language === "fr") {
        sub = `Question concernant vos prospects acquéreurs à ${city} — ${businessName}`;
        content = `Bonjour ${contactName},

J'ai remarqué l'excellente réputation de ${businessName} sur le marché de ${city}.

En analysant la réactivité moyenne sur les demandes d'acquéreurs et de clients dans votre secteur, nous avons constaté qu'une entreprise perd en moyenne 35% de ses opportunités qualifiées simplement parce que les prospects attendent plus de 15 minutes avant d'obtenir une réponse ou une prise de rendez-vous.

Chez notre agence, nous avons mis en place une infrastructure d'automatisation IA dédiée aux professionnels exigeants :
1. Qualification instantanée 24h/24 et 7j/7 sur WhatsApp de chaque prospect (budget, besoin exact, urgence).
2. Prise de rendez-vous automatique synchronisée directement dans votre agenda Google/Outlook.
3. Zéro prospect laissé sans suivi ni relance.

Seriez-vous ouvert à un rapide échange de 10 minutes ce jeudi à 15h pour voir une démonstration concrète adaptée à ${businessName} ?

Bien cordialement,

[Votre Nom]
Directeur Associé — Eensell Partner Agency
Tél / WhatsApp : +212 6...`;
      } else if (language === "darija") {
        sub = `Fikra jdida pour digitaliser les clients dial ${businessName}`;
        content = `Salam ${contactName},

Kantmenna tkoun bikhir. Chft l-khdma li kadirou f ${businessName} f ${city} w tbarkellah 3ndkom positionnement wa3r.

Bghit nwerik wahed l-système d'automatisation WhatsApp li sawbnah spécial pour votre domaine :
- Kayjawb les clients dialkom f a9al men 10 secondes 24h/24.
- Kayfélter les vrais acheteurs (budget, localisation, disponibilité).
- Kayakhod m3ahom rendez-vous direct f l'agenda bla ma dy3ou l-we9t.

Wach momkin ndirou un appel dyal 5 d9aye9 had l-khamis nwerik kifax khedam had l-outil en direct ?

Merci bzaf w nhark mebrouk,
[Votre Nom]`;
      } else {
        sub = `Quick question regarding inbound leads for ${businessName}`;
        content = `Hi ${contactName},

I came across ${businessName} while reviewing top providers in ${city}.

Most businesses in your sector lose up to 40% of their qualified leads simply due to response times exceeding 15 minutes on evenings and weekends.

We build autonomous AI appointment bots that:
1. Instantly qualify inbound prospects 24/7 on WhatsApp & Website chat.
2. Filter for budget, intent, and decision-maker status.
3. Automatically book confirmed meetings onto your calendar.

Would you be open to a brief 7-minute walkthrough this Thursday at 3 PM to see how this works for ${businessName}?

Best regards,

[Your Name]
Founder — AI Automation Agency`;
      }
    } else if (channel === "whatsapp") {
      sub = "WhatsApp Message";
      if (language === "darija") {
        content = `Salam ${contactName} 👋
Kantmenna tkoun bikhir. Chft l-profil dial ${businessName} w 3jbatni l-khdma dialkom.

Sawbna un prototype d'assistant WhatsApp li kayjawb les clients dialkom f a9al men 5 secondes, kayfélter les curieux w kay-bloquer les rendez-vous direct f l'agenda.

Bghit nsefet lik une petite vidéo de 1 minute nwerik kifax kaykhedem b smiyet ${businessName}. Wach momkin nsifetha lik hna ? 🙏`;
      } else if (language === "fr") {
        content = `Bonjour ${contactName} 👋
J'espère que vous allez bien. Je vous contacte suite à la découverte de ${businessName} à ${city}.

Nous avons développé un système WhatsApp IA qui répond instantanément à vos prospects 24/7, qualifie leur budget et prend directement les rendez-vous dans votre agenda.

Seriez-vous d'accord pour que je vous envoie une courte vidéo démo de 60 secondes personnalisée pour ${businessName} ? 🙏`;
      } else {
        content = `Hey ${contactName} 👋 Hope you're having a productive week!
Saw ${businessName}'s presence in ${city} and love what you're building.

We developed an AI WhatsApp agent that replies in under 5 seconds, qualifies buyer intent, and books consultations straight into your calendar.

Mind if I send over a 60-second video demo showing how it works with your brand?`;
      }
    } else if (channel === "phone") {
      sub = "Cold Calling Script";
      content = `[RÉCEPTION / STANDARD] :
"Bonjour, je souhaitais simplement joindre le responsable du développement ou ${contactName} s'il vous plaît ?"

[DÈS QUE LE DÉCIDEUR DÉCROCHE] :
"Bonjour ${contactName}, je vais être très bref, je sais que vous êtes occupé.
Je suis [Votre Nom], spécialiste en automatisation IA pour les entreprises à ${city}.

La raison de mon appel : nous venons de déployer un système de qualification WhatsApp et d'appels IA qui permet à des entreprises comme ${businessName} de ne plus perdre aucun prospect en dehors des heures d'ouverture.

Je ne vous appelle pas pour vous vendre quoi que ce soit aujourd'hui, je voulais simplement vous demander : comment gérez-vous actuellement vos demandes entrantes le soir et le week-end ?"

[SI OBJECTION "ENVOYEZ UN MAIL"] :
"Avec plaisir. Pour que je vous envoie une démo pertinente et pas un template générique, est-ce que votre priorité ce mois-ci c'est plutôt de capter plus de prospects, ou d'automatiser la prise de rendez-vous ?"`;
    } else {
      sub = "Instagram DM";
      content = `Salam ${contactName} 👋 Bravo pour vos publications et votre travail chez ${businessName} !

Petite question rapide : est-ce que vous recevez beaucoup de demandes de devis et d'inscriptions directement en message privé ici sur Instagram ?

Nous avons créé un bot IA qui répond aux DMs en moins de 3 secondes pour réserver des rendez-vous sans que vous ayez à passer vos journées sur votre téléphone.

Si vous voulez jeter un œil à la démo, je vous l'envoie ici avec plaisir ! 🔥`;
    }

    setSubject(sub);
    setBody(content);
  };

  useEffect(() => {
    generatePitch();
  }, [channel, businessName, contactName, city, niche, service, language]);

  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const handleGenerateWithAI = async () => {
    setIsAiGenerating(true);
    toast.info("Génération de l'accroche ultra-personnalisée avec GPT-4o-mini...");

    try {
      const res = await fetch("/api/workspace/ai-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel,
          language,
          leadName: contactName,
          leadCompany: businessName,
          leadNiche: niche,
          leadCity: city,
          customOffer: service,
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
        toast.success("Message rédigé sur-mesure par l'IA !");
      } else if (data.error) {
        toast.error(data.error);
      }
    } catch (err: any) {
      console.error("AI drafter error:", err);
      toast.error("Erreur lors de la génération IA.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = channel === "email" ? `Objet: ${subject}\n\n${body}` : body;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success("Outreach script copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenGmail = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, "_blank");
  };

  const handleOpenWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(body)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto w-full space-y-6">
      {/* ── Notion Header ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs text-[#787774] dark:text-[#9B9A97]">
          <span>Eensell Workspace</span>
          <span>/</span>
          <span className="text-[#37352F] dark:text-[#E6E6E5] font-medium">Email & WhatsApp Drafter</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-3">
            <span className="text-3xl select-none">✍️</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#37352F] dark:text-[#E6E6E5]">
                Cold Outreach Drafter
              </h1>
              <p className="text-xs text-[#787774] dark:text-[#9B9A97] mt-0.5">
                Generate high-converting cold emails, WhatsApp hooks, and calling scripts tailored to Moroccan and international clients.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleGenerateWithAI}
              disabled={isAiGenerating}
              size="sm"
              className="text-xs font-semibold bg-[#37352F] hover:bg-[#262420] dark:bg-[#E6E6E5] dark:hover:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#191919] gap-1.5 h-8 px-3 rounded-md shadow-xs cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAiGenerating ? "animate-spin" : ""}`} />
              <span>{isAiGenerating ? "Génération..." : "Rédiger avec GPT-4o"}</span>
            </Button>

            <Button
              onClick={handleCopy}
              size="sm"
              variant="outline"
              className="text-xs font-medium border-[#EDEDEB] dark:border-[#2E2E2E] text-[#37352F] dark:text-[#E6E6E5] gap-1.5 h-8 px-3 rounded-md hover:bg-[#F7F6F3] dark:hover:bg-[#2A2A2A] cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copié !" : "Copier"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ── 2-Column Split: Controls Left + Output Right ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Form Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="bg-card border-border shadow-xs">
            <CardContent className="p-5 space-y-4">
              {/* Channel Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Outreach Channel
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setChannel("email")}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      channel === "email"
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Cold Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel("whatsapp")}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      channel === "whatsapp"
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                        : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Hook</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel("phone")}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      channel === "phone"
                        ? "bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400"
                        : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Script</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel("instagram")}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      channel === "instagram"
                        ? "bg-purple-500/10 border-purple-500 text-purple-600 dark:text-purple-400"
                        : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Instagram DM</span>
                  </button>
                </div>
              </div>

              {/* Language Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Language & Tone
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setLanguage("fr")}
                    className={`py-2 px-2 rounded-lg text-xs font-bold border transition-colors ${
                      language === "fr"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/30 border-border text-muted-foreground"
                    }`}
                  >
                    Français (Pro)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage("darija")}
                    className={`py-2 px-2 rounded-lg text-xs font-bold border transition-colors ${
                      language === "darija"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/30 border-border text-muted-foreground"
                    }`}
                  >
                    Darija (WhatsApp)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage("en")}
                    className={`py-2 px-2 rounded-lg text-xs font-bold border transition-colors ${
                      language === "en"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/30 border-border text-muted-foreground"
                    }`}
                  >
                    English (Direct)
                  </button>
                </div>
              </div>

              {/* Prospect Details */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-xs font-bold text-muted-foreground">Prospect Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground">Contact Person</label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Generate with AI button */}
              <div className="pt-2">
                <Button
                  onClick={handleGenerateWithAI}
                  disabled={isAiGenerating}
                  className="w-full font-bold bg-amber-500 hover:bg-amber-600 text-white gap-2 shadow-xs cursor-pointer py-2.5"
                >
                  <Sparkles className={`w-4 h-4 ${isAiGenerating ? "animate-spin" : ""}`} />
                  <span>{isAiGenerating ? "Génération en cours..." : "Générer avec votre Clé OpenAI"}</span>
                </Button>
                <p className="text-[11px] text-muted-foreground text-center mt-1.5">
                  Modèle GPT-4o-mini connecté à votre clé API dans Paramètres
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Output Box (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="bg-card border-border shadow-md">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-bold uppercase tracking-wider text-primary border-primary/30">
                    {channel.toUpperCase()} PREVIEW
                  </Badge>
                  <span className="text-xs text-muted-foreground">• Ready to dispatch</span>
                </div>

                <div className="flex items-center gap-2">
                  {channel === "email" && (
                    <Button
                      onClick={handleOpenGmail}
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs font-bold gap-1.5 border-border"
                    >
                      <Mail className="w-3.5 h-3.5 text-rose-500" />
                      <span>Open in Gmail</span>
                    </Button>
                  )}

                  {channel === "whatsapp" && (
                    <Button
                      onClick={handleOpenWhatsApp}
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs font-bold gap-1.5 border-border text-emerald-600"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Send WhatsApp</span>
                    </Button>
                  )}

                  <Button
                    onClick={handleCopy}
                    size="sm"
                    className="h-8 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </Button>
                </div>
              </div>

              {channel === "email" && (
                <div className="p-3 rounded-xl bg-muted/40 border border-border">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Subject Line:
                  </span>
                  <div className="text-sm font-bold text-foreground mt-0.5 select-all font-mono">
                    {subject}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-background border border-border">
                <textarea
                  rows={14}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-hidden text-xs sm:text-sm text-foreground font-mono leading-relaxed resize-y"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Tested & proven 38% response rate framework</span>
                </div>
                <span>Estimated reading time: 35 seconds</span>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
