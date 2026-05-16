"use client";

import { useState } from "react";
import { CheckCircle2, ChevronRight, ChevronLeft, Loader2, Sparkles, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckInResult {
  summary: string;
  corrections: string;
  strengths: string[];
  weakAreas: string[];
  nextDayPlan: string[];
  suggestedPractice: string;
  interviewQuestions: string[];
  coachNote: string;
}

const STEPS = [
  { id: 1, label: "Study", question: "What did you study today?", placeholder: "e.g., Studied Kafka consumer groups and partition assignment strategies. Read about ISR and leader election..." },
  { id: 2, label: "Build", question: "What did you build or create?", placeholder: "e.g., Built a Kafka producer in Python with retry logic. Set up a 3-broker cluster with Docker Compose..." },
  { id: 3, label: "Clarity", question: "What concept is still unclear?", placeholder: "e.g., Not fully clear on exactly-once semantics and how idempotent producers work with transactions..." },
  { id: 4, label: "Code", question: "Paste any code you wrote (optional)", placeholder: "# Paste your code here for AI review...", isTextarea: true, optional: true },
  { id: 5, label: "Blockers", question: "What blockers did you face?", placeholder: "e.g., Couldn't get Kafka to start due to KRaft mode configuration. Spent 2h debugging port conflicts...", optional: true },
  { id: 6, label: "Confidence", question: "Rate your confidence today (1-10)", isSlider: true },
];

export default function CheckInPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    studiedTopics: "",
    builtThings: "",
    unclearConcepts: "",
    codeWritten: "",
    blockers: "",
    confidenceScore: 7,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const keys = ["studiedTopics", "builtThings", "unclearConcepts", "codeWritten", "blockers"] as const;
  const currentStep = STEPS[step];
  const isLastStep = step === STEPS.length - 1;

  const updateAnswer = (value: string | number) => {
    if (step < STEPS.length - 1) {
      setAnswers((prev) => ({ ...prev, [keys[step]]: value as string }));
    } else {
      setAnswers((prev) => ({ ...prev, confidenceScore: value as number }));
    }
  };

  const getCurrentValue = () => {
    if (step < STEPS.length - 1) return answers[keys[step]];
    return answers.confidenceScore;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      const data = await res.json();
      if (data.aiSummary) {
        try {
          const parsed = JSON.parse(data.aiSummary);
          setResult(parsed);
        } catch {
          setResult({
            summary: data.aiSummary,
            corrections: data.aiCorrections || "",
            strengths: [],
            weakAreas: data.weakAreasDetected || [],
            nextDayPlan: data.nextDayPlan ? [data.nextDayPlan] : [],
            suggestedPractice: data.suggestedPractice || "",
            interviewQuestions: data.interviewQuestions ? JSON.parse(data.interviewQuestions) : [],
            coachNote: "",
          });
        }
      }
      setSubmitted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const confidenceColor = (score: number) => {
    if (score >= 8) return "text-emerald-400";
    if (score >= 6) return "text-cyan-400";
    if (score >= 4) return "text-amber-400";
    return "text-red-400";
  };

  const confidenceLabel = (score: number) => {
    if (score >= 9) return "Crushing it! 🚀";
    if (score >= 7) return "Strong day 💪";
    if (score >= 5) return "Making progress 📈";
    if (score >= 3) return "Tough day, keep going 🔥";
    return "We'll rebuild tomorrow 🛠️";
  };

  // Submitted — show AI result
  if (submitted && result) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30 mx-auto mb-3">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Check-in Complete!</h1>
          <p className="text-muted-foreground text-sm mt-1">Here's your AI coach's analysis</p>
        </div>

        {/* Summary */}
        <div className="card-cto border-primary/20">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Today's Summary</h3>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">{result.summary}</p>
        </div>

        {/* Strengths & Weak Areas */}
        <div className="grid grid-cols-2 gap-4">
          {result.strengths?.length > 0 && (
            <div className="card-cto border-emerald-500/20">
              <p className="text-xs font-semibold text-emerald-400 mb-2">✅ Strengths</p>
              <ul className="space-y-1">
                {result.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-foreground/80">• {s}</li>
                ))}
              </ul>
            </div>
          )}
          {result.weakAreas?.length > 0 && (
            <div className="card-cto border-amber-500/20">
              <p className="text-xs font-semibold text-amber-400 mb-2">⚠️ Areas to Focus</p>
              <ul className="space-y-1">
                {result.weakAreas.map((w, i) => (
                  <li key={i} className="text-xs text-foreground/80">• {w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Corrections */}
        {result.corrections && result.corrections !== "Concepts look solid." && (
          <div className="card-cto border-amber-500/20">
            <p className="text-xs font-semibold text-amber-400 mb-2">📝 Coach Corrections</p>
            <p className="text-sm text-foreground/80">{result.corrections}</p>
          </div>
        )}

        {/* Tomorrow's Plan */}
        {result.nextDayPlan?.length > 0 && (
          <div className="card-cto border-cyan-500/20">
            <p className="text-xs font-semibold text-cyan-400 mb-3">🗓️ Tomorrow's Plan</p>
            <ol className="space-y-2">
              {result.nextDayPlan.map((task, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="text-foreground/90">{task}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Suggested Practice */}
        {result.suggestedPractice && (
          <div className="card-cto border-violet-500/20">
            <p className="text-xs font-semibold text-violet-400 mb-2">💻 Practice Challenge</p>
            <p className="text-sm text-foreground/80">{result.suggestedPractice}</p>
          </div>
        )}

        {/* Interview Questions */}
        {result.interviewQuestions?.length > 0 && (
          <div className="card-cto">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-4 w-4 text-violet-400" />
              <p className="text-xs font-semibold text-violet-400">Interview Questions from Today's Topics</p>
            </div>
            <ol className="space-y-2">
              {result.interviewQuestions.map((q, i) => (
                <li key={i} className="text-sm text-foreground/80 border-l-2 border-violet-500/30 pl-3 py-1">
                  {q}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Coach note */}
        {result.coachNote && (
          <div className="card-cto border-primary/20 bg-primary/5">
            <p className="text-xs font-semibold text-primary mb-1">🎯 Coach Note</p>
            <p className="text-sm text-foreground/90 italic">"{result.coachNote}"</p>
          </div>
        )}

        <button
          onClick={() => { setSubmitted(false); setResult(null); setStep(0); setAnswers({ studiedTopics: "", builtThings: "", unclearConcepts: "", codeWritten: "", blockers: "", confidenceScore: 7 }); }}
          className="w-full py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          New Check-in
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Daily Check-in</h1>
        <p className="text-muted-foreground text-sm mt-1">
          End-of-day reflection · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Step {step + 1} of {STEPS.length}</span>
          <span>{STEPS[step].label}</span>
        </div>
        <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-1 mt-3">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => i <= step && setStep(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-200",
                i < step ? "bg-primary/60 flex-1 cursor-pointer"
                : i === step ? "bg-primary flex-1"
                : "bg-muted/40 flex-1 cursor-not-allowed"
              )}
            />
          ))}
        </div>
      </div>

      {/* Question card */}
      <div className="card-cto border-primary/20 mb-6">
        <p className="text-base font-semibold text-foreground mb-4">{currentStep.question}</p>

        {currentStep.isSlider ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">1 — Rough</span>
              <span className={cn("text-4xl font-bold tabular-nums", confidenceColor(answers.confidenceScore))}>
                {answers.confidenceScore}
              </span>
              <span className="text-xs text-muted-foreground">10 — Excellent</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={answers.confidenceScore}
              onChange={(e) => updateAnswer(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <p className={cn("text-center text-sm font-medium", confidenceColor(answers.confidenceScore))}>
              {confidenceLabel(answers.confidenceScore)}
            </p>
          </div>
        ) : currentStep.isTextarea ? (
          <textarea
            rows={8}
            value={getCurrentValue() as string}
            onChange={(e) => updateAnswer(e.target.value)}
            placeholder={currentStep.placeholder}
            className="w-full bg-muted/30 border border-border rounded-lg p-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        ) : (
          <textarea
            rows={4}
            value={getCurrentValue() as string}
            onChange={(e) => updateAnswer(e.target.value)}
            placeholder={currentStep.placeholder}
            className="w-full bg-muted/30 border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        )}

        {currentStep.optional && (
          <p className="text-xs text-muted-foreground mt-2">Optional — skip if not applicable</p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-1 px-4 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
        )}
        <button
          onClick={() => {
            if (isLastStep) handleSubmit();
            else setStep(step + 1);
          }}
          disabled={loading || (!currentStep.optional && !currentStep.isSlider && !(getCurrentValue() as string).trim())}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors",
            "bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing with AI...</>
          ) : isLastStep ? (
            <><Sparkles className="h-4 w-4" /> Submit & Get AI Analysis</>
          ) : (
            <>Next <ChevronRight className="h-4 w-4" /></>
          )}
        </button>
      </div>
    </div>
  );
}
