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
  HelpCircle,
  Clock,
  Target,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { getRoadmapDay, RoadmapDay } from "@/data/roadmap-data";
import { submitTaskReport } from "@/actions/report.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TaskAiChatbotProps {
  currentDayNumber?: number;
}

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  isReportConfirmation?: boolean;
}

export function TaskAiChatbot({ currentDayNumber = 1 }: TaskAiChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"chat" | "report">("chat");
  const [inputText, setInputText] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const [reportType, setReportType] = useState<"PROBLEM" | "QUESTION" | "FEEDBACK">("PROBLEM");
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const roadmap: RoadmapDay = getRoadmapDay(currentDayNumber);

  const initialBotMessage: ChatMessage = {
    id: "init",
    sender: "bot",
    text: `👋 Hey! Today is **Day ${roadmap.dayNumber}: ${roadmap.title}**\n\n⏱️ **Estimated time:** ${roadmap.estimatedTime}  \n🎯 **Mission Focus:** ${roadmap.summary}\n\n📋 **Today's Key Deliverables:**\n${roadmap.deliverables.map((d, i) => `${i + 1}. ${d}`).join("\n")}\n\nFeel free to ask questions about today's task, or tap **Report a Problem** if you run into any blocker!`,
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialBotMessage]);

  // Keep bot updated if currentDayNumber changes
  useEffect(() => {
    setMessages([
      {
        id: `day-${roadmap.dayNumber}`,
        sender: "bot",
        text: `👋 Today's focus is **Day ${roadmap.dayNumber}: ${roadmap.title}**\n\n⏱️ **Estimated time:** ${roadmap.estimatedTime}  \n🎯 **Mission:** ${roadmap.summary}\n\n📋 **Deliverables Checklist:**\n${roadmap.deliverables.map((d, i) => `${i + 1}. ${d}`).join("\n")}\n\nNeed guidance or running into an issue? Let me know below!`,
      },
    ]);
  }, [roadmap.dayNumber]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, mode]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText("");

    const newMsg: ChatMessage = {
      id: String(Date.now()),
      sender: "user",
      text: userText,
    };

    setMessages((prev) => [...prev, newMsg]);

    // Generate responsive contextual AI guidance
    setTimeout(() => {
      let botReply = "";
      const lower = userText.toLowerCase();

      if (lower.includes("problem") || lower.includes("bug") || lower.includes("error") || lower.includes("stuck") || lower.includes("not working")) {
        botReply = `I understand you're facing an issue with Day ${roadmap.dayNumber}. Would you like to submit an official problem report to the admin team? Click the **Report a Problem** button above to alert our instructors immediately!`;
      } else if (lower.includes("time") || lower.includes("how long")) {
        botReply = `Day ${roadmap.dayNumber} takes approximately **${roadmap.estimatedTime}** to complete if you focus on the checklist items step-by-step.`;
      } else if (lower.includes("deliverable") || lower.includes("step") || lower.includes("task")) {
        botReply = `Here are the exact checklist tasks for Day ${roadmap.dayNumber}:\n\n${roadmap.deliverables.map((d, i) => `• Step ${i + 1}: ${d}`).join("\n")}\n\nTip: Tackle them sequentially and check them off in your 60-Day Roadmap!`;
      } else {
        botReply = `Great question regarding Day ${roadmap.dayNumber} (**${roadmap.title}**)! Focus on executing: "${roadmap.deliverables[0]}". Once done, verify the outputs and mark it complete on your roadmap for +50 XP. If you run into a bug or technical blocker, tap **Report a Problem** to notify the admin team.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: "bot",
          text: botReply,
        },
      ]);
    }, 600);
  };

  const handleReportSubmit = () => {
    if (!reportMessage.trim()) {
      toast.error("Please describe the problem before submitting.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await submitTaskReport({
          dayNumber: roadmap.dayNumber,
          taskTitle: roadmap.title,
          type: reportType,
          message: reportMessage.trim(),
        });

        if (res.success) {
          toast.success("Problem reported! The admin team has received your ticket.");
          const confirmedText = `🚨 **Problem Report Submitted**\n\n**Day ${roadmap.dayNumber}:** ${roadmap.title}\n**Issue:** ${reportMessage.trim()}\n\n✅ Your report has been dispatched to the admin dashboard. We will review it shortly!`;
          
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
      {/* ── Floating Launcher Pill / Button ── */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-slate-950 font-black text-xs shadow-[0_4px_24px_rgba(245,158,11,0.45)] hover:shadow-[0_4px_30px_rgba(245,158,11,0.6)] border border-amber-300/40 transition-all cursor-pointer"
        >
          <div className="relative">
            <Bot className="w-5 h-5 fill-slate-950" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950" />
          </div>
          <span className="hidden sm:inline tracking-wide font-extrabold">
            Day {roadmap.dayNumber} AI Task Coach
          </span>
          <span className="sm:hidden font-extrabold">Day {roadmap.dayNumber} AI</span>
        </motion.button>
      </div>

      {/* ── Chatbot Window Modal ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[600px] h-[80vh] flex flex-col rounded-3xl bg-[#0C0E14] border border-amber-500/30 shadow-[0_12px_48px_rgba(0,0,0,0.6)] overflow-hidden backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-transparent border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 shadow-md shrink-0">
                  <Bot className="w-5 h-5 fill-slate-950" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-black text-white truncate">
                      Day {roadmap.dayNumber} Mission Coach
                    </h3>
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  </div>
                  <p className="text-[11px] text-amber-300/80 font-medium truncate">
                    {roadmap.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setMode(mode === "chat" ? "report" : "chat")}
                  className={cn(
                    "px-2.5 py-1 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-1 border",
                    mode === "report"
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                      : "bg-white/[0.04] text-amber-400 border-amber-500/20 hover:bg-white/[0.08]"
                  )}
                >
                  <AlertCircle className="w-3 h-3" />
                  <span>{mode === "report" ? "Back to Chat" : "Report Problem"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mode: Problem Report Form */}
            {mode === "report" ? (
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-200">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-rose-300">
                      Report a Task Problem
                    </span>
                  </div>
                  <p className="text-xs text-rose-200/80 leading-relaxed">
                    Stuck on Day {roadmap.dayNumber}? Submit a report directly to the instructors and admin team for rapid troubleshooting.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Report Category
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["PROBLEM", "QUESTION", "FEEDBACK"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setReportType(t)}
                        className={cn(
                          "py-2 rounded-xl text-[10px] font-black tracking-wider transition-all border",
                          reportType === t
                            ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm"
                            : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.06]"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    What is the issue you encountered?
                  </label>
                  <Textarea
                    value={reportMessage}
                    onChange={(e) => setReportMessage(e.target.value)}
                    placeholder={`Describe the blocker on Day ${roadmap.dayNumber} (e.g. webhook failed, tool access issue, confusing step)...`}
                    rows={5}
                    className="w-full bg-[#13161F] border-white/10 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:border-amber-500/50 resize-none p-3.5"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Button
                    onClick={handleReportSubmit}
                    disabled={isPending || !reportMessage.trim()}
                    className="flex-1 h-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md border-0 gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isPending ? "Submitting..." : "Submit to Admin Panel"}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setMode("chat")}
                    className="h-11 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              /* Mode: Chat */
              <>
                <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={cn(
                        "flex flex-col max-w-[88%] leading-relaxed",
                        m.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                      )}
                    >
                      <div
                        className={cn(
                          "p-3.5 rounded-2xl whitespace-pre-wrap break-words",
                          m.sender === "user"
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-medium rounded-tr-none shadow-sm"
                            : m.isReportConfirmation
                            ? "bg-rose-500/15 border border-rose-500/30 text-rose-200 rounded-tl-none font-medium"
                            : "bg-[#141722] border border-white/[0.06] text-slate-200 rounded-tl-none shadow-sm"
                        )}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts */}
                <div className="px-3 py-2 border-t border-white/[0.06] flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-white/[0.01]">
                  <button
                    type="button"
                    onClick={() => {
                      setInputText("How do I complete today's task?");
                    }}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all whitespace-nowrap border border-white/[0.06]"
                  >
                    💡 How to complete?
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInputText("What are the core deliverables?");
                    }}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all whitespace-nowrap border border-white/[0.06]"
                  >
                    📋 Deliverables list
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("report")}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-all whitespace-nowrap border border-rose-500/20"
                  >
                    🚨 Report blocker
                  </button>
                </div>

                {/* Input Bar */}
                <div className="p-3 bg-[#090A0F] border-t border-white/[0.08] flex items-center gap-2">
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
                    placeholder={`Ask about Day ${roadmap.dayNumber} or type report...`}
                    className="flex-1 bg-[#131620] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim()}
                    size="icon"
                    className="w-9 h-9 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black hover:from-amber-400 hover:to-orange-400 border-0 shrink-0 cursor-pointer shadow-sm"
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
