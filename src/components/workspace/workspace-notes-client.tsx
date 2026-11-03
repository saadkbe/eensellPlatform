"use client";

import { useState, useRef } from "react";
import {
  StickyNote,
  Plus,
  Trash2,
  Search,
  Pin,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Tag,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { DeleteConfirmationModal } from "@/components/workspace/delete-confirmation-modal";
import {
  saveNoteAction,
  deleteNoteAction,
  updateNoteAction,
  resetDefaultPlaybooksAction,
} from "@/actions/workspace.actions";

export interface WorkspaceNoteItem {
  id: string;
  title: string;
  category: "Client Discovery" | "Objection Handling" | "Outreach Strategy" | "Daily Tasks" | "Ideas";
  content: string;
  pinned: boolean;
  updatedAt: string;
}

interface WorkspaceNotesClientProps {
  initialNotes?: any[];
}

export function WorkspaceNotesClient({ initialNotes = [] }: WorkspaceNotesClientProps) {
  // Only user notes from database (pure DB persistence, no zombie static presets)
  const mappedNotes: WorkspaceNoteItem[] = initialNotes.map((dbNote: any) => ({
    id: dbNote.id,
    title: dbNote.title,
    category: (dbNote.category || "Ideas") as WorkspaceNoteItem["category"],
    content: dbNote.content,
    pinned: dbNote.pinned || false,
    updatedAt: new Date(dbNote.updatedAt || dbNote.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  const [notes, setNotes] = useState<WorkspaceNoteItem[]>(mappedNotes);
  const [selectedNoteId, setSelectedNoteId] = useState<string>(
    mappedNotes[0]?.id || ""
  );
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Deletion modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<WorkspaceNoteItem | null>(null);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || (notes.length > 0 ? notes[0] : null);

  const categories = [
    "ALL",
    "Client Discovery",
    "Objection Handling",
    "Outreach Strategy",
    "Daily Tasks",
    "Ideas",
  ];

  // Sort: Pinned first, then by creation
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned === b.pinned) return 0;
    return a.pinned ? -1 : 1;
  });

  const filteredNotes = sortedNotes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === "ALL" || n.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  // Debounced auto-save directly to Database
  const persistNoteChange = (updatedNote: WorkspaceNoteItem) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    setIsSaving(true);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await updateNoteAction({
          id: updatedNote.id,
          title: updatedNote.title,
          content: updatedNote.content,
          category: updatedNote.category,
          pinned: updatedNote.pinned,
        });
      } catch (err) {
        console.error("Auto-save failed:", err);
      } finally {
        setIsSaving(false);
      }
    }, 600);
  };

  const handleTogglePin = (noteToToggle: WorkspaceNoteItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const nextPinned = !noteToToggle.pinned;
    const updated: WorkspaceNoteItem = { ...noteToToggle, pinned: nextPinned };

    setNotes((prev) =>
      prev.map((n) => (n.id === updated.id ? updated : n))
    );
    persistNoteChange(updated);
    toast.success(nextPinned ? `Note pinned to top` : `Note unpinned`);
  };

  const handleCreateNote = async () => {
    try {
      setIsSaving(true);
      const res = await saveNoteAction({
        title: "Untitled Note",
        content: "",
        category: "Ideas",
        pinned: false,
      });

      if (res.success && res.note) {
        const newNote: WorkspaceNoteItem = {
          id: res.note.id,
          title: res.note.title || "Untitled Note",
          category: (res.note.category as any) || "Ideas",
          pinned: false,
          updatedAt: "Just now",
          content: res.note.content || "",
        };

        setNotes((prev) => [newNote, ...prev]);
        setSelectedNoteId(newNote.id);
        toast.success("New note created & saved");
      }
    } catch {
      toast.error("Failed to create note");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetPlaybooks = async () => {
    try {
      setIsResetting(true);
      await resetDefaultPlaybooksAction();
      window.location.reload();
    } catch {
      toast.error("Failed to load starter playbooks");
      setIsResetting(false);
    }
  };

  const requestDelete = (note: WorkspaceNoteItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNoteToDelete(note);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!noteToDelete) return;
    const targetId = noteToDelete.id;

    // Optimistically remove from state
    const nextNotes = notes.filter((n) => n.id !== targetId);
    setNotes(nextNotes);

    if (selectedNoteId === targetId) {
      setSelectedNoteId(nextNotes[0]?.id || "");
    }

    toast.success("Note deleted successfully");

    try {
      await deleteNoteAction(targetId);
    } catch (err) {
      console.error("Failed to delete note from database:", err);
      toast.error("Could not remove note from database");
    }
  };

  const handleCopyContent = () => {
    if (!selectedNote) return;
    navigator.clipboard.writeText(selectedNote.content);
    setCopied(true);
    toast.success("Note content copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 select-text max-w-7xl mx-auto">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Workspace</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-semibold">Notes & Playbooks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <span>Notes & Agency Playbooks</span>
            {isSaving && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-white/5 px-2.5 py-0.5 rounded-full">
                <Loader2 className="w-3 h-3 animate-spin text-slate-500" />
                <span>Saving...</span>
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Keep objection scripts, client meeting debriefs, and outreach notes synced in one place.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {notes.length === 0 && (
            <Button
              onClick={handleResetPlaybooks}
              disabled={isResetting}
              variant="outline"
              size="sm"
              className="h-9 px-3.5 rounded-xl border-slate-200 dark:border-white/10 text-xs font-semibold gap-1.5 text-slate-700 dark:text-slate-300"
            >
              {isResetting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
              <span>Load Starter Playbooks</span>
            </Button>
          )}

          <Button
            onClick={handleCreateNote}
            size="sm"
            className="h-9 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Note</span>
          </Button>
        </div>
      </div>

      {/* ── Main Two-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Note List & Filters (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search notes, playbooks, objections..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1C1C1E] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/20 transition-all"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`text-[11px] px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200/80 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Note cards */}
          <div className="space-y-2 max-h-[640px] overflow-y-auto no-scrollbar pr-0.5">
            {filteredNotes.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-white/10 text-xs text-slate-400 space-y-2">
                <p>No notes in this view.</p>
                <button
                  onClick={handleCreateNote}
                  className="text-xs font-semibold text-slate-900 dark:text-white underline cursor-pointer"
                >
                  Create your first note
                </button>
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isSelected = selectedNote?.id === note.id;

                return (
                  <motion.div
                    key={note.id}
                    layout
                    onClick={() => setSelectedNoteId(note.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all relative group ${
                      isSelected
                        ? "bg-white dark:bg-[#1C1C1E] border-slate-900 dark:border-white ring-1 ring-slate-900 dark:ring-white shadow-sm"
                        : "bg-white/70 hover:bg-white dark:bg-white/5 dark:hover:bg-white/8 border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {/* Interactive Clickable Pin Button directly on note card */}
                        <button
                          type="button"
                          onClick={(e) => handleTogglePin(note, e)}
                          title={note.pinned ? "Click to unpin" : "Click to pin to top"}
                          className={`p-1 rounded-md transition-all cursor-pointer shrink-0 ${
                            note.pinned
                              ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100"
                              : "text-slate-300 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
                          }`}
                        >
                          <Pin className={`w-3.5 h-3.5 ${note.pinned ? "fill-current" : ""}`} />
                        </button>

                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                          {note.title || "Untitled Note"}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => requestDelete(note, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all cursor-pointer shrink-0"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
                      {note.content || "Empty note. Click to start typing..."}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-3 pt-2.5 border-t border-slate-100 dark:border-white/5">
                      <span className="inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400">
                        <Tag className="w-2.5 h-2.5" />
                        {note.category}
                      </span>
                      <span>{note.updatedAt}</span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Active Note Full Editor (7 cols) */}
        <div className="lg:col-span-7">
          {selectedNote ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-slate-200/90 dark:border-white/10 shadow-sm space-y-6 min-h-[640px] flex flex-col justify-between">
              <div className="space-y-4">
                {/* Top Action Row */}
                <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/10">
                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      value={selectedNote.category}
                      onChange={(e) => {
                        const updated: WorkspaceNoteItem = {
                          ...selectedNote,
                          category: e.target.value as any,
                        };
                        setNotes((prev) =>
                          prev.map((n) => (n.id === updated.id ? updated : n))
                        );
                        persistNoteChange(updated);
                      }}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                    >
                      <option value="Client Discovery">Client Discovery</option>
                      <option value="Objection Handling">Objection Handling</option>
                      <option value="Outreach Strategy">Outreach Strategy</option>
                      <option value="Daily Tasks">Daily Tasks</option>
                      <option value="Ideas">Ideas</option>
                    </select>

                    {/* Dedicated Pin / Unpin button in toolbar */}
                    <button
                      type="button"
                      onClick={() => handleTogglePin(selectedNote)}
                      className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 font-medium ${
                        selectedNote.pinned
                          ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-semibold"
                          : "border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                      }`}
                    >
                      <Pin className={`w-3.5 h-3.5 ${selectedNote.pinned ? "fill-current" : ""}`} />
                      <span>{selectedNote.pinned ? "Pinned" : "Pin Note"}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyContent}
                      className="h-8 px-2.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white gap-1 rounded-lg"
                      title="Copy content"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => requestDelete(selectedNote)}
                      className="h-8 px-2.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 gap-1 rounded-lg"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>

                {/* Title Input */}
                <input
                  type="text"
                  value={selectedNote.title}
                  onChange={(e) => {
                    const updated: WorkspaceNoteItem = {
                      ...selectedNote,
                      title: e.target.value,
                    };
                    setNotes((prev) =>
                      prev.map((n) => (n.id === updated.id ? updated : n))
                    );
                    persistNoteChange(updated);
                  }}
                  placeholder="Note Title..."
                  className="w-full text-xl sm:text-2xl font-black bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 tracking-tight"
                />

                {/* Content Textarea */}
                <textarea
                  value={selectedNote.content}
                  onChange={(e) => {
                    const updated: WorkspaceNoteItem = {
                      ...selectedNote,
                      content: e.target.value,
                      updatedAt: "Just now",
                    };
                    setNotes((prev) =>
                      prev.map((n) => (n.id === updated.id ? updated : n))
                    );
                    persistNoteChange(updated);
                  }}
                  rows={18}
                  placeholder="Start writing notes, scripts, client discovery call debriefs..."
                  className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans resize-none placeholder:text-slate-400 focus:ring-0"
                />
              </div>

              {/* Bottom Footer Info */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-4 border-t border-slate-100 dark:border-white/10">
                <span>{selectedNote.content.length} characters • {selectedNote.content.trim().split(/\s+/).filter(Boolean).length} words</span>
                <span>{isSaving ? "Auto-saving..." : `Saved • ${selectedNote.updatedAt}`}</span>
              </div>
            </div>
          ) : (
            <div className="p-16 text-center rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 text-slate-400 space-y-3">
              <StickyNote className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs">No note selected. Select a note from the left or create a new one.</p>
              <Button
                onClick={handleCreateNote}
                size="sm"
                className="text-xs font-semibold bg-slate-900 text-white rounded-xl h-8 px-3"
              >
                + New Note
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── Modern Deletion Confirmation Modal ── */}
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete this note?"
        description="This will permanently delete this note from your workspace database."
        itemName={noteToDelete?.title || "Untitled Note"}
        onConfirm={executeDelete}
      />
    </div>
  );
}
