import { Wrench, Sparkles, Tag, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Deals & Tools | Eensell University",
  description: "Curated software deals, partner discounts, and recommended AI tools.",
};

export default function ToolsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20 w-fit">
          <Tag className="w-3.5 h-3.5" />
          <span>Exclusive Perks & Discounts</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Deals & Tools
        </h1>
        <p className="text-sm text-muted-foreground">
          Special partner discounts and our curated stack of high-ROI tools for AI freelancers and agencies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            name: "Make.com Partner Credits",
            badge: "Free Credits",
            description: "Get extended operational credits on Make.com for building client automations.",
            category: "Automation",
          },
          {
            name: "Claude & OpenAI Developer Stack",
            badge: "Recommended",
            description: "Direct API integration templates and cost-effective routing frameworks.",
            category: "AI Models",
          },
          {
            name: "Supabase & Neon Cloud Credits",
            badge: "Cloud Credits",
            description: "Serverless PostgreSQL instances optimized for high concurrency projects.",
            category: "Database",
          },
        ].map((tool) => (
          <Card key={tool.name} className="bg-card/60 border-border hover:border-amber-500/30 transition-all duration-300">
            <CardContent className="p-5 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/10 text-amber-500">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    {tool.badge}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {tool.category}
                </span>
                <h3 className="text-base font-semibold text-foreground mt-1 mb-2">
                  {tool.name}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {tool.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">V2 Member Benefit</span>
                <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 text-primary">
                  <span>Access Deal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
