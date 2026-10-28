"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table2,
  Plus,
  Download,
  Trash2,
  Edit2,
  Search,
  Check,
  Sparkles,
  ArrowUpDown,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface SheetRow {
  id: string;
  name: string;
  niche: string;
  city: string;
  phone: string;
  email: string;
  status: "New" | "Contacted" | "Meeting Booked" | "Proposal Sent" | "Closed Won";
  retainerMad: number;
  notes: string;
}

const INITIAL_SHEET_ROWS: SheetRow[] = [
  {
    id: "s1",
    name: "Atlas Prestige Immobilier",
    niche: "Real Estate",
    city: "Casablanca",
    phone: "+212 5 22 45 88 12",
    email: "direction@atlasprestige.ma",
    status: "Closed Won",
    retainerMad: 5500,
    notes: "Active WhatsApp Bot for property inquiries. Paying via CIH monthly.",
  },
  {
    id: "s2",
    name: "Cabinet Dentaire Dr. Alami",
    niche: "Dentistry",
    city: "Casablanca",
    phone: "+212 5 24 43 11 20",
    email: "contact@cabinet-alami.ma",
    status: "Closed Won",
    retainerMad: 4500,
    notes: "AI voice booking for emergency and routine consultations.",
  },
  {
    id: "s3",
    name: "Casablanca Prime Properties",
    niche: "Real Estate",
    city: "Casablanca",
    phone: "+212 5 22 98 14 00",
    email: "info@casablancaprime.ma",
    status: "Proposal Sent",
    retainerMad: 6000,
    notes: "Demo delivered on Thursday. Waiting for director contract signoff.",
  },
  {
    id: "s4",
    name: "Clinique Esthétique Racine",
    niche: "Aesthetic",
    city: "Casablanca",
    phone: "+212 5 22 79 30 00",
    email: "admin@clinique-racine.ma",
    status: "Meeting Booked",
    retainerMad: 7500,
    notes: "Zoom call scheduled for Tuesday 15h00 with Dr. Leila.",
  },
  {
    id: "s5",
    name: "Rabat Agdal Immobilier",
    niche: "Real Estate",
    city: "Rabat",
    phone: "+212 5 37 77 50 14",
    email: "agence@rabatagdalimmo.ma",
    status: "Contacted",
    retainerMad: 5000,
    notes: "Sent French cold email pitch with Loom video demo.",
  },
  {
    id: "s6",
    name: "Centre Dentaire Hassan II",
    niche: "Dentistry",
    city: "Rabat",
    phone: "+212 5 37 20 44 90",
    email: "contact@centredentairehassan.ma",
    status: "New",
    retainerMad: 4500,
    notes: "Scraped via Google Maps. Ready for WhatsApp outreach.",
  },
];

