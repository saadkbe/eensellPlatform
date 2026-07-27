"use client";

import { useState, useEffect } from "react";
import { Users, UserCheck, Clock, BookOpen, TrendingUp, DollarSign, Shield, CalendarIcon, ChevronLeft, ChevronRight, Loader2, ArrowUpRight, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { STATUS_LABELS } from "@/lib/constants";
import { ExportReportButton } from "@/components/admin/export-report-button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type FilterType = "ALL_TIME" | "TODAY" | "LAST_7_DAYS" | "CUSTOM";

function DateRangePicker({
  filterType,
  setFilterType,
  customRange,
  setCustomRange,
  onClose
}: {
  filterType: FilterType;
  setFilterType: (type: FilterType) => void;
  customRange: { from: Date | null, to: Date | null };
  setCustomRange: (range: { from: Date | null, to: Date | null }) => void;
  onClose: () => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const isSameDay = (d1: Date, d2: Date) => {
    return d1 && d2 && d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  };

  const isWithinRange = (date: Date) => {
    if (!customRange.from || !customRange.to) return false;
    const d = new Date(date).setHours(0,0,0,0);
    const start = new Date(customRange.from).setHours(0,0,0,0);
    const end = new Date(customRange.to).setHours(0,0,0,0);
    return d > start && d < end;
  };

  const handleDayClick = (date: Date) => {
    setFilterType("CUSTOM");
    if (!customRange.from || (customRange.from && customRange.to)) {
      setCustomRange({ from: date, to: null });
    } else {
      if (date < customRange.from) {
        setCustomRange({ from: date, to: customRange.from });
      } else {
        setCustomRange({ from: customRange.from, to: date });
      }
    }
  };

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }
    
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
      const isStart = customRange.from && isSameDay(date, customRange.from);
      const isEnd = customRange.to && isSameDay(date, customRange.to);
      const isSelected = isStart || isEnd;
      const isMid = isWithinRange(date);
      
      days.push(
        <button
          key={d}
          onClick={() => handleDayClick(date)}
          className={cn(
            "h-8 w-8 rounded-lg flex items-center justify-center text-sm transition-all",
            isSelected ? "bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/25" : "",
            isMid && !isSelected ? "bg-indigo-500/10 text-indigo-300" : "",
            !isSelected && !isMid ? "hover:bg-white/[0.06] text-white/70" : ""
          )}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="p-3 w-[300px]">
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Button variant={filterType === "ALL_TIME" ? "default" : "outline"} size="sm" onClick={() => { setFilterType("ALL_TIME"); onClose(); }} className={filterType === "ALL_TIME" ? "bg-indigo-500 hover:bg-indigo-600 text-white border-0" : "border-white/10 text-white/60 hover:text-white hover:bg-white/[0.06]"}>All Time</Button>
        <Button variant={filterType === "TODAY" ? "default" : "outline"} size="sm" onClick={() => { setFilterType("TODAY"); onClose(); }} className={filterType === "TODAY" ? "bg-indigo-500 hover:bg-indigo-600 text-white border-0" : "border-white/10 text-white/60 hover:text-white hover:bg-white/[0.06]"}>Today</Button>
        <Button variant={filterType === "LAST_7_DAYS" ? "default" : "outline"} size="sm" onClick={() => { setFilterType("LAST_7_DAYS"); onClose(); }} className={filterType === "LAST_7_DAYS" ? "bg-indigo-500 hover:bg-indigo-600 text-white border-0" : "border-white/10 text-white/60 hover:text-white hover:bg-white/[0.06]"}>Last 7 Days</Button>
      </div>

      <div className="border-t border-white/[0.06] pt-4">
        <div className="flex items-center justify-between mb-3">
          <Button variant="outline" size="icon" className="h-7 w-7 border-white/10 text-white/60 hover:text-white hover:bg-white/[0.06]" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-semibold text-sm text-white">
            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </div>
          <Button variant="outline" size="icon" className="h-7 w-7 border-white/10 text-white/60 hover:text-white hover:bg-white/[0.06]" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-[11px] font-medium text-white/25 uppercase">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {renderDays()}
        </div>
        {filterType === "CUSTOM" && customRange.from && customRange.to && (
           <Button className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600 text-white border-0" size="sm" onClick={onClose}>Apply Range</Button>
        )}
      </div>
    </div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.4,
      ease: "easeOut" as const,
    },
  }),
};

