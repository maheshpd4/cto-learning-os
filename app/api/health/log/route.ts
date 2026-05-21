import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/health/log — fetch logs with optional ?limit=N
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") ?? "30");

  const logs = await prisma.healthLog.findMany({
    orderBy: { date: "desc" },
    take: limit,
  });

  return NextResponse.json({ logs });
}

// POST /api/health/log — upsert today's log
export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    date,
    weightKg,
    steps,
    cardioMin,
    strengthMin,
    proteinG,
    waterL,
    sleepHrs,
    energyScore,
    foodScore,
    notes,
  } = body;

  const logDate = date ? new Date(date) : new Date(new Date().toDateString());

  const log = await prisma.healthLog.upsert({
    where: { date: logDate },
    update: {
      weightKg:     weightKg     ?? undefined,
      steps:        steps        ?? undefined,
      cardioMin:    cardioMin    ?? undefined,
      strengthMin:  strengthMin  ?? undefined,
      proteinG:     proteinG     ?? undefined,
      waterL:       waterL       ?? undefined,
      sleepHrs:     sleepHrs     ?? undefined,
      energyScore:  energyScore  ?? undefined,
      foodScore:    foodScore    ?? undefined,
      notes:        notes        ?? undefined,
    },
    create: {
      date:         logDate,
      weightKg,
      steps,
      cardioMin,
      strengthMin,
      proteinG,
      waterL,
      sleepHrs,
      energyScore,
      foodScore,
      notes,
    },
  });

  return NextResponse.json({ log });
}
