"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateCommissionRate } from "@/actions/referral.actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Banknote, Clock, Wallet, Settings, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function AdminReferralClient({ initialData }: { initialData: any }) {
  const { stats, referrals } = initialData;
  const [rate, setRate] = useState(stats.commissionRate);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateRate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      await updateCommissionRate(Number(rate));
      toast.success(`Commission rate updated to ${rate} MAD`);
    } catch (error) {
      toast.error(`Failed to update commission rate`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" /> Total Referred
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReferred}</div>
            <p className="text-xs text-muted-foreground">{stats.successfulReferrals} Successful</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Banknote className="w-4 h-4" /> Total Generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.totalCommissionsGenerated} MAD</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wallet className="w-4 h-4" /> Total Paid Out
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.totalCommissionsPaid} MAD</div>
          </CardContent>
        </Card>

        <Card className="bg-orange-500/5 border-orange-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" /> Outstanding Liability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.outstandingBalance} MAD</div>
            <p className="text-xs text-muted-foreground mt-1">Pending unpaid commissions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Settings & Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" /> Commission Settings</CardTitle>
              <CardDescription>Adjust the fixed MAD reward for each successful referral.</CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateRate}>
              <CardContent>
                <div className="space-y-2">
                  <Label>Commission Rate (MAD)</Label>
                  <Input 
                    type="number" 
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    min="0"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isUpdating} className="w-full">
                  {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Settings
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card className="border-orange-500/30">
            <CardHeader>
              <CardTitle>Withdrawal Requests</CardTitle>
              <CardDescription>Manage and process student payouts.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">Pending Requests</span>
                <Badge variant={stats.pendingWithdrawalsCount > 0 ? "destructive" : "secondary"}>
                  {stats.pendingWithdrawalsCount}
                </Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/admin/referrals/withdrawals" className="w-full">
                <Button variant="outline" className="w-full justify-between hover:bg-orange-500/10 hover:text-orange-600 hover:border-orange-500/30">
                  Manage Withdrawals <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Global Referral Log */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Global Referral Log</CardTitle>
              <CardDescription>Latest referral activity across all students.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {referrals.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No referrals recorded yet.</div>
                ) : (
                  referrals.map((ref: any) => (
                    <div key={ref.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-muted/20 gap-4">
                      <div>
                        <p className="text-sm">
                          <span className="font-semibold">{ref.referrer.firstName} {ref.referrer.lastName}</span>
                          <span className="text-muted-foreground"> referred </span>
                          <span className="font-semibold">{ref.referredUser.firstName} {ref.referredUser.lastName}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Date: {new Date(ref.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
                        <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
                          ref.status === "SUCCESSFUL" ? "bg-green-500/20 text-green-600" : "bg-yellow-500/20 text-yellow-600"
                        }`}>
                          {ref.status}
                        </span>
                        <span className="text-sm font-semibold">{ref.commissionAmount} MAD</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
