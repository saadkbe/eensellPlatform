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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useLanguage } from "@/components/landing/LanguageProvider";
import { cn } from "@/lib/utils";
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
  const { user } = useUser();
  const { t, dir, isRTL } = useLanguage();
  const firstName = user?.firstName || user?.fullName?.split(" ")[0] || "Founder";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("dash_greeting_morning");
    if (hour < 18) return t("dash_greeting_afternoon");
    return t("dash_greeting_evening");
  };

  // Real Database Retainers & Tasks
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
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
    try {
      await toggleTaskAction(id);
    } catch {
      toast.error("Error updating task");
    }
  };

  const handleDeleteTask = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteTaskAction(id);
      toast.info("Task removed");
    } catch {
      toast.error("Error removing task");
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
        toast.success(`Client retainer for "${newClientName}" registered!`);
      }
    } catch {
      toast.error("Could not save retainer");
    } finally {
      setIsSubmittingRetainer(false);
    }
  };

  const handleDeleteRetainer = async (id: string) => {
    if (!confirm(t("ws_confirm_delete_retainer"))) return;
    setRetainers((prev) => prev.filter((r) => r.id !== id));
    try {
      await deleteRetainerAction(id);
      toast.info("Retainer deleted");
    } catch {
      toast.error("Error deleting retainer");
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

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 select-text">
      {/* ── 1. Modern Luminous Executive Header ── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-amber-500/[0.04] via-white to-slate-50/70 p-6 sm:p-8 shadow-xs">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-24 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {t("ws_live_badge")}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                {t("ws_command_center_badge")}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {getGreeting()}, {firstName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {t("ws_header_desc")}
            </p>
          </div>

          {/* Quick Actions & API Shortcuts */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/workspace/settings"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200/90 shadow-2xs transition-all hover:scale-105"
            >
              <Key className="w-3.5 h-3.5 text-amber-500" />
              <span>{t("ws_btn_api_settings")}</span>
            </Link>

            <Link
              href="/workspace/scraper"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 shadow-2xs transition-all hover:scale-105"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>{t("ws_btn_scrape_leads")}</span>
            </Link>

            <button
              onClick={() => setIsAddRetainerOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary via-orange-500 to-amber-500 hover:opacity-95 text-white font-black text-xs shadow-md shadow-primary/20 transition-all hover:scale-105 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{t("ws_btn_add_retainer")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Four Vibrant Key Performance Widgets (Clean White Cards) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {/* Metric 1: Verified Monthly Cashflow (MRR) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
              {t("ws_kpi_mrr_label")}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-2xs">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-3xl font-black tracking-tight text-slate-900">
              {totalMRR.toLocaleString()}{" "}
              <span className="text-xs font-bold text-slate-500">{t("ws_kpi_mrr_unit")}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
              <span>{t("ws_kpi_target")}</span>
              <strong className="text-slate-800 font-bold">30,000 MAD</strong>
              <span>&bull;</span>
              <span className="text-emerald-600 font-bold">{progressPercent}%</span>
            </p>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
              <span className="font-bold text-slate-700">{retainers.filter((r) => r.status === "active").length} {t("ws_kpi_active_contracts")}</span>
              <span>{t("ws_kpi_pending_label")} {pendingMRR.toLocaleString()} MAD</span>
            </div>
          </div>
        </motion.div>

        {/* Metric 2: Scraped Leads & Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
              {t("ws_kpi_leads_label")}
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 shadow-2xs">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-3xl font-black tracking-tight text-slate-900">
              {stats?.totalLeads || 0}{" "}
              <span className="text-xs font-bold text-slate-500">{t("ws_kpi_leads_unit")}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {t("ws_kpi_leads_sub")}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link
              href="/workspace/scraper"
              className="text-blue-600 font-bold hover:underline flex items-center gap-1"
            >
              <span>{t("ws_btn_scrape_leads")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/workspace/crm" className="text-slate-500 hover:text-slate-800 font-medium">
              {t("ws_nav_crm")} &rarr;
            </Link>
          </div>
        </motion.div>

        {/* Metric 3: Client Retainers Count */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
              {t("ws_kpi_clients_label")}
            </span>
            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-200 shadow-2xs">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-3xl font-black tracking-tight text-slate-900">
              {retainers.length}{" "}
              <span className="text-xs font-bold text-slate-500">{t("ws_kpi_clients_unit")}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {t("ws_kpi_clients_sub")}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              {retainers.filter((r) => r.status === "active").length} {t("ws_kpi_active_contracts")}
            </span>
            <button
              onClick={() => setIsAddRetainerOpen(true)}
              className="text-violet-600 font-bold hover:underline cursor-pointer"
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
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
              {t("ws_kpi_velocity_label")}
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shadow-2xs">
              <Zap className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-3xl font-black tracking-tight text-slate-900">
              {stats?.sentEmails || 0}{" "}
              <span className="text-xs font-bold text-slate-500">{t("ws_kpi_velocity_unit")}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
              {t("ws_kpi_velocity_sub")}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link
              href="/workspace/whatsapp"
              className="text-amber-700 font-bold hover:underline flex items-center gap-1"
            >
              <span>{t("ws_nav_whatsapp")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/workspace/drafter" className="text-slate-500 hover:text-slate-800 font-medium">
              {t("ws_nav_drafter")} &rarr;
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── 3. Core Ecosystem Apps Launcher Grid (Branded Luxury Cards) ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>{t("ws_apps_title")}</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {t("ws_apps_subtitle")}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* App 1: Google Maps Scraper */}
          <Link
            href="/workspace/scraper"
            className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base border border-blue-200 shadow-2xs group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                {t("ws_app_tag_leadgen")}
              </span>
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
              <span>{t("ws_nav_scraper")}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {t("ws_app_scraper_desc")}
            </p>
          </Link>

          {/* App 2: WhatsApp Outreach */}
          <Link
            href="/workspace/whatsapp"
            className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-400 hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-base border border-emerald-200 shadow-2xs group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                {t("ws_app_tag_messaging")}
              </span>
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors flex items-center gap-1.5">
              <span>{t("ws_nav_whatsapp")}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {t("ws_app_whatsapp_desc")}
            </p>
          </Link>

          {/* App 3: Cold Email Drafter */}
          <Link
            href="/workspace/drafter"
            className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-violet-400 hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-base border border-violet-200 shadow-2xs group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 border border-violet-200">
                {t("ws_app_tag_ai_copy")}
              </span>
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-violet-600 transition-colors flex items-center gap-1.5">
              <span>{t("ws_nav_drafter")}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {t("ws_app_drafter_desc")}
            </p>
          </Link>

          {/* App 4: Client Pipeline CRM */}
          <Link
            href="/workspace/crm"
            className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-400 hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-base border border-amber-200 shadow-2xs group-hover:scale-110 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                {t("ws_app_tag_pipeline")}
              </span>
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-amber-600 transition-colors flex items-center gap-1.5">
              <span>{t("ws_nav_crm")}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {t("ws_app_crm_desc")}
            </p>
          </Link>

          {/* App 5: Instant Invoice Generator */}
          <Link
            href="/workspace/invoices"
            className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-teal-400 hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-base border border-teal-200 shadow-2xs group-hover:scale-110 transition-transform">
                <Receipt className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
                {t("ws_app_tag_finance")}
              </span>
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-teal-600 transition-colors flex items-center gap-1.5">
              <span>{t("ws_nav_invoices")}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {t("ws_app_invoices_desc")}
            </p>
          </Link>

          {/* App 6: Agency Notes & Blueprints */}
          <Link
            href="/workspace/notes"
            className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-400 hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-base border border-slate-200 shadow-2xs group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                {t("ws_app_tag_knowledge")}
              </span>
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-primary transition-colors flex items-center gap-1.5">
              <span>{t("ws_nav_notes")}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {t("ws_app_notes_desc")}
            </p>
          </Link>
        </div>
      </div>

      {/* ── 4. Main 2-Column Responsive Workspace Layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 w-full items-start">
        {/* Left Column: Client Retainers & Contracts */}
        <div className="xl:col-span-8 space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <span>{t("ws_retainers_title")}</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {retainers.length}
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t("ws_retainers_subtitle")}
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => setIsAddRetainerOpen(true)}
                className="h-8 text-xs font-bold bg-primary hover:bg-primary/90 text-white shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                {t("ws_btn_add_retainer")}
              </Button>
            </div>

            {/* Retainers List or Clean Empty State */}
            {retainers.length === 0 ? (
              <div className="py-12 px-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 mx-auto flex items-center justify-center text-xl shadow-2xs">
                  💼
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">
                    {t("ws_retainers_empty_title")}
                  </p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {t("ws_retainers_empty_desc")}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setIsAddRetainerOpen(true)}
                  className="h-8 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  {t("ws_btn_add_first_retainer")}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {retainers.map((client) => (
                    <motion.div
                      key={client.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="p-4 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          {client.clientName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-extrabold text-sm text-slate-900 truncate">
                            {client.clientName}
                          </div>
                          <div className="text-xs text-slate-500 truncate flex items-center gap-2 mt-0.5">
                            <span>{client.contactPerson || client.clientName}</span>
                            <span>&bull;</span>
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                              {client.service}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <div className="text-right">
                          <div className="font-black text-sm text-slate-900">
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
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs hover:opacity-85 transition-opacity">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {t("ws_status_active")}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs hover:opacity-85 transition-opacity">
                              <Clock className="w-3 h-3 text-amber-500" />
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
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-all"
                              title="WhatsApp"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <Link
                            href={`/workspace/invoices?client=${encodeURIComponent(client.clientName)}&fee=${client.monthlyFee}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all"
                            title={t("ws_nav_invoices")}
                          >
                            <Receipt className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => handleDeleteRetainer(client.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
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

        {/* Right Column: Daily Priorities & API Readiness */}
        <div className="xl:col-span-4 space-y-6">
          {/* Card 1: Daily Acquisition Priorities */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-emerald-600" />
                  <span>{t("ws_tasks_title")}</span>
                </h3>
                <span className="text-xs text-slate-500">
                  {completedTasksCount} / {tasks.length} {t("ws_tasks_completed_count")}
                </span>
              </div>
              {tasks.length > 0 && (
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                  {Math.round((completedTasksCount / tasks.length) * 100)}%
                </span>
              )}
            </div>

            {/* Tasks list */}
            {tasks.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center italic">
                {t("ws_tasks_empty")}
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
                      className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-start gap-2.5 cursor-pointer group select-none shadow-2xs"
                    >
                      {task.done ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 group-hover:text-slate-800 shrink-0 mt-0.5" />
                      )}

                      <div className="flex-1 min-w-0">
                        <span
                          className={`text-xs block leading-relaxed font-medium ${
                            task.done
                              ? "line-through text-slate-400"
                              : "text-slate-800"
                          }`}
                        >
                          {task.text}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleDeleteTask(task.id, e)}
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
            <form onSubmit={handleAddTask} className="pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder={t("ws_task_input_placeholder")}
                  className="flex-1 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-800 transition-colors"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isAddingTask || !newTaskText.trim()}
                  className="h-8 px-3 text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer disabled:opacity-40"
                >
                  {t("ws_btn_add_task")}
                </Button>
              </div>
            </form>
          </div>

          {/* Card 2: API & System Readiness */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t("ws_health_title")}</span>
              </h3>
              <Link
                href="/workspace/settings"
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>{t("ws_health_manage_keys")}</span>
                <ChevronRight className={cn("w-3.5 h-3.5", isRTL && "rotate-180")} />
              </Link>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              {t("ws_health_subtitle")}
            </p>

            <div className="space-y-2 pt-1 text-xs">
              {/* OpenAI GPT-4o */}
              <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/70 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">🤖</span>
                  <span className="font-bold text-slate-800">{t("ws_health_openai")}</span>
                </div>
                {account?.hasOpenAI ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {t("ws_health_operational")}
                  </span>
                ) : (
                  <Link
                    href="/workspace/settings"
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    {t("ws_health_not_configured")}
                  </Link>
                )}
              </div>

              {/* Outscraper Google Maps */}
              <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/70 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">📍</span>
                  <span className="font-bold text-slate-800">{t("ws_health_outscraper")}</span>
                </div>
                {account?.hasOutscraper ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {t("ws_health_operational")}
                  </span>
                ) : (
                  <Link
                    href="/workspace/settings"
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    {t("ws_health_not_configured")}
                  </Link>
                )}
              </div>

              {/* Gmail SMTP */}
              <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/70 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">✉️</span>
                  <span className="font-bold text-slate-800">{t("ws_health_gmail")}</span>
                </div>
                {account?.isGmailConnected ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {t("ws_health_operational")}
                  </span>
                ) : (
                  <Link
                    href="/workspace/settings"
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    {t("ws_health_inactive")}
                  </Link>
                )}
              </div>

              {/* ElevenLabs Voice */}
              <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/70 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">🎙️</span>
                  <span className="font-bold text-slate-800">{t("ws_health_elevenlabs")}</span>
                </div>
                {account?.hasElevenLabs ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {t("ws_health_operational")}
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 font-medium">{t("ws_health_not_configured")}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. Add Retainer Modal (Crisp White Dialog) ── */}
      <AnimatePresence>
        {isAddRetainerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 space-y-5 text-slate-900"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-base shadow-2xs">
                    💰
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                      {t("ws_modal_title")}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {t("ws_modal_subtitle")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddRetainerOpen(false)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateRetainer} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    {t("ws_modal_client_name")} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t("ws_modal_client_placeholder")}
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-slate-800 shadow-2xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      {t("ws_modal_contact_person")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("ws_modal_contact_placeholder")}
                      value={newContactPerson}
                      onChange={(e) => setNewContactPerson(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none shadow-2xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      {t("ws_modal_city_label")}
                    </label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      placeholder={t("ws_modal_city_placeholder")}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      {t("ws_modal_fee_label")} *
                    </label>
                    <input
                      type="number"
                      required
                      value={newFee}
                      onChange={(e) => setNewFee(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none font-extrabold shadow-2xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      {t("ws_modal_phone_label")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("ws_modal_phone_placeholder")}
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none shadow-2xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    {t("ws_modal_service_type")}
                  </label>
                  <select
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none shadow-2xs"
                  >
                    <option value="WhatsApp Lead Qualification Bot">{t("ws_modal_service_whatsapp")}</option>
                    <option value="AI Voice Appointment Booking">{t("ws_modal_service_voice")}</option>
                    <option value="Full AI CRM & Instant Lead Calling">{t("ws_modal_service_crm")}</option>
                    <option value="Custom Enterprise Automation">{t("ws_modal_service_custom")}</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddRetainerOpen(false)}
                    className="h-9 px-4 text-xs font-bold text-slate-600"
                  >
                    {t("ws_modal_cancel")}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmittingRetainer}
                    className="h-9 px-5 text-xs font-black bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
                  >
                    {isSubmittingRetainer ? t("ws_modal_saving") : t("ws_modal_save")}
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
