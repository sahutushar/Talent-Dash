import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { computeMedian } from "@/lib/salary";
import type { Level } from "@/types";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const company = await prisma.company.findUnique({
    where: { slug },
    include: {
      salaries: { orderBy: { total_compensation: "desc" } },
      reviews: { orderBy: { submitted_at: "desc" }, take: 20 },
      interviews: { orderBy: { submitted_at: "desc" }, take: 20 },
      workplace_score: true,
    },
  });

  if (!company) {
    return NextResponse.json({ error: true, message: "Company not found" }, { status: 404 });
  }

  const tcValues = company.salaries.map((s) => Number(s.total_compensation));
  const median_total_compensation = computeMedian(tcValues);

  const level_distribution: Partial<Record<Level, number>> = {};
  for (const s of company.salaries) {
    const l = s.level as Level;
    level_distribution[l] = (level_distribution[l] ?? 0) + 1;
  }

  const serialized = {
    ...company,
    glassdoor_rating: company.glassdoor_rating ? Number(company.glassdoor_rating) : null,
    ambitionbox_rating: company.ambitionbox_rating ? Number(company.ambitionbox_rating) : null,
    talentdash_score: company.talentdash_score ? Number(company.talentdash_score) : null,
    salaries: company.salaries.map((s) => ({
      ...s,
      base_salary: Number(s.base_salary),
      bonus: Number(s.bonus),
      stock: Number(s.stock),
      total_compensation: Number(s.total_compensation),
      confidence_score: Number(s.confidence_score),
    })),
    reviews: company.reviews.map((r) => ({
      ...r,
      rating_overall: Number(r.rating_overall),
      rating_wlb: r.rating_wlb ? Number(r.rating_wlb) : null,
      rating_growth: r.rating_growth ? Number(r.rating_growth) : null,
      rating_mgmt: r.rating_mgmt ? Number(r.rating_mgmt) : null,
      rating_culture: r.rating_culture ? Number(r.rating_culture) : null,
      rating_compensation: r.rating_compensation ? Number(r.rating_compensation) : null,
    })),
    workplace_score: company.workplace_score ? {
      ...company.workplace_score,
      score_compensation: Number(company.workplace_score.score_compensation),
      score_wlb: Number(company.workplace_score.score_wlb),
      score_growth: Number(company.workplace_score.score_growth),
      score_culture: Number(company.workplace_score.score_culture),
      score_dei: Number(company.workplace_score.score_dei),
      score_remote: Number(company.workplace_score.score_remote),
      composite_score: Number(company.workplace_score.composite_score),
    } : null,
    median_total_compensation,
    level_distribution,
    salary_count: company.salaries.length,
  };

  return NextResponse.json(serialized, {
    headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" },
  });
}
