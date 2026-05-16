"use client";

import { useState } from "react";
import { Code2, Loader2, Sparkles, ChevronDown, ChevronRight, Zap } from "lucide-react";
import { cn, SKILL_LABELS } from "@/lib/utils";

interface Exercise {
  concept: string;
  beginnerTask: string;
  beginnerHints: string[];
  intermediateTask: string;
  intermediateHints: string[];
  architectTask: string;
  sampleCode: string;
  expectedOutput: string;
  realWorldScenario: string;
  interviewQuestion: string;
  interviewAnswer: string;
}

const EXAMPLE_CONCEPTS = [
  "Kafka retry and dead letter queue",
  "RAG pipeline with pgvector",
  "Distributed rate limiting with Redis",
  "SAGA pattern for distributed transactions",
  "LLM prompt caching strategy",
  "Kubernetes HPA with custom metrics",
  "Event sourcing with CQRS",
  "Zero-trust service-to-service auth",
];

export default function PracticePage() {
  const [concept, setConcept] = useState("");
  const [skillArea, setSkillArea] = useState("ENTERPRISE_INTEGRATION");
  const [loading, setLoading] = useState(false);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [expandedLevel, setExpandedLevel] = useState<string | null>("beginner");

  const generate = async () => {
    if (!concept.trim()) return;
    setLoading(true);
    setExercise(null);
    try {
      const res = await fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concept, skillArea }),
      });
      const data = await res.json();
      setExercise(data.exercise);
      setExpandedLevel("beginner");
    } finally {
      setLoading(false);
    }
  };

  const LEVELS = [
    { key: "beginner", label: "🌱 Beginner", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", task: exercise?.beginnerTask, hints: exercise?.beginnerHints },
    { key: "intermediate", label: "⚡ Intermediate", color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10", task: exercise?.intermediateTask, hints: exercise?.intermediateHints },
    { key: "architect", label: "🏛️ Architect Level", color: "text-violet-400 border-violet-500/30 bg-violet-500/10", task: exercise?.architectTask, hints: [] },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Coding Practice Engine</h1>
        <p className="text-muted-foreground text-sm mt-1">AI-generated exercises at 3 levels for any concept</p>
      </div>

      {/* Input */}
      <div className="card-cto space-y-4">
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Concept</label>
          <input
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generate()}
            placeholder="e.g., Kafka retry and dead letter queue"
            className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Example concepts */}
        <div className="flex flex-wrap gap-1.5">
          {EXAMPLE_CONCEPTS.map((c) => (
            <button key={c} onClick={() => setConcept(c)}
              className="text-xs px-2.5 py-1 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
              {c}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <select value={skillArea} onChange={(e) => setSkillArea(e.target.value)}
            className="flex-1 bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
            {Object.entries(SKILL_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <button
            onClick={generate}
            disabled={loading || !concept.trim()}
            className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>

      {/* Results */}
      {exercise && (
        <div className="space-y-4 animate-slide-up">
          {/* Practice levels */}
          {LEVELS.map(({ key, label, color, task, hints }) => (
            <div key={key} className={cn("rounded-xl border", expandedLevel === key ? color : "border-border bg-card")}>
              <button
                className="w-full flex items-center gap-3 p-4 text-left"
                onClick={() => setExpandedLevel(expandedLevel === key ? null : key)}
              >
                <span className="text-sm font-bold">{label}</span>
                {expandedLevel === key
                  ? <ChevronDown className="h-4 w-4 text-muted-foreground ml-auto" />
                  : <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                }
              </button>
              {expandedLevel === key && task && (
                <div className="px-4 pb-4 space-y-3 border-t border-border/30 pt-3">
                  <p className="text-sm text-foreground leading-relaxed">{task}</p>
                  {hints && hints.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1.5">💡 Hints</p>
                      <ul className="space-y-1">
                        {hints.map((hint, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                            <Zap className="h-3 w-3 mt-0.5 shrink-0 text-primary" />
                            {hint}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Sample code */}
          {exercise.sampleCode && (
            <div className="card-cto">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">📝 Sample Solution</p>
              <pre className="code-block text-xs overflow-x-auto">
                <code>{exercise.sampleCode}</code>
              </pre>
              {exercise.expectedOutput && (
                <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Expected Output</p>
                  <pre className="text-xs text-foreground/80 font-mono">{exercise.expectedOutput}</pre>
                </div>
              )}
            </div>
          )}

          {/* Real-world scenario */}
          {exercise.realWorldScenario && (
            <div className="card-cto border-cyan-500/20">
              <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">🌍 Real-World Usage</p>
              <p className="text-sm text-foreground/80">{exercise.realWorldScenario}</p>
            </div>
          )}

          {/* Interview Q&A */}
          {exercise.interviewQuestion && (
            <div className="card-cto border-violet-500/20 space-y-3">
              <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider">🎯 Interview Question</p>
              <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <p className="text-sm font-medium text-foreground">{exercise.interviewQuestion}</p>
              </div>
              {exercise.interviewAnswer && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Model Answer (Senior Candidate):</p>
                  <p className="text-sm text-foreground/80 leading-relaxed">{exercise.interviewAnswer}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
