"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Send, Plus, Target, Settings2, Zap, LayoutDashboard,
  Presentation, FileText, Image as ImageIcon, Table, Globe,
  Video, LayoutGrid, Download, Paperclip, X, Sparkles,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Message = { id: string; role: "user" | "assistant"; content: string };

export function ChatInterface() {
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

  const suggestions = [
    "How do I make my first $100 online? 💰",
    "Give me a 7-day action plan 🗓️",
    "What AI tools should I master? 🤖",
    "Help me stay motivated today 🔥",
  ];

  return (
    <div
      className="flex flex-col h-full w-full"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Display', sans-serif" }}
    >
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {msgs.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg mb-4">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight mb-1">Nexus</h1>
            <p className="text-muted-foreground text-sm mb-10 max-w-xs leading-relaxed">
              Your personal AI mentor — here to motivate, guide, and help you build your first income online.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => { setInput(s); textareaRef.current?.focus(); }}
                  className="text-left px-4 py-3 rounded-2xl border border-border bg-card hover:bg-secondary/60 transition-colors text-sm text-foreground/80 leading-snug"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ── Message list ── */
          <div className="max-w-2xl mx-auto w-full px-4 py-6 space-y-5">
            {msgs.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mr-2.5 mt-0.5 shrink-0 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-foreground text-background rounded-br-md"
                      : "bg-secondary/50 border border-border rounded-bl-md"
                  }`}
                >
                  {m.content ? (
                    m.content.split("\n").map((line, i) => (
                      <p key={i} className={i > 0 ? "mt-1" : ""}>{line || <br />}</p>
                    ))
                  ) : (
                    <span className="flex gap-1 py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40 animate-bounce" style={{ animationDelay: "0.15s" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40 animate-bounce" style={{ animationDelay: "0.3s" }} />
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Input area ── */}
      <div className="px-4 pb-4 pt-2 max-w-2xl mx-auto w-full">

        {/* File previews */}
        {files && files.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 px-1">
            {Array.from(files).map((file, i) => (
              <div key={i} className="relative w-11 h-11 rounded-xl overflow-hidden bg-secondary border border-border flex items-center justify-center group shrink-0">
                {file.type.startsWith("image/") ? (
                  <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <FileText className="w-5 h-5 text-muted-foreground" />
                )}
                <button
                  type="button"
                  onClick={() => setFiles(null)}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input box */}
        <div className="bg-card border border-border rounded-3xl shadow-sm focus-within:border-foreground/20 transition-colors overflow-hidden">
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
            className="w-full bg-transparent border-none outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground/60 px-5 pt-4 pb-2 max-h-40 leading-relaxed"
          />

          {/* Toolbar */}
          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-1.5">
              <Button type="button" onClick={() => fileInputRef.current?.click()} variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-secondary">
                <Plus className="w-4 h-4" />
              </Button>
              <Button type="button" onClick={() => appendToInput("@ ")} variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-secondary">
                <Target className="w-4 h-4" />
              </Button>
              <Button type="button" onClick={() => appendToInput("How do I connect external tools? ")} variant="ghost" className="h-8 rounded-full hover:bg-secondary text-xs px-3 gap-1.5 font-medium hidden sm:flex">
                <Settings2 className="w-3.5 h-3.5" /> Connect Tools
              </Button>
              <Button type="button" onClick={() => appendToInput("List your available skills. ")} variant="ghost" className="h-8 rounded-full hover:bg-secondary text-xs px-3 gap-1.5 font-medium hidden sm:flex">
                <Zap className="w-3.5 h-3.5" /> Skills
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-secondary transition-colors outline-none cursor-pointer">
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
                className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center disabled:opacity-30 hover:bg-foreground/85 transition-all shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Colored action pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <Button type="button" variant="outline" size="sm" className="rounded-full text-xs gap-1.5 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors" onClick={() => appendToInput("Generate slides about: ")}>
            <Presentation className="w-3.5 h-3.5 text-rose-500" /> Slides
          </Button>
          <Button type="button" variant="outline" size="sm" className="rounded-full text-xs gap-1.5 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors" onClick={exportPDF}>
            <Download className="w-3.5 h-3.5 text-blue-500" /> Export PDF
          </Button>
          <Button type="button" variant="outline" size="sm" className="rounded-full text-xs gap-1.5 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-colors" onClick={() => appendToInput("Generate an image prompt for: ")}>
            <ImageIcon className="w-3.5 h-3.5 text-amber-500" /> Images
          </Button>
          <Button type="button" variant="outline" size="sm" className="rounded-full text-xs gap-1.5 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors" onClick={() => appendToInput("Create a spreadsheet/table for: ")}>
            <Table className="w-3.5 h-3.5 text-emerald-500" /> Sheets
          </Button>
          <Button type="button" variant="outline" size="sm" className="rounded-full text-xs gap-1.5 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition-colors" onClick={() => appendToInput("Write landing page copy for: ")}>
            <Globe className="w-3.5 h-3.5 text-purple-500" /> Websites
          </Button>
          <Button type="button" variant="outline" size="sm" className="rounded-full text-xs gap-1.5 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-colors" onClick={() => appendToInput("Write an engaging video script about: ")}>
            <Video className="w-3.5 h-3.5 text-pink-500" /> Videos
          </Button>
          <Button type="button" variant="outline" size="sm" className="rounded-full text-xs gap-1.5 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 transition-colors" onClick={() => appendToInput("What are all the skills you can help with? ")}>
            <LayoutGrid className="w-3.5 h-3.5 text-teal-500" /> All Skills
          </Button>
        </div>

        <p className="text-center text-[11px] text-muted-foreground/40 mt-3">
          {usage.count} / {usage.limit} messages this month · Nexus can make mistakes
        </p>
      </div>
    </div>
  );
}
