"use client";

import { motion } from "framer-motion";
import { UserPlus, Clock, CreditCard, ShieldCheck } from "lucide-react";

interface FunnelData {
  accountsCreated: number;
  pendingPayments: number;
  paidStudents: number;
  activatedAccounts: number;
}

export function ConversionFunnel({ data }: { data: FunnelData }) {
  // To show funnel correctly:
  // Accounts Created is the total "top of funnel".
  // Pending Payments + Paid Students should equal Accounts Created if everyone is in the funnel.
  // Actually, Total Accounts = pending + paid + (others?). Let's just use the raw numbers provided.
  const max = Math.max(data.accountsCreated, 1);

  const steps = [
    {
      id: "accounts",
      label: "Accounts Created",
      value: data.accountsCreated,
      icon: UserPlus,
      color: "bg-purple-500",
      textColor: "text-purple-500",
    },
    {
      id: "pending",
      label: "Pending Payment",
      value: data.pendingPayments,
      icon: Clock,
      color: "bg-amber-500",
      textColor: "text-amber-500",
    },
    {
      id: "paid",
      label: "Paid",
      value: data.paidStudents,
      icon: CreditCard,
      color: "bg-emerald-500",
      textColor: "text-emerald-500",
    },
    {
      id: "activated",
      label: "Activated",
      value: data.activatedAccounts,
      icon: ShieldCheck,
      color: "bg-blue-500",
      textColor: "text-blue-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm"
    >
      <div className="mb-8 text-center sm:text-left">
        <h3 className="text-lg font-black text-foreground">Conversion Funnel</h3>
        <p className="text-sm text-muted-foreground font-medium">Tracking user journey drop-offs</p>
      </div>

      <div className="space-y-4 max-w-2xl mx-auto">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const percentage = ((step.value / max) * 100).toFixed(1);
          
          // Conversion from previous step
          let conversionFromPrev = null;
          if (i > 0) {
            const prevValue = steps[i - 1].value;
            if (prevValue > 0) {
              conversionFromPrev = ((step.value / prevValue) * 100).toFixed(1);
            } else {
              conversionFromPrev = "0.0";
            }
          }

          return (
            <div key={step.id} className="relative">
              {/* Connector line for conversion % */}
              {i > 0 && (
                <div className="absolute -top-4 left-6 sm:left-1/2 sm:-translate-x-1/2 flex items-center justify-center h-4 z-10">
                  <div className="bg-secondary text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded-full border border-border/50">
                    {conversionFromPrev}%
                  </div>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full flex-1">
                  <div className="bg-muted/30 rounded-xl p-4 border border-border/50 flex items-center justify-between group hover:border-border transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-secondary`}>
                        <Icon className={`w-5 h-5 ${step.textColor}`} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-foreground">{step.label}</p>
                        <p className="text-xs text-muted-foreground font-medium">{percentage}% of total</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black">{step.value}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
