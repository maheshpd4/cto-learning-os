export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/health/biomarkers — all biomarker entries sorted by date
export async function GET() {
  const biomarkers = await prisma.biomarker.findMany({
    orderBy: { date: "asc" },
  });

  return NextResponse.json({ biomarkers });
}

// POST /api/health/biomarkers — add a new biomarker snapshot
export async function POST(req: NextRequest) {
  const body = await req.json();

  const entry = await prisma.biomarker.create({
    data: {
      date:            new Date(body.date),
      totalCholesterol: body.totalCholesterol ?? null,
      ldl:             body.ldl              ?? null,
      hdl:             body.hdl              ?? null,
      triglycerides:   body.triglycerides    ?? null,
      cholHdlRatio:    body.cholHdlRatio     ?? null,
      vitaminD:        body.vitaminD         ?? null,
      vitaminB12:      body.vitaminB12       ?? null,
      fastingGlucose:  body.fastingGlucose   ?? null,
      waistInch:       body.waistInch        ?? null,
      notes:           body.notes            ?? null,
    },
  });

  return NextResponse.json({ entry });
}
