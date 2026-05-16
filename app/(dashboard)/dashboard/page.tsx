import { prisma } from "@/lib/prisma";
import { SKILL_LABELS, SKILL_COLORS, daysUntil, pctComplete } from "@/lib/utils";
import { SkillArea } from "@prisma/client";
import { DashboardClient } from "./DashboardClient";

// Server component — fetches all data, passes to client
async function getDashboardData() {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  const [
    todayTasks,
    latestSkillScores,
    recentCheckins,
    activePhase,
    totalTasksThisWeek,
    completedTasksThisWeek,
    streaks,
  ] = await Promise.all([
    // Today's tasks
    prisma.dailyTask.findMany({
      where: {
        dueDate: { gte: todayStart, lt: todayEnd },
      },
      include: { week: { include: { phase: true } } },
      orderBy: { type: "asc" },
    }),

    // Latest skill score per area
    prisma.$queryRaw<Array<{ area: string; score: number; date: Date }>>`
      SELECT DISTINCT ON (area) area, score, date
      FROM skill_scores
      ORDER BY area, date DESC
    `,

    // Last 5 check-ins
    prisma.checkIn.findMany({
      orderBy: { date: "desc" },
      take: 5,
    }),

    // Active phase
    prisma.phase.findFirst({
      where: { status: "ACTIVE" },
      include: {
        weeks: {
          orderBy: { weekNumber: "asc" },
          take: 1,
        },
      },
    }),

    // This week's tasks total
    prisma.dailyTask.count({
      where: {
        dueDate: {
          gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
          lt: todayEnd,
        },
      },
    }),

    // This week completed
    prisma.dailyTask.count({
      where: {
        status: "COMPLETED",
        dueDate: {
          gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
          lt: todayEnd,
        },
      },
    }),

    // Recent streak days
    prisma.dailyStreak.findMany({
      orderBy: { date: "desc" },
      take: 14,
    }),
  ]);

  // Compute current streak count
  const sortedStreaks = [...streaks].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  let currentStreak = 0;
  for (const s of sortedStreaks) {
    if (s.completed) currentStreak++;
    else break;
  }

  // Build skill score map
  const skillMap: Record<string, number> = {};
  for (const s of latestSkillScores) {
    skillMap[s.area] = Math.round(s.score);
  }

  // Fill defaults for any missing areas
  for (const area of Object.values(SkillArea)) {
    if (!skillMap[area]) skillMap[area] = 0;
  }

  // Days to goal
  const goalDate = new Date("2026-11-04");
  const daysLeft = daysUntil(goalDate);
  const journeyPct = pctComplete(new Date("2026-05-15"), goalDate);

  // Weekly completion
  const weeklyPct = totalTasksThisWeek > 0
    ? Math.round((completedTasksThisWeek / totalTasksThisWeek) * 100)
    : 0;

  // Confidence trend (avg of last 5 check-ins)
  const avgConfidence = recentCheckins.length > 0
    ? Math.round(recentCheckins.reduce((sum, c) => sum + c.confidenceScore, 0) / recentCheckins.length * 10) / 10
    : null;

  // Today's blocker (from latest check-in)
  const latestBlocker = recentCheckins[0]?.blockers || null;

  return {
    todayTasks,
    skillScores: Object.entries(skillMap).map(([area, score]) => ({
      area,
      label: SKILL_LABELS[area] || area,
      score,
      color: SKILL_COLORS[area] || "#6b7280",
    })),
    currentStreak,
    weeklyPct,
    daysLeft,
    journeyPct,
    avgConfidence,
    latestBlocker,
    activePhase,
    recentCheckins,
    totalTasksToday: todayTasks.length,
    completedTasksToday: todayTasks.filter((t) => t.status === "COMPLETED").length,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  return <DashboardClient data={data} />;
}
