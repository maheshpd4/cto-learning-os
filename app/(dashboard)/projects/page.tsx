export const dynamic = "force-dynamic";

"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Plus, ChevronDown, ChevronRight, Github,
         Loader2, Sparkles, CheckCircle2, Circle, Target } from "lucide-react";
import { cn, SKILL_LABELS, SKILL_COLORS } from "@/lib/utils";

interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  sprint?: number;
  status: string;
  priority: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  githubUrl?: string;
  architectureNotes?: string;
  status: string;
  completionPct: number;
  demoReady: boolean;
  resumeBullet?: string;
  skillAreas: string[];
  tasks: ProjectTask[];
}

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "text-muted-foreground",
  MEDIUM: "text-cyan-400",
  HIGH: "text-amber-400",
  CRITICAL: "text-red-400",
};

const STATUS_COLORS: Record<string, string> = {
  PLANNING: "badge-upcoming",
  IN_PROGRESS: "badge-active",
  REVIEW: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
  COMPLETED: "badge-completed",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [generatingResume, setGeneratingResume] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => { setProjects(d.projects || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const toggleTask = async (projectId: string, taskId: string) => {
    const project = projects.find((p) => p.id === projectId);
    const task = project?.tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";

    await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    setProjects((prev) =>
      prev.map((p) =>
        p.id !== projectId ? p : {
          ...p,
          tasks: p.tasks.map((t) => t.id === taskId ? { ...t, status: newStatus } : t),
          completionPct: Math.round(
            (p.tasks.filter((t) => (t.id === taskId ? newStatus : t.status) === "COMPLETED").length / p.tasks.length) * 100
          ),
        }
      )
    );
  };

  const generateResumeBullet = async (project: Project) => {
    setGeneratingResume(project.id);
    try {
      const res = await fetch(`/api/projects/${project.id}/resume`, { method: "POST" });
      const data = await res.json();
      if (data.bullet) {
        setProjects((prev) =>
          prev.map((p) => p.id === project.id ? { ...p, resumeBullet: data.bullet } : p)
        );
      }
    } finally {
      setGeneratingResume(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalCompleted = projects.filter((p) => p.status === "COMPLETED").length;
  const inProgress = projects.filter((p) => p.status === "IN_PROGRESS").length;
  const demoReady = projects.filter((p) => p.demoReady).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Project Portfolio</h1>
        <p className="text-muted-foreground text-sm mt-1">5 flagship projects for your CTO portfolio</p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Completed", value: totalCompleted, color: "text-emerald-400" },
          { label: "In Progress", value: inProgress, color: "text-cyan-400" },
          { label: "Demo Ready", value: demoReady, color: "text-violet-400" },
        ].map((stat) => (
          <div key={stat.label} className="card-cto text-center">
            <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Projects */}
      <div className="space-y-4">
        {projects.map((project, pi) => {
          const isExpanded = expanded === project.id;
          const completedTasks = project.tasks.filter((t) => t.status === "COMPLETED").length;

          return (
            <div key={project.id} className="card-cto">
              {/* Project header */}
              <button
                className="w-full flex items-start gap-4 text-left"
                onClick={() => setExpanded(isExpanded ? null : project.id)}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-primary/20 text-lg">
                  {["🤖", "✈️", "📊", "👁️", "🔒"][pi]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-foreground">{project.title}</h2>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", STATUS_COLORS[project.status] || "badge-pending")}>
                      {project.status.replace("_", " ")}
                    </span>
                    {project.demoReady && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/30">
                        Demo Ready
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{project.description}</p>

                  {/* Progress bar */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex-1 h-1.5 bg-muted/40 rounded-full overflow-hidden max-w-40">
                      <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-500"
                        style={{ width: `${project.completionPct}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{project.completionPct}% · {completedTasks}/{project.tasks.length} tasks</span>
                  </div>
                </div>
                {isExpanded
                  ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                  : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                }
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-border space-y-4">
                  {/* Description */}
                  <p className="text-sm text-foreground/80">{project.description}</p>

                  {/* Skill areas */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.skillAreas.map((area) => (
                      <span key={area} className="text-xs px-2 py-0.5 rounded-full border"
                        style={{ color: SKILL_COLORS[area], borderColor: SKILL_COLORS[area] + "40", backgroundColor: SKILL_COLORS[area] + "15" }}>
                        {SKILL_LABELS[area] || area}
                      </span>
                    ))}
                  </div>

                  {/* GitHub link */}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <Github className="h-3.5 w-3.5" />
                      {project.githubUrl}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}

                  {/* Tasks backlog */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Sprint Backlog ({completedTasks}/{project.tasks.length} done)
                    </p>
                    <div className="space-y-2">
                      {project.tasks.map((task) => (
                        <div
                          key={task.id}
                          className={cn(
                            "flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer transition-all",
                            task.status === "COMPLETED"
                              ? "border-emerald-500/20 bg-emerald-500/5 opacity-70"
                              : "border-border hover:border-primary/30 hover:bg-muted/20"
                          )}
                          onClick={() => toggleTask(project.id, task.id)}
                        >
                          {task.status === "COMPLETED"
                            ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                            : <Circle className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
                          }
                          <div className="flex-1 min-w-0">
                            <p className={cn("text-sm", task.status === "COMPLETED" && "line-through text-muted-foreground")}>
                              {task.title}
                            </p>
                          </div>
                          <span className={cn("text-xs shrink-0", PRIORITY_COLORS[task.priority])}>
                            {task.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Architecture notes */}
                  {project.architectureNotes && (
                    <div className="p-3 rounded-lg bg-muted/20 border border-border">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Architecture Notes</p>
                      <p className="text-xs text-foreground/80">{project.architectureNotes}</p>
                    </div>
                  )}

                  {/* Resume bullet */}
                  <div>
                    {project.resumeBullet ? (
                      <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                        <p className="text-xs font-semibold text-violet-400 mb-1">📄 Resume Bullet</p>
                        <p className="text-sm text-foreground/90">{project.resumeBullet}</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => generateResumeBullet(project)}
                        disabled={generatingResume === project.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-violet-500/30 text-violet-400 text-xs hover:bg-violet-500/10 transition-colors disabled:opacity-50"
                      >
                        {generatingResume === project.id
                          ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating...</>
                          : <><Sparkles className="h-3.5 w-3.5" /> Generate AI Resume Bullet</>
                        }
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
