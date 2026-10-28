"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Users,
  Plus,
  ArrowRight,
  CheckSquare,
  Square,
  Trash2,
  MapPin,
  Send,
  Table2,
  Sparkles,
  Target,
  Key,
  ShieldCheck,
  AlertCircle,
  Clock,
  Phone,
  Receipt,
  ChevronRight,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  createRetainerAction,
  updateRetainerStatusAction,
  deleteRetainerAction,
  createTaskAction,
  toggleTaskAction,
  deleteTaskAction,
} from "@/actions/workspace.actions";

interface WorkspaceDashboardProps {
  initialData?: {
    account?: {
      gmailAddress: string | null;
      isGmailConnected: boolean;
      senderName: string | null;
      agencyName: string | null;
      hasElevenLabs: boolean;
      hasOpenAI: boolean;
      hasOutscraper: boolean;
      voiceId: string | null;
    } | null;
    stats?: {
      totalCampaigns: number;
      totalLeads: number;
      sentEmails: number;
      replies: number;
      meetingsBooked: number;
      conversionRate: number;
      totalMRR?: number;
      pendingMRR?: number;
    };
    retainers?: any[];
    tasks?: any[];
    recentLeads?: any[];
  } | null;
}

export function WorkspaceDashboardClient({ initialData }: WorkspaceDashboardProps) {
  // Real Database Retainers & Tasks (No hardcoded mock data)
  const [retainers, setRetainers] = useState<any[]>(initialData?.retainers || []);
  const [tasks, setTasks] = useState<any[]>(initialData?.tasks || []);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("outreach");
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Retainer Modal State
  const [isAddRetainerOpen, setIsAddRetainerOpen] = useState(false);
  const [isSubmittingRetainer, setIsSubmittingRetainer] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newContactPerson, setNewContactPerson] = useState("");
  const [newService, setNewService] = useState("WhatsApp Lead Qualification Bot");
  const [newFee, setNewFee] = useState("5000");
  const [newPhone, setNewPhone] = useState("");
  const [newCity, setNewCity] = useState("Casablanca");

  // Dynamic calculations based on real DB data
  const totalMRR = retainers
    .filter((r) => r.status === "active")
    .reduce((acc, curr) => acc + (Number(curr.monthlyFee) || 0), 0);
  const pendingMRR = retainers
    .filter((r) => r.status === "pending_payment")
    .reduce((acc, curr) => acc + (Number(curr.monthlyFee) || 0), 0);

  const targetMRR = 30000;
  const progressPercent = Math.min(Math.round((totalMRR / targetMRR) * 100), 100);
  const completedTasksCount = tasks.filter((t) => t.done).length;

  const account = initialData?.account;
  const stats = initialData?.stats;

  // ── Handlers with Real DB Persistence ──
  const handleToggleTask = async (id: string) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
    try {
      await toggleTaskAction(id);
    } catch {
      toast.error("Erreur lors de la mise à jour de la tâche");
    }
  };

  const handleDeleteTask = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteTaskAction(id);
      toast.info("Tâche supprimée");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    setIsAddingTask(true);
    try {
      const res = await createTaskAction(newTaskText, newTaskCategory);
      if (res.success && res.task) {
        setTasks((prev) => [...prev, res.task]);
        setNewTaskText("");
        toast.success("Priorité ajoutée !");
      }
    } catch {
      toast.error("Impossible d'enregistrer la tâche");
    } finally {
      setIsAddingTask(false);
    }
  };

  const handleCreateRetainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    setIsSubmittingRetainer(true);
    let category = "custom";
    if (newService.toLowerCase().includes("whatsapp")) category = "whatsapp";
    else if (newService.toLowerCase().includes("voice")) category = "voice";
    else if (newService.toLowerCase().includes("crm")) category = "crm";

    try {
      const res = await createRetainerAction({
        clientName: newClientName,
        contactPerson: newContactPerson,
        service: newService,
        category,
        monthlyFee: parseInt(newFee) || 5000,
        status: "active",
        city: newCity,
        phone: newPhone,
      });

      if (res.success && res.retainer) {
        setRetainers((prev) => [res.retainer, ...prev]);
        setIsAddRetainerOpen(false);
        setNewClientName("");
        setNewContactPerson("");
        setNewFee("5000");
        toast.success(`Contrat pour "${newClientName}" enregistré avec succès !`);
      }
    } catch {
      toast.error("Erreur lors de l'enregistrement du contrat");
    } finally {
      setIsSubmittingRetainer(false);
    }
  };

  const handleDeleteRetainer = async (id: string) => {
    if (!confirm("Voulez-vous supprimer ce contrat client ?")) return;
    setRetainers((prev) => prev.filter((r) => r.id !== id));
    try {
      await deleteRetainerAction(id);
      toast.info("Contrat supprimé");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleToggleRetainerStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "pending_payment" : "active";
    setRetainers((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    try {
      await updateRetainerStatusAction(id, newStatus);
      toast.success(newStatus === "active" ? "Contrat marqué comme Actif" : "Contrat en attente de paiement");
    } catch {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 select-text">
      {/* ── Modern Executive Top Bar ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#EDEDEB] dark:border-[#2E2E2E]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              AGENCY OS &bull; LIVE DASHBOARD
            </span>
            <span className="text-xs text-[#787774] dark:text-[#9B9A97]">
              {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#37352F] dark:text-[#E6E6E5]">
            Agency Command & Revenue
          </h1>
          <p className="text-xs sm:text-sm text-[#787774] dark:text-[#9B9A97]">
            Real-time operating system for client retainers, outbound acquisition, and cashflow.
          </p>
        </div>

        {/* Quick Action Button & API Health status */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/workspace/settings"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F7F6F3] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] hover:border-[#D3D1CB] dark:hover:border-[#3E3E3E] text-[#37352F] dark:text-[#E6E6E5] transition-all"
            title="Configure API Keys"
          >
            <Key className="w-3.5 h-3.5 text-amber-500" />
            <span>API Settings</span>
          </Link>

          <Button
            onClick={() => setIsAddRetainerOpen(true)}
            className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg text-xs font-semibold bg-[#37352F] hover:bg-[#262420] dark:bg-[#E6E6E5] dark:hover:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#191919] shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Retainer</span>
          </Button>
        </div>
      </div>

      {/* ── Simplified 3-Metric Clean Animated Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {/* Metric 1: Verified Monthly Cashflow (MRR) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] shadow-2xs hover:border-[#D3D1CB] dark:hover:border-[#3E3E3E] transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97] uppercase tracking-wider">
              Verified Monthly Cashflow
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>

          <div className="my-4">
            <div className="text-3xl font-extrabold tracking-tight text-[#37352F] dark:text-[#E6E6E5]">
              {totalMRR.toLocaleString()}{" "}
              <span className="text-sm font-semibold text-[#787774] dark:text-[#9B9A97]">MAD/mo</span>
            </div>
            <p className="text-xs text-[#787774] dark:text-[#9B9A97] mt-1">
              Target: <strong className="text-[#37352F] dark:text-[#E6E6E5]">30,000 MAD</strong> &bull; {progressPercent}% achieved
            </p>
          </div>

          {/* Minimal animated progress line */}
          <div className="space-y-1">
            <div className="w-full bg-[#EDEDEB] dark:bg-[#2E2E2E] h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-emerald-500 h-full rounded-full"
              />
            </div>
            <div className="flex justify-between text-[11px] text-[#787774] dark:text-[#9B9A97] pt-1">
              <span>{retainers.filter((r) => r.status === "active").length} Active contracts</span>
              <span>Pending: {pendingMRR.toLocaleString()} MAD</span>
            </div>
          </div>
        </motion.div>

        {/* Metric 2: Prospect Database & Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] shadow-2xs hover:border-[#D3D1CB] dark:hover:border-[#3E3E3E] transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97] uppercase tracking-wider">
              Prospects & Pipeline
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="my-4">
            <div className="text-3xl font-extrabold tracking-tight text-[#37352F] dark:text-[#E6E6E5]">
              {stats?.totalLeads || 0}{" "}
              <span className="text-sm font-semibold text-[#787774] dark:text-[#9B9A97]">Leads</span>
            </div>
            <p className="text-xs text-[#787774] dark:text-[#9B9A97] mt-1">
              Saved in your CRM & ready for outbound pitches
            </p>
          </div>

          <div className="pt-2 border-t border-[#EDEDEB] dark:border-[#2E2E2E]/60 flex items-center justify-between text-xs">
            <Link
              href="/workspace/scraper"
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1"
            >
              <span>Scrape new leads</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/workspace/crm" className="text-[#787774] dark:text-[#9B9A97] hover:underline">
              View CRM ({stats?.replies || 0} replies)
            </Link>
          </div>
        </motion.div>

        {/* Metric 3: Active Client Accounts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] shadow-2xs hover:border-[#D3D1CB] dark:hover:border-[#3E3E3E] transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97] uppercase tracking-wider">
              Active Client Portfolio
            </span>
            <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="my-4">
            <div className="text-3xl font-extrabold tracking-tight text-[#37352F] dark:text-[#E6E6E5]">
              {retainers.length}{" "}
              <span className="text-sm font-semibold text-[#787774] dark:text-[#9B9A97]">Accounts</span>
            </div>
            <p className="text-xs text-[#787774] dark:text-[#9B9A97] mt-1">
              {retainers.length === 0
                ? "No clients registered yet"
                : `Avg. ${Math.round(totalMRR / (retainers.length || 1)).toLocaleString()} MAD / client`}
            </p>
          </div>

          <div className="pt-2 border-t border-[#EDEDEB] dark:border-[#2E2E2E]/60 flex items-center justify-between text-xs">
            <span className="text-[#787774] dark:text-[#9B9A97]">
              {retainers.filter((r) => r.status === "active").length} active billings
            </span>
            <button
              onClick={() => setIsAddRetainerOpen(true)}
              className="text-violet-600 dark:text-violet-400 font-semibold hover:underline cursor-pointer"
            >
              + Add Client
            </button>
          </div>
        </motion.div>
      </div>

      {/* ── Main 2-Column Responsive Layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full">
        {/* Left Column (Retainers List & Core Ecosystem Modules) */}
        <div className="xl:col-span-8 space-y-6">
          {/* Client Retainers Card */}
          <div className="rounded-2xl border border-[#EDEDEB] dark:border-[#2E2E2E] bg-[#FFFFFF] dark:bg-[#202020] p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-sm sm:text-base text-[#37352F] dark:text-[#E6E6E5] flex items-center gap-2">
                  <span>Client Retainers & Contracts</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F7F6F3] dark:bg-[#2A2A2A] text-[#787774] dark:text-[#9B9A97]">
                    {retainers.length}
                  </span>
                </h2>
                <p className="text-xs text-[#787774] dark:text-[#9B9A97] mt-0.5">
                  Monthly recurring services, client deliverables, and billing cycles.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddRetainerOpen(true)}
                className="h-7 text-xs border-[#EDEDEB] dark:border-[#2E2E2E] hover:bg-[#F7F6F3] dark:hover:bg-[#2A2A2A]"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Retainer
              </Button>
            </div>

            {/* Retainers List or Clean Empty State */}
            {retainers.length === 0 ? (
              <div className="py-10 px-4 rounded-xl border border-dashed border-[#EDEDEB] dark:border-[#2E2E2E] text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-[#F7F6F3] dark:bg-[#262626] mx-auto flex items-center justify-center text-lg">
                  💼
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#37352F] dark:text-[#E6E6E5]">
                    No client retainers registered yet
                  </p>
                  <p className="text-xs text-[#787774] dark:text-[#9B9A97] max-w-sm mx-auto">
                    Close a client or register a current project to begin tracking your monthly agency revenue.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setIsAddRetainerOpen(true)}
                  className="h-8 text-xs bg-[#37352F] dark:bg-[#E6E6E5] text-white dark:text-black hover:opacity-90"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add First Retainer
                </Button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <AnimatePresence>
                  {retainers.map((client) => (
                    <motion.div
                      key={client.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="p-3.5 rounded-xl border border-[#EDEDEB] dark:border-[#2E2E2E] hover:border-[#D3D1CB] dark:hover:border-[#3E3E3E] hover:bg-[#FAF9F7]/50 dark:hover:bg-[#252525]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#F0EFEA] dark:bg-[#2C2C2C] text-[#37352F] dark:text-[#E6E6E5] font-bold text-xs flex items-center justify-center shrink-0 border border-[#E2E0D8] dark:border-[#3A3A3A]">
                          {client.clientName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-[#37352F] dark:text-[#E6E6E5] truncate">
                            {client.clientName}
                          </div>
                          <div className="text-[11px] text-[#787774] dark:text-[#9B9A97] truncate flex items-center gap-2 mt-0.5">
                            <span>{client.contactPerson || "Lead Contact"}</span>
                            <span>&bull;</span>
                            <span className="text-emerald-600 dark:text-emerald-400">{client.service}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <div className="text-right">
                          <div className="font-bold text-xs text-[#37352F] dark:text-[#E6E6E5]">
                            {Number(client.monthlyFee).toLocaleString()} MAD
                            <span className="text-[10px] text-[#787774] dark:text-[#9B9A97] font-normal"> / mo</span>
                          </div>
                        </div>

                        {/* Status Toggle Pill */}
                        <button
                          onClick={() => handleToggleRetainerStatus(client.id, client.status)}
                          className="cursor-pointer"
                          title="Click to toggle status"
                        >
                          {client.status === "active" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/40 hover:opacity-80 transition-opacity">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/40 hover:opacity-80 transition-opacity">
                              <Clock className="w-3 h-3 text-amber-500" />
                              Pending
                            </span>
                          )}
                        </button>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/workspace/invoices?client=${encodeURIComponent(client.clientName)}&fee=${client.monthlyFee}`}
                            className="p-1 rounded-md text-[#787774] hover:text-[#37352F] dark:hover:text-[#E6E6E5] hover:bg-[#F0EFEA] dark:hover:bg-[#2C2C2C] transition-colors"
                            title="Generate Invoice"
                          >
                            <Receipt className="w-3.5 h-3.5 text-blue-500" />
                          </Link>

                          <button
                            onClick={() => handleDeleteRetainer(client.id)}
                            className="p-1 rounded-md text-[#9B9A97] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                            title="Delete Retainer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Core Modules Quick Launch Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/workspace/scraper"
              className="p-4 rounded-2xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] hover:border-[#D3D1CB] dark:hover:border-[#3E3E3E] hover:shadow-xs transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold">
                  📍
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#9B9A97] group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="font-bold text-xs text-[#37352F] dark:text-[#E6E6E5] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Google Maps Lead Scraper
              </h3>
              <p className="text-[11px] text-[#787774] dark:text-[#9B9A97] mt-0.5">
                Extract phone numbers, ratings, and verified decision-makers across any target city.
              </p>
            </Link>

            <Link
              href="/workspace/crm"
              className="p-4 rounded-2xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] hover:border-[#D3D1CB] dark:hover:border-[#3E3E3E] hover:shadow-xs transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm font-bold">
                  💼
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#9B9A97] group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="font-bold text-xs text-[#37352F] dark:text-[#E6E6E5] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Client Pipeline CRM
              </h3>
              <p className="text-[11px] text-[#787774] dark:text-[#9B9A97] mt-0.5">
                Track outreach stages from contacted to WhatsApp reply, demo call booked, and signed retainer.
              </p>
            </Link>

            <Link
              href="/workspace/sheets"
              className="p-4 rounded-2xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] hover:border-[#D3D1CB] dark:hover:border-[#3E3E3E] hover:shadow-xs transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-sm font-bold">
                  📊
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#9B9A97] group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="font-bold text-xs text-[#37352F] dark:text-[#E6E6E5] group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Agency Database Sheets
              </h3>
              <p className="text-[11px] text-[#787774] dark:text-[#9B9A97] mt-0.5">
                Relational live database table for your prospects, client contacts, and deal forecasting.
              </p>
            </Link>

            <Link
              href="/workspace/drafter"
              className="p-4 rounded-2xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] hover:border-[#D3D1CB] dark:hover:border-[#3E3E3E] hover:shadow-xs transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center text-sm font-bold">
                  ✍️
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#9B9A97] group-hover:text-violet-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="font-bold text-xs text-[#37352F] dark:text-[#E6E6E5] group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                AI Pitch & Voice Drafter
              </h3>
              <p className="text-[11px] text-[#787774] dark:text-[#9B9A97] mt-0.5">
                Generate tailored outreach copy in Darija, French, and English using GPT-4o and ElevenLabs.
              </p>
            </Link>
          </div>
        </div>

        {/* Right Column (API Key Readiness & High-Leverage Priorities) */}
        <div className="xl:col-span-4 space-y-6">
          {/* API Keys & Live Readiness Card */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#37352F] dark:text-[#E6E6E5] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>API & System Readiness</span>
              </h3>
              <Link
                href="/workspace/settings"
                className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Configure &rarr;
              </Link>
            </div>

            <p className="text-xs text-[#787774] dark:text-[#9B9A97]">
              Connect your credentials in Settings to activate autonomous scraping, AI copywriting, and live email dispatch.
            </p>

            <div className="space-y-2 pt-1 text-xs">
              {/* OpenAI GPT-4o */}
              <div className="p-2.5 rounded-xl border border-[#EDEDEB] dark:border-[#2E2E2E] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🤖</span>
                  <span className="font-medium text-[#37352F] dark:text-[#E6E6E5]">OpenAI GPT-4o</span>
                </div>
                {account?.hasOpenAI ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Connected
                  </span>
                ) : (
                  <Link
                    href="/workspace/settings"
                    className="text-[11px] text-[#787774] hover:text-[#37352F] dark:hover:text-[#E6E6E5] underline"
                  >
                    Add Key
                  </Link>
                )}
              </div>

              {/* Outscraper Google Maps */}
              <div className="p-2.5 rounded-xl border border-[#EDEDEB] dark:border-[#2E2E2E] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">📍</span>
                  <span className="font-medium text-[#37352F] dark:text-[#E6E6E5]">Outscraper Maps</span>
                </div>
                {account?.hasOutscraper ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Connected
                  </span>
                ) : (
                  <Link
                    href="/workspace/settings"
                    className="text-[11px] text-[#787774] hover:text-[#37352F] dark:hover:text-[#E6E6E5] underline"
                  >
                    Add Key
                  </Link>
                )}
              </div>

              {/* Gmail SMTP */}
              <div className="p-2.5 rounded-xl border border-[#EDEDEB] dark:border-[#2E2E2E] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">✉️</span>
                  <span className="font-medium text-[#37352F] dark:text-[#E6E6E5]">Gmail Dispatch</span>
                </div>
                {account?.isGmailConnected ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Connected
                  </span>
                ) : (
                  <Link
                    href="/workspace/settings"
                    className="text-[11px] text-[#787774] hover:text-[#37352F] dark:hover:text-[#E6E6E5] underline"
                  >
                    Connect SMTP
                  </Link>
                )}
              </div>

              {/* ElevenLabs Voice */}
              <div className="p-2.5 rounded-xl border border-[#EDEDEB] dark:border-[#2E2E2E] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🎙️</span>
                  <span className="font-medium text-[#37352F] dark:text-[#E6E6E5]">ElevenLabs Voice</span>
                </div>
                {account?.hasElevenLabs ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Connected
                  </span>
                ) : (
                  <span className="text-[11px] text-[#9B9A97]">Web Speech Native</span>
                )}
              </div>
            </div>
          </div>

          {/* Daily Acquisition Priorities (Real Database Tasks) */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#37352F] dark:text-[#E6E6E5] flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Daily Priorities</span>
                </h3>
                <span className="text-[11px] text-[#787774] dark:text-[#9B9A97]">
                  {completedTasksCount} of {tasks.length} completed
                </span>
              </div>
              {tasks.length > 0 && (
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                  {Math.round((completedTasksCount / tasks.length) * 100)}%
                </span>
              )}
            </div>

            {/* Tasks list */}
            {tasks.length === 0 ? (
              <p className="text-xs text-[#787774] dark:text-[#9B9A97] py-2 text-center">
                All priorities cleared. Add your next high-leverage task below.
              </p>
            ) : (
              <div className="space-y-2">
                <AnimatePresence>
                  {tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => handleToggleTask(task.id)}
                      className="p-2.5 rounded-xl border border-[#EDEDEB] dark:border-[#2E2E2E] hover:bg-[#FAF9F7] dark:hover:bg-[#252525] transition-colors flex items-start gap-2.5 cursor-pointer group select-none"
                    >
                      {task.done ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-[#9B9A97] group-hover:text-[#37352F] dark:group-hover:text-[#E6E6E5] shrink-0 mt-0.5" />
                      )}

                      <div className="flex-1 min-w-0">
                        <span
                          className={`text-xs block leading-relaxed ${
                            task.done
                              ? "line-through text-[#9B9A97] dark:text-[#666666]"
                              : "text-[#37352F] dark:text-[#E6E6E5]"
                          }`}
                        >
                          {task.text}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleDeleteTask(task.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-[#9B9A97] hover:text-red-500 transition-opacity"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Quick Add Task Input */}
            <form onSubmit={handleAddTask} className="pt-2 border-t border-[#EDEDEB] dark:border-[#2E2E2E]">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="+ Add high-leverage task (press Enter)..."
                  className="flex-1 bg-[#FBFBFA] dark:bg-[#1A1A1A] px-3 py-1.5 rounded-lg border border-[#EDEDEB] dark:border-[#2E2E2E] text-xs text-[#37352F] dark:text-[#E6E6E5] placeholder-[#9B9A97] outline-none focus:border-[#37352F] dark:focus:border-[#E6E6E5] transition-colors"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isAddingTask || !newTaskText.trim()}
                  className="h-7 text-xs bg-[#37352F] dark:bg-[#E6E6E5] text-[#FFFFFF] dark:text-[#191919] hover:opacity-90 cursor-pointer disabled:opacity-40"
                >
                  Add
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ── Add Retainer Modal ── */}
      <AnimatePresence>
        {isAddRetainerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] shadow-2xl p-6 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#EDEDEB] dark:border-[#2E2E2E]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                    💰
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#37352F] dark:text-[#E6E6E5]">
                      Register Client Retainer
                    </h3>
                    <p className="text-[11px] text-[#787774] dark:text-[#9B9A97]">
                      Saved directly to your database to track recurring cashflow.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddRetainerOpen(false)}
                  className="text-[#787774] hover:text-[#37352F] dark:hover:text-[#E6E6E5] text-xs font-semibold px-2 py-1 rounded-md"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateRetainer} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                    Company / Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prestige Real Estate, Cabinet Dr. Smith..."
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-xl px-3 py-2 text-xs text-[#37352F] dark:text-[#E6E6E5] outline-none focus:border-[#37352F] dark:focus:border-[#E6E6E5]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Founder, Marketing Director"
                      value={newContactPerson}
                      onChange={(e) => setNewContactPerson(e.target.value)}
                      className="w-full bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-xl px-3 py-2 text-xs text-[#37352F] dark:text-[#E6E6E5] outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                      City
                    </label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      placeholder="Casablanca, Paris, Dubai..."
                      className="w-full bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-xl px-3 py-2 text-xs text-[#37352F] dark:text-[#E6E6E5] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                      Monthly Retainer (MAD) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newFee}
                      onChange={(e) => setNewFee(e.target.value)}
                      className="w-full bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-xl px-3 py-2 text-xs text-[#37352F] dark:text-[#E6E6E5] outline-none font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="text"
                      placeholder="+212 ..."
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-xl px-3 py-2 text-xs text-[#37352F] dark:text-[#E6E6E5] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                    Deliverable / AI Service
                  </label>
                  <select
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    className="w-full bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-xl px-3 py-2 text-xs text-[#37352F] dark:text-[#E6E6E5] outline-none"
                  >
                    <option value="WhatsApp Lead Qualification Bot">WhatsApp Lead Qualification Bot</option>
                    <option value="AI Voice Appointment Booking">AI Voice Appointment Booking</option>
                    <option value="Full AI CRM & Instant Lead Calling">Full AI CRM & Instant Lead Calling</option>
                    <option value="Custom Enterprise Automation">Custom Enterprise Automation</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-[#EDEDEB] dark:border-[#2E2E2E] flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddRetainerOpen(false)}
                    className="h-8 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmittingRetainer}
                    className="h-8 text-xs bg-[#37352F] hover:bg-[#262420] dark:bg-[#E6E6E5] dark:hover:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#191919]"
                  >
                    {isSubmittingRetainer ? "Saving..." : "Save Contract"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
