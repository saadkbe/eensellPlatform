"use client";

import { motion } from "framer-motion";
import { DollarSign, Users, Clock, ShieldCheck, UserPlus, TrendingUp, Target, BarChart2 } from "lucide-react";

interface KpiData {
  totalRevenue: number;
  paidStudents: number;
  pendingPayments: number;
  activatedAccounts: number;
  newAccountsToday: number;
  averageSalesPerDay: number;
  studentsNeededToday: number;
  averageRevenuePerDay: number;
}

export function KpiGrid({ data }: { data: KpiData }) {
  const cards = [
    {
      title: "Total Revenue",
      value: `${data.totalRevenue.toLocaleString()} MAD`,
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      delay: 0.1,
    },
    {
      title: "Paid Students",
      value: data.paidStudents,
      icon: Users,
      color: "text-brand",
      bg: "bg-brand/10",
      delay: 0.15,
    },
    {
      title: "Pending Payments",
      value: data.pendingPayments,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      delay: 0.2,
    },
    {
      title: "Activated Accounts",
      value: data.activatedAccounts,
      icon: ShieldCheck,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      delay: 0.25,
    },
    {
      title: "New Accounts Today",
      value: data.newAccountsToday,
      icon: UserPlus,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      delay: 0.3,
    },
    {
      title: "Avg. Sales / Day",
      value: data.averageSalesPerDay.toFixed(1),
      icon: TrendingUp,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      delay: 0.35,
    },
    {
      title: "Students Needed Today",
      value: Math.ceil(data.studentsNeededToday),
      icon: Target,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      delay: 0.4,
    },
    {
      title: "Avg. Revenue / Day",
      value: `${Math.round(data.averageRevenuePerDay).toLocaleString()} MAD`,
      icon: BarChart2,
      color: "text-teal-500",
      bg: "bg-teal-500/10",
      delay: 0.45,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: card.delay }}
            className="bg-card border border-border/50 rounded-2xl p-5 hover:border-border transition-colors shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${card.bg}`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-black text-foreground">
                  {card.value}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
