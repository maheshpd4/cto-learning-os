export const dynamic = "force-dynamic";

"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, CheckCircle2, Clock, Loader2,
         Circle, Zap, Target, Calendar } from "lucide-react";
import { cn, SKILL_LABELS, SKILL_COLORS, daysUntil, formatDate } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  type: string;
  skillArea: string;
  status: string;
  timeBlocks: number;
  dueDate: string;
}

interface Week {
  id: string;
  weekNumber: number;
  title: string;
  goals: string[];
  expectedOutput: string;
  startDate: string;
  endDate: string;
  tasks: Task[];
}

interface Phase {
  id: string;
  number: number;
  title: string;
  description: string;
  focus: string;
  startDate: string;
  endDate: string;
  status: string;
  deliverable: string;
  weeks: Week[];
}

const PHASE_COLORS = [
  { from: "from-cyan-500", to: "to-blue-600", accent: "#06b6d4", light: "text-cyan-400", border: "border-cyan-500/30", bg: "bg-cyan-500/10" },
  { from: "from-violet-500", to: "to-purple-600", accent: "#8b5cf6", light: "text-violet-400", border: "border-violet-500/30", bg: "bg-violet-500/10" },
  { from: "from-amber-500", to: "to-orange-600", accent: "#f59e0b", light: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10" },
  { from: "from-emerald-500", to: "to-green-600", accent: "#10b981", light: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
  { from: "from-rose-500", to: "to-pink-600", accent: "#f43f5e", light: "text-rose-400", border: "border-rose-500/30", bg: "bg-rose-500/10" },
  { from: "from-sky-500", to: "to-indigo-600", accent: "#0ea5e9", light: "text-sky-400", border: "border-sky-500/30", bg: "bg-sky-500/10" },
];

const TYPE_ICONS: Record<string, string> = {
  STUDY: "📖", BUILD: "🔨", PRACTICE: "💪", REVIEW: "🔍", PROJECT: "🏗️",
};

const STATUS_MAP: Record<string, string> = {
  UPCOMING: "Upcoming",
  ACTIVE: "Active",
  COMPLETED: "Completed",
};

export default function RoadmapPage() {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1);
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/roadmap")
      .then((r) => r.json())
      .then((d) => {
        setPhases(d.phases || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const goalDate = new Date("2026-11-04");
  const daysLeft = daysUntil(goalDate);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Learning Roadmap</h1>
          <p className="text-muted-foreground mt-1">
            6 phases · 24 weeks · May 15 → November 4, 2026
          </p>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2">
          <Target className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">{daysLeft} days remaining</span>
        </div>
      </div>

      {/* Timeline summary strip */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {phases.map((phase, i) => {
          const color = PHASE_COLORS[i];
          const isActive = phase.status === "ACTIVE";
          return (
            <button
              key={phase.id}
              onClick={() => setExpandedPhase(expandedPhase === phase.number ? null : phase.number)}
              className={cn(
                "flex-shrink-0 flex flex-col items-start gap-1 px-4 py-3 rounded-xl border text-left transition-all duration-150",
                isActive
                  ? `${color.bg} ${color.border}`
                  : "bg-card border-border hover:border-primary/30",
                expandedPhase === phase.number && "ring-1 ring-primary/30"
              )}
            >
              <div className="flex items-center gap-2">
                <div className={cn("h-2 w-2 rounded-full", isActive ? "bg-current animate-pulse" : "bg-muted")}
                     style={isActive ? { color: color.accent } : {}} />
                <span className={cn("text-xs font-bold uppercase tracking-wider",
                  isActive ? color.light : "text-muted-foreground")}>
                  Phase {phase.number}
                </span>
              </div>
              <p className="text-xs font-semibold text-foreground whitespace-nowrap">{phase.title}</p>
              <p className="text-xs text-muted-foreground">{phase.weeks.length}w</p>
            </button>
          );
        })}
      </div>

      {/* Phase Detail */}
      {phases.map((phase, pi) => {
        const color = PHASE_COLORS[pi];
        const isExpanded = expandedPhase === phase.number;

        return (
          <div
            key={phase.id}
            className={cn(
              "rounded-xl border transition-all duration-200",
              phase.status === "ACTIVE"
                ? `${color.border} ${color.bg}`
                : "border-border bg-card"
            )}
          >
            {/* Phase header */}
            <button
              className="w-full flex items-start gap-4 p-5 text-left"
              onClick={() => setExpandedPhase(isExpanded ? null : phase.number)}
            >
              <div className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white text-sm font-bold bg-gradient-to-br",
                color.from, color.to
              )}>
                {phase.number}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-bold text-foreground">{phase.title}</h2>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    phase.status === "ACTIVE" ? `${color.bg} ${color.light} ${color.border} border` :
                    phase.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" :
                    "badge-upcoming"
                  )}>
                    {STATUS_MAP[phase.status] || phase.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{phase.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(phase.startDate)} → {formatDate(phase.endDate)}
                  </span>
                  <span className="text-xs text-muted-foreground">{phase.weeks.length} weeks</span>
                </div>
              </div>
              {isExpanded
                ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
              }
            </button>

            {/* Phase body */}
            {isExpanded && (
              <div className="px-5 pb-5 space-y-4 border-t border-border/50 pt-4">
                {/* Deliverable */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border">
                  <Target className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-primary mb-0.5">Phase Deliverable</p>
                    <p className="text-xs text-foreground/80">{phase.deliverable}</p>
                  </div>
                </div>

                {/* Focus areas */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Focus Areas</p>
                  <div className="flex flex-wrap gap-1.5">
                    {phase.focus.split(" · ").map((f) => (
                      <span key={f} className="px-2 py-0.5 bg-muted/50 border border-border rounded-md text-xs text-foreground/80">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Weeks */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Weeks</p>
                  {phase.weeks.map((week) => {
                    const isWeekExpanded = expandedWeek === week.id;
                    const weekDone = week.tasks.filter((t) => t.status === "COMPLETED").length;
                    const weekTotal = week.tasks.length;
                    const weekPct = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;
                    const isCurrentWeek = new Date() >= new Date(week.startDate) && new Date() <= new Date(week.endDate);

                    return (
                      <div key={week.id} className={cn(
                        "rounded-lg border",
                        isCurrentWeek ? `${color.border} ${color.bg}` : "border-border"
                      )}>
                        <button
                          className="w-full flex items-center gap-3 p-3 text-left"
                          onClick={() => setExpandedWeek(isWeekExpanded ? null : week.id)}
                        >
                          <div className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                            isCurrentWeek ? `bg-gradient-to-br ${color.from} ${color.to} text-white` : "bg-muted text-muted-foreground"
                          )}>
                            W{week.weekNumber}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-foreground truncate">{week.title}</p>
                              {isCurrentWeek && (
                                <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", color.bg, color.light, color.border, "border")}>
                                  Current
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex-1 h-1.5 bg-muted/40 rounded-full overflow-hidden max-w-24">
                                <div className="h-full rounded-full transition-all" style={{ width: `${weekPct}%`, backgroundColor: color.accent }} />
                              </div>
                              <span className="text-xs text-muted-foreground">{weekDone}/{weekTotal} tasks</span>
                            </div>
                          </div>
                          {isWeekExpanded
                            ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          }
                        </button>

                        {/* Week detail */}
                        {isWeekExpanded && (
                          <div className="px-4 pb-4 space-y-3 border-t border-border/50 pt-3">
                            {/* Goals */}
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Weekly Goals</p>
                              <ul className="space-y-1">
                                {week.goals.map((goal, gi) => (
                                  <li key={gi} className="flex items-start gap-2 text-xs text-foreground/80">
                                    <Zap className="h-3 w-3 mt-0.5 shrink-0 text-primary" />
                                    {goal}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Expected output */}
                            <div className="p-2.5 rounded-lg bg-muted/20 border border-border">
                              <p className="text-xs font-semibold text-muted-foreground mb-1">Expected Output</p>
                              <p className="text-xs text-foreground/80">{week.expectedOutput}</p>
                            </div>

                            {/* Tasks */}
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tasks</p>
                              <div className="space-y-1.5">
                                {week.tasks.map((task) => (
                                  <div key={task.id} className="flex items-center gap-2 text-xs">
                                    {task.status === "COMPLETED"
                                      ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                      : <Circle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                    }
                                    <span className={cn(
                                      task.status === "COMPLETED" && "line-through text-muted-foreground"
                                    )}>
                                      {TYPE_ICONS[task.type]} {task.title}
                                    </span>
                                    <span className="ml-auto text-muted-foreground shrink-0">
                                      {task.timeBlocks * 30}m
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
