import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const phases = await prisma.phase.findMany({
      orderBy: { number: "asc" },
      include: {
        weeks: {
          orderBy: { weekNumber: "asc" },
          include: {
            tasks: {
              orderBy: { dueDate: "asc" },
            },
          },
        },
      },
    });

    return NextResponse.json({ phases });
  } catch (error) {
    console.error("Roadmap fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch roadmap" }, { status: 500 });
  }
}
