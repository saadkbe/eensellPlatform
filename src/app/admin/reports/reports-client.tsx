"use client";

import { useState, useTransition } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Trash2,
  Calendar,
  User,
  MessageSquare,
  ShieldAlert,
  ArrowUpDown,
  ExternalLink,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateTaskReportStatus, deleteTaskReport } from "@/actions/report.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TaskReportItem {
  id: string;
  dayNumber: number;
  taskTitle: string;
  type: string;
  message: string;
  status: "PENDING" | "IN_REVIEW" | "RESOLVED";
  adminNotes?: string | null;
  createdAt: string | Date;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    imageUrl?: string | null;
  };
}

interface ReportsClientProps {
  initialReports: TaskReportItem[];
}

export function ReportsClient({ initialReports }: ReportsClientProps) {
  const [reports, setReports] = useState<TaskReportItem[]>(initialReports);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isPending, startTransition] = useTransition();

  // Metrics
  const totalCount = reports.length;
  const pendingCount = reports.filter((r) => r.status === "PENDING").length;
  const inReviewCount = reports.filter((r) => r.status === "IN_REVIEW").length;
  const resolvedCount = reports.filter((r) => r.status === "RESOLVED").length;

  const filteredReports = reports.filter((r) => {
    const matchesStatus =
      statusFilter === "ALL" ? true : r.status === statusFilter;

    const query = search.toLowerCase();
    const matchesSearch =
      r.message.toLowerCase().includes(query) ||
      r.taskTitle.toLowerCase().includes(query) ||
      (r.user.email && r.user.email.toLowerCase().includes(query)) ||
      (r.user.firstName && r.user.firstName.toLowerCase().includes(query)) ||
      (r.user.lastName && r.user.lastName.toLowerCase().includes(query)) ||
      `day ${r.dayNumber}`.includes(query);

    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = (
    reportId: string,
    newStatus: "PENDING" | "IN_REVIEW" | "RESOLVED"
  ) => {
    // Optimistic UI
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
    );

    startTransition(async () => {
      try {
        await updateTaskReportStatus(reportId, newStatus);
        toast.success(`Report marked as ${newStatus.replace("_", " ")}`);
      } catch (error) {
        toast.error("Failed to update status");
        setReports(initialReports);
      }
    });
  };

  const handleDelete = (reportId: string) => {
    if (!confirm("Are you sure you want to permanently delete this report?")) return;

    // Optimistic UI
    setReports((prev) => prev.filter((r) => r.id !== reportId));

    startTransition(async () => {
      try {
        await deleteTaskReport(reportId);
        toast.success("Report deleted successfully");
      } catch (error) {
        toast.error("Failed to delete report");
        setReports(initialReports);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Metric Highlights ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-card/70 border-border shadow-sm rounded-2xl">
          <CardContent className="p-5 flex flex-col justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Reports
            </span>
            <p className="text-3xl font-black text-foreground mt-2 font-mono">{totalCount}</p>
            <span className="text-[11px] text-muted-foreground mt-1">From Task AI Coach</span>
          </CardContent>
        </Card>

        <Card className="bg-card/70 border-rose-500/20 shadow-sm rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
          <CardContent className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                Needs Attention
              </span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            </div>
            <p className="text-3xl font-black text-rose-500 mt-2 font-mono">{pendingCount}</p>
            <span className="text-[11px] text-rose-400/80 mt-1">Pending Review</span>
          </CardContent>
        </Card>

        <Card className="bg-card/70 border-amber-500/20 shadow-sm rounded-2xl">
          <CardContent className="p-5 flex flex-col justify-between">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              In Review
            </span>
            <p className="text-3xl font-black text-amber-500 mt-2 font-mono">{inReviewCount}</p>
            <span className="text-[11px] text-muted-foreground mt-1">Being Investigated</span>
          </CardContent>
        </Card>

        <Card className="bg-card/70 border-emerald-500/20 shadow-sm rounded-2xl">
          <CardContent className="p-5 flex flex-col justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Resolved
            </span>
            <p className="text-3xl font-black text-emerald-500 mt-2 font-mono">{resolvedCount}</p>
            <span className="text-[11px] text-emerald-400/80 mt-1">Fixed & Answered</span>
          </CardContent>
        </Card>
      </div>

      {/* ── Search & Filter Bar ── */}
      <Card className="bg-card/70 border-border shadow-sm rounded-2xl">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search reports, students, tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-background/50 rounded-xl text-xs"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
            {[
              { label: "All", val: "ALL", count: totalCount },
              { label: "Pending", val: "PENDING", count: pendingCount },
              { label: "In Review", val: "IN_REVIEW", count: inReviewCount },
              { label: "Resolved", val: "RESOLVED", count: resolvedCount },
            ].map((tab) => (
              <button
                key={tab.val}
                type="button"
                onClick={() => setStatusFilter(tab.val)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border",
                  statusFilter === tab.val
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background/50 text-muted-foreground border-border hover:text-foreground"
                )}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-black/10 dark:bg-white/10">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Reports List Feed ── */}
      <div className="space-y-3.5">
        {filteredReports.length === 0 ? (
          <Card className="bg-card/50 border-border p-12 text-center rounded-2xl">
            <ShieldAlert className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-foreground">No reports match your filters</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Any student task issues or bug reports submitted via the Task AI Coach will appear here.
            </p>
          </Card>
        ) : (
          filteredReports.map((report) => {
            const userName =
              report.user.firstName || report.user.lastName
                ? `${report.user.firstName || ""} ${report.user.lastName || ""}`.trim()
                : "Student";

            return (
              <Card
                key={report.id}
                className={cn(
                  "bg-card/70 border-border hover:border-border/80 transition-all rounded-2xl shadow-sm overflow-hidden",
                  report.status === "PENDING" && "border-l-4 border-l-rose-500",
                  report.status === "IN_REVIEW" && "border-l-4 border-l-amber-500",
                  report.status === "RESOLVED" && "border-l-4 border-l-emerald-500"
                )}
              >
                <CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    {/* Left: User & Mission Info */}
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-sm text-primary shrink-0 border border-border">
                        {report.user.imageUrl ? (
                          <img
                            src={report.user.imageUrl}
                            alt={userName}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          userName.slice(0, 2).toUpperCase()
                        )}
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm text-foreground">{userName}</span>
                          <span className="text-xs text-muted-foreground font-mono">({report.user.email})</span>
                          <span className="text-muted-foreground/40">•</span>
                          
                          <Badge variant="outline" className="text-[10px] font-bold font-mono text-amber-500 border-amber-500/30">
                            DAY {report.dayNumber}
                          </Badge>

                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-[10px] font-bold uppercase",
                              report.type === "PROBLEM" && "bg-rose-500/10 text-rose-500 border-rose-500/20",
                              report.type === "QUESTION" && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                              report.type === "FEEDBACK" && "bg-purple-500/10 text-purple-500 border-purple-500/20"
                            )}
                          >
                            {report.type}
                          </Badge>

                          <Badge
                            className={cn(
                              "text-[10px] font-bold uppercase",
                              report.status === "PENDING" && "bg-rose-500 text-white border-0",
                              report.status === "IN_REVIEW" && "bg-amber-500 text-slate-950 border-0",
                              report.status === "RESOLVED" && "bg-emerald-500 text-slate-950 border-0"
                            )}
                          >
                            {report.status.replace("_", " ")}
                          </Badge>
                        </div>

                        <p className="text-xs font-semibold text-primary/80 truncate">
                          Task: {report.taskTitle}
                        </p>

                        <div className="mt-2 p-3 rounded-xl bg-background/50 border border-border/50 text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                          {report.message}
                        </div>

                        <div className="flex items-center gap-3 pt-1 text-[11px] text-muted-foreground font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(report.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                      {report.status !== "RESOLVED" && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(report.id, "RESOLVED")}
                          disabled={isPending}
                          className="h-8 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm border-0"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Mark Resolved
                        </Button>
                      )}

                      {report.status === "PENDING" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(report.id, "IN_REVIEW")}
                          disabled={isPending}
                          className="h-8 rounded-xl font-bold text-xs"
                        >
                          Set In Review
                        </Button>
                      )}

                      {report.status === "RESOLVED" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(report.id, "PENDING")}
                          disabled={isPending}
                          className="h-8 rounded-xl font-bold text-xs text-muted-foreground"
                        >
                          Reopen
                        </Button>
                      )}

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(report.id)}
                        disabled={isPending}
                        className="h-8 w-8 rounded-xl text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
                        title="Delete Report"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
