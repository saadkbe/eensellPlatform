"use client";

import { useState, useTransition } from "react";
import { approveUser, rejectUser } from "@/actions/admin.actions";
import { toast } from "sonner";
import { UserCheck, UserX, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PendingUser = {
  id: string; email: string; firstName: string | null;
  lastName: string | null; createdAt: Date;
};

export function PendingList({ initialUsers }: { initialUsers: PendingUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [isPending, startTransition] = useTransition();

  const handleApprove = (userId: string) => {
    startTransition(async () => {
      try {
        await approveUser(userId);
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        toast.success("User approved and email sent!");
      } catch { toast.error("Failed to approve"); }
    });
  };

  const handleReject = (userId: string) => {
    startTransition(async () => {
      try {
        await rejectUser(userId);
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        toast.success("User rejected");
      } catch { toast.error("Failed to reject"); }
    });
  };

  return (
    <Card className="bg-white/[0.02] backdrop-blur-sm border-white/[0.06] rounded-2xl shadow-xl">
      <CardHeader className="border-b border-white/[0.06] bg-white/[0.02] pb-4">
        <CardTitle className="text-white text-lg font-bold flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          Pending Approvals ({users.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <p className="text-base font-medium text-white">All caught up!</p>
            <p className="text-sm text-white/40 mt-1">No pending approvals.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] hover:border-white/[0.1] hover:bg-white/[0.04] hover:shadow-lg transition-all group">
                <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
                  <div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0 text-lg font-bold text-amber-400 group-hover:scale-110 transition-transform">
                    {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-base text-white font-semibold truncate group-hover:text-indigo-400 transition-colors">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-white/40 truncate">{user.email}</p>
                    <p className="text-xs text-white/40 mt-1">
                      Signed up {user.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                  <Button size="sm" onClick={() => handleApprove(user.id)} disabled={isPending}
                    className="flex-1 sm:flex-none bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 h-10 px-4 text-sm font-semibold rounded-xl">
                    <UserCheck className="w-4 h-4 mr-2" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleReject(user.id)} disabled={isPending}
                    className="flex-1 sm:flex-none border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 h-10 px-4 text-sm font-semibold rounded-xl bg-transparent">
                    <UserX className="w-4 h-4 mr-2" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
