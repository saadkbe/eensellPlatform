import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: { workspaceAccount: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const {
      channel, // "email" | "whatsapp" | "instagram" | "call"
      language, // "darija" | "fr" | "en"
      leadName,
      leadCompany,
      leadNiche,
      leadCity,
      customOffer,
    } = await req.json();

    const account = user.workspaceAccount;
    const apiKey = account?.openaiApiKey || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        requiresApiKey: true,
        message:
          "Veuillez configurer votre clé OpenAI API dans les Paramètres du Workspace pour activer la rédaction de messages par IA.",
      });
    }

    const senderName = account?.senderName || `${user.firstName || "Fondateur"} | Eensell`;
    const agencyName = account?.agencyName || "Eensell Automations";

    // Build the prompt for OpenAI
    const channelInstructions: Record<string, string> = {
      email: `Rédige un Cold Email B2B ultra-court (maximum 110 mots). Format JSON avec deux clés : "subject" et "body". Pas de blabla pompeux, accroche personnalisée sur leur secteur, proposition de valeur concrète (ex: prise de RDV automatique, qualification de prospects WhatsApp), et un CTA direct et sans risque (10 min d'appel ou audit gratuit). Signe par "${senderName}" (${agencyName}).`,
      whatsapp: `Rédige un message WhatsApp professionnel, chaleureux et percutant. Moins de 70 mots. Format JSON avec les clés "subject": "WhatsApp Message" et "body". Utilise des sauts de ligne aérés et 2 ou 3 emojis sobres. Signe par "${senderName}".`,
      instagram: `Rédige un Direct Message Instagram (DM) conversationnel et intriguant. Moins de 50 mots. Pas de ton robotique ou corporate. Format JSON avec "subject": "Instagram DM" et "body". Signe par "${senderName}".`,
      call: `Rédige un Cold Call Framework (Script d'appel téléphonique) avec l'intro de 10 secondes pour briser la glace, la question de qualification, et la proposition de rendez-vous. Moins de 100 mots. Format JSON avec "subject": "Cold Call Script" et "body".`,
    };

    const langInstruction =
      language === "darija"
        ? "Rédige le contenu en Darija marocaine authentique (en lettres latines / Franco-Arabe tel que parlé dans le business marocain ex: Salam khoya/khti, chft la présence dialkom f Marrakech...). Reste respectueux et pro."
        : language === "en"
        ? "Write the content in crisp, native American English, highly persuasive and concise."
        : "Rédige en français courant, direct, percutant et professionnel.";

    const systemPrompt = `Tu es le meilleur copywriter B2B spécialisé en prospection d'agence digitale et d'automatisations IA fondées sur l'écosystème Eensell University.
Tes messages obtiennent des taux de réponse records car ils sont ultra-ciblés, sans flatteries inutiles, et parlent directement du gain de chiffre d'affaires et de temps du prospect.

Consignes impératives :
1. ${channelInstructions[channel] || channelInstructions.email}
2. Langue : ${langInstruction}
3. Réponds STRICTEMENT sous forme d'un objet JSON valide : {"subject": "...", "body": "..."}. Aucun texte en dehors du JSON.`;

    const userPrompt = `Prospect :
- Nom du contact : ${leadName || "le dirigeant"}
- Nom de l'entreprise : ${leadCompany || "l'établissement"}
- Secteur d'activité (Niche) : ${leadNiche || "Entreprise"}
- Ville : ${leadCity || "Maroc"}
- Offre d'agence : ${customOffer || "Automatisation de la prise de RDV et assistant IA WhatsApp pour capturer 100% des leads"}`;

    const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!openAiRes.ok) {
      const err = await openAiRes.text();
      console.error("OpenAI API error:", openAiRes.status, err);
      return NextResponse.json({
        success: false,
        error: `Erreur OpenAI (${openAiRes.status}): Vérifiez que votre clé API est valide et possède des crédits actifs.`,
      });
    }

    const aiData = await openAiRes.json();
    const rawContent = aiData.choices?.[0]?.message?.content;
    let parsed = { subject: "Prospection ciblée", body: "" };

    try {
      parsed = JSON.parse(rawContent);
    } catch {
      parsed.body = rawContent;
    }

    return NextResponse.json({
      success: true,
      subject: parsed.subject || "Message de prospection",
      body: parsed.body,
    });
  } catch (error: any) {
    console.error("AI Draft error:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la génération de l'email" },
      { status: 500 }
    );
  }
}
