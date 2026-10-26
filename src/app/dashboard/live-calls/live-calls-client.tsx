"use client";

import { useState, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Clock,
  Calendar,
  ExternalLink,
  PlayCircle,
  Sparkles,
  Search,
  CheckCircle2,
  Copy,
  Check,
  Radio,
  Send,
  HelpCircle,
  Shield,
  Layers,
  ArrowRight,
  Flame,
  CalendarDays,
  FileQuestion,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/components/landing/LanguageProvider";
import { submitTaskReport } from "@/actions/report.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface LiveCallItem {
  id: string;
  title: string;
  description: string | null;
  scheduledAt: string | Date;
  meetingUrl: string | null;
  replayUrl: string | null;
  isCompleted: boolean;
  createdAt?: string | Date;
}

interface LiveCallsClientProps {
  upcomingCalls: LiveCallItem[];
  pastCalls: LiveCallItem[];
}

export function LiveCallsClient({ upcomingCalls, pastCalls }: LiveCallsClientProps) {
  const { t, dir, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "replays" | "schedule">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [isSubmittingQuestion, startQuestionTransition] = useTransition();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Next primary call (the earliest upcoming call)
  const nextCall = upcomingCalls.length > 0 ? upcomingCalls[0] : null;

  // Countdown state for next call
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isLive: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isLive: false,
  });

  useEffect(() => {
    if (!nextCall) return;

    const targetTime = new Date(nextCall.scheduledAt).getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const diff = targetTime - now;

      // If within 2 hours of scheduled time, consider it streaming LIVE
      const twoHoursMs = 2 * 60 * 60 * 1000;
      if (diff <= 0 && diff > -twoHoursMs) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true });
        return;
      }

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isLive: false });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isLive: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextCall]);

  // Google Calendar Link Generator
  const generateGoogleCalendarUrl = (call: LiveCallItem) => {
    const startTime = new Date(call.scheduledAt);
    const endTime = new Date(startTime.getTime() + 90 * 60 * 1000); // 90 min

    const formatGDate = (d: Date) =>
      d.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const dates = `${formatGDate(startTime)}/${formatGDate(endTime)}`;
    const details = encodeURIComponent(
      `${call.description || "Weekly Mastermind Session"}\n\nJoin: ${call.meetingUrl || "https://eensell.university/dashboard/live-calls"}`
    );
    const location = encodeURIComponent(call.meetingUrl || "Google Meet");
    const text = encodeURIComponent(`Eensell University Live: ${call.title}`);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success(t("live_link_copied"));
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) {
      toast.error(t("live_q_input_placeholder"));
      return;
    }

    startQuestionTransition(async () => {
      try {
        const res = await submitTaskReport({
          dayNumber: 0,
          taskTitle: nextCall ? `Live Q&A: ${nextCall.title}` : "Live Q&A Submission",
          type: "QUESTION",
          message: questionText.trim(),
        });

        if (res.success) {
          toast.success(t("live_q_success"));
          setQuestionText("");
        } else {
          toast.error(res.error || "Failed to submit question");
        }
      } catch (err: any) {
        toast.error("Error submitting question. Please try again.");
      }
    });
  };

  // Filtered lists
  const filteredUpcoming = upcomingCalls.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredPast = pastCalls.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 pb-16 w-full" dir={dir}>
      {/* ── 1. Hero Spotlight Stage Widget ── */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-400/40 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 p-6 sm:p-10 shadow-2xl shadow-amber-500/20 text-slate-950">
        {/* Glow ambient meshes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.12] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/[0.15] rounded-full blur-[80px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/20 border border-slate-950/25 text-slate-950 text-xs font-black tracking-wide uppercase mb-4 backdrop-blur-md">
              {timeLeft.isLive ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
                  </span>
                  <span className="text-red-950 font-black">{t("live_status_live_now")}</span>
                </>
              ) : (
                <>
                  <Radio className="w-3.5 h-3.5 animate-pulse text-slate-950" />
                  <span>{t("live_badge")}</span>
                </>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight mb-3">
              {nextCall ? nextCall.title : t("live_hero_title")}
            </h1>

            <p className="text-sm sm:text-base text-slate-950/85 font-medium leading-relaxed max-w-xl">
              {nextCall?.description || t("live_hero_sub")}
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              {nextCall?.meetingUrl ? (
                <a
                  href={nextCall.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button className="h-12 px-6 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-black text-sm shadow-xl gap-2 cursor-pointer transition-transform hover:scale-[1.02]">
                    <Video className="w-4 h-4 text-amber-400" />
                    <span>{t("live_join_btn")}</span>
                  </Button>
                </a>
              ) : null}

              {nextCall ? (
                <a
                  href={generateGoogleCalendarUrl(nextCall)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button
                    variant="outline"
                    className="h-12 px-5 rounded-2xl bg-white/20 hover:bg-white/30 border-slate-950/20 text-slate-950 font-black text-sm backdrop-blur-md gap-2 cursor-pointer"
                  >
                    <CalendarDays className="w-4 h-4" />
                    <span>{t("live_add_calendar")}</span>
                  </Button>
                </a>
              ) : null}
            </div>
          </div>

          {/* Right: Live Ticking Countdown Clock Widget */}
          {nextCall && !timeLeft.isLive ? (
            <div className="w-full lg:w-auto p-5 sm:p-6 rounded-3xl bg-slate-950/35 border border-white/25 backdrop-blur-2xl shadow-2xl shrink-0">
              <div className="flex items-center gap-2 text-amber-200 text-xs font-bold uppercase tracking-wider mb-4">
                <Clock className="w-4 h-4 text-amber-300" />
                <span>{t("live_status_upcoming")}</span>
              </div>

              <div className="grid grid-cols-4 gap-2.5 sm:gap-3 text-center">
                <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/50 border border-white/10 min-w-[64px] sm:min-w-[76px]">
                  <span className="block text-2xl sm:text-3xl font-black text-white font-mono">
                    {String(timeLeft.days).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] sm:text-xs text-amber-300 font-bold uppercase">
                    {t("live_countdown_days")}
                  </span>
                </div>

                <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/50 border border-white/10 min-w-[64px] sm:min-w-[76px]">
                  <span className="block text-2xl sm:text-3xl font-black text-white font-mono">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] sm:text-xs text-amber-300 font-bold uppercase">
                    {t("live_countdown_hours")}
                  </span>
                </div>

                <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/50 border border-white/10 min-w-[64px] sm:min-w-[76px]">
                  <span className="block text-2xl sm:text-3xl font-black text-white font-mono">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] sm:text-xs text-amber-300 font-bold uppercase">
                    {t("live_countdown_mins")}
                  </span>
                </div>

                <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/50 border border-white/10 min-w-[64px] sm:min-w-[76px]">
                  <span className="block text-2xl sm:text-3xl font-black text-white font-mono">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] sm:text-xs text-amber-300 font-bold uppercase">
                    {t("live_countdown_secs")}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 text-center text-xs text-slate-950 font-bold">
                {new Date(nextCall.scheduledAt).toLocaleDateString(
                  dir === "rtl" ? "ar-MA" : "en-US",
                  {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* ── 2. Mastermind Stats Bar ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Video className="w-5 h-5 text-amber-500" />
          </div>
          <div className="min-w-0">
            <span className="text-xs text-muted-foreground font-semibold block truncate">
              {t("live_stat_total")}
            </span>
            <span className="text-lg sm:text-xl font-black text-foreground font-mono">
              {upcomingCalls.length + pastCalls.length}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div className="min-w-0">
            <span className="text-xs text-muted-foreground font-semibold block truncate">
              {t("live_stat_frequency")}
            </span>
            <span className="text-base sm:text-lg font-black text-foreground">
              {t("live_stat_frequency_val")}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-sky-500" />
          </div>
          <div className="min-w-0">
            <span className="text-xs text-muted-foreground font-semibold block truncate">
              {t("live_stat_duration")}
            </span>
            <span className="text-base sm:text-lg font-black text-foreground">
              {t("live_stat_duration_val")}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="min-w-0">
            <span className="text-xs text-muted-foreground font-semibold block truncate">
              {t("live_stat_platform")}
            </span>
            <span className="text-base sm:text-lg font-black text-foreground">
              {t("live_stat_platform_val")}
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. Interactive Filter Tabs & Search Bar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: "all", label: t("live_tab_all"), count: upcomingCalls.length + pastCalls.length },
            { id: "upcoming", label: t("live_tab_upcoming"), count: upcomingCalls.length },
            { id: "replays", label: t("live_tab_replays"), count: pastCalls.length },
            { id: "schedule", label: t("live_tab_schedule") },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 border cursor-pointer",
                  isActive
                    ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black"
                    : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted"
                )}
              >
                <span>{tab.label}</span>
                {typeof tab.count === "number" && (
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-md",
                      isActive
                        ? "bg-slate-950/20 text-slate-950 font-bold"
                        : "bg-muted text-muted-foreground font-semibold"
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px] sm:w-72">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("live_search_placeholder")}
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* ── 4. Main Body Content based on Tabs ── */}
      {activeTab === "schedule" ? (
        /* Schedule Tab View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
              <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-amber-500" />
                <span>{t("live_weekly_schedule_title")}</span>
              </h3>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold text-sm shrink-0">
                    TUE
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-amber-500">
                      {t("live_session_1_day")}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-foreground">
                      {t("live_session_1_title")}
                    </h4>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-500 flex items-center justify-center font-bold text-sm shrink-0">
                    THU
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-orange-500">
                      {t("live_session_2_day")}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-foreground">
                      {t("live_session_2_title")}
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Preparation Protocol Checklist */}
            <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{t("live_prep_checklist_title")}</span>
              </h3>
              <div className="space-y-2.5">
                {[t("live_prep_1"), t("live_prep_2"), t("live_prep_3")].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border text-xs sm:text-sm text-foreground/90"
                  >
                    <span className="w-5 h-5 rounded-md bg-amber-500/15 text-amber-500 flex items-center justify-center text-xs font-bold font-mono shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ask Question Widget in Schedule Column */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-500">
                <FileQuestion className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-foreground">
                {t("live_q_widget_title")}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t("live_q_widget_desc")}
              </p>

              <form onSubmit={handleQuestionSubmit} className="space-y-3 pt-2">
                <Textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder={t("live_q_input_placeholder")}
                  rows={5}
                  className="w-full text-xs sm:text-sm rounded-xl resize-none"
                />
                <Button
                  type="submit"
                  disabled={isSubmittingQuestion || !questionText.trim()}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm gap-2 cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmittingQuestion ? t("live_q_submitting") : t("live_q_submit_btn")}
                  </span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        /* Regular Feed: Upcoming & Replays */
        <div className="space-y-8">
          {/* Upcoming Calls Section */}
          {(activeTab === "all" || activeTab === "upcoming") && (
            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>{t("live_tab_upcoming")}</span>
              </h2>

              {filteredUpcoming.length === 0 ? (
                <Card className="bg-card/50 border-border">
                  <CardContent className="py-12 text-center space-y-3">
                    <Video className="w-10 h-10 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      {t("live_empty_upcoming")}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredUpcoming.map((call) => (
                    <Card
                      key={call.id}
                      className="bg-card border-border hover:border-amber-500/40 transition-all rounded-3xl overflow-hidden shadow-sm"
                    >
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge className="bg-amber-500/15 text-amber-500 border-amber-500/30 text-[10px] font-black uppercase tracking-wider">
                            {t("live_status_upcoming")}
                          </Badge>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            <span>
                              {new Date(call.scheduledAt).toLocaleDateString(
                                dir === "rtl" ? "ar-MA" : "en-US",
                                {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-base sm:text-lg font-black text-foreground mb-2 leading-snug">
                            {call.title}
                          </h3>
                          {call.description && (
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                              {call.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                          {call.meetingUrl && (
                            <a
                              href={call.meetingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1"
                            >
                              <Button className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm gap-2 cursor-pointer shadow-md">
                                <Video className="w-4 h-4 fill-slate-950" />
                                <span>{t("live_join_btn")}</span>
                              </Button>
                            </a>
                          )}
                          <a
                            href={generateGoogleCalendarUrl(call)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-11 w-11 rounded-xl cursor-pointer"
                              title={t("live_add_calendar")}
                            >
                              <CalendarDays className="w-4 h-4" />
                            </Button>
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Past Replays Section */}
          {(activeTab === "all" || activeTab === "replays") && (
            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-amber-500" />
                <span>{t("live_tab_replays")}</span>
              </h2>

              {filteredPast.length === 0 ? (
                <Card className="bg-card/50 border-border">
                  <CardContent className="py-12 text-center space-y-3">
                    <PlayCircle className="w-10 h-10 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      {t("live_empty_replays")}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPast.map((call) => (
                    <Card
                      key={call.id}
                      className="bg-card border-border hover:border-amber-500/30 transition-all rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between group"
                    >
                      <CardContent className="p-5 space-y-3.5">
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-black border border-white/10 flex items-center justify-center group-hover:border-amber-500/40 transition-all">
                          <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                            <PlayCircle className="w-6 h-6 fill-amber-500/20" />
                          </div>
                          <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-white">
                            60m+
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                            <span>
                              {new Date(call.scheduledAt).toLocaleDateString(
                                dir === "rtl" ? "ar-MA" : "en-US",
                                { month: "short", day: "numeric", year: "numeric" }
                              )}
                            </span>
                            <Badge variant="outline" className="text-[10px]">
                              {t("live_status_completed")}
                            </Badge>
                          </div>

                          <h3 className="text-sm sm:text-base font-bold text-foreground leading-snug line-clamp-2">
                            {call.title}
                          </h3>
                        </div>

                        <div className="pt-2 flex items-center gap-2">
                          {call.replayUrl ? (
                            <a
                              href={call.replayUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1"
                            >
                              <Button
                                size="sm"
                                className="w-full h-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs gap-1.5 cursor-pointer"
                              >
                                <PlayCircle className="w-3.5 h-3.5" />
                                <span>{t("live_replay_watch")}</span>
                              </Button>
                            </a>
                          ) : (
                            <Button
                              size="sm"
                              disabled
                              variant="ghost"
                              className="flex-1 h-10 rounded-xl text-xs text-muted-foreground"
                            >
                              <span>Processing Replay...</span>
                            </Button>
                          )}

                          {call.replayUrl && (
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleCopyLink(call.replayUrl!, call.id)}
                              className="h-10 w-10 rounded-xl cursor-pointer shrink-0"
                              title={t("live_replay_copy")}
                            >
                              {copiedId === call.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                              )}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Ask Question Card at Bottom of Feed */}
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-wider">
                <FileQuestion className="w-3.5 h-3.5" />
                <span>{t("live_q_widget_title")}</span>
              </div>
              <h3 className="text-xl font-black text-foreground">
                {t("live_q_widget_title")}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t("live_q_widget_desc")}
              </p>
            </div>

            <form
              onSubmit={handleQuestionSubmit}
              className="flex-1 w-full max-w-md flex flex-col gap-3"
            >
              <Textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder={t("live_q_input_placeholder")}
                rows={3}
                className="w-full text-xs sm:text-sm rounded-xl resize-none"
              />
              <Button
                type="submit"
                disabled={isSubmittingQuestion || !questionText.trim()}
                className="h-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm gap-2 cursor-pointer shadow-md self-end w-full sm:w-auto px-6"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isSubmittingQuestion ? t("live_q_submitting") : t("live_q_submit_btn")}
                </span>
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
