"use client";

import { useState } from "react";
import {
  Send,
  Building2,
  MapPin,
  Calendar,
  Trash2,
  Flame,
  Users,
  Sparkles,
  ChevronRight,
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
    <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 w-full select-text">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Campagnes d'Outreach
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {campaigns.length} Lancées
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Historique de toutes les vagues de prospection générées par l'agent vocal Eensell.
          </p>
        </div>

        <Link
          href="/workspace"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Nouvelle Campagne Vocale</span>
        </Link>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.length === 0 ? (
          <div className="col-span-full p-12 rounded-3xl bg-card border border-dashed border-border text-center text-muted-foreground text-xs">
            Aucune campagne d'outreach n'a encore été lancée. Parlez à l'agent vocal pour lancer votre première vague !
          </div>
        ) : (
          campaigns.map((camp) => (
            <div
              key={camp.id}
              className="p-5 rounded-3xl bg-card border border-border hover:border-amber-500/40 transition-all shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    TERMINÉE & DISPATCHÉE
                  </span>
                  <button
                    onClick={() => handleDelete(camp.id)}
                    disabled={deletingId === camp.id}
                    className="p-1 rounded-lg text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="font-bold text-foreground text-base mt-2.5 line-clamp-1">
                  {camp.name}
                </h3>

                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                    <MapPin className="w-3 h-3" />
                    {camp.targetCity}, {camp.targetCountry}
                  </span>
                  <span>•</span>
                  <span>{camp.language.toUpperCase()}</span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-muted/40 border border-border text-center text-xs">
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase font-mono">Leads</div>
                  <div className="font-black text-foreground text-sm mt-0.5">
                    {camp.leadsCount || (camp.leads ? camp.leads.length : 0)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-mono">Réponses</div>
                  <div className="font-black text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">
                    {camp.repliesCount || 0}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-mono">RDV</div>
                  <div className="font-black text-amber-600 dark:text-amber-400 text-sm mt-0.5">
                    {camp.meetingsCount || 0}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border">
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
                  className="text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-0.5"
                >
                  <span>Pipeline CRM</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
