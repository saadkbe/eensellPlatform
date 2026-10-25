import { FileText, Sparkles, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Documentation & SOPs | Eensell University",
  description: "Standard operating procedures, prompt libraries, and agency systems.",
};

export default function DocumentationPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 w-fit">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Knowledge Base & SOPs</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Documentation
        </h1>
        <p className="text-sm text-muted-foreground">
          Official agency templates, client onboarding checklists, and technical documentation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            title: "AI Automation SOPs",
            description: "Step-by-step procedures to build and maintain autonomous workflows for clients.",
            category: "Standard Procedures",
          },
          {
            title: "Client Acquisition Playbook",
            description: "Outreach scripts, proposal templates, and contract frameworks.",
            category: "Agency System",
          },
          {
            title: "Make & n8n Architecture Guide",
            description: "Best practices for webhooks, error handling, rate limiting, and database sync.",
            category: "Technical Specs",
          },
        ].map((item) => (
          <Card key={item.title} className="bg-card/60 border-border hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-5 flex flex-col h-full justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                  {item.category}
                </span>
                <h3 className="text-base font-semibold text-foreground mt-1 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> Coming soon
                </span>
                <span className="px-2 py-0.5 rounded bg-secondary text-[10px] font-medium">V2 Exclusive</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
