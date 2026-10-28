"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  Plus,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  FileText,
  AlertCircle,
  CheckSquare,
  Square,
  Building2,
  Activity,
  Zap,
  Target,
  ChevronRight,
  Send,
  Receipt,
  Users,
  MapPin,
  Trash2,
  Table2,
  Bot,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientRetainer {
  id: string;
  clientName: string;
  contactPerson: string;
  service: string;
  category: "whatsapp" | "voice" | "crm" | "custom";
  monthlyFee: number;
  status: "active" | "pending_payment" | "proposal";
  nextBilling: string;
  phone: string;
  city: string;
}

interface TodoItem {
  id: number;
  text: string;
  category: "outreach" | "followup" | "billing" | "ops";
  done: boolean;
}

const INITIAL_RETAINERS: ClientRetainer[] = [
  {
    id: "1",
    clientName: "Atlas Prestige Immobilier",
    contactPerson: "M. Youssef Berrada",
    service: "WhatsApp Lead Qualification Bot",
    category: "whatsapp",
    monthlyFee: 5500,
    status: "active",
    nextBilling: "05 Nov 2026",
    phone: "+212 5 22 45 88 12",
    city: "Casablanca",
  },
  {
    id: "2",
    clientName: "Cabinet Dentaire Dr. Alami",
    contactPerson: "Dr. Mehdi Alami",
    service: "AI Voice Appointment Booking",
    category: "voice",
    monthlyFee: 4500,
    status: "active",
    nextBilling: "12 Nov 2026",
    phone: "+212 5 24 43 11 20",
    city: "Marrakech",
  },
  {
    id: "3",
    clientName: "Casablanca Prime Properties",
    contactPerson: "Mme. Leila Benmoussa",
    service: "Full AI CRM & Instant Lead Calling",
    category: "crm",
    monthlyFee: 6000,
    status: "pending_payment",
    nextBilling: "28 Oct 2026",
    phone: "+212 5 22 98 14 00",
    city: "Casablanca",
  },
];

const INITIAL_TODOS: TodoItem[] = [
  { id: 1, text: "Send 15 cold pitches to dental clinics in Rabat & Agadir", category: "outreach", done: true },
  { id: 2, text: "Follow up with Dr. Benmoussa on WhatsApp (Demo Review)", category: "followup", done: false },
  { id: 3, text: "Generate and send monthly invoice to Atlas Prestige (5,500 MAD)", category: "billing", done: false },
  { id: 4, text: "Run Google Maps scrape for luxury real estate agencies in Marrakech", category: "ops", done: false },
];

