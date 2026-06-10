"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Send, Plus, Target, Settings2, Zap, LayoutDashboard,
  Presentation, FileText, Image as ImageIcon, Table, Globe,
  Video, LayoutGrid, Download, X, Sparkles,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Message = { id: string; role: "user" | "assistant"; content: string };

export function ChatInterface() {
  const { user } = useUser();
  const firstName = user?.firstName || "Champion";

  const [msgs, setMsgs] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usage, setUsage] = useState({ count: 0, limit: 10 });
  const [files, setFiles] = useState<FileList | null>(null);
  const [model, setModel] = useState("GPT-4o");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch("/api/chat/usage")
      .then((r) => r.json())
      .then((d) => setUsage(d))
      .catch(console.error);
  }, [msgs]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, isLoading]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [input]);

  const exportPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Nexus Chat Export", 10, 10);
    doc.setFontSize(12);
    let y = 25;
    msgs.forEach((m) => {
      const text = `${m.role === "user" ? "You" : "Nexus"}: ${m.content}`;
      const lines = doc.splitTextToSize(text, 180);
      doc.text(lines, 10, y);
      y += lines.length * 7 + 5;
      if (y > 270) { doc.addPage(); y = 20; }
    });
    doc.save("nexus-chat.pdf");
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text && (!files || files.length === 0)) return;
    if (isLoading) return;
    if (usage.count >= usage.limit) {
      alert("You've reached your monthly limit of 10 messages.");
      return;
    }

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    const newMsgs = [...msgs, userMsg];
    setMsgs(newMsgs);
    setInput("");
    setFiles(null);
    setIsLoading(true);

    const assistantId = (Date.now() + 1).toString();
    setMsgs((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMsgs.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setMsgs((prev) =>
            prev.map((m) => m.id === assistantId ? { ...m, content: m.content + chunk } : m)
          );
        }
      }
    } catch (err) {
      console.error(err);
      setMsgs((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Sorry, something went wrong. Please try again! 🙏" }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const appendToInput = (text: string) => {
    setInput((prev) => prev + text);
    textareaRef.current?.focus();
  };

  return (
    <div
      className="relative flex flex-col h-full w-full"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Display', sans-serif" }}
    >

      {/* ── Scrollable content area ── */}
      <div className="flex-1 overflow-y-auto pb-64">
        {msgs.length === 0 ? (

          /* ── Empty state with personalized headline ── */
          <div className="flex flex-col items-center justify-center min-h-full px-6 py-16 text-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-xl mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>

            {/* Personalized bold headline */}
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              What&apos;s on your mind,<br />{firstName}? 🚀
            </h1>
            <p className="text-muted-foreground text-base mb-12 max-w-sm leading-relaxed">
              I&apos;m Nexus — your AI mentor. Ask me anything about making money online, staying motivated, or growing your skills.
            </p>

            {/* Suggestion pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {[
                { emoji: "💰", text: "How do I make my first $100 online?" },
                { emoji: "🗓️", text: "Give me a 7-day action plan" },
                { emoji: "🤖", text: "What AI tools should I master?" },
                { emoji: "🔥", text: "Help me stay motivated today" },
              ].map((s) => (
                <button
                  key={s.text}
                  onClick={() => { setInput(`${s.emoji} ${s.text}`); textareaRef.current?.focus(); }}
                  className="text-left px-5 py-4 rounded-2xl border border-border bg-card hover:bg-secondary/60 hover:border-foreground/20 transition-all text-base text-foreground/80 leading-snug font-medium"
                >
                  <span className="mr-2">{s.emoji}</span>{s.text}
                </button>
              ))}
            </div>
          </div>

        ) : (

          /* ── Message list ── */
          <div className="max-w-2xl mx-auto w-full px-4 py-8 space-y-6">
            {msgs.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mr-3 mt-1 shrink-0 shadow-sm">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-5 py-3.5 rounded-2xl text-base leading-relaxed ${
                    m.role === "user"
                      ? "bg-foreground text-background rounded-br-md"
                      : "bg-secondary/60 border border-border/60 rounded-bl-md"
                  }`}
                >
                  {m.content ? (
                    m.content.split("\n").map((line, i) => (
                      <p key={i} className={i > 0 ? "mt-1.5" : ""}>{line || <br />}</p>
                    ))
                  ) : (
                    <span className="flex gap-1.5 py-1">
                      <span className="w-2 h-2 rounded-full bg-current opacity-40 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-current opacity-40 animate-bounce" style={{ animationDelay: "0.15s" }} />
                      <span className="w-2 h-2 rounded-full bg-current opacity-40 animate-bounce" style={{ animationDelay: "0.3s" }} />
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

        )}
      </div>

      {/* ── Fixed glassmorphism input bar ── */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-5 pt-4 bg-gradient-to-t from-background via-background/95 to-transparent backdrop-blur-sm">
        <div className="max-w-2xl mx-auto w-full">

          {/* File previews */}
          {files && files.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3 px-1">
              {Array.from(files).map((file, i) => (
                <div key={i} className="relative w-12 h-12 rounded-xl overflow-hidden bg-secondary border border-border flex items-center justify-center group shrink-0">
                  {file.type.startsWith("image/") ? (
                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  )}
                  <button type="button" onClick={() => setFiles(null)} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Glass input box */}
          <div
            className="rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              hidden
              multiple
              accept="image/*,application/pdf,.doc,.docx,.txt"
              onChange={(e) => setFiles(e.target.files)}
            />

            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
              }}
              placeholder="Message Nexus..."
              rows={1}
              className="w-full bg-transparent border-none outline-none resize-none text-base text-foreground placeholder:text-foreground/40 px-5 pt-4 pb-2 max-h-40 leading-relaxed"
            />

            <div className="flex items-center justify-between px-3 pb-3">
              <div className="flex items-center gap-1">
                <Button type="button" onClick={() => fileInputRef.current?.click()} variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-black/5 text-foreground/60">
                  <Plus className="w-4 h-4" />
                </Button>
                <Button type="button" onClick={() => appendToInput("@ ")} variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-black/5 text-foreground/60">
                  <Target className="w-4 h-4" />
                </Button>
                <Button type="button" onClick={() => appendToInput("How do I connect external tools? ")} variant="ghost" className="h-8 rounded-full hover:bg-black/5 text-foreground/60 text-xs px-3 gap-1.5 hidden sm:flex">
                  <Settings2 className="w-3.5 h-3.5" /> Connect Tools
                </Button>
                <Button type="button" onClick={() => appendToInput("List your available skills. ")} variant="ghost" className="h-8 rounded-full hover:bg-black/5 text-foreground/60 text-xs px-3 gap-1.5 hidden sm:flex">
                  <Zap className="w-3.5 h-3.5" /> Skills
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-xs font-medium text-foreground/50 flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-black/5 transition-colors outline-none cursor-pointer">
                    <LayoutDashboard className="w-3.5 h-3.5" /> {model}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 rounded-xl">
                    <DropdownMenuItem onClick={() => setModel("GPT-4o")} className="cursor-pointer">
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">GPT-4o</span>
                        <span className="text-xs text-muted-foreground">Fast, high intelligence</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <div className="flex flex-col opacity-50">
                        <span className="font-medium text-sm">Claude 3.5 Sonnet</span>
                        <span className="text-xs text-blue-500">Upcoming</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <button
                  onClick={sendMessage}
                  disabled={isLoading || (!input.trim() && (!files || files.length === 0)) || usage.count >= usage.limit}
                  className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center disabled:opacity-25 hover:scale-105 transition-transform shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Colored action pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            <Button type="button" variant="outline" size="sm" className="rounded-full text-xs gap-1.5 bg-white/60 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors" onClick={() => appendToInput("Generate slides about: ")}>
              <Presentation className="w-3.5 h-3.5 text-rose-500" /> Slides
            </Button>
            <Button type="button" variant="outline" size="sm" className="rounded-full text-xs gap-1.5 bg-white/60 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors" onClick={exportPDF}>
              <Download className="w-3.5 h-3.5 text-blue-500" /> Export PDF
            </Button>
            <Button type="button" variant="outline" size="sm" className="rounded-full text-xs gap-1.5 bg-white/60 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-colors" onClick={() => appendToInput("Generate an image prompt for: ")}>
              <ImageIcon className="w-3.5 h-3.5 text-amber-500" /> Images
            </Button>
            <Button type="button" variant="outline" size="sm" className="rounded-full text-xs gap-1.5 bg-white/60 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors" onClick={() => appendToInput("Create a table for: ")}>
              <Table className="w-3.5 h-3.5 text-emerald-500" /> Sheets
            </Button>
            <Button type="button" variant="outline" size="sm" className="rounded-full text-xs gap-1.5 bg-white/60 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition-colors" onClick={() => appendToInput("Write landing page copy for: ")}>
              <Globe className="w-3.5 h-3.5 text-purple-500" /> Websites
            </Button>
            <Button type="button" variant="outline" size="sm" className="rounded-full text-xs gap-1.5 bg-white/60 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-colors" onClick={() => appendToInput("Write an engaging video script about: ")}>
              <Video className="w-3.5 h-3.5 text-pink-500" /> Videos
            </Button>
            <Button type="button" variant="outline" size="sm" className="rounded-full text-xs gap-1.5 bg-white/60 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 transition-colors" onClick={() => appendToInput("What are all the skills you can help with? ")}>
              <LayoutGrid className="w-3.5 h-3.5 text-teal-500" /> All Skills
            </Button>
          </div>

          <p className="text-center text-[11px] text-muted-foreground/40 mt-2.5">
            {usage.count} / {usage.limit} messages this month · Nexus can make mistakes
          </p>
        </div>
      </div>
    </div>
  );
}
