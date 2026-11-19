"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Users,
  UserCheck,
  Clock,
  BookOpen,
  DollarSign,
  AlertTriangle,
  CalendarIcon,
  Loader2,
  ArrowUpRight,
  Search,
  Zap,
  TrendingUp,
  Award,
  Sparkles,
  Layers,
  GraduationCap,
  Mail,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Phone,
  MessageSquare,
  Activity,
  ArrowRight,
  BarChart3,
  Shield,
  ChevronRight,
} from "lucide-react";
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
  onClose,
}: {
  filterType: FilterType;
  setFilterType: (type: FilterType) => void;
  customRange: { from: Date | null; to: Date | null };
  setCustomRange: (range: { from: Date | null; to: Date | null }) => void;
  onClose: () => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const handlePrevMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const isSameDay = (d1: Date, d2: Date) =>
    d1 &&
    d2 &&
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const isWithinRange = (date: Date) => {
    if (!customRange.from || !customRange.to) return false;
    const d = new Date(date).setHours(0, 0, 0, 0);
    const start = new Date(customRange.from).setHours(0, 0, 0, 0);
    const end = new Date(customRange.to).setHours(0, 0, 0, 0);
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
            "h-8 w-8 rounded-md flex items-center justify-center text-sm font-medium transition-colors cursor-pointer",
            isSelected ? "bg-amber-500 text-slate-950 font-bold" : "",
            isMid && !isSelected ? "bg-amber-500/15 text-foreground" : "",
            !isSelected && !isMid ? "hover:bg-accent text-foreground/80" : ""
          )}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="p-4 w-[320px] bg-card text-foreground rounded-2xl shadow-2xl border border-border">
      <div className="grid grid-cols-3 gap-1.5 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setFilterType("ALL_TIME");
            onClose();
          }}
          className={cn("text-xs font-semibold h-8", filterType === "ALL_TIME" && "bg-foreground text-background")}
        >
          All Time
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setFilterType("TODAY");
            onClose();
          }}
          className={cn("text-xs font-semibold h-8", filterType === "TODAY" && "bg-foreground text-background")}
        >
          Today
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setFilterType("LAST_7_DAYS");
            onClose();
          }}
          className={cn("text-xs font-semibold h-8", filterType === "LAST_7_DAYS" && "bg-foreground text-background")}
        >
          7 Days
        </Button>
      </div>

      <div className="flex items-center justify-between mb-3 px-1">
        <button onClick={handlePrevMonth} className="p-1 hover:bg-accent rounded-md transition-colors cursor-pointer">
          <div className="w-3.5 h-3.5 border-t-2 border-l-2 border-muted-foreground -rotate-45 translate-x-1" />
        </button>
        <div className="font-semibold text-xs uppercase tracking-wider text-foreground">
          {currentMonth.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
        </div>
        <button onClick={handleNextMonth} className="p-1 hover:bg-accent rounded-md transition-colors cursor-pointer">
          <div className="w-3.5 h-3.5 border-t-2 border-r-2 border-muted-foreground rotate-45 -translate-x-1" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-[10px] font-bold text-muted-foreground uppercase">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{renderDays()}</div>
    </div>
  );
}

