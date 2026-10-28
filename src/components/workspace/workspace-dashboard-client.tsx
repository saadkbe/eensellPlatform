"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Users,
  Send,
  Receipt,
  StickyNote,
  Table2,
  TrendingUp,
  DollarSign,
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Phone,
  Mail,
  FileText,
  AlertCircle,
  CheckSquare,
  Square,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientRetainer {
  id: string;
  clientName: string;
  contactPerson: string;
  service: string;
  monthlyFee: number;
  status: "active" | "pending_payment" | "proposal";
  nextBilling: string;
  phone: string;
}

const INITIAL_RETAINERS: ClientRetainer[] = [
  {
    id: "1",
    clientName: "Atlas Prestige Immobilier",
    contactPerson: "M. Youssef Berrada",
    service: "WhatsApp Lead Qualification Bot",
    monthlyFee: 5500,
    status: "active",
    nextBilling: "05 Nov 2026",
    phone: "+212 5 22 45 88 12",
  },
  {
    id: "2",
    clientName: "Cabinet Dentaire Dr. Alami",
    contactPerson: "Dr. Mehdi Alami",
    service: "AI Voice Appointment Booking",
    monthlyFee: 4500,
    status: "active",
    nextBilling: "12 Nov 2026",
    phone: "+212 5 24 43 11 20",
  },
  {
    id: "3",
    clientName: "Casablanca Prime Properties",
    contactPerson: "Mme. Leila Benmoussa",
    service: "Full AI CRM & Instant Lead Calling",
    monthlyFee: 6000,
    status: "pending_payment",
    nextBilling: "28 Oct 2026",
    phone: "+212 5 22 98 14 00",
  },
];

