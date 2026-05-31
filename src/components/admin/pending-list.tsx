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
    <Card className="bg-card/60 backdrop-blur-md border-border/50 shadow-xl">
      <CardHeader className="border-b border-border/30 bg-muted/5 pb-4">
        <CardTitle className="text-foreground text-lg font-bold flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
            <Clock className="w-4 h-4 text-[#F59E0B]" />
          </div>
          Pending Approvals ({users.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-8 h-8 text-success" />
            </div>
            <p className="text-base font-medium text-foreground">All caught up!</p>
            <p className="text-sm text-muted-foreground mt-1">No pending approvals.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-5 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all group">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-[#F59E0B]/10 flex items-center justify-center shrink-0 text-lg font-bold text-[#F59E0B] group-hover:scale-110 transition-transform">
                    {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-base text-foreground font-semibold truncate group-hover:text-primary transition-colors">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Signed up {user.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Button size="sm" onClick={() => handleApprove(user.id)} disabled={isPending}
                    className="bg-success/10 text-success hover:bg-[#10B981]/20 border border-success/20 h-10 px-4 text-sm font-semibold rounded-xl">
                    <UserCheck className="w-4 h-4 mr-2" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleReject(user.id)} disabled={isPending}
                    className="border-[#EF4444]/20 text-[#EF4444] hover:bg-[#EF4444]/10 h-10 px-4 text-sm font-semibold rounded-xl">
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
