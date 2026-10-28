"use client";

import { useState } from "react";
import {
  StickyNote,
  Plus,
  Trash2,
  Search,
  FolderOpen,
  Pin,
  Check,
  Sparkles,
  BookOpen,
  Clock,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Note {
  id: string;
  title: string;
  category: "Client Discovery" | "Objection Handling" | "Outreach Strategy" | "Daily Tasks" | "Ideas";
  content: string;
  pinned: boolean;
  updatedAt: string;
}

const PRESET_NOTES: Note[] = [
  {
    id: "n1",
    title: "The 4 Top Objections & How to Crush Them",
    category: "Objection Handling",
    pinned: true,
    updatedAt: "Today, 10:30 AM",
    content: `1. "C'est trop cher / On n'a pas le budget" :
→ "Je comprends parfaitement. Juste une question : combien vous rapporte un seul client/mandat signé chez vous ? Si notre système vous évite de perdre seulement 2 clients par mois qui appellent le soir, l'outil est rentabilisé 3 fois dès le premier mois."

2. "On a déjà une secrétaire / réceptionniste" :
→ "Exactement, et le but n'est pas de la remplacer, mais de lui libérer 70% de son temps. Que fait-elle à 20h le soir ou le dimanche quand un prospect chaud cherche un bien ou un rendez-vous urgent ? Notre IA prend le relais quand votre bureau est fermé."

3. "L'IA est trop robotique, nos clients veulent un humain" :
→ "C'était le cas il y a 2 ans. Aujourd'hui, notre agent WhatsApp répond en Darija ou en Français naturel en 3 secondes. Si le client pose une question complexe, l'IA transfère immédiatement la discussion sur votre téléphone personnel."`,
  },
  {
    id: "n2",
    title: "15-Minute Client Discovery Call Framework",
    category: "Client Discovery",
    pinned: true,
    updatedAt: "Yesterday",
    content: `1. CADRAGE (2 min) :
"Merci pour votre temps. Le but de notre appel n'est pas de vous faire une présentation théorique, mais de voir comment vous traitez actuellement vos leads et si notre automatisation peut vous faire gagner du temps."

2. DIAGNOSTIC (6 min) :
- "D'où viennent la majorité de vos demandes aujourd'hui ? (Instagram, Maps, Recommandation) ?"
- "Quand un prospect vous écrit à 21h ou le samedi, qui lui répond et en combien de temps ?"
- "Combien de prospects qualifiés estimez-vous perdre par manque de relance chaque mois ?"

3. PITCH DE LA SOLUTION (5 min) :
Montrer la démo personnalisée WhatsApp en direct avec leur logo.

4. CLOSING :
"Si on met ça en place ce vendredi, êtes-vous prêt à tester sur vos 50 prochains prospects ?"`,
  },
  {
    id: "n3",
    title: "Morocco Retainer Pricing Structure",
    category: "Outreach Strategy",
    pinned: false,
    updatedAt: "25 Oct 2026",
    content: `Standard Agency Retainer Tiers in Morocco :

• PACK DÉMARRAGE (Petits cabinets / commerces) :
- Frais de Setup : 3,000 MAD (one-time)
- Retainer Mensuel : 2,000 MAD / mois
- Inclus : Bot WhatsApp FAQ + Prise de rdv Google Calendar.

• PACK PRO (Agences Immobilières / Cliniques) :
- Frais de Setup : 5,000 MAD
- Retainer Mensuel : 4,500 à 6,000 MAD / mois
- Inclus : Bot WhatsApp bilingue (FR/Darija) + Qualification budget + Relances automatiques J+1 et J+3 + Dashboard partagé.

• PACK PREMIUM (Réseaux / Cliniques Esthétiques) :
- Setup : 8,000 MAD
- Retainer : 7,500 MAD / mois + Agent Vocal IA entrant.`,
  },
];

export function WorkspaceNotesClient() {
  const [notes, setNotes] = useState<Note[]>(PRESET_NOTES);
  const [selectedNote, setSelectedNote] = useState<Note>(PRESET_NOTES[0]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const categories = [
    "ALL",
    "Objection Handling",
    "Client Discovery",
    "Outreach Strategy",
    "Daily Tasks",
    "Ideas",
  ];

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === "ALL" || n.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const handleCreateNote = () => {
    const newNote: Note = {
      id: `note_${Date.now()}`,
      title: "New Agency Note",
      category: "Ideas",
      pinned: false,
      updatedAt: "Just now",
      content: "Write your client notes, pitch ideas, or meeting summary here...",
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    toast.success("New note created!");
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    if (selectedNote.id === id && updated.length > 0) {
      setSelectedNote(updated[0]);
    }
    toast.info("Note deleted.");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 mb-2">
            <StickyNote className="w-3.5 h-3.5" />
            <span>Knowledge Base & Scratchpad</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Agency Notes & Playbooks
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Keep meeting notes, client objection handling scripts, and agency strategies right inside your workspace.
          </p>
        </div>

        <Button
          onClick={handleCreateNote}
          size="sm"
          className="font-bold bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shadow-sm self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </Button>
      </div>

      {/* ── 2-Column Split: Notes List (Left 4 cols) + Active Editor (Right 8 cols) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Search & Note List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search notes & scripts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-card text-xs text-foreground focus:outline-hidden focus:border-primary"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary font-bold"
                    : "bg-card border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Notes Cards List */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto no-scrollbar pr-1">
            {filteredNotes.map((note) => {
              const isSelected = selectedNote?.id === note.id;

              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-primary/5 border-primary shadow-xs"
                      : "bg-card border-border hover:border-primary/40 hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-bold text-xs sm:text-sm text-foreground line-clamp-1">
                      {note.title}
                    </h4>
                    {note.pinned && <Pin className="w-3 h-3 text-primary shrink-0 fill-current" />}
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {note.content}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-2 pt-2 border-t border-border/50">
                    <Badge variant="outline" className="text-[9px] font-semibold">
                      {note.category}
                    </Badge>
                    <span>{note.updatedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Note Viewer / Editor */}
        <div className="lg:col-span-7">
          {selectedNote ? (
            <Card className="bg-card border-border shadow-md">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4 pb-3 border-b border-border">
                  <div className="space-y-1.5 flex-1">
                    <input
                      type="text"
                      value={selectedNote.title}
                      onChange={(e) => {
                        selectedNote.title = e.target.value;
                        setNotes([...notes]);
                      }}
                      className="text-lg sm:text-xl font-black bg-transparent border-none focus:outline-hidden text-foreground w-full"
                    />

                    <div className="flex items-center gap-2">
                      <select
                        value={selectedNote.category}
                        onChange={(e) => {
                          selectedNote.category = e.target.value as any;
                          setNotes([...notes]);
                        }}
                        className="text-xs font-semibold px-2 py-0.5 rounded-md border border-border bg-muted/40 text-muted-foreground"
                      >
                        <option value="Objection Handling">Objection Handling</option>
                        <option value="Client Discovery">Client Discovery</option>
                        <option value="Outreach Strategy">Outreach Strategy</option>
                        <option value="Daily Tasks">Daily Tasks</option>
                        <option value="Ideas">Ideas</option>
                      </select>

                      <span className="text-[11px] text-muted-foreground">• Last saved {selectedNote.updatedAt}</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={() => handleDeleteNote(selectedNote.id)}
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>

                <textarea
                  rows={16}
                  value={selectedNote.content}
                  onChange={(e) => {
                    selectedNote.content = e.target.value;
                    selectedNote.updatedAt = "Just now";
                    setNotes([...notes]);
                  }}
                  className="w-full bg-transparent border-none focus:outline-hidden text-xs sm:text-sm text-foreground font-mono leading-relaxed resize-y"
                />
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-20 text-muted-foreground text-xs">
              Select or create a note to view and edit.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
