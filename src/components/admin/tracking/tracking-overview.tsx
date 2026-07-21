"use client";

import { motion } from "framer-motion";
import { Calendar, Target, Users, DollarSign, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

interface CampaignProps {
  campaign: {
    name: string;
    startDate: Date;
    endDate: Date;
    studentGoal: number;
    pricePerStudent: number;
  };
  paidStudents: number;
  revenue: number;
  daysRemaining: number;
}

export function TrackingOverview({ campaign, paidStudents, revenue, daysRemaining }: CampaignProps) {
  const progress = Math.min((paidStudents / campaign.studentGoal) * 100, 100);
  const remainingStudents = Math.max(campaign.studentGoal - paidStudents, 0);
  const targetRevenue = campaign.studentGoal * campaign.pricePerStudent;
  const spotsPerDay = Math.ceil(remainingStudents / Math.max(daysRemaining, 1));

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Admin Tracking</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            Track the performance of your current enrollment campaign in real time.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border/60 px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm shrink-0"
        >
          <Calendar className="w-4 h-4 text-brand" />
          <span className="text-sm font-bold">{format(new Date(), "MMMM d, yyyy")}</span>
        </motion.div>
      </div>

      {/* Current Campaign Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="overflow-hidden border-border/50 shadow-xl bg-card relative">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand via-emerald-500 to-brand opacity-80" />
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
              
              {/* Campaign Info */}
              <div className="flex-1 space-y-6">
                <div>
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-brand/10 text-brand text-[11px] font-bold uppercase tracking-widest mb-3">
                    Active Campaign
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                    {campaign.name}
                  </h2>
                  <p className="text-muted-foreground text-sm font-medium flex items-center gap-2 mt-2">
                    {format(new Date(campaign.startDate), "MMM d, yyyy")} — {format(new Date(campaign.endDate), "MMM d, yyyy")}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                    <Target className="w-5 h-5 text-muted-foreground mb-2" />
                    <p className="text-xs font-bold text-muted-foreground uppercase">Student Goal</p>
                    <p className="text-lg font-black">{campaign.studentGoal}</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                    <DollarSign className="w-5 h-5 text-muted-foreground mb-2" />
                    <p className="text-xs font-bold text-muted-foreground uppercase">Price / Student</p>
                    <p className="text-lg font-black">{campaign.pricePerStudent} MAD</p>
                  </div>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="flex-1 w-full lg:max-w-md space-y-6 bg-secondary/30 rounded-2xl p-6 border border-border/40">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Campaign Progress</p>
                    <p className="text-3xl font-black text-foreground">
                      {paidStudents} <span className="text-xl text-muted-foreground font-semibold">/ {campaign.studentGoal}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-emerald-500">{progress.toFixed(1)}%</span>
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="h-4 bg-muted rounded-full overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full"
                  />
                  {/* Shimmer effect */}
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                  <div>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase mb-1">Remaining Students</p>
                    <p className="text-sm font-black flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-muted-foreground" />
                      {remainingStudents}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase mb-1">Revenue Goal</p>
                    <p className="text-sm font-black flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-brand" />
                      {revenue.toLocaleString()} / {targetRevenue.toLocaleString()} MAD
                    </p>
                  </div>
                </div>

                {/* Pace Required Section */}
                <div className="pt-2">
                  {remainingStudents > 0 ? (
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-rose-500">Pace Required</p>
                          <p className="text-[13px] text-foreground mt-1 leading-relaxed">
                            You need to close <span className="font-black">{remainingStudents} spots</span> in the next <span className="font-black">{daysRemaining} days</span>. That means closing an average of <span className="font-black bg-rose-500/20 px-1.5 py-0.5 rounded text-rose-600">{spotsPerDay} spots per day</span> to reach your goal before the deadline.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-emerald-500">Goal Achieved!</p>
                          <p className="text-[13px] text-foreground mt-1 leading-relaxed">
                            Congratulations! You have successfully reached your campaign goal ahead of the deadline.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
