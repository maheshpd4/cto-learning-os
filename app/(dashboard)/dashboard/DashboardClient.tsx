"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Flame, Target, Calendar, TrendingUp, AlertCircle,
  Sparkles, CheckCircle2, Circle, Clock, ArrowRight, Brain,
  Zap
} from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  LineChart, Line
} from "recharts";
import { cn } from "@/lib/utils";
import { SKILL_LABELS } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────
interface SkillScore {
  area: string;
  label: string;
  score: number;
  color: string;
}

interface DashboardData {
  todayTasks: Array<{
    id: string;
    title: string;
    status: string;
    type: string;
    skillArea: string;
    timeBlocks: number;
  }>;
  skillScores: SkillScore[];
  currentStreak: number;
  weeklyPct: number;
  daysLeft: number;
  journeyPct: number;
  avgConfidence: number | null;
  latestBlocker: string | null;
  activePhase: {
    number: number;
    title: string;
    description: string;
  } | null;
  totalTasksToday: number;
  completedTasksToday: number;
}

// ── ProgressRing ─────────────────────────────────────────────
function ProgressRing({
  pct,
  size = 80,
  stroke = 6,
  color = "#06b6d4",
  label,
  sublabel,
}: {
  pct: number;
  size?: number;
  stroke?: number;
  color?: string;
  label: string;
  sublabel?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke="currentColor" strokeWidth={stroke} className="text-muted/30" />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={color} strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className="progress-ring-circle"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-foreground">{pct}%</span>
        </div>
      </div>
      <p className="text-xs font-medium text-foreground">{label}</p>
      {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
    </div>
  );
}

// ── SkillBar ─────────────────────────────────────────────────
function SkillBar({ label, score, color }: { label: string; score: number; color: string }) {
  const getLevel = (s: number) => {
    if (s >= 80) return "Expert";
    if (s >= 60) return "Proficient";
    if (s >= 40) return "Developing";
    return "Beginner";
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-foreground font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{getLevel(score)}</span>
          <span className="font-bold tabular-nums" style={{ color }}>{score}</span>
        </div>
      </div>
      <div className="h-2 bg-muted/40 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ── TaskItem ─────────────────────────────────────────────────
function TaskItem({
  task,
  onToggle,
}: {
  task: DashboardData["todayTasks"][0];
  onToggle: (id: string) => void;
}) {
  const typeIcons: Record<string, string> = {
    STUDY: "📖", BUILD: "🔨", PRACTICE: "💪", REVIEW: "🔍", PROJECT: "🏗️",
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-150",
        task.status === "COMPLETED"
          ? "border-emerald-500/20 bg-emerald-500/5 opacity-60"
          : "border-border hover:border-primary/30 hover:bg-muted/30"
      )}
      onClick={() => onToggle(task.id)}
    >
      {task.status === "COMPLETED" ? (
        <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500" />
      ) : (
        <Circle className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
      )}
      <div className="min-w-0 flex-1">
        <p className={cn(
          "text-sm font-medium leading-snug",
          task.status === "COMPLETED" && "line-through text-muted-foreground"
        )}>
          {typeIcons[task.type] || "📌"} {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{task.timeBlocks * 30}m</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────
export function DashboardClient({ data }: { data: DashboardData }) {
  const [tasks, setTasks] = useState(data.todayTasks);

  const completedCount = tasks.filter((t) => t.status === "COMPLETED").length;
  const todayPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const toggleTask = async (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "COMPLETED" ? "PENDING" : "COMPLETED" }
          : t
      )
    );
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle" }),
    }).catch(console.error);
  };

  // Radar chart data
  const radarData = data.skillScores.map((s) => ({
    subject: s.label.split(" ")[0], // short label
    score: s.score,
    fullMark: 100,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Good {getGreeting()}, Mahesh 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            {data.activePhase && (
              <span className="ml-2 text-primary">
                · Phase {data.activePhase.number}: {data.activePhase.title}
              </span>
            )}
          </p>
        </div>
        <Link
          href="/checkin"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Zap className="h-4 w-4" />
          Daily Check-in
        </Link>
      </div>

      {/* ── KPI Strip ────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-cto text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Flame className="h-5 w-5 text-amber-500" />
            <span className="text-2xl font-bold text-foreground">{data.currentStreak}</span>
          </div>
          <p className="text-xs text-muted-foreground">Day Streak</p>
        </div>
        <div className="card-cto text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Target className="h-5 w-5 text-cyan-500" />
            <span className="text-2xl font-bold text-foreground">{data.daysLeft}</span>
          </div>
          <p className="text-xs text-muted-foreground">Days to Goal</p>
        </div>
        <div className="card-cto text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            <span className="text-2xl font-bold text-foreground">{data.weeklyPct}%</span>
          </div>
          <p className="text-xs text-muted-foreground">Week Completion</p>
        </div>
        <div className="card-cto text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Brain className="h-5 w-5 text-violet-500" />
            <span className="text-2xl font-bold text-foreground">
              {data.avgConfidence ? `${data.avgConfidence}/10` : "—"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Avg Confidence</p>
        </div>
      </div>

      {/* ── Main Grid ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Today's Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's progress */}
          <div className="card-cto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Today's Learning Plan</h2>
              </div>
              <div className="flex items-center gap-3">
                <ProgressRing
                  pct={todayPct}
                  size={52}
                  stroke={4}
                  color="#06b6d4"
                  label={`${completedCount}/${tasks.length}`}
                />
              </div>
            </div>

            {tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No tasks scheduled for today.</p>
                <Link href="/roadmap" className="text-xs text-primary hover:underline mt-1 block">
                  View roadmap →
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <TaskItem key={task.id} task={task} onToggle={toggleTask} />
                ))}
              </div>
            )}
          </div>

          {/* Skill Scores */}
          <div className="card-cto">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Skill Scores</h2>
              <span className="ml-auto text-xs text-muted-foreground">out of 100</span>
            </div>
            <div className="space-y-4">
              {data.skillScores
                .sort((a, b) => b.score - a.score)
                .map((skill) => (
                  <SkillBar key={skill.area} label={skill.label} score={skill.score} color={skill.color} />
                ))}
            </div>
          </div>
        </div>

        {/* Right: Charts + Sidebar widgets */}
        <div className="space-y-6">
          {/* Journey progress rings */}
          <div className="card-cto">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Journey Progress</h2>
            </div>
            <div className="flex items-center justify-around">
              <ProgressRing
                pct={data.journeyPct}
                size={80}
                stroke={6}
                color="#06b6d4"
                label="Overall"
                sublabel="Journey"
              />
              <ProgressRing
                pct={todayPct}
                size={80}
                stroke={6}
                color="#10b981"
                label="Today"
                sublabel="Tasks"
              />
              <ProgressRing
                pct={data.weeklyPct}
                size={80}
                stroke={6}
                color="#8b5cf6"
                label="Week"
                sublabel="Goals"
              />
            </div>
          </div>

          {/* Radar chart */}
          <div className="card-cto">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Skills Radar</h2>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1f2937" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#6b7280", fontSize: 10 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Blocker */}
          {data.latestBlocker && (
            <div className="card-cto border-amber-500/20">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-amber-400 mb-1">Latest Blocker</p>
                  <p className="text-xs text-muted-foreground">{data.latestBlocker}</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick links */}
          <div className="card-cto">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</p>
            <div className="space-y-2">
              {[
                { href: "/coach", label: "Ask AI Coach a question", icon: "🤖" },
                { href: "/practice", label: "Generate practice exercise", icon: "💻" },
                { href: "/roadmap", label: "View full roadmap", icon: "🗺️" },
                { href: "/materials", label: "Add a resource", icon: "📚" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg px-2 py-1.5 transition-colors group"
                >
                  <span>{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
