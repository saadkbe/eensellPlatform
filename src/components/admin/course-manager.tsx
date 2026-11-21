"use client";

import { useState, useTransition, useMemo } from "react";
import { 
  createModule, createLesson, deleteModule, deleteLesson, 
  updateModule, updateLesson, createResource, deleteResource, 
  reorderModules, reorderLessons 
} from "@/actions/module.actions";
import { toast } from "sonner";
import { 
  Plus, Trash2, BookOpen, PlayCircle, ChevronDown, ChevronRight, 
  Eye, EyeOff, FileText, Paperclip, X, ImageIcon, FileCheck, 
  ArrowUp, ArrowDown, Search, Sparkles, Video, Clock, CheckCircle2, 
  ExternalLink, Layers, Award, Settings, Edit3, MoreVertical, Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { FileUploader } from "@/components/admin/file-uploader";

export type Resource = {
  id: string;
  title: string;
  type: string;
  fileUrl: string | null;
  lessonId: string | null;
};

export type Lesson = {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  order: number;
  isPublished: boolean;
  duration: number | null;
  isFree: boolean;
  requiresHomework: boolean;
  moduleId: string;
  resources?: Resource[];
  _count?: {
    homeworks: number;
    progress: number;
  };
};

export type Module = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  order: number;
  isPublished: boolean;
  lessons: Lesson[];
};

