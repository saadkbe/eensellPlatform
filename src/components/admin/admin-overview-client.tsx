"use client";

import { useState, useEffect } from "react";
import { Users, UserCheck, Clock, BookOpen, TrendingUp, DollarSign, Shield, CalendarIcon, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  const isSameDay = (d1: Date, d2: Date) => {
    return d1 && d2 && d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  };

  const isWithinRange = (date: Date) => {
    if (!customRange.from || !customRange.to) return false;
    // Set hours to 0 to compare just dates
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
            "h-8 w-8 rounded-md flex items-center justify-center text-sm transition-all",
            isSelected ? "bg-indigo-600 text-white font-bold" : "",
            isMid && !isSelected ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-200" : "",
            !isSelected && !isMid ? "hover:bg-muted text-foreground" : ""
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
        <Button variant={filterType === "ALL_TIME" ? "default" : "outline"} size="sm" onClick={() => { setFilterType("ALL_TIME"); onClose(); }} className={filterType === "ALL_TIME" ? "bg-indigo-600 hover:bg-indigo-700 text-white" : ""}>All Time</Button>
        <Button variant={filterType === "TODAY" ? "default" : "outline"} size="sm" onClick={() => { setFilterType("TODAY"); onClose(); }} className={filterType === "TODAY" ? "bg-indigo-600 hover:bg-indigo-700 text-white" : ""}>Today</Button>
        <Button variant={filterType === "LAST_7_DAYS" ? "default" : "outline"} size="sm" onClick={() => { setFilterType("LAST_7_DAYS"); onClose(); }} className={filterType === "LAST_7_DAYS" ? "bg-indigo-600 hover:bg-indigo-700 text-white" : ""}>Last 7 Days</Button>
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-3">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-semibold text-sm text-foreground">
            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </div>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-[11px] font-medium text-muted-foreground uppercase">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {renderDays()}
        </div>
        {filterType === "CUSTOM" && customRange.from && customRange.to && (
           <Button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white" size="sm" onClick={onClose}>Apply Range</Button>
        )}
      </div>
    </div>
  );
}

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
    
    // Only fetch if not in the middle of picking a custom range
    if (filterType !== "CUSTOM" || (customRange.from && customRange.to)) {
      fetchData();
    }
  }, [filterType, customRange]);

  const statsList = [
    { label: "Total Revenue", value: `${data.stats.revenue.toLocaleString()} MAD`, icon: DollarSign, color: "#10B981", bg: "rgba(16,185,129,0.1)" },
    { label: "Total Users", value: data.stats.totalUsers, icon: Users, color: "#0A0A0A", bg: "rgba(0,0,0,0.1)" },
    { label: "Active Users", value: data.stats.activeUsers, icon: UserCheck, color: "#10B981", bg: "rgba(16,185,129,0.1)" },
    { label: "Pending Approvals", value: data.stats.pendingUsers, icon: Clock, color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
    { label: "Total Modules", value: data.stats.totalModules, icon: BookOpen, color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" },
    { label: "Suspended", value: data.stats.suspendedUsers, icon: TrendingUp, color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
  ];

  let displayDateText = "All Time";
  if (filterType === "TODAY") displayDateText = "Today";
  else if (filterType === "LAST_7_DAYS") displayDateText = "Last 7 Days";
  else if (filterType === "CUSTOM" && customRange.from && customRange.to) {
    displayDateText = `${customRange.from.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${customRange.to.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-destructive/10 via-background to-background border border-border p-6 sm:p-8 md:p-10 shadow-sm">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-destructive/5 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-destructive/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium mb-4 border border-destructive/20">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Control Center</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-2">
              Platform Overview
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Monitor user growth, engagement metrics, and platform revenue all in one place.
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border h-11 px-4 py-2 hover:bg-accent hover:text-accent-foreground border-border/50 bg-background/50 backdrop-blur shadow-sm transition-colors", filterType !== "ALL_TIME" && "border-indigo-500/30 text-indigo-500")}>
                <CalendarIcon className="w-4 h-4 mr-2 opacity-70" />
                {displayDateText}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-border/50 shadow-xl rounded-xl" align="end">
                <DateRangePicker 
                  filterType={filterType}
                  setFilterType={setFilterType}
                  customRange={customRange}
                  setCustomRange={setCustomRange}
                  onClose={() => {
                     // Close if it's a quick select or if custom is fully selected
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
           <Loader2 className="w-10 h-10 animate-spin text-destructive mb-4" />
           <p className="text-muted-foreground font-medium">Fetching platform metrics...</p>
         </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {statsList.map((s) => {
              const Icon = s.icon;
              return (
                <Card key={s.label} className="relative overflow-hidden bg-card/40 backdrop-blur-xl border-border hover:border-destructive/30 transition-all duration-300 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.02)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-inner" style={{ backgroundColor: s.bg }}>
                        <Icon className="w-6 h-6" style={{ color: s.color }} />
                      </div>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-foreground tracking-tight mb-1">{s.value}</p>
                      <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="bg-card/40 backdrop-blur-xl border-border overflow-hidden shadow-sm">
            <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <CardTitle className="text-foreground text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-destructive" />
                  Recent Signups
                </CardTitle>
                <Link href="/admin/users">
                  <Button variant="ghost" size="sm" className="text-xs hover:bg-muted/50 w-full sm:w-auto">View All Users</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <div className="divide-y divide-border/50 min-w-[500px]">
                {data.recentSignups.map((user: any) => {
                  const statusInfo = STATUS_LABELS[user.status as keyof typeof STATUS_LABELS];
                  return (
                    <div key={user.id} className="flex items-center justify-between p-4 sm:p-5 hover:bg-muted/30 transition-colors group">
                      <div className="flex items-center gap-4 min-w-0 pr-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm font-bold text-primary group-hover:scale-110 transition-transform shadow-sm border border-primary/20">
                          {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-xs font-medium text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <Badge className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border-none shadow-sm ${statusInfo.color}`}>
                          {statusInfo.label}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
                {data.recentSignups.length === 0 && (
                   <div className="text-center py-12">
                     <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 border border-border">
                       <Users className="w-8 h-8 text-muted-foreground" />
                     </div>
                     <p className="text-sm font-medium text-foreground">No recent signups found.</p>
                     <p className="text-xs text-muted-foreground mt-1">New users will appear here.</p>
                   </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
}
