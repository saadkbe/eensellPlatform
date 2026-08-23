// ═══════════════════════════════════════════════════════════
// Eensell University — 9-Course Virtual Grouping Layer
// ═══════════════════════════════════════════════════════════
//
// This file maps the existing 20 database modules into 9
// logical "courses" for the AI Library view. No modules are
// deleted or merged — this is a UI-level grouping only.
//
// Each course references modules by their `order` field in
// the database. At runtime, we resolve these to actual
// module records with their lessons and progress.

export type CourseCategory = {
  id: string;
  code: string;      // "M1" – "M9"
  title: string;
  description: string;
  icon: string;       // lucide icon name
  color: string;      // accent color class
  moduleOrders: number[];  // which Module.order values belong here
};

export const COURSE_CATEGORIES: CourseCategory[] = [
  {
    id: "course-1",
    code: "M1",
    title: "AI Foundations & Mindset",
    description: "Master the AI opportunity landscape, develop an entrepreneurial mindset, and understand the tools that power modern automation.",
    icon: "Brain",
    color: "from-violet-500 to-purple-600",
    moduleOrders: [0], // AI Foundations & Opportunity Mindset
  },
  {
    id: "course-2",
    code: "M2",
    title: "AI Tools & Prompt Engineering",
    description: "Deep-dive into the most powerful AI tools and master advanced prompting frameworks.",
    icon: "Wand2",
    color: "from-blue-500 to-cyan-500",
    moduleOrders: [1, 17], // AI Tools Mastery + AI Prompt Engineering Mastery
  },
  {
    id: "course-3",
    code: "M3",
    title: "AI Content & Video Creation",
    description: "Build high-velocity content systems — from viral short-form to cinematic AI video production.",
    icon: "Video",
    color: "from-pink-500 to-rose-500",
    moduleOrders: [4, 5, 6, 13], // Content Creation + Viral Short-Form + Ads Video + Video Editing
  },
  {
    id: "course-4",
    code: "M4",
    title: "AI Automation & Workflows",
    description: "Build powerful automations with Make.com, AI chatbots, WhatsApp bots, and intelligent AI agents.",
    icon: "Zap",
    color: "from-amber-500 to-orange-500",
    moduleOrders: [2, 7], // AI Automation & Workflows + AI Chatbots & AI Agents
  },
  {
    id: "course-5",
    code: "M5",
    title: "AI Content & Marketing Systems",
    description: "Master AI-powered copywriting, direct-response marketing, and personal brand building.",
    icon: "Megaphone",
    color: "from-emerald-500 to-teal-500",
    moduleOrders: [16, 10], // AI Marketing & Copywriting + Personal Branding
  },
  {
    id: "course-6",
    code: "M6",
    title: "Building an AI Business",
    description: "Set up your AI business from scratch — legal, pricing, structure, and scalable product ideas.",
    icon: "Building2",
    color: "from-indigo-500 to-blue-600",
    moduleOrders: [8, 12], // Building AI Business + AI SaaS & Startup Ideas
  },
  {
    id: "course-7",
    code: "M7",
    title: "AI Client Acquisition & Outreach",
    description: "Learn cold outreach, lead scraping, freelancing strategies, and close your first paying client.",
    icon: "Users",
    color: "from-sky-500 to-blue-500",
    moduleOrders: [9, 11], // Client Acquisition + Freelancing
  },
  {
    id: "course-8",
    code: "M8",
    title: "AI Monetization & E-Commerce",
    description: "Discover fast-cash AI services, build online stores, create digital products, and launch landing pages.",
    icon: "DollarSign",
    color: "from-green-500 to-emerald-600",
    moduleOrders: [15, 18, 3], // Money-Making + E-commerce + Website & Landing Pages
  },
  {
    id: "course-9",
    code: "M9",
    title: "AI Productivity & Future Trends",
    description: "Optimize your life with AI productivity systems and stay ahead with emerging AI trends.",
    icon: "Rocket",
    color: "from-fuchsia-500 to-purple-500",
    moduleOrders: [14, 19], // Productivity & Life Systems + Future AI Trends
  },
];

// Helper: Get the course category for a given module order
export function getCourseForModuleOrder(order: number): CourseCategory | undefined {
  return COURSE_CATEGORIES.find(c => c.moduleOrders.includes(order));
}

// Helper: Get the course category by code (e.g., "M1")
export function getCourseByCode(code: string): CourseCategory | undefined {
  return COURSE_CATEGORIES.find(c => c.code === code);
}
