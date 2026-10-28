"use client";

import { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Mail,
  Building2,
  Calendar,
  Phone,
  Globe,
  Flame,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Clock,
  Sparkles,
  ArrowUpDown,
  Plus,
} from "lucide-react";
import { updateLeadStatus } from "@/actions/workspace.actions";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

interface WorkspaceCrmClientProps {
  initialLeads: any[];
  stats: {
    totalLeads: number;
    sentEmails: number;
    replies: number;
    meetingsBooked: number;
    conversionRate: number;
  };
}

const STARTER_LEADS = [
  {
    id: "crm_1",
    businessName: "Atlas Prestige Immobilier",
    niche: "Real Estate Agencies",
    city: "Casablanca",
    country: "Morocco",
    website: "https://atlasprestige.ma",
    phone: "+212 5 22 45 88 12",
    email: "direction@atlasprestige.ma",
    status: "REPLIED",
    replyNotes: "Director confirmed interest in WhatsApp qualification bot. Meeting held.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "crm_2",
    businessName: "Cabinet Dentaire Dr. Alami Gauthier",
    niche: "Dental Clinics",
    city: "Casablanca",
    country: "Morocco",
    website: "https://cabinet-dentaire-alami.ma",
    phone: "+212 5 22 20 14 55",
    email: "contact@cabinet-alami.ma",
    status: "SENT",
    replyNotes: "Cold email sent with personalized Loom demo.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "crm_3",
    businessName: "Casablanca Prime Properties",
    niche: "Real Estate Agencies",
    city: "Casablanca",
    country: "Morocco",
    website: "https://casablancaprime.ma",
    phone: "+212 5 22 98 14 00",
    email: "info@casablancaprime.ma",
    status: "REPLIED",
    replyNotes: "Proposal sent for 6,000 MAD / month retainer.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "crm_4",
    businessName: "Rabat Agdal Immobilier",
    niche: "Real Estate Agencies",
    city: "Rabat",
    country: "Morocco",
    website: "https://rabatagdalimmo.ma",
    phone: "+212 5 37 77 50 14",
    email: "agence@rabatagdalimmo.ma",
    status: "DRAFTED",
    replyNotes: "Ready to dispatch outreach pitch.",
    createdAt: new Date().toISOString(),
  },
];

