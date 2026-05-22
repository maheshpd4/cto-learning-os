export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SkillArea } from "@prisma/client";

export async function GET() {
  try {
    // Latest score per area
    const latestScores = await prisma.$queryRaw<
      Array<{ area: string; score: number; date: Date }>
    >`
      SELECT DISTINCT ON (area) area, score, date
      FROM skill_scores
      ORDER BY area, date DESC
    `;

    // History for sparklines (last 10 per area)
    const history = await prisma.skillScore.findMany({
      orderBy: { date: "desc" },
      take: 70, // 7 areas × 10 data points
    });

    return NextResponse.json({ latestScores, history });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch skill scores" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { area, score, notes } = await request.json();

    if (!area || score === undefined) {
      return NextResponse.json({ error: "area and score are required" }, { status: 400 });
    }

    const skillScore = await prisma.skillScore.create({
      data: {
        area: area as SkillArea,
        score: Number(score),
        notes: notes || null,
      },
    });

    return NextResponse.json({ skillScore }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save skill score" }, { status: 500 });
  }
}
