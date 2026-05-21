"use client";

import { useEffect, useState, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { format, parseISO } from "date-fns";

// ── Types ──────────────────────────────────────────────────────
interface HealthLog {
  id: string;
  date: string;
  weightKg: number | null;
  steps: number | null;
  cardioMin: number | null;
  strengthMin: number | null;
  proteinG: number | null;
  waterL: number | null;
  sleepHrs: number | null;
  energyScore: number | null;
  foodScore: number | null;
  notes: string | null;
}

interface Biomarker {
  id: string;
  date: string;
  totalCholesterol: number | null;
  ldl: number | null;
  hdl: number | null;
  triglycerides: number | null;
  cholHdlRatio: number | null;
  vitaminD: number | null;
  vitaminB12: number | null;
  waistInch: number | null;
  notes: string | null;
}

interface WeekTarget {
  weekNumber: number;
  startDate: string;
  endDate: string;
  targetWeight: number;
}

interface Milestone {
  number: number;
  title: string;
  targetDate: string;
  targetWeightMin: number;
  targetWeightMax: number;
  targetTotalChol: number | null;
  targetLdl: number | null;
  targetVitaminD: number | null;
  targetVitaminB12: number | null;
  targetWaistMin: number | null;
  targetWaistMax: number | null;
  achieved: boolean;
}

interface Stats {
  currentWeek: number;
  daysSinceStart: number;
  latestWeight: number | null;
  baselineWeight: number;
  goalWeight: number;
  achieved: number;
  progressPct: number;
  currentWeekTarget: number | null;
}

interface HabitDay {
  date: string;
  score: number;
  max: number;
}

// ── Log form defaults ──────────────────────────────────────────
const emptyForm = {
  weightKg: "",
  steps: "",
  cardioMin: "",
  strengthMin: "",
  proteinG: "",
  waterL: "",
  sleepHrs: "",
  energyScore: "",
  foodScore: "",
  notes: "",
};

// ── Main page ─────────────────────────────────────────────────
export default function HealthPage() {
  const [logs, setLogs] = useState<HealthLog[]>([]);
  const [biomarkers, setBiomarkers] = useState<Biomarker[]>([]);
  const [weekTargets, setWeekTargets] = useState<WeekTarget[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [habitScore, setHabitScore] = useState<HabitDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "log" | "biomarkers">("dashboard");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/health/summary");
      const data = await res.json();
      setLogs(data.logs ?? []);
      setBiomarkers(data.biomarkers ?? []);
      setWeekTargets(data.weekTargets ?? []);
      setMilestones(data.milestones ?? []);
      setStats(data.stats ?? null);
      setHabitScore(data.habitScore ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload: Record<string, number | string | null> = {};
    if (form.weightKg)    payload.weightKg    = parseFloat(form.weightKg);
    if (form.steps)       payload.steps       = parseInt(form.steps);
    if (form.cardioMin)   payload.cardioMin   = parseInt(form.cardioMin);
    if (form.strengthMin) payload.strengthMin = parseInt(form.strengthMin);
    if (form.proteinG)    payload.proteinG    = parseFloat(form.proteinG);
    if (form.waterL)      payload.waterL      = parseFloat(form.waterL);
    if (form.sleepHrs)    payload.sleepHrs    = parseFloat(form.sleepHrs);
    if (form.energyScore) payload.energyScore = parseInt(form.energyScore);
    if (form.foodScore)   payload.foodScore   = parseInt(form.foodScore);
    if (form.notes)       payload.notes       = form.notes;

    await fetch("/api/health/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    setSaved(true);
    setForm(emptyForm);
    setTimeout(() => setSaved(false), 3000);
    fetchData();
  };

  // ── Weight chart data: week targets as reference + actual logs ──
  const weightChartData = weekTargets.map((wt) => {
    const matchLog = logs.find((l) => {
      const logDate = new Date(l.date);
      const wkEnd = new Date(wt.endDate);
      const wkStart = new Date(wt.startDate);
      return logDate >= wkStart && logDate <= wkEnd && l.weightKg != null;
    });
    return {
      week: `W${wt.weekNumber}`,
      target: wt.targetWeight,
      actual: matchLog?.weightKg ?? null,
    };
  });

  // ── Habit bar data ──────────────────────────────────────────
  const habitBarData = [...habitScore].reverse().map((h) => ({
    day: format(new Date(h.date), "EEE"),
    score: h.score,
    max: h.max,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-cyan-400 animate-pulse text-lg">Loading health data…</div>
      </div>
    );
  }

  const baseline = stats?.baselineWeight ?? 92;
  const goal     = stats?.goalWeight ?? 75;
  const current  = stats?.latestWeight;
  const lost     = current != null ? +(baseline - current).toFixed(1) : 0;
  const toGo     = current != null ? +(current - goal).toFixed(1) : baseline - goal;
  const pct      = stats?.progressPct ?? 0;

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>💪</span> Health Transformation
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            92 kg → 75 kg · May 24 – Nov 4, 2026 · 165 days ·{" "}
            <span className="text-cyan-400">Week {stats?.currentWeek ?? "?"} of 24</span>
          </p>
        </div>
        <div className="flex gap-2">
          {(["dashboard", "log", "biomarkers"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                activeTab === t
                  ? "bg-cyan-500 text-slate-900"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {t === "log" ? "Log Today" : t}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════ DASHBOARD TAB ══════════════════════ */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* KPI strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard
              label="Current Weight"
              value={current != null ? `${current} kg` : "—"}
              sub={`Target: ${stats?.currentWeekTarget ?? "—"} kg`}
              color="cyan"
            />
            <KpiCard
              label="Lost So Far"
              value={`${lost} kg`}
              sub={`${toGo} kg to go`}
              color="emerald"
            />
            <KpiCard
              label="Progress"
              value={`${pct}%`}
              sub="of 17 kg goal"
              color="violet"
            />
            <KpiCard
              label="Day"
              value={stats?.daysSinceStart != null ? `${stats.daysSinceStart + 1}` : "—"}
              sub="of 165"
              color="amber"
            />
          </div>

          {/* Progress bar */}
          <div className="card-cto p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 text-sm font-medium">Weight Loss Journey</span>
              <span className="text-cyan-400 text-sm">{pct}% complete</span>
            </div>
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Start: 92 kg</span>
              <span>Goal: 75 kg</span>
            </div>
          </div>

          {/* Weight chart */}
          <div className="card-cto p-4">
            <h3 className="text-white font-semibold mb-4">Weight Trajectory (24 Weeks)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={weightChartData} margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="week"
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  interval={3}
                />
                <YAxis
                  domain={[74, 93]}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  tickFormatter={(v) => `${v}`}
                />
                <Tooltip
                  contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8 }}
                  labelStyle={{ color: "#94a3b8" }}
                  formatter={(val: number | null, name: string) =>
                    val != null ? [`${val} kg`, name === "target" ? "Target" : "Actual"] : ["—", name]
                  }
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="target"
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#34d399"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#34d399" }}
                  connectNulls={false}
                  name="actual"
                />
                {/* Milestone lines */}
                {milestones.map((m) => (
                  <ReferenceLine
                    key={m.number}
                    x={`W${Math.ceil((new Date(m.targetDate).getTime() - new Date("2026-05-24").getTime()) / (7 * 86400000))}`}
                    stroke="#a78bfa"
                    strokeDasharray="4 4"
                    label={{ value: `M${m.number}`, fill: "#a78bfa", fontSize: 10 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Habit bar + milestones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Habit consistency */}
            <div className="card-cto p-4">
              <h3 className="text-white font-semibold mb-3">Habit Score — Last 7 Days</h3>
              {habitBarData.length > 0 ? (
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={habitBarData}>
                    <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <YAxis domain={[0, 7]} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8 }}
                      formatter={(v: number) => [`${v}/7`, "Habits"]}
                    />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                      {habitBarData.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={
                            entry.score >= 6 ? "#34d399" :
                            entry.score >= 4 ? "#38bdf8" :
                            entry.score >= 2 ? "#f59e0b" : "#f43f5e"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-500 text-sm mt-4">No logs yet — start logging today!</p>
              )}
              <p className="text-xs text-slate-500 mt-2">
                Tracked: 10k steps · 30min cardio · 130g protein · 3.5L water · 7h sleep · food score ≥7 · weight logged
              </p>
            </div>

            {/* Milestones */}
            <div className="card-cto p-4">
              <h3 className="text-white font-semibold mb-3">Blood Test Milestones</h3>
              <div className="space-y-3">
                {milestones.map((m) => (
                  <div key={m.number} className={`rounded-lg p-3 border ${m.achieved ? "border-emerald-500/40 bg-emerald-900/20" : "border-slate-700 bg-slate-800/50"}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{m.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${m.achieved ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-700 text-slate-400"}`}>
                        {m.achieved ? "✓ Done" : format(new Date(m.targetDate), "MMM d")}
                      </span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span>⚖️ {m.targetWeightMin}–{m.targetWeightMax} kg</span>
                      {m.targetTotalChol && <span>Chol &lt;{m.targetTotalChol}</span>}
                      {m.targetLdl && <span>LDL &lt;{m.targetLdl}</span>}
                      {m.targetVitaminD && <span>Vit D &gt;{m.targetVitaminD}</span>}
                      {m.targetWaistMin && <span>Waist {m.targetWaistMin}–{m.targetWaistMax}&quot;</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Latest biomarker */}
          {biomarkers.length > 0 && (
            <div className="card-cto p-4">
              <h3 className="text-white font-semibold mb-3">Latest Biomarkers</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Total Cholesterol", key: "totalCholesterol", unit: "mg/dL", target: "<180", danger: 264 },
                  { label: "LDL", key: "ldl", unit: "mg/dL", target: "<95", danger: 183 },
                  { label: "HDL", key: "hdl", unit: "mg/dL", target: ">55", danger: null },
                  { label: "Triglycerides", key: "triglycerides", unit: "mg/dL", target: "<100", danger: 126 },
                  { label: "Chol/HDL Ratio", key: "cholHdlRatio", unit: "", target: "<3.5", danger: 4.71 },
                  { label: "Vitamin D", key: "vitaminD", unit: "ng/mL", target: "45–60", danger: null },
                  { label: "Vitamin B12", key: "vitaminB12", unit: "pg/mL", target: "550–800", danger: null },
                  { label: "Waist", key: "waistInch", unit: '"', target: '34–35"', danger: null },
                ].map(({ label, key, unit, target }) => {
                  const latest = biomarkers[biomarkers.length - 1];
                  const baseline = biomarkers[0];
                  const val = (latest as Record<string, number | null>)[key];
                  const base = (baseline as Record<string, number | null>)[key];
                  return (
                    <div key={key} className="bg-slate-800/60 rounded-lg p-3">
                      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                      <p className="text-lg font-bold text-white">
                        {val != null ? `${val}${unit}` : "—"}
                      </p>
                      {base != null && base !== val && (
                        <p className="text-xs text-slate-500">
                          Baseline: {base}{unit}
                        </p>
                      )}
                      <p className="text-xs text-cyan-400 mt-0.5">Target: {target}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════ LOG TODAY TAB ══════════════════════ */}
      {activeTab === "log" && (
        <div className="card-cto p-6 max-w-2xl">
          <h2 className="text-white font-semibold text-lg mb-4">Log Today&apos;s Metrics</h2>
          <form onSubmit={handleLogSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <LogField label="Morning Weight (kg)" placeholder="e.g. 91.2" value={form.weightKg} onChange={(v) => setForm({ ...form, weightKg: v })} />
              <LogField label="Steps" placeholder="e.g. 10500" value={form.steps} onChange={(v) => setForm({ ...form, steps: v })} />
              <LogField label="Cardio (min)" placeholder="e.g. 35" value={form.cardioMin} onChange={(v) => setForm({ ...form, cardioMin: v })} />
              <LogField label="Strength (min)" placeholder="e.g. 45" value={form.strengthMin} onChange={(v) => setForm({ ...form, strengthMin: v })} />
              <LogField label="Protein (g)" placeholder="e.g. 140" value={form.proteinG} onChange={(v) => setForm({ ...form, proteinG: v })} />
              <LogField label="Water (L)" placeholder="e.g. 3.5" value={form.waterL} onChange={(v) => setForm({ ...form, waterL: v })} />
              <LogField label="Sleep (hrs)" placeholder="e.g. 7.5" value={form.sleepHrs} onChange={(v) => setForm({ ...form, sleepHrs: v })} />
              <LogField label="Energy (1-10)" placeholder="e.g. 7" value={form.energyScore} onChange={(v) => setForm({ ...form, energyScore: v })} />
              <LogField label="Food Score (1-10)" placeholder="e.g. 8" value={form.foodScore} onChange={(v) => setForm({ ...form, foodScore: v })} />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Notes (optional)</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="How did it go? Any observations..."
                rows={3}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save Log"}
              </button>
              {saved && <span className="text-emerald-400 text-sm">✓ Saved!</span>}
            </div>
          </form>

          {/* Recent logs table */}
          {logs.length > 0 && (
            <div className="mt-8">
              <h3 className="text-white font-medium mb-3">Recent Logs</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-500 text-xs">
                      <th className="text-left py-1 pr-3">Date</th>
                      <th className="text-right pr-3">Weight</th>
                      <th className="text-right pr-3">Steps</th>
                      <th className="text-right pr-3">Cardio</th>
                      <th className="text-right pr-3">Protein</th>
                      <th className="text-right pr-3">Sleep</th>
                      <th className="text-right">Energy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.slice(0, 10).map((l) => (
                      <tr key={l.id} className="border-t border-slate-800 text-slate-300">
                        <td className="py-1.5 pr-3 text-slate-400">
                          {format(new Date(l.date), "MMM d")}
                        </td>
                        <td className="text-right pr-3">{l.weightKg ?? "—"}</td>
                        <td className="text-right pr-3">{l.steps?.toLocaleString() ?? "—"}</td>
                        <td className="text-right pr-3">{l.cardioMin != null ? `${l.cardioMin}m` : "—"}</td>
                        <td className="text-right pr-3">{l.proteinG != null ? `${l.proteinG}g` : "—"}</td>
                        <td className="text-right pr-3">{l.sleepHrs != null ? `${l.sleepHrs}h` : "—"}</td>
                        <td className="text-right">{l.energyScore ?? "—"}/10</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════ BIOMARKERS TAB ══════════════════════ */}
      {activeTab === "biomarkers" && (
        <div className="space-y-4">
          <div className="card-cto p-4">
            <h2 className="text-white font-semibold mb-4">Blood Test History</h2>
            {biomarkers.length === 0 ? (
              <p className="text-slate-500 text-sm">No biomarker entries yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-500 text-xs border-b border-slate-700">
                      <th className="text-left py-2 pr-4">Date</th>
                      <th className="text-right pr-4">Total Chol</th>
                      <th className="text-right pr-4">LDL</th>
                      <th className="text-right pr-4">HDL</th>
                      <th className="text-right pr-4">Triglyc</th>
                      <th className="text-right pr-4">Vit D</th>
                      <th className="text-right pr-4">B12</th>
                      <th className="text-right">Waist</th>
                    </tr>
                  </thead>
                  <tbody>
                    {biomarkers.map((b) => (
                      <tr key={b.id} className="border-t border-slate-800 text-slate-300">
                        <td className="py-2 pr-4 text-slate-400">{format(new Date(b.date), "MMM d, yyyy")}</td>
                        <td className={`text-right pr-4 ${(b.totalCholesterol ?? 0) > 200 ? "text-rose-400" : "text-emerald-400"}`}>
                          {b.totalCholesterol ?? "—"}
                        </td>
                        <td className={`text-right pr-4 ${(b.ldl ?? 0) > 130 ? "text-rose-400" : "text-emerald-400"}`}>
                          {b.ldl ?? "—"}
                        </td>
                        <td className={`text-right pr-4 ${(b.hdl ?? 0) < 40 ? "text-rose-400" : "text-emerald-400"}`}>
                          {b.hdl ?? "—"}
                        </td>
                        <td className={`text-right pr-4 ${(b.triglycerides ?? 0) > 150 ? "text-rose-400" : "text-emerald-400"}`}>
                          {b.triglycerides ?? "—"}
                        </td>
                        <td className={`text-right pr-4 ${(b.vitaminD ?? 0) < 20 ? "text-rose-400" : "text-emerald-400"}`}>
                          {b.vitaminD ?? "—"}
                        </td>
                        <td className={`text-right pr-4 ${(b.vitaminB12 ?? 0) < 300 ? "text-amber-400" : "text-emerald-400"}`}>
                          {b.vitaminB12 ?? "—"}
                        </td>
                        <td className="text-right text-slate-300">{b.waistInch != null ? `${b.waistInch}"` : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Milestone targets reference */}
          <div className="card-cto p-4">
            <h3 className="text-white font-semibold mb-3">Target Reference by Milestone</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {milestones.map((m) => (
                <div key={m.number} className="bg-slate-800/60 rounded-lg p-4 border border-slate-700">
                  <p className="text-violet-400 text-xs font-semibold mb-1">{format(new Date(m.targetDate), "MMM d, yyyy")}</p>
                  <p className="text-white text-sm font-medium mb-2">{m.title}</p>
                  <ul className="space-y-1 text-xs text-slate-400">
                    <li>⚖️ Weight: {m.targetWeightMin}–{m.targetWeightMax} kg</li>
                    {m.targetTotalChol && <li>Chol: &lt;{m.targetTotalChol} mg/dL</li>}
                    {m.targetLdl && <li>LDL: &lt;{m.targetLdl} mg/dL</li>}
                    {m.targetVitaminD && <li>Vit D: &gt;{m.targetVitaminD} ng/mL</li>}
                    {m.targetVitaminB12 && <li>B12: &gt;{m.targetVitaminB12} pg/mL</li>}
                    {m.targetWaistMin && <li>Waist: {m.targetWaistMin}–{m.targetWaistMax}&quot;</li>}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────

function KpiCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: "cyan" | "emerald" | "violet" | "amber";
}) {
  const colorMap = {
    cyan:    "text-cyan-400",
    emerald: "text-emerald-400",
    violet:  "text-violet-400",
    amber:   "text-amber-400",
  };
  return (
    <div className="card-cto p-4">
      <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colorMap[color]}`}>{value}</p>
      <p className="text-slate-500 text-xs mt-0.5">{sub}</p>
    </div>
  );
}

function LogField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1">{label}</label>
      <input
        type="number"
        step="any"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
      />
    </div>
  );
}
