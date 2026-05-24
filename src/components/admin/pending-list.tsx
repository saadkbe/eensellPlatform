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
    <Card className="bg-card/60 border-border">
      <CardHeader>
        <CardTitle className="text-foreground text-base font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#F59E0B]" /> Pending Approvals ({users.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-12">
            <UserCheck className="w-10 h-10 text-success/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">All caught up! No pending approvals.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 rounded-xl bg-background border border-border hover:border-primary/20 transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#F59E0B]/10 flex items-center justify-center shrink-0 text-sm font-medium text-[#F59E0B]">
                    {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-foreground font-medium truncate">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Signed up {user.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" onClick={() => handleApprove(user.id)} disabled={isPending}
                    className="bg-success/10 text-success hover:bg-[#10B981]/20 border border-success/20 h-8 text-xs">
                    <UserCheck className="w-3.5 h-3.5 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleReject(user.id)} disabled={isPending}
                    className="border-[#EF4444]/20 text-[#EF4444] hover:bg-[#EF4444]/10 h-8 text-xs">
                    <UserX className="w-3.5 h-3.5 mr-1" /> Reject
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
