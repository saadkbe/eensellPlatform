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
import { DeleteConfirmationModal } from "@/components/workspace/delete-confirmation-modal";
import { RocketLaunchSticker, GlowingPulseSticker } from "@/components/workspace/workspace-stickers";

interface WorkspaceCampaignsClientProps {
  campaigns: any[];
}

export function WorkspaceCampaignsClient({
  campaigns: initialCampaigns,
}: WorkspaceCampaignsClientProps) {
  const [campaigns, setCampaigns] = useState<any[]>(initialCampaigns);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<any | null>(null);

  const confirmDelete = async () => {
    if (!campaignToDelete) return;
    const id = campaignToDelete.id;
    try {
      await deleteCampaign(id);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      toast.success("Campagne supprimée");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="w-full px-3 sm:px-5 lg:px-6 py-4 sm:py-5 space-y-6 select-text">
      {/* ── Top Header Banner with Distinct Background ── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-md shrink-0">
              <RocketLaunchSticker className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  VOICE AGENT &bull; MULTI-CHANNEL OUTREACH
                </span>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <GlowingPulseSticker className="w-2.5 h-2.5" color="#10B981" />
                  {campaigns.length} Active Waves
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Outreach Campaigns History
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Review and monitor all prospect outreach batches dispatched across email and voice agents with live response metrics.
              </p>
            </div>
          </div>

          <Link
            href="/workspace"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold shadow-md cursor-pointer transition-transform hover:scale-[1.02] shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Launch New Voice Wave &rarr;</span>
          </Link>
        </div>
      </div>

      {/* ── Section Title ── */}
      <div className="flex items-center justify-between pt-1">
        <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <span>All Dispatched Campaigns</span>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400">
            {campaigns.length}
          </span>
        </h2>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.length === 0 ? (
          <div className="col-span-full p-12 rounded-2xl bg-card border border-dashed border-border text-center text-muted-foreground text-xs">
            Aucune campagne d'outreach n'a encore été lancée. Parlez à l'agent vocal pour lancer votre première vague !
          </div>
        ) : (
          campaigns.map((camp) => (
            <div
              key={camp.id}
              className="p-5 rounded-2xl bg-card border border-border hover:border-slate-400 dark:hover:border-white/20 transition-all shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    TERMINÉE & DISPATCHÉE
                  </span>
                  <button
                    onClick={() => {
                      setCampaignToDelete(camp);
                      setDeleteModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="font-bold text-foreground text-base mt-2.5 line-clamp-1">
                  {camp.name}
                </h3>

                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {camp.targetCity}, {camp.targetCountry}
                  </span>
                  <span>•</span>
                  <span>{camp.language.toUpperCase()}</span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-muted/40 border border-border text-center text-xs">
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
                  <div className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-mono">RDV</div>
                  <div className="font-black text-blue-600 dark:text-blue-400 text-sm mt-0.5">
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
                  className="text-slate-900 dark:text-white font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Pipeline CRM</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Supprimer cette campagne ?"
        description="Cette action supprimera définitivement la campagne et l'historique associé."
        itemName={campaignToDelete?.name}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
