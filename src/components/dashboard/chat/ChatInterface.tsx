"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Plus, Paperclip, X, FileText, Sparkles } from "lucide-react";

type Message = { id: string; role: "user" | "assistant"; content: string };

export function ChatInterface() {
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usage, setUsage] = useState({ count: 0, limit: 10 });
  const [files, setFiles] = useState<FileList | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch("/api/chat/usage")
      .then((res) => res.json())
      .then((data) => setUsage(data))
      .catch(console.error);
  }, [msgs]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [input]);

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
        let done = false;
        while (!done) {
          const result = await reader.read();
          done = result.done;
          if (result.value) {
            const chunk = decoder.decode(result.value, { stream: true });
            setMsgs((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: m.content + chunk } : m
              )
            );
          }
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestions = [
    "How do I make my first $100 online? 💰",
    "Give me a 7-day action plan 🗓️",
    "What AI tools should I master first? 🤖",
    "Help me stay motivated today 🔥",
  ];

  return (
    <div
      className="flex flex-col h-full w-full"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Display', sans-serif" }}
    >
      {/* Messages or Empty State */}
      <div className="flex-1 overflow-y-auto">
        {msgs.length === 0 ? (
          /* Empty State — centered */
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="mb-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg mx-auto">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-foreground mb-1 tracking-tight">
              Nexus
            </h1>
            <p className="text-muted-foreground text-sm mb-10 max-w-xs leading-relaxed">
              Your personal AI mentor — here to motivate, guide, and help you build your first income online.
            </p>

            {/* Suggestion pills */}
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
          /* Message list */
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
                      : "bg-secondary/50 border border-border text-foreground rounded-bl-md"
                  }`}
                >
                  {m.content ? (
                    m.content.split("\n").map((line, i) => (
                      <p key={i} className={i > 0 ? "mt-1" : ""}>{line}</p>
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

      {/* Input bar — always at bottom */}
      <div className="px-4 pb-5 pt-2 max-w-2xl mx-auto w-full">
        {/* Usage indicator */}
        <p className="text-center text-xs text-muted-foreground/60 mb-2">
          {usage.count} / {usage.limit} messages this month
        </p>

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
        <div className="flex items-end gap-2 bg-card border border-border rounded-3xl px-4 py-3 shadow-sm focus-within:border-foreground/20 transition-colors">
          <input
            type="file"
            ref={fileInputRef}
            hidden
            multiple
            accept="image/*,application/pdf,.doc,.docx,.txt"
            onChange={(e) => setFiles(e.target.files)}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-7 h-7 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0 mb-0.5"
          >
            <Plus className="w-4 h-4" />
          </button>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Nexus..."
            rows={1}
            className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground/60 py-0.5 max-h-40 leading-relaxed"
          />

          <button
            type="button"
            onClick={sendMessage}
            disabled={isLoading || (!input.trim() && (!files || files.length === 0)) || usage.count >= usage.limit}
            className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 disabled:opacity-30 hover:bg-foreground/85 transition-all shadow-sm mb-0.5"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-center text-[11px] text-muted-foreground/40 mt-2.5">
          Nexus can make mistakes. Verify important info.
        </p>
      </div>
    </div>
  );
}
