"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FolderOpen,
  Plus,
  Trash2,
  FileText,
  Link2,
  Sparkles,
  LayoutTemplate,
  ExternalLink,
  Search,
  Package,
  Calendar,
  Loader2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { UploadButton } from "@/lib/uploadthing";
import {
  getResources,
  createResource,
  deleteResource,
} from "@/actions/module.actions";

export const dynamic = "force-dynamic";

type Resource = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  fileUrl: string | null;
  lessonId: string | null;
  createdAt: Date;
};

const TYPE_CONFIG: Record<
  string,
  { label: string; icon: typeof FileText; color: string; bg: string }
> = {
  pdf: {
    label: "PDF",
    icon: FileText,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  template: {
    label: "Template",
    icon: LayoutTemplate,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  prompt: {
    label: "Prompt",
    icon: Sparkles,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  link: {
    label: "Link",
    icon: Link2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
};

export default function AdminResourcesPage() {
  const router = useRouter();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  // Create dialog state
  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("pdf");
  const [fileUrl, setFileUrl] = useState("");
  const [isPending, startTransition] = useTransition();

  // Delete dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Resource | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  useEffect(() => {
    loadResources();
  }, []);

  async function loadResources() {
    try {
      const data = await getResources();
      setResources(data);
    } catch {
      toast.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setType("pdf");
    setFileUrl("");
  }

  function handleCreate() {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    startTransition(async () => {
      try {
        await createResource({
          title: title.trim(),
          description: description.trim() || undefined,
          type,
          fileUrl: fileUrl.trim() || undefined,
        });
        toast.success("Resource created successfully");
        setCreateOpen(false);
        resetForm();
        router.refresh();
        await loadResources();
      } catch {
        toast.error("Failed to create resource");
      }
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;

    startDeleteTransition(async () => {
      try {
        await deleteResource(deleteTarget.id);
        toast.success("Resource deleted successfully");
        setDeleteOpen(false);
        setDeleteTarget(null);
        router.refresh();
        await loadResources();
      } catch {
        toast.error("Failed to delete resource");
      }
    });
  }

  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || r.type === filterType;
    return matchesSearch && matchesType;
  });

  const stats = {
    total: resources.length,
    pdf: resources.filter((r) => r.type === "pdf").length,
    template: resources.filter((r) => r.type === "template").length,
    prompt: resources.filter((r) => r.type === "prompt").length,
    link: resources.filter((r) => r.type === "link").length,
  };

  return (
    <div className="space-y-8 pb-8">
      {/* ── Premium Header ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/10 via-background to-background border border-border p-8 sm:p-10 shadow-sm">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium mb-4 border border-emerald-500/20">
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Resource Library</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-2">
              Resources
            </h1>
            <p className="text-muted-foreground text-base max-w-xl">
              Manage PDFs, templates, prompts, and links available to your
              students.
            </p>
          </div>
          <div className="shrink-0">
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Resource
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create New Resource</DialogTitle>
                  <DialogDescription>
                    Add a downloadable resource or link for your students.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-2">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="res-title">Title</Label>
                    <Input
                      id="res-title"
                      placeholder="e.g. ChatGPT Prompt Library"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="res-desc">Description</Label>
                    <Textarea
                      id="res-desc"
                      placeholder="Brief description of this resource..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Type */}
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={type} onValueChange={(val) => val && setType(val)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">
                          <FileText className="w-4 h-4 text-red-500" />
                          PDF Document
                        </SelectItem>
                        <SelectItem value="template">
                          <LayoutTemplate className="w-4 h-4 text-blue-500" />
                          Template
                        </SelectItem>
                        <SelectItem value="prompt">
                          <Sparkles className="w-4 h-4 text-violet-500" />
                          Prompt
                        </SelectItem>
                        <SelectItem value="link">
                          <Link2 className="w-4 h-4 text-emerald-500" />
                          External Link
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* File Upload or URL */}
                  <div className="space-y-2">
                    <Label>
                      {type === "link" ? "URL" : "File Upload"}
                    </Label>
                    {type === "link" ? (
                      <Input
                        placeholder="https://example.com/resource"
                        value={fileUrl}
                        onChange={(e) => setFileUrl(e.target.value)}
                      />
                    ) : (
                      <div className="space-y-3">
                        {fileUrl ? (
                          <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                              <FileText className="w-4 h-4 text-emerald-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                File uploaded successfully
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {fileUrl}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setFileUrl("")}
                              className="text-muted-foreground hover:text-destructive shrink-0"
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <UploadButton
                            endpoint="lessonResource"
                            onClientUploadComplete={(res) => {
                              if (res?.[0]) setFileUrl(res[0].ufsUrl);
                              toast.success("File uploaded!");
                            }}
                            onUploadError={(error: Error) => {
                              toast.error(error.message);
                            }}
                            appearance={{
                              button:
                                "bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium px-4 py-2 rounded-lg",
                              container: "w-full",
                              allowedContent:
                                "text-muted-foreground text-xs",
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCreateOpen(false);
                      resetForm();
                    }}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreate} disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Resource
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          {
            label: "Total",
            value: stats.total,
            icon: Package,
            color: "text-foreground",
            bg: "bg-muted",
          },
          {
            label: "PDFs",
            value: stats.pdf,
            icon: FileText,
            color: "text-red-500",
            bg: "bg-red-500/10",
          },
          {
            label: "Templates",
            value: stats.template,
            icon: LayoutTemplate,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            label: "Prompts",
            value: stats.prompt,
            icon: Sparkles,
            color: "text-violet-500",
            bg: "bg-violet-500/10",
          },
          {
            label: "Links",
            value: stats.link,
            icon: Link2,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="bg-card/40 backdrop-blur-xl border-border hover:border-emerald-500/20 transition-all duration-300 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.02)]"
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Search & Filter Bar ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterType} onValueChange={(val) => val && setFilterType(val)}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="template">Template</SelectItem>
            <SelectItem value="prompt">Prompt</SelectItem>
            <SelectItem value="link">Link</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Resources Table ── */}
      <Card className="bg-card/40 backdrop-blur-xl border-border overflow-hidden shadow-sm">
        <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground text-lg font-semibold flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-emerald-500" />
              All Resources
              <Badge variant="secondary" className="ml-2 text-xs">
                {filteredResources.length}
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                Loading resources...
              </p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 border border-border">
                <FolderOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">
                {searchQuery || filterType !== "all"
                  ? "No resources match your filters"
                  : "No resources yet"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {searchQuery || filterType !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Create your first resource to get started."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[35%]">Title</TableHead>
                  <TableHead className="w-[12%]">Type</TableHead>
                  <TableHead className="hidden md:table-cell w-[30%]">
                    Description
                  </TableHead>
                  <TableHead className="hidden sm:table-cell w-[13%]">
                    Date
                  </TableHead>
                  <TableHead className="w-[10%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.map((resource) => {
                  const typeInfo = TYPE_CONFIG[resource.type] ?? {
                    label: resource.type,
                    icon: FileText,
                    color: "text-muted-foreground",
                    bg: "bg-muted",
                  };
                  const TypeIcon = typeInfo.icon;

                  return (
                    <TableRow
                      key={resource.id}
                      className="group hover:bg-muted/30 transition-colors"
                    >
                      {/* Title */}
                      <TableCell>
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${typeInfo.bg} transition-transform duration-200 group-hover:scale-110`}
                          >
                            <TypeIcon
                              className={`w-4 h-4 ${typeInfo.color}`}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {resource.title}
                            </p>
                            {resource.fileUrl && (
                              <a
                                href={resource.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors mt-0.5"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Open file
                              </a>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Type Badge */}
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 ${typeInfo.bg} ${typeInfo.color} border-none`}
                        >
                          {typeInfo.label}
                        </Badge>
                      </TableCell>

                      {/* Description */}
                      <TableCell className="hidden md:table-cell">
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                          {resource.description || "—"}
                        </p>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(resource.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100"
                          onClick={() => {
                            setDeleteTarget(resource);
                            setDeleteOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ── Delete Confirmation Dialog ── */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Resource</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.title}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteOpen(false);
                setDeleteTarget(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
