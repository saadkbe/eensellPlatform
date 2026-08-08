"use client";

import { useState } from "react";
import { toast } from "sonner";
import { savePayoutInfo, requestWithdrawal } from "@/actions/referral.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, CheckCircle2, Wallet, Users, Target, Loader2, ArrowUpRight } from "lucide-react";

export function StudentReferralClient({ initialData }: { initialData: any }) {
  const { stats, referrals, withdrawals, payoutInfo } = initialData;
  const [copied, setCopied] = useState(false);
  const [isSavingPayout, setIsSavingPayout] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  
  // Payout Form State
  const [bankName, setBankName] = useState(payoutInfo?.bankName || "CIH Bank");
  const [accountName, setAccountName] = useState(payoutInfo?.accountName || "");
  const [rib, setRib] = useState("");
  const hasPayoutInfo = !!payoutInfo;
  
  const [withdrawalAmount, setWithdrawalAmount] = useState<number | "">(stats.availableBalance > 0 ? stats.availableBalance : "");

  const referralLink = typeof window !== "undefined" 
    ? `${window.location.origin}/join?ref=${stats.referralCode}`
    : `https://eensell.com/join?ref=${stats.referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`Join Eensell University and start learning AI to build your business! Use my link: ${referralLink}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleSavePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName || !accountName || (!hasPayoutInfo && !rib) || (rib && rib.length !== 24)) {
      toast.error("Please fill all fields. RIB must be 24 digits.");
      return;
    }

    try {
      setIsSavingPayout(true);
      if (!rib && hasPayoutInfo) {
          toast.error("Please enter your full 24-digit RIB to update.");
          setIsSavingPayout(false);
          return;
      }

      await savePayoutInfo({ bankName, accountName, rib });
      toast.success("Payout information saved successfully!");
      setRib("");
    } catch (error: any) {
      toast.error(error.message || "Failed to save payout info");
    } finally {
      setIsSavingPayout(false);
    }
  };

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawalAmount);
    if (!amount || amount <= 0) {
      toast.error("Invalid amount");
      return;
    }
    if (amount > stats.availableBalance) {
      toast.error("Insufficient balance");
      return;
    }

    try {
      setIsWithdrawing(true);
      await requestWithdrawal(amount);
      toast.success("Withdrawal request submitted successfully!");
      setWithdrawalAmount("");
    } catch (error: any) {
      toast.error(error.message || "Failed to request withdrawal");
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-orange-500/5 border-orange-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wallet className="w-4 h-4 text-orange-500" /> Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.availableBalance} MAD</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Loader2 className="w-4 h-4" /> Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingCommissions} MAD</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" /> Total Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRegistered}</div>
            <p className="text-xs text-muted-foreground">{stats.successfulReferrals} Paid</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="w-4 h-4" /> Total Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEarned} MAD</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── Left Column: Explainer & Link ── */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Share Link Card */}
          <Card className="border-orange-500/30 shadow-lg shadow-orange-500/5">
            <CardHeader>
              <CardTitle>Your Unique Referral Link</CardTitle>
              <CardDescription>Share this link to earn 50 MAD for every successful enrollment.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex items-center bg-muted rounded-md px-4 py-3 border border-border/50">
                  <span className="truncate text-sm font-mono text-muted-foreground w-full">
                    {referralLink}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleCopyLink}
                    className="shrink-0 w-28 bg-primary hover:bg-primary/90"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                  <Button 
                    onClick={handleWhatsAppShare}
                    variant="outline" 
                    className="shrink-0 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10"
                  >
                    WhatsApp
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Explainer Video & Rules */}
          <Card>
            <CardHeader>
              <CardTitle>How Refer & Earn Works</CardTitle>
              <CardDescription>Everything you need to know about our referral program.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="w-full aspect-video rounded-xl overflow-hidden bg-muted border relative group">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-4xl">🎥</span>
                    <p className="mt-2 text-sm text-muted-foreground font-medium">Explainer Video</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">1. Share Your Link</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Send your unique link to friends. When they click it, a secure 30-day cookie ensures you get credit.
                  </p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">2. Successful Payment</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Referrals show as <span className="text-yellow-500 font-medium">Pending</span> until the user makes a verified successful payment. Then it becomes <span className="text-green-500 font-medium">Successful</span>.
                  </p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">3. Earn 50 MAD</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    You earn exactly 50 MAD for every approved enrollment. Earnings are not guaranteed for refunded or fraudulent payments.
                  </p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">4. Withdraw Funds</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Request a withdrawal anytime. Processing typically takes <span className="font-medium text-foreground">2 business days</span> to hit your bank account.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* ── Right Column: Actions & History ── */}
        <div className="space-y-8">
          
          <Tabs defaultValue="withdraw" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
              <TabsTrigger value="settings">Payout Info</TabsTrigger>
            </TabsList>
            
            <TabsContent value="withdraw" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Request Withdrawal</CardTitle>
                  <CardDescription>Transfer your available balance to your bank account.</CardDescription>
                </CardHeader>
                <form onSubmit={handleWithdrawal}>
                  <CardContent className="space-y-4">
                    {!hasPayoutInfo ? (
                      <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
                        You must configure your payout information first in the Settings tab.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label>Amount (MAD)</Label>
                        <Input 
                          type="number" 
                          min="1" 
                          max={stats.availableBalance}
                          value={withdrawalAmount}
                          onChange={(e) => setWithdrawalAmount(Number(e.target.value))}
                          placeholder="0.00"
                          disabled={stats.availableBalance <= 0 || isWithdrawing}
                        />
                        <p className="text-xs text-muted-foreground text-right">
                          Available: {stats.availableBalance} MAD
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={!hasPayoutInfo || stats.availableBalance <= 0 || isWithdrawing}
                    >
                      {isWithdrawing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Withdraw Funds
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payout Information</CardTitle>
                  <CardDescription>Your bank details for receiving commissions.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSavePayout}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Bank Name</Label>
                      <Input 
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="e.g. CIH Bank"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Account Holder Name</Label>
                      <Input 
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        placeholder="Full Name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>RIB (24 Digits)</Label>
                      <Input 
                        type="password"
                        value={rib}
                        onChange={(e) => setRib(e.target.value)}
                        placeholder={hasPayoutInfo ? "•••• •••• •••• •••• •••• ••••" : "0000 0000 0000 0000 0000 0000"}
                        maxLength={24}
                        autoComplete="off"
                      />
                      {hasPayoutInfo && !rib && (
                        <p className="text-xs text-green-600 dark:text-green-400">
                          ✓ RIB is securely stored. Enter a new one to update.
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isSavingPayout}>
                      {isSavingPayout && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Save Information
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Recent Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              {referrals.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  You haven't referred anyone yet.
                </div>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {referrals.map((ref: any) => (
                    <div key={ref.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                          {ref.referredUser.imageUrl ? (
                            <img src={ref.referredUser.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <Users className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {ref.referredUser.firstName} {ref.referredUser.lastName?.charAt(0)}.
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(ref.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">
                          {ref.commissionAmount} MAD
                        </p>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          ref.status === "SUCCESSFUL" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                        }`}>
                          {ref.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
