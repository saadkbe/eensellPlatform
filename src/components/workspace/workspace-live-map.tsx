"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Maximize2,
  Minimize2,
  Navigation,
  Globe,
  Phone,
  Star,
  ExternalLink,
  Plus,
  Send,
  Compass,
  Check,
  Layers,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlowingPulseSticker } from "@/components/workspace/workspace-stickers";

export interface MapBusiness {
  id: string;
  name: string;
  niche: string;
  city: string;
  rating: number;
  reviewsCount: number;
  phone: string;
  address: string;
  website: string;
  hasWebsite: boolean;
  score: "HOT" | "WARM" | "MEDIUM";
  lat?: number;
  lng?: number;
}

interface WorkspaceLiveMapProps {
  niche: string;
  city: string;
  businesses: MapBusiness[];
  isScraping: boolean;
  addedIds: Set<string>;
  onAddToCRM: (business: MapBusiness) => void;
}

const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  casablanca: { lat: 33.5731, lng: -7.5898 },
  rabat: { lat: 34.0209, lng: -6.8416 },
  marrakech: { lat: 31.6295, lng: -7.9811 },
  tanger: { lat: 35.7595, lng: -5.834 },
  tangier: { lat: 35.7595, lng: -5.834 },
  agadir: { lat: 30.4278, lng: -9.5981 },
  fes: { lat: 34.0331, lng: -5.0003 },
  dubai: { lat: 25.2048, lng: 55.2708 },
  paris: { lat: 48.8566, lng: 2.3522 },
};

