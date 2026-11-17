import { db } from "@/lib/db";
import { 
  FileText, Download, ExternalLink, Lightbulb, File, Link2, 
  MessageSquare, Sparkles, Workflow, Calendar, FileSpreadsheet, 
  Bot, CheckCircle2, ArrowRight, Zap, Info
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIToolsList } from "@/components/dashboard/AIToolsList";

const typeIcons: Record<string, React.ElementType> = {
  pdf: FileText, template: File, prompt: Lightbulb, link: Link2,
};

const typeColors: Record<string, string> = {
  pdf: "#EF4444", template: "#8B5CF6", prompt: "#F59E0B", link: "#3B82F6",
};

export default async function ResourcesPage() {
  const resources = await db.resource.findMany({ orderBy: { createdAt: "desc" } });

  const grouped = {
    all: resources,
    pdf: resources.filter((r) => r.type === "pdf"),
    template: resources.filter((r) => r.type === "template"),
    prompt: resources.filter((r) => r.type === "prompt"),
    link: resources.filter((r) => r.type === "link"),
  };

  const ResourceCard = ({ resource }: { resource: typeof resources[0] }) => {
    const Icon = typeIcons[resource.type] || FileText;
    const color = typeColors[resource.type] || "#3B82F6";
    return (
      <a href={resource.fileUrl || "#"} target="_blank" rel="noopener noreferrer"
        className="block group">
        <Card className="bg-card/60 border-border hover:border-primary/20 transition-all duration-300 h-full hover:shadow-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              {resource.fileUrl && (
                resource.type === "link"
                  ? <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  : <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              )}
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1 group-hover:text-primary/80 transition-colors">{resource.title}</h3>
            {resource.description && <p className="text-xs text-muted-foreground line-clamp-2">{resource.description}</p>}
            <Badge className="mt-3 text-[10px] bg-secondary text-muted-foreground border-primary/20">{resource.type.toUpperCase()}</Badge>
          </CardContent>
        </Card>
      </a>
    );
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Resources & Blueprints</h1>
        <p className="text-muted-foreground mt-1 text-sm">Access your production automation blueprints, templates, prompts, and tools.</p>
      </div>

      {/* ── FLAGSHIP FEATURED BLUEPRINT: WHATSAPP AI APPOINTMENT SETTER ── */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500/40 shadow-xl shadow-emerald-950/5 p-6 sm:p-8">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-40 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-start justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Featured Automation Blueprint
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                Make.com Ready (.JSON)
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                OpenAI + Google Suite
              </span>
            </div>

            {/* Big Headline */}
            <div className="flex items-start gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-300 dark:border-emerald-500/40 shadow-sm">
                <MessageSquare className="w-7 h-7 text-emerald-700 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
                  WhatsApp AI Appointment Setter & Booking Blueprint
                </h2>
                <p className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                  Eensell V2 • Autonomous WhatsApp Setter (Calendar + Sheets Sync)
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              The exact production-tested Make.com scenario blueprint used to autonomously handle incoming WhatsApp prospect messages, qualify leads using an AI prompt engine, maintain conversation history in DataStore memory, automatically book confirmed meetings into <strong className="text-slate-950 dark:text-white font-bold">Google Calendar</strong>, and log deal records into <strong className="text-slate-950 dark:text-white font-bold">Google Sheets</strong>.
            </p>

            {/* Visual Workflow Steps Strip */}
            <div className="pt-2">
              <p className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Workflow className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Automation Pipeline Flow:
              </p>
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
                <span className="px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 text-emerald-900 dark:text-emerald-200 shadow-2xs">
                  1. WhatsApp Webhook
                </span>
                <span className="text-slate-400 dark:text-slate-500 font-black">&rarr;</span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 shadow-2xs">
                  2. DataStore Memory
                </span>
                <span className="text-slate-400 dark:text-slate-500 font-black">&rarr;</span>
                <span className="px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-700/60 text-purple-900 dark:text-purple-200 shadow-2xs">
                  3. OpenAI GPT Qualification
                </span>
                <span className="text-slate-400 dark:text-slate-500 font-black">&rarr;</span>
                <span className="px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 text-emerald-900 dark:text-emerald-200 shadow-2xs">
                  4. WhatsApp Reply
                </span>
                <span className="text-slate-400 dark:text-slate-500 font-black">&rarr;</span>
                <span className="px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-700/60 text-blue-900 dark:text-blue-200 shadow-2xs">
                  5. Google Calendar Booking
                </span>
                <span className="text-slate-400 dark:text-slate-500 font-black">&rarr;</span>
                <span className="px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-950/60 border border-green-300 dark:border-green-700/60 text-green-900 dark:text-green-200 shadow-2xs">
                  6. Google Sheets CRM Row
                </span>
              </div>
            </div>

            {/* Quick 3-Step Import Guide */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs flex items-start gap-3">
              <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-950 dark:text-white font-extrabold block mb-1">How to import into Make.com:</strong>
                <ol className="list-decimal list-inside space-y-1 text-slate-800 dark:text-slate-300 font-medium">
                  <li>Download the <code className="text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded font-mono font-bold text-[11px] border border-emerald-300 dark:border-emerald-800/40">.json</code> file on the right.</li>
                  <li>In Make.com, create a new scenario, click the <strong className="text-slate-950 dark:text-white font-bold">three dots (...)</strong> in the bottom toolbar, and choose <strong className="text-slate-950 dark:text-white font-bold">"Import Blueprint"</strong>.</li>
                  <li>Connect your WhatsApp Cloud API webhook, OpenAI key, Google Calendar, and Sheets to go live!</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Action Box */}
          <div className="shrink-0 flex flex-col sm:flex-row xl:flex-col gap-3 justify-center pt-2 xl:pt-0 w-full xl:w-64">
            <a
              href="/blueprints/eensell-v2-whatsapp-ai-appointment-setter.json"
              download="eensell-v2-whatsapp-ai-appointment-setter.json"
              className="block w-full"
            >
              <Button
                size="lg"
                className="w-full h-13 text-sm font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/30 gap-2 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <Download className="w-4 h-4" />
                <span>Download Blueprint (.JSON)</span>
              </Button>
            </a>

            <div className="text-center">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">
                File size: ~4.5 KB • Make.com V1
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-card border border-border p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-foreground text-muted-foreground text-xs">All Materials</TabsTrigger>
          <TabsTrigger value="template" className="data-[state=active]:bg-primary data-[state=active]:text-foreground text-muted-foreground text-xs">Blueprints & Templates</TabsTrigger>
          <TabsTrigger value="pdf" className="data-[state=active]:bg-primary data-[state=active]:text-foreground text-muted-foreground text-xs">PDFs</TabsTrigger>
          <TabsTrigger value="prompt" className="data-[state=active]:bg-primary data-[state=active]:text-foreground text-muted-foreground text-xs">Prompts</TabsTrigger>
          <TabsTrigger value="link" className="data-[state=active]:bg-primary data-[state=active]:text-foreground text-muted-foreground text-xs">Links</TabsTrigger>
          <TabsTrigger value="ai-tools" className="data-[state=active]:bg-primary data-[state=active]:text-foreground text-muted-foreground text-xs">Top 50 AI Tools</TabsTrigger>
        </TabsList>

        {/* All Tab */}
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Inject Blueprint as Top Card */}
            <a
              href="/blueprints/eensell-v2-whatsapp-ai-appointment-setter.json"
              download="eensell-v2-whatsapp-ai-appointment-setter.json"
              className="block group"
            >
              <Card className="bg-gradient-to-br from-emerald-500/10 to-card border-2 border-emerald-500/40 hover:border-emerald-500/70 transition-all duration-300 h-full hover:shadow-lg hover:shadow-emerald-500/10">
                <CardContent className="p-5 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                        <MessageSquare className="w-5 h-5 text-emerald-400" />
                      </div>
                      <Download className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground mb-1 group-hover:text-emerald-400 transition-colors">
                      WhatsApp AI Appointment Setter (Calendar + Sheets)
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      Ready-to-import Make.com scenario blueprint connecting WhatsApp Cloud API, OpenAI GPT, Google Calendar, and Sheets.
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                    <Badge className="text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-bold">MAKE BLUEPRINT</Badge>
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Download .JSON &rarr;
                    </span>
                  </div>
                </CardContent>
              </Card>
            </a>

            {resources.map((r) => <ResourceCard key={r.id} resource={r} />)}
          </div>
        </TabsContent>

        {/* Template Tab */}
        <TabsContent value="template" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="/blueprints/eensell-v2-whatsapp-ai-appointment-setter.json"
              download="eensell-v2-whatsapp-ai-appointment-setter.json"
              className="block group"
            >
              <Card className="bg-gradient-to-br from-emerald-500/10 to-card border-2 border-emerald-500/40 hover:border-emerald-500/70 transition-all duration-300 h-full hover:shadow-lg hover:shadow-emerald-500/10">
                <CardContent className="p-5 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                        <MessageSquare className="w-5 h-5 text-emerald-400" />
                      </div>
                      <Download className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground mb-1 group-hover:text-emerald-400 transition-colors">
                      WhatsApp AI Appointment Setter (Calendar + Sheets)
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      Ready-to-import Make.com scenario blueprint connecting WhatsApp Cloud API, OpenAI GPT, Google Calendar, and Sheets.
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                    <Badge className="text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-bold">MAKE BLUEPRINT</Badge>
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Download .JSON &rarr;
                    </span>
                  </div>
                </CardContent>
              </Card>
            </a>

            {grouped.template.map((r) => <ResourceCard key={r.id} resource={r} />)}
          </div>
        </TabsContent>

        {/* PDF Tab */}
        <TabsContent value="pdf" className="mt-6">
          {grouped.pdf.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No PDF guides uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {grouped.pdf.map((r) => <ResourceCard key={r.id} resource={r} />)}
            </div>
          )}
        </TabsContent>

        {/* Prompt Tab */}
        <TabsContent value="prompt" className="mt-6">
          {grouped.prompt.length === 0 ? (
            <div className="text-center py-20">
              <Lightbulb className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No prompts uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {grouped.prompt.map((r) => <ResourceCard key={r.id} resource={r} />)}
            </div>
          )}
        </TabsContent>

        {/* Link Tab */}
        <TabsContent value="link" className="mt-6">
          {grouped.link.length === 0 ? (
            <div className="text-center py-20">
              <Link2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No external links added yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {grouped.link.map((r) => <ResourceCard key={r.id} resource={r} />)}
            </div>
          )}
        </TabsContent>

        {/* Top 50 AI Tools */}
        <TabsContent value="ai-tools" className="mt-6">
          <AIToolsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