export function WorkspaceSheetsClient() {
  const [rows, setRows] = useState<SheetRow[]>(INITIAL_SHEET_ROWS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const totalValue = rows.reduce((acc, curr) => acc + curr.retainerMad, 0);
  const closedValue = rows
    .filter((r) => r.status === "Closed Won")
    .reduce((acc, curr) => acc + curr.retainerMad, 0);

  const filteredRows = rows.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.city.toLowerCase().includes(search.toLowerCase()) ||
      r.niche.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddRow = () => {
    const newRow: SheetRow = {
      id: `row_${Date.now()}`,
      name: "New Business Lead",
      niche: "Select Niche",
      city: "Casablanca",
      phone: "+212 6...",
      email: "contact@business.ma",
      status: "New",
      retainerMad: 5000,
      notes: "Click to write notes...",
    };
    setRows([newRow, ...rows]);
    toast.success("New spreadsheet row created!");
  };

  const handleUpdateStatus = (id: string, newStatus: SheetRow["status"]) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    toast.success("Status updated!");
  };

  const handleDeleteRow = (id: string) => {
    setRows(rows.filter((r) => r.id !== id));
    toast.info("Row removed from sheet.");
  };

  const handleExportCSV = () => {
    const headers = ["Business", "Niche", "City", "Phone", "Email", "Status", "Retainer (MAD)", "Notes"];
    const csvRows = rows.map((r) => [
      `"${r.name}"`,
      `"${r.niche}"`,
      `"${r.city}"`,
      `"${r.phone}"`,
      `"${r.email}"`,
      `"${r.status}"`,
      r.retainerMad,
      `"${r.notes.replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...csvRows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `eensell_agency_sheet_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Spreadsheet exported to CSV!");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 mb-2">
            <Table2 className="w-3.5 h-3.5" />
            <span>Interactive Data Grid</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Agency Master Sheet
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Notion-style live data table to track, filter, and calculate all your agency client prospects and retainers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={handleAddRow}
            size="sm"
            className="font-bold bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Row</span>
          </Button>

          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="font-bold border-border gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* ── Stats Summary Bar ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-card border border-border">
          <span className="text-muted-foreground">Total Leads Tracked</span>
          <div className="text-xl font-black text-foreground mt-0.5">{rows.length}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-card border border-border">
          <span className="text-muted-foreground">Active Monthly Retainers</span>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            {closedValue.toLocaleString()} MAD
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-card border border-border">
          <span className="text-muted-foreground">Total Pipeline Potential</span>
          <div className="text-xl font-black text-primary mt-0.5">
            {totalValue.toLocaleString()} MAD
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-card border border-border">
          <span className="text-muted-foreground">Conversion Rate</span>
          <div className="text-xl font-black text-blue-600 dark:text-blue-400 mt-0.5">
            {Math.round((rows.filter((r) => r.status === "Closed Won").length / rows.length) * 100)}%
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search company, city, niche..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-card text-xs text-foreground focus:outline-hidden focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {["ALL", "New", "Contacted", "Meeting Booked", "Proposal Sent", "Closed Won"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                filterStatus === st
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* ── The Spreadsheet Grid ── */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-muted-foreground font-semibold">
                <th className="p-3 pl-4">Business Name</th>
                <th className="p-3">Niche</th>
                <th className="p-3">City</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Email</th>
                <th className="p-3">Status</th>
                <th className="p-3">Retainer (MAD)</th>
                <th className="p-3 min-w-[200px]">Notes</th>
                <th className="p-3 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRows.map((row) => (
                <tr key={row.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="p-3 pl-4 font-bold text-foreground">
                    <input
                      type="text"
                      defaultValue={row.name}
                      onBlur={(e) => {
                        row.name = e.target.value;
                      }}
                      className="bg-transparent border-none focus:outline-hidden focus:bg-muted/40 rounded px-1 w-full font-bold text-foreground"
                    />
                  </td>

                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                      {row.niche}
                    </span>
                  </td>

                  <td className="p-3 text-muted-foreground">{row.city}</td>

                  <td className="p-3 font-mono text-muted-foreground">{row.phone}</td>

                  <td className="p-3 text-muted-foreground truncate max-w-[150px]">{row.email}</td>

                  <td className="p-3">
                    <select
                      value={row.status}
                      onChange={(e) => handleUpdateStatus(row.id, e.target.value as any)}
                      className={`text-xs font-bold px-2 py-1 rounded-md border-none focus:outline-hidden cursor-pointer ${
                        row.status === "Closed Won"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black"
                          : row.status === "Proposal Sent"
                          ? "bg-amber-500/10 text-amber-600"
                          : row.status === "Meeting Booked"
                          ? "bg-blue-500/10 text-blue-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Meeting Booked">Meeting Booked</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                      <option value="Closed Won">Closed Won (Active)</option>
                    </select>
                  </td>

                  <td className="p-3 font-mono font-bold text-foreground">
                    <input
                      type="number"
                      defaultValue={row.retainerMad}
                      onBlur={(e) => {
                        row.retainerMad = Number(e.target.value);
                        setRows([...rows]);
                      }}
                      className="bg-transparent border-none focus:outline-hidden focus:bg-muted/40 rounded px-1 w-24 font-mono font-bold text-foreground"
                    />
                  </td>

                  <td className="p-3 text-muted-foreground">
                    <input
                      type="text"
                      defaultValue={row.notes}
                      onBlur={(e) => {
                        row.notes = e.target.value;
                      }}
                      className="bg-transparent border-none focus:outline-hidden focus:bg-muted/40 rounded px-1 w-full text-muted-foreground text-xs"
                    />
                  </td>

                  <td className="p-3 text-right pr-4">
                    <button
                      onClick={() => handleDeleteRow(row.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-destructive transition-all"
                      title="Delete row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