function timeAgo(date: string | Date) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${Math.max(1, seconds)}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function AdminOverviewClient() {
  const [filterType, setFilterType] = useState<FilterType>("ALL_TIME");
  const [customRange, setCustomRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "PENDING" | "PRO">("ALL");

  const [data, setData] = useState<any>({
    stats: {
      totalUsers: 0,
      activeUsers: 0,
      pendingUsers: 0,
      suspendedUsers: 0,
      totalModules: 0,
      totalLessons: 0,
      totalProUsers: 0,
      newConfirmedStudents: 0,
      completedLessonsCount: 0,
      challengeCompletionsCount: 0,
      pendingHomeworksCount: 0,
      pendingReportsCount: 0,
      pendingWithdrawalsCount: 0,
      revenue: 0,
      conversionRate: 0,
      revenueBreakdown: { historical: 23200, pro: 0, v2: 0, total: 23200 },
      tierBreakdown: { pro: 0, v2: 0, free: 0 },
    },
    recentSignups: [],
    pendingStudentsList: [],
    pendingHomeworksList: [],
    topXPStudents: [],
    recentActivity: [],
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

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch overview data");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Admin overview fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    if (filterType !== "CUSTOM" || (customRange.from && customRange.to)) {
      fetchData();
    }
  }, [filterType, customRange]);

  // Filtered Signups for Table
  const filteredSignups = useMemo(() => {
    if (!data.recentSignups) return [];
    return data.recentSignups.filter((u: any) => {
      const matchesSearch =
        searchQuery === "" ||
        `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.phone || "").includes(searchQuery);

      if (!matchesSearch) return false;

      if (statusFilter === "ACTIVE") return u.status === "ACTIVE";
      if (statusFilter === "PENDING") return u.status === "PENDING";
      if (statusFilter === "PRO") return u.isPro || u.tier === "PRO";
      return true;
    });
  }, [data.recentSignups, searchQuery, statusFilter]);

  let displayDateText = "All Time";
  if (filterType === "TODAY") displayDateText = "Today";
  else if (filterType === "LAST_7_DAYS") displayDateText = "Last 7 Days";
  else if (filterType === "CUSTOM" && customRange.from && customRange.to) {
    displayDateText = `${customRange.from.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${customRange.to.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  }

  const stats = data.stats;
  const hasUrgentActions =
    stats.pendingUsers > 0 || stats.pendingHomeworksCount > 0 || stats.pendingReportsCount > 0;

  return (
    <div className="space-y-8 pb-16 text-foreground">
      {/* ── TOP EXECUTIVE HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-card/60 border border-border backdrop-blur-xl shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Executive Command Hub
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Eensell Overview
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Complete platform telemetry: revenue, student conversions, curriculum pulse, and operations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap h-10 px-4 rounded-xl border border-border bg-background shadow-xs hover:bg-accent text-xs font-bold transition-all text-foreground cursor-pointer",
                filterType !== "ALL_TIME" && "border-amber-500/40 text-amber-500 bg-amber-500/10"
              )}
            >
              <CalendarIcon className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
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

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 rounded-3xl border border-border bg-card/40">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-4" />
          <p className="text-muted-foreground font-medium text-sm">Aggregating platform intelligence...</p>
        </div>
      ) : (
        <>
          {/* ── ACTION-REQUIRED RADAR BANNER ── */}
          {hasUrgentActions && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-amber-500/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    Action Required in Platform Operations
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {stats.pendingUsers > 0 && `${stats.pendingUsers} student bank transfers awaiting verification • `}
                    {stats.pendingHomeworksCount > 0 && `${stats.pendingHomeworksCount} homeworks pending review • `}
                    {stats.pendingReportsCount > 0 && `${stats.pendingReportsCount} task problem reports`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {stats.pendingUsers > 0 && (
                  <Link href="/admin/pending">
                    <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs h-9 rounded-xl shadow-xs">
                      Verify Students ({stats.pendingUsers})
                    </Button>
                  </Link>
                )}
                {stats.pendingHomeworksCount > 0 && (
                  <Link href="/admin/homeworks">
                    <Button size="sm" variant="outline" className="border-border text-foreground hover:bg-accent text-xs font-semibold h-9 rounded-xl">
                      Grade Homeworks ({stats.pendingHomeworksCount})
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* ── QUICK ACTION LAUNCHPAD DOCK ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { label: "Pending Approvals", count: stats.pendingUsers, href: "/admin/pending", icon: Clock, color: "text-amber-500", highlight: stats.pendingUsers > 0 },
              { label: "Active Students", count: stats.activeUsers, href: "/admin/active-users", icon: UserCheck, color: "text-emerald-500" },
              { label: "Course Curriculum", count: `${stats.totalLessons} Lessons`, href: "/admin/courses", icon: BookOpen, color: "text-sky-500" },
              { label: "Financial Tracking", count: "Ledger", href: "/admin/tracking", icon: DollarSign, color: "text-violet-500" },
              { label: "Email Composer", count: "Send Blast", href: "/admin/emails", icon: Mail, color: "text-orange-500" },
            ].map((dock, idx) => {
              const Icon = dock.icon;
              return (
                <Link
                  key={idx}
                  href={dock.href}
                  className={cn(
                    "p-3.5 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer",
                    dock.highlight
                      ? "bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50 shadow-sm"
                      : "bg-card/50 border-border hover:bg-card hover:border-border/80"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={cn("w-8 h-8 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border group-hover:scale-105 transition-transform", dock.color)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-muted-foreground truncate">{dock.label}</p>
                      <p className="text-xs font-bold text-foreground truncate">{dock.count}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              );
            })}
          </div>

          {/* ── PRIMARY 6-CARD EXECUTIVE KPI RIBBON ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Total Revenue */}
            <div className="p-6 rounded-3xl bg-card/60 border border-border/80 backdrop-blur-md shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Revenue Balance</span>
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <h3 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight font-mono">
                  {stats.revenue.toLocaleString()}
                </h3>
                <span className="text-sm font-bold text-amber-500">MAD</span>
              </div>
              <p className="text-xs text-muted-foreground">
                V2 confirmed ({stats.revenueBreakdown.v2} MAD) + Pro ({stats.revenueBreakdown.pro} MAD) + Cohort ({stats.revenueBreakdown.historical} MAD)
              </p>
            </div>

            {/* Active Students & Conversion */}
            <div className="p-6 rounded-3xl bg-card/60 border border-border/80 backdrop-blur-md shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Paid Active Students</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-3 mb-2">
                <h3 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight font-mono">
                  {stats.activeUsers}
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {stats.conversionRate}% Conversion
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Out of {stats.totalUsers} registered accounts on the platform
              </p>
            </div>

            {/* Pending Approvals */}
            <div className="p-6 rounded-3xl bg-card/60 border border-border/80 backdrop-blur-md shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-orange-500/20 transition-all" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pending Approvals</span>
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-3 mb-2">
                <h3 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight font-mono">
                  {stats.pendingUsers}
                </h3>
                {stats.pendingUsers > 0 && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 animate-pulse">
                    Action Required
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Bank transfers waiting for confirmation on /admin/pending
              </p>
            </div>

            {/* Learning Execution */}
            <div className="p-6 rounded-3xl bg-card/60 border border-border/80 backdrop-blur-md shadow-xl relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Learning Execution</span>
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <h3 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight font-mono">
                  {stats.completedLessonsCount}
                </h3>
                <span className="text-xs font-bold text-muted-foreground">Completed</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Plus {stats.challengeCompletionsCount} challenge missions conquered by students
              </p>
            </div>

            {/* PRO Tier Founders */}
            <div className="p-6 rounded-3xl bg-card/60 border border-border/80 backdrop-blur-md shadow-xl relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">PRO Founders Tier</span>
                <div className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <h3 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight font-mono">
                  {stats.totalProUsers}
                </h3>
                <span className="text-xs font-bold text-violet-500">PRO OS</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Members with full access to Eensell Lead Scraper & Voice AI
              </p>
            </div>

            {/* Curriculum Vault */}
            <div className="p-6 rounded-3xl bg-card/60 border border-border/80 backdrop-blur-md shadow-xl relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Platform Curriculum</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <h3 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight font-mono">
                  {stats.totalModules}
                </h3>
                <span className="text-xs font-bold text-muted-foreground">Modules / {stats.totalLessons} Lessons</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Full V2 video library + interactive Make.com automation blueprints
              </p>
            </div>
          </div>

          {/* ── FINANCIAL HEALTH & COHORT DISTRIBUTION BENTO ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Stream Breakdown */}
            <div className="p-6 sm:p-7 rounded-3xl bg-card/60 border border-border/80 backdrop-blur-md shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground">Revenue Stream Breakdown</h3>
                  <p className="text-xs text-muted-foreground">Distribution across tiers and upgrade fees</p>
                </div>
                <Link href="/admin/tracking">
                  <Button variant="ghost" size="sm" className="text-xs font-bold text-amber-500 hover:text-amber-400 gap-1 h-8 px-2.5">
                    <span>Full Ledger</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>

              {/* Stacked Proportional Bar */}
              <div className="h-3 w-full rounded-full bg-muted/40 overflow-hidden flex">
                <div
                  style={{ width: `${Math.round((stats.revenueBreakdown.historical / Math.max(1, stats.revenue)) * 100)}%` }}
                  className="h-full bg-slate-500"
                  title="Historical Cohort"
                />
                <div
                  style={{ width: `${Math.round((stats.revenueBreakdown.v2 / Math.max(1, stats.revenue)) * 100)}%` }}
                  className="h-full bg-amber-500"
                  title="University V2"
                />
                <div
                  style={{ width: `${Math.round((stats.revenueBreakdown.pro / Math.max(1, stats.revenue)) * 100)}%` }}
                  className="h-full bg-violet-500"
                  title="PRO OS Upgrades"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-background/50 border border-border">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                    <span className="text-[11px] font-semibold text-muted-foreground">Cohort V1</span>
                  </div>
                  <p className="text-base font-bold text-foreground font-mono">{stats.revenueBreakdown.historical.toLocaleString()} MAD</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">116 baseline students</p>
                </div>

                <div className="p-3 rounded-2xl bg-background/50 border border-border">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-[11px] font-semibold text-amber-500">University V2</span>
                  </div>
                  <p className="text-base font-bold text-foreground font-mono">{stats.revenueBreakdown.v2.toLocaleString()} MAD</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{stats.newConfirmedStudents} active students</p>
                </div>

                <div className="p-3 rounded-2xl bg-background/50 border border-border">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-violet-500" />
                    <span className="text-[11px] font-semibold text-violet-400">PRO OS</span>
                  </div>
                  <p className="text-base font-bold text-foreground font-mono">{stats.revenueBreakdown.pro.toLocaleString()} MAD</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{stats.totalProUsers} founders</p>
                </div>
              </div>
            </div>

            {/* Student Tier Distribution */}
            <div className="p-6 sm:p-7 rounded-3xl bg-card/60 border border-border/80 backdrop-blur-md shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground">Cohort Tier Distribution</h3>
                  <p className="text-xs text-muted-foreground">Student classification by license level</p>
                </div>
                <Link href="/admin/users">
                  <Button variant="ghost" size="sm" className="text-xs font-bold text-muted-foreground hover:text-foreground gap-1 h-8 px-2.5">
                    <span>Manage Cohort</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>

              {/* Visual Bars */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                      <span>PRO Agency OS</span>
                    </span>
                    <span className="font-mono text-muted-foreground">{stats.tierBreakdown.pro} Members</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted/40 overflow-hidden">
                    <div
                      style={{ width: `${Math.round((stats.tierBreakdown.pro / Math.max(1, stats.totalUsers)) * 100)}%` }}
                      className="h-full bg-violet-500 rounded-full"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
                      <span>University V2 Full Course</span>
                    </span>
                    <span className="font-mono text-muted-foreground">{stats.newConfirmedStudents + 116} Students</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted/40 overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, Math.round(((stats.newConfirmedStudents + 116) / Math.max(1, stats.totalUsers)) * 100))}%` }}
                      className="h-full bg-amber-500 rounded-full"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-orange-500" />
                      <span>Pending Admissions / Free Vault</span>
                    </span>
                    <span className="font-mono text-muted-foreground">{stats.pendingUsers} Pending</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted/40 overflow-hidden">
                    <div
                      style={{ width: `${Math.round((stats.pendingUsers / Math.max(1, stats.totalUsers)) * 100)}%` }}
                      className="h-full bg-orange-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── ACTION RADAR: IMMEDIATE ATTENTION ITEMS ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Students Awaiting Approval */}
            <div className="p-6 sm:p-7 rounded-3xl bg-card/60 border border-border/80 backdrop-blur-md shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">Pending Student Admissions</h3>
                      <p className="text-xs text-muted-foreground">Bank transfers waiting for your verification</p>
                    </div>
                  </div>
                  <Link href="/admin/pending">
                    <Button variant="outline" size="sm" className="text-xs font-bold border-amber-500/30 text-amber-500 hover:bg-amber-500/10 h-8 rounded-xl">
                      View All ({stats.pendingUsers})
                    </Button>
                  </Link>
                </div>

                <div className="space-y-2.5">
                  {data.pendingStudentsList && data.pendingStudentsList.length > 0 ? (
                    data.pendingStudentsList.map((stu: any) => (
                      <div
                        key={stu.id}
                        className="p-3 rounded-2xl bg-background/50 border border-border flex items-center justify-between gap-3 hover:border-amber-500/30 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs shrink-0">
                            {(stu.firstName?.[0] || stu.email[0]).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-foreground truncate">
                              {stu.firstName} {stu.lastName}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">{stu.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {stu.phone && (
                            <a
                              href={`https://wa.me/${stu.phone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
                              title="Message student on WhatsApp"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <Link href="/admin/pending">
                            <Button size="sm" className="h-7 px-3 text-[11px] font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg">
                              Verify
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 rounded-2xl border border-dashed border-border/80">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                      <p className="text-xs font-bold text-foreground">Zero pending admissions</p>
                      <p className="text-[11px] text-muted-foreground">All student bank transfers have been processed.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pending Homework Reviews */}
            <div className="p-6 sm:p-7 rounded-3xl bg-card/60 border border-border/80 backdrop-blur-md shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">Homework Submissions</h3>
                      <p className="text-xs text-muted-foreground">Student work awaiting coaching review</p>
                    </div>
                  </div>
                  <Link href="/admin/homeworks">
                    <Button variant="outline" size="sm" className="text-xs font-bold border-border text-foreground hover:bg-accent h-8 rounded-xl">
                      Review Hub ({stats.pendingHomeworksCount})
                    </Button>
                  </Link>
                </div>

                <div className="space-y-2.5">
                  {data.pendingHomeworksList && data.pendingHomeworksList.length > 0 ? (
                    data.pendingHomeworksList.map((hw: any) => (
                      <div
                        key={hw.id}
                        className="p-3 rounded-2xl bg-background/50 border border-border flex items-center justify-between gap-3 hover:border-sky-500/30 transition-all"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">
                            {hw.lesson?.title || "Lesson Homework"}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            By {hw.user?.firstName} {hw.user?.lastName} • {timeAgo(hw.createdAt)}
                          </p>
                        </div>

                        <Link href="/admin/homeworks">
                          <Button size="sm" variant="outline" className="h-7 px-3 text-[11px] font-bold border-border text-foreground hover:bg-accent rounded-lg">
                            Grade
                          </Button>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 rounded-2xl border border-dashed border-border/80">
                      <CheckCircle2 className="w-8 h-8 text-sky-500 mx-auto mb-2 opacity-80" />
                      <p className="text-xs font-bold text-foreground">All caught up!</p>
                      <p className="text-[11px] text-muted-foreground">No homework submissions waiting for review.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── GAMIFICATION LEADERS & REAL-TIME ACTIVITY ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Top XP Leaderboard */}
            <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-card/60 border border-border/80 backdrop-blur-md shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Top XP Champions</h3>
                    <p className="text-xs text-muted-foreground">Most active students on the platform</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {data.topXPStudents && data.topXPStudents.length > 0 ? (
                  data.topXPStudents.map((stu: any, idx: number) => (
                    <div
                      key={stu.id}
                      className={cn(
                        "flex items-center justify-between p-2.5 rounded-xl border transition-all",
                        idx === 0
                          ? "bg-amber-500/10 border-amber-500/30"
                          : "bg-background/40 border-border"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={cn(
                          "w-5 font-bold text-xs text-center font-mono",
                          idx === 0 ? "text-amber-500" : "text-muted-foreground"
                        )}>
                          #{idx + 1}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-bold text-xs shrink-0">
                          {(stu.firstName?.[0] || stu.email[0]).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">
                            {stu.firstName} {stu.lastName}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">{stu.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-background/80 border border-border font-mono text-xs font-bold text-amber-500 shrink-0">
                        <Zap className="w-3 h-3 fill-amber-500" />
                        <span>{stu.xp} XP</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground py-4 text-center">No XP records recorded yet.</p>
                )}
              </div>
            </div>

            {/* Real-time Platform Activity Stream */}
            <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-card/60 border border-border/80 backdrop-blur-md shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Live Platform Pulse</h3>
                    <p className="text-xs text-muted-foreground">Recent student sessions and navigation hits</p>
                  </div>
                </div>
                <Link href="/admin/analytics">
                  <Button variant="ghost" size="sm" className="text-xs font-bold text-muted-foreground hover:text-foreground gap-1 h-8 px-2.5">
                    <span>Full Analytics</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-2">
                {data.recentActivity && data.recentActivity.length > 0 ? (
                  data.recentActivity.map((act: any) => (
                    <div
                      key={act.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-background/40 border border-border text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center font-bold text-[10px] shrink-0">
                          {(act.user?.firstName?.[0] || act.user?.email?.[0] || "U").toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">
                            {act.user?.firstName || "Student"} visited{" "}
                            <span className="font-mono text-amber-500 dark:text-amber-400">{act.path}</span>
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono shrink-0 ml-2">
                        {timeAgo(act.timestamp)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground py-4 text-center">No platform telemetry logged yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* ── COMPREHENSIVE STUDENT DIRECTORY & RECENT SIGNUPS ── */}
          <div className="p-6 sm:p-8 rounded-3xl bg-card/60 border border-border/80 backdrop-blur-md shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-foreground tracking-tight">Recent Student Registrations</h2>
                <p className="text-xs text-muted-foreground">Search and review latest admissions across the cohort</p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Search */}
                <div className="relative min-w-[200px] sm:min-w-[240px]">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, email, phone..."
                    className="w-full h-9 pl-9 pr-3 rounded-xl bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-background border border-border">
                  {(["ALL", "ACTIVE", "PENDING", "PRO"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setStatusFilter(tab)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer",
                        statusFilter === tab
                          ? "bg-foreground text-background shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <Link href="/admin/users">
                  <Button variant="outline" size="sm" className="h-9 text-xs font-bold rounded-xl border-border">
                    <span>View All Users</span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-border overflow-hidden bg-background/50">
              <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-border bg-muted/20 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <div className="col-span-4 sm:col-span-4">Student Profile</div>
                <div className="hidden sm:block col-span-2">Track & Goal</div>
                <div className="col-span-3 sm:col-span-2">License Tier</div>
                <div className="hidden md:block col-span-2">Joined Date</div>
                <div className="col-span-5 sm:col-span-2 text-right">Status / Actions</div>
              </div>

              <div className="divide-y divide-border/50">
                {filteredSignups.map((user: any) => {
                  const statusInfo = STATUS_LABELS[user.status as keyof typeof STATUS_LABELS] || {
                    label: user.status,
                    variant: "outline",
                  };
                  return (
                    <div
                      key={user.id}
                      className="grid grid-cols-12 gap-3 px-5 py-3.5 items-center hover:bg-muted/10 transition-colors text-xs"
                    >
                      {/* User Avatar & Name */}
                      <div className="col-span-4 sm:col-span-4 flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-bold text-xs shrink-0">
                          {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>

                      {/* Goal / Track */}
                      <div className="hidden sm:block col-span-2 min-w-0">
                        <span className="text-[11px] font-medium text-foreground capitalize truncate block">
                          {user.goal ? user.goal.replace("_", " ") : "General Agency"}
                        </span>
                        {user.incomeGoal && (
                          <span className="text-[10px] text-muted-foreground font-mono">{user.incomeGoal}</span>
                        )}
                      </div>

                      {/* Tier Badge */}
                      <div className="col-span-3 sm:col-span-2 flex items-center gap-1.5">
                        {user.isPro || user.tier === "PRO" ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                            PRO OS
                          </span>
                        ) : user.status === "ACTIVE" ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            Univ V2
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium text-muted-foreground bg-muted/30">
                            Free
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-muted-foreground hidden lg:inline">
                          {user.xp} XP
                        </span>
                      </div>

                      {/* Joined Date */}
                      <div className="hidden md:block col-span-2 text-muted-foreground font-medium text-[11px]">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>

                      {/* Status & Actions */}
                      <div className="col-span-5 sm:col-span-2 flex items-center justify-end gap-2">
                        {user.phone && (
                          <a
                            href={`https://wa.me/${user.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-500 transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                            user.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : user.status === "PENDING"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                              : "bg-muted text-muted-foreground border-border"
                          )}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {filteredSignups.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="w-6 h-6 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-bold text-foreground">No students match your filter</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Try searching for another name or reset filters.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
