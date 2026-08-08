"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateWithdrawalStatus } from "@/actions/referral.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Loader2, Clock, Eye, EyeOff } from "lucide-react";

export function AdminWithdrawalsClient({ initialData }: { initialData: any }) {
  const [withdrawals, setWithdrawals] = useState(initialData);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showRib, setShowRib] = useState<Record<string, boolean>>({});

  const handleStatusChange = async (id: string, status: string) => {
    try {
      setProcessingId(id);
      await updateWithdrawalStatus(id, status);
      toast.success(`Withdrawal marked as ${status}`);
      // Optimistic update
      setWithdrawals((prev: any) => 
        prev.map((w: any) => w.id === id ? { ...w, status } : w)
      );
    } catch (error) {
      toast.error(`Failed to update status`);
    } finally {
      setProcessingId(null);
    }
  };

  const toggleRib = (id: string) => {
    setShowRib(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {withdrawals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Clock className="w-12 h-12 mb-4 opacity-20" />
            <p>No withdrawal requests found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {withdrawals.map((req: any) => (
            <Card key={req.id} className={req.status === "PENDING" ? "border-orange-500/50 shadow-md" : ""}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  
                  {/* User & Request Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg">
                        {req.user.firstName} {req.user.lastName}
                      </h3>
                      <span className="text-sm text-muted-foreground">{req.user.email}</span>
                      <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
                        req.status === "PENDING" ? "bg-orange-500/20 text-orange-600" :
                        req.status === "PAID" ? "bg-green-500/20 text-green-600" :
                        req.status === "PROCESSING" ? "bg-blue-500/20 text-blue-600" :
                        "bg-red-500/20 text-red-600"
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Requested on: {new Date(req.createdAt).toLocaleString()}
                    </div>
                    
                    <div className="mt-4 p-4 rounded-lg bg-muted/50 border space-y-2 inline-block min-w-[300px]">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-sm">Bank:</span>
                        <span className="font-medium text-sm">{req.payoutInfo.bankName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-sm">Account Name:</span>
                        <span className="font-medium text-sm">{req.payoutInfo.accountName}</span>
                      </div>
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-muted-foreground text-sm">RIB:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium tracking-widest">
                            {showRib[req.id] ? req.payoutInfo.rib : "•••• •••• •••• •••• •••• ••••"}
                          </span>
                          <button 
                            onClick={() => toggleRib(req.id)}
                            className="p-1 hover:bg-muted-foreground/10 rounded-md transition-colors"
                          >
                            {showRib[req.id] ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Amount & Actions */}
                  <div className="flex flex-col items-end gap-4 min-w-[200px]">
                    <div className="text-3xl font-black text-foreground">
                      {req.amount} <span className="text-xl text-muted-foreground font-semibold">MAD</span>
                    </div>

                    {req.status === "PENDING" || req.status === "PROCESSING" ? (
                      <div className="flex flex-col w-full gap-2 mt-2">
                        {req.status === "PENDING" && (
                          <Button 
                            variant="secondary"
                            onClick={() => handleStatusChange(req.id, "PROCESSING")}
                            disabled={processingId === req.id}
                            className="w-full bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
                          >
                            {processingId === req.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                            Mark as Processing
                          </Button>
                        )}
                        <Button 
                          onClick={() => handleStatusChange(req.id, "PAID")}
                          disabled={processingId === req.id}
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                          {processingId === req.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                          Mark as Paid
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => handleStatusChange(req.id, "REJECTED")}
                          disabled={processingId === req.id}
                          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          {processingId === req.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <X className="w-4 h-4 mr-2" />}
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground mt-4 text-right">
                        Processed at:<br/>
                        {req.processedAt ? new Date(req.processedAt).toLocaleString() : "Unknown"}
                      </div>
                    )}
                  </div>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
