"use client";

import { useState, useTransition, useRef } from "react";
import {
  createPost,
  togglePinPost,
  deletePost,
  toggleReaction,
  addComment,
  deleteComment,
} from "@/actions/community.actions";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
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

type Post = {
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
  { emoji: "🔥", label: "Fire", icon: Flame },
  { emoji: "❤️", label: "Love", icon: Heart },
  { emoji: "👏", label: "Clap" },
  { emoji: "💡", label: "Insight", icon: Lightbulb },
  { emoji: "🚀", label: "Rocket", icon: Rocket },
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
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

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

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    startTransition(async () => {
      try {
        const post = await createPost(newPost.title, newPost.content);
        setPosts((prev) => [post, ...prev]);
        setNewPost({ title: "", content: "" });
        setDialogOpen(false);
        toast.success("Post published!");
      } catch {
        toast.error("Failed to create post");
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
    // Optimistic update
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

  const handleDeleteComment = (postId: string, commentId: string) => {
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

  const PostCard = ({ post, index }: { post: Post; index: number }) => {
    const isSaved = savedPosts.has(post.id);
    const authorName =
      [post.author.firstName, post.author.lastName].filter(Boolean).join(" ") || "Eensell Team";
    const authorInitial = post.author.firstName?.charAt(0) || "E";
    const isCommentsOpen = expandedComments.has(post.id);
    const [commentText, setCommentText] = useState("");
    const commentInputRef = useRef<HTMLInputElement>(null);

    // Group reactions by emoji
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card
          className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg group ${
            post.isPinned
              ? "bg-gradient-to-br from-amber-500/[0.04] via-card/80 to-card border-amber-500/25 shadow-amber-500/5 shadow-md"
              : "bg-card/70 border-border/60 hover:border-border"
          }`}
        >
          {/* Pinned indicator strip */}
          {post.isPinned && (
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400" />
          )}

          <CardHeader className="pb-3 pt-5 px-6 flex flex-row items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <Avatar className="h-11 w-11 border-2 border-border/60 shadow-sm">
                  {post.author.imageUrl ? (
                    <AvatarImage src={post.author.imageUrl} alt={authorName} />
                  ) : null}
                  <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                    {authorInitial}
                  </AvatarFallback>
                </Avatar>
                {post.author.role === "ADMIN" && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-violet-600 flex items-center justify-center border-2 border-card">
                    <ShieldCheck className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground text-[15px]">{authorName}</span>
                  {post.author.role === "ADMIN" && (
                    <Badge
                      variant="secondary"
                      className="bg-violet-500/15 text-violet-600 dark:text-violet-400 text-[10px] px-2 py-0 border-violet-500/20 font-semibold tracking-wide uppercase"
                    >
                      Admin
                    </Badge>
                  )}
                  {post.isPinned && (
                    <Badge
                      variant="secondary"
                      className="bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] px-2 py-0 border-amber-500/20 font-semibold tracking-wide uppercase gap-0.5"
                    >
                      <Pin className="w-2.5 h-2.5 fill-current" />
                      Pinned
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSave(post.id)}
                className={`h-8 w-8 p-0 rounded-lg transition-all ${
                  isSaved
                    ? "text-violet-500 bg-violet-500/10 hover:bg-violet-500/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
              </Button>
              {isAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-lg h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card border-border min-w-[160px]">
                    <DropdownMenuItem
                      onClick={() => handleTogglePin(post.id)}
                      className="text-sm gap-2.5 cursor-pointer"
                    >
                      <Pin className="w-3.5 h-3.5" />
                      {post.isPinned ? "Unpin" : "Pin to Top"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(post.id)}
                      className="text-destructive text-sm gap-2.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </CardHeader>

          {/* Title */}
          <div className="px-6 pb-2">
            <h3 className="text-lg font-bold text-foreground leading-snug tracking-tight">
              {post.title}
            </h3>
          </div>

          {/* Content */}
          <CardContent className="pb-4 px-6">
            <div className="text-[15px] text-foreground/85 leading-[1.75] [&_p]:mb-2 [&_p:last-child]:mb-0 [&_strong]:text-foreground [&_strong]:font-semibold [&_a]:text-violet-500 [&_a]:underline [&_a]:underline-offset-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_blockquote]:border-l-3 [&_blockquote]:border-violet-500/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground">
              <RichTextRenderer content={post.content} />
            </div>
          </CardContent>

          {/* Reactions Bar */}
          <div className="px-6 pb-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              {reactionGroups.map((rg) => (
                <button
                  key={rg.emoji}
                  onClick={() => handleReaction(post.id, rg.emoji)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                    rg.hasReacted
                      ? "bg-violet-500/12 border-violet-500/30 text-violet-600 dark:text-violet-400 shadow-sm"
                      : rg.count > 0
                      ? "bg-muted/50 border-border/60 text-foreground/70 hover:bg-muted hover:border-border"
                      : "bg-transparent border-transparent text-muted-foreground/50 hover:bg-muted/50 hover:border-border/40 hover:text-muted-foreground"
                  }`}
                >
                  <span className="text-base leading-none">{rg.emoji}</span>
                  {rg.count > 0 && (
                    <span className="text-xs font-semibold tabular-nums">{rg.count}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Divider + Comment toggle + stats */}
          <CardFooter className="px-6 py-3 border-t border-border/40 flex items-center justify-between">
            <button
              onClick={() => toggleComments(post.id)}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              <MessageSquare className="w-4 h-4" />
              <span>
                {post.comments.length > 0
                  ? `${post.comments.length} comment${post.comments.length !== 1 ? "s" : ""}`
                  : "Comment"}
              </span>
              {isCommentsOpen ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {post._count.reactions > 0 && (
                <span className="flex items-center gap-1">
                  <span className="inline-flex -space-x-0.5">
                    {[...new Set(post.reactions.map((r) => r.emoji))].slice(0, 3).map((e) => (
                      <span key={e} className="text-sm">{e}</span>
                    ))}
                  </span>
                  <span className="font-medium ml-1">{post._count.reactions}</span>
                </span>
              )}
            </div>
          </CardFooter>

          {/* Comments Section */}
          <AnimatePresence>
            {isCommentsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="border-t border-border/40 bg-muted/20">
                  {/* Existing comments */}
                  {post.comments.length > 0 && (
                    <div className="px-6 pt-4 space-y-3 max-h-[400px] overflow-y-auto">
                      {post.comments.map((comment) => {
                        const commentAuthor =
                          [comment.user.firstName, comment.user.lastName]
                            .filter(Boolean)
                            .join(" ") || "User";
                        const commentInitial = comment.user.firstName?.charAt(0) || "U";
                        const canDelete =
                          comment.userId === currentUserId || isAdmin;

                        return (
                          <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-3 group/comment"
                          >
                            <Avatar className="h-8 w-8 shrink-0 border border-border/50">
                              {comment.user.imageUrl ? (
                                <AvatarImage src={comment.user.imageUrl} alt={commentAuthor} />
                              ) : null}
                              <AvatarFallback className="text-[10px] font-bold bg-gradient-to-br from-slate-400 to-slate-500 text-white">
                                {commentInitial}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="bg-card/80 border border-border/40 rounded-xl px-3.5 py-2.5 inline-block max-w-full">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-xs font-bold text-foreground">
                                    {commentAuthor}
                                  </span>
                                  {comment.user.role === "ADMIN" && (
                                    <Badge
                                      variant="secondary"
                                      className="bg-violet-500/15 text-violet-600 dark:text-violet-400 text-[8px] px-1 py-0 border-violet-500/20 font-semibold"
                                    >
                                      Admin
                                    </Badge>
                                  )}
                                  <span className="text-[10px] text-muted-foreground">
                                    {formatDate(comment.createdAt)}
                                  </span>
                                </div>
                                <p className="text-sm text-foreground/85 leading-relaxed break-words">
                                  {comment.content}
                                </p>
                              </div>
                              {canDelete && (
                                <button
                                  onClick={() => handleDeleteComment(post.id, comment.id)}
                                  className="mt-1 text-[10px] text-muted-foreground/50 hover:text-destructive transition-colors opacity-0 group-hover/comment:opacity-100 font-medium"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {/* Comment input */}
                  <div className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 relative">
                        <Input
                          ref={commentInputRef}
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              submitComment();
                            }
                          }}
                          placeholder="Write a comment..."
                          className="bg-card/80 border-border/60 text-foreground h-10 pr-10 rounded-xl text-sm placeholder:text-muted-foreground/50"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={submitComment}
                          disabled={!commentText.trim() || isPending}
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-violet-500 disabled:opacity-30"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    );
  };

  const filteredSavedPosts = posts.filter((p) => savedPosts.has(p.id));

  return (
    <div>
      {/* Admin Create Button + Tabs */}
      <Tabs defaultValue="feed" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-card/80 border border-border/60 p-1 shadow-sm">
            <TabsTrigger
              value="feed"
              className="data-[state=active]:bg-foreground data-[state=active]:text-background text-muted-foreground text-sm font-medium px-4"
            >
              All Posts
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className="data-[state=active]:bg-foreground data-[state=active]:text-background text-muted-foreground gap-1.5 text-sm font-medium px-4"
            >
              <Bookmark className="w-3.5 h-3.5" /> Saved
              {savedPosts.size > 0 && (
                <span className="ml-1 text-[10px] bg-violet-500/15 text-violet-600 dark:text-violet-400 px-1.5 rounded-full font-bold">
                  {savedPosts.size}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {isAdmin && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger className="inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent text-sm font-bold whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring disabled:pointer-events-none disabled:opacity-50 bg-foreground text-background hover:bg-foreground/90 gap-2 h-10 px-5 shadow-lg">
                <PenLine className="w-4 h-4" />
                New Post
              </DialogTrigger>
              <DialogContent className="bg-card border-border text-foreground sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold">Create Community Post</DialogTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Write an announcement for the community.
                  </p>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Title</Label>
                    <Input
                      value={newPost.title}
                      onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))}
                      className="bg-muted/30 border-border text-foreground mt-1.5 h-10"
                      placeholder="e.g., New course module available!"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-1.5 block">
                      Content
                    </Label>
                    <RichTextEditor
                      content={newPost.content}
                      onChange={(html) => setNewPost((p) => ({ ...p, content: html }))}
                      placeholder="Write your announcement... Use the toolbar to format text, add images, and embed videos."
                    />
                  </div>
                  <Button
                    onClick={handleCreatePost}
                    disabled={isPending || !newPost.title.trim() || !newPost.content.trim()}
                    className="w-full h-10 gap-2"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Publishing...
                      </>
                    ) : (
                      <>
                        <PenLine className="w-4 h-4" /> Publish Post
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <TabsContent value="feed" className="mt-0">
          {posts.length === 0 ? (
            <Card className="bg-card/50 border-border/60">
              <CardContent className="py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-4 border border-border/60">
                  <MessageSquare className="w-8 h-8 text-muted-foreground/30" />
                </div>
                <p className="text-base font-semibold text-foreground">No posts yet</p>
                <p className="text-sm text-muted-foreground mt-1.5 max-w-sm mx-auto">
                  {isAdmin
                    ? "Create your first community post to get the conversation going."
                    : "Check back later for updates from the team."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-5">
              {posts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="mt-0">
          {filteredSavedPosts.length === 0 ? (
            <Card className="bg-card/50 border-border/60">
              <CardContent className="py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-4 border border-border/60">
                  <Bookmark className="w-8 h-8 text-muted-foreground/30" />
                </div>
                <p className="text-base font-semibold text-foreground">No saved posts</p>
                <p className="text-sm text-muted-foreground mt-1.5 max-w-sm mx-auto">
                  Posts you save will appear here for easy access.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-5">
              {filteredSavedPosts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
