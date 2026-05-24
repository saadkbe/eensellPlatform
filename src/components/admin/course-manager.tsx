"use client";

import { useState, useTransition } from "react";
import { createModule, createLesson, deleteModule, deleteLesson, updateModule, updateLesson, createResource } from "@/actions/module.actions";
import { toast } from "sonner";
import { Plus, Trash2, BookOpen, PlayCircle, ChevronDown, ChevronRight, Eye, EyeOff, FileText, Paperclip, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FileUploader } from "@/components/admin/file-uploader";

type Lesson = { id: string; title: string; description: string | null; videoUrl: string | null; order: number; isPublished: boolean; duration: number | null; isFree: boolean };
type Module = { id: string; title: string; description: string | null; order: number; isPublished: boolean; lessons: Lesson[] };

export function CourseManager({ initialModules }: { initialModules: Module[] }) {
  const [modules, setModules] = useState(initialModules);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const toggleExpand = (id: string) => {
    setExpanded((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const [newModule, setNewModule] = useState({ title: "", description: "", imageUrl: "" });
  const [newLesson, setNewLesson] = useState({ title: "", description: "", videoUrl: "", moduleId: "" });
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [resourceDialogOpen, setResourceDialogOpen] = useState<string | null>(null);
  const [newResource, setNewResource] = useState({ title: "", type: "pdf", fileUrl: "", lessonId: "" });

  const handleCreateModule = () => {
    if (!newModule.title.trim()) return;
    startTransition(async () => {
      try {
        const m = await createModule(newModule);
        setModules((prev) => [...prev, { ...m, lessons: [] }]);
        setNewModule({ title: "", description: "", imageUrl: "" });
        setModuleDialogOpen(false);
        toast.success("Module created");
      } catch { toast.error("Failed to create module"); }
    });
  };

  const handleCreateLesson = () => {
    if (!newLesson.title.trim() || !newLesson.moduleId) return;
    startTransition(async () => {
      try {
        const l = await createLesson({ ...newLesson, duration: 0 });
        setModules((prev) => prev.map((m) => m.id === newLesson.moduleId ? { ...m, lessons: [...m.lessons, l] } : m));
        setNewLesson({ title: "", description: "", videoUrl: "", moduleId: "" });
        setLessonDialogOpen(false);
        toast.success("Lesson created");
      } catch { toast.error("Failed to create lesson"); }
    });
  };

  const handleCreateResource = () => {
    if (!newResource.title.trim() || !newResource.lessonId || !newResource.fileUrl) {
      toast.error("Please provide a title and upload a file.");
      return;
    }
    startTransition(async () => {
      try {
        await createResource({
          title: newResource.title,
          type: newResource.type,
          fileUrl: newResource.fileUrl,
          lessonId: newResource.lessonId,
        });
        setNewResource({ title: "", type: "pdf", fileUrl: "", lessonId: "" });
        setResourceDialogOpen(null);
        toast.success("Resource uploaded and attached to lesson!");
      } catch { toast.error("Failed to create resource"); }
    });
  };

  const handleTogglePublishModule = (moduleId: string, current: boolean) => {
    startTransition(async () => {
      try {
        await updateModule(moduleId, { isPublished: !current });
        setModules((prev) => prev.map((m) => m.id === moduleId ? { ...m, isPublished: !current } : m));
        toast.success(current ? "Module unpublished" : "Module published");
      } catch { toast.error("Failed"); }
    });
  };

  const handleTogglePublishLesson = (lessonId: string, moduleId: string, current: boolean) => {
    startTransition(async () => {
      try {
        await updateLesson(lessonId, { isPublished: !current });
        setModules((prev) => prev.map((m) => m.id === moduleId ? { ...m, lessons: m.lessons.map((l) => l.id === lessonId ? { ...l, isPublished: !current } : l) } : m));
        toast.success(current ? "Lesson unpublished" : "Lesson published");
      } catch { toast.error("Failed"); }
    });
  };

  const handleDeleteModule = (moduleId: string) => {
    startTransition(async () => {
      try {
        await deleteModule(moduleId);
        setModules((prev) => prev.filter((m) => m.id !== moduleId));
        toast.success("Module deleted");
      } catch { toast.error("Failed to delete module"); }
    });
  };

  const handleDeleteLesson = (lessonId: string, moduleId: string) => {
    startTransition(async () => {
      try {
        await deleteLesson(lessonId);
        setModules((prev) => prev.map((m) => m.id === moduleId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m));
        toast.success("Lesson deleted");
      } catch { toast.error("Failed to delete lesson"); }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Course Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">Create and manage modules and lessons.</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={moduleDialogOpen} onOpenChange={setModuleDialogOpen}>
            <DialogTrigger
              render={
                <Button className="gradient-primary text-white hover:opacity-90 text-xs h-9">
                  <Plus className="w-4 h-4 mr-1" /> New Module
                </Button>
              }
            />
            <DialogContent className="bg-card border-border text-foreground max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Create New Module</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">Add a new module with a thumbnail, title, and description.</p>
              </DialogHeader>
              <div className="space-y-5 pt-4">
                {/* Thumbnail section — prominent at the top */}
                <div>
                  <Label className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    Module Thumbnail Cover
                  </Label>
                  {newModule.imageUrl ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border group mt-2">
                      <img src={newModule.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="destructive" size="sm" onClick={() => setNewModule(p => ({ ...p, imageUrl: "" }))}>
                          <Trash2 className="w-4 h-4 mr-2" /> Remove Image
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <FileUploader
                        endpoint="moduleImage"
                        label="Upload module thumbnail"
                        accept="image/*"
                        maxSizeMB={4}
                        onUploadComplete={(url) => setNewModule(p => ({ ...p, imageUrl: url }))}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Module Title</Label>
                    <Input value={newModule.title} onChange={(e) => setNewModule((p) => ({ ...p, title: e.target.value }))}
                      className="bg-background border-border text-foreground mt-1.5 h-11" placeholder="e.g., Introduction to AI Marketing" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-foreground">Description</Label>
                    <Textarea value={newModule.description} onChange={(e) => setNewModule((p) => ({ ...p, description: e.target.value }))}
                      className="bg-background border-border text-foreground mt-1.5" placeholder="Brief description of what this module covers..." rows={3} />
                  </div>
                </div>

                <Button onClick={handleCreateModule} disabled={isPending || !newModule.title.trim()} className="w-full gradient-primary text-white h-11 text-sm font-medium">
                  {isPending ? "Creating..." : "Create Module"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {modules.length === 0 ? (
        <Card className="bg-card/60 border-border">
          <CardContent className="py-16 text-center">
            <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No modules yet. Create your first module to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {modules.map((mod, i) => (
            <Card key={mod.id} className="bg-card/60 border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <button onClick={() => toggleExpand(mod.id)} className="flex items-center gap-3 text-left">
                    {expanded.has(mod.id) ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">M{i + 1}</span>
                        <CardTitle className="text-foreground text-sm font-semibold">{mod.title}</CardTitle>
                        <Badge className={`text-[10px] ${mod.isPublished ? "bg-success/10 text-success border-success/20" : "bg-secondary text-muted-foreground border-primary/20"}`}>
                          {mod.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      {mod.description && <p className="text-xs text-muted-foreground mt-1">{mod.description}</p>}
                    </div>
                  </button>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => handleTogglePublishModule(mod.id, mod.isPublished)} disabled={isPending}>
                      {mod.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[#EF4444] hover:text-[#EF4444] hover:bg-[#EF4444]/10" onClick={() => handleDeleteModule(mod.id)} disabled={isPending}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {expanded.has(mod.id) && (
                <CardContent className="pt-0">
                  <div className="ml-7 space-y-2 border-l border-border pl-4">
                    {mod.lessons.map((les, li) => (
                      <div key={les.id} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                        <div className="flex items-center gap-2 min-w-0">
                          <PlayCircle className="w-4 h-4 text-primary shrink-0" />
                          <span className="text-xs font-mono text-muted-foreground">{li + 1}.</span>
                          <span className="text-xs text-foreground truncate">{les.title}</span>
                          <Badge className={`text-[9px] ${les.isPublished ? "bg-success/10 text-success border-success/20" : "bg-secondary text-muted-foreground border-primary/20"}`}>
                            {les.isPublished ? "Live" : "Draft"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={() => { setResourceDialogOpen(les.id); setNewResource(p => ({ ...p, lessonId: les.id })); }}>
                            <Paperclip className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => handleTogglePublishLesson(les.id, mod.id, les.isPublished)} disabled={isPending}>
                            {les.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-[#EF4444] hover:text-[#EF4444] hover:bg-[#EF4444]/10" onClick={() => handleDeleteLesson(les.id, mod.id)} disabled={isPending}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Dialog open={lessonDialogOpen && newLesson.moduleId === mod.id} onOpenChange={(open) => { setLessonDialogOpen(open); if (open) setNewLesson(p => ({ ...p, moduleId: mod.id })); }}>
                      <DialogTrigger
                        render={
                          <button onClick={() => setNewLesson(p => ({ ...p, moduleId: mod.id }))} className="flex items-center gap-2 p-3 rounded-lg border border-dashed border-border hover:border-primary/30 text-xs text-muted-foreground hover:text-primary transition-all w-full">
                            <Plus className="w-4 h-4" /> Add Lesson
                          </button>
                        }
                      />
                      <DialogContent className="bg-card border-border text-foreground max-w-xl">
                        <DialogHeader>
                          <DialogTitle className="text-lg font-bold">Add Lesson to {mod.title}</DialogTitle>
                          <p className="text-sm text-muted-foreground mt-1">Create a new lesson with video content.</p>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div>
                            <Label className="text-sm font-medium text-foreground">Lesson Title</Label>
                            <Input value={newLesson.title} onChange={(e) => setNewLesson(p => ({ ...p, title: e.target.value }))} className="bg-background border-border text-foreground mt-1.5 h-11" placeholder="e.g., Getting Started with ChatGPT" />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-foreground">Description</Label>
                            <Textarea value={newLesson.description} onChange={(e) => setNewLesson(p => ({ ...p, description: e.target.value }))} className="bg-background border-border text-foreground mt-1.5" placeholder="What will students learn in this lesson?" rows={2} />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-foreground">Vimeo URL</Label>
                            <Input value={newLesson.videoUrl} onChange={(e) => setNewLesson(p => ({ ...p, videoUrl: e.target.value }))} className="bg-background border-border text-foreground mt-1.5 h-11" placeholder="https://player.vimeo.com/video/..." />
                          </div>
                          <Button onClick={handleCreateLesson} disabled={isPending} className="w-full gradient-primary text-white h-11 text-sm font-medium">
                            {isPending ? "Creating..." : "Create Lesson"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Resource Dialog */}
                    <Dialog open={resourceDialogOpen !== null && mod.lessons.some(l => l.id === resourceDialogOpen)} onOpenChange={(open) => { if (!open) setResourceDialogOpen(null); }}>
                      <DialogContent className="bg-card border-border text-foreground max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-lg font-bold">Attach Resource to Lesson</DialogTitle>
                          <p className="text-sm text-muted-foreground mt-1">Upload a file to attach as a downloadable resource.</p>
                        </DialogHeader>
                        <div className="space-y-5 pt-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-foreground">Resource Title</Label>
                              <Input value={newResource.title} onChange={(e) => setNewResource((p) => ({ ...p, title: e.target.value }))}
                                className="bg-background border-border text-foreground mt-1.5 h-11" placeholder="e.g., Action Plan PDF" />
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-foreground">Resource Type</Label>
                              <select
                                value={newResource.type}
                                onChange={(e) => setNewResource(p => ({ ...p, type: e.target.value }))}
                                className="w-full mt-1.5 flex h-11 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <option value="pdf">PDF Document</option>
                                <option value="template">Template</option>
                                <option value="prompt">Prompt</option>
                                <option value="link">Link</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                              <FileText className="w-4 h-4 text-primary" />
                              Upload File
                            </Label>
                            {newResource.fileUrl ? (
                              <div className="flex items-center justify-between p-4 border border-emerald-500/30 bg-emerald-500/5 rounded-xl mt-2">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-emerald-500" />
                                  <span className="text-sm text-emerald-600 font-medium">File uploaded successfully</span>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setNewResource(p => ({ ...p, fileUrl: "" }))} className="text-muted-foreground hover:text-destructive">
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="mt-2">
                                <FileUploader
                                  endpoint="lessonResource"
                                  label="Upload resource file"
                                  maxSizeMB={16}
                                  onUploadComplete={(url) => setNewResource(p => ({ ...p, fileUrl: url }))}
                                />
                              </div>
                            )}
                          </div>
                          <Button onClick={handleCreateResource} disabled={isPending || !newResource.title.trim() || !newResource.fileUrl} className="w-full gradient-primary text-white h-11 text-sm font-medium">
                            {isPending ? "Attaching..." : "Attach Resource"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
