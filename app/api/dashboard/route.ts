import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateText } from "@/lib/gemini";

export async function GET() {
  try {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [todayTasks, weekTasks, latestCheckin, currentStreak] = await Promise.all([
      prisma.dailyTask.findMany({
        where: { dueDate: { gte: todayStart, lt: todayEnd } },
        include: { week: { include: { phase: true } } },
      }),
      prisma.dailyTask.findMany({
        where: { dueDate: { gte: weekAgo, lt: todayEnd } },
      }),
      prisma.checkIn.findFirst({ orderBy: { date: "desc" } }),
      prisma.dailyStreak.findMany({ orderBy: { date: "desc" }, take: 30 }),
    ]);

    // Compute streak
    let streak = 0;
    for (const day of currentStreak) {
      if (day.completed) streak++;
      else break;
    }

    const weekCompleted = weekTasks.filter((t) => t.status === "COMPLETED").length;
    const weekTotal = weekTasks.length;

    // Generate today's AI recommendation
    let aiRecommendation: string | null = null;
    if (latestCheckin) {
      try {
        aiRecommendation = await generateText(
          `Based on yesterday's check-in where the student studied: "${latestCheckin.studiedTopics}" and found unclear: "${latestCheckin.unclearConcepts}", give ONE specific, actionable recommendation for today in 2 sentences maximum. Be direct and CTO-level.`
        );
      } catch {
        // Best-effort
      }
    }

    return NextResponse.json({
      todayTasks,
      todayCompleted: todayTasks.filter((t) => t.status === "COMPLETED").length,
      todayTotal: todayTasks.length,
      weekCompleted,
      weekTotal,
      weekPct: weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0,
      currentStreak: streak,
      latestConfidence: latestCheckin?.confidenceScore || null,
      aiRecommendation,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
  }
}
