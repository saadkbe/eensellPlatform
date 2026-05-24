"use client";

import { useState } from "react";
import {
  Compass,
  ChevronRight,
  CheckCircle2,
  Circle,
  TrendingUp,
  DollarSign,
  Award,
  MapPin,
  Zap,
  Sparkles,
  Bot,
  Megaphone,
  Clock,
  Globe,
  Heart,
  ArrowRight,
  Lock,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const PATHS = {
  automation: {
    name: "AI Automation Freelancer",
    emoji: "⚡",
    icon: Zap,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    tagline: "Build systems that work while you sleep",
    description:
      "Help businesses save 20+ hours/week with AI-powered workflows. From chatbots to CRM automations — you become the person who makes everything run on autopilot.",
    income: "$3K – $15K/mo",
    timeline: "3–6 months to first client",
    freedom: "Work from anywhere",
    steps: [
      {
        id: 1,
        title: "Your First Automation",
        status: "completed",
        desc: "Learn Make, Zapier, and n8n. Build your first workflow that actually saves time.",
        milestone: "You realize: 'I can automate anything.'",
      },
      {
        id: 2,
        title: "AI Integration Mastery",
        status: "completed",
        desc: "Connect ChatGPT, Claude, and custom AI to automations. Build intelligent workflows that think.",
        milestone: "Your automations start making decisions.",
      },
      {
        id: 3,
        title: "Your First Paying Client",
        status: "in-progress",
        desc: "Package your skills. Price your services. Land your first client through outreach or referrals.",
        milestone: "💰 Someone pays you for your brain.",
      },
      {
        id: 4,
        title: "Scale to $5K/Month",
        status: "locked",
        desc: "Systematize your delivery. Build templates. Create recurring revenue with retainer clients.",
        milestone: "You quit the idea of ever going back to 9-5.",
      },
      {
        id: 5,
        title: "Agency or Freedom",
        status: "locked",
        desc: "Choose your path: build a team and scale to $20K+/mo, or stay solo with $10K/mo and total freedom.",
        milestone: "You design your life on your terms.",
      },
    ],
  },
  generative: {
    name: "Generative AI Creator",
    emoji: "✨",
    icon: Sparkles,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    tagline: "Create what used to take teams of 10",
    description:
      "Master AI content creation — from viral videos to brand assets to full marketing campaigns. Become the one-person creative agency that outperforms entire teams.",
    income: "$4K – $20K/mo",
    timeline: "2–4 months to first client",
    freedom: "Create from anywhere",
    steps: [
      {
        id: 1,
        title: "Master the AI Stack",
        status: "completed",
        desc: "ChatGPT, Midjourney, Runway, ElevenLabs, Sora. Learn what each tool does best.",
        milestone: "You create in minutes what used to take days.",
      },
      {
        id: 2,
        title: "Build a Portfolio That Sells",
        status: "in-progress",
        desc: "Create 5 stunning projects. Build a portfolio site. Show the world what AI + your taste can produce.",
        milestone: "People start asking: 'How did you make this?'",
      },
      {
        id: 3,
        title: "Land Premium Clients",
        status: "locked",
        desc: "Position yourself as an AI creative director, not just a 'prompt engineer.' Charge $2K+ per project.",
        milestone: "💰 Your first $2K project feels surreal.",
      },
      {
        id: 4,
        title: "Productize Your Skills",
        status: "locked",
        desc: "Sell templates, presets, courses. Create digital products that generate income while you sleep.",
        milestone: "You wake up to money you didn't trade time for.",
      },
      {
        id: 5,
        title: "Build Your Brand",
        status: "locked",
        desc: "Become known in the space. Speaking, consulting, partnerships. Your name becomes the brand.",
        milestone: "Clients come to you. You never cold-outreach again.",
      },
    ],
  },
  ads: {
    name: "AI Ads Specialist",
    emoji: "📈",
    icon: Megaphone,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    tagline: "Turn ad spend into revenue machines",
    description:
      "Use AI to create, test, and optimize ad campaigns 10x faster than traditional agencies. Help businesses scale their revenue and take a cut of the growth.",
    income: "$5K – $25K/mo",
    timeline: "4–8 months to consistent income",
    freedom: "Performance-based income",
    steps: [
      {
        id: 1,
        title: "Ad Fundamentals + AI Tools",
        status: "completed",
        desc: "Master Meta Ads, Google Ads, and TikTok Ads. Learn AI tools for creative generation and copy.",
        milestone: "You understand how attention becomes revenue.",
      },
      {
        id: 2,
        title: "AI-Powered Creative Production",
        status: "completed",
        desc: "Generate 50 ad variations in the time it takes others to make 3. AI video, AI copy, AI targeting.",
        milestone: "Your creative volume gives you an unfair advantage.",
      },
      {
        id: 3,
        title: "Get Results for Real Businesses",
        status: "in-progress",
        desc: "Run campaigns for 2-3 businesses (even for free at first). Build case studies with real ROAS numbers.",
        milestone: "💰 Your first client says: 'This actually works.'",
      },
      {
        id: 4,
        title: "Charge Based on Results",
        status: "locked",
        desc: "Move from flat-fee to performance-based pricing. Take a % of revenue you generate. Align incentives.",
        milestone: "Your income scales with your client's success.",
      },
      {
        id: 5,
        title: "Build Your AI Ads Agency",
        status: "locked",
        desc: "Hire media buyers. Build SOPs. Use AI to run 20+ accounts with a small team. Scale to $50K+/mo.",
        milestone: "You realize you've built something bigger than a job.",
      },
    ],
  },
};

type PathKey = keyof typeof PATHS;

export default function CareerPage() {
  const [activePath, setActivePath] = useState<PathKey>("automation");
  const currentPath = PATHS[activePath];
  const Icon = currentPath.icon;

  const completedSteps = currentPath.steps.filter((s) => s.status === "completed").length;
  const progressPercent = Math.round((completedSteps / currentPath.steps.length) * 100);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* ── Emotional Hero ── */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-primary/5 p-7 sm:p-9">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--primary)/0.08),transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-4 text-xs">
            <Compass className="w-3 h-3 mr-1" />
            Career Roadmaps
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3 leading-tight">
            You're not looking for a job. <br />
            <span className="text-primary">You're building a life.</span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
            These aren't career ladders — they're escape routes. Each path is designed to take you from
            where you are now to financial freedom with AI skills the market desperately needs.
          </p>
        </div>
      </div>

      {/* ── Path Selector Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(Object.entries(PATHS) as [PathKey, typeof PATHS.automation][]).map(([key, path]) => {
          const PathIcon = path.icon;
          const isActive = activePath === key;

          return (
            <button
              key={key}
              onClick={() => setActivePath(key)}
              className={cn(
                "text-left p-5 rounded-xl border transition-all duration-300 group",
                isActive
                  ? `${path.bgColor} ${path.borderColor} shadow-md`
                  : "bg-card/50 border-border hover:border-primary/20 hover:shadow-sm"
              )}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-110",
                    path.bgColor,
                    path.borderColor
                  )}
                >
                  <PathIcon className={cn("w-5 h-5", path.color)} />
                </div>
                <span className="text-lg">{path.emoji}</span>
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">{path.name}</h3>
              <p className="text-[11px] text-muted-foreground leading-snug">{path.tagline}</p>
              {isActive && (
                <div className="mt-3 flex items-center gap-1 text-[10px] font-semibold text-primary">
                  <span>Currently viewing</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Main Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roadmap (2 cols) */}
        <div className="lg:col-span-2">
          <Card className="bg-card/50 border-border shadow-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Icon className={cn("w-5 h-5", currentPath.color)} />
                    {currentPath.name}
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs max-w-md">
                    {currentPath.description}
                  </CardDescription>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                    Progress
                  </span>
                  <p className="text-lg font-bold text-primary">{progressPercent}%</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative pl-7 sm:pl-9 border-l-2 border-muted space-y-8 py-2">
                {currentPath.steps.map((step, idx) => {
                  let icon, borderCol, textCol, cardBg;

                  if (step.status === "completed") {
                    icon = <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
                    borderCol = "border-emerald-500/20";
                    textCol = "text-emerald-500";
                    cardBg = "bg-card hover:shadow-md";
                  } else if (step.status === "in-progress") {
                    icon = (
                      <div className="w-5 h-5 rounded-full border-[3px] border-primary bg-background shadow-[0_0_10px_hsl(var(--primary)/0.4)] animate-pulse" />
                    );
                    borderCol = "border-primary/30";
                    textCol = "text-primary";
                    cardBg = "bg-card hover:shadow-md";
                  } else {
                    icon = <Lock className="w-4 h-4 text-muted-foreground/50" />;
                    borderCol = "border-border";
                    textCol = "text-muted-foreground";
                    cardBg = "bg-muted/20 opacity-60";
                  }

                  return (
                    <div key={step.id} className="relative group">
                      {/* Timeline node */}
                      <div className="absolute -left-[33px] sm:-left-[41px] top-4 flex items-center justify-center bg-background rounded-full p-0.5">
                        {icon}
                      </div>

                      {/* Content */}
                      <div
                        className={cn(
                          "p-5 rounded-xl border transition-all duration-300",
                          borderCol,
                          cardBg
                        )}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3
                            className={cn(
                              "font-semibold text-sm",
                              step.status === "locked" ? "text-muted-foreground" : "text-foreground"
                            )}
                          >
                            <span className="text-muted-foreground/60 mr-1.5">
                              {String(idx + 1).padStart(2, "0")}.
                            </span>
                            {step.title}
                          </h3>
                          {step.status === "completed" && (
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] shrink-0">
                              Done
                            </Badge>
                          )}
                          {step.status === "in-progress" && (
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] shrink-0">
                              You are here
                            </Badge>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                          {step.desc}
                        </p>

                        {/* Emotional milestone */}
                        {step.status !== "locked" && (
                          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                            <Heart className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                            <p className="text-[11px] text-foreground/80 italic leading-snug">
                              {step.milestone}
                            </p>
                          </div>
                        )}

                        {step.status === "in-progress" && (
                          <Link href="/dashboard/modules">
                            <Button
                              size="sm"
                              className="mt-4 gap-2 text-xs h-8 shadow-md shadow-primary/15"
                            >
                              Continue Learning <ArrowRight className="w-3 h-3" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar (1 col) */}
        <div className="space-y-5">
          {/* Income Projection */}
          <Card className="bg-card/50 border-border shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                Income Potential
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              <div>
                <p className="text-3xl font-bold text-foreground">{currentPath.income}</p>
                <p className="text-[10px] text-emerald-500 font-medium mt-1">
                  Freelance monthly income range
                </p>
              </div>

              <div className="h-px bg-border" />

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{currentPath.timeline}</p>
                    <p className="text-[10px] text-muted-foreground">Time to income</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Globe className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{currentPath.freedom}</p>
                    <p className="text-[10px] text-muted-foreground">Location independence</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">Extremely High Demand</p>
                    <p className="text-[10px] text-muted-foreground">Market demand for AI skills</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Freedom Milestones */}
          <Card className="bg-gradient-to-br from-primary/8 to-card border-primary/15 shadow-sm overflow-hidden relative">
            <div className="absolute right-0 top-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
            <CardContent className="p-5 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center mb-4 border border-primary/20 text-primary">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-3">Freedom Milestones</h3>
              <div className="space-y-3">
                {[
                  { label: "First $1K month", icon: "🎯", done: true },
                  { label: "Replace your salary", icon: "🔥", done: false },
                  { label: "First $10K month", icon: "💎", done: false },
                  { label: "Work from anywhere", icon: "🌍", done: false },
                  { label: "Financial freedom", icon: "👑", done: false },
                ].map((milestone, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 border",
                        milestone.done
                          ? "bg-emerald-500/15 border-emerald-500/30"
                          : "bg-muted/50 border-border"
                      )}
                    >
                      {milestone.done ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <span>{milestone.icon}</span>
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        milestone.done
                          ? "text-muted-foreground line-through"
                          : "text-foreground"
                      )}
                    >
                      {milestone.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Certification */}
          <Card className="bg-card/50 border-border shadow-sm">
            <CardContent className="p-5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3 border border-amber-500/20 text-amber-500">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">Eensell Certified</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                Complete this roadmap to earn your{" "}
                <span className="font-semibold text-foreground">{currentPath.name}</span>{" "}
                certification — proof that you can deliver results.
              </p>
              <div className="w-full bg-muted h-1.5 rounded-full">
                <div
                  className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">
                {progressPercent}% complete
              </p>
            </CardContent>
          </Card>

          {/* Emotional Quote */}
          <div className="p-5 rounded-xl bg-muted/30 border border-border">
            <p className="text-xs text-foreground/80 italic leading-relaxed">
              "The best time to start was yesterday. The second best time is right now. Every expert
              was once a beginner who refused to quit."
            </p>
            <p className="text-[10px] text-muted-foreground mt-2 font-medium">— Eensell Team</p>
          </div>
        </div>
      </div>
    </div>
  );
}
