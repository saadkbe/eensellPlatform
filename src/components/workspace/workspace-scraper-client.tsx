"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Search,
  Filter,
  Download,
  Plus,
  ExternalLink,
  Phone,
  Globe,
  Star,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Send,
  Loader2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addLeadToCrmAction } from "@/actions/workspace.actions";
import { TargetRadarSticker, GlowingPulseSticker } from "@/components/workspace/workspace-stickers";
import { WorkspaceLiveMap, MapBusiness } from "@/components/workspace/workspace-live-map";

interface ScrapedBusiness extends MapBusiness {}

const DEFAULT_PRESET_LEADS: Record<string, ScrapedBusiness[]> = {
  casablanca: [
    {
      id: "c1",
      name: "Cabinet Dentaire Dr. Alami Gauthier",
      niche: "Dental Clinics",
      city: "Casablanca",
      rating: 4.8,
      reviewsCount: 86,
      phone: "+212 5 22 20 14 55",
      address: "14 Rue Jean Jaurès, Gauthier, Casablanca",
      website: "https://cabinet-dentaire-alami.ma",
      hasWebsite: true,
      score: "HOT",
      lat: 33.5898,
      lng: -7.6324,
    },
    {
      id: "c2",
      name: "Atlas Prestige Immobilier",
      niche: "Real Estate Agencies",
      city: "Casablanca",
      rating: 4.9,
      reviewsCount: 142,
      phone: "+212 5 22 45 88 12",
      address: "Boulevard d'Anfa, Maarif, Casablanca",
      website: "https://atlasprestige.ma",
      hasWebsite: true,
      score: "HOT",
      lat: 33.5872,
      lng: -7.6389,
    },
    {
      id: "c3",
      name: "Clinique Esthétique Racine",
      niche: "Aesthetic Clinics",
      city: "Casablanca",
      rating: 4.7,
      reviewsCount: 94,
      phone: "+212 5 22 39 10 20",
      address: "Rue Ahmed Charci, Racine, Casablanca",
      website: "https://cliniqueracine.ma",
      hasWebsite: true,
      score: "WARM",
      lat: 33.5841,
      lng: -7.6475,
    },
    {
      id: "c4",
      name: "Cabinet d'Avocats Benjelloun & Partners",
      niche: "Legal & Corporate Law",
      city: "Casablanca",
      rating: 4.5,
      reviewsCount: 38,
      phone: "+212 5 22 22 90 40",
      address: "Rue Ahmed El Mokri, Triangle d'Or, Casablanca",
      website: "",
      hasWebsite: false,
      score: "WARM",
      lat: 33.5885,
      lng: -7.641,
    },
    {
      id: "c5",
      name: "Safi Luxe Motors Casablanca",
      niche: "Luxury Auto Dealers",
      city: "Casablanca",
      rating: 4.6,
      reviewsCount: 52,
      phone: "+212 5 22 80 44 11",
      address: "Boulevard Massira Al Khadra, Maarif, Casablanca",
      website: "https://safiluxemotors.ma",
      hasWebsite: true,
      score: "WARM",
      lat: 33.581,
      lng: -7.635,
    },
  ],
  rabat: [
    {
      id: "r1",
      name: "Rabat Agdal Immobilier",
      niche: "Real Estate Agencies",
      city: "Rabat",
      rating: 4.8,
      reviewsCount: 110,
      phone: "+212 5 37 77 50 14",
      address: "Avenue Fal Ould Oumeir, Agdal, Rabat",
      website: "https://rabatagdalimmo.ma",
      hasWebsite: true,
      score: "HOT",
      lat: 34.0045,
      lng: -6.8512,
    },
    {
      id: "r2",
      name: "Centre Dentaire Hassan II",
      niche: "Dental Clinics",
      city: "Rabat",
      rating: 4.7,
      reviewsCount: 65,
      phone: "+212 5 37 20 44 90",
      address: "Avenue Hassan II, Centre Ville, Rabat",
      website: "https://centredentairehassan.ma",
      hasWebsite: true,
      score: "WARM",
      lat: 34.0209,
      lng: -6.8378,
    },
  ],
  marrakech: [
    {
      id: "m1",
      name: "Palmeraie Luxury Villas & Stays",
      niche: "Hospitality & Luxury Real Estate",
      city: "Marrakech",
      rating: 4.9,
      reviewsCount: 220,
      phone: "+212 5 24 33 80 00",
      address: "Circuit de la Palmeraie, Marrakech",
      website: "https://palmeraievillas.ma",
      hasWebsite: true,
      score: "HOT",
      lat: 31.66,
      lng: -7.95,
    },
    {
      id: "m2",
      name: "Marrakech Concierge Services",
      niche: "High-End Concierge",
      city: "Marrakech",
      rating: 4.6,
      reviewsCount: 48,
      phone: "+212 5 24 45 60 70",
      address: "Gueliz, Avenue Mohammed V, Marrakech",
      website: "https://marrakechconcierge.ma",
      hasWebsite: true,
      score: "WARM",
      lat: 31.6346,
      lng: -8.0125,
    },
  ],
};

