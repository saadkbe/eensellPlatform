"use client";

import { useState, useTransition, useRef, useMemo } from "react";
import {
  createPost,
  togglePinPost,
  deletePost,
  toggleReaction,
  addComment,
  deleteComment,
} from "@/actions/community.actions";
import { parsePostContent, type PostMetadata } from "@/lib/community-utils";
import { toast } from "sonner";
import {
  Bookmark,
  ShieldCheck,
  Pin,
  MoreHorizontal,
  Trash2,
  Loader2,
  PenLine,
  MessageSquare,
  Send,
  ChevronDown,
  ChevronUp,
  Flame,
  Heart,
  Lightbulb,
  Rocket,
  Trophy,
  Briefcase,
  DollarSign,
  Image as ImageIcon,
  Link2,
  ExternalLink,
  Plus,
  Check,
  Copy,
  Search,
  Filter,
  CheckCircle2,
  X,
  Sparkles,
  Phone,
  ArrowUpRight,
  UserCheck,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RichTextEditor, RichTextRenderer } from "@/components/ui/rich-text-editor";
import { motion, AnimatePresence } from "framer-motion";

type Author = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  role: string;
};

type Reaction = {
  id: string;
  emoji: string;
  userId: string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
  };
};

type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
    role: string;
  };
};

export type Post = {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author: Author;
  reactions: Reaction[];
  comments: Comment[];
  _count: {
    reactions: number;
    comments: number;
  };
};

const REACTION_EMOJIS = [
  { emoji: "🔥", label: "Fire" },
  { emoji: "🚀", label: "Rocket" },
  { emoji: "💰", label: "Money" },
  { emoji: "👏", label: "Clap" },
  { emoji: "💡", label: "Insight" },
  { emoji: "❤️", label: "Love" },
];

