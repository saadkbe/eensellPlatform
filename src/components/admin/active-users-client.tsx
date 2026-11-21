"use client";

import { UserCheck, Search, Calendar, ChevronRight, Award, Zap, Check, Clock, Crown, Phone, MessageCircle, ExternalLink } from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ExportReportButton } from "@/components/admin/export-report-button";
import { extendWorkspacePass } from "@/actions/admin.actions";
import { toast } from "sonner";

interface ActiveUser {
  id: string;
  rank: number;
  name: string;
  email: string;
  imageUrl: string | null;
  startDate: string;
  role: string;
  isPro: boolean;
  phone: string | null;
  workspaceExpiresAt: string | null;
  completedLessons: number;
}

export function ActiveUsersClient({ users: initialUsers }: { users: ActiveUser[] }) {
  const [users, setUsers] = useState<ActiveUser[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery))
    );
  }, [users, searchQuery]);

  const groupedUsers = useMemo(() => {
    const groups: Record<string, ActiveUser[]> = {};
    filteredUsers.forEach((user) => {
      const date = new Date(user.startDate);
      const monthYear = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(user);
    });
    return groups;
  }, [filteredUsers]);

  // Handle Quick Extend Action
  async function handleExtend(userId: string, months: number, name: string) {
    try {
      setLoadingUserId(userId);
      const updated = await extendWorkspacePass(userId, months);
      
      // Update local state instantly
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                workspaceExpiresAt: updated.workspaceExpiresAt
                  ? updated.workspaceExpiresAt.toISOString()
                  : null,
              }
            : u
        )
      );

      toast.success(
        `✅ Workspace OS prolongé de ${months} mois pour ${name} ! (Nouveau terme : ${new Date(
          updated.workspaceExpiresAt!
        ).toLocaleDateString()})`
      );
    } catch (e: any) {
      toast.error(e.message || "Erreur lors de la prolongation");
    } finally {
      setLoadingUserId(null);
    }
  }

  // Calculate user Workspace Pass status
  function getWorkspaceStatus(user: ActiveUser) {
    if (user.role === "ADMIN" || user.isPro) {
      return {
        label: "PRO Permanent",
        color: "bg-amber-50 text-amber-800 border-amber-300",
        icon: Crown,
      };
    }

    if (user.workspaceExpiresAt) {
      const expiry = new Date(user.workspaceExpiresAt);
      const now = new Date();
      if (expiry > now) {
        const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return {
          label: `Actif (${daysLeft}j)`,
          color: "bg-emerald-50 text-emerald-700 border-emerald-300",
          icon: Clock,
        };
      } else {
        return {
          label: "Expiré",
          color: "bg-rose-50 text-rose-700 border-rose-300",
          icon: Clock,
        };
      }
    }

    // No explicit expiration date: check if account age is within 30 days
    const accountAgeDays = Math.floor((Date.now() - new Date(user.startDate).getTime()) / (1000 * 60 * 60 * 24));
    if (accountAgeDays < 30) {
      return {
        label: `1er mois (${30 - accountAgeDays}j)`,
        color: "bg-emerald-50 text-emerald-700 border-emerald-300",
        icon: Clock,
      };
    }

    return {
      label: "Alumni Expiré",
      color: "bg-slate-100 text-slate-700 border-slate-300",
      icon: Clock,
    };
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-slate-900 pb-24">
      {/* ── HEADER ── */}
      <div className="w-full px-6 pt-10 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200/60 mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-1 flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-emerald-500" />
            Active Users & Workspace Passes
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Directory of active students with instant 1-click Workspace OS pass extensions.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search active users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-9 h-10 border-slate-200 bg-white rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-emerald-500"
            />
          </div>
          <ExportReportButton />
        </div>
      </div>

      <div className="w-full px-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] overflow-hidden">
          
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-3 px-6 py-4 border-b border-slate-200 bg-slate-50/50 items-center">
            <div className="col-span-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">#</div>
            <div className="col-span-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Étudiant</div>
            <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">WhatsApp</div>
            <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Inscription / Progrès</div>
            <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Workspace Pass</div>
            <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Recharge Action</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-100">
            {Object.entries(groupedUsers).map(([monthYear, monthUsers]) => (
              <div key={monthYear}>
                {/* Month Group Header */}
                <div className="bg-slate-50/80 border-b border-slate-100 px-6 py-2.5">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">{monthYear} <span className="text-slate-400 font-medium ml-1">({monthUsers.length})</span></h3>
                </div>
                
                {/* Month Users */}
                <div className="divide-y divide-slate-100">
                  {monthUsers.map((user) => {
                    const status = getWorkspaceStatus(user);
                    const StatusIcon = status.icon;
                    const isLoading = loadingUserId === user.id;

                    return (
                      <div key={user.id} className="grid grid-cols-12 gap-3 px-6 py-3.5 items-center hover:bg-slate-50/50 transition-colors group">
                        
                        {/* Rank */}
                        <div className="col-span-1 text-sm font-semibold text-slate-400">
                          {user.rank}
                        </div>

                        {/* User Info */}
                        <div className="col-span-3 flex items-center gap-3 min-w-0 pr-2">
                          {user.imageUrl ? (
                            <img src={user.imageUrl} alt={user.name} className="w-9 h-9 rounded-full border border-slate-200 shrink-0 object-cover" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-xs font-semibold text-slate-700">
                              {user.name[0]?.toUpperCase() || "U"}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                          </div>
                        </div>

                        {/* WhatsApp Direct Link */}
                        <div className="col-span-2 flex items-center">
                          {user.phone ? (
                            <a
                              href={`https://wa.me/${user.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Salam ${user.name}, c'est Saad de Eensell University.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200 transition-colors group/wa"
                              title={`Discuter avec ${user.name} sur WhatsApp (+${user.phone})`}
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100 shrink-0" />
                              <span className="font-mono text-[11px] truncate">+{user.phone}</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-40 group-hover/wa:opacity-100 shrink-0" />
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">
                              <Phone className="w-3 h-3 text-slate-300" />
                              En attente
                            </span>
                          )}
                        </div>

                        {/* Start Date & Progress */}
                        <div className="col-span-2 min-w-0">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium truncate">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>
                              {new Date(user.startDate).toLocaleDateString("fr-FR", { 
                                month: "short", 
                                day: "numeric", 
                                year: "numeric"
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mt-0.5">
                            <Award className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span>{user.completedLessons} leçons</span>
                          </div>
                        </div>

                        {/* Workspace Pass Status */}
                        <div className="col-span-2 flex items-center gap-1.5">
                          <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border", status.color)}>
                            <StatusIcon className="w-3 h-3" />
                            <span>{status.label}</span>
                          </span>
                        </div>

                        {/* 1-Click Recharge Actions */}
                        <div className="col-span-2 flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            disabled={isLoading}
                            onClick={() => handleExtend(user.id, 1, user.name)}
                            className="h-8 px-2.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs cursor-pointer flex items-center gap-1 transition-transform active:scale-95"
                            title="Ajouter 1 mois (199 MAD)"
                          >
                            <Zap className="w-3 h-3 fill-white" />
                            <span>{isLoading ? "..." : "+1M (199 DH)"}</span>
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isLoading}
                            onClick={() => handleExtend(user.id, 3, user.name)}
                            className="h-8 px-2 text-[11px] font-bold rounded-lg border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                            title="Ajouter 3 mois (499 MAD)"
                          >
                            +3M
                          </Button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-16">
                <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-900">No active users found</p>
                <p className="text-xs text-slate-500 mt-1">Try adjusting your search query.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