export function WorkspaceDashboardClient({ initialData }: { initialData?: any }) {
  const [retainers, setRetainers] = useState<ClientRetainer[]>(INITIAL_RETAINERS);
  const [todos, setTodos] = useState([
    { id: 1, text: "Send 15 cold emails to dental clinics in Rabat", done: true },
    { id: 2, text: "Follow up with Dr. Benmoussa on WhatsApp (Demo Review)", done: false },
    { id: 3, text: "Generate and send monthly invoice to Atlas Prestige (5,500 MAD)", done: false },
    { id: 4, text: "Run Google Maps scrape for real estate agencies in Marrakech", done: false },
  ]);
  const [newTodoText, setNewTodoText] = useState("");

  const totalMRR = retainers.reduce((acc, curr) => acc + curr.monthlyFee, 0);
  const targetMRR = 30000;
  const progressPercent = Math.min(Math.round((totalMRR / targetMRR) * 100), 100);

  const toggleTodo = (id: number) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    setTodos([...todos, { id: Date.now(), text: newTodoText.trim(), done: false }]);
    setNewTodoText("");
  };

  return (
    <div className="p-4 sm:p-8 lg:p-12 max-w-5xl mx-auto w-full space-y-8 select-text">
      {/* ── Notion Page Header ── */}
      <div className="space-y-3">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-[#787774] dark:text-[#9B9A97]">
          <span>Eensell Workspace</span>
          <span>/</span>
          <span className="text-[#37352F] dark:text-[#E6E6E5] font-medium">Overview & Revenue</span>
        </div>

        {/* Page Title & Icon */}
        <div className="flex items-center gap-3 pt-2">
          <span className="text-3xl sm:text-4xl select-none">🏢</span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#37352F] dark:text-[#E6E6E5]">
            Agency Command & Revenue
          </h1>
        </div>
        <p className="text-sm text-[#787774] dark:text-[#9B9A97] leading-relaxed">
          Autonomous Agency Operating System &bull; Track client retainers, active outreach, and daily high-leverage priorities.
        </p>
      </div>

      {/* ── Notion Callout Box (30K MAD Goal) ── */}
      <div className="p-4 rounded-lg bg-[#FBFAF7] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] flex items-start gap-3.5">
        <span className="text-2xl select-none">🎯</span>
        <div className="flex-1 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="font-semibold text-sm text-[#37352F] dark:text-[#E6E6E5]">
              Milestone: 30,000 MAD / month Recurring Revenue
            </span>
            <span className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97]">
              {totalMRR.toLocaleString()} MAD / 30,000 MAD ({progressPercent}%)
            </span>
          </div>

          {/* Minimalist Progress Line */}
          <div className="w-full bg-[#EDEDEB] dark:bg-[#2E2E2E] h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-xs text-[#787774] dark:text-[#9B9A97]">
            You have <strong>{retainers.length} active client retainers</strong>. Close 2 to 3 more clients at ~5,000 MAD to cross your agency target.
          </p>
        </div>
      </div>

      {/* ── Notion Database Gallery / Metric Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-lg bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] space-y-1">
          <span className="text-[11px] font-semibold text-[#787774] dark:text-[#9B9A97] uppercase tracking-wider">
            Monthly Retainers
          </span>
          <div className="text-lg sm:text-xl font-bold text-[#37352F] dark:text-[#E6E6E5]">
            {totalMRR.toLocaleString()} MAD
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            3 clients active
          </span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] space-y-1">
          <span className="text-[11px] font-semibold text-[#787774] dark:text-[#9B9A97] uppercase tracking-wider">
            Pipeline Value
          </span>
          <div className="text-lg sm:text-xl font-bold text-[#37352F] dark:text-[#E6E6E5]">
            42,500 MAD
          </div>
          <span className="text-[11px] text-[#787774] dark:text-[#9B9A97]">
            8 deals in negotiation
          </span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] space-y-1">
          <span className="text-[11px] font-semibold text-[#787774] dark:text-[#9B9A97] uppercase tracking-wider">
            Scraped Leads
          </span>
          <div className="text-lg sm:text-xl font-bold text-[#37352F] dark:text-[#E6E6E5]">
            148 Leads
          </div>
          <span className="text-[11px] text-[#787774] dark:text-[#9B9A97]">
            Google Maps Verified
          </span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] space-y-1">
          <span className="text-[11px] font-semibold text-[#787774] dark:text-[#9B9A97] uppercase tracking-wider">
            Closing Rate
          </span>
          <div className="text-lg sm:text-xl font-bold text-[#37352F] dark:text-[#E6E6E5]">
            21.4%
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            +3.2% this week
          </span>
        </div>
      </div>

      {/* ── Notion Quick Views Navigation ── */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-[#37352F] dark:text-[#E6E6E5] flex items-center gap-1.5">
          <span>⚡</span>
          <span>Agency Ecosystem Tools</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            href="/workspace/scraper"
            className="p-3.5 rounded-lg bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] hover:border-[#D3D1CB] dark:hover:border-[#3E3E3E] transition-all group"
          >
            <div className="text-2xl mb-1.5">📍</div>
            <div className="font-semibold text-xs text-[#37352F] dark:text-[#E6E6E5] group-hover:underline">
              Google Maps Scraper
            </div>
            <p className="text-[11px] text-[#787774] dark:text-[#9B9A97] mt-0.5">
              Extract businesses by city with verified phone numbers & ratings.
            </p>
          </Link>

          <Link
            href="/workspace/crm"
            className="p-3.5 rounded-lg bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] hover:border-[#D3D1CB] dark:hover:border-[#3E3E3E] transition-all group"
          >
            <div className="text-2xl mb-1.5">💼</div>
            <div className="font-semibold text-xs text-[#37352F] dark:text-[#E6E6E5] group-hover:underline">
              Outreach CRM
            </div>
            <p className="text-[11px] text-[#787774] dark:text-[#9B9A97] mt-0.5">
              Track leads from contacted to meeting booked and closed won.
            </p>
          </Link>

          <Link
            href="/workspace/sheets"
            className="p-3.5 rounded-lg bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] hover:border-[#D3D1CB] dark:hover:border-[#3E3E3E] transition-all group"
          >
            <div className="text-2xl mb-1.5">📊</div>
            <div className="font-semibold text-xs text-[#37352F] dark:text-[#E6E6E5] group-hover:underline">
              Agency Sheets
            </div>
            <p className="text-[11px] text-[#787774] dark:text-[#9B9A97] mt-0.5">
              Notion-style live database table for your prospects and retainers.
            </p>
          </Link>

          <Link
            href="/workspace/drafter"
            className="p-3.5 rounded-lg bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] hover:border-[#D3D1CB] dark:hover:border-[#3E3E3E] transition-all group"
          >
            <div className="text-2xl mb-1.5">✍️</div>
            <div className="font-semibold text-xs text-[#37352F] dark:text-[#E6E6E5] group-hover:underline">
              Email & WhatsApp AI
            </div>
            <p className="text-[11px] text-[#787774] dark:text-[#9B9A97] mt-0.5">
              Draft personalized pitches in Darija, French & English with GPT-4o.
            </p>
          </Link>
        </div>
      </div>

      {/* ── Notion Table: Active Client Retainers ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#37352F] dark:text-[#E6E6E5] flex items-center gap-1.5">
            <span>📋</span>
            <span>Active Retainers & Contracts</span>
          </h2>
          <Link
            href="/workspace/invoices"
            className="text-xs text-[#787774] hover:text-[#37352F] dark:hover:text-[#E6E6E5] flex items-center gap-1"
          >
            <span>Generate Invoices</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-lg overflow-hidden bg-[#FFFFFF] dark:bg-[#202020]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F6F3] dark:bg-[#1E1E1E] border-b border-[#EDEDEB] dark:border-[#2E2E2E] text-[#787774] dark:text-[#9B9A97]">
                <tr>
                  <th className="py-2.5 px-3 font-medium">Aa Client Name</th>
                  <th className="py-2.5 px-3 font-medium">🏷️ Deliverable / AI Service</th>
                  <th className="py-2.5 px-3 font-medium">💰 Retainer (MAD)</th>
                  <th className="py-2.5 px-3 font-medium">🔘 Status</th>
                  <th className="py-2.5 px-3 font-medium">📅 Renewal Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDEDEB] dark:divide-[#2E2E2E]">
                {retainers.map((client) => (
                  <tr key={client.id} className="hover:bg-[#F7F6F3]/60 dark:hover:bg-[#252525] transition-colors">
                    <td className="py-2.5 px-3 font-medium text-[#37352F] dark:text-[#E6E6E5]">
                      <div className="flex flex-col">
                        <span>{client.clientName}</span>
                        <span className="text-[10px] text-[#787774] dark:text-[#9B9A97]">
                          {client.contactPerson} &bull; {client.phone}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-[#787774] dark:text-[#9B9A97]">
                      {client.service}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#37352F] dark:text-[#E6E6E5]">
                      {client.monthlyFee.toLocaleString()} MAD
                    </td>
                    <td className="py-2.5 px-3">
                      {client.status === "active" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#DEFBE6] text-[#0F7B34] dark:bg-[#1C3E25] dark:text-[#4ADE80]">
                          Active Retainer
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FBF3DB] text-[#89632A] dark:bg-[#3D3219] dark:text-[#FACC15]">
                          Payment Pending
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-[#787774] dark:text-[#9B9A97]">
                      {client.nextBilling}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Notion Checklist: Daily Agency Priorities ── */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-[#37352F] dark:text-[#E6E6E5] flex items-center gap-1.5">
          <span>☑️</span>
          <span>Daily Acquisition Priorities</span>
        </h2>

        <div className="p-4 rounded-lg bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] space-y-2.5">
          <div className="space-y-2">
            {todos.map((todo) => (
              <div
                key={todo.id}
                onClick={() => toggleTodo(todo.id)}
                className="flex items-center gap-2.5 text-xs cursor-pointer group select-none"
              >
                {todo.done ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-[#787774] group-hover:text-[#37352F] dark:group-hover:text-[#E6E6E5] shrink-0" />
                )}
                <span
                  className={
                    todo.done
                      ? "line-through text-[#9B9A97] dark:text-[#666666]"
                      : "text-[#37352F] dark:text-[#E6E6E5]"
                  }
                >
                  {todo.text}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={addTodo} className="pt-2 flex items-center gap-2 border-t border-[#EDEDEB] dark:border-[#2E2E2E]">
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="+ Add a to-do item (press Enter)..."
              className="flex-1 bg-transparent text-xs text-[#37352F] dark:text-[#E6E6E5] placeholder-[#9B9A97] outline-none py-1"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
