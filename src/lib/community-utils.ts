export interface PostMetadata {
  category: "DISCUSSION" | "WIN" | "HIRE" | "ANNOUNCEMENT" | "QUESTION";
  imageUrl?: string;
  linkUrl?: string;
  linkTitle?: string;
  winRevenue?: string;
  hireType?: "OFFERING" | "LOOKING";
  hireRole?: string;
  hireRate?: string;
  hireContact?: string;
  hireSkills?: string[];
}

export function serializePostContent(content: string, meta?: PostMetadata): string {
  if (!meta) return content;
  return `<!--EENSELL_POST_META:${JSON.stringify(meta)}-->\n${content}`;
}

export function parsePostContent(rawContent: string): { content: string; meta: PostMetadata } {
  const match = rawContent.match(/<!--EENSELL_POST_META:(.*?)-->/);
  if (match) {
    try {
      const meta = JSON.parse(match[1]) as PostMetadata;
      const cleanContent = rawContent.replace(/<!--EENSELL_POST_META:(.*?)-->\n?/, "");
      return { content: cleanContent, meta };
    } catch {
      // fallback
    }
  }

  if (
    rawContent.includes("60-Day AI Automation Agency Sprint") ||
    rawContent.includes("Deliverables Completed") ||
    rawContent.includes("Milestone Win")
  ) {
    return {
      content: rawContent,
      meta: { category: "WIN" },
    };
  }

  return {
    content: rawContent,
    meta: { category: "ANNOUNCEMENT" },
  };
}
