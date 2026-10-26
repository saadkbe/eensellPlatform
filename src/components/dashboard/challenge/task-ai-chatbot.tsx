"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  X,
  Send,
  AlertCircle,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  ChevronDown,
  Clock,
  Target,
  ShieldAlert,
  HelpCircle,
  Flame,
  Check,
  RefreshCw,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { getRoadmapDay, RoadmapDay } from "@/data/roadmap-data";
import { submitTaskReport } from "@/actions/report.actions";
import { askTaskAiCoach } from "@/actions/task-ai.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TaskAiChatbotProps {
  currentDayNumber?: number;
}

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  isInitialBriefing?: boolean;
  isReportConfirmation?: boolean;
}

// Markdown Formatter for conversational AI replies
function RenderFormattedText({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-2 text-sm leading-relaxed text-slate-200">
      {lines.map((line, idx) => {
        if (!line.trim()) {
          return <div key={idx} className="h-1.5" />;
        }

        // Parse **bold** parts
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        const formattedLine = parts.map((part, pIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={pIdx} className="font-bold text-white">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

        // Bullet point styling
        if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1.5 text-slate-300">
              <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
              <span>{formattedLine}</span>
            </div>
          );
        }

        return <p key={idx}>{formattedLine}</p>;
      })}
    </div>
  );
}