function getVideoProvider(url: string | null) {
  if (!url) return null;
  if (url.includes("youtube.com") || url.includes("youtu.be")) return { name: "YouTube", color: "text-red-400 bg-red-500/10 border-red-500/20" };
  if (url.includes("vimeo.com")) return { name: "Vimeo", color: "text-sky-400 bg-sky-500/10 border-sky-500/20" };
  if (url.includes("loom.com")) return { name: "Loom", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" };
  return { name: "MP4 Video", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
}

export function CourseManager({ initialModules }: { initialModules: Module[] }) {
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(initialModules.map((m) => m.id)));
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  // Dialog states
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [newModule, setNewModule] = useState({ title: "", description: "", imageUrl: "", isPublished: true });

  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonForm, setLessonForm] = useState({
    moduleId: "",
    title: "",
    description: "",
    videoUrl: "",
    duration: 15,
    requiresHomework: false,
    isPublished: true,
  });

  const [resourceDialogOpen, setResourceDialogOpen] = useState<string | null>(null);
  const [newResource, setNewResource] = useState({ title: "", type: "pdf", fileUrl: "", lessonId: "" });

  const [thumbnailDialogOpen, setThumbnailDialogOpen] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  // Filtered modules
  const filteredModules = useMemo(() => {
    return modules.filter((m) => {
      const matchesSearch =
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.lessons.some((l) => l.title.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFilter =
        filter === "all"
          ? true
          : filter === "published"
          ? m.isPublished
          : !m.isPublished;

      return matchesSearch && matchesFilter;
    });
  }, [modules, searchQuery, filter]);

  // Overall Stats
  const stats = useMemo(() => {
    const totalCourses = modules.length;
    const publishedCourses = modules.filter((m) => m.isPublished).length;
    const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
    const publishedLessons = modules.reduce((sum, m) => sum + m.lessons.filter((l) => l.isPublished).length, 0);
    const totalHomeworksRequired = modules.reduce((sum, m) => sum + m.lessons.filter((l) => l.requiresHomework).length, 0);
    return { totalCourses, publishedCourses, totalLessons, publishedLessons, totalHomeworksRequired };
  }, [modules]);

  // ── MODULE ACTIONS ──
  const handleOpenCreateModule = () => {
    setEditingModule(null);
    setNewModule({ title: "", description: "", imageUrl: "", isPublished: true });
    setModuleDialogOpen(true);
  };

  const handleOpenEditModule = (m: Module) => {
    setEditingModule(m);
    setNewModule({
      title: m.title,
      description: m.description || "",
      imageUrl: m.imageUrl || "",
      isPublished: m.isPublished,
    });
    setModuleDialogOpen(true);
  };

  const handleSaveModule = () => {
    if (!newModule.title.trim()) {
      toast.error("Veuillez renseigner un titre de cours.");
      return;
    }

    startTransition(async () => {
      try {
        if (editingModule) {
          await updateModule(editingModule.id, {
            title: newModule.title,
            description: newModule.description,
            imageUrl: newModule.imageUrl,
            isPublished: newModule.isPublished,
          });
          setModules((prev) =>
            prev.map((m) =>
              m.id === editingModule.id
                ? { ...m, ...newModule }
                : m
            )
          );
          toast.success("Cours mis à jour avec succès !");
        } else {
          const created = await createModule(newModule);
          setModules((prev) => [...prev, { ...created, lessons: [] }]);
          setExpanded((prev) => new Set([...prev, created.id]));
          toast.success("Nouveau cours créé avec succès !");
        }
        setModuleDialogOpen(false);
      } catch (e: any) {
        toast.error(e.message || "Erreur lors de l'enregistrement du cours.");
      }
    });
  };

  const handleTogglePublishModule = (moduleId: string, current: boolean) => {
    startTransition(async () => {
      try {
        await updateModule(moduleId, { isPublished: !current });
        setModules((prev) =>
          prev.map((m) => (m.id === moduleId ? { ...m, isPublished: !current } : m))
        );
        toast.success(!current ? "Cours publié en direct !" : "Cours basculé en brouillon.");
      } catch {
        toast.error("Échec de la mise à jour du statut.");
      }
    });
  };

  const handleDeleteModule = (moduleId: string, title: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer définitivement le cours "${title}" ? Toutes ses leçons seront effacées.`)) {
      return;
    }
    startTransition(async () => {
      try {
        await deleteModule(moduleId);
        setModules((prev) => prev.filter((m) => m.id !== moduleId));
        toast.success("Cours supprimé.");
      } catch {
        toast.error("Échec de la suppression du cours.");
      }
    });
  };

  const handleMoveModule = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= modules.length) return;

    const newOrder = [...modules];
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    setModules(newOrder);

    startTransition(async () => {
      try {
        await reorderModules(newOrder.map((m, i) => ({ id: m.id, order: i })));
        toast.success("Ordre des cours mis à jour.");
      } catch {
        toast.error("Erreur lors du réordonnancement.");
      }
    });
  };

  // ── LESSON ACTIONS ──
  const handleOpenAddLesson = (moduleId: string) => {
    setEditingLesson(null);
    setLessonForm({
      moduleId,
      title: "",
      description: "",
      videoUrl: "",
      duration: 15,
      requiresHomework: false,
      isPublished: true,
    });
    setLessonDialogOpen(true);
  };

  const handleOpenEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      moduleId: lesson.moduleId,
      title: lesson.title,
      description: lesson.description || "",
      videoUrl: lesson.videoUrl || "",
      duration: lesson.duration || 15,
      requiresHomework: lesson.requiresHomework,
      isPublished: lesson.isPublished,
    });
    setLessonDialogOpen(true);
  };

  const handleSaveLesson = () => {
    if (!lessonForm.title.trim()) {
      toast.error("Veuillez renseigner le titre de la leçon.");
      return;
    }

    startTransition(async () => {
      try {
        if (editingLesson) {
          const updated = await updateLesson(editingLesson.id, {
            title: lessonForm.title,
            description: lessonForm.description,
            videoUrl: lessonForm.videoUrl,
            duration: Number(lessonForm.duration),
            requiresHomework: lessonForm.requiresHomework,
            isPublished: lessonForm.isPublished,
          });

          setModules((prev) =>
            prev.map((m) =>
              m.id === lessonForm.moduleId
                ? {
                    ...m,
                    lessons: m.lessons.map((l) =>
                      l.id === editingLesson.id ? { ...l, ...updated } : l
                    ),
                  }
                : m
            )
          );
          toast.success("Leçon mise à jour avec succès !");
        } else {
          const created = await createLesson({
            moduleId: lessonForm.moduleId,
            title: lessonForm.title,
            description: lessonForm.description,
            videoUrl: lessonForm.videoUrl,
            duration: Number(lessonForm.duration),
            requiresHomework: lessonForm.requiresHomework,
          });

          // Ensure it respects initial isPublished if set to false
          if (!lessonForm.isPublished) {
            await updateLesson(created.id, { isPublished: false });
          }

          setModules((prev) =>
            prev.map((m) =>
              m.id === lessonForm.moduleId
                ? {
                    ...m,
                    lessons: [...m.lessons, { ...created, isPublished: lessonForm.isPublished, resources: [] }],
                  }
                : m
            )
          );
          toast.success("Nouvelle leçon ajoutée avec succès !");
        }
        setLessonDialogOpen(false);
      } catch (e: any) {
        toast.error(e.message || "Erreur lors de l'enregistrement de la leçon.");
      }
    });
  };

  const handleTogglePublishLesson = (lessonId: string, moduleId: string, current: boolean) => {
    startTransition(async () => {
      try {
        await updateLesson(lessonId, { isPublished: !current });
        setModules((prev) =>
          prev.map((m) =>
            m.id === moduleId
              ? {
                  ...m,
                  lessons: m.lessons.map((l) =>
                    l.id === lessonId ? { ...l, isPublished: !current } : l
                  ),
                }
              : m
          )
        );
        toast.success(!current ? "Leçon publiée !" : "Leçon dépubliée.");
      } catch {
        toast.error("Erreur de statut.");
      }
    });
  };

  const handleToggleHomework = (lessonId: string, moduleId: string, current: boolean) => {
    startTransition(async () => {
      try {
        await updateLesson(lessonId, { requiresHomework: !current });
        setModules((prev) =>
          prev.map((m) =>
            m.id === moduleId
              ? {
                  ...m,
                  lessons: m.lessons.map((l) =>
                    l.id === lessonId ? { ...l, requiresHomework: !current } : l
                  ),
                }
              : m
          )
        );
        toast.success(!current ? "Validation de devoir activée pour cette leçon !" : "Exigence de devoir désactivée.");
      } catch {
        toast.error("Erreur lors de la modification de l'exigence devoir.");
      }
    });
  };

  const handleDeleteLesson = (lessonId: string, moduleId: string, title: string) => {
    if (!confirm(`Supprimer la leçon "${title}" ?`)) return;
    startTransition(async () => {
      try {
        await deleteLesson(lessonId);
        setModules((prev) =>
          prev.map((m) =>
            m.id === moduleId
              ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
              : m
          )
        );
        toast.success("Leçon supprimée.");
      } catch {
        toast.error("Erreur lors de la suppression.");
      }
    });
  };

  const handleMoveLesson = (moduleId: string, lessonIndex: number, direction: "up" | "down") => {
    const course = modules.find((m) => m.id === moduleId);
    if (!course) return;

    const targetIndex = direction === "up" ? lessonIndex - 1 : lessonIndex + 1;
    if (targetIndex < 0 || targetIndex >= course.lessons.length) return;

    const newLessons = [...course.lessons];
    const temp = newLessons[lessonIndex];
    newLessons[lessonIndex] = newLessons[targetIndex];
    newLessons[targetIndex] = temp;

    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, lessons: newLessons } : m))
    );

    startTransition(async () => {
      try {
        await reorderLessons(newLessons.map((l, i) => ({ id: l.id, order: i })));
        toast.success("Ordre des leçons mis à jour.");
      } catch {
        toast.error("Erreur lors du réordonnancement.");
      }
    });
  };

  // ── RESOURCE ACTIONS ──
  const handleOpenAddResource = (lessonId: string) => {
    setNewResource({ title: "", type: "pdf", fileUrl: "", lessonId });
    setResourceDialogOpen(lessonId);
  };

  const handleSaveResource = () => {
    if (!newResource.title.trim() || !newResource.fileUrl) {
      toast.error("Veuillez renseigner un titre et un lien de fichier.");
      return;
    }

    startTransition(async () => {
      try {
        const created = await createResource({
          title: newResource.title,
          type: newResource.type,
          fileUrl: newResource.fileUrl,
          lessonId: newResource.lessonId,
        });

        setModules((prev) =>
          prev.map((m) => ({
            ...m,
            lessons: m.lessons.map((l) =>
              l.id === newResource.lessonId
                ? { ...l, resources: [...(l.resources || []), created] }
                : l
            ),
          }))
        );

        toast.success("Ressource attachée avec succès !");
        setResourceDialogOpen(null);
      } catch {
        toast.error("Erreur lors de l'ajout de la ressource.");
      }
    });
  };

  const handleDeleteResource = (resourceId: string, lessonId: string) => {
    startTransition(async () => {
      try {
        await deleteResource(resourceId);
        setModules((prev) =>
          prev.map((m) => ({
            ...m,
            lessons: m.lessons.map((l) =>
              l.id === lessonId
                ? { ...l, resources: (l.resources || []).filter((r) => r.id !== resourceId) }
                : l
            ),
          }))
        );
        toast.success("Ressource supprimée.");
      } catch {
        toast.error("Erreur lors de la suppression de la ressource.");
      }
    });
  };

  // ── THUMBNAIL ACTIONS ──
  const handleSaveThumbnail = (moduleId: string) => {
    if (!thumbnailUrl.trim()) return;
    startTransition(async () => {
      try {
        await updateModule(moduleId, { imageUrl: thumbnailUrl });
        setModules((prev) =>
          prev.map((m) => (m.id === moduleId ? { ...m, imageUrl: thumbnailUrl } : m))
        );
        toast.success("Miniature mise à jour !");
        setThumbnailDialogOpen(null);
        setThumbnailUrl("");
      } catch {
        toast.error("Erreur lors du changement d'image.");
      }
    });
  };

  return (
    <div className="space-y-8 pb-16 text-slate-100">
      {/* ── TOP HERO & KPI STATS ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/[0.08] pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Curriculum Manager & Studio
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
            Gestion des Cours & Vidéos
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Gérez vos formations vidéo, organisez vos leçons, configurez les devoirs à valider et publiez de nouveaux modules en temps réel.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            onClick={handleOpenCreateModule}
            className="h-11 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs gap-2 shadow-xl shadow-emerald-500/20 transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Nouveau Cours</span>
          </Button>
        </div>
      </div>

      {/* ── KPI STATS CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0F111A] border border-white/[0.06] shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Formations</span>
          </div>
          <p className="text-2xl font-black text-white">{stats.totalCourses}</p>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1">
            {stats.publishedCourses} en ligne • {stats.totalCourses - stats.publishedCourses} brouillons
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F111A] border border-white/[0.06] shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Video className="w-4 h-4 text-sky-400" />
            <span>Leçons Vidéo</span>
          </div>
          <p className="text-2xl font-black text-white">{stats.totalLessons}</p>
          <p className="text-[11px] text-sky-400 font-semibold mt-1">
            {stats.publishedLessons} publiées
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F111A] border border-white/[0.06] shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FileCheck className="w-4 h-4 text-purple-400" />
            <span>Devoirs Exigés</span>
          </div>
          <p className="text-2xl font-black text-white">{stats.totalHomeworksRequired}</p>
          <p className="text-[11px] text-purple-400 font-semibold mt-1">
            Validations manuelles
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F111A] border border-white/[0.06] shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Synchronisation</span>
          </div>
          <p className="text-lg font-black text-emerald-400 mt-1">100% Synchro</p>
          <p className="text-[11px] text-slate-400 font-semibold">
            Tableau de bord étudiants
          </p>
        </div>
      </div>

      {/* ── SEARCH & FILTERS BAR ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-[#0F111A] p-1.5 rounded-2xl border border-white/[0.08]">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all",
              filter === "all"
                ? "bg-white/10 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            )}
          >
            Tous les cours ({stats.totalCourses})
          </button>
          <button
            onClick={() => setFilter("published")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all",
              filter === "published"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm"
                : "text-slate-400 hover:text-white"
            )}
          >
            En ligne ({stats.publishedCourses})
          </button>
          <button
            onClick={() => setFilter("draft")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all",
              filter === "draft"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-sm"
                : "text-slate-400 hover:text-white"
            )}
          >
            Brouillons ({stats.totalCourses - stats.publishedCourses})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Rechercher par titre de cours ou leçon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 bg-[#0F111A] border-white/[0.08] text-white rounded-xl text-xs placeholder:text-slate-500 focus-visible:ring-emerald-500/50"
          />
        </div>
      </div>

      {/* ── COURSE LIST ACCORDION ── */}
      <div className="space-y-5">
        {filteredModules.map((module, moduleIdx) => {
          const isExpanded = expanded.has(module.id);
          const courseCode = `M${moduleIdx + 1}`;
          const homeworkCount = module.lessons.filter((l) => l.requiresHomework).length;
          const totalDurationMin = module.lessons.reduce((sum, l) => sum + (l.duration || 0), 0);

          return (
            <div
              key={module.id}
              className="rounded-3xl bg-[#0B0D14] border border-white/[0.08] overflow-hidden shadow-xl transition-all"
            >
              {/* Course Header Row */}
              <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-gradient-to-r from-white/[0.02] to-transparent">
                
                {/* Left: Thumbnail + Title + Meta */}
                <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                  {/* Thumbnail */}
                  <div
                    onClick={() => {
                      setThumbnailDialogOpen(module.id);
                      setThumbnailUrl(module.imageUrl || "");
                    }}
                    className="relative w-20 h-14 sm:w-28 sm:h-16 rounded-2xl overflow-hidden bg-black/60 border border-white/10 shrink-0 cursor-pointer group/thumb shadow-md"
                    title="Cliquer pour changer la miniature"
                  >
                    {module.imageUrl ? (
                      <img
                        src={module.imageUrl}
                        alt={module.title}
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity text-[10px] font-bold text-white uppercase tracking-wider">
                      Modifier
                    </div>
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider">
                        {courseCode}
                      </span>

                      <h2 className="text-base sm:text-lg font-black text-white truncate">
                        {module.title}
                      </h2>

                      {/* Status Badge */}
                      {module.isPublished ? (
                        <Badge className="bg-emerald-500/15 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                          En Ligne
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500/15 hover:bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px] font-bold">
                          Brouillon (Dropping Soon)
                        </Badge>
                      )}
                    </div>

                    {module.description && (
                      <p className="text-xs text-slate-400 line-clamp-1 max-w-2xl font-normal">
                        {module.description}
                      </p>
                    )}

                    {/* Stats pills */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-semibold pt-1">
                      <span className="flex items-center gap-1">
                        <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
                        {module.lessons.length} {module.lessons.length > 1 ? "leçons" : "leçon"}
                      </span>
                      {totalDurationMin > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-sky-400" />
                          ≈ {totalDurationMin} min
                        </span>
                      )}
                      {homeworkCount > 0 && (
                        <span className="flex items-center gap-1 text-purple-400">
                          <FileCheck className="w-3.5 h-3.5" />
                          {homeworkCount} devoir(s) requis
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Quick Controls & Toggle */}
                <div className="flex items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/5">
                  {/* Order Up/Down */}
                  <div className="flex items-center bg-white/[0.04] rounded-xl border border-white/10 p-0.5">
                    <button
                      onClick={() => handleMoveModule(moduleIdx, "up")}
                      disabled={moduleIdx === 0 || isPending}
                      className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Monter"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveModule(moduleIdx, "down")}
                      disabled={moduleIdx === modules.length - 1 || isPending}
                      className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Descendre"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Live Publish Toggle */}
                  <div className="flex items-center gap-2 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/10">
                    <span className="text-[11px] font-bold text-slate-300">
                      {module.isPublished ? "Actif" : "Masqué"}
                    </span>
                    <Switch
                      checked={module.isPublished}
                      onCheckedChange={() => handleTogglePublishModule(module.id, module.isPublished)}
                      disabled={isPending}
                    />
                  </div>

                  {/* Add Lesson Button */}
                  <Button
                    size="sm"
                    onClick={() => handleOpenAddLesson(module.id)}
                    className="h-9 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 font-bold text-xs gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter Leçon</span>
                  </Button>

                  {/* Menu Settings */}
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-slate-300"
                        />
                      }
                    >
                      <MoreVertical className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-[#0D0E15] border-white/10 text-slate-200 rounded-2xl p-1.5 shadow-2xl"
                    >
                      <DropdownMenuItem
                        onClick={() => handleOpenEditModule(module)}
                        className="rounded-xl text-xs font-semibold cursor-pointer py-2"
                      >
                        <Edit3 className="w-3.5 h-3.5 mr-2 text-slate-400" />
                        Modifier les infos du cours
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setThumbnailDialogOpen(module.id);
                          setThumbnailUrl(module.imageUrl || "");
                        }}
                        className="rounded-xl text-xs font-semibold cursor-pointer py-2"
                      >
                        <ImageIcon className="w-3.5 h-3.5 mr-2 text-slate-400" />
                        Changer la miniature
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteModule(module.id, module.title)}
                        className="rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer py-2"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-2 text-rose-400" />
                        Supprimer ce cours
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Expand / Collapse Button */}
                  <button
                    onClick={() => toggleExpand(module.id)}
                    className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
                    title={isExpanded ? "Replier" : "Déplier les leçons"}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* ── EXPANDED LESSONS CONTAINER ── */}
              {isExpanded && (
                <div className="border-t border-white/[0.06] bg-black/40 p-4 sm:p-6 space-y-3">
                  {module.lessons.length === 0 ? (
                    <div className="py-10 text-center rounded-2xl border border-dashed border-white/10 p-6 bg-white/[0.01]">
                      <PlayCircle className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                      <p className="text-sm font-bold text-white">Ce cours n'a pas encore de leçons</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        Ajoutez votre première vidéo de formation ou blueprint pour activer ce cours pour les étudiants.
                      </p>
                      <Button
                        size="sm"
                        onClick={() => handleOpenAddLesson(module.id)}
                        className="mt-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Ajouter une première leçon
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {module.lessons.map((lesson, lessonIdx) => {
                        const videoProvider = getVideoProvider(lesson.videoUrl);

                        return (
                          <div
                            key={lesson.id}
                            className="flex flex-col md:flex-row md:items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-[#11131E] border border-white/[0.06] hover:border-emerald-500/20 transition-all gap-3.5 group/lesson"
                          >
                            {/* Left: Order, Play Icon & Title */}
                            <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                              {/* Order Pill */}
                              <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[11px] font-black text-slate-400 shrink-0">
                                {lessonIdx + 1}
                              </span>

                              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                                <PlayCircle className="w-4 h-4" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                                    {lesson.title}
                                  </h3>

                                  {/* Video Provider Badge */}
                                  {videoProvider && (
                                    <span
                                      className={cn(
                                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border",
                                        videoProvider.color
                                      )}
                                    >
                                      <Video className="w-2.5 h-2.5" />
                                      {videoProvider.name}
                                    </span>
                                  )}

                                  {/* Homework Badge */}
                                  {lesson.requiresHomework && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-purple-500/15 text-purple-300 border border-purple-500/30">
                                      <FileCheck className="w-2.5 h-2.5" />
                                      Devoir Requis
                                    </span>
                                  )}

                                  {/* Duration */}
                                  {lesson.duration ? (
                                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-slate-500" />
                                      {lesson.duration} min
                                    </span>
                                  ) : null}
                                </div>

                                {/* Resources attached */}
                                {lesson.resources && lesson.resources.length > 0 && (
                                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                    {lesson.resources.map((r) => (
                                      <span
                                        key={r.id}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.04] text-[10px] text-slate-300 border border-white/[0.08]"
                                      >
                                        <Paperclip className="w-2.5 h-2.5 text-emerald-400" />
                                        {r.title}
                                        <button
                                          onClick={() => handleDeleteResource(r.id, lesson.id)}
                                          className="hover:text-rose-400 ml-0.5"
                                          title="Supprimer la ressource"
                                        >
                                          ×
                                        </button>
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Right: Actions */}
                            <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                              {/* Order Arrows */}
                              <div className="flex items-center bg-white/[0.03] rounded-lg border border-white/10 p-0.5">
                                <button
                                  onClick={() => handleMoveLesson(module.id, lessonIdx, "up")}
                                  disabled={lessonIdx === 0 || isPending}
                                  className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white disabled:opacity-30"
                                  title="Monter"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleMoveLesson(module.id, lessonIdx, "down")}
                                  disabled={lessonIdx === module.lessons.length - 1 || isPending}
                                  className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white disabled:opacity-30"
                                  title="Descendre"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Toggle Homework Switch */}
                              <button
                                onClick={() => handleToggleHomework(lesson.id, module.id, lesson.requiresHomework)}
                                className={cn(
                                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer",
                                  lesson.requiresHomework
                                    ? "bg-purple-500/15 text-purple-300 border-purple-500/30 hover:bg-purple-500/25"
                                    : "bg-white/[0.03] text-slate-400 border-white/10 hover:text-white"
                                )}
                                title="Activer/Désactiver l'obligation de soumettre un devoir"
                              >
                                <FileCheck className="w-3 h-3" />
                                <span>{lesson.requiresHomework ? "Devoir ON" : "+ Devoir"}</span>
                              </button>

                              {/* Add Resource */}
                              <button
                                onClick={() => handleOpenAddResource(lesson.id)}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/10 text-[11px] text-slate-300 font-semibold transition-colors"
                                title="Attacher un document (PDF, Blueprint JSON, etc.)"
                              >
                                <Paperclip className="w-3 h-3 text-emerald-400" />
                                <span>Fichier</span>
                              </button>

                              {/* Publish Switch */}
                              <button
                                onClick={() => handleTogglePublishLesson(lesson.id, module.id, lesson.isPublished)}
                                className={cn(
                                  "p-1.5 rounded-lg border transition-colors",
                                  lesson.isPublished
                                    ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25"
                                    : "bg-white/5 border-white/10 text-slate-500 hover:text-white"
                                )}
                                title={lesson.isPublished ? "Leçon en ligne" : "Leçon masquée"}
                              >
                                {lesson.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              </button>

                              {/* Edit Button */}
                              <button
                                onClick={() => handleOpenEditLesson(lesson)}
                                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
                                title="Modifier la leçon"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteLesson(lesson.id, module.id, lesson.title)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition-colors"
                                title="Supprimer la leçon"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── 1. MODAL: CREATE / EDIT COURSE ── */}
      <Dialog open={moduleDialogOpen} onOpenChange={setModuleDialogOpen}>
        <DialogContent
          showCloseButton={true}
          className="w-full max-w-lg p-0 overflow-hidden bg-[#0A0B10] text-white border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.9)] rounded-3xl"
        >
          <div className="relative p-6 sm:p-7 border-b border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <DialogTitle className="text-lg font-black text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <span>{editingModule ? "Modifier le Cours" : "Créer un Nouveau Cours"}</span>
            </DialogTitle>
            <p className="text-xs text-slate-400 mt-1">
              Ce cours sera accessible dans le catalogue de formation des étudiants.
            </p>
          </div>

          <div className="p-6 sm:p-7 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                Titre du Cours *
              </label>
              <Input
                placeholder="ex. AI Client Acquisition & Outreach"
                value={newModule.title}
                onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                className="bg-white/[0.04] border-white/10 text-white rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                Description / Objectifs
              </label>
              <Textarea
                placeholder="Décrivez ce que les étudiants vont apprendre dans ce cours..."
                value={newModule.description}
                onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                rows={3}
                className="bg-white/[0.04] border-white/10 text-white rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                Image de Couverture (Miniature)
              </label>
              <Input
                placeholder="ex. /modules/mod9_client.png ou lien image..."
                value={newModule.imageUrl}
                onChange={(e) => setNewModule({ ...newModule, imageUrl: e.target.value })}
                className="bg-white/[0.04] border-white/10 text-white rounded-xl text-sm mb-2"
              />
              <FileUploader
                endpoint="moduleImage"
                label="Ou téléverser une image (16:9)"
                onUploadComplete={(url) => setNewModule({ ...newModule, imageUrl: url })}
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
              <div>
                <p className="text-xs font-bold text-white">Publier immédiatement</p>
                <p className="text-[11px] text-slate-400">Si désactivé, le cours affichera le badge "Dropping Soon".</p>
              </div>
              <Switch
                checked={newModule.isPublished}
                onCheckedChange={(checked) => setNewModule({ ...newModule, isPublished: checked })}
              />
            </div>

            <div className="flex items-center gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModuleDialogOpen(false)}
                className="flex-1 rounded-2xl border-white/10 text-slate-300 hover:bg-white/5"
              >
                Annuler
              </Button>
              <Button
                type="button"
                onClick={handleSaveModule}
                disabled={isPending}
                className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black"
              >
                {isPending ? "Enregistrement..." : editingModule ? "Mettre à jour" : "Créer le Cours"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── 2. MODAL: ADD / EDIT LESSON ── */}
      <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
        <DialogContent
          showCloseButton={true}
          className="w-full max-w-lg p-0 overflow-hidden bg-[#0A0B10] text-white border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.9)] rounded-3xl"
        >
          <div className="relative p-6 sm:p-7 border-b border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <DialogTitle className="text-lg font-black text-white flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-emerald-400" />
              <span>{editingLesson ? "Modifier la Leçon" : "Ajouter une Leçon Vidéo"}</span>
            </DialogTitle>
            <p className="text-xs text-slate-400 mt-1">
              Configurez le titre, la vidéo de la leçon et l'obligation de devoir.
            </p>
          </div>

          <div className="p-6 sm:p-7 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                Titre de la Leçon *
              </label>
              <Input
                placeholder="ex. Créer son Premier Workflow Make.com"
                value={lessonForm.title}
                onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                className="bg-white/[0.04] border-white/10 text-white rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                Lien de la Vidéo (YouTube, Vimeo, Loom ou direct MP4)
              </label>
              <Input
                placeholder="https://www.youtube.com/watch?v=... ou https://www.loom.com/share/..."
                value={lessonForm.videoUrl}
                onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                className="bg-white/[0.04] border-white/10 text-white rounded-xl text-sm"
              />
              {lessonForm.videoUrl && (
                <div className="mt-1.5 flex items-center gap-2">
                  {getVideoProvider(lessonForm.videoUrl) ? (
                    <Badge className={getVideoProvider(lessonForm.videoUrl)!.color}>
                      Détecté : {getVideoProvider(lessonForm.videoUrl)!.name}
                    </Badge>
                  ) : null}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                Durée Estimée (en minutes)
              </label>
              <Input
                type="number"
                min={1}
                placeholder="15"
                value={lessonForm.duration}
                onChange={(e) => setLessonForm({ ...lessonForm, duration: parseInt(e.target.value) || 0 })}
                className="bg-white/[0.04] border-white/10 text-white rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                Description / Notes de la Leçon
              </label>
              <Textarea
                placeholder="Explications, instructions ou consignes pour cette leçon..."
                value={lessonForm.description}
                onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                rows={2}
                className="bg-white/[0.04] border-white/10 text-white rounded-xl text-sm"
              />
            </div>

            {/* Homework Requirement Switch */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-500/[0.08] border border-purple-500/25">
              <div>
                <p className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5" />
                  Exiger la soumission d'un Devoir
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  L'étudiant doit téléverser un fichier PDF pour que vous le validiez avant qu'il reçoive ses points XP.
                </p>
              </div>
              <Switch
                checked={lessonForm.requiresHomework}
                onCheckedChange={(checked) => setLessonForm({ ...lessonForm, requiresHomework: checked })}
              />
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
              <div>
                <p className="text-xs font-bold text-white">Publier immédiatement</p>
                <p className="text-[11px] text-slate-400">Rendre visible aux étudiants dès l'enregistrement.</p>
              </div>
              <Switch
                checked={lessonForm.isPublished}
                onCheckedChange={(checked) => setLessonForm({ ...lessonForm, isPublished: checked })}
              />
            </div>

            <div className="flex items-center gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLessonDialogOpen(false)}
                className="flex-1 rounded-2xl border-white/10 text-slate-300 hover:bg-white/5"
              >
                Annuler
              </Button>
              <Button
                type="button"
                onClick={handleSaveLesson}
                disabled={isPending}
                className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black"
              >
                {isPending ? "Enregistrement..." : editingLesson ? "Mettre à jour" : "Ajouter la Leçon"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── 3. MODAL: ATTACH RESOURCE ── */}
      <Dialog open={!!resourceDialogOpen} onOpenChange={(open) => !open && setResourceDialogOpen(null)}>
        <DialogContent
          showCloseButton={true}
          className="w-full max-w-md p-0 overflow-hidden bg-[#0A0B10] text-white border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.9)] rounded-3xl"
        >
          <div className="relative p-6 border-b border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent">
            <DialogTitle className="text-base font-black text-white flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-emerald-400" />
              <span>Attacher un Document / Ressource</span>
            </DialogTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Téléversez un Blueprint Make.com (.json), un template PDF ou un fichier Excel.
            </p>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                Titre de la Ressource *
              </label>
              <Input
                placeholder="ex. Blueprint Make.com - Scraping WhatsApp (.json)"
                value={newResource.title}
                onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                className="bg-white/[0.04] border-white/10 text-white rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                Type de Fichier
              </label>
              <select
                value={newResource.type}
                onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                className="w-full h-10 px-3 bg-[#11131E] border border-white/10 rounded-xl text-xs text-white"
              >
                <option value="pdf">Document PDF (.pdf)</option>
                <option value="json">Blueprint JSON (.json)</option>
                <option value="sheet">Feuille de calcul (.xlsx, .csv)</option>
                <option value="link">Lien externe / Outil</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                Fichier ou URL du Fichier *
              </label>
              <Input
                placeholder="URL directe du document..."
                value={newResource.fileUrl}
                onChange={(e) => setNewResource({ ...newResource, fileUrl: e.target.value })}
                className="bg-white/[0.04] border-white/10 text-white rounded-xl text-sm mb-2"
              />
              <FileUploader
                endpoint="lessonResource"
                label="Téléverser le fichier"
                onUploadComplete={(url) => setNewResource({ ...newResource, fileUrl: url })}
              />
            </div>

            <div className="flex items-center gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setResourceDialogOpen(null)}
                className="flex-1 rounded-2xl border-white/10 text-slate-300 hover:bg-white/5"
              >
                Annuler
              </Button>
              <Button
                type="button"
                onClick={handleSaveResource}
                disabled={isPending}
                className="flex-1 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs"
              >
                {isPending ? "Attachement..." : "Attacher le Fichier"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── 4. MODAL: CHANGE THUMBNAIL ── */}
      <Dialog open={!!thumbnailDialogOpen} onOpenChange={(open) => !open && setThumbnailDialogOpen(null)}>
        <DialogContent
          showCloseButton={true}
          className="w-full max-w-md p-0 overflow-hidden bg-[#0A0B10] text-white border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.9)] rounded-3xl"
        >
          <div className="relative p-6 border-b border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent">
            <DialogTitle className="text-base font-black text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              <span>Changer la Miniature du Cours</span>
            </DialogTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Téléversez une image 16:9 au format PNG ou JPG.
            </p>
          </div>

          <div className="p-6 space-y-4">
            {thumbnailUrl && (
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black/60 border border-white/10">
                <img src={thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                URL de l'image
              </label>
              <Input
                placeholder="ex. /modules/mod1_foundations.png..."
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                className="bg-white/[0.04] border-white/10 text-white rounded-xl text-sm mb-2"
              />
              <FileUploader
                endpoint="moduleImage"
                label="Ou téléverser depuis l'ordinateur"
                onUploadComplete={(url) => setThumbnailUrl(url)}
              />
            </div>

            <div className="flex items-center gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setThumbnailDialogOpen(null)}
                className="flex-1 rounded-2xl border-white/10 text-slate-300 hover:bg-white/5"
              >
                Annuler
              </Button>
              <Button
                type="button"
                onClick={() => thumbnailDialogOpen && handleSaveThumbnail(thumbnailDialogOpen)}
                disabled={isPending}
                className="flex-1 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs"
              >
                Enregistrer la Miniature
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
