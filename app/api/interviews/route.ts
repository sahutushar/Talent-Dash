import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      company_id, role, level, location,
      difficulty, outcome, rounds, tips, years_experience,
    } = body;

    if (!company_id || !role || !difficulty || !outcome) {
      return NextResponse.json(
        { message: "company_id, role, difficulty, and outcome are required" },
        { status: 400 }
      );
    }

    const interview = await prisma.interview.create({
      data: {
        company_id,
        role,
        level: level || null,
        location: location || null,
        difficulty,
        outcome,
        rounds: rounds?.length ? rounds : null,
        tips: tips || null,
        years_experience: years_experience ? Number(years_experience) : null,
      },
      include: { company: true },
    });

    return NextResponse.json({
      ...interview,
      submitted_at: interview.submitted_at.toISOString(),
      company: {
        ...interview.company,
        glassdoor_rating: interview.company.glassdoor_rating ? Number(interview.company.glassdoor_rating) : null,
        ambitionbox_rating: interview.company.ambitionbox_rating ? Number(interview.company.ambitionbox_rating) : null,
        talentdash_score: interview.company.talentdash_score ? Number(interview.company.talentdash_score) : null,
        created_at: interview.company.created_at.toISOString(),
        updated_at: interview.company.updated_at.toISOString(),
      },
    }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to submit interview experience" }, { status: 500 });
  }
}
