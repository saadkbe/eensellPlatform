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
  const firstName = user?.firstName || user?.fullName?.split(" ")[0] || "Agency Founder";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
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
    if (!confirm("Are you sure you want to delete this client retainer?")) return;
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
                Eensell Workspace OS &bull; Live
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                Agency Command Center
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {getGreeting()}, {firstName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Autonomous agency execution suite: B2B lead scraping, WhatsApp outreach, AI cold email drafting, CRM deal flow, and client retainer cashflow.
            </p>
          </div>

          {/* Quick Actions & API Shortcuts */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/workspace/settings"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200/90 shadow-2xs transition-all hover:scale-105"
            >
              <Key className="w-3.5 h-3.5 text-amber-500" />
              <span>API Settings</span>
            </Link>

            <Link
              href="/workspace/scraper"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 shadow-2xs transition-all hover:scale-105"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Scrape Leads</span>
            </Link>

            <button
              onClick={() => setIsAddRetainerOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary via-orange-500 to-amber-500 hover:opacity-95 text-white font-black text-xs shadow-md shadow-primary/20 transition-all hover:scale-105 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Retainer</span>
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
              Monthly Cashflow (MRR)
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-2xs">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-3xl font-black tracking-tight text-slate-900">
              {totalMRR.toLocaleString()}{" "}
              <span className="text-xs font-bold text-slate-500">MAD / mo</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
              <span>Target:</span>
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
              <span className="font-bold text-slate-700">{retainers.filter((r) => r.status === "active").length} Active contracts</span>
              <span>Pending: {pendingMRR.toLocaleString()} MAD</span>
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
              Prospects Database
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 shadow-2xs">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-3xl font-black tracking-tight text-slate-900">
              {stats?.totalLeads || 0}{" "}
              <span className="text-xs font-bold text-slate-500">Leads</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Ready for cold WhatsApp & email outreach
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link
              href="/workspace/scraper"
              className="text-blue-600 font-bold hover:underline flex items-center gap-1"
            >
              <span>Scrape Maps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/workspace/crm" className="text-slate-500 hover:text-slate-800 font-medium">
              Open CRM &rarr;
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
              Active Client Accounts
            </span>
            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-200 shadow-2xs">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-3xl font-black tracking-tight text-slate-900">
              {retainers.length}{" "}
              <span className="text-xs font-bold text-slate-500">Accounts</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {retainers.length === 0
                ? "No clients registered yet"
                : `Avg. ${Math.round(totalMRR / (retainers.length || 1)).toLocaleString()} MAD / account`}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              {retainers.filter((r) => r.status === "active").length} active billings
            </span>
            <button
              onClick={() => setIsAddRetainerOpen(true)}
              className="text-violet-600 font-bold hover:underline cursor-pointer"
            >
              + Add Client
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
              Outreach Velocity
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shadow-2xs">
              <Zap className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-3xl font-black tracking-tight text-slate-900">
              {stats?.sentEmails || 0}{" "}
              <span className="text-xs font-bold text-slate-500">Sent</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
              <span>Replies:</span>
              <strong className="text-amber-700 font-bold">{stats?.replies || 0}</strong>
              <span>&bull;</span>
              <span>Calls:</span>
              <strong className="text-slate-800 font-bold">{stats?.meetingsBooked || 0}</strong>
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link
              href="/workspace/whatsapp"
              className="text-amber-700 font-bold hover:underline flex items-center gap-1"
            >
              <span>WhatsApp Suite</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/workspace/drafter" className="text-slate-500 hover:text-slate-800 font-medium">
              Email Drafter &rarr;
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── 3. Core Ecosystem Apps Launcher Grid (Branded Luxury Cards) ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Workspace Growth Engines</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Integrated Agency Tools
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
                Outscraper API
              </span>
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
              <span>Google Maps B2B Scraper</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Extract verified business owners, phone numbers, addresses, and websites from any city in seconds.
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
                iPhone 18 Pro Frame
              </span>
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors flex items-center gap-1.5">
              <span>WhatsApp Outreach Suite</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              High-converting Darija & French voice scripts, WhatsApp direct hooks, and simulated client previews.
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
                GPT-4o Powered
              </span>
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-violet-600 transition-colors flex items-center gap-1.5">
              <span>AI Cold Email Drafter</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Generate personalized client pitches with automated subject line scoring, spam check, and Gmail SMTP dispatch.
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
                Kanban Deal Flow
              </span>
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-amber-600 transition-colors flex items-center gap-1.5">
              <span>Agency CRM Pipeline</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Manage client pipeline stages: Scraped, Contacted, WhatsApp Replied, Demo Booked, and Retainer Closed.
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
                PDF & MAD / USD
              </span>
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-teal-600 transition-colors flex items-center gap-1.5">
              <span>Instant Invoicing Engine</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Create professional branded invoices and payment receipts for your local or international client retainers.
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
                Notepad & Blueprints
              </span>
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-primary transition-colors flex items-center gap-1.5">
              <span>Agency Scratchpad & Notes</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Store client scope of work, Make.com blueprint notes, and objection handling scripts in one secure location.
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
                  <span>Client Retainers & Active Cashflow</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {retainers.length}
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Monthly recurring services, client deliverables, and payment collection tracking.
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => setIsAddRetainerOpen(true)}
                className="h-8 text-xs font-bold bg-primary hover:bg-primary/90 text-white shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Retainer
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
                    No client retainers registered yet
                  </p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Close a client or register a current project to begin tracking your monthly recurring cashflow.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setIsAddRetainerOpen(true)}
                  className="h-8 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Register First Client
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
                            <span>{client.contactPerson || "Lead Contact"}</span>
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
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs hover:opacity-85 transition-opacity">
                              <Clock className="w-3 h-3 text-amber-500" />
                              Pending
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
                              title="Chat on WhatsApp"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <Link
                            href={`/workspace/invoices?client=${encodeURIComponent(client.clientName)}&fee=${client.monthlyFee}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all"
                            title="Generate Invoice"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => handleDeleteRetainer(client.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
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
        </div>

        {/* Right Column: Daily Priorities & API Readiness */}
        <div className="xl:col-span-4 space-y-6">
          {/* Card 1: Daily Acquisition Priorities */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-emerald-600" />
                  <span>Daily Priorities</span>
                </h3>
                <span className="text-xs text-slate-500">
                  {completedTasksCount} of {tasks.length} completed
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
                All daily priorities completed! Add your next high-leverage task below.
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
            <form onSubmit={handleAddTask} className="pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="+ Add priority (press Enter)..."
                  className="flex-1 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-800 transition-colors"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isAddingTask || !newTaskText.trim()}
                  className="h-8 px-3 text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer disabled:opacity-40"
                >
                  Add
                </Button>
              </div>
            </form>
          </div>

          {/* Card 2: API & System Readiness */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>API & System Health</span>
              </h3>
              <Link
                href="/workspace/settings"
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>Settings</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Connect API keys to enable autonomous scraping, AI copywriting, and live email dispatch.
            </p>

            <div className="space-y-2 pt-1 text-xs">
              {/* OpenAI GPT-4o */}
              <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/70 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">🤖</span>
                  <span className="font-bold text-slate-800">OpenAI GPT-4o</span>
                </div>
                {account?.hasOpenAI ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Connected
                  </span>
                ) : (
                  <Link
                    href="/workspace/settings"
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Add Key
                  </Link>
                )}
              </div>

              {/* Outscraper Google Maps */}
              <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/70 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">📍</span>
                  <span className="font-bold text-slate-800">Outscraper Maps</span>
                </div>
                {account?.hasOutscraper ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Connected
                  </span>
                ) : (
                  <Link
                    href="/workspace/settings"
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Add Key
                  </Link>
                )}
              </div>

              {/* Gmail SMTP */}
              <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/70 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">✉️</span>
                  <span className="font-bold text-slate-800">Gmail Dispatch</span>
                </div>
                {account?.isGmailConnected ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Connected
                  </span>
                ) : (
                  <Link
                    href="/workspace/settings"
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Connect SMTP
                  </Link>
                )}
              </div>

              {/* ElevenLabs Voice */}
              <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/70 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">🎙️</span>
                  <span className="font-bold text-slate-800">ElevenLabs Voice</span>
                </div>
                {account?.hasElevenLabs ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Connected
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 font-medium">Native Audio</span>
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
                      Register Client Retainer
                    </h3>
                    <p className="text-xs text-slate-500">
                      Saved directly to your database to track recurring cashflow.
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
                    Company / Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prestige Real Estate, Cabinet Dr. Smith..."
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-slate-800 shadow-2xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Founder, Marketing Director"
                      value={newContactPerson}
                      onChange={(e) => setNewContactPerson(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none shadow-2xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      City
                    </label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      placeholder="Casablanca, Paris, Dubai..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Monthly Retainer (MAD) *
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
                      Phone / WhatsApp
                    </label>
                    <input
                      type="text"
                      placeholder="+212 ..."
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none shadow-2xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Deliverable / AI Service
                  </label>
                  <select
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none shadow-2xs"
                  >
                    <option value="WhatsApp Lead Qualification Bot">WhatsApp Lead Qualification Bot</option>
                    <option value="AI Voice Appointment Booking">AI Voice Appointment Booking</option>
                    <option value="Full AI CRM & Instant Lead Calling">Full AI CRM & Instant Lead Calling</option>
                    <option value="Custom Enterprise Automation">Custom Enterprise Automation</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddRetainerOpen(false)}
                    className="h-9 px-4 text-xs font-bold text-slate-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmittingRetainer}
                    className="h-9 px-5 text-xs font-black bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
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
