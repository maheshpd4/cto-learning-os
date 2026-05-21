import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/health/summary — dashboard data in one request
export async function GET() {
  try {
  const [
    logs,
    biomarkers,
    weekTargets,
    milestones,
  ] = await Promise.all([
    prisma.healthLog.findMany({
      orderBy: { date: "desc" },
      take: 30,
    }),
    prisma.biomarker.findMany({
      orderBy: { date: "asc" },
    }),
    prisma.healthWeekTarget.findMany({
      orderBy: { weekNumber: "asc" },
    }),
    prisma.healthMilestone.findMany({
      orderBy: { number: "asc" },
    }),
  ]);

  // Compute current week (health program started May 24 2026)
  const HEALTH_START = new Date("2026-05-24");
  const now = new Date();
  const daysSinceStart = Math.floor(
    (now.getTime() - HEALTH_START.getTime()) / (1000 * 60 * 60 * 24)
  );
  const currentWeek = Math.min(24, Math.max(1, Math.ceil((daysSinceStart + 1) / 7)));

  // Latest weight entry
  const latestLog = logs[0] ?? null;
  const latestWeight = latestLog?.weightKg ?? null;

  // Current week target
  const currentWeekTarget = weekTargets.find((w) => w.weekNumber === currentWeek);

  // Baseline weight
  const baselineWeight = 92.0;
  const goalWeight = 75.0;
  const totalLoss = baselineWeight - goalWeight; // 17 kg
  const achieved = latestWeight != null ? baselineWeight - latestWeight : 0;
  const progressPct = Math.min(100, Math.max(0, (achieved / totalLoss) * 100));

  // 7-day habit streak compute
  const last7 = logs.slice(0, 7);
  const habitScore = last7.map((l) => {
    let score = 0;
    if ((l.steps ?? 0) >= 10000)   score++;
    if ((l.cardioMin ?? 0) >= 30)  score++;
    if ((l.proteinG ?? 0) >= 130)  score++;
    if ((l.waterL ?? 0) >= 3.5)    score++;
    if ((l.sleepHrs ?? 0) >= 7)    score++;
    if ((l.foodScore ?? 0) >= 7)   score++;
    if (l.weightKg != null)        score++;
    return { date: l.date, score, max: 7 };
  });

  return NextResponse.json({
    logs,
    biomarkers,
    weekTargets,
    milestones,
    stats: {
      currentWeek,
      daysSinceStart,
      latestWeight,
      baselineWeight,
      goalWeight,
      achieved,
      progressPct: Math.round(progressPct * 10) / 10,
      currentWeekTarget: currentWeekTarget?.targetWeight ?? null,
    },
    habitScore,
  });
  } catch (err) {
    console.error("[health/summary]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
