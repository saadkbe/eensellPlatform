"use client";

import { useState } from "react";
import { aiTools } from "@/data/ai-tools";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = ["All", ...Array.from(new Set(aiTools.map((t) => t.category)))];

export function AIToolsList() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTools =
    activeCategory === "All"
      ? aiTools
      : aiTools.filter((t) => t.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <Badge
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            className="cursor-pointer px-4 py-1.5 text-sm transition-all hover:scale-105"
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTools.map((tool) => (
          <Card key={tool.name} className="bg-card/50 border-border hover:border-brand/40 transition-all duration-300 group hover:shadow-premium flex flex-col justify-between h-full overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand to-brand-light opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <CardContent className="p-6 flex flex-col h-full z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center p-2 shrink-0 shadow-sm border border-border">
                  <img
                    src={`https://logo.clearbit.com/${tool.domain}`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://www.google.com/s2/favicons?domain=${tool.domain}&sz=128`;
                    }}
                    alt={tool.name}
                    className="w-full h-full object-contain rounded-xl"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg group-hover:text-brand transition-colors">{tool.name}</h3>
                  <p className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-md inline-block mt-1">{tool.category}</p>
                </div>
              </div>
              <p className="text-sm text-foreground/70 leading-relaxed mb-6 flex-1">
                {tool.description}
              </p>
              
              <a href={tool.url} target="_blank" rel="noopener noreferrer" className="block mt-auto w-full">
                <Button variant="outline" className="w-full flex items-center justify-between group-hover:bg-brand group-hover:text-white group-hover:border-brand transition-all">
                  <span>Visit Tool</span>
                  <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                </Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
