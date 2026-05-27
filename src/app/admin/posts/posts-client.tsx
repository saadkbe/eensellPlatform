"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPost, togglePinPost, deletePost } from "@/actions/community.actions";
import { toast } from "sonner";
import {
  PenLine,
  Plus,
  Pin,
  Trash2,
  Loader2,
  MoreHorizontal,
  Eye,
  MessageSquare,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RichTextEditor, RichTextRenderer } from "@/components/ui/rich-text-editor";

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

export function AdminPostsClient({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewPost, setPreviewPost] = useState<Post | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    startTransition(async () => {
      try {
        const post = await createPost(newPost.title, newPost.content);
        setPosts((prev) => [post, ...prev]);
        setNewPost({ title: "", content: "" });
        setDialogOpen(false);
        toast.success("Post published successfully!");
        router.refresh();
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
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{posts.length}</p>
              <p className="text-xs text-muted-foreground">Total Posts</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Pin className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{posts.filter((p) => p.isPinned).length}</p>
              <p className="text-xs text-muted-foreground">Pinned</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border sm:col-span-2">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {posts.length > 0 ? formatDate(posts[0].createdAt) : "—"}
                </p>
                <p className="text-xs text-muted-foreground">Latest Post</p>
              </div>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium h-9 px-4 gap-2 shadow-md transition-all">
                <Plus className="w-4 h-4" />
                New Post
              </DialogTrigger>
              <DialogContent className="bg-card border-border text-foreground sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold flex items-center gap-2">
                    <PenLine className="w-5 h-5 text-primary" />
                    Create Community Post
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Write an announcement with rich formatting. Add images, videos, and links.
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
                    <Label className="text-sm font-medium text-foreground mb-1.5 block">Content</Label>
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
          </CardContent>
        </Card>
      </div>

      {/* Posts Table */}
      <Card className="bg-card/40 backdrop-blur-xl border-border overflow-hidden shadow-sm">
        <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
          <CardTitle className="text-foreground text-lg font-semibold flex items-center gap-2">
            <PenLine className="w-5 h-5 text-primary" />
            All Posts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 border border-border">
                <MessageSquare className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">No posts yet</p>
              <p className="text-xs text-muted-foreground mt-1">Create your first community post to get started.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {posts.map((post) => {
                const authorName = [post.author.firstName, post.author.lastName].filter(Boolean).join(" ") || "Admin";
                const authorInitial = post.author.firstName?.charAt(0) || "A";

                return (
                  <div key={post.id} className="flex items-center justify-between p-4 sm:p-5 hover:bg-muted/30 transition-colors group">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <Avatar className="h-10 w-10 border border-border bg-muted shrink-0">
                        {post.author.imageUrl && <AvatarImage src={post.author.imageUrl} />}
                        <AvatarFallback className="text-xs font-semibold">{authorInitial}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {post.title}
                          </p>
                          {post.isPinned && <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground">{authorName}</span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => setPreviewPost(post)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
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
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={!!previewPost} onOpenChange={(open) => !open && setPreviewPost(null)}>
        <DialogContent className="bg-card border-border text-foreground sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          {previewPost && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  {previewPost.isPinned && (
                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px]">Pinned</Badge>
                  )}
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px] flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5" /> Admin
                  </Badge>
                </div>
                <DialogTitle className="text-xl font-bold">{previewPost.title}</DialogTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Published {formatDate(previewPost.createdAt)}
                </p>
              </DialogHeader>
              <div className="pt-4 border-t border-border">
                <RichTextRenderer content={previewPost.content} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