export function WorkspaceLiveMap({
  niche,
  city,
  businesses,
  isScraping,
  addedIds,
  onAddToCRM,
}: WorkspaceLiveMapProps) {
  const [mapLayer, setMapLayer] = useState<"streets" | "satellite" | "voyager">("streets");
  const [selectedLead, setSelectedLead] = useState<MapBusiness | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "HOT" | "WARM">("ALL");
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // City center lookup
  const cityKey = city.toLowerCase().trim();
  const centerCoords = CITY_COORDINATES[cityKey] || CITY_COORDINATES.casablanca;

  // Filter businesses
  const filteredBusinesses = useMemo(() => {
    if (activeFilter === "ALL") return businesses;
    return businesses.filter((b) => b.score === activeFilter);
  }, [businesses, activeFilter]);

  // Keep first lead or selected active
  useEffect(() => {
    if (businesses.length > 0 && !selectedLead) {
      setSelectedLead(businesses[0]);
    }
  }, [businesses, selectedLead]);

  // Load Leaflet dynamically via CDN for 100% Next.js SSR compatibility
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if Leaflet CSS is loaded
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Check if Leaflet JS is loaded
    if ((window as any).L) {
      setIsLeafletReady(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "leaflet-js";
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => {
      setIsLeafletReady(true);
    };
    document.body.appendChild(script);
  }, []);

  // Initialize and update the Leaflet Real Map
  useEffect(() => {
    if (!isLeafletReady || !mapContainerRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    // Destroy existing instance before re-creating
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [centerCoords.lat, centerCoords.lng],
      zoom: 13,
      zoomControl: false,
    });

    mapInstanceRef.current = map;

    // Add Zoom Control to bottom-right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Map Tile URL based on chosen layer
    let tileUrl = "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";
    let attribution = "© Google Maps";

    if (mapLayer === "satellite") {
      tileUrl = "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}";
      attribution = "© Google Hybrid Satellite";
    } else if (mapLayer === "voyager") {
      tileUrl = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
      attribution = "© CartoDB Voyager";
    }

    L.tileLayer(tileUrl, {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
      attribution,
    }).addTo(map);

    // Render custom pins on the real map
    markersRef.current = [];

    filteredBusinesses.forEach((b, idx) => {
      // Coordinates calculation (fallback to deterministic offset around city center if missing)
      const lat =
        b.lat || centerCoords.lat + Math.sin(idx * 1.35 + 0.2) * 0.022;
      const lng =
        b.lng || centerCoords.lng + Math.cos(idx * 1.35 + 0.2) * 0.026;

      const isHot = b.score === "HOT";
      const isSelected = selectedLead?.id === b.id;
      const inCrm = addedIds.has(b.id);

      const markerHtml = `
        <div class="custom-pin-wrapper cursor-pointer group" style="transform: translate(-50%, -50%);">
          <div style="
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 800;
            white-space: nowrap;
            color: #ffffff;
            background: ${isSelected ? "#0f172a" : isHot ? "#e11d48" : "#0284c7"};
            border: 2px solid ${isSelected ? "#10b981" : "#ffffff"};
            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.4), 0 8px 10px -6px rgba(0,0,0,0.3);
            transition: all 0.2s ease;
          ">
            <span style="
              width: 7px;
              height: 7px;
              border-radius: 9999px;
              background-color: ${inCrm ? "#4ade80" : isHot ? "#fde047" : "#38bdf8"};
              display: inline-block;
            "></span>
            <span style="max-width: 120px; overflow: hidden; text-overflow: ellipsis;">
              ${b.name.replace(/Cabinet|Clinique|Agence|Immobilier/g, "").trim() || b.name}
            </span>
            <span style="color: #fde047; font-family: monospace;">★${b.rating}</span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: "leaflet-custom-lead-icon",
        html: markerHtml,
        iconSize: [140, 36],
        iconAnchor: [70, 18],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      marker.on("click", () => {
        setSelectedLead(b);
        map.flyTo([lat, lng], 15, { duration: 0.6 });
      });

      markersRef.current.push(marker);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [
    isLeafletReady,
    mapLayer,
    filteredBusinesses,
    centerCoords.lat,
    centerCoords.lng,
    selectedLead?.id,
    addedIds,
  ]);

  // Center map when a lead is selected from the bottom carousel
  const handleSelectLeadFromDock = (b: MapBusiness, idx: number) => {
    setSelectedLead(b);
    if (mapInstanceRef.current) {
      const lat = b.lat || centerCoords.lat + Math.sin(idx * 1.35 + 0.2) * 0.022;
      const lng = b.lng || centerCoords.lng + Math.cos(idx * 1.35 + 0.2) * 0.026;
      mapInstanceRef.current.flyTo([lat, lng], 15, { duration: 0.6 });
    }
  };

  return (
    <div
      className={`w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#161616] overflow-hidden shadow-md transition-all duration-300 flex flex-col ${
        isExpanded ? "h-[640px]" : "h-[460px] sm:h-[500px]"
      }`}
    >
      {/* ── Top Map Controls & HUD Bar ── */}
      <div className="px-3.5 py-2.5 bg-slate-50/90 dark:bg-[#1E1E1E]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 select-none z-20">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-[11px] shadow-2xs">
            <Compass className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
            <span>Google Maps Intelligence</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
            <GlowingPulseSticker className="w-2 h-2" color="#10B981" />
            <span>
              {businesses.length} verified companies pinned in {city}
            </span>
          </div>

          <span className="hidden sm:inline-block text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            • {niche}
          </span>
        </div>

        {/* Action Controls & Layer Switcher */}
        <div className="flex items-center gap-1.5">
          {/* Layer Switcher */}
          <div className="flex items-center bg-slate-200/80 dark:bg-[#2A2A2A] p-0.5 rounded-lg border border-slate-300/60 dark:border-white/10">
            <button
              onClick={() => setMapLayer("streets")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                mapLayer === "streets"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Google Streets
            </button>
            <button
              onClick={() => setMapLayer("satellite")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                mapLayer === "satellite"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapLayer("voyager")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                mapLayer === "voyager"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Voyager
            </button>
          </div>

          {/* Hot Filter Pill */}
          <button
            onClick={() => setActiveFilter(activeFilter === "HOT" ? "ALL" : "HOT")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-all cursor-pointer ${
              activeFilter === "HOT"
                ? "bg-rose-500 text-white border-rose-500 shadow-2xs"
                : "bg-slate-100 dark:bg-[#2A2A2A] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
            }`}
          >
            🔥 Hot Only
          </button>

          {/* Expand Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#252525] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#303030] transition-colors cursor-pointer"
            title={isExpanded ? "Collapse map" : "Expand full screen"}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ── Real Map Viewport ── */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-slate-100 dark:bg-slate-950">
        {/* Real Leaflet Map Container */}
        <div
          ref={mapContainerRef}
          className="w-full h-full z-10"
          style={{ minHeight: "100%", width: "100%" }}
        />

        {/* Fallback if Leaflet is loading */}
        {!isLeafletReady && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900 text-white gap-3">
            <Compass className="w-8 h-8 animate-spin text-emerald-400" />
            <p className="text-xs font-semibold text-slate-300">
              Loading Google Maps tiles for {city}...
            </p>
          </div>
        )}

        {/* Scraping Banner Overlay */}
        {isScraping && (
          <div className="absolute inset-0 z-30 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center gap-3 text-center px-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
              <MapPin className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">
                Scraping Google Maps nodes in {city}...
              </h4>
              <p className="text-xs text-slate-300 mt-1 max-w-sm">
                Extracting verified local businesses, ratings, and phone numbers.
              </p>
            </div>
          </div>
        )}

        {/* ── Floating InfoWindow Card (Selected Business on the Map) ── */}
        <AnimatePresence>
          {selectedLead && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="absolute top-3 right-3 z-30 w-72 sm:w-80 rounded-2xl bg-slate-950/95 text-white border border-white/20 p-4 shadow-2xl backdrop-blur-xl space-y-3"
            >
              {/* Header Row */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded font-mono ${
                        selectedLead.score === "HOT"
                          ? "bg-rose-500/25 text-rose-300 border border-rose-500/40"
                          : "bg-emerald-500/25 text-emerald-300 border border-emerald-500/40"
                      }`}
                    >
                      {selectedLead.score} LEAD
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {selectedLead.niche}
                    </span>
                  </div>
                  <h4 className="font-black text-sm text-white mt-1.5 line-clamp-1">
                    {selectedLead.name}
                  </h4>
                </div>

                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-slate-400 hover:text-white text-xs p-1 rounded-md hover:bg-white/10 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Rating & Location */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10 text-slate-300">
                <div className="flex items-center gap-1 font-bold text-amber-400">
                  <span>★ {selectedLead.rating}</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    ({selectedLead.reviewsCount} avis)
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-300 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate max-w-[120px]">{selectedLead.city}</span>
                </div>
              </div>

              {/* Phone & Address Details */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-slate-200 font-mono text-[11px]">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{selectedLead.phone}</span>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {selectedLead.address}
                </p>
              </div>

              {/* Actions Deck */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
                <button
                  onClick={() => onAddToCRM(selectedLead)}
                  disabled={addedIds.has(selectedLead.id)}
                  className={`h-8 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    addedIds.has(selectedLead.id)
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-white text-slate-950 hover:bg-slate-100 shadow-md"
                  }`}
                >
                  {addedIds.has(selectedLead.id) ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>In CRM ✓</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Save to CRM</span>
                    </>
                  )}
                </button>

                <Link
                  href={`/workspace/whatsapp?phone=${encodeURIComponent(
                    selectedLead.phone
                  )}&name=${encodeURIComponent(
                    selectedLead.name
                  )}&city=${encodeURIComponent(
                    selectedLead.city
                  )}&niche=${encodeURIComponent(selectedLead.niche)}`}
                  className="h-8 px-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Send className="w-3 h-3" />
                  <span>WhatsApp</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bottom Carousel Bar of Pinned Businesses on the Map ── */}
        <div className="absolute bottom-3 left-3 right-16 z-20 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {filteredBusinesses.map((b, idx) => {
            const isSelected = selectedLead?.id === b.id;
            return (
              <button
                key={b.id}
                onClick={() => handleSelectLeadFromDock(b, idx)}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-left transition-all border backdrop-blur-md cursor-pointer flex items-center gap-2.5 shadow-lg ${
                  isSelected
                    ? "bg-slate-950 text-white border-emerald-400 ring-2 ring-emerald-400/40 scale-[1.03]"
                    : "bg-slate-900/90 hover:bg-slate-900 text-white border-white/20"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    b.score === "HOT" ? "bg-rose-500 animate-pulse" : "bg-emerald-400"
                  }`}
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold truncate max-w-[140px] leading-tight">
                    {b.name}
                  </span>
                  <span className="text-[10px] text-slate-300 leading-tight mt-0.5">
                    {b.niche} &bull; <strong className="text-amber-400">★{b.rating}</strong>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
