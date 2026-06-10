import { db } from "@/lib/db";
import { FileText, Download, ExternalLink, Lightbulb, File, Link2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Resources</h1>
        <p className="text-muted-foreground mt-1 text-sm">Access all your learning materials, templates, and tools.</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-card border border-border p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-foreground text-muted-foreground text-xs">All</TabsTrigger>
          <TabsTrigger value="pdf" className="data-[state=active]:bg-primary data-[state=active]:text-foreground text-muted-foreground text-xs">PDFs</TabsTrigger>
          <TabsTrigger value="template" className="data-[state=active]:bg-primary data-[state=active]:text-foreground text-muted-foreground text-xs">Templates</TabsTrigger>
          <TabsTrigger value="prompt" className="data-[state=active]:bg-primary data-[state=active]:text-foreground text-muted-foreground text-xs">Prompts</TabsTrigger>
          <TabsTrigger value="link" className="data-[state=active]:bg-primary data-[state=active]:text-foreground text-muted-foreground text-xs">Links</TabsTrigger>
          <TabsTrigger value="ai-tools" className="data-[state=active]:bg-primary data-[state=active]:text-foreground text-muted-foreground text-xs">Top 50 AI Tools</TabsTrigger>
        </TabsList>

        {Object.entries(grouped).map(([key, items]) => (
          <TabsContent key={key} value={key} className="mt-6">
            {items.length === 0 ? (
              <div className="text-center py-20">
                <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No resources found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((r) => <ResourceCard key={r.id} resource={r} />)}
              </div>
            )}
          </TabsContent>
        ))}

        <TabsContent value="ai-tools" className="mt-6">
          <AIToolsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