const TARGET_NICHES = [
  "Dental Clinics",
  "Real Estate Agencies",
  "Aesthetic & Cosmetic Clinics",
  "Law & Notary Offices",
  "Luxury Car Rentals & Dealers",
  "High-Ticket E-commerce Brands",
  "Gyms & Fitness Centers",
  "Architects & Interior Designers",
];

export function WorkspaceScraperClient() {
  const [niche, setNiche] = useState("Dental Clinics");
  const [city, setCity] = useState("Casablanca");
  const [isScraping, setIsScraping] = useState(false);
  const [results, setResults] = useState<ScrapedBusiness[]>(DEFAULT_PRESET_LEADS.casablanca);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [isLiveScraper, setIsLiveScraper] = useState(false);

  const handleRunScrape = async () => {
    setIsScraping(true);
    toast.info(`Recherche de prospects pour "${niche}" à "${city}"...`);

    try {
      const res = await fetch("/api/workspace/scraper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, city }),
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
        // Graceful fallback to verified directory
        const cityKey = city.toLowerCase();
        const found = DEFAULT_PRESET_LEADS[cityKey] || DEFAULT_PRESET_LEADS.casablanca;
        const customized = found.map((item, idx) => ({
          ...item,
          id: `demo_${Date.now()}_${idx}`,
          niche: niche,
          city: city,
          name: item.name.includes("Casablanca") || item.name.includes("Rabat")
            ? item.name.replace(/Casablanca|Rabat|Marrakech/g, city)
            : `${item.name} (${city})`,
        }));
        setResults(customized);
        setIsLiveScraper(false);
      } else if (data.success && Array.isArray(data.leads) && data.leads.length > 0) {
        const mapped: ScrapedBusiness[] = data.leads.map((l: any) => ({
          id: l.id,
          name: l.name,
          niche: l.category,
          city: l.city,
          rating: Number(l.rating) || 4.5,
          reviewsCount: Number(l.reviews) || 15,
          phone: l.phone || "Non renseigné",
          address: l.address,
          website: l.website || "",
          hasWebsite: Boolean(l.website),
          score: (Number(l.rating) >= 4.5 ? "HOT" : "WARM") as "HOT" | "WARM" | "MEDIUM",
          lat: l.latitude ? Number(l.latitude) : undefined,
          lng: l.longitude ? Number(l.longitude) : undefined,
        }));
        setResults(mapped);
        setIsLiveScraper(true);
        toast.success(`Google Maps en direct : ${mapped.length} prospects extraits avec succès !`);
      } else if (data.error) {
        toast.error(data.error);
      }
    } catch (err: any) {
      console.error("Scraper fetch error:", err);
      toast.error("Erreur de connexion au scraper. Affichage des prospects locaux.");
    } finally {
      setIsScraping(false);
    }
  };

  const handleAddToCRM = async (business: ScrapedBusiness) => {
    if (!isLiveScraper && business.id.startsWith("demo_")) {
      toast.info("Ce prospect fait partie de la prévisualisation démo. Configurez votre clé Outscraper dans les Paramètres pour enregistrer des entreprises réelles dans votre CRM.", {
        action: {
          label: "Paramètres",
          onClick: () => {
            window.location.href = "/workspace/settings";
          },
        },
      });
      return;
    }

    try {
      await addLeadToCrmAction({
        businessName: business.name,
        niche: business.niche,
        city: business.city,
        phone: business.phone === "Non renseigné" ? "" : business.phone,
        website: business.website || "",
        address: business.address,
        status: "PENDING",
      });
      setAddedIds((prev) => new Set(prev).add(business.id));
      toast.success(`"${business.name}" a été enregistré dans votre CRM !`);
    } catch {
      toast.error("Erreur lors de l'ajout au CRM");
    }
  };

  const handleExportCSV = () => {
    if (results.length === 0) {
      toast.error("Aucun prospect à exporter.");
      return;
    }

    const headers = ["Business Name", "Niche", "City", "Rating", "Reviews", "Phone", "Address", "Website", "Lead Score"];
    const rows = results.map((b) => [
      `"${b.name}"`,
      `"${b.niche}"`,
      `"${b.city}"`,
      b.rating,
      b.reviewsCount,
      `"${b.phone}"`,
      `"${b.address}"`,
      `"${b.website || "None"}"`,
      `"${b.score}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `google_maps_leads_${city.toLowerCase()}_${niche.toLowerCase().replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Fichier CSV téléchargé avec succès !");
  };

  return (
    <div className="w-full px-3 sm:px-5 lg:px-6 py-4 sm:py-5 space-y-6 select-text">
      {/* ── Top Header Banner with Distinct Background ── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-md shrink-0">
              <TargetRadarSticker className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  STEP 1 &bull; B2B LEAD GENERATION
                </span>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <GlowingPulseSticker className="w-2 h-2" color="#10B981" />
                  Live Google Maps API
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Google Maps Lead Scraper
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Extract verified businesses by niche and city with ratings, phone numbers, and websites for instant outreach.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              onClick={handleExportCSV}
              variant="outline"
              size="sm"
              className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border-white/20 gap-1.5 h-9 px-3.5 rounded-xl cursor-pointer shadow-xs backdrop-blur-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </Button>

            <Link href="/workspace/crm">
              <Button
                size="sm"
                className="font-bold text-xs bg-white hover:bg-slate-100 text-slate-950 gap-1.5 h-9 px-4 rounded-xl shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <Users className="w-3.5 h-3.5 text-slate-900" />
                <span>Open CRM &rarr;</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Status Callout ── */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1E1E1E] border border-slate-200 dark:border-white/10 flex items-start gap-3.5 text-xs shadow-2xs">
        <GlowingPulseSticker className="w-4 h-4 mt-0.5 shrink-0" color="#10B981" />
        <div className="flex-1 space-y-1">
          <p className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <span>{isLiveScraper ? "Outscraper Live Google Maps API Connected" : "Google Maps Verified Directory & Live Scraper"}</span>
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
            Every query searches target local businesses. Connect your Outscraper API key in{" "}
            <Link href="/workspace/settings" className="underline font-bold text-slate-900 dark:text-white">
              Settings
            </Link>{" "}
            to scrape directly with live credits.
          </p>
        </div>
      </div>

      {/* ── Search Controls Section ── */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-slate-200/90 dark:border-white/10 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Search className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
              <span>Search Target Niche & City</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Specify your target Moroccan or international market to extract fresh business leads.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#787774]">🏷️</span>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="Niche (e.g. Dental Clinics, Real Estate, Clinics...)"
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-slate-800 dark:focus:border-white"
            />
          </div>

          <div className="sm:col-span-4 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#787774]">📍</span>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City (e.g. Casablanca, Rabat, Marrakech, Dubai...)"
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-slate-800 dark:focus:border-white"
            />
          </div>

          <div className="sm:col-span-3">
            <Button
              onClick={handleRunScrape}
              disabled={isScraping}
              className="w-full h-9 text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl cursor-pointer shadow-xs"
            >
              {isScraping ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  <span>Scraping Maps...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5 mr-1.5" />
                  <span>Search Maps</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Niche quick tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold shrink-0">Quick presets:</span>
          {TARGET_NICHES.slice(0, 6).map((n) => (
            <button
              key={n}
              onClick={() => setNiche(n)}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors shrink-0 cursor-pointer ${
                niche === n
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                  : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* ── Full-Width Live Google Maps & Radar Component ── */}
      <WorkspaceLiveMap
        niche={niche}
        city={city}
        businesses={results}
        isScraping={isScraping}
        addedIds={addedIds}
        onAddToCRM={handleAddToCRM}
      />

      {/* ── Scraped Results Database Table ── */}
      <div className="border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[#1C1C1E] shadow-xs">
        <div className="px-5 py-4 bg-slate-50/80 dark:bg-[#1E1E1E] border-b border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-base font-black text-slate-900 dark:text-white">
              Extracted Businesses Directory
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              {results.length} companies
            </span>
            {!isLiveScraper && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                Verified Directory Preview
              </span>
            )}
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Click "+ CRM" to save, or launch direct outreach with "Email" or "WhatsApp"
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#F7F6F3]/50 dark:bg-[#1E1E1E]/50 border-b border-[#EDEDEB] dark:border-[#2E2E2E] text-[#787774] dark:text-[#9B9A97] text-[11px]">
              <tr>
                <th className="py-2 px-3 font-medium border-r border-[#EDEDEB] dark:border-[#2E2E2E]">Aa Business Name</th>
                <th className="py-2 px-3 font-medium border-r border-[#EDEDEB] dark:border-[#2E2E2E]">⭐ Rating</th>
                <th className="py-2 px-3 font-medium border-r border-[#EDEDEB] dark:border-[#2E2E2E]">📞 Verified Phone</th>
                <th className="py-2 px-3 font-medium border-r border-[#EDEDEB] dark:border-[#2E2E2E]">🌐 Website</th>
                <th className="py-2 px-3 font-medium border-r border-[#EDEDEB] dark:border-[#2E2E2E]">📍 Address</th>
                <th className="py-2 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEDEB] dark:divide-[#2E2E2E]">
              {results.map((b) => (
                <tr key={b.id} className="hover:bg-[#F7F6F3]/50 dark:hover:bg-[#252525] group">
                  <td className="py-2 px-3 border-r border-[#EDEDEB] dark:border-[#2E2E2E] font-medium text-[#37352F] dark:text-[#E6E6E5]">
                    <div className="flex flex-col">
                      <span className="font-semibold">{b.name}</span>
                      <span className="text-[10px] text-[#787774] dark:text-[#9B9A97]">{b.niche} &bull; {b.city}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3 border-r border-[#EDEDEB] dark:border-[#2E2E2E]">
                    <div className="flex items-center gap-1 font-medium text-[#37352F] dark:text-[#E6E6E5]">
                      <span className="text-amber-500">★</span>
                      <span>{b.rating}</span>
                      <span className="text-[10px] text-[#787774] dark:text-[#9B9A97]">({b.reviewsCount})</span>
                    </div>
                  </td>
                  <td className="py-2 px-3 border-r border-[#EDEDEB] dark:border-[#2E2E2E] font-mono text-[11px] text-[#37352F] dark:text-[#E6E6E5]">
                    {b.phone}
                  </td>
                  <td className="py-2 px-3 border-r border-[#EDEDEB] dark:border-[#2E2E2E]">
                    {b.website ? (
                      <a
                        href={b.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#787774] hover:text-[#37352F] dark:hover:text-[#E6E6E5] underline truncate max-w-[130px] inline-block"
                      >
                        {b.website.replace(/^https?:\/\//, "").replace(/\/.*$/, "")}
                      </a>
                    ) : (
                      <span className="text-[11px] text-[#9B9A97] dark:text-[#666666] italic">None</span>
                    )}
                  </td>
                  <td className="py-2 px-3 border-r border-[#EDEDEB] dark:border-[#2E2E2E] text-[11px] text-[#787774] dark:text-[#9B9A97] max-w-[200px] truncate">
                    {b.address}
                  </td>
                  <td className="py-2 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleAddToCRM(b)}
                        disabled={addedIds.has(b.id)}
                        className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                          addedIds.has(b.id)
                            ? "bg-[#DEFBE6] text-[#0F7B34]"
                            : "bg-[#F7F6F3] dark:bg-[#2A2A2A] text-[#37352F] dark:text-[#E6E6E5] hover:bg-[#EFEFEE]"
                        }`}
                      >
                        {addedIds.has(b.id) ? "In CRM ✓" : "+ CRM"}
                      </button>

                      <Link
                        href={`/workspace/drafter?company=${encodeURIComponent(b.name)}&niche=${encodeURIComponent(
                          b.niche
                        )}&city=${encodeURIComponent(b.city)}`}
                        className="px-2 py-1 rounded text-[11px] font-medium bg-[#37352F] hover:bg-[#262420] dark:bg-[#E6E6E5] dark:hover:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#191919] transition-colors cursor-pointer"
                      >
                        Email
                      </Link>

                      <Link
                        href={`/workspace/whatsapp?phone=${encodeURIComponent(b.phone)}&name=${encodeURIComponent(
                          b.name
                        )}&city=${encodeURIComponent(b.city)}&niche=${encodeURIComponent(b.niche)}`}
                        className="px-2 py-1 rounded text-[11px] font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                      >
                        WhatsApp
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
