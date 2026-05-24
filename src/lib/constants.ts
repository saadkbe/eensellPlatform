// ===========================
// Eensell University — App Constants
// ===========================

export const APP_NAME = "Eensell University";
export const APP_DESCRIPTION = "Premium AI-powered education platform for mastering modern skills.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Navigation items for user dashboard
export const DASHBOARD_NAV = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Modules",
    href: "/dashboard/modules",
    icon: "BookOpen",
  },
  {
    title: "Resources",
    href: "/dashboard/resources",
    icon: "FolderOpen",
  },
  {
    title: "Live Calls",
    href: "/dashboard/live-calls",
    icon: "Video",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: "Settings",
  },
] as const;

// Navigation items for admin panel
export const ADMIN_NAV = [
  {
    title: "Overview",
    href: "/admin",
    icon: "BarChart3",
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: "Users",
  },
  {
    title: "Pending",
    href: "/admin/pending",
    icon: "Clock",
  },
  {
    title: "Courses",
    href: "/admin/courses",
    icon: "GraduationCap",
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: "TrendingUp",
  },
  {
    title: "Emails",
    href: "/admin/emails",
    icon: "Mail",
  },
] as const;

// Resource types
export const RESOURCE_TYPES = [
  { value: "pdf", label: "PDF Document" },
  { value: "template", label: "Template" },
  { value: "prompt", label: "AI Prompt" },
  { value: "link", label: "External Link" },
] as const;

// User status labels
export const STATUS_LABELS = {
  PENDING: { label: "Pending", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  ACTIVE: { label: "Active", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  SUSPENDED: { label: "Suspended", color: "bg-red-500/10 text-red-400 border-red-500/20" },
  REJECTED: { label: "Rejected", color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
} as const;

// Role labels  
export const ROLE_LABELS = {
  ADMIN: { label: "Admin", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  ACTIVE_USER: { label: "User", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  PENDING_USER: { label: "Pending", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
} as const;