export function WorkspaceDashboardClient({ initialData }: { initialData?: any }) {
  const [retainers, setRetainers] = useState<ClientRetainer[]>(INITIAL_RETAINERS);
  const [todos, setTodos] = useState<TodoItem[]>(INITIAL_TODOS);
  const [newTodoText, setNewTodoText] = useState("");
  const [newTodoCategory, setNewTodoCategory] = useState<TodoItem["category"]>("outreach");
  const [retainerFilter, setRetainerFilter] = useState<"all" | "active" | "pending_payment">("all");
  const [isAddRetainerOpen, setIsAddRetainerOpen] = useState(false);

  // Form state for adding new retainer
  const [newClientName, setNewClientName] = useState("");
  const [newContactPerson, setNewContactPerson] = useState("");
  const [newService, setNewService] = useState("WhatsApp Lead Qualification Bot");
  const [newFee, setNewFee] = useState("5000");
  const [newPhone, setNewPhone] = useState("+212 6 ");
  const [newCity, setNewCity] = useState("Casablanca");

  const totalMRR = retainers.reduce((acc, curr) => (curr.status === "active" ? acc + curr.monthlyFee : acc), 0);
  const pendingMRR = retainers.reduce((acc, curr) => (curr.status === "pending_payment" ? acc + curr.monthlyFee : acc), 0);
  const targetMRR = 30000;
  const progressPercent = Math.min(Math.round((totalMRR / targetMRR) * 100), 100);
  const completedTodosCount = todos.filter((t) => t.done).length;

  const filteredRetainers = retainers.filter((r) => {
    if (retainerFilter === "active") return r.status === "active";
    if (retainerFilter === "pending_payment") return r.status === "pending_payment";
    return true;
  });

  const toggleTodo = (id: number) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTodo = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    setTodos((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: newTodoText.trim(),
        category: newTodoCategory,
        done: false,
      },
    ]);
    setNewTodoText("");
  };

  const handleAddRetainer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    let category: ClientRetainer["category"] = "custom";
    if (newService.toLowerCase().includes("whatsapp")) category = "whatsapp";
    else if (newService.toLowerCase().includes("voice")) category = "voice";
    else if (newService.toLowerCase().includes("crm")) category = "crm";

    const newRetainer: ClientRetainer = {
      id: Date.now().toString(),
      clientName: newClientName.trim(),
      contactPerson: newContactPerson.trim() || "CEO / Director",
      service: newService,
      category,
      monthlyFee: parseInt(newFee) || 5000,
      status: "active",
      nextBilling: "30 Nov 2026",
      phone: newPhone.trim(),
      city: newCity.trim(),
    };

    setRetainers((prev) => [newRetainer, ...prev]);
    setIsAddRetainerOpen(false);
    setNewClientName("");
    setNewContactPerson("");
    setNewFee("5000");
  };

  // Service distribution calculation
  const whatsappRevenue = retainers
    .filter((r) => r.category === "whatsapp")
    .reduce((a, b) => a + b.monthlyFee, 0);
  const voiceRevenue = retainers
    .filter((r) => r.category === "voice")
    .reduce((a, b) => a + b.monthlyFee, 0);
  const crmRevenue = retainers
    .filter((r) => r.category === "crm" || r.category === "custom")
    .reduce((a, b) => a + b.monthlyFee, 0);
  const combinedTotal = totalMRR + pendingMRR || 1;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 select-text">
      {/* ── Dashboard Executive Header ── */}
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

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#37352F] dark:text-[#E6E6E5]">
            Agency Command & Revenue
          </h1>
          <p className="text-xs sm:text-sm text-[#787774] dark:text-[#9B9A97]">
            Monitor recurring monthly contracts, client acquisition pipelines, and autonomous execution.
          </p>
        </div>

        {/* Quick Executive Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/workspace/scraper"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] hover:bg-[#F7F6F3] dark:hover:bg-[#2A2A2A] text-[#37352F] dark:text-[#E6E6E5] shadow-2xs transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-500" />
            <span>Scrape Leads</span>
          </Link>

          <Link
            href="/workspace/drafter"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] hover:bg-[#F7F6F3] dark:hover:bg-[#2A2A2A] text-[#37352F] dark:text-[#E6E6E5] shadow-2xs transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-violet-500" />
            <span>AI Pitch Drafter</span>
          </Link>

          <Link
            href="/workspace/invoices"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] hover:bg-[#F7F6F3] dark:hover:bg-[#2A2A2A] text-[#37352F] dark:text-[#E6E6E5] shadow-2xs transition-colors"
          >
            <Receipt className="w-3.5 h-3.5 text-amber-500" />
            <span>Create Invoice</span>
          </Link>

          <button
            onClick={() => setIsAddRetainerOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[#37352F] hover:bg-[#262420] dark:bg-[#E6E6E5] dark:hover:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#191919] shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Retainer</span>
          </button>
        </div>
      </div>

      {/* ── Key Performance Indicators (KPI Cards Row) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
        {/* Card 1: Monthly Recurring Revenue */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] shadow-2xs hover:border-[#D3D1CB] dark:hover:border-[#3E3E3E] transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97] uppercase tracking-wider">
              Active Retainers (MRR)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#37352F] dark:text-[#E6E6E5]">
              {totalMRR.toLocaleString()} <span className="text-sm font-semibold text-[#787774] dark:text-[#9B9A97]">MAD/mo</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                +18.4%
              </span>
              <span className="text-[#787774] dark:text-[#9B9A97]">&bull; {progressPercent}% of 30K target</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[#EDEDEB] dark:border-[#2E2E2E]/60 flex items-center justify-between text-[11px] text-[#787774] dark:text-[#9B9A97]">
            <span>Pending payment:</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">+{pendingMRR.toLocaleString()} MAD</span>
          </div>
        </div>

        {/* Card 2: Active Clients & Retainers */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] shadow-2xs hover:border-[#D3D1CB] dark:hover:border-[#3E3E3E] transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97] uppercase tracking-wider">
              Client Portfolio
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#37352F] dark:text-[#E6E6E5]">
              {retainers.length} <span className="text-sm font-semibold text-[#787774] dark:text-[#9B9A97]">Accounts</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#787774] dark:text-[#9B9A97]">
              <span className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium">
                {retainers.filter((r) => r.status === "active").length} active
              </span>
              <span>&bull;</span>
              <span>{retainers.filter((r) => r.status === "pending_payment").length} pending invoice</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[#EDEDEB] dark:border-[#2E2E2E]/60 flex items-center justify-between text-[11px] text-[#787774] dark:text-[#9B9A97]">
            <span>Avg Retainer:</span>
            <span className="font-semibold text-[#37352F] dark:text-[#E6E6E5]">
              {Math.round(totalMRR / (retainers.filter((r) => r.status === "active").length || 1)).toLocaleString()} MAD
            </span>
          </div>
        </div>

        {/* Card 3: Pipeline & Lead Bank */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] shadow-2xs hover:border-[#D3D1CB] dark:hover:border-[#3E3E3E] transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97] uppercase tracking-wider">
              Pipeline Value
            </span>
            <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#37352F] dark:text-[#E6E6E5]">
              42,500 <span className="text-sm font-semibold text-[#787774] dark:text-[#9B9A97]">MAD</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#787774] dark:text-[#9B9A97]">
              <span className="inline-flex items-center text-violet-600 dark:text-violet-400 font-semibold">
                8 deals
              </span>
              <span>in active negotiations</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[#EDEDEB] dark:border-[#2E2E2E]/60 flex items-center justify-between text-[11px] text-[#787774] dark:text-[#9B9A97]">
            <span>Scraped Leads:</span>
            <span className="font-semibold text-[#37352F] dark:text-[#E6E6E5]">
              {initialData?.stats?.totalLeads || 148} qualified leads
            </span>
          </div>
        </div>

        {/* Card 4: Acquisition Efficiency */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] shadow-2xs hover:border-[#D3D1CB] dark:hover:border-[#3E3E3E] transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97] uppercase tracking-wider">
              Acquisition Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#37352F] dark:text-[#E6E6E5]">
              21.4% <span className="text-sm font-semibold text-[#787774] dark:text-[#9B9A97]">Closing</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                +3.2%
              </span>
              <span className="text-[#787774] dark:text-[#9B9A97]">vs previous cohort</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[#EDEDEB] dark:border-[#2E2E2E]/60 flex items-center justify-between text-[11px] text-[#787774] dark:text-[#9B9A97]">
            <span>Booked Meetings:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {initialData?.stats?.meetingsBooked || 3} booked this week
            </span>
          </div>
        </div>
      </div>

      {/* ── Revenue Acceleration & Milestone Velocity Bar ── */}
      <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-r from-[#FAFAFA] via-[#FFFFFF] to-[#F9F9F8] dark:from-[#202020] dark:via-[#222222] dark:to-[#1E1E1E] border border-[#EDEDEB] dark:border-[#2E2E2E] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-500" />
              <span className="font-bold text-sm text-[#37352F] dark:text-[#E6E6E5]">
                Agency Milestone: 30,000 MAD / Month Recurring Revenue
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                Phase 1 Target
              </span>
            </div>
            <p className="text-xs text-[#787774] dark:text-[#9B9A97]">
              Current verified run-rate: <strong className="text-[#37352F] dark:text-[#E6E6E5]">{totalMRR.toLocaleString()} MAD</strong>. Close 2 to 3 more clients at ~5,000 MAD/mo to reach full financial freedom.
            </p>
          </div>

          <div className="text-right flex items-center md:flex-col md:items-end justify-between">
            <span className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">Progress to Target</span>
            <span className="text-lg font-bold text-[#37352F] dark:text-[#E6E6E5]">
              {totalMRR.toLocaleString()} / 30,000 MAD ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Multi-segment Progress Track with Milestones */}
        <div className="space-y-1.5">
          <div className="relative w-full bg-[#EDEDEB] dark:bg-[#2E2E2E] h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-medium text-[#787774] dark:text-[#9B9A97] px-0.5">
            <span>0 MAD</span>
            <span>10,000 MAD (Solopreneur)</span>
            <span>20,000 MAD (Scaling)</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">30,000 MAD (Agency Target)</span>
          </div>
        </div>
      </div>

      {/* ── Main Dashboard Content Grid (Full Width Edge-to-Edge) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full">
        {/* ── Left / Primary Column (Table & Core Modules) ── */}
        <div className="xl:col-span-8 space-y-6">
          {/* Active Client Retainers Table */}
          <div className="rounded-xl border border-[#EDEDEB] dark:border-[#2E2E2E] bg-[#FFFFFF] dark:bg-[#202020] shadow-2xs overflow-hidden">
            {/* Table Header Bar */}
            <div className="p-4 sm:p-5 border-b border-[#EDEDEB] dark:border-[#2E2E2E] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-sm sm:text-base text-[#37352F] dark:text-[#E6E6E5]">
                    Active Client Retainers & Contracts
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F7F6F3] dark:bg-[#2E2E2E] text-[#787774] dark:text-[#9B9A97]">
                    {retainers.length} contracts
                  </span>
                </div>
                <p className="text-xs text-[#787774] dark:text-[#9B9A97] mt-0.5">
                  Monthly recurring billings, deliverables, and service renewals.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#F7F6F3] dark:bg-[#1A1A1A] text-xs">
                <button
                  onClick={() => setRetainerFilter("all")}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    retainerFilter === "all"
                      ? "bg-[#FFFFFF] dark:bg-[#2E2E2E] text-[#37352F] dark:text-[#E6E6E5] shadow-xs"
                      : "text-[#787774] dark:text-[#9B9A97] hover:text-[#37352F] dark:hover:text-[#E6E6E5]"
                  }`}
                >
                  All ({retainers.length})
                </button>
                <button
                  onClick={() => setRetainerFilter("active")}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    retainerFilter === "active"
                      ? "bg-[#FFFFFF] dark:bg-[#2E2E2E] text-[#37352F] dark:text-[#E6E6E5] shadow-xs"
                      : "text-[#787774] dark:text-[#9B9A97] hover:text-[#37352F] dark:hover:text-[#E6E6E5]"
                  }`}
                >
                  Active ({retainers.filter((r) => r.status === "active").length})
                </button>
                <button
                  onClick={() => setRetainerFilter("pending_payment")}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    retainerFilter === "pending_payment"
                      ? "bg-[#FFFFFF] dark:bg-[#2E2E2E] text-[#37352F] dark:text-[#E6E6E5] shadow-xs"
                      : "text-[#787774] dark:text-[#9B9A97] hover:text-[#37352F] dark:hover:text-[#E6E6E5]"
                  }`}
                >
                  Pending ({retainers.filter((r) => r.status === "pending_payment").length})
                </button>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F7] dark:bg-[#1A1A1A] border-b border-[#EDEDEB] dark:border-[#2E2E2E] text-[#787774] dark:text-[#9B9A97] uppercase tracking-wider font-semibold text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Client & Contact</th>
                    <th className="py-3 px-4">AI Deliverable</th>
                    <th className="py-3 px-4">Monthly Fee</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Next Billing</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDEDEB] dark:divide-[#2E2E2E]">
                  {filteredRetainers.map((client) => (
                    <tr
                      key={client.id}
                      className="hover:bg-[#FBFBFA] dark:hover:bg-[#252525] transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-medium text-[#37352F] dark:text-[#E6E6E5]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#F0EFEA] dark:bg-[#2C2C2C] text-[#37352F] dark:text-[#E6E6E5] flex items-center justify-center font-bold text-xs shrink-0 border border-[#E2E0D8] dark:border-[#3A3A3A]">
                            {client.clientName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-xs text-[#37352F] dark:text-[#E6E6E5] truncate">
                              {client.clientName}
                            </div>
                            <div className="text-[11px] text-[#787774] dark:text-[#9B9A97] truncate flex items-center gap-1.5">
                              <span>{client.contactPerson}</span>
                              <span>&bull;</span>
                              <span>{client.city}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#F5F5F4] dark:bg-[#282828] text-[#44403C] dark:text-[#D6D3D1] border border-[#E7E5E4] dark:border-[#383838]">
                          {client.category === "whatsapp" && <span className="text-emerald-500">💬</span>}
                          {client.category === "voice" && <span className="text-blue-500">📞</span>}
                          {client.category === "crm" && <span className="text-violet-500">⚡</span>}
                          <span className="truncate max-w-[180px]">{client.service}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-xs text-[#37352F] dark:text-[#E6E6E5]">
                        {client.monthlyFee.toLocaleString()} MAD
                        <span className="text-[10px] text-[#787774] dark:text-[#9B9A97] font-normal block">/ month</span>
                      </td>

                      <td className="py-3.5 px-4">
                        {client.status === "active" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active Retainer
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/40">
                            <Clock className="w-3 h-3 text-amber-500" />
                            Payment Pending
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-[#787774] dark:text-[#9B9A97] text-[11px]">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#9B9A97]" />
                          <span>{client.nextBilling}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`https://wa.me/${client.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md hover:bg-[#EDEDEB] dark:hover:bg-[#2C2C2C] text-[#787774] hover:text-[#37352F] dark:hover:text-[#E6E6E5] transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          </a>
                          <Link
                            href="/workspace/invoices"
                            className="p-1.5 rounded-md hover:bg-[#EDEDEB] dark:hover:bg-[#2C2C2C] text-[#787774] hover:text-[#37352F] dark:hover:text-[#E6E6E5] transition-colors"
                            title="Generate Invoice"
                          >
                            <Receipt className="w-3.5 h-3.5 text-blue-600" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer Actions */}
            <div className="p-3 bg-[#FAF9F7] dark:bg-[#1A1A1A] border-t border-[#EDEDEB] dark:border-[#2E2E2E] flex items-center justify-between text-xs text-[#787774] dark:text-[#9B9A97]">
              <span>
                Showing {filteredRetainers.length} of {retainers.length} active client contracts
              </span>
              <button
                onClick={() => setIsAddRetainerOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#37352F] dark:text-[#E6E6E5] hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add new client contract</span>
              </button>
            </div>
          </div>

          {/* ── Agency Ecosystem & High-Leverage Tools ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#37352F] dark:text-[#E6E6E5] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Agency Operating System Modules</span>
                </h3>
                <p className="text-xs text-[#787774] dark:text-[#9B9A97]">
                  Instant access to your client acquisition and operations suite.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tool 1: Maps Scraper */}
              <Link
                href="/workspace/scraper"
                className="p-4 sm:p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] hover:border-[#D3D1CB] dark:hover:border-[#3E3E3E] hover:shadow-xs transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg">
                      📍
                    </div>
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Open Engine <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="font-bold text-sm text-[#37352F] dark:text-[#E6E6E5] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Google Maps Lead Scraper
                  </div>
                  <p className="text-xs text-[#787774] dark:text-[#9B9A97] mt-1 leading-relaxed">
                    Extract verified phone numbers, reviews, business categories, and decision-maker emails across any city in Morocco & worldwide.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#EDEDEB] dark:border-[#2E2E2E]/60 flex items-center justify-between text-[11px] text-[#787774] dark:text-[#9B9A97]">
                  <span>Status: <strong className="text-emerald-600 dark:text-emerald-400">Ready</strong></span>
                  <span>148 verified leads cached</span>
                </div>
              </Link>

              {/* Tool 2: Outreach CRM */}
              <Link
                href="/workspace/crm"
                className="p-4 sm:p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] hover:border-[#D3D1CB] dark:hover:border-[#3E3E3E] hover:shadow-xs transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
                      💼
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Open CRM <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="font-bold text-sm text-[#37352F] dark:text-[#E6E6E5] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Client Pipeline CRM
                  </div>
                  <p className="text-xs text-[#787774] dark:text-[#9B9A97] mt-1 leading-relaxed">
                    Kanban pipeline tracking prospect stages from contacted to WhatsApp reply, demo call booked, and signed contract.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#EDEDEB] dark:border-[#2E2E2E]/60 flex items-center justify-between text-[11px] text-[#787774] dark:text-[#9B9A97]">
                  <span>Active pipeline: <strong className="text-[#37352F] dark:text-[#E6E6E5]">42,500 MAD</strong></span>
                  <span>8 deals in review</span>
                </div>
              </Link>

              {/* Tool 3: Agency Sheets */}
              <Link
                href="/workspace/sheets"
                className="p-4 sm:p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] hover:border-[#D3D1CB] dark:hover:border-[#3E3E3E] hover:shadow-xs transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-lg">
                      📊
                    </div>
                    <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Open Sheets <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="font-bold text-sm text-[#37352F] dark:text-[#E6E6E5] group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    Agency Master Sheets
                  </div>
                  <p className="text-xs text-[#787774] dark:text-[#9B9A97] mt-1 leading-relaxed">
                    Live relational agency spreadsheet: track lead outreach status, service deliverables, monthly billing dates, and invoices.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#EDEDEB] dark:border-[#2E2E2E]/60 flex items-center justify-between text-[11px] text-[#787774] dark:text-[#9B9A97]">
                  <span>Database: <strong className="text-[#37352F] dark:text-[#E6E6E5]">Live Sync</strong></span>
                  <span>Formulas active</span>
                </div>
              </Link>

              {/* Tool 4: AI Drafter */}
              <Link
                href="/workspace/drafter"
                className="p-4 sm:p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] hover:border-[#D3D1CB] dark:hover:border-[#3E3E3E] hover:shadow-xs transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold text-lg">
                      ✍️
                    </div>
                    <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Open Drafter <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="font-bold text-sm text-[#37352F] dark:text-[#E6E6E5] group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    AI Copywriter & Voice Drafter
                  </div>
                  <p className="text-xs text-[#787774] dark:text-[#9B9A97] mt-1 leading-relaxed">
                    Generate high-converting cold pitches, WhatsApp audio scripts, and agency proposals in French, Darija, or English.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#EDEDEB] dark:border-[#2E2E2E]/60 flex items-center justify-between text-[11px] text-[#787774] dark:text-[#9B9A97]">
                  <span>Templates: <strong className="text-[#37352F] dark:text-[#E6E6E5]">12 Pre-loaded</strong></span>
                  <span>Audio synthesis ready</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Right Column (Briefing, Priorities, & Revenue Distribution) ── */}
        <div className="xl:col-span-4 space-y-6">
          {/* Executive Daily Copilot Briefing */}
          <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#FAF9F6] to-[#F5F4EF] dark:from-[#202020] dark:to-[#1B1B1B] border border-[#EDEDEB] dark:border-[#2E2E2E] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-[#37352F] dark:text-[#E6E6E5] uppercase tracking-wider">
                  AI Acquisition Copilot
                </span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                Live Briefing
              </span>
            </div>

            <p className="text-xs text-[#787774] dark:text-[#9B9A97] leading-relaxed">
              {initialData?.debriefText ||
                "Welcome to your Eensell Workspace. Your acquisition bots are configured. Target Casablanca dental clinics and Marrakech real estate firms this week to convert 2 new retainers."}
            </p>

            <div className="pt-3 border-t border-[#EDEDEB] dark:border-[#2E2E2E]/60 flex items-center justify-between text-xs">
              <span className="text-[#787774] dark:text-[#9B9A97]">
                Campaign Status: <strong className="text-emerald-600 dark:text-emerald-400">Optimal</strong>
              </span>
              <Link
                href="/workspace/crm"
                className="text-xs font-semibold text-[#37352F] dark:text-[#E6E6E5] hover:underline flex items-center gap-1"
              >
                <span>View CRM Leads</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Revenue Distribution by Service */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#37352F] dark:text-[#E6E6E5] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>MRR by AI Deliverable</span>
              </h3>
              <span className="text-xs font-bold text-[#37352F] dark:text-[#E6E6E5]">
                {(totalMRR + pendingMRR).toLocaleString()} MAD Total
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* WhatsApp Bots */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#787774] dark:text-[#9B9A97] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    WhatsApp Qualification Bots
                  </span>
                  <span className="font-semibold text-[#37352F] dark:text-[#E6E6E5]">
                    {whatsappRevenue.toLocaleString()} MAD ({Math.round((whatsappRevenue / combinedTotal) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-[#EDEDEB] dark:bg-[#2E2E2E] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${(whatsappRevenue / combinedTotal) * 100}%` }}
                  />
                </div>
              </div>

              {/* AI Voice Booking */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#787774] dark:text-[#9B9A97] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    AI Voice Appointment Booking
                  </span>
                  <span className="font-semibold text-[#37352F] dark:text-[#E6E6E5]">
                    {voiceRevenue.toLocaleString()} MAD ({Math.round((voiceRevenue / combinedTotal) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-[#EDEDEB] dark:bg-[#2E2E2E] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all"
                    style={{ width: `${(voiceRevenue / combinedTotal) * 100}%` }}
                  />
                </div>
              </div>

              {/* Full CRM Infrastructure */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#787774] dark:text-[#9B9A97] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-violet-500" />
                    Full AI CRM & Instant Calling
                  </span>
                  <span className="font-semibold text-[#37352F] dark:text-[#E6E6E5]">
                    {crmRevenue.toLocaleString()} MAD ({Math.round((crmRevenue / combinedTotal) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-[#EDEDEB] dark:bg-[#2E2E2E] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-violet-500 h-full rounded-full transition-all"
                    style={{ width: `${(crmRevenue / combinedTotal) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Daily High-Leverage Priorities (Interactive Checklist) */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#37352F] dark:text-[#E6E6E5] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Daily Acquisition Priorities</span>
                </h3>
                <span className="text-[11px] text-[#787774] dark:text-[#9B9A97]">
                  {completedTodosCount} of {todos.length} completed
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                {Math.round((completedTodosCount / (todos.length || 1)) * 100)}%
              </span>
            </div>

            <div className="space-y-2">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  onClick={() => toggleTodo(todo.id)}
                  className="p-2.5 rounded-lg border border-[#EDEDEB] dark:border-[#2E2E2E] hover:bg-[#FAF9F7] dark:hover:bg-[#252525] transition-colors flex items-start gap-2.5 cursor-pointer group select-none"
                >
                  {todo.done ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-4 h-4 text-[#9B9A97] group-hover:text-[#37352F] dark:group-hover:text-[#E6E6E5] shrink-0 mt-0.5" />
                  )}

                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-xs block leading-relaxed ${
                        todo.done
                          ? "line-through text-[#9B9A97] dark:text-[#666666]"
                          : "text-[#37352F] dark:text-[#E6E6E5]"
                      }`}
                    >
                      {todo.text}
                    </span>
                    <span className="inline-block mt-1 text-[10px] uppercase font-bold text-[#787774] dark:text-[#9B9A97] bg-[#F5F5F4] dark:bg-[#2A2A2A] px-1.5 py-0.2 rounded">
                      {todo.category}
                    </span>
                  </div>

                  <button
                    onClick={(e) => deleteTodo(todo.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[#9B9A97] hover:text-red-500 transition-opacity"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Add Priority Input */}
            <form onSubmit={addTodo} className="pt-2 border-t border-[#EDEDEB] dark:border-[#2E2E2E] space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  placeholder="+ Add high-leverage task (press Enter)..."
                  className="flex-1 bg-[#FBFBFA] dark:bg-[#1C1C1C] px-3 py-1.5 rounded-md border border-[#EDEDEB] dark:border-[#2E2E2E] text-xs text-[#37352F] dark:text-[#E6E6E5] placeholder-[#9B9A97] outline-none focus:border-[#37352F] dark:focus:border-[#E6E6E5] transition-colors"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="h-7 text-xs bg-[#37352F] dark:bg-[#E6E6E5] text-[#FFFFFF] dark:text-[#191919] hover:opacity-90"
                >
                  Add
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ── Add Retainer Modal / Drawer ── */}
      {isAddRetainerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDEDEB] dark:border-[#2E2E2E]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  💰
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#37352F] dark:text-[#E6E6E5]">
                    Add New Client Retainer
                  </h3>
                  <p className="text-[11px] text-[#787774] dark:text-[#9B9A97]">
                    Register a new monthly contract to track MRR and renewals.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddRetainerOpen(false)}
                className="text-[#787774] hover:text-[#37352F] dark:hover:text-[#E6E6E5] text-xs font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRetainer} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                  Company / Agency Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Palmeraie Luxury Real Estate"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-lg px-3 py-2 text-xs text-[#37352F] dark:text-[#E6E6E5] outline-none focus:border-[#37352F] dark:focus:border-[#E6E6E5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. M. Karim Tazi"
                    value={newContactPerson}
                    onChange={(e) => setNewContactPerson(e.target.value)}
                    className="w-full bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-lg px-3 py-2 text-xs text-[#37352F] dark:text-[#E6E6E5] outline-none"
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
                    className="w-full bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-lg px-3 py-2 text-xs text-[#37352F] dark:text-[#E6E6E5] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                    Monthly Retainer (MAD)
                  </label>
                  <input
                    type="number"
                    required
                    value={newFee}
                    onChange={(e) => setNewFee(e.target.value)}
                    className="w-full bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-lg px-3 py-2 text-xs text-[#37352F] dark:text-[#E6E6E5] outline-none font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                    WhatsApp / Phone
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-lg px-3 py-2 text-xs text-[#37352F] dark:text-[#E6E6E5] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
                  AI Automation Service
                </label>
                <select
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  className="w-full bg-[#FAF9F7] dark:bg-[#1A1A1A] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-lg px-3 py-2 text-xs text-[#37352F] dark:text-[#E6E6E5] outline-none"
                >
                  <option value="WhatsApp Lead Qualification Bot">WhatsApp Lead Qualification Bot</option>
                  <option value="AI Voice Appointment Booking">AI Voice Appointment Booking</option>
                  <option value="Full AI CRM & Instant Lead Calling">Full AI CRM & Instant Lead Calling</option>
                  <option value="Custom Enterprise Automation">Custom Enterprise Automation</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#EDEDEB] dark:border-[#2E2E2E] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddRetainerOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#EDEDEB] dark:border-[#2E2E2E] text-xs font-medium text-[#787774] hover:text-[#37352F] dark:hover:text-[#E6E6E5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#37352F] hover:bg-[#262420] dark:bg-[#E6E6E5] dark:hover:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#191919] text-xs font-semibold shadow-xs"
                >
                  Add Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
