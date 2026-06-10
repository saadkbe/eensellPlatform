"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bot, Send, Plus, Target, Settings2, Zap, LayoutDashboard,
  Presentation, FileText, Image as ImageIcon, Table, Globe, Video, LayoutGrid,
  Download, Paperclip, X
} from "lucide-react";
import jsPDF from "jspdf";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const [usage, setUsage] = useState({ count: 0, limit: 10 });
  const [files, setFiles] = useState<FileList | null>(null);
  const [model, setModel] = useState("GPT-4o (Premium)");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/chat/usage")
      .then((res) => res.json())
      .then((data) => setUsage(data))
      .catch(console.error);
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Nexus Chat Export", 10, 10);
    doc.setFontSize(12);
    let y = 20;

    messages.forEach((m) => {
      const text = `${m.role === "user" ? "You" : "Nexus"}: ${m.content}`;
      const splitText = doc.splitTextToSize(text, 180);
      doc.text(splitText, 10, y);
      y += splitText.length * 7 + 5;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("nexus-chat.pdf");
  };

  const handleCustomSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (usage.count >= usage.limit) {
      alert("You have reached your monthly limit of 10 messages.");
      return;
    }
    handleSubmit(e, { experimental_attachments: files });
    setFiles(null);
  };

  const appendToInput = (text: string) => {
    handleInputChange({ target: { value: input + text } } as any);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto w-full font-sans bg-background">
      
      {/* Header Info */}
      <div className="flex items-center justify-between mb-8 px-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center relative shadow-sm border border-blue-200">
            <Bot className="w-6 h-6 text-blue-600" />
            <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              Hi, I'm Nexus
            </h2>
            <p className="text-xl sm:text-2xl font-bold text-foreground">
              Always here to help you get things done
            </p>
          </div>
        </div>
        
        <div className="text-sm font-medium bg-secondary/50 px-4 py-2 rounded-full border border-border flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>{usage.count} / {usage.limit} messages</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto mb-6 px-4 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
            <Bot className="w-16 h-16 mb-4 text-muted-foreground" />
            <p className="text-lg">How can I help you today?</p>
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${
              m.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[85%] px-5 py-4 rounded-2xl shadow-sm text-sm sm:text-base leading-relaxed ${
                m.role === "user"
                  ? "bg-foreground text-background rounded-br-sm"
                  : "bg-white border border-border rounded-bl-sm glass"
              }`}
            >
              {/* Very simple markdown formatting for bold/newlines */}
              {m.content.split('\n').map((line, i) => (
                <p key={i} className="mb-1">{line}</p>
              ))}
              {m.experimental_attachments?.map((attachment, idx) => (
                <div key={idx} className="mt-2">
                  {attachment.contentType?.startsWith('image/') ? (
                    <img src={attachment.url} alt="attachment" className="max-w-xs rounded-md shadow-sm" />
                  ) : (
                    <div className="flex items-center gap-2 text-xs bg-black/10 p-2 rounded-md">
                      <Paperclip className="w-3 h-3" /> File attached
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start">
             <div className="max-w-[85%] px-5 py-4 rounded-2xl bg-white border border-border shadow-sm rounded-bl-sm glass">
               <span className="flex gap-1">
                 <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" />
                 <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce delay-75" />
                 <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce delay-150" />
               </span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-4 pb-4">
        <form onSubmit={handleCustomSubmit} className="relative group">
          <div className="glass bg-white/70 backdrop-blur-xl border border-border/80 shadow-elevated rounded-3xl p-2 transition-all duration-300 focus-within:shadow-premium focus-within:border-brand/40 focus-within:bg-white flex flex-col">
            
            {files && files.length > 0 && (
              <div className="flex flex-wrap gap-2 px-4 pt-2 pb-1">
                {Array.from(files).map((file, i) => (
                  <div key={i} className="relative w-12 h-12 rounded-md overflow-hidden bg-secondary border border-border flex shrink-0 group">
                    {file.type.startsWith('image/') ? (
                      <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground bg-muted">
                        <FileText className="w-5 h-5 opacity-50" />
                      </div>
                    )}
                    <button 
                      type="button"
                      onClick={() => setFiles(null)} 
                      className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/50 hover:bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input 
              type="file" 
              ref={fileInputRef} 
              hidden 
              onChange={(e) => setFiles(e.target.files)} 
              multiple 
              accept="image/*,application/pdf,.doc,.docx,.txt"
            />
            
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Try tasks, workflows, or rescheduling tasks — type @ to add files or skills"
              className="w-full bg-transparent border-none focus:ring-0 resize-none min-h-[60px] max-h-[200px] p-4 text-foreground placeholder:text-muted-foreground/70 text-base"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim()) handleCustomSubmit(e as any);
                }
              }}
            />

            {/* Input Toolbar */}
            <div className="flex items-center justify-between px-2 pb-2">
              <div className="flex items-center gap-2">
                <Button type="button" onClick={() => fileInputRef.current?.click()} variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-secondary/50 hover:bg-secondary">
                  <Plus className="w-4 h-4" />
                </Button>
                <Button type="button" onClick={() => appendToInput("@ ")} variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-secondary/50 hover:bg-secondary">
                  <Target className="w-4 h-4" />
                </Button>
                <Button type="button" onClick={() => appendToInput("How do I connect external tools? ")} variant="ghost" className="h-8 rounded-full bg-secondary/50 hover:bg-secondary text-xs px-3 gap-1.5 font-medium">
                  <Settings2 className="w-3.5 h-3.5" /> Connect Tools
                </Button>
                <Button type="button" onClick={() => appendToInput("List your available skills. ")} variant="ghost" className="h-8 rounded-full bg-secondary/50 hover:bg-secondary text-xs px-3 gap-1.5 font-medium">
                  <Zap className="w-3.5 h-3.5" /> Skills
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground px-2 cursor-pointer hover:text-foreground transition-colors">
                      <LayoutDashboard className="w-3.5 h-3.5" /> {model}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-elevated border-border/50">
                    <DropdownMenuItem onClick={() => setModel("GPT-4o (Premium)")} className="cursor-pointer">
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">GPT-4o (Premium)</span>
                        <span className="text-xs text-muted-foreground">Fast, high intelligence</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <div className="flex flex-col opacity-50">
                        <span className="font-medium text-sm">Claude 3.5 Sonnet</span>
                        <span className="text-xs text-brand">(Upcoming)</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button 
                  type="submit" 
                  disabled={isLoading || !input.trim() || usage.count >= usage.limit}
                  className="w-10 h-10 rounded-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 shadow-md"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

          </div>
        </form>

        {/* Action Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <Button type="button" variant="outline" className="rounded-full bg-white glass-border text-sm gap-2 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200" onClick={() => appendToInput("Generate slides about: ")}>
            <Presentation className="w-4 h-4 text-rose-500" /> Slides
          </Button>
          <Button type="button" variant="outline" className="rounded-full bg-white glass-border text-sm gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200" onClick={exportPDF}>
            <Download className="w-4 h-4 text-blue-500" /> Export PDF
          </Button>
          <Button type="button" variant="outline" className="rounded-full bg-white glass-border text-sm gap-2 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200" onClick={() => appendToInput("Generate an image of: ")}>
            <ImageIcon className="w-4 h-4 text-amber-500" /> Images
          </Button>
          <Button type="button" variant="outline" className="rounded-full bg-white glass-border text-sm gap-2 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200" onClick={() => appendToInput("Create a spreadsheet/table for: ")}>
            <Table className="w-4 h-4 text-emerald-500" /> Sheets
          </Button>
          <Button type="button" variant="outline" className="rounded-full bg-white glass-border text-sm gap-2 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200" onClick={() => appendToInput("Write a landing page copy for: ")}>
            <Globe className="w-4 h-4 text-purple-500" /> Websites
          </Button>
          <Button type="button" variant="outline" className="rounded-full bg-white glass-border text-sm gap-2 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200" onClick={() => appendToInput("Write a highly engaging video script about: ")}>
            <Video className="w-4 h-4 text-pink-500" /> Videos
          </Button>
          <Button type="button" variant="outline" className="rounded-full bg-white glass-border text-sm gap-2 hover:bg-secondary" onClick={() => appendToInput("What are all the skills you can perform? ")}>
            <LayoutGrid className="w-4 h-4 text-teal-500" /> All Skills
          </Button>
        </div>
      </div>
      
    </div>
  );
}
