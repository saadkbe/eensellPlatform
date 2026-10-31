"use client";

import { useState, useTransition, useMemo } from "react";
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
  Rocket,
  Trophy,
  Briefcase,
  DollarSign,
  Image as ImageIcon,
  Link2,
  ExternalLink,
  Plus,
  Search,
  X,
  Sparkles,
  Phone,
  ArrowUpRight,
  Clock,
  Radio,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  // Post Card Component (Clean Luxury White)
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
          className={`relative rounded-2xl transition-all duration-300 overflow-hidden shadow-xs hover:shadow-md ${
            post.isPinned
              ? "bg-gradient-to-b from-amber-50/60 via-white to-white border border-amber-300/80 shadow-amber-500/5"
              : category === "WIN"
              ? "bg-gradient-to-b from-emerald-50/50 via-white to-white border border-emerald-300/80 shadow-emerald-500/5"
              : category === "HIRE"
              ? "bg-gradient-to-b from-violet-50/50 via-white to-white border border-violet-300/80 shadow-violet-500/5"
              : "bg-white hover:bg-white border border-slate-200/90 hover:border-slate-300"
          }`}
        >
          {/* Top category ambient highlight bar */}
          {post.isPinned && (
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500" />
          )}
          {category === "WIN" && (
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500" />
          )}
          {category === "HIRE" && (
            <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />
          )}

          {/* Header Row */}
          <div className="p-5 sm:p-6 pb-3 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative shrink-0">
                <Avatar className="h-11 w-11 sm:h-12 sm:w-12 border-2 border-slate-100 shadow-xs">
                  {post.author.imageUrl ? (
                    <AvatarImage src={post.author.imageUrl} alt={authorName} />
                  ) : null}
                  <AvatarFallback className="text-xs font-black bg-gradient-to-br from-slate-800 to-slate-900 text-white">
                    {authorInitial}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight truncate">
                    {authorName}
                  </span>

                  {post.author.role === "ADMIN" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-amber-100 text-amber-800 border border-amber-300">
                      <ShieldCheck className="w-3 h-3" />
                      Founder
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      Builder
                    </span>
                  )}

                  {/* Category Pill */}
                  {category === "WIN" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                      <Trophy className="w-3 h-3 text-emerald-600" />
                      Verified Win
                    </span>
                  )}
                  {category === "HIRE" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-100 text-violet-800 border border-violet-300 shadow-2xs">
                      <Briefcase className="w-3 h-3 text-violet-600" />
                      {meta.hireType === "LOOKING" ? "Hiring Talent" : "Open for Hire"}
                    </span>
                  )}
                  {category === "ANNOUNCEMENT" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      Official
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{formatDate(post.createdAt)}</span>
                  {post.isPinned && (
                    <span className="flex items-center gap-1 text-amber-700 font-bold text-[11px] ml-1 bg-amber-100/80 px-2 py-0.5 rounded-md">
                      <Pin className="w-3 h-3 fill-amber-600 text-amber-600" />
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
                    ? "bg-amber-100 text-amber-700 shadow-2xs"
                    : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                }`}
                title={isSaved ? "Saved" : "Save Post"}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? "fill-amber-600 text-amber-600" : ""}`} />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer">
                  <MoreHorizontal className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border-slate-200 text-slate-900 shadow-xl">
                  {isAdmin && (
                    <DropdownMenuItem
                      onClick={() => handleTogglePin(post.id)}
                      className="cursor-pointer gap-2 text-xs font-medium"
                    >
                      <Pin className="w-3.5 h-3.5 text-amber-600" />
                      <span>{post.isPinned ? "Unpin Post" : "Pin to Top"}</span>
                    </DropdownMenuItem>
                  )}
                  {canDelete && (
                    <DropdownMenuItem
                      onClick={() => handleDelete(post.id)}
                      className="cursor-pointer gap-2 text-xs text-rose-600 focus:text-rose-600 font-medium"
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
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
              {post.title}
            </h2>

            {/* Win Revenue Highlight Stamp */}
            {category === "WIN" && meta.winRevenue && (
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300 shadow-xs">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                  Deal Milestone:
                </span>
                <span className="text-base sm:text-lg font-black text-emerald-700 tracking-tight flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                  {meta.winRevenue}
                </span>
              </div>
            )}

            {/* Hire / Service Information Card */}
            {category === "HIRE" && (
              <div className="p-4 rounded-xl bg-violet-50/70 border border-violet-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-violet-700">
                      {meta.hireType === "LOOKING" ? "Position / Need" : "Specialization"}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {meta.hireRole || "Make.com & AI Automation Specialist"}
                    </h3>
                  </div>

                  {meta.hireRate && (
                    <div className="px-3 py-1 rounded-lg bg-white border border-violet-200 shadow-2xs">
                      <span className="text-xs font-black text-violet-800">
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
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-white text-violet-700 border border-violet-200 shadow-2xs"
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
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-black text-xs tracking-tight shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Hire on WhatsApp</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Rich formatted body */}
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              <RichTextRenderer content={parsedContent} />
            </div>

            {/* Attached Image / Screenshot */}
            {meta.imageUrl && (
              <div className="pt-2">
                <div
                  onClick={() => setSelectedPreviewImage(meta.imageUrl || null)}
                  className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group cursor-zoom-in max-h-[460px] flex items-center justify-center shadow-xs"
                >
                  <img
                    src={meta.imageUrl}
                    alt={post.title}
                    className="w-full h-auto object-cover max-h-[460px] group-hover:scale-[1.01] transition-transform duration-300"
                  />
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
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
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/90 transition-all group mt-2"
              >
                <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                  <Link2 className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors truncate">
                    {meta.linkTitle || meta.linkUrl}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {meta.linkUrl}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors shrink-0 mr-1" />
              </a>
            )}
          </div>

          {/* Reactions Bar & Comment Toggle */}
          <div className="px-5 sm:px-6 py-3 border-t border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
            {/* Reaction Emojis */}
            <div className="flex flex-wrap items-center gap-1.5">
              {reactionGroups.map((rg) => (
                <button
                  key={rg.emoji}
                  onClick={() => handleReaction(post.id, rg.emoji)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    rg.hasReacted
                      ? "bg-primary/10 border border-primary text-primary shadow-2xs"
                      : rg.count > 0
                      ? "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 shadow-2xs"
                      : "bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200/60 shadow-2xs"
                  }`}
                  title={rg.label}
                >
                  <span className="text-sm">{rg.emoji}</span>
                  {rg.count > 0 && <span className="text-xs font-bold">{rg.count}</span>}
                </button>
              ))}
            </div>

            {/* Comment Drawer Toggle */}
            <button
              onClick={() => toggleComments(post.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/90 transition-all cursor-pointer shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
              <span>
                {post._count.comments} {post._count.comments === 1 ? "Comment" : "Comments"}
              </span>
              {isCommentsOpen ? (
                <ChevronUp className="w-3.5 h-3.5 ml-0.5 text-slate-500" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 ml-0.5 text-slate-500" />
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
                className="border-t border-slate-200 bg-slate-50/90 p-5 sm:p-6 space-y-4"
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
                          className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs"
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <Avatar className="h-7 w-7 border border-slate-200 shrink-0">
                              {c.user.imageUrl ? <AvatarImage src={c.user.imageUrl} /> : null}
                              <AvatarFallback className="text-[10px] bg-slate-800 text-white font-bold">
                                {c.user.firstName?.charAt(0) || "B"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-900 truncate">
                                  {cName}
                                </span>
                                {c.user.role === "ADMIN" && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded-sm bg-amber-100 text-amber-800 font-black border border-amber-300">
                                    Founder
                                  </span>
                                )}
                                <span className="text-[10px] text-slate-400">
                                  {formatDate(c.createdAt)}
                                </span>
                              </div>
                              <p className="text-xs text-slate-700 leading-relaxed break-words font-normal">
                                {c.content}
                              </p>
                            </div>
                          </div>

                          {canDeleteComment && (
                            <button
                              onClick={() => handleDeleteComment(c.id, post.id)}
                              className="text-slate-400 hover:text-rose-600 transition-colors p-1"
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
                    className="h-10 text-xs bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus-visible:ring-primary/40 shadow-2xs"
                  />
                  <Button
                    onClick={submitComment}
                    disabled={!commentText.trim() || isPending}
                    size="sm"
                    className="h-10 px-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shrink-0 shadow-sm"
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
      {/* ── 1. Top Executive Banner & Community Metrics Bar (Crisp White Card) ── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-amber-500/[0.03] via-white to-slate-50/60 p-6 sm:p-8 shadow-xs">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                115 Active Builders
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                28+ Verified Client Wins
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Eensell Builder Network
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Share closed client deals, get feedback on Make.com scenarios, hire automation specialists, and scale your AI agency together.
            </p>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://discord.gg/ZGtYg2AqC"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-[#5865F2]/10 hover:bg-[#5865F2]/15 text-[#5865F2] font-bold text-xs border border-[#5865F2]/30 shadow-xs transition-all hover:scale-105"
            >
              <Radio className="w-4 h-4 text-[#5865F2] animate-pulse" />
              <span>Discord Voice Lounge</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <button
              onClick={() => setDialogOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary via-orange-500 to-amber-500 hover:opacity-95 text-white font-black text-xs shadow-md shadow-primary/20 transition-all hover:scale-105 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Post</span>
            </button>
          </div>
        </div>

        {/* Live Wins Marquee / Highlights Strip */}
        <div className="mt-6 pt-5 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-slate-900 truncate">+15,000 MAD Closed</div>
              <div className="text-[11px] text-slate-500 truncate">Make.com Real Estate Pipeline</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center shrink-0 border border-violet-200">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-slate-900 truncate">Hire Marketplace Live</div>
              <div className="text-[11px] text-slate-500 truncate">Find Make & WhatsApp builders</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-slate-900 truncate">Weekly Mastermind</div>
              <div className="text-[11px] text-slate-500 truncate">Live every Thursday 8PM GMT+1</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Two-Column High-End Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── MAIN FEED COLUMN (col-span-8) ── */}
        <div className="lg:col-span-8 space-y-6">
          {/* ── High-End Inline Composer (Crisp White Card) ── */}
          <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-slate-200 shrink-0">
                {currentUser?.imageUrl ? (
                  <AvatarImage src={currentUser.imageUrl} />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {currentUser?.firstName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>

              <button
                onClick={() => setDialogOpen(true)}
                className="flex-1 text-left px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-500 hover:text-slate-800 transition-all cursor-pointer truncate"
              >
                Share a client win, list your services, or start a discussion...
              </button>

              <button
                onClick={() => setDialogOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </div>

            {/* Quick Category Action Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => openComposerWithCategory("WIN")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all cursor-pointer"
              >
                <Trophy className="w-3.5 h-3.5 text-emerald-600" />
                <span>Share a Win (+ MAD Milestone)</span>
              </button>

              <button
                onClick={() => openComposerWithCategory("HIRE")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-violet-50 hover:bg-violet-100 text-violet-800 border border-violet-200 transition-all cursor-pointer"
              >
                <Briefcase className="w-3.5 h-3.5 text-violet-600" />
                <span>Offer Services (Hire)</span>
              </button>

              <button
                onClick={() => openComposerWithCategory("DISCUSSION")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                <span>Tech Question / Idea</span>
              </button>
            </div>
          </div>

          {/* ── Navigation Tabs & Filters Bar ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
            {/* Main Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setActiveTab("feed")}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "feed"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 shadow-2xs"
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>All Feed</span>
              </button>

              <button
                onClick={() => setActiveTab("wins")}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "wins"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 shadow-2xs"
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-emerald-600" />
                <span>Wins ({winCount})</span>
              </button>

              <button
                onClick={() => setActiveTab("hire")}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "hire"
                    ? "bg-violet-600 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 shadow-2xs"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-violet-600" />
                <span>Hire Marketplace</span>
                {hireCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-violet-100 text-violet-800 font-extrabold border border-violet-200">
                    {hireCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("announcements")}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "announcements"
                    ? "bg-amber-500 text-slate-950 font-black shadow-xs"
                    : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 shadow-2xs"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Announcements</span>
              </button>

              <button
                onClick={() => setActiveTab("saved")}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "saved"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 shadow-2xs"
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 text-slate-500" />
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
                className="h-9 pl-8 text-xs bg-white border-slate-200 text-slate-900 rounded-xl focus-visible:ring-primary/40 shadow-2xs"
              />
            </div>
          </div>

          {/* Sub-filters for Hire tab */}
          {activeTab === "hire" && (
            <div className="flex items-center gap-2 p-2 rounded-xl bg-violet-50 border border-violet-200">
              <span className="text-xs font-bold text-violet-800 px-2">Filter:</span>
              <button
                onClick={() => setHireSubFilter("all")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  hireSubFilter === "all"
                    ? "bg-violet-600 text-white shadow-2xs"
                    : "text-violet-700 hover:bg-violet-100"
                }`}
              >
                All Services
              </button>
              <button
                onClick={() => setHireSubFilter("offering")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  hireSubFilter === "offering"
                    ? "bg-violet-600 text-white shadow-2xs"
                    : "text-violet-700 hover:bg-violet-100"
                }`}
              >
                Available for Hire
              </button>
              <button
                onClick={() => setHireSubFilter("looking")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  hireSubFilter === "looking"
                    ? "bg-violet-600 text-white shadow-2xs"
                    : "text-violet-700 hover:bg-violet-100"
                }`}
              >
                Looking to Hire
              </button>
            </div>
          )}

          {/* ── Feed List ── */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-dashed border-slate-300 bg-white p-8 space-y-4 shadow-2xs">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <MessageSquare className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">No posts found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs cursor-pointer shadow-sm"
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

        {/* ── RIGHT EXECUTIVE SIDEBAR (col-span-4) (Crisp White Cards) ── */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
          {/* Card 1: Live Discord Lounge & Mastermind */}
          <div className="relative overflow-hidden rounded-2xl border border-[#5865F2]/30 bg-gradient-to-br from-[#5865F2]/10 via-white to-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#5865F2] flex items-center justify-center text-white shadow-sm">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">Live Voice Mastermind</h4>
                <p className="text-[11px] text-slate-500">Daily live networking & Q&A</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Connect directly with high-performing agency builders, review Make.com blueprints, and practice sales outreach pitches.
            </p>

            <a
              href="https://discord.gg/ZGtYg2AqC"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-extrabold text-xs shadow-md shadow-[#5865F2]/20 transition-all hover:scale-[1.02]"
            >
              <span>Join Discord Lounge</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: Community Wall of Fame (Top Wins) */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Wall of Fame
                </h4>
              </div>
              <span className="text-[10px] text-emerald-700 font-extrabold uppercase bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Verified
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 shadow-2xs">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">Make.com Real Estate CRM</div>
                  <div className="text-[10px] text-slate-500 truncate">Agency Retainer Deal</div>
                </div>
                <span className="text-xs font-black text-emerald-700 shrink-0">
                  +15,000 MAD
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 shadow-2xs">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">WhatsApp Lead Qualification Bot</div>
                  <div className="text-[10px] text-slate-500 truncate">Dental Clinic Client</div>
                </div>
                <span className="text-xs font-black text-emerald-700 shrink-0">
                  +8,500 MAD
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 shadow-2xs">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">E-commerce Multi-Channel Sync</div>
                  <div className="text-[10px] text-slate-500 truncate">Cold Outreach Client</div>
                </div>
                <span className="text-xs font-black text-emerald-700 shrink-0">
                  +4,000 MAD
                </span>
              </div>
            </div>

            <button
              onClick={() => openComposerWithCategory("WIN")}
              className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all text-center cursor-pointer shadow-2xs"
            >
              Post Your Own Win
            </button>
          </div>

          {/* Card 3: Hire Board Quick Access */}
          <div className="rounded-2xl border border-violet-200 bg-gradient-to-b from-violet-50/70 via-white to-white p-5 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-violet-600" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Hire Talent
              </h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Need someone to build your Make.com scenario or WhatsApp bot? Hire proven builders from inside Eensell.
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {["Make.com", "WhatsApp API", "OpenAI Agents", "Google Sheets CRM", "Webhooks"].map((s) => (
                <span key={s} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-violet-700 border border-violet-200 shadow-2xs">
                  {s}
                </span>
              ))}
            </div>

            <button
              onClick={() => {
                setActiveTab("hire");
                window.scrollTo({ top: 300, behavior: "smooth" });
              }}
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-black transition-all cursor-pointer shadow-sm shadow-violet-600/20"
            >
              Browse Hire Marketplace
            </button>
          </div>

          {/* Card 4: Community Code of Conduct */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 text-slate-600 text-xs space-y-2.5 shadow-xs">
            <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              Community Code of Honor
            </h5>
            <ul className="space-y-1.5 list-disc list-inside text-[11px] leading-relaxed text-slate-600">
              <li>Give before you take — help debug before asking.</li>
              <li>Post real proof with numbers for wins.</li>
              <li>Respectful freelance deals — deliver 100% excellence.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── 3. Rich Post Creation Dialog (Crisp White Modal) ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white border border-slate-200 text-slate-900 sm:max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black flex items-center gap-2 text-slate-900">
              <PenLine className="w-5 h-5 text-primary" />
              <span>Create Community Post</span>
            </DialogTitle>
            <p className="text-xs text-slate-500">
              Share wins with the community, offer your automation services, or ask technical questions.
            </p>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Category Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Category</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPostCategory("DISCUSSION")}
                  className={`p-2.5 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    postCategory === "DISCUSSION"
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Trophy className="w-4 h-4 text-emerald-600" />
                  <span>Share Win</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPostCategory("HIRE")}
                  className={`p-2.5 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    postCategory === "HIRE"
                      ? "bg-violet-600 text-white border-violet-600 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-violet-600" />
                  <span>Hire / Services</span>
                </button>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setPostCategory("ANNOUNCEMENT")}
                    className={`p-2.5 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      postCategory === "ANNOUNCEMENT"
                        ? "bg-amber-500 text-slate-950 font-black border-amber-500 shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Announcement</span>
                  </button>
                )}
              </div>
            </div>

            {/* Win-Specific Fields */}
            {postCategory === "WIN" && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                <Label className="text-xs font-bold text-emerald-800">
                  Revenue Milestone / Deal Amount (e.g. +14,000 MAD or $2,500 retainer)
                </Label>
                <Input
                  value={winRevenue}
                  onChange={(e) => setWinRevenue(e.target.value)}
                  placeholder="+15,000 MAD"
                  className="h-9 text-xs bg-white border-emerald-300 text-slate-900 font-bold"
                />
              </div>
            )}

            {/* Hire-Specific Fields */}
            {postCategory === "HIRE" && (
              <div className="p-4 rounded-xl bg-violet-50 border border-violet-200 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setHireType("OFFERING")}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      hireType === "OFFERING"
                        ? "bg-violet-600 text-white shadow-2xs"
                        : "bg-white text-slate-600 border border-violet-200"
                    }`}
                  >
                    Offering Services
                  </button>
                  <button
                    type="button"
                    onClick={() => setHireType("LOOKING")}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      hireType === "LOOKING"
                        ? "bg-violet-600 text-white shadow-2xs"
                        : "bg-white text-slate-600 border border-violet-200"
                    }`}
                  >
                    Looking to Hire
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-700 font-bold">Specialization / Role</Label>
                    <Input
                      value={hireRole}
                      onChange={(e) => setHireRole(e.target.value)}
                      placeholder="e.g. Make.com Scenario Architect"
                      className="h-9 text-xs bg-white border-slate-200 text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-slate-700 font-bold">Rate / Budget</Label>
                    <Input
                      value={hireRate}
                      onChange={(e) => setHireRate(e.target.value)}
                      placeholder="e.g. From 3,500 MAD / project"
                      className="h-9 text-xs bg-white border-slate-200 text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-slate-700 font-bold">
                    Skills / Tech Stack (comma separated)
                  </Label>
                  <Input
                    value={hireSkillsInput}
                    onChange={(e) => setHireSkillsInput(e.target.value)}
                    placeholder="Make.com, WhatsApp Cloud API, OpenAI, CRM"
                    className="h-9 text-xs bg-white border-slate-200 text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-slate-700 font-bold">
                    WhatsApp Direct Phone (international format, e.g. 212612345678)
                  </Label>
                  <Input
                    value={hireContact}
                    onChange={(e) => setHireContact(e.target.value)}
                    placeholder="2126XXXXXXXX"
                    className="h-9 text-xs bg-white border-slate-200 text-slate-900"
                  />
                </div>
              </div>
            )}

            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Post Title</Label>
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
                className="h-10 text-xs bg-white border-slate-200 text-slate-900 rounded-xl focus-visible:ring-primary/40 font-bold"
              />
            </div>

            {/* Body */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Content</Label>
              <RichTextEditor
                content={postContent}
                onChange={setPostContent}
                placeholder="Share the details, breakdown of your workflow, lessons learned, or instructions..."
                className="min-h-[150px] bg-white text-slate-900"
              />
            </div>

            {/* Media Attachment: Image URL */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-primary" />
                <span>Attach Screenshot / Image URL (optional)</span>
              </Label>
              <Input
                value={postImageUrl}
                onChange={(e) => setPostImageUrl(e.target.value)}
                placeholder="https://example.com/screenshot.png"
                className="h-9 text-xs bg-white border-slate-200 text-slate-900 rounded-xl"
              />
              {postImageUrl && (
                <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 max-h-36 bg-slate-50 flex items-center justify-center">
                  <img src={postImageUrl} alt="Preview" className="max-h-36 object-contain" />
                </div>
              )}
            </div>

            {/* Link Attachment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <Label className="text-xs text-slate-700 font-bold">Link URL (optional)</Label>
                <Input
                  value={postLinkUrl}
                  onChange={(e) => setPostLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="h-9 text-xs bg-white border-slate-200 text-slate-900 rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-700 font-bold">Link Title (optional)</Label>
                <Input
                  value={postLinkTitle}
                  onChange={(e) => setPostLinkTitle(e.target.value)}
                  placeholder="e.g. Make.com Blueprint Demo"
                  className="h-9 text-xs bg-white border-slate-200 text-slate-900 rounded-xl"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreatePost}
                disabled={isPending || !postTitle.trim() || !postContent.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-orange-500 hover:opacity-95 text-white font-black text-xs transition-all shadow-md shadow-primary/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
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
        <DialogContent className="bg-white/95 border border-slate-200 max-w-4xl p-2 text-slate-900 overflow-hidden shadow-2xl">
          <div className="relative flex items-center justify-center p-2">
            <button
              onClick={() => setSelectedPreviewImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/10 hover:bg-slate-900/20 text-slate-900 transition-all cursor-pointer z-10"
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
