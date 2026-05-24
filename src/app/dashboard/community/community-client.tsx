"use client";

import { useState, useTransition } from "react";
import { createPost, togglePinPost, deletePost } from "@/actions/community.actions";
import { toast } from "sonner";
import {
  Bookmark,
  ShieldCheck,
  Pin,
  MoreHorizontal,
  Plus,
  Trash2,
  Loader2,
  PenLine,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Author = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  role: string;
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
};

export function CommunityClient({
  initialPosts,
  isAdmin,
}: {
  initialPosts: Post[];
  isAdmin: boolean;
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [savedPosts, setSavedPosts] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("eensell_saved_posts");
        return saved ? new Set(JSON.parse(saved)) : new Set();
      } catch { return new Set(); }
    }
    return new Set();
  });
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

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

  const PostCard = ({ post }: { post: Post }) => {
    const isSaved = savedPosts.has(post.id);
    const authorName = [post.author.firstName, post.author.lastName].filter(Boolean).join(" ") || "Eensell Team";
    const authorInitial = post.author.firstName?.charAt(0) || "E";

    return (
      <Card className="bg-card/50 border-border overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/15 group">
        <CardHeader className="pb-3 flex flex-row items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-border bg-muted">
              {post.author.imageUrl ? (
                <AvatarImage src={post.author.imageUrl} alt={authorName} />
              ) : null}
              <AvatarFallback className="text-xs font-semibold">{authorInitial}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground text-sm">{authorName}</span>
                {post.author.role === "ADMIN" && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary text-[9px] px-1.5 py-0 border-primary/20 flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5" /> Admin
                  </Badge>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground">{formatDate(post.createdAt)}</p>
            </div>
          </div>

          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none">
                <MoreHorizontal className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border">
                <DropdownMenuItem onClick={() => handleTogglePin(post.id)} className="text-sm gap-2">
                  <Pin className="w-3.5 h-3.5" />
                  {post.isPinned ? "Unpin" : "Pin to Top"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(post.id)} className="text-destructive text-sm gap-2">
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>

        <CardContent className="pb-4">
          <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
            {post.isPinned && <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />}
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </CardContent>

        <CardFooter className="pt-0 border-t border-border/50 pt-3 flex items-center justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSave(post.id)}
            className={`gap-1.5 h-8 px-2.5 transition-colors ${
              isSaved
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-primary hover:bg-primary/10"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
            <span className="text-xs font-medium">{isSaved ? "Saved" : "Save"}</span>
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div>
      {/* Admin Create Button + Tabs */}
      <Tabs defaultValue="feed" className="w-full">
        <div className="flex items-center justify-between mb-5">
          <TabsList className="bg-card border border-border p-1">
            <TabsTrigger value="feed" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground text-sm">
              All Posts
            </TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground gap-1.5 text-sm">
              <Bookmark className="w-3.5 h-3.5" /> Saved
            </TabsTrigger>
          </TabsList>

          {isAdmin && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/80 gap-1.5 h-9 px-4 shadow-md">
                <PenLine className="w-4 h-4" />
                New Post
              </DialogTrigger>
              <DialogContent className="bg-card border-border text-foreground max-w-xl">
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
                    <Label className="text-sm font-medium text-foreground">Content</Label>
                    <Textarea
                      value={newPost.content}
                      onChange={(e) => setNewPost((p) => ({ ...p, content: e.target.value }))}
                      className="bg-muted/30 border-border text-foreground mt-1.5 resize-none"
                      placeholder="Write your announcement..."
                      rows={5}
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
            <Card className="bg-card/50 border-border">
              <CardContent className="py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3 border border-border">
                  <MessageSquare className="w-7 h-7 text-muted-foreground/40" />
                </div>
                <p className="text-sm font-medium text-foreground">No posts yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isAdmin ? "Create your first community post." : "Check back later for updates from the team."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="mt-0">
          {savedPosts.size === 0 || posts.filter((p) => savedPosts.has(p.id)).length === 0 ? (
            <Card className="bg-card/50 border-border">
              <CardContent className="py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3 border border-border">
                  <Bookmark className="w-7 h-7 text-muted-foreground/40" />
                </div>
                <p className="text-sm font-medium text-foreground">No saved posts</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Posts you save will appear here for easy access.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {posts
                .filter((p) => savedPosts.has(p.id))
                .map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
