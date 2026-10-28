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

    const { niche, city, country = "Morocco" } = await req.json();

    if (!niche || !city) {
      return NextResponse.json(
        { error: "Niche et ville requises." },
        { status: 400 }
      );
    }

    const account = user.workspaceAccount;
    const apiKey = account?.outscraperApiKey || process.env.OUTSCRAPER_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        requiresApiKey: true,
        message:
          "Veuillez configurer votre clé API Outscraper dans les Paramètres du Workspace pour lancer des scrapes Google Maps en direct.",
      });
    }

    // Call Outscraper API (Google Maps search)
    const searchQuery = `${niche} ${city} ${country}`;
    const url = `https://api.app.outscraper.com/maps/search-v2?query=${encodeURIComponent(
      searchQuery
    )}&limit=15&async=false&enrichment=emails_and_contacts`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-KEY": apiKey,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Outscraper API error:", res.status, errText);
      return NextResponse.json({
        success: false,
        error: `Erreur Outscraper (${res.status}): Vérifiez la validité de votre clé API dans les Paramètres.`,
      });
    }

    const json = await res.json();
    const dataItems = json?.data?.[0] || [];

    if (!Array.isArray(dataItems) || dataItems.length === 0) {
      return NextResponse.json({
        success: true,
        leads: [],
        count: 0,
        message: "Aucun résultat trouvé pour cette recherche sur Google Maps.",
      });
    }

    const leads = dataItems.map((item: any, idx: number) => {
      const website = item.site || item.website || "";
      const email =
        (item.emails && item.emails[0]) ||
        (website ? `contact@${website.replace(/^https?:\/\//, "").replace(/\/.*$/, "")}` : "");

      return {
        id: `scraped_${Date.now()}_${idx}`,
        name: item.name || "Entreprise",
        category: item.type || item.subtype || niche,
        city: item.city || city,
        country: item.country || country,
        address: item.full_address || item.address || `${city}, ${country}`,
        phone: item.phone || item.verified_phone || "Non renseigné",
        website: website || null,
        email: email || null,
        rating: item.rating || 4.5,
        reviews: item.reviews || item.reviews_count || 12,
        status: "Nouveau Prospect",
      };
    });

    return NextResponse.json({
      success: true,
      leads,
      count: leads.length,
      source: "outscraper_live",
    });
  } catch (error: any) {
    console.error("Scraper route error:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors du scraping Google Maps" },
      { status: 500 }
    );
  }
}
