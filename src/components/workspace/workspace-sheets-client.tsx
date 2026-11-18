"use client";

import { useState, useRef } from "react";
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
import { DeleteConfirmationModal } from "@/components/workspace/delete-confirmation-modal";
import { VerifiedCheckBadge, GlowingPulseSticker } from "@/components/workspace/workspace-stickers";
import {
  addLeadToCrmAction,
  deleteLeadAction,
  updateLeadDetailsAction,
  updateRetainerAction,
} from "@/actions/workspace.actions";

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


interface WorkspaceSheetsClientProps {
  initialLeads?: any[];
  initialRetainers?: any[];
}

export function WorkspaceSheetsClient({
  initialLeads = [],
  initialRetainers = [],
}: WorkspaceSheetsClientProps) {
  const mappedRows: SheetRow[] = [
    ...initialRetainers.map((r: any) => ({
      id: `ret_${r.id}`,
      name: r.clientName,
      niche: r.service,
      city: r.city || "Casablanca",
      phone: r.phone || "—",
      email: "—",
      status: (r.status === "active" ? "Closed Won" : "Proposal Sent") as SheetRow["status"],
      retainerMad: Number(r.monthlyFee) || 5000,
      notes: `Recurring ${r.service} contract`,
    })),
    ...initialLeads.map((l: any) => ({
      id: `lead_${l.id}`,
      name: l.businessName,
      niche: l.niche,
      city: l.city,
      phone: l.phone || "—",
      email: l.email || "—",
      status: (l.status === "MEETING_BOOKED" ? "Meeting Booked" : l.status === "REPLIED" ? "Proposal Sent" : "Contacted") as SheetRow["status"],
      retainerMad: 5000,
      notes: l.replyNotes || "Prospect outreach",
    })),
  ];

  const [rows, setRows] = useState<SheetRow[]>(mappedRows);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<SheetRow | null>(null);
  const saveDebounceMap = useRef<Record<string, NodeJS.Timeout>>({});

  const persistRowUpdate = (row: SheetRow) => {
    if (saveDebounceMap.current[row.id]) {
      clearTimeout(saveDebounceMap.current[row.id]);
    }

    saveDebounceMap.current[row.id] = setTimeout(async () => {
      try {
        if (row.id.startsWith("lead_")) {
          const leadId = row.id.replace("lead_", "");
          let leadStatus: "PENDING" | "SENT" | "OPENED" | "REPLIED" | "MEETING_BOOKED" | "DECLINED" = "PENDING";
          if (row.status === "Meeting Booked") leadStatus = "MEETING_BOOKED";
          else if (row.status === "Proposal Sent" || row.status === "Closed Won") leadStatus = "REPLIED";
          else if (row.status === "Contacted") leadStatus = "SENT";

          await updateLeadDetailsAction({
            id: leadId,
            businessName: row.name,
            niche: row.niche,
            city: row.city,
            phone: row.phone === "—" ? "" : row.phone,
            email: row.email === "—" ? "" : row.email,
            status: leadStatus,
            replyNotes: row.notes,
          });
        } else if (row.id.startsWith("ret_")) {
          const retainerId = row.id.replace("ret_", "");
          await updateRetainerAction({
            id: retainerId,
            clientName: row.name,
            service: row.niche,
            city: row.city,
            phone: row.phone === "—" ? "" : row.phone,
            monthlyFee: Number(row.retainerMad) || 5000,
            status: row.status === "Closed Won" ? "active" : "pending_payment",
          });
        }
      } catch (err) {
        console.error("Failed to auto-save sheet row:", err);
      }
    }, 800);
  };

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

  const handleAddRow = async () => {
    try {
      const res = await addLeadToCrmAction({
        businessName: "New Client Lead",
        niche: "Real Estate",
        city: "Casablanca",
        phone: "+212 6 ...",
        status: "PENDING",
      });
      if (res.success && res.lead) {
        const newRow: SheetRow = {
          id: `lead_${res.lead.id}`,
          name: res.lead.businessName,
          niche: res.lead.niche,
          city: res.lead.city,
          phone: res.lead.phone || "—",
          email: res.lead.email,
          status: "New",
          retainerMad: 5000,
          notes: "Prospect saved to database",
        };
        setRows([newRow, ...rows]);
        toast.success("New client lead saved to database!");
      }
    } catch {
      toast.error("Erreur lors de la création de la ligne");
    }
  };

  const handleUpdateRow = (id: string, field: keyof SheetRow, value: any) => {
    const updated = rows.map((r) => {
      if (r.id === id) {
        const next = { ...r, [field]: value };
        persistRowUpdate(next);
        return next;
      }
      return r;
    });
    setRows(updated);
  };

  const requestDeleteRow = (row: SheetRow) => {
    setRowToDelete(row);
    setDeleteModalOpen(true);
  };

  const confirmDeleteRow = async () => {
    if (!rowToDelete) return;
    const id = rowToDelete.id;
    setRows(rows.filter((r) => r.id !== id));
    if (id.startsWith("lead_")) {
      const realId = id.replace("lead_", "");
      try {
        await deleteLeadAction(realId);
        toast.info("Prospect supprimé de la base de données");
      } catch {
        // silent
      }
    } else {
      toast.info("Ligne supprimée");
    }
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
    <div className="w-full px-3 sm:px-5 lg:px-6 py-4 sm:py-5 space-y-6 select-text">
      {/* ── Top Header Banner with Distinct Background ── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-md shrink-0">
              <VerifiedCheckBadge className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  DATABASE &bull; AGENCY SPREADSHEETS
                </span>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <GlowingPulseSticker className="w-2 h-2" color="#10B981" />
                  Auto-Save Active
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Agency Master Database
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Notion-style live data grid to track clients, phone numbers, retainers, and deal stages. Edit inline with instant DB auto-save.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              onClick={handleAddRow}
              size="sm"
              className="font-bold text-xs bg-white hover:bg-slate-100 text-slate-950 gap-1.5 h-9 px-4 rounded-xl shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add New Row</span>
            </Button>

            <Button
              onClick={handleExportCSV}
              variant="outline"
              size="sm"
              className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border-white/20 gap-1.5 h-9 px-3.5 rounded-xl cursor-pointer shadow-xs backdrop-blur-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <span>Database Summary Metrics</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-slate-200/90 dark:border-white/10 shadow-xs">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Leads Tracked</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{rows.length}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-slate-200/90 dark:border-white/10 shadow-xs">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Retainers</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
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
                      className="w-full bg-transparent outline-none focus:bg-slate-100 dark:focus:bg-white/10 px-1 py-0.5 rounded"
                    />
                  </td>
                  <td className="py-1.5 px-3 border-r border-[#EDEDEB] dark:border-[#2E2E2E] text-[#787774] dark:text-[#9B9A97]">
                    <input
                      type="text"
                      value={r.niche}
                      onChange={(e) => handleUpdateRow(r.id, "niche", e.target.value)}
                      className="w-full bg-transparent outline-none focus:bg-slate-100 dark:focus:bg-white/10 px-1 py-0.5 rounded"
                    />
                  </td>
                  <td className="py-1.5 px-3 border-r border-[#EDEDEB] dark:border-[#2E2E2E] text-[#787774] dark:text-[#9B9A97]">
                    <input
                      type="text"
                      value={r.city}
                      onChange={(e) => handleUpdateRow(r.id, "city", e.target.value)}
                      className="w-full bg-transparent outline-none focus:bg-slate-100 dark:focus:bg-white/10 px-1 py-0.5 rounded"
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
                      className="w-24 bg-transparent outline-none focus:bg-slate-100 dark:focus:bg-white/10 px-1 py-0.5 rounded"
                    />
                  </td>
                  <td className="py-1.5 px-3 border-r border-[#EDEDEB] dark:border-[#2E2E2E] text-[#787774] dark:text-[#9B9A97] font-mono text-[11px]">
                    <input
                      type="text"
                      value={r.phone}
                      onChange={(e) => handleUpdateRow(r.id, "phone", e.target.value)}
                      className="w-full bg-transparent outline-none focus:bg-slate-100 dark:focus:bg-white/10 px-1 py-0.5 rounded"
                    />
                  </td>
                  <td className="py-1.5 px-3 text-[#787774] dark:text-[#9B9A97]">
                    <input
                      type="text"
                      value={r.notes}
                      onChange={(e) => handleUpdateRow(r.id, "notes", e.target.value)}
                      className="w-full bg-transparent outline-none focus:bg-slate-100 dark:focus:bg-white/10 px-1 py-0.5 rounded"
                    />
                  </td>
                  <td className="py-1.5 px-2 text-center">
                    <button
                      onClick={() => requestDeleteRow(r)}
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

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Supprimer cette ligne ?"
        description="Cette action retirera ce prospect / contrat de votre tableau."
        itemName={rowToDelete?.name}
        onConfirm={confirmDeleteRow}
      />
    </div>
  );
}
