"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
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
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* ── Top Header Banner ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Eensell Agency OS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Agency Command Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Track your client acquisition pipeline, monthly retainers, invoices, and daily outreach missions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/workspace/scraper">
            <Button size="sm" className="font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm gap-2">
              <MapPin className="w-4 h-4" />
              <span>Scrape Clients</span>
            </Button>
          </Link>

          <Link href="/workspace/invoices">
            <Button size="sm" variant="outline" className="font-semibold gap-2 border-border">
              <Receipt className="w-4 h-4" />
              <span>New Invoice</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* ── 4 Key Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MRR Card */}
        <Card className="bg-card border-border shadow-xs hover:border-primary/40 transition-colors">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Monthly Retainers (MRR)
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-foreground">
                  {totalMRR.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-primary">MAD / mo</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-2">
                <span>Goal: {targetMRR.toLocaleString()} MAD</span>
                <span className="font-bold text-foreground">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-1.5 mt-1 bg-muted" />
            </div>
          </CardContent>
        </Card>

        {/* Active Retainers Card */}
        <Card className="bg-card border-border shadow-xs hover:border-primary/40 transition-colors">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Active Client Retainers
              </span>
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-foreground">
                  {retainers.length}
                </span>
                <span className="text-xs text-muted-foreground">retained businesses</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">
                Avg. retainer: <strong className="text-foreground">{(totalMRR / retainers.length).toFixed(0)} MAD</strong> / client
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pipeline & Meetings */}
        <Card className="bg-card border-border shadow-xs hover:border-primary/40 transition-colors">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Outreach Pipeline
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Send className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-foreground">
                  38
                </span>
                <span className="text-xs text-muted-foreground">leads contacted</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-2">
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">
                  4 Meetings booked
                </span>
                <span>• 2 Proposals sent</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoiced & Collected */}
        <Card className="bg-card border-border shadow-xs hover:border-primary/40 transition-colors">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Collected This Month
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-foreground">
                  10,000
                </span>
                <span className="text-xs font-bold text-emerald-600">MAD</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">
                1 invoice pending (Casablanca Prime)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Quick Action Ecosystem Tools ── */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Workspace Ecosystem Tools
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <Link href="/workspace/scraper" className="group">
            <div className="p-4 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-foreground">Maps Lead Scraper</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Extract phone, rating, address & website for dentists, real estate, gyms in any city.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-primary mt-3 pt-3 border-t border-border/50">
                <span>Start Scraping</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>

          <Link href="/workspace/crm" className="group">
            <div className="p-4 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-foreground">Clients & Outreach CRM</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Kanban pipeline tracking leads from first contact to proposal sent and retainer closed.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-primary mt-3 pt-3 border-t border-border/50">
                <span>View CRM Pipeline</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>

          <Link href="/workspace/drafter" className="group">
            <div className="p-4 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Send className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-foreground">Cold Email & WhatsApp Drafter</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Generate high-converting personalized cold pitches in French, Darija, or English.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-primary mt-3 pt-3 border-t border-border/50">
                <span>Draft New Pitch</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>

          <Link href="/workspace/invoices" className="group">
            <div className="p-4 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Receipt className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-foreground">Invoices & Contracts</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Create clean PDF invoices and service agreements with Moroccan CIH/RIB banking details.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-primary mt-3 pt-3 border-t border-border/50">
                <span>Generate Invoice</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* ── Main Two-Column Viewport: Clients & Scratchpad ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left (8 cols): Active Client Retainers */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span>Current Client Retainers</span>
            </h3>
            <Link href="/workspace/crm" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
              <span>Full CRM Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                    <th className="p-3.5 pl-4">Business & Contact</th>
                    <th className="p-3.5">AI Service</th>
                    <th className="p-3.5">Monthly Retainer</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Next Billing</th>
                    <th className="p-3.5 text-right pr-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {retainers.map((client) => (
                    <tr key={client.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3.5 pl-4">
                        <div className="font-bold text-foreground text-sm">{client.clientName}</div>
                        <div className="text-muted-foreground text-[11px]">{client.contactPerson}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-medium text-foreground">{client.service}</span>
                      </td>
                      <td className="p-3.5 font-bold text-foreground font-mono">
                        {client.monthlyFee.toLocaleString()} MAD
                      </td>
                      <td className="p-3.5">
                        {client.status === "active" ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none font-bold text-[10px]">
                            ● Active Paid
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-none font-bold text-[10px]">
                            ⏳ Invoice Due
                          </Badge>
                        )}
                      </td>
                      <td className="p-3.5 text-muted-foreground font-mono text-[11px]">
                        {client.nextBilling}
                      </td>
                      <td className="p-3.5 text-right pr-4">
                        <Link href={`/workspace/invoices?client=${encodeURIComponent(client.clientName)}&fee=${client.monthlyFee}`}>
                          <Button size="sm" variant="outline" className="h-7 text-[11px] font-semibold gap-1 px-2.5">
                            <Receipt className="w-3 h-3" />
                            <span>Invoice</span>
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right (4 cols): Today's Priorities & Scratchpad */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <StickyNote className="w-4 h-4 text-amber-500" />
              <span>Daily Priorities & Scratchpad</span>
            </h3>
            <Link href="/workspace/notes" className="text-xs text-primary font-bold hover:underline">
              All Notes
            </Link>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 shadow-xs space-y-4">
            {/* Quick Add To-do Input */}
            <form onSubmit={addTodo} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add daily priority..."
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-hidden focus:border-primary"
              />
              <Button type="submit" size="sm" className="h-8 px-2.5 bg-primary text-primary-foreground font-bold">
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </form>

            {/* Checklist */}
            <div className="space-y-2">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  onClick={() => toggleTodo(todo.id)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-start gap-2.5 transition-colors ${
                    todo.done
                      ? "bg-muted/40 border-border/50 text-muted-foreground line-through"
                      : "bg-background border-border hover:border-primary/40 text-foreground"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                    todo.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-muted-foreground/40"
                  }`}>
                    {todo.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span className="leading-snug flex-1">{todo.text}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{todos.filter((t) => t.done).length} of {todos.length} done</span>
              <span className="font-semibold text-primary">Daily Execution Score: 80%</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
