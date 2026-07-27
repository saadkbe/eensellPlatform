"use client";

import { useState, useEffect } from "react";
import { Users, UserCheck, Clock, BookOpen, DollarSign, AlertTriangle, CalendarIcon, Loader2, ArrowUpRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { STATUS_LABELS } from "@/lib/constants";
import { ExportReportButton } from "@/components/admin/export-report-button";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

  const isSameDay = (d1: Date, d2: Date) => d1 && d2 && d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
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
    for (let i = 0; i < firstDayOfMonth; i++) days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
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
            "h-8 w-8 rounded-md flex items-center justify-center text-sm font-medium transition-colors",
            isSelected ? "bg-slate-900 text-white" : "",
            isMid && !isSelected ? "bg-slate-100 text-slate-900" : "",
            !isSelected && !isMid ? "hover:bg-slate-100 text-slate-700" : ""
          )}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="p-4 w-[320px] bg-white rounded-2xl shadow-xl border border-slate-200">
      <div className="grid grid-cols-2 gap-2 mb-6">
        <Button variant="outline" size="sm" onClick={() => { setFilterType("ALL_TIME"); onClose(); }} className={cn("text-xs font-medium border-slate-200", filterType === "ALL_TIME" && "bg-slate-900 text-white hover:bg-slate-800")}>All Time</Button>
        <Button variant="outline" size="sm" onClick={() => { setFilterType("TODAY"); onClose(); }} className={cn("text-xs font-medium border-slate-200", filterType === "TODAY" && "bg-slate-900 text-white hover:bg-slate-800")}>Today</Button>
        <Button variant="outline" size="sm" onClick={() => { setFilterType("LAST_7_DAYS"); onClose(); }} className={cn("text-xs font-medium border-slate-200", filterType === "LAST_7_DAYS" && "bg-slate-900 text-white hover:bg-slate-800")}>Last 7 Days</Button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 rounded-md transition-colors"><div className="w-4 h-4 border-t-2 border-l-2 border-slate-500 -rotate-45 translate-x-1" /></button>
        <div className="font-semibold text-sm text-slate-900">
          {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </div>
        <button onClick={handleNextMonth} className="p-1 hover:bg-slate-100 rounded-md transition-colors"><div className="w-4 h-4 border-t-2 border-r-2 border-slate-500 rotate-45 -translate-x-1" /></button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
    </div>
  );
}

export function AdminOverviewClient() {
  const [filterType, setFilterType] = useState<FilterType>("ALL_TIME");
  const [customRange, setCustomRange] = useState<{from: Date | null, to: Date | null}>({ from: null, to: null });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
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
    { label: "Total Revenue", value: `${data.stats.revenue.toLocaleString()} MAD`, icon: DollarSign, trend: "+12.5%" },
    { label: "Total Users", value: data.stats.totalUsers, icon: Users, trend: "+4.2%" },
    { label: "Active Users", value: data.stats.activeUsers, icon: UserCheck, trend: "+2.1%" },
    { label: "Pending Approvals", value: data.stats.pendingUsers, icon: Clock, trend: null },
    { label: "Total Modules", value: data.stats.totalModules, icon: BookOpen, trend: null },
    { label: "Suspended", value: data.stats.suspendedUsers, icon: AlertTriangle, trend: null },
  ];

  let displayDateText = "All Time";
  if (filterType === "TODAY") displayDateText = "Today";
  else if (filterType === "LAST_7_DAYS") displayDateText = "Last 7 Days";
  else if (filterType === "CUSTOM" && customRange.from && customRange.to) {
    displayDateText = `${customRange.from.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${customRange.to.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-slate-900 pb-24">
      {/* ── HEADER ── */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200/60 mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-1">
            Overview
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Monitor platform metrics, user engagement, and revenue.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap h-10 px-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 text-sm font-medium transition-all text-slate-700",
                filterType !== "ALL_TIME" && "border-slate-300 text-slate-900 bg-slate-50"
              )}
            >
              <CalendarIcon className="w-4 h-4 mr-2 text-slate-400" />
              {displayDateText}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-none shadow-none bg-transparent" align="end">
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

      <div className="max-w-7xl mx-auto px-6">
        {loading ? (
           <div className="flex flex-col items-center justify-center py-32">
             <Loader2 className="w-8 h-8 animate-spin text-slate-300 mb-4" />
             <p className="text-slate-500 font-medium text-sm">Loading metrics...</p>
           </div>
        ) : (
          <>
            {/* ── BENTO STATS GRID ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {statsList.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.04)]">
                    <div className="flex items-start justify-between mb-8">
                      <p className="text-sm font-medium text-slate-500">{s.label}</p>
                      <Icon className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="flex items-end justify-between">
                      <h3 className="text-3xl font-semibold text-slate-900 tracking-tight">{s.value}</h3>
                      {s.trend && (
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md mb-1">
                          {s.trend}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── RECENT SIGNUPS TABLE ── */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Recent Signups</h2>
                <Link href="/admin/users">
                  <Button variant="ghost" className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg h-9 px-3">
                    View all users <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-200 bg-slate-50/50">
                  <div className="col-span-5 text-xs font-medium text-slate-500 uppercase tracking-wider">User</div>
                  <div className="col-span-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Joined</div>
                  <div className="col-span-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Status</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-slate-100">
                  {data.recentSignups.map((user: any) => {
                    const statusInfo = STATUS_LABELS[user.status as keyof typeof STATUS_LABELS];
                    return (
                      <div key={user.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50/50 transition-colors">
                        
                        <div className="col-span-5 flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-sm font-semibold text-slate-700">
                            {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                          </div>
                        </div>

                        <div className="col-span-3 text-sm text-slate-600 font-medium">
                          {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </div>

                        <div className="col-span-4 flex justify-end">
                          <div className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider border",
                            user.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                            user.status === "PENDING" ? "bg-amber-50 text-amber-700 border-amber-200" :
                            "bg-slate-50 text-slate-700 border-slate-200"
                          )}>
                            {statusInfo.label}
                          </div>
                        </div>

                      </div>
                    );
                  })}

                  {data.recentSignups.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-3">
                        <Search className="w-5 h-5 text-slate-400" />
                      </div>
                      <p className="text-sm font-medium text-slate-900">No users found</p>
                      <p className="text-xs text-slate-500 mt-1">No signups fit the selected criteria.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
