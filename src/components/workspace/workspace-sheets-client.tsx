"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table2,
  Plus,
  Download,
  Trash2,
  Search,
  ChevronDown,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
    niche: "Aesthetic Clinic",
    city: "Casablanca",
    phone: "+212 5 22 39 10 20",
    email: "contact@cliniqueracine.ma",
    status: "Meeting Booked",
    retainerMad: 7000,
    notes: "Zoom call scheduled for Tuesday 15:00. Interested in multilingual booking.",
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
    notes: "Reached out via WhatsApp voice note. Opened demo link.",
  },
  {
    id: "s6",
    name: "Palmeraie Luxury Villas",
    niche: "Hospitality & Villas",
    city: "Marrakech",
    phone: "+212 5 24 33 80 00",
    email: "reservations@palmeraievillas.ma",
    status: "New",
    retainerMad: 8000,
    notes: "Scraped via Google Maps. High review count, needs instant guest response.",
  },
];

export function WorkspaceSheetsClient() {
  const [rows, setRows] = useState<SheetRow[]>(INITIAL_SHEET_ROWS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredRows = rows.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.niche.toLowerCase().includes(search.toLowerCase()) ||
      r.city.toLowerCase().includes(search.toLowerCase()) ||
      r.notes.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalValue = rows.reduce((acc, r) => acc + (Number(r.retainerMad) || 0), 0);
  const closedValue = rows
    .filter((r) => r.status === "Closed Won")
    .reduce((acc, r) => acc + (Number(r.retainerMad) || 0), 0);

  const handleAddRow = () => {
    const newRow: SheetRow = {
      id: `new_${Date.now()}`,
      name: "New Agency Client",
      niche: "Real Estate",
      city: "Casablanca",
      phone: "+212 6 ...",
      email: "contact@client.ma",
      status: "New",
      retainerMad: 4500,
      notes: "Lead captured. Follow up this week.",
    };
    setRows([newRow, ...rows]);
    toast.success("New row added to database table!");
  };

  const handleUpdateRow = (id: string, field: keyof SheetRow, value: any) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const handleDeleteRow = (id: string) => {
    setRows(rows.filter((r) => r.id !== id));
    toast.info("Row removed from table.");
  };

  const handleExportCSV = () => {
    const headers = ["Business Name", "Niche", "City", "Phone", "Email", "Status", "Retainer (MAD)", "Notes"];
    const csvRows = rows.map((r) => [
      `"${r.name}"`,
      `"${r.niche}"`,
      `"${r.city}"`,
      `"${r.phone}"`,
      `"${r.email}"`,
      `"${r.status}"`,
      r.retainerMad,
      `"${r.notes.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...csvRows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `eensell_database_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Database exported to CSV!");
  };

  const getStatusBadge = (status: SheetRow["status"]) => {
    switch (status) {
      case "Closed Won":
        return "bg-[#DEFBE6] text-[#0F7B34] dark:bg-[#1C3E25] dark:text-[#4ADE80]";
      case "Proposal Sent":
        return "bg-[#FBF3DB] text-[#89632A] dark:bg-[#3D3219] dark:text-[#FACC15]";
      case "Meeting Booked":
        return "bg-[#E8DEEE] text-[#6940A5] dark:bg-[#322340] dark:text-[#C084FC]";
      case "Contacted":
        return "bg-[#E0ECFD] text-[#245B9E] dark:bg-[#1E2D4A] dark:text-[#60A5FA]";
      default:
        return "bg-[#F1F1EF] text-[#5A5A58] dark:bg-[#2B2B2A] dark:text-[#A8A7A4]";
    }
  };

  return (
    <div className="p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto w-full space-y-6">
      {/* ── Notion Header ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs text-[#787774] dark:text-[#9B9A97]">
          <span>Eensell Workspace</span>
          <span>/</span>
          <span className="text-[#37352F] dark:text-[#E6E6E5] font-medium">Agency Sheets</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-3">
            <span className="text-3xl select-none">📊</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#37352F] dark:text-[#E6E6E5]">
                Agency Master Database
              </h1>
              <p className="text-xs text-[#787774] dark:text-[#9B9A97] mt-0.5">
                Notion-style data grid to track clients, retainers, and deal stages.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleAddRow}
              size="sm"
              className="font-medium text-xs bg-[#37352F] hover:bg-[#262420] dark:bg-[#E6E6E5] dark:hover:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#191919] gap-1.5 h-8 px-3 rounded-md shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Row</span>
            </Button>

            <Button
              onClick={handleExportCSV}
              variant="outline"
              size="sm"
              className="text-xs font-medium border-[#EDEDEB] dark:border-[#2E2E2E] text-[#37352F] dark:text-[#E6E6E5] gap-1.5 h-8 px-3 rounded-md hover:bg-[#F7F6F3] dark:hover:bg-[#2A2A2A] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E]">
          <span className="text-[#787774] dark:text-[#9B9A97]">Total Leads Tracked</span>
          <div className="text-lg font-bold text-[#37352F] dark:text-[#E6E6E5] mt-0.5">{rows.length}</div>
        </div>
        <div className="p-3 rounded-lg bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E]">
          <span className="text-[#787774] dark:text-[#9B9A97]">Active Monthly Retainers</span>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {closedValue.toLocaleString()} MAD
          </div>
        </div>
        <div className="p-3 rounded-lg bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E]">
          <span className="text-[#787774] dark:text-[#9B9A97]">Pipeline Potential</span>
          <div className="text-lg font-bold text-[#37352F] dark:text-[#E6E6E5] mt-0.5">
            {totalValue.toLocaleString()} MAD
          </div>
        </div>
        <div className="p-3 rounded-lg bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E]">
          <span className="text-[#787774] dark:text-[#9B9A97]">Win Rate</span>
          <div className="text-lg font-bold text-[#37352F] dark:text-[#E6E6E5] mt-0.5">
            {Math.round((rows.filter((r) => r.status === "Closed Won").length / rows.length) * 100)}%
          </div>
        </div>
      </div>

      {/* ── Search & Filter Bar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#787774] dark:text-[#9B9A97]" />
          <input
            type="text"
            placeholder="Filter database..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-md border border-[#EDEDEB] dark:border-[#2E2E2E] bg-[#FFFFFF] dark:bg-[#202020] text-xs text-[#37352F] dark:text-[#E6E6E5] placeholder-[#9B9A97] outline-none focus:border-[#787774]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {["ALL", "New", "Contacted", "Meeting Booked", "Proposal Sent", "Closed Won"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                statusFilter === st
                  ? "bg-[#37352F] text-[#FFFFFF] dark:bg-[#E6E6E5] dark:text-[#191919]"
                  : "bg-[#F7F6F3] dark:bg-[#202020] text-[#787774] dark:text-[#9B9A97] hover:text-[#37352F] dark:hover:text-[#E6E6E5]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* ── Notion Table Grid ── */}
      <div className="border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-lg overflow-hidden bg-[#FFFFFF] dark:bg-[#202020]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#F7F6F3] dark:bg-[#1E1E1E] border-b border-[#EDEDEB] dark:border-[#2E2E2E] text-[#787774] dark:text-[#9B9A97] text-[11px]">
              <tr>
                <th className="py-2 px-3 font-medium border-r border-[#EDEDEB] dark:border-[#2E2E2E]">Aa Client Name</th>
                <th className="py-2 px-3 font-medium border-r border-[#EDEDEB] dark:border-[#2E2E2E]">🏷️ Niche</th>
                <th className="py-2 px-3 font-medium border-r border-[#EDEDEB] dark:border-[#2E2E2E]">📍 City</th>
                <th className="py-2 px-3 font-medium border-r border-[#EDEDEB] dark:border-[#2E2E2E]">🔘 Status</th>
                <th className="py-2 px-3 font-medium border-r border-[#EDEDEB] dark:border-[#2E2E2E]">💰 Retainer (MAD)</th>
                <th className="py-2 px-3 font-medium border-r border-[#EDEDEB] dark:border-[#2E2E2E]">📞 Phone</th>
                <th className="py-2 px-3 font-medium">📝 Notes</th>
                <th className="py-2 px-2 text-center w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEDEB] dark:divide-[#2E2E2E]">
              {filteredRows.map((r) => (
                <tr key={r.id} className="hover:bg-[#F7F6F3]/50 dark:hover:bg-[#252525] group">
                  <td className="py-1.5 px-3 border-r border-[#EDEDEB] dark:border-[#2E2E2E] font-medium text-[#37352F] dark:text-[#E6E6E5]">
                    <input
                      type="text"
                      value={r.name}
                      onChange={(e) => handleUpdateRow(r.id, "name", e.target.value)}
                      className="w-full bg-transparent outline-none focus:bg-amber-500/10 px-1 py-0.5 rounded"
                    />
                  </td>
                  <td className="py-1.5 px-3 border-r border-[#EDEDEB] dark:border-[#2E2E2E] text-[#787774] dark:text-[#9B9A97]">
                    <input
                      type="text"
                      value={r.niche}
                      onChange={(e) => handleUpdateRow(r.id, "niche", e.target.value)}
                      className="w-full bg-transparent outline-none focus:bg-amber-500/10 px-1 py-0.5 rounded"
                    />
                  </td>
                  <td className="py-1.5 px-3 border-r border-[#EDEDEB] dark:border-[#2E2E2E] text-[#787774] dark:text-[#9B9A97]">
                    <input
                      type="text"
                      value={r.city}
                      onChange={(e) => handleUpdateRow(r.id, "city", e.target.value)}
                      className="w-full bg-transparent outline-none focus:bg-amber-500/10 px-1 py-0.5 rounded"
                    />
                  </td>
                  <td className="py-1.5 px-3 border-r border-[#EDEDEB] dark:border-[#2E2E2E]">
                    <select
                      value={r.status}
                      onChange={(e) => handleUpdateRow(r.id, "status", e.target.value as any)}
                      className={`text-[11px] font-medium px-2 py-0.5 rounded outline-none cursor-pointer ${getStatusBadge(
                        r.status
                      )}`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Meeting Booked">Meeting Booked</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                      <option value="Closed Won">Closed Won</option>
                    </select>
                  </td>
                  <td className="py-1.5 px-3 border-r border-[#EDEDEB] dark:border-[#2E2E2E] font-semibold text-[#37352F] dark:text-[#E6E6E5]">
                    <input
                      type="number"
                      value={r.retainerMad}
                      onChange={(e) => handleUpdateRow(r.id, "retainerMad", Number(e.target.value))}
                      className="w-24 bg-transparent outline-none focus:bg-amber-500/10 px-1 py-0.5 rounded"
                    />
                  </td>
                  <td className="py-1.5 px-3 border-r border-[#EDEDEB] dark:border-[#2E2E2E] text-[#787774] dark:text-[#9B9A97] font-mono text-[11px]">
                    <input
                      type="text"
                      value={r.phone}
                      onChange={(e) => handleUpdateRow(r.id, "phone", e.target.value)}
                      className="w-full bg-transparent outline-none focus:bg-amber-500/10 px-1 py-0.5 rounded"
                    />
                  </td>
                  <td className="py-1.5 px-3 text-[#787774] dark:text-[#9B9A97]">
                    <input
                      type="text"
                      value={r.notes}
                      onChange={(e) => handleUpdateRow(r.id, "notes", e.target.value)}
                      className="w-full bg-transparent outline-none focus:bg-amber-500/10 px-1 py-0.5 rounded"
                    />
                  </td>
                  <td className="py-1.5 px-2 text-center">
                    <button
                      onClick={() => handleDeleteRow(r.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity text-[#9B9A97] cursor-pointer"
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

        {/* Notion "+ New" bottom bar */}
        <button
          onClick={handleAddRow}
          className="w-full py-2 px-3 text-left text-xs text-[#787774] dark:text-[#9B9A97] hover:text-[#37352F] dark:hover:text-[#E6E6E5] hover:bg-[#F7F6F3] dark:hover:bg-[#252525] transition-colors border-t border-[#EDEDEB] dark:border-[#2E2E2E] flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New page / row</span>
        </button>
      </div>
    </div>
  );
}
