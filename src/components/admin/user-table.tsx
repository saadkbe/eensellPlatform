"use client";

import { useState, useTransition } from "react";
import { approveUser, rejectUser, suspendUser, deleteUser } from "@/actions/admin.actions";
import { toast } from "sonner";
import { UserCheck, UserX, Ban, Trash2, MoreHorizontal, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { STATUS_LABELS, ROLE_LABELS } from "@/lib/constants";

type User = {
  id: string; email: string; firstName: string | null; lastName: string | null;
  role: "ADMIN" | "ACTIVE_USER" | "PENDING_USER";
  status: "PENDING" | "ACTIVE" | "SUSPENDED" | "REJECTED";
  createdAt: Date;
};

export function UserTable({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [isPending, startTransition] = useTransition();

  const filtered = users.filter((u) => {
    const matchSearch = !search || u.email.toLowerCase().includes(search.toLowerCase()) ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || u.status === filter;
    return matchSearch && matchFilter;
  });

  const handleAction = (action: string, userId: string) => {
    startTransition(async () => {
      try {
        if (action === "approve") { await approveUser(userId); toast.success("User approved"); }
        if (action === "reject") { await rejectUser(userId); toast.success("User rejected"); }
        if (action === "suspend") { await suspendUser(userId); toast.success("User suspended"); }
        if (action === "delete") { await deleteUser(userId); toast.success("User deleted"); }
        // Optimistic update
        setUsers((prev) => prev.map((u) => {
          if (u.id !== userId) return u;
          if (action === "approve") return { ...u, status: "ACTIVE" as const, role: "ACTIVE_USER" as const };
          if (action === "reject") return { ...u, status: "REJECTED" as const };
          if (action === "suspend") return { ...u, status: "SUSPENDED" as const };
          return u;
        }).filter((u) => action === "delete" ? u.id !== userId : true));
      } catch { toast.error("Action failed"); }
    });
  };

  const filters = ["all", "PENDING", "ACTIVE", "SUSPENDED", "REJECTED"];

  return (
    <Card className="bg-white/[0.02] backdrop-blur-sm border-white/[0.06] rounded-2xl shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-white text-base font-semibold">All Users ({filtered.length})</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 bg-white/[0.04] border-white/[0.08] text-white text-sm w-[240px] rounded-xl" />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === f ? "bg-indigo-500 text-white shadow-md" : "bg-white/[0.02] text-white/40 hover:bg-white/[0.04] hover:text-white"}`}>
              {f === "all" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12"><p className="text-sm text-white/40">No users found</p></div>
          ) : filtered.map((user) => {
            const statusInfo = STATUS_LABELS[user.status];
            const roleInfo = ROLE_LABELS[user.role];
            return (
              <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] hover:border-white/[0.1] hover:bg-white/[0.04] hover:shadow-md transition-all">
                <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/15 flex items-center justify-center shrink-0 text-base font-bold text-indigo-400">
                    {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-base text-white font-semibold truncate">{user.firstName || ""} {user.lastName || ""}</p>
                    <p className="text-sm text-white/40 truncate mt-0.5">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full sm:w-auto gap-3 shrink-0">
                  <div className="flex gap-2">
                    <Badge className={`text-xs px-2.5 py-0.5 hidden sm:inline-flex ${roleInfo.color}`}>{roleInfo.label}</Badge>
                    <Badge className={`text-xs px-2.5 py-0.5 ${statusInfo.color}`}>{statusInfo.label}</Badge>
                  </div>
                  {user.role !== "ADMIN" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.04]" disabled={isPending}>
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end" className="bg-[#0a0b10] border-white/[0.06] text-white">
                        {user.status !== "ACTIVE" && (
                          <DropdownMenuItem onClick={() => handleAction("approve", user.id)} className="text-emerald-400 focus:text-emerald-400 focus:bg-emerald-500/10 text-xs hover:bg-emerald-500/10">
                            <UserCheck className="w-3.5 h-3.5 mr-2" /> Approve
                          </DropdownMenuItem>
                        )}
                        {user.status === "PENDING" && (
                          <DropdownMenuItem onClick={() => handleAction("reject", user.id)} className="text-amber-400 focus:text-amber-400 focus:bg-amber-500/10 text-xs hover:bg-amber-500/10">
                            <UserX className="w-3.5 h-3.5 mr-2" /> Reject
                          </DropdownMenuItem>
                        )}
                        {user.status === "ACTIVE" && (
                          <DropdownMenuItem onClick={() => handleAction("suspend", user.id)} className="text-amber-400 focus:text-amber-400 focus:bg-amber-500/10 text-xs hover:bg-amber-500/10">
                            <Ban className="w-3.5 h-3.5 mr-2" /> Suspend
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className="bg-white/[0.06]" />
                        <DropdownMenuItem onClick={() => handleAction("delete", user.id)} className="text-rose-400 focus:text-rose-400 focus:bg-rose-500/10 text-xs hover:bg-rose-500/10">
                          <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
