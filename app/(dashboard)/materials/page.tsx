"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { Plus, Search, ExternalLink, BookOpen, Youtube, FileText, Github,
         Loader2, Filter, StickyNote, Mic } from "lucide-react";
import { cn, SKILL_LABELS, SKILL_COLORS } from "@/lib/utils";
interface Material {
  id: string;
  title: string;
  url?: string;
  type: string;
  notes?: string;
  skillArea: string;
  phase?: number;
  difficulty: string;
  status: string;
  tags: string[];
}
const TYPE_ICONS: Record<string, React.ElementType> = {
  COURSE: BookOpen,
  YOUTUBE: Youtube,
  PDF: FileText,
  NOTE: StickyNote,
  GITHUB_REPO: Github,
  ARTICLE: FileText,
  ARCHITECTURE_DIAGRAM: FileText,
  INTERVIEW_QUESTION: Mic,
};
const TYPE_LABELS: Record<string, string> = {
  COURSE: "Course",
  YOUTUBE: "YouTube",
  PDF: "PDF",
  NOTE: "Note",
  GITHUB_REPO: "GitHub",
  ARTICLE: "Article",
  ARCHITECTURE_DIAGRAM: "Diagram",
  INTERVIEW_QUESTION: "Interview Q",
};
const STATUS_COLORS: Record<string, string> = {
  NOT_STARTED: "badge-pending",
  IN_PROGRESS: "badge-active",
  COMPLETED: "badge-completed",
  BOOKMARKED: "badge-upcoming",
};
const DIFFICULTY_COLORS: Record<string, string> = {
  BEGINNER: "text-emerald-400",
  INTERMEDIATE: "text-cyan-400",
  ADVANCED: "text-amber-400",
  ARCHITECT: "text-violet-400",
};
export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSkill, setFilterSkill] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({
    title: "", url: "", type: "COURSE", notes: "",
    skillArea: "AI_SYSTEMS", phase: "", difficulty: "INTERMEDIATE",
    status: "NOT_STARTED", tags: "",
  });
  useEffect(() => {
    fetch("/api/materials")
      .then((r) => r.json())
      .then((d) => { setMaterials(d.materials || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);
  const addMaterial = async () => {
    const res = await fetch("/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...addForm,
        phase: addForm.phase ? Number(addForm.phase) : null,
        tags: addForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    });
    const data = await res.json();
    if (data.material) {
      setMaterials((prev) => [data.material, ...prev]);
      setShowAddForm(false);
      setAddForm({ title: "", url: "", type: "COURSE", notes: "", skillArea: "AI_SYSTEMS", phase: "", difficulty: "INTERMEDIATE", status: "NOT_STARTED", tags: "" });
    }
  };
  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/materials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setMaterials((prev) => prev.map((m) => m.id === id ? { ...m, status } : m));
  };
  const filtered = materials.filter((m) => {
    const matchSearch = !search || m.title.toLowerCase().includes(search.toLowerCase()) || m.notes?.toLowerCase().includes(search.toLowerCase());
    const matchSkill = filterSkill === "ALL" || m.skillArea === filterSkill;
    const matchStatus = filterStatus === "ALL" || m.status === filterStatus;
    return matchSearch && matchSkill && matchStatus;
  });
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Material Hub</h1>
          <p className="text-muted-foreground text-sm mt-1">{materials.length} resources tracked</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Resource
        </button>
      </div>
      {/* Add form */}
      {showAddForm && (
        <div className="card-cto border-primary/20 space-y-4 animate-slide-up">
          <h3 className="text-sm font-semibold text-foreground">Add New Resource</h3>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Title *" value={addForm.title} onChange={(e) => setAddForm((p) => ({ ...p, title: e.target.value }))}
              className="col-span-2 bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            <input placeholder="URL (optional)" value={addForm.url} onChange={(e) => setAddForm((p) => ({ ...p, url: e.target.value }))}
              className="col-span-2 bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            {[
              { key: "type", label: "Type", options: Object.entries(TYPE_LABELS) },
              { key: "skillArea", label: "Skill Area", options: Object.entries(SKILL_LABELS) },
              { key: "difficulty", label: "Difficulty", options: [["BEGINNER","Beginner"],["INTERMEDIATE","Intermediate"],["ADVANCED","Advanced"],["ARCHITECT","Architect"]] },
              { key: "phase", label: "Phase", options: [["","Any"],["1","Phase 1"],["2","Phase 2"],["3","Phase 3"],["4","Phase 4"],["5","Phase 5"],["6","Phase 6"]] },
            ].map(({ key, label, options }) => (
              <select key={key} value={(addForm as Record<string, string>)[key]} onChange={(e) => setAddForm((p) => ({ ...p, [key]: e.target.value }))}
                className="bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            ))}
            <input placeholder="Tags (comma-separated)" value={addForm.tags} onChange={(e) => setAddForm((p) => ({ ...p, tags: e.target.value }))}
              className="col-span-2 bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            <textarea rows={2} placeholder="Notes (optional)" value={addForm.notes} onChange={(e) => setAddForm((p) => ({ ...p, notes: e.target.value }))}
              className="col-span-2 bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={addMaterial} disabled={!addForm.title.trim()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
              Save Resource
            </button>
            <button onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-border text-muted-foreground rounded-lg text-sm hover:bg-muted/50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <select value={filterSkill} onChange={(e) => setFilterSkill(e.target.value)}
          className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
          <option value="ALL">All Skills</option>
          {Object.entries(SKILL_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
          <option value="ALL">All Status</option>
          <option value="NOT_STARTED">Not Started</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="BOOKMARKED">Bookmarked</option>
        </select>
      </div>
      {/* Materials grid */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No resources found.</p>
          <p className="text-xs mt-1">Add your first resource using the button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((m) => {
            const Icon = TYPE_ICONS[m.type] || BookOpen;
            const skillColor = SKILL_COLORS[m.skillArea] || "#6b7280";
            return (
              <div key={m.id} className="card-cto group">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/50 border border-border">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">{m.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {TYPE_LABELS[m.type]} · <span className={DIFFICULTY_COLORS[m.difficulty]}>{m.difficulty}</span>
                    </p>
                  </div>
                  {m.url && (
                    <a href={m.url} target="_blank" rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
                    </a>
                  )}
                </div>
                {/* Skill tag */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-0.5 rounded-full border"
                    style={{ color: skillColor, borderColor: skillColor + "40", backgroundColor: skillColor + "15" }}>
                    {SKILL_LABELS[m.skillArea]}
                  </span>
                  {m.phase && (
                    <span className="text-xs text-muted-foreground">Phase {m.phase}</span>
                  )}
                </div>
                {/* Notes preview */}
                {m.notes && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{m.notes}</p>
                )}
                {/* Tags */}
                {m.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {m.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs px-1.5 py-0.5 bg-muted/50 border border-border rounded text-muted-foreground">{tag}</span>
                    ))}
                  </div>
                )}
                {/* Status selector */}
                <select
                  value={m.status}
                  onChange={(e) => updateStatus(m.id, e.target.value)}
                  className="w-full bg-muted/30 border border-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="BOOKMARKED">Bookmarked</option>
                </select>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