export function CommunityClient({
  initialPosts,
  isAdmin,
  currentUserId,
}: {
  initialPosts: Post[];
  isAdmin: boolean;
  currentUserId: string;
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [savedPosts, setSavedPosts] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("eensell_saved_posts");
        return saved ? new Set(JSON.parse(saved)) : new Set();
      } catch {
        return new Set();
      }
    }
    return new Set();
  });

  const [activeTab, setActiveTab] = useState<"feed" | "wins" | "hire" | "announcements" | "saved">("feed");
  const [hireSubFilter, setHireSubFilter] = useState<"all" | "offering" | "looking">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);

  // Form state for creating a post
  const [postCategory, setPostCategory] = useState<"DISCUSSION" | "WIN" | "HIRE" | "ANNOUNCEMENT">("DISCUSSION");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postImageUrl, setPostImageUrl] = useState("");
  const [postLinkUrl, setPostLinkUrl] = useState("");
  const [postLinkTitle, setPostLinkTitle] = useState("");
  
  // Specific Win fields
  const [winRevenue, setWinRevenue] = useState("");

  // Specific Hire fields
  const [hireType, setHireType] = useState<"OFFERING" | "LOOKING">("OFFERING");
  const [hireRole, setHireRole] = useState("");
  const [hireRate, setHireRate] = useState("");
  const [hireContact, setHireContact] = useState("");
  const [hireSkillsInput, setHireSkillsInput] = useState("");

  const toggleSave = (postId: string) => {
    const newSaved = new Set(savedPosts);
    if (newSaved.has(postId)) {
      newSaved.delete(postId);
    } else {
      newSaved.add(postId);
    }
    setSavedPosts(newSaved);
    try {
      localStorage.setItem("eensell_saved_posts", JSON.stringify([...newSaved]));
    } catch {}
  };

  const resetForm = () => {
    setPostCategory("DISCUSSION");
    setPostTitle("");
    setPostContent("");
    setPostImageUrl("");
    setPostLinkUrl("");
    setPostLinkTitle("");
    setWinRevenue("");
    setHireType("OFFERING");
    setHireRole("");
    setHireRate("");
    setHireContact("");
    setHireSkillsInput("");
  };

  const handleCreatePost = () => {
    if (!postTitle.trim() || !postContent.trim()) {
      toast.error("Please enter a title and description");
      return;
    }

    const hireSkills = hireSkillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const metadata: PostMetadata = {
      category: postCategory,
      imageUrl: postImageUrl.trim() || undefined,
      linkUrl: postLinkUrl.trim() || undefined,
      linkTitle: postLinkTitle.trim() || undefined,
      winRevenue: postCategory === "WIN" ? winRevenue.trim() || undefined : undefined,
      hireType: postCategory === "HIRE" ? hireType : undefined,
      hireRole: postCategory === "HIRE" ? hireRole.trim() || undefined : undefined,
      hireRate: postCategory === "HIRE" ? hireRate.trim() || undefined : undefined,
      hireContact: postCategory === "HIRE" ? hireContact.trim() || undefined : undefined,
      hireSkills: postCategory === "HIRE" && hireSkills.length > 0 ? hireSkills : undefined,
    };

    startTransition(async () => {
      try {
        const post = await createPost(postTitle, postContent, metadata);
        setPosts((prev) => [post, ...prev]);
        resetForm();
        setDialogOpen(false);
        toast.success(
          postCategory === "WIN"
            ? "🏆 Win shared! Congratulations!"
            : postCategory === "HIRE"
            ? "💼 Service published in the Hire marketplace!"
            : "Post published to community!"
        );
      } catch (err: any) {
        toast.error(err?.message || "Failed to create post");
      }
    });
  };

  const handleTogglePin = (postId: string) => {
    setPosts((prev) =>
      prev
        .map((p) => (p.id === postId ? { ...p, isPinned: !p.isPinned } : p))
        .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
    );

    startTransition(async () => {
      try {
        await togglePinPost(postId);
        toast.success("Pin status updated");
      } catch {
        toast.error("Failed to update pin");
      }
    });
  };

  const handleDelete = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));

    startTransition(async () => {
      try {
        await deletePost(postId);
        toast.success("Post deleted");
      } catch {
        toast.error("Failed to delete post");
      }
    });
  };

  const handleReaction = (postId: string, emoji: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const hasReacted = p.reactions.some(
          (r) => r.userId === currentUserId && r.emoji === emoji
        );
        if (hasReacted) {
          return {
            ...p,
            reactions: p.reactions.filter(
              (r) => !(r.userId === currentUserId && r.emoji === emoji)
            ),
            _count: { ...p._count, reactions: p._count.reactions - 1 },
          };
        } else {
          return {
            ...p,
            reactions: [
              ...p.reactions,
              {
                id: `temp-${Date.now()}`,
                emoji,
                userId: currentUserId,
                user: { id: currentUserId, firstName: null, lastName: null },
              },
            ],
            _count: { ...p._count, reactions: p._count.reactions + 1 },
          };
        }
      })
    );

    startTransition(async () => {
      try {
        await toggleReaction(postId, emoji);
      } catch {
        toast.error("Failed to update reaction");
      }
    });
  };

  const handleAddComment = (postId: string, content: string) => {
    if (!content.trim()) return;

    startTransition(async () => {
      try {
        const comment = await addComment(postId, content);
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  comments: [...p.comments, comment],
                  _count: { ...p._count, comments: p._count.comments + 1 },
                }
              : p
          )
        );
        toast.success("Comment added!");
      } catch {
        toast.error("Failed to add comment");
      }
    });
  };

  const handleDeleteComment = (commentId: string, postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: p.comments.filter((c) => c.id !== commentId),
              _count: { ...p._count, comments: p._count.comments - 1 },
            }
          : p
      )
    );

    startTransition(async () => {
      try {
        await deleteComment(commentId);
        toast.success("Comment removed");
      } catch {
        toast.error("Failed to delete comment");
      }
    });
  };

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Filter posts based on active tab and search query
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const { content: cleanContent, meta } = parsePostContent(post.content);
      const category = meta.category || (post.isPinned ? "ANNOUNCEMENT" : "DISCUSSION");

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = post.title.toLowerCase().includes(q);
        const inContent = cleanContent.toLowerCase().includes(q);
        const inRole = meta.hireRole?.toLowerCase().includes(q) || false;
        const inSkills = meta.hireSkills?.some((s) => s.toLowerCase().includes(q)) || false;
        if (!inTitle && !inContent && !inRole && !inSkills) return false;
      }

      // Tab filter
      if (activeTab === "saved") {
        return savedPosts.has(post.id);
      }
      if (activeTab === "wins") {
        return category === "WIN";
      }
      if (activeTab === "hire") {
        if (category !== "HIRE") return false;
        if (hireSubFilter === "offering") return meta.hireType === "OFFERING";
        if (hireSubFilter === "looking") return meta.hireType === "LOOKING";
        return true;
      }
      if (activeTab === "announcements") {
        return category === "ANNOUNCEMENT" || post.isPinned;
      }

      // "feed" shows all
      return true;
    });
  }, [posts, activeTab, hireSubFilter, searchQuery, savedPosts]);

  const PostCard = ({ post, index }: { post: Post; index: number }) => {
    const isSaved = savedPosts.has(post.id);
    const authorName =
      [post.author.firstName, post.author.lastName].filter(Boolean).join(" ") || "Agency Founder";
    const authorInitial = post.author.firstName?.charAt(0) || "E";
    const isCommentsOpen = expandedComments.has(post.id);
    const [commentText, setCommentText] = useState("");
    const isAuthor = currentUserId === post.authorId;
    const canDelete = isAuthor || isAdmin;

    const { content: parsedContent, meta } = parsePostContent(post.content);
    const category = meta.category || (post.isPinned ? "ANNOUNCEMENT" : "DISCUSSION");

    // Group reactions
    const reactionGroups = REACTION_EMOJIS.map((re) => {
      const reactions = post.reactions.filter((r) => r.emoji === re.emoji);
      const hasReacted = reactions.some((r) => r.userId === currentUserId);
      return { ...re, count: reactions.length, hasReacted };
    });

    const submitComment = () => {
      if (!commentText.trim()) return;
      handleAddComment(post.id, commentText);
      setCommentText("");
    };

    // Category Badge Styling
    const getCategoryBadge = () => {
      switch (category) {
        case "WIN":
          return (
            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 gap-1 text-[11px] font-bold">
              <Trophy className="w-3 h-3 text-emerald-500" />
              <span>Agency Win</span>
            </Badge>
          );
        case "HIRE":
          return (
            <Badge className="bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/30 gap-1 text-[11px] font-bold">
              <Briefcase className="w-3 h-3 text-violet-500" />
              <span>{meta.hireType === "LOOKING" ? "Seeking Talent" : "Available for Hire"}</span>
            </Badge>
          );
        case "ANNOUNCEMENT":
          return (
            <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 gap-1 text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Announcement</span>
            </Badge>
          );
        default:
          return (
            <Badge variant="outline" className="text-muted-foreground gap-1 text-[11px]">
              <MessageSquare className="w-3 h-3" />
              <span>Discussion</span>
            </Badge>
          );
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: index * 0.04 }}
      >
        <Card
          className={`relative overflow-hidden transition-all duration-300 hover:shadow-md ${
            category === "WIN"
              ? "bg-gradient-to-br from-emerald-500/[0.03] via-card to-card border-emerald-500/20"
              : category === "HIRE"
              ? "bg-gradient-to-br from-violet-500/[0.03] via-card to-card border-violet-500/20"
              : post.isPinned
              ? "bg-gradient-to-br from-amber-500/[0.04] via-card to-card border-amber-500/25"
              : "bg-card/80 border-border/70 hover:border-border"
          }`}
        >
          {/* Top highlight bar */}
          {post.isPinned && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400" />
          )}
          {category === "WIN" && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600" />
          )}
          {category === "HIRE" && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-600" />
          )}

          <CardHeader className="pb-3 pt-5 px-5 sm:px-6 flex flex-row items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 sm:h-11 sm:w-11 border border-border shadow-xs shrink-0">
                {post.author.imageUrl ? (
                  <AvatarImage src={post.author.imageUrl} alt={authorName} />
                ) : null}
                <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-slate-800 to-slate-900 text-white">
                  {authorInitial}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-foreground truncate">{authorName}</span>

                  {post.author.role === "ADMIN" ? (
                    <span className="px-1.5 py-0.2 rounded-md text-[10px] font-extrabold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      Founder
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded-md text-[10px] font-semibold bg-secondary text-secondary-foreground">
                      Agency Builder
                    </span>
                  )}

                  {getCategoryBadge()}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span>{formatDate(post.createdAt)}</span>
                  {post.isPinned && (
                    <span className="text-amber-500 font-semibold flex items-center gap-1">
                      <Pin className="w-3 h-3 fill-amber-500 rotate-45" /> Pinned
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions: Save / Menu */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => toggleSave(post.id)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  isSaved
                    ? "text-amber-500 bg-amber-500/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
                title={isSaved ? "Saved" : "Save post"}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? "fill-amber-500" : ""}`} />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors cursor-pointer outline-none">
                  <MoreHorizontal className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {isAdmin && (
                    <DropdownMenuItem
                      onClick={() => handleTogglePin(post.id)}
                      className="gap-2 cursor-pointer"
                    >
                      <Pin className="w-4 h-4" />
                      <span>{post.isPinned ? "Unpin Post" : "Pin Post"}</span>
                    </DropdownMenuItem>
                  )}
                  {canDelete && (
                    <DropdownMenuItem
                      onClick={() => handleDelete(post.id)}
                      className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Post</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="px-5 sm:px-6 pb-5 space-y-4">
            {/* Title */}
            <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight leading-snug">
              {post.title}
            </h2>

            {/* Win Revenue Spotlight Card */}
            {category === "WIN" && meta.winRevenue && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/5 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-xs">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                      Client Milestone Closed
                    </span>
                    <h4 className="text-base font-black text-emerald-700 dark:text-emerald-300">
                      {meta.winRevenue}
                    </h4>
                  </div>
                </div>
                <Badge className="bg-emerald-600 text-white border-none font-bold text-[10px]">
                  VERIFIED WIN 🔥
                </Badge>
              </div>
            )}

            {/* Hire & Services Spotlight Card */}
            {category === "HIRE" && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/10 via-card to-card border border-violet-500/30 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/60">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                      {meta.hireType === "LOOKING" ? "Job Request" : "Service Offering"}
                    </span>
                    <h4 className="text-base font-bold text-foreground">
                      {meta.hireRole || post.title}
                    </h4>
                  </div>
                  {meta.hireRate && (
                    <div className="px-3 py-1 rounded-xl bg-violet-600/10 text-violet-600 dark:text-violet-300 border border-violet-500/30 font-mono text-xs font-bold w-fit">
                      {meta.hireRate}
                    </div>
                  )}
                </div>

                {/* Skills tags */}
                {meta.hireSkills && meta.hireSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {meta.hireSkills.map((sk) => (
                      <span
                        key={sk}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-secondary text-secondary-foreground border border-border"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                )}

                {/* 1-Click WhatsApp Hire Button */}
                {meta.hireContact && (
                  <div className="pt-1 flex flex-wrap items-center gap-2">
                    <a
                      href={
                        meta.hireContact.startsWith("http")
                          ? meta.hireContact
                          : `https://wa.me/${meta.hireContact.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                              `Salam! I saw your post "${post.title}" on Eensell Community and I'd like to hire/collaborate with you.`
                            )}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Hire on WhatsApp</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Post Content */}
            <div className="text-sm text-foreground/90 leading-relaxed font-sans prose dark:prose-invert max-w-none">
              <RichTextRenderer content={parsedContent} />
            </div>

            {/* Shared Picture / Screenshot Attachment */}
            {meta.imageUrl && (
              <div className="rounded-2xl overflow-hidden border border-border/80 bg-black/5 shadow-xs">
                <img
                  src={meta.imageUrl}
                  alt={post.title}
                  onClick={() => setSelectedPreviewImage(meta.imageUrl!)}
                  className="w-full max-h-[420px] object-cover cursor-pointer hover:opacity-95 transition-opacity"
                  loading="lazy"
                />
              </div>
            )}

            {/* Shared Link Card */}
            {meta.linkUrl && (
              <a
                href={meta.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-secondary/50 hover:bg-secondary border border-border text-xs text-foreground transition-all group"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="font-bold truncate text-foreground">
                      {meta.linkTitle || meta.linkUrl}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">{meta.linkUrl}</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground shrink-0 transition-transform group-hover:translate-x-0.5" />
              </a>
            )}

            {/* Reactions & Comment Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-border/50 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                {reactionGroups.map((rg) => (
                  <button
                    key={rg.emoji}
                    onClick={() => handleReaction(post.id, rg.emoji)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      rg.hasReacted
                        ? "bg-amber-500/15 border-amber-500/40 text-foreground shadow-2xs"
                        : "bg-secondary/40 border-border/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <span>{rg.emoji}</span>
                    <span className="font-mono text-[11px]">{rg.count}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => toggleComments(post.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{post._count.comments} Comments</span>
                {isCommentsOpen ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Collapsible Comments Section */}
            <AnimatePresence>
              {isCommentsOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-3 space-y-3 overflow-hidden border-t border-border/50"
                >
                  {/* Comments list */}
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {post.comments.length === 0 ? (
                      <p className="text-xs text-muted-foreground py-2 text-center">
                        Be the first to reply to this post!
                      </p>
                    ) : (
                      post.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="p-3 rounded-xl bg-secondary/30 border border-border/50 flex items-start justify-between gap-2.5 text-xs"
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <Avatar className="h-7 w-7 border shrink-0">
                              {comment.user.imageUrl ? (
                                <AvatarImage src={comment.user.imageUrl} />
                              ) : null}
                              <AvatarFallback className="text-[10px] font-bold">
                                {comment.user.firstName?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-0.5 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-foreground">
                                  {[comment.user.firstName, comment.user.lastName]
                                    .filter(Boolean)
                                    .join(" ") || "Student"}
                                </span>
                                <span className="text-[10px] text-muted-foreground font-mono">
                                  {formatDate(comment.createdAt)}
                                </span>
                              </div>
                              <p className="text-foreground/90 leading-relaxed break-words">
                                {comment.content}
                              </p>
                            </div>
                          </div>

                          {(currentUserId === comment.userId || isAdmin) && (
                            <button
                              onClick={() => handleDeleteComment(comment.id, post.id)}
                              className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors cursor-pointer"
                              title="Delete comment"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add comment input */}
                  <div className="flex items-center gap-2 pt-1">
                    <Input
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          submitComment();
                        }
                      }}
                      placeholder="Write a constructive reply..."
                      className="h-9 text-xs bg-card border-border"
                    />
                    <Button
                      size="sm"
                      onClick={submitComment}
                      disabled={!commentText.trim()}
                      className="h-9 px-3 gap-1 rounded-xl text-xs font-bold bg-primary text-primary-foreground cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>Reply</span>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6 select-text">
      {/* ── Community Top Action Bar & Tabs ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-border">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab("feed")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "feed"
                ? "bg-foreground text-background shadow-xs"
                : "bg-card text-muted-foreground hover:text-foreground hover:bg-secondary border border-border"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>All Discussions</span>
          </button>

          <button
            onClick={() => setActiveTab("wins")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "wins"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-card text-muted-foreground hover:text-foreground hover:bg-secondary border border-border"
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-emerald-500" />
            <span>Wins & Milestones</span>
          </button>

          <button
            onClick={() => setActiveTab("hire")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "hire"
                ? "bg-violet-600 text-white shadow-xs"
                : "bg-card text-muted-foreground hover:text-foreground hover:bg-secondary border border-border"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-violet-500" />
            <span>Hire & Services</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-violet-400/20 text-violet-300 font-bold uppercase">
              Marketplace
            </span>
          </button>

          <button
            onClick={() => setActiveTab("announcements")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "announcements"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-card text-muted-foreground hover:text-foreground hover:bg-secondary border border-border"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Announcements</span>
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "saved"
                ? "bg-foreground text-background shadow-xs"
                : "bg-card text-muted-foreground hover:text-foreground hover:bg-secondary border border-border"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved ({savedPosts.size})</span>
          </button>
        </div>

        {/* Search & Create Post Trigger */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-48 sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="h-9 pl-8 text-xs bg-card border-border rounded-xl"
            />
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger className="inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent text-xs font-bold transition-all bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 h-9 px-4 shadow-sm cursor-pointer">
              <Plus className="w-4 h-4" />
              <span>Create Post</span>
            </DialogTrigger>

            <DialogContent className="bg-card border-border text-foreground sm:max-w-2xl max-h-[92vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold flex items-center gap-2">
                  <PenLine className="w-5 h-5 text-primary" />
                  <span>Post to Eensell Community</span>
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  Share wins, offer automation services, ask technical questions, or connect with agency founders.
                </p>
              </DialogHeader>

              <div className="space-y-4 pt-3">
                {/* Category Selector */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Post Category</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setPostCategory("DISCUSSION")}
                      className={`p-2 rounded-xl text-xs font-semibold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        postCategory === "DISCUSSION"
                          ? "bg-foreground text-background border-foreground shadow-xs"
                          : "bg-secondary/40 border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Discussion</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPostCategory("WIN")}
                      className={`p-2 rounded-xl text-xs font-semibold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        postCategory === "WIN"
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                          : "bg-secondary/40 border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Trophy className="w-4 h-4 text-emerald-500" />
                      <span>Share a Win</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPostCategory("HIRE")}
                      className={`p-2 rounded-xl text-xs font-semibold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        postCategory === "HIRE"
                          ? "bg-violet-600 text-white border-violet-600 shadow-xs"
                          : "bg-secondary/40 border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Briefcase className="w-4 h-4 text-violet-500" />
                      <span>Hire / Services</span>
                    </button>

                    {isAdmin ? (
                      <button
                        type="button"
                        onClick={() => setPostCategory("ANNOUNCEMENT")}
                        className={`p-2 rounded-xl text-xs font-semibold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          postCategory === "ANNOUNCEMENT"
                            ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                            : "bg-secondary/40 border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Announcement</span>
                      </button>
                    ) : null}
                  </div>
                </div>

                {/* Specific WIN inputs */}
                {postCategory === "WIN" && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                    <Label className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Revenue or Retainer Amount (Optional)</span>
                    </Label>
                    <Input
                      value={winRevenue}
                      onChange={(e) => setWinRevenue(e.target.value)}
                      placeholder="e.g. 5,000 MAD / month, $1,200 setup"
                      className="h-9 text-xs bg-card border-emerald-500/30"
                    />
                  </div>
                )}

                {/* Specific HIRE inputs */}
                {postCategory === "HIRE" && (
                  <div className="p-3.5 rounded-xl bg-violet-500/10 border border-violet-500/20 space-y-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setHireType("OFFERING")}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          hireType === "OFFERING"
                            ? "bg-violet-600 text-white border-violet-600 shadow-xs"
                            : "bg-card border-border text-muted-foreground"
                        }`}
                      >
                        I am Offering My Services
                      </button>
                      <button
                        type="button"
                        onClick={() => setHireType("LOOKING")}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          hireType === "LOOKING"
                            ? "bg-violet-600 text-white border-violet-600 shadow-xs"
                            : "bg-card border-border text-muted-foreground"
                        }`}
                      >
                        I am Looking to Hire Someone
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold">Service Specialty / Role</Label>
                        <Input
                          value={hireRole}
                          onChange={(e) => setHireRole(e.target.value)}
                          placeholder="e.g. Make.com Automation Expert"
                          className="h-8 text-xs bg-card"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold">Pricing / Budget</Label>
                        <Input
                          value={hireRate}
                          onChange={(e) => setHireRate(e.target.value)}
                          placeholder="e.g. 2,000 MAD / setup, 300 MAD / hr"
                          className="h-8 text-xs bg-card"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold">WhatsApp Number (For Direct Hire)</Label>
                        <Input
                          value={hireContact}
                          onChange={(e) => setHireContact(e.target.value)}
                          placeholder="e.g. 212661234567"
                          className="h-8 text-xs bg-card font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold">Key Skills (comma separated)</Label>
                        <Input
                          value={hireSkillsInput}
                          onChange={(e) => setHireSkillsInput(e.target.value)}
                          placeholder="Make.com, WhatsApp, OpenAI, Scraper"
                          className="h-8 text-xs bg-card"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Title */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Post Title</Label>
                  <Input
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder={
                      postCategory === "WIN"
                        ? "e.g. Just closed my first 5,000 MAD agency client in Casablanca!"
                        : postCategory === "HIRE"
                        ? "e.g. Offering custom WhatsApp Chatbot + Make.com setups for agencies"
                        : "e.g. How do you handle Google Sheets concurrency in high-volume webhooks?"
                    }
                    className="h-9 text-xs bg-card border-border"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Content</Label>
                  <RichTextEditor
                    content={postContent}
                    onChange={(html) => setPostContent(html)}
                    placeholder="Share the details, workflow breakdown, or questions..."
                  />
                </div>

                {/* Picture Sharing */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                    <span>Attach Picture or Screenshot URL</span>
                  </Label>
                  <Input
                    value={postImageUrl}
                    onChange={(e) => setPostImageUrl(e.target.value)}
                    placeholder="https://... (direct image URL, e.g. payment receipt or Make scenario screenshot)"
                    className="h-8 text-xs bg-card border-border"
                  />
                  {postImageUrl && (
                    <div className="relative mt-2 rounded-xl overflow-hidden border border-border w-fit max-w-xs">
                      <img
                        src={postImageUrl}
                        alt="Preview"
                        className="max-h-36 object-cover"
                        onError={() => toast.error("Could not load image URL")}
                      />
                      <button
                        type="button"
                        onClick={() => setPostImageUrl("")}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-black"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Link Sharing */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-violet-500" />
                    <span>Attach Resource or Portfolio Link (Optional)</span>
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      value={postLinkTitle}
                      onChange={(e) => setPostLinkTitle(e.target.value)}
                      placeholder="Link Label (e.g. Live Demo, Blueprint JSON)"
                      className="h-8 text-xs bg-card border-border"
                    />
                    <Input
                      value={postLinkUrl}
                      onChange={(e) => setPostLinkUrl(e.target.value)}
                      placeholder="https://..."
                      className="h-8 text-xs bg-card border-border"
                    />
                  </div>
                </div>

                {/* Submit */}
                <Button
                  onClick={handleCreatePost}
                  disabled={isPending || !postTitle.trim() || !postContent.trim()}
                  className="w-full h-10 gap-2 font-bold text-xs bg-primary text-primary-foreground cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Publish to Community
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ── Sub-Filter Bar for the HIRE Section ── */}
      {activeTab === "hire" && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 via-card to-card border border-violet-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-violet-500" />
              <span>Community Talent Marketplace</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Hire fellow agency builders for Make.com workflows, WhatsApp bots, and custom development.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              onClick={() => setHireSubFilter("all")}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                hireSubFilter === "all"
                  ? "bg-violet-600 text-white shadow-xs"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              All Services
            </button>
            <button
              onClick={() => setHireSubFilter("offering")}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                hireSubFilter === "offering"
                  ? "bg-violet-600 text-white shadow-xs"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              🛠️ Offering Services
            </button>
            <button
              onClick={() => setHireSubFilter("looking")}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                hireSubFilter === "looking"
                  ? "bg-violet-600 text-white shadow-xs"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              🔍 Looking to Hire
            </button>
          </div>
        </div>
      )}

      {/* ── Main Feed Display ── */}
      {filteredPosts.length === 0 ? (
        <Card className="bg-card/50 border-border/60">
          <CardContent className="py-20 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto border border-border/60">
              {activeTab === "wins" ? (
                <Trophy className="w-8 h-8 text-emerald-500/40" />
              ) : activeTab === "hire" ? (
                <Briefcase className="w-8 h-8 text-violet-500/40" />
              ) : (
                <MessageSquare className="w-8 h-8 text-muted-foreground/30" />
              )}
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">
                {activeTab === "wins"
                  ? "No wins posted yet"
                  : activeTab === "hire"
                  ? "No services posted in Hire yet"
                  : activeTab === "saved"
                  ? "No saved posts"
                  : "No posts found"}
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                {activeTab === "wins"
                  ? "Be the first to share your client acquisition win or revenue milestone!"
                  : activeTab === "hire"
                  ? "Post your automation skills or hire talent from within the Eensell community."
                  : "Check back later or start a new conversation."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5">
          {filteredPosts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      )}

      {/* Fullscreen Image Preview Dialog */}
      <Dialog
        open={Boolean(selectedPreviewImage)}
        onOpenChange={(open) => !open && setSelectedPreviewImage(null)}
      >
        <DialogContent className="max-w-4xl p-2 bg-black/90 border-none">
          {selectedPreviewImage && (
            <img
              src={selectedPreviewImage}
              alt="Enlarged view"
              className="w-full max-h-[85vh] object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