export function WorkspaceCrmClient({
  initialLeads,
  stats,
}: WorkspaceCrmClientProps) {
  const [leads, setLeads] = useState<any[]>(
    initialLeads && initialLeads.length > 0 ? initialLeads : STARTER_LEADS
  );
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [notesModalLead, setNotesModalLead] = useState<any | null>(null);
  const [replyNoteInput, setReplyNoteInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredLeads = leads.filter((lead) => {
    const matchesFilter =
      filterStatus === "ALL" || lead.status === filterStatus;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      lead.businessName.toLowerCase().includes(query) ||
      lead.city.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      lead.niche.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = async (leadId: string, newStatus: any) => {
    setIsUpdating(true);
    try {
      const res = await updateLeadStatus(leadId, newStatus);
      if (res.success) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );
        toast.success(`Statut mis à jour : ${newStatus}`);
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNote = async () => {
    if (!notesModalLead) return;
    setIsUpdating(true);
    try {
      const res = await updateLeadStatus(
        notesModalLead.id,
        notesModalLead.status,
        replyNoteInput
      );
      if (res.success) {
        setLeads((prev) =>
          prev.map((l) =>
            l.id === notesModalLead.id ? { ...l, replyNotes: replyNoteInput } : l
          )
        );
        toast.success("Note enregistrée avec succès !");
        setNotesModalLead(null);
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Pipeline & CRM Client
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {filteredLeads.length} Opportunités
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Gérez vos agences ciblées, suivez les réponses reçues et qualifiez vos rendez-vous démo.
          </p>
        </div>

        <Link
          href="/workspace"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Lancer un Nouvel Outreach</span>
        </Link>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => setFilterStatus("ALL")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterStatus === "ALL"
              ? "bg-amber-500/10 border-amber-500/40 text-amber-800 dark:text-amber-300 shadow-xs"
              : "bg-card border-border hover:bg-muted/50"
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Total Leads
          </div>
          <div className="text-2xl font-black text-foreground mt-1">
            {stats.totalLeads}
          </div>
        </div>

        <div
          onClick={() => setFilterStatus("SENT")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterStatus === "SENT"
              ? "bg-blue-500/10 border-blue-500/40 text-blue-800 dark:text-blue-300 shadow-xs"
              : "bg-card border-border hover:bg-muted/50"
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Emails Envoyés
          </div>
          <div className="text-2xl font-black text-foreground mt-1">
            {stats.sentEmails}
          </div>
        </div>

        <div
          onClick={() => setFilterStatus("REPLIED")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterStatus === "REPLIED"
              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-800 dark:text-emerald-300 shadow-xs"
              : "bg-card border-border hover:bg-muted/50"
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Réponses Reçues
          </div>
          <div className="text-2xl font-black text-foreground mt-1">
            {stats.replies}
          </div>
        </div>

        <div
          onClick={() => setFilterStatus("MEETING_BOOKED")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterStatus === "MEETING_BOOKED"
              ? "bg-amber-500/20 border-amber-500/50 text-amber-900 dark:text-amber-200 shadow-xs"
              : "bg-card border-border hover:bg-muted/50"
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center justify-between">
            <span>RDV Confirmés</span>
            <Flame className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-foreground mt-1">
            {stats.meetingsBooked}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher agence, ville, email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted/40 border border-border text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {["ALL", "MEETING_BOOKED", "REPLIED", "SENT", "DECLINED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterStatus === st
                  ? "bg-primary text-primary-foreground shadow-xs font-bold"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {st === "ALL"
                ? "Tous"
                : st === "MEETING_BOOKED"
                ? "RDV Pris"
                : st === "REPLIED"
                ? "Réponses"
                : st === "SENT"
                ? "Envoyés"
                : "Déclinés"}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-3xl bg-card border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-foreground">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>
                <th className="px-5 py-3.5 font-bold">Entreprise & Ville</th>
                <th className="px-4 py-3.5 font-bold">Contact & Niche</th>
                <th className="px-4 py-3.5 font-bold">Statut Pipeline</th>
                <th className="px-4 py-3.5 font-bold">Dernière Action</th>
                <th className="px-4 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-muted-foreground text-xs">
                    Aucun prospect ne correspond à ces critères. Lancez une campagne vocale pour peupler votre pipeline !
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-muted border border-border text-amber-500">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-foreground text-sm">
                            {lead.businessName}
                          </div>
                          <div className="text-muted-foreground text-[11px] flex items-center gap-2 mt-0.5">
                            <span>{lead.city}, {lead.country}</span>
                            {lead.website && (
                              <a
                                href={lead.website}
                                target="_blank"
                                rel="noreferrer"
                                className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5"
                              >
                                <Globe className="w-3 h-3" />
                                <span>Site</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-medium text-foreground">
                        {lead.email}
                      </div>
                      <div className="text-muted-foreground text-[11px] mt-0.5">
                        {lead.phone || "Téléphone disponible"} • <span className="text-amber-600 dark:text-amber-400 font-medium">{lead.niche}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold inline-flex items-center gap-1.5 ${
                            lead.status === "MEETING_BOOKED"
                              ? "bg-amber-500 text-slate-950 font-bold"
                              : lead.status === "REPLIED"
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                              : lead.status === "DECLINED"
                              ? "bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30"
                              : "bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30"
                          }`}
                        >
                          {lead.status === "MEETING_BOOKED" && <Flame className="w-3 h-3" />}
                          {lead.status === "REPLIED" && <CheckCircle2 className="w-3 h-3" />}
                          {lead.status === "MEETING_BOOKED"
                            ? "RDV CONFIRMÉ"
                            : lead.status === "REPLIED"
                            ? "RÉPONSE REÇUE"
                            : lead.status === "DECLINED"
                            ? "DÉCLINÉ"
                            : "EMAIL ENVOYÉ"}
                        </span>
                      </div>
                      {lead.replyNotes && (
                        <div className="text-[10px] text-amber-700 dark:text-amber-300 mt-1 max-w-xs truncate italic">
                          "{lead.replyNotes}"
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-4 text-muted-foreground text-[11px]">
                      {lead.sentAt
                        ? new Date(lead.sentAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Planifié"}
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="px-2.5 py-1.5 rounded-lg bg-card hover:bg-muted text-foreground text-xs font-semibold border border-border transition-colors cursor-pointer"
                        >
                          Email
                        </button>

                        <button
                          onClick={() => {
                            setNotesModalLead(lead);
                            setReplyNoteInput(lead.replyNotes || "");
                          }}
                          className="p-1.5 rounded-lg bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border transition-colors cursor-pointer"
                          title="Ajouter une note de réponse"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>

                        {lead.status !== "MEETING_BOOKED" && (
                          <button
                            onClick={() =>
                              handleStatusChange(lead.id, "MEETING_BOOKED")
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-700 dark:text-amber-300 hover:text-slate-950 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer"
                            title="Marquer comme RDV confirmé"
                          >
                            + RDV
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Email Preview */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-3xl bg-card border border-border p-6 shadow-2xl flex flex-col space-y-4 text-foreground"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-amber-500" />
                  <span className="font-bold text-foreground text-sm">
                    Détails du message envoyé
                  </span>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-muted-foreground hover:text-foreground text-xs font-mono px-2 py-1 rounded bg-muted cursor-pointer"
                >
                  Fermer
                </button>
              </div>

              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-muted-foreground font-mono">Destinataire : </span>
                  <span className="font-semibold text-foreground">
                    {selectedLead.businessName} ({selectedLead.email})
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground font-mono">Objet : </span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {selectedLead.emailSubject}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/40 border border-border text-xs sm:text-sm text-foreground whitespace-pre-wrap font-sans max-h-72 overflow-y-auto leading-relaxed">
                {selectedLead.emailBody}
              </div>

              {selectedLead.replyNotes && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-800 dark:text-amber-200">
                  <span className="font-bold block text-amber-700 dark:text-amber-300">Réponse reçue :</span>
                  {selectedLead.replyNotes}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Note / Reply Logger */}
      <AnimatePresence>
        {notesModalLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl bg-card border border-border p-6 shadow-2xl flex flex-col space-y-4 text-foreground"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-500" />
                  <span className="font-bold text-foreground text-sm">
                    Consigner une Réponse Client
                  </span>
                </div>
                <button
                  onClick={() => setNotesModalLead(null)}
                  className="text-muted-foreground hover:text-foreground text-xs font-mono px-2 py-1 rounded bg-muted cursor-pointer"
                >
                  Fermer
                </button>
              </div>

              <p className="text-xs text-muted-foreground">
                Ajoutez la réponse ou la demande pour {notesModalLead.businessName}. L'agent vocal l'intégrera dans son débriefing quotidien.
              </p>

              <textarea
                value={replyNoteInput}
                onChange={(e) => setReplyNoteInput(e.target.value)}
                rows={4}
                placeholder="Ex : Le directeur souhaite une démo WhatsApp ce jeudi à 15h..."
                className="w-full p-3 rounded-xl bg-muted/40 border border-border text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-amber-500"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setNotesModalLead(null)}
                  className="px-3.5 py-2 rounded-xl bg-muted text-xs text-muted-foreground hover:text-foreground"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveNote}
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:opacity-90 disabled:opacity-50"
                >
                  Enregistrer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
