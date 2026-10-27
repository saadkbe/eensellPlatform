"use client";

import { useState } from "react";
import {
  Send,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  Trash2,
  Flame,
  Users,
  Sparkles,
} from "lucide-react";
import { deleteCampaign } from "@/actions/workspace.actions";
import { toast } from "sonner";
import Link from "next/link";

interface WorkspaceCampaignsClientProps {
  campaigns: any[];
}

export function WorkspaceCampaignsClient({
  campaigns: initialCampaigns,
}: WorkspaceCampaignsClientProps) {
  const [campaigns, setCampaigns] = useState<any[]>(initialCampaigns);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous supprimer cette campagne ?")) return;
    setDeletingId(id);
    try {
      await deleteCampaign(id);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      toast.success("Campagne supprimée");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Campagnes d'Outreach
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {campaigns.length} Lancées
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Historique de toutes les vagues de prospection générées par l'agent vocal Eensell.
          </p>
        </div>

        <Link
          href="/workspace"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Nouvelle Campagne Vocale</span>
        </Link>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.length === 0 ? (
          <div className="col-span-full p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center text-slate-400 text-xs">
            Aucune campagne d'outreach n'a encore été lancée. Parlez à l'agent vocal dans l'Agent Console pour lancer votre première vague !
          </div>
        ) : (
          campaigns.map((camp) => (
            <div
              key={camp.id}
              className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all shadow-xl flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    TERMINÉE & DISPATCHÉE
                  </span>
                  <button
                    onClick={() => handleDelete(camp.id)}
                    disabled={deletingId === camp.id}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="font-bold text-white text-base mt-2.5 line-clamp-1">
                  {camp.name}
                </h3>

                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1 text-amber-300">
                    <MapPin className="w-3 h-3" />
                    {camp.targetCity}, {camp.targetCountry}
                  </span>
                  <span>•</span>
                  <span>Langue : {camp.language.toUpperCase()}</span>
                </div>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Leads</div>
                  <div className="font-black text-white text-sm mt-0.5">
                    {camp.leadsCount || (camp.leads ? camp.leads.length : 0)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-emerald-400 uppercase font-mono">Réponses</div>
                  <div className="font-black text-emerald-300 text-sm mt-0.5">
                    {camp.repliesCount || 0}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-amber-400 uppercase font-mono">RDV</div>
                  <div className="font-black text-amber-300 text-sm mt-0.5">
                    {camp.meetingsCount || 0}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(camp.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <Link
                  href="/workspace/crm"
                  className="text-amber-400 hover:text-amber-300 font-semibold"
                >
                  Voir dans le CRM →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
