"use client";

import { useState, useEffect, useMemo } from "react";
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
  Sparkles,
  Layers,
  Compass,
  Check,
  Search,
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
  const [viewMode, setViewMode] = useState<"radar" | "embed">("radar");
  const [selectedLead, setSelectedLead] = useState<MapBusiness | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "HOT" | "WARM">("ALL");

  // Keep first lead or selected active
  useEffect(() => {
    if (businesses.length > 0 && !selectedLead) {
      setSelectedLead(businesses[0]);
    }
  }, [businesses, selectedLead]);

  const filteredBusinesses = useMemo(() => {
    if (activeFilter === "ALL") return businesses;
    return businesses.filter((b) => b.score === activeFilter);
  }, [businesses, activeFilter]);

  // City center lookup
  const cityKey = city.toLowerCase().trim();
  const centerCoords = CITY_COORDINATES[cityKey] || CITY_COORDINATES.casablanca;

  // Build Google Maps Live Embed query
  const googleMapsEmbedUrl = useMemo(() => {
    const query = `${niche} in ${city}, Morocco`;
    return `https://maps.google.com/maps?q=${encodeURIComponent(
      query
    )}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  }, [niche, city]);

  // Compute 2D percentage positions for radar canvas
  const positionedPins = useMemo(() => {
    if (filteredBusinesses.length === 0) return [];

    return filteredBusinesses.map((b, idx) => {
      // If realistic coordinates exist, spread them relative to city center
      let offsetX = 0;
      let offsetY = 0;

      if (b.lat && b.lng) {
        offsetX = ((b.lng - centerCoords.lng) / 0.08) * 35;
        offsetY = ((centerCoords.lat - b.lat) / 0.08) * 35;
      } else {
        // Deterministic radial spread
        const angle = (idx * (360 / filteredBusinesses.length) * Math.PI) / 180;
        const radius = 22 + (idx % 3) * 12;
        offsetX = Math.cos(angle) * radius;
        offsetY = Math.sin(angle) * radius;
      }

      // Clamp within canvas 12% - 88%
      const x = Math.min(88, Math.max(12, 50 + offsetX));
      const y = Math.min(85, Math.max(15, 50 + offsetY));

      return {
        business: b,
        x,
        y,
      };
    });
  }, [filteredBusinesses, centerCoords]);

  return (
    <div
      className={`w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#161616] overflow-hidden shadow-xs transition-all duration-300 flex flex-col ${
        isExpanded ? "h-[620px]" : "h-[440px] sm:h-[480px]"
      }`}
    >
      {/* ── Top Map Controls & HUD Bar ── */}
      <div className="px-3.5 py-2.5 bg-slate-50/80 dark:bg-[#1E1E1E]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 select-none z-20">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-semibold text-[11px] shadow-2xs">
            <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "12s" }} />
            <span>Maps Intelligence</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-medium text-[11px]">
            <GlowingPulseSticker className="w-2 h-2" color="#10B981" />
            <span>
              {businesses.length} nodes in {city}
            </span>
          </div>

          <span className="hidden sm:inline-block text-[11px] text-slate-400 dark:text-slate-500">
            • {niche}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-200/70 dark:bg-[#2A2A2A] p-0.5 rounded-lg border border-slate-300/60 dark:border-white/10">
            <button
              onClick={() => setViewMode("radar")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                viewMode === "radar"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Interactive Radar
            </button>
            <button
              onClick={() => setViewMode("embed")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                viewMode === "embed"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Google Maps Live
            </button>
          </div>

          {/* Hot Filter Pill */}
          {viewMode === "radar" && (
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => setActiveFilter(activeFilter === "HOT" ? "ALL" : "HOT")}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold border transition-all cursor-pointer ${
                  activeFilter === "HOT"
                    ? "bg-rose-500 text-white border-rose-500 shadow-2xs"
                    : "bg-slate-100 dark:bg-[#2A2A2A] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"
                }`}
              >
                🔥 Hot Only
              </button>
            </div>
          )}

          {/* Expand Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#252525] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#303030] transition-colors cursor-pointer"
            title={isExpanded ? "Collapse map" : "Expand full screen"}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ── Main Map Canvas Viewport ── */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-slate-950">
        {viewMode === "embed" ? (
          /* Real Google Maps Embed */
          <div className="w-full h-full relative">
            <iframe
              title="Google Maps Live Search"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={googleMapsEmbedUrl}
              className="w-full h-full filter saturate-[1.1] contrast-[1.05]"
            />
            {/* Overlay hint */}
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-slate-900/90 text-white backdrop-blur-md text-[11px] font-medium border border-white/10 shadow-lg flex items-center gap-2 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Real Google Maps feed for "{niche} in {city}"</span>
            </div>
          </div>
        ) : (
          /* Interactive Radar Canvas */
          <div className="relative w-full h-full overflow-hidden select-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
            {/* Grid Lines Pattern */}
            <div
              className="absolute inset-0 opacity-[0.15] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(#10B981 1px, transparent 1px), linear-gradient(90deg, #10B981 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Concentric Geospatial Radar Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[180px] h-[180px] rounded-full border border-emerald-500/10" />
              <div className="w-[340px] h-[340px] rounded-full border border-emerald-500/15" />
              <div className="w-[520px] h-[520px] rounded-full border border-emerald-500/10" />
              <div className="w-[720px] h-[720px] rounded-full border border-emerald-500/5 border-dashed" />
              <div className="w-[960px] h-[960px] rounded-full border border-slate-700/10" />

              {/* Crosshairs */}
              <div className="absolute w-full h-px bg-emerald-500/10" />
              <div className="absolute h-full w-px bg-emerald-500/10" />
            </div>

            {/* Live Sweeping Radar Beam */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                animation: "spin 9s linear infinite",
              }}
            >
              <div
                className="w-1/2 h-1/2 origin-bottom-right"
                style={{
                  background:
                    "conic-gradient(from 0deg at 100% 100%, rgba(16, 185, 129, 0.22) 0deg, transparent 65deg)",
                }}
              />
            </div>

            {/* City Center Marker */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10"
            >
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/40 border border-emerald-400 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
              </div>
              <span className="text-[10px] font-mono tracking-widest text-emerald-400/80 font-bold uppercase mt-1 px-1.5 py-0.5 rounded bg-black/60 border border-emerald-500/20 backdrop-blur-xs">
                {city} Center
              </span>
            </div>

            {/* Scraping Banner Overlay */}
            {isScraping && (
              <div className="absolute inset-0 z-30 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center gap-3 text-center px-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                  <MapPin className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-wide">
                    Scraping Google Maps in {city}...
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    Connecting to local business registry and extracting verified phone numbers & ratings.
                  </p>
                </div>
              </div>
            )}

            {/* Interactive Pins on the Canvas */}
            {positionedPins.map(({ business, x, y }) => {
              const isSelected = selectedLead?.id === business.id;
              const isHot = business.score === "HOT";
              const inCrm = addedIds.has(business.id);

              return (
                <div
                  key={business.id}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
                  onClick={() => setSelectedLead(business)}
                >
                  {/* Outer Pulsing Wave */}
                  <span
                    className={`absolute -inset-2 rounded-full opacity-40 animate-ping pointer-events-none ${
                      isHot ? "bg-rose-500" : "bg-emerald-500"
                    }`}
                  />

                  {/* Main Pin Badge */}
                  <div
                    className={`relative flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold transition-all shadow-xl backdrop-blur-md border ${
                      isSelected
                        ? "bg-white text-slate-950 border-white ring-4 ring-emerald-500/40 scale-110 z-30"
                        : isHot
                        ? "bg-rose-600/90 text-white border-rose-400 hover:bg-rose-500"
                        : "bg-slate-900/90 text-white border-emerald-500/40 hover:border-emerald-400"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        inCrm ? "bg-emerald-400" : isHot ? "bg-amber-300" : "bg-emerald-400"
                      }`}
                    />
                    <span className="font-semibold truncate max-w-[110px] text-[11px]">
                      {business.name.replace(/Cabinet|Clinique|Agence|Immobilier/g, "").trim() || business.name}
                    </span>
                    <span className="text-[10px] text-amber-300 flex items-center font-mono">
                      ★{business.rating}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* ── Floating InfoWindow Card (Active Selection) ── */}
            <AnimatePresence>
              {selectedLead && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-3 right-3 z-30 w-72 sm:w-80 rounded-xl bg-slate-900/95 text-white border border-white/15 p-4 shadow-2xl backdrop-blur-xl space-y-3"
                >
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded font-mono ${
                            selectedLead.score === "HOT"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          }`}
                        >
                          {selectedLead.score} LEAD
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {selectedLead.niche}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-white mt-1 line-clamp-1">
                        {selectedLead.name}
                      </h4>
                    </div>

                    <button
                      onClick={() => setSelectedLead(null)}
                      className="text-slate-400 hover:text-white text-xs p-1 rounded-md hover:bg-white/10"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Rating & Location */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10 text-slate-300">
                    <div className="flex items-center gap-1 font-semibold text-amber-400">
                      <span>★ {selectedLead.rating}</span>
                      <span className="text-[10px] text-slate-400">
                        ({selectedLead.reviewsCount} avis)
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-300">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span className="truncate max-w-[120px]">{selectedLead.city}</span>
                    </div>
                  </div>

                  {/* Phone & Address Details */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px]">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
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
                      className={`h-7 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        addedIds.has(selectedLead.id)
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-white text-slate-950 hover:bg-slate-200"
                      }`}
                    >
                      {addedIds.has(selectedLead.id) ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>In CRM</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3" />
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
                      className="h-7 px-2.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Bottom Carousel Bar of Pinned Businesses ── */}
            <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {filteredBusinesses.map((b) => {
                const isSelected = selectedLead?.id === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => setSelectedLead(b)}
                    className={`shrink-0 px-3 py-1.5 rounded-xl text-left transition-all border backdrop-blur-md cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? "bg-white text-slate-950 border-white shadow-lg ring-2 ring-emerald-500/40 scale-105"
                        : "bg-slate-900/80 hover:bg-slate-900 text-white border-white/15"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        b.score === "HOT" ? "bg-rose-500" : "bg-emerald-400"
                      }`}
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold truncate max-w-[140px] leading-tight">
                        {b.name}
                      </span>
                      <span
                        className={`text-[10px] leading-tight ${
                          isSelected ? "text-slate-600" : "text-slate-400"
                        }`}
                      >
                        {b.niche} &bull; ★{b.rating}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
