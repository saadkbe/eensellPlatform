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
    <Card className="bg-card/60 border-border">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-foreground text-base font-semibold">All Users ({filtered.length})</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 bg-background border-border text-foreground text-xs w-[200px]" />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md text-xs transition-all ${filter === f ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"}`}>
              {f === "all" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12"><p className="text-sm text-muted-foreground">No users found</p></div>
          ) : filtered.map((user) => {
            const statusInfo = STATUS_LABELS[user.status];
            const roleInfo = ROLE_LABELS[user.role];
            return (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:border-primary/20 transition-all">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm font-medium text-primary">
                    {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-foreground font-medium truncate">{user.firstName || ""} {user.lastName || ""}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge className={`text-[10px] hidden sm:inline-flex ${roleInfo.color}`}>{roleInfo.label}</Badge>
                  <Badge className={`text-[10px] ${statusInfo.color}`}>{statusInfo.label}</Badge>
                  {user.role !== "ADMIN" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary" disabled={isPending}>
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end" className="bg-card border-border text-foreground">
                        {user.status !== "ACTIVE" && (
                          <DropdownMenuItem onClick={() => handleAction("approve", user.id)} className="text-success focus:text-success focus:bg-success/10 text-xs">
                            <UserCheck className="w-3.5 h-3.5 mr-2" /> Approve
                          </DropdownMenuItem>
                        )}
                        {user.status === "PENDING" && (
                          <DropdownMenuItem onClick={() => handleAction("reject", user.id)} className="text-[#F59E0B] focus:text-[#F59E0B] focus:bg-[#F59E0B]/10 text-xs">
                            <UserX className="w-3.5 h-3.5 mr-2" /> Reject
                          </DropdownMenuItem>
                        )}
                        {user.status === "ACTIVE" && (
                          <DropdownMenuItem onClick={() => handleAction("suspend", user.id)} className="text-[#F59E0B] focus:text-[#F59E0B] focus:bg-[#F59E0B]/10 text-xs">
                            <Ban className="w-3.5 h-3.5 mr-2" /> Suspend
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuItem onClick={() => handleAction("delete", user.id)} className="text-[#EF4444] focus:text-[#EF4444] focus:bg-[#EF4444]/10 text-xs">
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