export function TaskAiChatbot({ currentDayNumber = 1 }: TaskAiChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"chat" | "report">("chat");
  const [inputText, setInputText] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const [reportType, setReportType] = useState<"PROBLEM" | "QUESTION" | "FEEDBACK">("PROBLEM");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isReportSubmitting, startReportTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const roadmap: RoadmapDay = getRoadmapDay(currentDayNumber);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "briefing",
      sender: "bot",
      text: "",
      isInitialBriefing: true,
    },
  ]);

  useEffect(() => {
    setMessages([
      {
        id: `briefing-day-${roadmap.dayNumber}`,
        sender: "bot",
        text: "",
        isInitialBriefing: true,
      },
    ]);
  }, [roadmap.dayNumber]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, mode, isAiLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isAiLoading) return;

    setInputText("");

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: "user",
      text: query,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsAiLoading(true);

    try {
      // Build conversation history for OpenAI context
      const history = newMessages
        .filter((m) => !m.isInitialBriefing)
        .map((m) => ({
          role: (m.sender === "user" ? "user" : "assistant") as "user" | "assistant",
          content: m.text,
        }));

      const res = await askTaskAiCoach({
        dayNumber: roadmap.dayNumber,
        question: query,
        conversationHistory: history,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: "bot",
          text: res.reply || "How else can I help with today's deliverables?",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: "bot",
          text: "I ran into a temporary issue reaching the AI service. If you need help, feel free to use the 'Report a Problem' button to notify the instructor team.",
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleReportSubmit = () => {
    if (!reportMessage.trim()) {
      toast.error("Please describe your problem or blocker first.");
      return;
    }

    startReportTransition(async () => {
      try {
        const res = await submitTaskReport({
          dayNumber: roadmap.dayNumber,
          taskTitle: roadmap.title,
          type: reportType,
          message: reportMessage.trim(),
        });

        if (res.success) {
          toast.success("Problem reported! The admin team has received your ticket.");
          const confirmedText = `🚨 **Problem Report Dispatched to Admins**\n\n**Category:** ${reportType}\n**Day ${roadmap.dayNumber}:** ${roadmap.title}\n**Your Note:** "${reportMessage.trim()}"\n\n✅ Your ticket is logged in the admin panel with status: **PENDING**. Our instructors will review it!`;

          setMessages((prev) => [
            ...prev,
            {
              id: String(Date.now()),
              sender: "bot",
              text: confirmedText,
              isReportConfirmation: true,
            },
          ]);

          setReportMessage("");
          setMode("chat");
        } else {
          toast.error(res.error || "Failed to submit report.");
        }
      } catch (e: any) {
        toast.error("Error submitting report. Please try again.");
      }
    });
  };

  return (
    <>
      {/* ── Floating Launcher Pill ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 15 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-slate-950 font-black text-sm shadow-[0_8px_30px_rgba(245,158,11,0.5)] hover:shadow-[0_8px_36px_rgba(245,158,11,0.65)] border border-amber-300/40 transition-all cursor-pointer group"
            >
              <div className="relative flex items-center justify-center">
                <Bot className="w-5 h-5 fill-slate-950" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950 animate-ping" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950" />
              </div>
              <span className="tracking-wide">
                Day {roadmap.dayNumber} AI Task Coach
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Chatbot Window Modal ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[480px] max-h-[660px] h-[84vh] flex flex-col rounded-3xl bg-[#0B0D13] border border-amber-500/40 shadow-[0_16px_60px_rgba(0,0,0,0.7)] overflow-hidden backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-transparent border-b border-white/[0.08] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 shadow-md shrink-0">
                  <Bot className="w-6 h-6 fill-slate-950" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white truncate tracking-tight">
                      Day {roadmap.dayNumber} AI Mission Coach
                    </h3>
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  </div>
                  <p className="text-xs text-amber-300 font-semibold truncate mt-0.5">
                    {roadmap.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setMode(mode === "chat" ? "report" : "chat")}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1.5 border cursor-pointer",
                    mode === "report"
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                      : "bg-white/[0.05] text-amber-400 border-amber-500/20 hover:bg-white/[0.1]"
                  )}
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{mode === "report" ? "Back to Chat" : "Report Problem"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                  title="Close AI Coach"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mode: Problem Report Form */}
            {mode === "report" ? (
              <div className="flex-1 p-6 overflow-y-auto space-y-5 scrollbar-thin">
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-200">
                  <div className="flex items-center gap-2 mb-1.5">
                    <ShieldAlert className="w-5 h-5 text-rose-400" />
                    <span className="text-sm font-black uppercase tracking-wider text-rose-300">
                      Report a Task Blocker
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-rose-200/90 leading-relaxed">
                    Experiencing a problem with Day {roadmap.dayNumber}? Describe the blocker below. Your note goes straight to the Eensell University Admin Panel for immediate instructor assistance.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Category
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["PROBLEM", "QUESTION", "FEEDBACK"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setReportType(t)}
                        className={cn(
                          "py-2.5 rounded-xl text-xs font-black tracking-wider transition-all border cursor-pointer",
                          reportType === t
                            ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md"
                            : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.06]"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    What blocker or error did you encounter?
                  </label>
                  <Textarea
                    value={reportMessage}
                    onChange={(e) => setReportMessage(e.target.value)}
                    placeholder={`Provide details regarding Day ${roadmap.dayNumber} (e.g. webhook verification error, Make.com module setup, API token expired)...`}
                    rows={6}
                    className="w-full bg-[#131620] border-white/15 rounded-2xl text-sm text-white placeholder:text-slate-500 focus:border-amber-500/50 resize-none p-4 leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <Button
                    onClick={handleReportSubmit}
                    disabled={isReportSubmitting || !reportMessage.trim()}
                    className="flex-1 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-md border-0 gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isReportSubmitting ? "Submitting Ticket..." : "Submit to Admin Panel"}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setMode("chat")}
                    className="h-12 rounded-xl text-sm font-bold text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              /* Mode: Chat */
              <>
                <div className="flex-1 p-5 overflow-y-auto space-y-4 text-sm scrollbar-thin">
                  {messages.map((m) => {
                    if (m.isInitialBriefing) {
                      return (
                        <div key={m.id} className="space-y-3">
                          {/* Rich Mission Card */}
                          <div className="rounded-2xl bg-[#141824] border border-amber-500/25 p-4 sm:p-5 shadow-lg space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                              <div className="flex items-center gap-2">
                                <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
                                  DAY {roadmap.dayNumber}
                                </span>
                                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                                  {roadmap.phaseShort}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                                <Clock className="w-3.5 h-3.5 text-amber-400" />
                                <span>{roadmap.estimatedTime}</span>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-base sm:text-lg font-black text-white leading-snug">
                                {roadmap.title}
                              </h4>
                              <p className="text-sm text-slate-300/90 mt-2 leading-relaxed">
                                {roadmap.summary}
                              </p>
                            </div>

                            {/* Checklist Box */}
                            <div className="space-y-2 pt-1">
                              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                                Core Deliverables Checklist:
                              </span>
                              <div className="space-y-1.5">
                                {roadmap.deliverables.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-xs sm:text-sm text-slate-200"
                                  >
                                    <span className="flex h-5 w-5 rounded-md bg-amber-500/20 text-amber-400 items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                                      {idx + 1}
                                    </span>
                                    <span className="leading-relaxed">{item}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs text-slate-400">
                              <span>Reward on completion: <strong className="text-amber-400">+50 XP</strong></span>
                              <button
                                type="button"
                                onClick={() => setMode("report")}
                                className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>Report Issue</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={m.id}
                        className={cn(
                          "flex flex-col max-w-[90%] leading-relaxed",
                          m.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                        )}
                      >
                        <div
                          className={cn(
                            "p-4 rounded-2xl break-words shadow-sm text-sm",
                            m.sender === "user"
                              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-tr-none"
                              : m.isReportConfirmation
                              ? "bg-rose-500/15 border border-rose-500/30 text-rose-200 rounded-tl-none font-medium"
                              : "bg-[#141824] border border-white/[0.08] text-slate-100 rounded-tl-none"
                          )}
                        >
                          <RenderFormattedText content={m.text} />
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isAiLoading && (
                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#141824] border border-white/[0.08] w-fit text-amber-400">
                      <Bot className="w-4 h-4 animate-spin" />
                      <span className="text-xs font-semibold animate-pulse">
                        Mission Coach is thinking...
                      </span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts Bar */}
                <div className="px-4 py-2.5 border-t border-white/[0.06] flex items-center gap-2 overflow-x-auto no-scrollbar bg-black/30">
                  <button
                    type="button"
                    onClick={() => handleSendMessage(`How do I execute step 1 for Day ${roadmap.dayNumber}?`)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-all whitespace-nowrap border border-white/[0.08] cursor-pointer flex items-center gap-1.5"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>How to do Step 1?</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendMessage(`What are the most common pitfalls for Day ${roadmap.dayNumber}?`)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-all whitespace-nowrap border border-white/[0.08] cursor-pointer flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                    <span>Common pitfalls</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("report")}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 transition-all whitespace-nowrap border border-rose-500/30 cursor-pointer flex items-center gap-1.5"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Report blocker</span>
                  </button>
                </div>

                {/* Input Bar */}
                <div className="p-3.5 bg-[#090A0F] border-t border-white/[0.08] flex items-center gap-2.5">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={`Ask AI Coach about Day ${roadmap.dayNumber}...`}
                    disabled={isAiLoading}
                    className="flex-1 bg-[#131622] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60 transition-colors"
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputText.trim() || isAiLoading}
                    size="icon"
                    className="w-11 h-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black hover:from-amber-400 hover:to-orange-400 border-0 shrink-0 cursor-pointer shadow-md disabled:opacity-40"
                  >
                    <Send className="w-4 h-4 fill-slate-950" />
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
