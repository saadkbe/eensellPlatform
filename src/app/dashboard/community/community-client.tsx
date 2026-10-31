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
  Search,
  CheckCircle2,
  X,
  Sparkles,
  Phone,
  ArrowUpRight,
  Users,
  TrendingUp,
  Clock,
  Radio,
  Eye,
  Award,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
  { emoji: "💰", label: "Revenue" },
  { emoji: "👏", label: "Clap" },
  { emoji: "💡", label: "Insight" },
  { emoji: "❤️", label: "Love" },
];

interface CurrentUserProps {
  id: string;
  firstName: string;
  lastName: string;
  imageUrl: string | null;
  role: string;
}

export function CommunityClient({
  initialPosts,
  isAdmin,
  currentUserId,
  currentUser,
}: {
  initialPosts: Post[];
  isAdmin: boolean;
  currentUserId: string;
  currentUser?: CurrentUserProps;
}) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
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

  const openComposerWithCategory = (cat: "DISCUSSION" | "WIN" | "HIRE" | "ANNOUNCEMENT") => {
    setPostCategory(cat);
    setDialogOpen(true);
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
            ? "🏆 Win shared with the community! Keep crushing it!"
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

  // Helper date formatter
  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / 1000;

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Filter posts
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
        const inAuthor = (post.author.firstName + " " + post.author.lastName).toLowerCase().includes(q);
        if (!inTitle && !inContent && !inRole && !inSkills && !inAuthor) return false;
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

  // Total counts for badges
  const winCount = useMemo(() => {
    return posts.filter((p) => parsePostContent(p.content).meta.category === "WIN").length;
  }, [posts]);

  const hireCount = useMemo(() => {
    return posts.filter((p) => parsePostContent(p.content).meta.category === "HIRE").length;
  }, [posts]);

  // Post Card Component
  const PostCard = ({ post, index }: { post: Post; index: number }) => {
    const isSaved = savedPosts.has(post.id);
    const authorName =
      [post.author.firstName, post.author.lastName].filter(Boolean).join(" ") || "Automation Builder";
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

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: index * 0.03 }}
        className="group relative"
      >
        <div
          className={`relative rounded-2xl border transition-all duration-300 backdrop-blur-xl overflow-hidden ${
            post.isPinned
              ? "bg-gradient-to-b from-amber-500/[0.07] via-neutral-900/90 to-neutral-950 border-amber-500/30 shadow-[0_4px_30px_rgba(245,158,11,0.08)]"
              : category === "WIN"
              ? "bg-gradient-to-b from-emerald-500/[0.08] via-neutral-900/95 to-neutral-950 border-emerald-500/30 shadow-[0_4px_35px_rgba(16,185,129,0.08)]"
              : category === "HIRE"
              ? "bg-gradient-to-b from-violet-500/[0.08] via-neutral-900/95 to-neutral-950 border-violet-500/30 shadow-[0_4px_35px_rgba(139,92,246,0.08)]"
              : "bg-neutral-900/80 hover:bg-neutral-900/95 border-white/[0.08] hover:border-white/[0.18] shadow-lg shadow-black/20"
          }`}
        >
          {/* Top category ambient glow bar */}
          {post.isPinned && (
            <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500" />
          )}
          {category === "WIN" && (
            <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500" />
          )}
          {category === "HIRE" && (
            <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />
          )}

          {/* Header Row */}
          <div className="p-5 sm:p-6 pb-3 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative shrink-0">
                <Avatar className="h-11 w-11 sm:h-12 sm:w-12 border-2 border-white/10 ring-2 ring-black/40">
                  {post.author.imageUrl ? (
                    <AvatarImage src={post.author.imageUrl} alt={authorName} />
                  ) : null}
                  <AvatarFallback className="text-xs font-black bg-gradient-to-br from-neutral-800 to-neutral-950 text-white">
                    {authorInitial}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-neutral-900" />
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm sm:text-base text-white tracking-tight truncate">
                    {authorName}
                  </span>

                  {post.author.role === "ADMIN" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40">
                      <ShieldCheck className="w-3 h-3" />
                      Founder
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 text-slate-300 border border-white/10">
                      Builder
                    </span>
                  )}

                  {/* Category Pill */}
                  {category === "WIN" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                      <Trophy className="w-3 h-3 text-emerald-400" />
                      Verified Win
                    </span>
                  )}
                  {category === "HIRE" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/40">
                      <Briefcase className="w-3 h-3 text-violet-400" />
                      {meta.hireType === "LOOKING" ? "Hiring Talent" : "Open for Hire"}
                    </span>
                  )}
                  {category === "ANNOUNCEMENT" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Official
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{formatDate(post.createdAt)}</span>
                  {post.isPinned && (
                    <span className="flex items-center gap-1 text-amber-400 font-semibold text-[11px] ml-1">
                      <Pin className="w-3 h-3 fill-amber-400" />
                      Pinned Post
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Menu */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => toggleSave(post.id)}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isSaved
                    ? "bg-white/15 text-amber-400"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
                title={isSaved ? "Saved" : "Save Post"}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? "fill-amber-400" : ""}`} />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
                  <MoreHorizontal className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-neutral-900 border-white/10 text-white shadow-2xl">
                  {isAdmin && (
                    <DropdownMenuItem
                      onClick={() => handleTogglePin(post.id)}
                      className="cursor-pointer gap-2 text-xs"
                    >
                      <Pin className="w-3.5 h-3.5" />
                      <span>{post.isPinned ? "Unpin Post" : "Pin to Top"}</span>
                    </DropdownMenuItem>
                  )}
                  {canDelete && (
                    <DropdownMenuItem
                      onClick={() => handleDelete(post.id)}
                      className="cursor-pointer gap-2 text-xs text-rose-400 focus:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Post</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Post Content */}
          <div className="px-5 sm:px-6 pt-1 pb-4 space-y-3">
            {/* Title */}
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug">
              {post.title}
            </h2>

            {/* Win Revenue Highlight Stamp */}
            {category === "WIN" && meta.winRevenue && (
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-emerald-500/25 border border-emerald-500/40 shadow-inner">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Deal Milestone:
                </span>
                <span className="text-base sm:text-lg font-black text-emerald-400 tracking-tight flex items-center gap-1 drop-shadow-md">
                  <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
                  {meta.winRevenue}
                </span>
              </div>
            )}

            {/* Hire / Service Information Card */}
            {category === "HIRE" && (
              <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/25 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-violet-400">
                      {meta.hireType === "LOOKING" ? "Position / Need" : "Specialization"}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {meta.hireRole || "Make.com & AI Automation Specialist"}
                    </h3>
                  </div>

                  {meta.hireRate && (
                    <div className="px-3 py-1 rounded-lg bg-violet-500/20 border border-violet-500/40">
                      <span className="text-xs font-black text-violet-200">
                        {meta.hireRate}
                      </span>
                    </div>
                  )}
                </div>

                {meta.hireSkills && meta.hireSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {meta.hireSkills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-violet-400/15 text-violet-300 border border-violet-400/25"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Direct 1-Click WhatsApp Button */}
                {meta.hireContact && (
                  <div className="pt-2">
                    <a
                      href={`https://wa.me/${meta.hireContact.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `Hi ${authorName}, I saw your post "${post.title}" on Eensell University Community and I'd like to talk!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-black font-extrabold text-xs tracking-tight shadow-md transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 fill-black" />
                      <span>Hire on WhatsApp</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Rich formatted body */}
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              <RichTextRenderer content={parsedContent} />
            </div>

            {/* Attached Image / Screenshot */}
            {meta.imageUrl && (
              <div className="pt-2">
                <div
                  onClick={() => setSelectedPreviewImage(meta.imageUrl || null)}
                  className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 group cursor-zoom-in max-h-[460px] flex items-center justify-center"
                >
                  <img
                    src={meta.imageUrl}
                    alt={post.title}
                    className="w-full h-auto object-cover max-h-[460px] group-hover:scale-[1.01] transition-transform duration-300"
                  />
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Click to expand</span>
                  </div>
                </div>
              </div>
            )}

            {/* Attached External Link */}
            {meta.linkUrl && (
              <a
                href={meta.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group mt-2"
              >
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Link2 className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white group-hover:text-primary transition-colors truncate">
                    {meta.linkTitle || meta.linkUrl}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {meta.linkUrl}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors shrink-0 mr-1" />
              </a>
            )}
          </div>

          {/* Reactions Bar & Comment Toggle */}
          <div className="px-5 sm:px-6 py-3 border-t border-white/[0.08] bg-black/30 flex flex-wrap items-center justify-between gap-3">
            {/* Reaction Emojis */}
            <div className="flex flex-wrap items-center gap-1.5">
              {reactionGroups.map((rg) => (
                <button
                  key={rg.emoji}
                  onClick={() => handleReaction(post.id, rg.emoji)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    rg.hasReacted
                      ? "bg-primary/25 border border-primary/50 text-white shadow-xs"
                      : rg.count > 0
                      ? "bg-white/10 text-slate-200 border border-white/10 hover:bg-white/15"
                      : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-transparent"
                  }`}
                  title={rg.label}
                >
                  <span className="text-sm">{rg.emoji}</span>
                  {rg.count > 0 && <span className="text-xs">{rg.count}</span>}
                </button>
              ))}
            </div>

            {/* Comment Drawer Toggle */}
            <button
              onClick={() => toggleComments(post.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>
                {post._count.comments} {post._count.comments === 1 ? "Comment" : "Comments"}
              </span>
              {isCommentsOpen ? (
                <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
              )}
            </button>
          </div>

          {/* Comments Accordion */}
          <AnimatePresence>
            {isCommentsOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-white/[0.08] bg-black/50 p-5 sm:p-6 space-y-4"
              >
                {/* List Comments */}
                {post.comments.length > 0 ? (
                  <div className="space-y-3">
                    {post.comments.map((c) => {
                      const cName =
                        [c.user.firstName, c.user.lastName].filter(Boolean).join(" ") || "Builder";
                      const canDeleteComment = isAdmin || c.userId === currentUserId;
                      return (
                        <div
                          key={c.id}
                          className="flex items-start justify-between gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <Avatar className="h-7 w-7 border border-white/10 shrink-0">
                              {c.user.imageUrl ? <AvatarImage src={c.user.imageUrl} /> : null}
                              <AvatarFallback className="text-[10px] bg-neutral-800 text-white">
                                {c.user.firstName?.charAt(0) || "B"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white truncate">
                                  {cName}
                                </span>
                                {c.user.role === "ADMIN" && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded-sm bg-amber-500/20 text-amber-400 font-extrabold">
                                    Founder
                                  </span>
                                )}
                                <span className="text-[10px] text-slate-500">
                                  {formatDate(c.createdAt)}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed break-words">
                                {c.content}
                              </p>
                            </div>
                          </div>

                          {canDeleteComment && (
                            <button
                              onClick={() => handleDeleteComment(c.id, post.id)}
                              className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                              title="Delete comment"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic text-center py-2">
                    No comments yet. Start the conversation!
                  </p>
                )}

                {/* Add Comment Input */}
                <div className="flex items-center gap-2 pt-2">
                  <Input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        submitComment();
                      }
                    }}
                    placeholder="Write a comment..."
                    className="h-10 text-xs bg-neutral-900 border-white/10 text-white rounded-xl focus-visible:ring-primary/40"
                  />
                  <Button
                    onClick={submitComment}
                    disabled={!commentText.trim() || isPending}
                    size="sm"
                    className="h-10 px-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* ── 1. Top Executive Banner & Community Metrics Bar ── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-900 via-neutral-950 to-black p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                115 Active Builders
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-slate-300 border border-white/10">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                28+ Verified Client Wins
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Eensell Builder Network
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Share closed client deals, get feedback on Make.com scenarios, hire automation specialists, and scale your AI agency together.
            </p>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://discord.gg/ZGtYg2AqC"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-[#5865F2]/20 hover:bg-[#5865F2]/30 text-white font-bold text-xs border border-[#5865F2]/40 shadow-lg shadow-[#5865F2]/10 transition-all hover:scale-105"
            >
              <Radio className="w-4 h-4 text-[#5865F2] animate-pulse" />
              <span>Discord Voice Lounge</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-300" />
            </a>

            <button
              onClick={() => setDialogOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary via-orange-500 to-amber-500 hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-primary/20 transition-all hover:scale-105 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Post</span>
            </button>
          </div>
        </div>

        {/* Live Wins Marquee / Highlights Strip */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-white truncate">+15,000 MAD Closed</div>
              <div className="text-[10px] text-slate-400 truncate">Make.com Real Estate Pipeline</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-white truncate">Hire Marketplace Live</div>
              <div className="text-[10px] text-slate-400 truncate">Find Make & WhatsApp builders</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-white truncate">Weekly Mastermind</div>
              <div className="text-[10px] text-slate-400 truncate">Live every Thursday 8PM GMT+1</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Two-Column High-End Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── MAIN FEED COLUMN (col-span-8) ── */}
        <div className="lg:col-span-8 space-y-6">
          {/* ── High-End Inline Composer ── */}
          <div className="rounded-2xl border border-white/10 bg-neutral-900/90 backdrop-blur-xl p-4 sm:p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-white/10 shrink-0">
                {currentUser?.imageUrl ? (
                  <AvatarImage src={currentUser.imageUrl} />
                ) : null}
                <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">
                  {currentUser?.firstName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>

              <button
                onClick={() => setDialogOpen(true)}
                className="flex-1 text-left px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-400 hover:text-slate-200 transition-all cursor-pointer truncate"
              >
                Share a client win, list your services, or start a discussion...
              </button>

              <button
                onClick={() => setDialogOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </div>

            {/* Quick Category Action Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/[0.06]">
              <button
                onClick={() => openComposerWithCategory("WIN")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/25 transition-all cursor-pointer"
              >
                <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                <span>Share a Win (+ MAD Milestone)</span>
              </button>

              <button
                onClick={() => openComposerWithCategory("HIRE")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/25 transition-all cursor-pointer"
              >
                <Briefcase className="w-3.5 h-3.5 text-violet-400" />
                <span>Offer Services (Hire)</span>
              </button>

              <button
                onClick={() => openComposerWithCategory("DISCUSSION")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                <span>Tech Question / Idea</span>
              </button>
            </div>
          </div>

          {/* ── Navigation Tabs & Filters Bar ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
            {/* Main Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setActiveTab("feed")}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "feed"
                    ? "bg-white text-black shadow-md"
                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5"
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>All Feed</span>
              </button>

              <button
                onClick={() => setActiveTab("wins")}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "wins"
                    ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5"
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                <span>Wins ({winCount})</span>
              </button>

              <button
                onClick={() => setActiveTab("hire")}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "hire"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-violet-400" />
                <span>Hire Marketplace</span>
                {hireCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-violet-400/20 text-violet-300 font-extrabold">
                    {hireCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("announcements")}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "announcements"
                    ? "bg-amber-500 text-black shadow-md"
                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Announcements</span>
              </button>

              <button
                onClick={() => setActiveTab("saved")}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "saved"
                    ? "bg-white text-black shadow-md"
                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5"
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Saved ({savedPosts.size})</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-56 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search community..."
                className="h-9 pl-8 text-xs bg-neutral-900 border-white/10 text-white rounded-xl focus-visible:ring-primary/40"
              />
            </div>
          </div>

          {/* Sub-filters for Hire tab */}
          {activeTab === "hire" && (
            <div className="flex items-center gap-2 p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <span className="text-xs font-bold text-violet-300 px-2">Filter:</span>
              <button
                onClick={() => setHireSubFilter("all")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  hireSubFilter === "all"
                    ? "bg-violet-600 text-white"
                    : "text-violet-300 hover:bg-violet-500/20"
                }`}
              >
                All Services
              </button>
              <button
                onClick={() => setHireSubFilter("offering")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  hireSubFilter === "offering"
                    ? "bg-violet-600 text-white"
                    : "text-violet-300 hover:bg-violet-500/20"
                }`}
              >
                Available for Hire
              </button>
              <button
                onClick={() => setHireSubFilter("looking")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  hireSubFilter === "looking"
                    ? "bg-violet-600 text-white"
                    : "text-violet-300 hover:bg-violet-500/20"
                }`}
              >
                Looking to Hire
              </button>
            </div>
          )}

          {/* ── Feed List ── */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-dashed border-white/10 bg-neutral-900/40 p-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-slate-500">
                <MessageSquare className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">No posts found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {searchQuery
                    ? "No community posts matched your search keywords."
                    : activeTab === "wins"
                    ? "Be the first builder to post a client deal milestone!"
                    : activeTab === "hire"
                    ? "Post the first service offer in the Hire Marketplace."
                    : "Be the first to share an insight with the Eensell community."}
                </p>
              </div>
              <button
                onClick={() => setDialogOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Post</span>
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredPosts.map((post, idx) => (
                <PostCard key={post.id} post={post} index={idx} />
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT EXECUTIVE SIDEBAR (col-span-4) ── */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
          {/* Card 1: Live Discord Lounge & Mastermind */}
          <div className="relative overflow-hidden rounded-2xl border border-[#5865F2]/40 bg-gradient-to-br from-[#5865F2]/15 via-neutral-900 to-neutral-950 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#5865F2] flex items-center justify-center text-white shadow-md">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Live Voice Mastermind</h4>
                <p className="text-[11px] text-slate-300">Daily live networking & Q&A</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Connect directly with high-performing agency builders, review Make.com blueprints, and practice sales outreach pitches.
            </p>

            <a
              href="https://discord.gg/ZGtYg2AqC"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-extrabold text-xs shadow-lg shadow-[#5865F2]/25 transition-all hover:scale-[1.02]"
            >
              <span>Join Discord Lounge</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: Community Wall of Fame (Top Wins) */}
          <div className="rounded-2xl border border-white/10 bg-neutral-900/90 backdrop-blur-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-black uppercase tracking-wider text-white">
                  Wall of Fame
                </h4>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase">
                Verified
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">Make.com Real Estate CRM</div>
                  <div className="text-[10px] text-slate-400 truncate">Agency Retainer Deal</div>
                </div>
                <span className="text-xs font-black text-emerald-400 shrink-0">
                  +15,000 MAD
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">WhatsApp Lead Qualification Bot</div>
                  <div className="text-[10px] text-slate-400 truncate">Dental Clinic Client</div>
                </div>
                <span className="text-xs font-black text-emerald-400 shrink-0">
                  +8,500 MAD
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">E-commerce Multi-Channel Sync</div>
                  <div className="text-[10px] text-slate-400 truncate">Cold Outreach Client</div>
                </div>
                <span className="text-xs font-black text-emerald-400 shrink-0">
                  +4,000 MAD
                </span>
              </div>
            </div>

            <button
              onClick={() => openComposerWithCategory("WIN")}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition-all text-center cursor-pointer"
            >
              Post Your Own Win
            </button>
          </div>

          {/* Card 3: Hire Board Quick Access */}
          <div className="rounded-2xl border border-violet-500/25 bg-gradient-to-b from-violet-500/10 via-neutral-900 to-neutral-950 p-5 shadow-xl space-y-3.5">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-violet-400" />
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                Hire Talent
              </h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Need someone to build your Make.com scenario or WhatsApp bot? Hire proven builders from inside Eensell.
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {["Make.com", "WhatsApp API", "OpenAI Agents", "Google Sheets CRM", "Webhooks"].map((s) => (
                <span key={s} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-violet-400/15 text-violet-300 border border-violet-400/25">
                  {s}
                </span>
              ))}
            </div>

            <button
              onClick={() => {
                setActiveTab("hire");
                window.scrollTo({ top: 300, behavior: "smooth" });
              }}
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-extrabold transition-all cursor-pointer shadow-md shadow-violet-600/20"
            >
              Browse Hire Marketplace
            </button>
          </div>

          {/* Card 4: Community Code of Conduct */}
          <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5 text-slate-400 text-xs space-y-2.5">
            <h5 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              Community Code of Honor
            </h5>
            <ul className="space-y-1.5 list-disc list-inside text-[11px] leading-relaxed text-slate-400">
              <li>Give before you take — help debug before asking.</li>
              <li>Post real proof with numbers for wins.</li>
              <li>Respectful freelance deals — deliver 100% excellence.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── 3. Rich Post Creation Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-neutral-950 border border-white/10 text-white sm:max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black flex items-center gap-2">
              <PenLine className="w-5 h-5 text-primary" />
              <span>Create Community Post</span>
            </DialogTitle>
            <p className="text-xs text-slate-400">
              Share wins with the community, offer your automation services, or ask technical questions.
            </p>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Category Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-300">Category</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPostCategory("DISCUSSION")}
                  className={`p-2.5 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    postCategory === "DISCUSSION"
                      ? "bg-white text-black border-white shadow-md"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Discussion</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPostCategory("WIN")}
                  className={`p-2.5 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    postCategory === "WIN"
                      ? "bg-emerald-500 text-black border-emerald-500 shadow-md"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  <Trophy className="w-4 h-4 text-emerald-400" />
                  <span>Share Win</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPostCategory("HIRE")}
                  className={`p-2.5 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    postCategory === "HIRE"
                      ? "bg-violet-600 text-white border-violet-600 shadow-md"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-violet-400" />
                  <span>Hire / Services</span>
                </button>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setPostCategory("ANNOUNCEMENT")}
                    className={`p-2.5 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      postCategory === "ANNOUNCEMENT"
                        ? "bg-amber-500 text-black border-amber-500 shadow-md"
                        : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Announcement</span>
                  </button>
                )}
              </div>
            </div>

            {/* Win-Specific Fields */}
            {postCategory === "WIN" && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <Label className="text-xs font-bold text-emerald-300">
                  Revenue Milestone / Deal Amount (e.g. +14,000 MAD or $2,500 retainer)
                </Label>
                <Input
                  value={winRevenue}
                  onChange={(e) => setWinRevenue(e.target.value)}
                  placeholder="+15,000 MAD"
                  className="h-9 text-xs bg-black/60 border-emerald-500/30 text-white font-bold"
                />
              </div>
            )}

            {/* Hire-Specific Fields */}
            {postCategory === "HIRE" && (
              <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setHireType("OFFERING")}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      hireType === "OFFERING"
                        ? "bg-violet-600 text-white"
                        : "bg-white/5 text-slate-400"
                    }`}
                  >
                    Offering Services
                  </button>
                  <button
                    type="button"
                    onClick={() => setHireType("LOOKING")}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      hireType === "LOOKING"
                        ? "bg-violet-600 text-white"
                        : "bg-white/5 text-slate-400"
                    }`}
                  >
                    Looking to Hire
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-300">Specialization / Role</Label>
                    <Input
                      value={hireRole}
                      onChange={(e) => setHireRole(e.target.value)}
                      placeholder="e.g. Make.com Scenario Architect"
                      className="h-9 text-xs bg-black/50 border-violet-500/30 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-slate-300">Rate / Budget</Label>
                    <Input
                      value={hireRate}
                      onChange={(e) => setHireRate(e.target.value)}
                      placeholder="e.g. From 3,500 MAD / project"
                      className="h-9 text-xs bg-black/50 border-violet-500/30 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-slate-300">
                    Skills / Tech Stack (comma separated)
                  </Label>
                  <Input
                    value={hireSkillsInput}
                    onChange={(e) => setHireSkillsInput(e.target.value)}
                    placeholder="Make.com, WhatsApp Cloud API, OpenAI, CRM"
                    className="h-9 text-xs bg-black/50 border-violet-500/30 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-slate-300">
                    WhatsApp Direct Phone (international format, e.g. 212612345678)
                  </Label>
                  <Input
                    value={hireContact}
                    onChange={(e) => setHireContact(e.target.value)}
                    placeholder="2126XXXXXXXX"
                    className="h-9 text-xs bg-black/50 border-violet-500/30 text-white"
                  />
                </div>
              </div>
            )}

            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-300">Post Title</Label>
              <Input
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder={
                  postCategory === "WIN"
                    ? "Just closed my first 15k MAD automation client!"
                    : postCategory === "HIRE"
                    ? "Available for Make.com & WhatsApp API agency setups"
                    : "How are you handling WhatsApp webhook retries in Make?"
                }
                className="h-10 text-xs bg-neutral-900 border-white/10 text-white rounded-xl focus-visible:ring-primary/40 font-bold"
              />
            </div>

            {/* Body */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-300">Content</Label>
              <RichTextEditor
                content={postContent}
                onChange={setPostContent}
                placeholder="Share the details, breakdown of your workflow, lessons learned, or instructions..."
                className="min-h-[150px]"
              />
            </div>

            {/* Media Attachment: Image URL */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-primary" />
                <span>Attach Screenshot / Image URL (optional)</span>
              </Label>
              <Input
                value={postImageUrl}
                onChange={(e) => setPostImageUrl(e.target.value)}
                placeholder="https://example.com/screenshot.png"
                className="h-9 text-xs bg-neutral-900 border-white/10 text-white rounded-xl"
              />
              {postImageUrl && (
                <div className="mt-2 rounded-xl overflow-hidden border border-white/10 max-h-36 bg-black flex items-center justify-center">
                  <img src={postImageUrl} alt="Preview" className="max-h-36 object-contain" />
                </div>
              )}
            </div>

            {/* Link Attachment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <Label className="text-xs text-slate-300">Link URL (optional)</Label>
                <Input
                  value={postLinkUrl}
                  onChange={(e) => setPostLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="h-9 text-xs bg-neutral-900 border-white/10 text-white rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-300">Link Title (optional)</Label>
                <Input
                  value={postLinkTitle}
                  onChange={(e) => setPostLinkTitle(e.target.value)}
                  placeholder="e.g. Make.com Blueprint Demo"
                  className="h-9 text-xs bg-neutral-900 border-white/10 text-white rounded-xl"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreatePost}
                disabled={isPending || !postTitle.trim() || !postContent.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-orange-500 hover:opacity-95 text-white font-black text-xs transition-all shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Publish Post</span>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── 4. Full Image Lightbox Modal ── */}
      <Dialog
        open={!!selectedPreviewImage}
        onOpenChange={(open) => !open && setSelectedPreviewImage(null)}
      >
        <DialogContent className="bg-black/95 border border-white/10 max-w-4xl p-2 text-white overflow-hidden shadow-2xl">
          <div className="relative flex items-center justify-center p-2">
            <button
              onClick={() => setSelectedPreviewImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>
            {selectedPreviewImage && (
              <img
                src={selectedPreviewImage}
                alt="Enlarged proof screenshot"
                className="max-h-[85vh] w-auto object-contain rounded-xl"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
