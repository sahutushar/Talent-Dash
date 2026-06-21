import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      company_id, role, level, location,
      rating_overall, rating_wlb, rating_culture, rating_compensation, rating_growth, rating_mgmt,
      title, pros, cons, would_recommend,
    } = body;

    if (!company_id || !title || !rating_overall) {
      return NextResponse.json({ message: "company_id, title, and rating_overall are required" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        company_id,
        role: role || null,
        level: level || null,
        location: location || null,
        rating_overall: Number(rating_overall),
        rating_wlb: rating_wlb ? Number(rating_wlb) : null,
        rating_culture: rating_culture ? Number(rating_culture) : null,
        rating_compensation: rating_compensation ? Number(rating_compensation) : null,
        rating_growth: rating_growth ? Number(rating_growth) : null,
        rating_mgmt: rating_mgmt ? Number(rating_mgmt) : null,
        title,
        pros: pros || null,
        cons: cons || null,
        would_recommend: would_recommend ?? true,
      },
      include: { company: true },
    });

    return NextResponse.json({
      ...review,
      rating_overall: Number(review.rating_overall),
      rating_wlb: review.rating_wlb ? Number(review.rating_wlb) : null,
      rating_culture: review.rating_culture ? Number(review.rating_culture) : null,
      rating_compensation: review.rating_compensation ? Number(review.rating_compensation) : null,
      rating_growth: review.rating_growth ? Number(review.rating_growth) : null,
      rating_mgmt: review.rating_mgmt ? Number(review.rating_mgmt) : null,
      submitted_at: review.submitted_at.toISOString(),
      company: {
        ...review.company,
        glassdoor_rating: review.company.glassdoor_rating ? Number(review.company.glassdoor_rating) : null,
        ambitionbox_rating: review.company.ambitionbox_rating ? Number(review.company.ambitionbox_rating) : null,
        talentdash_score: review.company.talentdash_score ? Number(review.company.talentdash_score) : null,
        created_at: review.company.created_at.toISOString(),
        updated_at: review.company.updated_at.toISOString(),
      },
    }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to submit review" }, { status: 500 });
  }
}