export function AdminOverviewClient() {
  const [filterType, setFilterType] = useState<FilterType>("ALL_TIME");
  const [customRange, setCustomRange] = useState<{ from: Date | null, to: Date | null }>({ from: null, to: null });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [data, setData] = useState<any>({
    stats: { totalUsers: 0, activeUsers: 0, pendingUsers: 0, suspendedUsers: 0, totalModules: 0, totalLessons: 0, revenue: 0 },
    recentSignups: []
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        let url = `/api/admin/overview`;
        
        let fromDate = null;
        let toDate = null;

        if (filterType === "TODAY") {
          fromDate = new Date();
          toDate = new Date();
        } else if (filterType === "LAST_7_DAYS") {
          toDate = new Date();
          fromDate = new Date();
          fromDate.setDate(toDate.getDate() - 7);
        } else if (filterType === "CUSTOM" && customRange.from && customRange.to) {
          fromDate = customRange.from;
          toDate = customRange.to;
        }

        if (fromDate && toDate) {
          url += `?from=${fromDate.toISOString().split("T")[0]}&to=${toDate.toISOString().split("T")[0]}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch overview data");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    
    if (filterType !== "CUSTOM" || (customRange.from && customRange.to)) {
      fetchData();
    }
  }, [filterType, customRange]);

  const statsList = [
    { label: "Total Revenue", value: `${data.stats.revenue.toLocaleString()} MAD`, icon: DollarSign, gradient: "from-emerald-500 to-teal-600", glow: "shadow-emerald-500/20", iconBg: "bg-emerald-500/15", iconColor: "text-emerald-400" },
    { label: "Total Users", value: data.stats.totalUsers, icon: Users, gradient: "from-indigo-500 to-violet-600", glow: "shadow-indigo-500/20", iconBg: "bg-indigo-500/15", iconColor: "text-indigo-400" },
    { label: "Active Users", value: data.stats.activeUsers, icon: UserCheck, gradient: "from-sky-500 to-blue-600", glow: "shadow-sky-500/20", iconBg: "bg-sky-500/15", iconColor: "text-sky-400" },
    { label: "Pending Approvals", value: data.stats.pendingUsers, icon: Clock, gradient: "from-amber-500 to-orange-600", glow: "shadow-amber-500/20", iconBg: "bg-amber-500/15", iconColor: "text-amber-400" },
    { label: "Total Modules", value: data.stats.totalModules, icon: BookOpen, gradient: "from-violet-500 to-purple-600", glow: "shadow-violet-500/20", iconBg: "bg-violet-500/15", iconColor: "text-violet-400" },
    { label: "Suspended", value: data.stats.suspendedUsers, icon: AlertTriangle, gradient: "from-rose-500 to-red-600", glow: "shadow-rose-500/20", iconBg: "bg-rose-500/15", iconColor: "text-rose-400" },
  ];

  let displayDateText = "All Time";
  if (filterType === "TODAY") displayDateText = "Today";
  else if (filterType === "LAST_7_DAYS") displayDateText = "Last 7 Days";
  else if (filterType === "CUSTOM" && customRange.from && customRange.to) {
    displayDateText = `${customRange.from.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${customRange.to.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  }

  return (
    <>
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-6 sm:p-8 md:p-10">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.08] via-transparent to-violet-500/[0.05]" />
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-violet-500/8 rounded-full blur-[60px] pointer-events-none" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-4 border border-indigo-500/20 backdrop-blur-sm">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Control Center</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
              Platform Overview
            </h1>
            <p className="text-white/40 text-sm sm:text-base max-w-xl leading-relaxed">
              Monitor user growth, engagement metrics, and platform revenue all in one place.
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium h-11 px-5 py-2 transition-all duration-200",
                "bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.08] backdrop-blur-sm",
                filterType !== "ALL_TIME" && "border-indigo-500/30 text-indigo-400"
              )}>
                <CalendarIcon className="w-4 h-4 mr-2 opacity-70" />
                {displayDateText}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-[#12131a] border-white/[0.08] shadow-2xl shadow-black/40 rounded-xl" align="end">
                <DateRangePicker 
                  filterType={filterType}
                  setFilterType={setFilterType}
                  customRange={customRange}
                  setCustomRange={setCustomRange}
                  onClose={() => {
                     if (filterType !== "CUSTOM" || (customRange.from && customRange.to)) {
                       setIsCalendarOpen(false);
                     }
                  }} 
                />
              </PopoverContent>
            </Popover>
            <ExportReportButton />
          </div>
        </div>
      </div>

      {loading ? (
         <div className="flex flex-col items-center justify-center py-32">
           <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4 animate-pulse">
             <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
           </div>
           <p className="text-white/40 font-medium text-sm">Fetching platform metrics...</p>
         </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {statsList.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                >
                  <div className={cn(
                    "relative overflow-hidden rounded-2xl border border-white/[0.06] p-6 group",
                    "bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300",
                    "hover:border-white/[0.1] hover:shadow-lg",
                    `hover:${s.glow}`
                  )}>
                    {/* Subtle gradient accent */}
                    <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br", s.gradient)} />
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-5">
                        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110", s.iconBg)}>
                          <Icon className={cn("w-5 h-5", s.iconColor)} />
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-white/30 transition-colors" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-white tracking-tight mb-1">{s.value}</p>
                        <p className="text-sm font-medium text-white/35">{s.label}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Recent Signups */}
          <div className="rounded-2xl border border-white/[0.06] overflow-hidden bg-white/[0.02]">
            <div className="border-b border-white/[0.06] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                  <Users className="w-4.5 h-4.5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-[15px]">Recent Signups</h3>
                  <p className="text-white/30 text-xs">Latest user registrations</p>
                </div>
              </div>
              <Link href="/admin/users">
                <Button variant="ghost" size="sm" className="text-xs text-white/40 hover:text-white hover:bg-white/[0.06] w-full sm:w-auto">
                  View All Users
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <div className="divide-y divide-white/[0.04] min-w-[500px]">
                {data.recentSignups.map((user: any, index: number) => {
                  const statusInfo = STATUS_LABELS[user.status as keyof typeof STATUS_LABELS];
                  return (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors group"
                    >
                      <div className="flex items-center gap-4 min-w-0 pr-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/10 flex items-center justify-center shrink-0 text-sm font-bold text-indigo-300 group-hover:scale-105 transition-transform">
                          {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-white/30 truncate mt-0.5">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-xs font-medium text-white/25">
                          {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <Badge className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 border-none shadow-sm ${statusInfo.color}`}>
                          {statusInfo.label}
                        </Badge>
                      </div>
                    </motion.div>
                  );
                })}
                {data.recentSignups.length === 0 && (
                   <div className="text-center py-16">
                     <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4 border border-white/[0.06]">
                       <Users className="w-7 h-7 text-white/20" />
                     </div>
                     <p className="text-sm font-medium text-white/60">No recent signups found.</p>
                     <p className="text-xs text-white/25 mt-1">New users will appear here.</p>
                   </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
