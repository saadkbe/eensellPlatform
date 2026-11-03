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
  Sparkles,
  Target,
  Key,
  ShieldCheck,
  Clock,
  Phone,
  Receipt,
  Zap,
  CheckCircle2,
  Building2,
  MessageSquare,
  Mail,
  FileSpreadsheet,
  FileText,
  Activity,
  ArrowUpRight,
  ChevronRight,
  Loader2,
  Search,
  ExternalLink,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useLanguage } from "@/components/landing/LanguageProvider";
import { cn } from "@/lib/utils";
import { DeleteConfirmationModal } from "@/components/workspace/delete-confirmation-modal";
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
      totalMRR: number;
      pendingMRR: number;
    };
    retainers: any[];
    tasks: any[];
    campaigns: any[];
    recentLeads: any[];
    savedMessages: any[];
    debriefText: string;
  } | null;
}

export function WorkspaceDashboardClient({ initialData }: WorkspaceDashboardProps) {
  const { user } = useUser();
  const { t, isRTL } = useLanguage();
  const firstName = user?.firstName || "Founder";

  const [retainers, setRetainers] = useState<any[]>(initialData?.retainers || []);
  const [tasks, setTasks] = useState<any[]>(initialData?.tasks || []);
  const [isAddRetainerOpen, setIsAddRetainerOpen] = useState(false);
  const [isSubmittingRetainer, setIsSubmittingRetainer] = useState(false);

  // New Retainer Form State
  const [newClientName, setNewClientName] = useState("");
  const [newContactPerson, setNewContactPerson] = useState("");
  const [newService, setNewService] = useState("WhatsApp Lead Qualification Bot");
  const [newFee, setNewFee] = useState("5000");
  const [newCity, setNewCity] = useState("Casablanca");
  const [newPhone, setNewPhone] = useState("");

  // New Task state
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("outreach");
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Deletion modals state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "retainer" | "task";
    id: string;
    name: string;
  } | null>(null);

  // Calculate live financial metrics
  const totalMRR = retainers
    .filter((r) => r.status === "active")
    .reduce((sum, r) => sum + (Number(r.monthlyFee) || 0), 0);

  const pendingMRR = retainers
    .filter((r) => r.status === "pending_payment")
    .reduce((sum, r) => sum + (Number(r.monthlyFee) || 0), 0);

  const activeRetainersCount = retainers.filter((r) => r.status === "active").length;
  const completedTasksCount = tasks.filter((t) => t.done).length;

  const account = initialData?.account;
  const stats = initialData?.stats;

  // Handlers with Real DB Persistence
  const handleToggleTask = async (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
    try {
      await toggleTaskAction(id);
    } catch {
      toast.error("Error updating task");
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
        toast.success("Priority added!");
      }
    } catch {
      toast.error("Could not save task");
    } finally {
      setIsAddingTask(false);
    }
  };

  const handleCreateRetainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    setIsSubmittingRetainer(true);
    try {
      const res = await createRetainerAction({
        clientName: newClientName,
        contactPerson: newContactPerson,
        service: newService,
        monthlyFee: Number(newFee) || 5000,
        city: newCity,
        phone: newPhone,
        status: "active",
      });

      if (res.success && res.retainer) {
        setRetainers((prev) => [res.retainer, ...prev]);
        setIsAddRetainerOpen(false);
        setNewClientName("");
        setNewContactPerson("");
        setNewFee("5000");
        toast.success(`Client retainer for "${newClientName}" registered!`);
      }
    } catch {
      toast.error("Could not save retainer");
    } finally {
      setIsSubmittingRetainer(false);
    }
  };

  const handleToggleRetainerStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "pending_payment" : "active";
    setRetainers((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    try {
      await updateRetainerStatusAction(id, newStatus);
      toast.success(newStatus === "active" ? "Retainer marked Active" : "Retainer marked Pending Payment");
    } catch {
      toast.error("Error updating status");
    }
  };

  const requestDeleteRetainer = (client: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDeleteTarget({
      type: "retainer",
      id: client.id,
      name: client.clientName,
    });
    setDeleteModalOpen(true);
  };

  const requestDeleteTask = (task: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDeleteTarget({
      type: "task",
      id: task.id,
      name: task.text,
    });
    setDeleteModalOpen(true);
  };

  const confirmDeleteTarget = async () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === "retainer") {
      setRetainers((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      try {
        await deleteRetainerAction(deleteTarget.id);
        toast.success("Retainer removed successfully");
      } catch {
        toast.error("Error deleting retainer");
      }
    } else if (deleteTarget.type === "task") {
      setTasks((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      try {
        await deleteTaskAction(deleteTarget.id);
        toast.success("Priority removed");
      } catch {
        toast.error("Error removing priority");
      }
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="w-full px-3 sm:px-5 lg:px-6 py-4 sm:py-5 space-y-6 select-text">
      {/* ── 1. Executive Clean Hero Banner (No Orange Gradient, Crisp Premium Dark/Light) ── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#1C1C1E] p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {t("ws_live_badge")}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/10">
                <Activity className="w-3.5 h-3.5 text-slate-500" />
                {t("ws_command_center_badge")}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {getGreeting()}, {firstName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              {t("ws_header_desc")}
            </p>
          </div>

          {/* Quick Actions (Monochrome & Solid Dark/Light Buttons — No Orange Gradients) */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href="/workspace/settings"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200/90 dark:border-white/10 transition-all cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-slate-500" />
              <span>{t("ws_btn_api_settings")}</span>
            </Link>

            <Link
              href="/workspace/scraper"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200/90 dark:border-white/10 transition-all cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{t("ws_btn_scrape_leads")}</span>
            </Link>

            <button
              onClick={() => setIsAddRetainerOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{t("ws_btn_add_retainer")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Four Interactive KPI Metric Widgets ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {/* Metric 1: Verified Monthly Cashflow (MRR) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-slate-200/90 dark:border-white/10 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t("ws_kpi_mrr_label")}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/80 dark:border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-baseline gap-1.5">
              <span>{totalMRR.toLocaleString()}</span>
              <span className="text-xs font-semibold text-slate-400">{t("ws_kpi_mrr_unit")}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{activeRetainersCount} active recurring client{activeRetainersCount !== 1 ? "s" : ""}</span>
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">
              Pending: <strong className="text-slate-700 dark:text-slate-300 font-bold">{pendingMRR.toLocaleString()} MAD</strong>
            </span>
            <button
              onClick={() => setIsAddRetainerOpen(true)}
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer text-[11px]"
            >
              + Add
            </button>
          </div>
        </motion.div>

        {/* Metric 2: Scraped Leads & Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-slate-200/90 dark:border-white/10 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t("ws_kpi_leads_label")}
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200/80 dark:border-blue-500/20">
              <MapPin className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-baseline gap-1.5">
              <span>{stats?.totalLeads || 0}</span>
              <span className="text-xs font-semibold text-slate-400">{t("ws_kpi_leads_unit")}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>{stats?.meetingsBooked || 0} meeting{stats?.meetingsBooked !== 1 ? "s" : ""} booked</span>
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
            <Link
              href="/workspace/scraper"
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 text-[11px]"
            >
              <span>{t("ws_btn_scrape_leads")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/workspace/crm" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium text-[11px]">
              CRM &rarr;
            </Link>
          </div>
        </motion.div>

        {/* Metric 3: Active Agency Clients */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-slate-200/90 dark:border-white/10 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t("ws_kpi_clients_label")}
            </span>
            <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-violet-200/80 dark:border-violet-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-baseline gap-1.5">
              <span>{retainers.length}</span>
              <span className="text-xs font-semibold text-slate-400">{t("ws_kpi_clients_unit")}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-500" />
              <span>{activeRetainersCount} active &bull; {retainers.length - activeRetainersCount} pending</span>
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">
              {activeRetainersCount} {t("ws_kpi_active_contracts")}
            </span>
            <button
              onClick={() => setIsAddRetainerOpen(true)}
              className="text-violet-600 dark:text-violet-400 font-semibold hover:underline cursor-pointer text-[11px]"
            >
              + {t("ws_btn_add_retainer")}
            </button>
          </div>
        </motion.div>

        {/* Metric 4: Outreach & Response Velocity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-slate-200/90 dark:border-white/10 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t("ws_kpi_velocity_label")}
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 flex items-center justify-center border border-slate-200/80 dark:border-white/10">
              <Zap className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-baseline gap-1.5">
              <span>{stats?.sentEmails || 0}</span>
              <span className="text-xs font-semibold text-slate-400">{t("ws_kpi_velocity_unit")}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-500" />
              <span>{stats?.replies || 0} positive replies recorded</span>
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
            <Link
              href="/workspace/whatsapp"
              className="text-slate-800 dark:text-slate-200 font-semibold hover:underline flex items-center gap-1 text-[11px]"
            >
              <span>{t("ws_nav_whatsapp")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/workspace/drafter" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium text-[11px]">
              {t("ws_nav_drafter")} &rarr;
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── 3. Core Ecosystem Apps Launcher Grid ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>{t("ws_apps_title")}</span>
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {t("ws_apps_subtitle")}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* App 1: Google Maps Scraper */}
          <Link
            href="/workspace/scraper"
            className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-slate-200/90 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30 hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-base border border-blue-200/80 dark:border-blue-500/20 group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200/80 dark:border-blue-500/20">
                {t("ws_app_tag_leadgen")}
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
              <span>{t("ws_nav_scraper")}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {t("ws_app_scraper_desc")}
            </p>
          </Link>

          {/* App 2: WhatsApp Outreach */}
          <Link
            href="/workspace/whatsapp"
            className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-slate-200/90 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30 hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-base border border-emerald-200/80 dark:border-emerald-500/20 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-500/20">
                {t("ws_app_tag_messaging")}
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <span>{t("ws_nav_whatsapp")}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {t("ws_app_whatsapp_desc")}
            </p>
          </Link>

          {/* App 3: AI Drafter */}
          <Link
            href="/workspace/drafter"
            className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-slate-200/90 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30 hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold text-base border border-slate-200/80 dark:border-white/10 group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/10">
                {t("ws_app_tag_ai_copy")}
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-white transition-colors flex items-center gap-1.5">
              <span>{t("ws_nav_drafter")}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {t("ws_app_drafter_desc")}
            </p>
          </Link>

          {/* App 4: CRM Pipeline */}
          <Link
            href="/workspace/crm"
            className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-slate-200/90 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30 hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold text-base border border-violet-200/80 dark:border-violet-500/20 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-200/80 dark:border-violet-500/20">
                {t("ws_app_tag_pipeline")}
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors flex items-center gap-1.5">
              <span>{t("ws_nav_crm")}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {t("ws_app_crm_desc")}
            </p>
          </Link>

          {/* App 5: Agency Invoices */}
          <Link
            href="/workspace/invoices"
            className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-slate-200/90 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30 hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-base border border-teal-200/80 dark:border-teal-500/20 group-hover:scale-105 transition-transform">
                <Receipt className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-200/80 dark:border-teal-500/20">
                {t("ws_app_tag_finance")}
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors flex items-center gap-1.5">
              <span>{t("ws_nav_invoices")}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {t("ws_app_invoices_desc")}
            </p>
          </Link>

          {/* App 6: Notes & Playbooks */}
          <Link
            href="/workspace/notes"
            className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-slate-200/90 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30 hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-base border border-slate-200/80 dark:border-white/10 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/10">
                {t("ws_app_tag_knowledge")}
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-white transition-colors flex items-center gap-1.5">
              <span>{t("ws_nav_notes")}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {t("ws_app_notes_desc")}
            </p>
          </Link>
        </div>
      </div>

      {/* ── 4. Main Two-Column Split (Live Retainers Feed + Priorities / Health) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Retainers Table (8 cols) */}
        <div className="xl:col-span-8 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-slate-200/90 dark:border-white/10 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/10">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{t("ws_retainers_title")}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t("ws_retainers_subtitle")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsAddRetainerOpen(true)}
                  size="sm"
                  className="h-8 px-3 text-xs bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold rounded-xl cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>{t("ws_btn_add_retainer")}</span>
                </Button>
              </div>
            </div>

            {/* Retainers List Feed */}
            {retainers.length === 0 ? (
              <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-slate-200 dark:border-white/10 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 mx-auto flex items-center justify-center text-xl">
                  💼
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {t("ws_retainers_empty_title")}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    {t("ws_retainers_empty_desc")}
                  </p>
                </div>
                <Button
                  onClick={() => setIsAddRetainerOpen(true)}
                  size="sm"
                  className="h-8 px-4 text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl"
                >
                  {t("ws_btn_add_first_retainer")}
                </Button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <AnimatePresence>
                  {retainers.map((client) => (
                    <motion.div
                      key={client.id}
                      layout
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-4 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/8 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      <div className="flex items-start sm:items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 border border-slate-200/80 dark:border-white/10 flex items-center justify-center font-bold text-sm text-slate-700 dark:text-slate-200 shrink-0 shadow-2xs">
                          {client.clientName.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                            {client.clientName}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex-wrap">
                            {client.city && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {client.city}
                              </span>
                            )}
                            <span>&bull;</span>
                            <span className="truncate max-w-[200px]">
                              {client.service}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <div className="text-right">
                          <div className="font-black text-sm text-slate-900 dark:text-white">
                            {Number(client.monthlyFee).toLocaleString()} MAD
                            <span className="text-xs text-slate-500 font-normal"> / mo</span>
                          </div>
                        </div>

                        {/* Status Toggle Pill */}
                        <button
                          onClick={() => handleToggleRetainerStatus(client.id, client.status)}
                          className="cursor-pointer"
                          title="Click to toggle status"
                        >
                          {client.status === "active" ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 shadow-2xs hover:opacity-85 transition-opacity">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {t("ws_status_active")}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 shadow-2xs hover:opacity-85 transition-opacity">
                              <Clock className="w-3 h-3 text-slate-500" />
                              {t("ws_status_pending")}
                            </span>
                          )}
                        </button>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          {client.phone && (
                            <a
                              href={`https://wa.me/${client.phone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all"
                              title="WhatsApp"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <Link
                            href={`/workspace/invoices?client=${encodeURIComponent(client.clientName)}&fee=${client.monthlyFee}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"
                            title={t("ws_nav_invoices")}
                          >
                            <Receipt className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={(e) => requestDeleteRetainer(client, e)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all cursor-pointer"
                            title={t("ws_btn_delete")}
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
        </div>

        {/* Right Column: Daily Priorities & Health Check (4 cols) */}
        <div className="xl:col-span-4 space-y-6">
          {/* Card 1: Daily Acquisition Priorities */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-slate-200/90 dark:border-white/10 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{t("ws_tasks_title")}</span>
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {completedTasksCount} / {tasks.length} {t("ws_tasks_completed_count")}
                </span>
              </div>
              {tasks.length > 0 && (
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  {Math.round((completedTasksCount / tasks.length) * 100)}%
                </span>
              )}
            </div>

            {/* Tasks list */}
            {tasks.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-3 text-center italic">
                {t("ws_tasks_empty")}
              </p>
            ) : (
              <div className="space-y-2">
                <AnimatePresence>
                  {tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => handleToggleTask(task.id)}
                      className="p-3 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-start gap-2.5 cursor-pointer group select-none shadow-2xs"
                    >
                      {task.done ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white shrink-0 mt-0.5" />
                      )}

                      <div className="flex-1 min-w-0">
                        <span
                          className={`text-xs block leading-relaxed font-medium ${
                            task.done
                              ? "line-through text-slate-400"
                              : "text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          {task.text}
                        </span>
                      </div>

                      <button
                        onClick={(e) => requestDeleteTask(task, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity"
                        title={t("ws_btn_delete")}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Quick Add Task Input */}
            <form onSubmit={handleAddTask} className="pt-2 border-t border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder={t("ws_task_input_placeholder")}
                  className="flex-1 bg-slate-50 dark:bg-white/5 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-slate-800 dark:focus:border-white transition-colors"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isAddingTask || !newTaskText.trim()}
                  className="h-8 px-3 text-xs bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold cursor-pointer disabled:opacity-40 rounded-xl"
                >
                  {isAddingTask ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : t("ws_btn_add_task")}
                </Button>
              </div>
            </form>
          </div>

          {/* Card 2: API & System Readiness */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-slate-200/90 dark:border-white/10 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t("ws_health_title")}</span>
              </h3>
              <Link
                href="/workspace/settings"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:underline flex items-center gap-1"
              >
                <span>{t("ws_health_manage_keys")}</span>
                <ChevronRight className={cn("w-3.5 h-3.5", isRTL && "rotate-180")} />
              </Link>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              {t("ws_health_subtitle")}
            </p>

            <div className="space-y-2 pt-1 text-xs">
              {/* OpenAI GPT-4o */}
              <div className="p-3 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">🤖</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{t("ws_health_openai")}</span>
                </div>
                {account?.hasOpenAI ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {t("ws_health_operational")}
                  </span>
                ) : (
                  <Link
                    href="/workspace/settings"
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {t("ws_health_not_configured")}
                  </Link>
                )}
              </div>

              {/* Outscraper Google Maps */}
              <div className="p-3 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">📍</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{t("ws_health_outscraper")}</span>
                </div>
                {account?.hasOutscraper ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {t("ws_health_operational")}
                  </span>
                ) : (
                  <Link
                    href="/workspace/settings"
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {t("ws_health_not_configured")}
                  </Link>
                )}
              </div>

              {/* Gmail SMTP */}
              <div className="p-3 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">✉️</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{t("ws_health_gmail")}</span>
                </div>
                {account?.isGmailConnected ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {t("ws_health_operational")}
                  </span>
                ) : (
                  <Link
                    href="/workspace/settings"
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {t("ws_health_inactive")}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. Add Retainer Modal (Clean White/Dark Dialog) ── */}
      <AnimatePresence>
        {isAddRetainerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#1C1C1E] border border-slate-200/90 dark:border-white/10 shadow-2xl p-6 space-y-5 text-slate-900 dark:text-white"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-500/20 flex items-center justify-center font-bold text-base shadow-2xs">
                    💰
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {t("ws_modal_title")}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t("ws_modal_subtitle")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddRetainerOpen(false)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateRetainer} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t("ws_modal_client_name")} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t("ws_modal_client_placeholder")}
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-slate-800 dark:focus:border-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t("ws_modal_contact_person")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("ws_modal_contact_placeholder")}
                      value={newContactPerson}
                      onChange={(e) => setNewContactPerson(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t("ws_modal_city_label")}
                    </label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      placeholder={t("ws_modal_city_placeholder")}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t("ws_modal_fee_label")} *
                    </label>
                    <input
                      type="number"
                      required
                      value={newFee}
                      onChange={(e) => setNewFee(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t("ws_modal_phone_label")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("ws_modal_phone_placeholder")}
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t("ws_modal_service_type")}
                  </label>
                  <select
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none"
                  >
                    <option value="WhatsApp Lead Qualification Bot">{t("ws_modal_service_whatsapp")}</option>
                    <option value="AI Voice Appointment Booking">{t("ws_modal_service_voice")}</option>
                    <option value="Full AI CRM & Instant Lead Calling">{t("ws_modal_service_crm")}</option>
                    <option value="Custom Enterprise Automation">{t("ws_modal_service_custom")}</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex justify-end gap-2.5">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsAddRetainerOpen(false)}
                    className="h-9 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400"
                  >
                    {t("ws_modal_cancel")}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmittingRetainer}
                    className="h-9 px-5 text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 shadow-sm"
                  >
                    {isSubmittingRetainer ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                        <span>{t("ws_modal_saving")}</span>
                      </>
                    ) : (
                      t("ws_modal_save")
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 6. Unified Modern Deletion Confirmation Modal ── */}
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title={deleteTarget?.type === "retainer" ? "Delete Client Retainer?" : "Remove Priority Task?"}
        description={
          deleteTarget?.type === "retainer"
            ? "Are you sure you want to delete this retainer contract? Your monthly MRR will update immediately."
            : "Are you sure you want to remove this daily priority from your list?"
        }
        itemName={deleteTarget?.name}
        onConfirm={confirmDeleteTarget}
      />
    </div>
  );
}
