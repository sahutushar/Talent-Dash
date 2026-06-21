import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { computeMedian } from "@/lib/salary";
import { CompaniesClient } from "@/components/features/CompaniesClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Top Tech Companies in India — Salaries, Reviews & Culture | TalentDash",
  description: "Browse 100+ companies. Compare salaries, reviews, and workplace culture at Google, Amazon, Flipkart, TCS, Infosys and more.",
};

export default async function CompaniesPage() {
  const companies = await prisma.company.findMany({
    include: {
      salaries: { select: { total_compensation: true } },
      reviews: { select: { rating_overall: true } },
      _count: { select: { salaries: true } },
    },
    orderBy: { talentdash_score: "desc" },
  });

  const enriched = companies.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    normalized_name: c.normalized_name,
    industry: c.industry,
    headquarters: c.headquarters,
    founded_year: c.founded_year,
    headcount_range: c.headcount_range,
    logo_url: c.logo_url,
    website: c.website,
    funding_stage: c.funding_stage,
    description: c.description,
    glassdoor_rating: c.glassdoor_rating ? Number(c.glassdoor_rating) : null,
    ambitionbox_rating: c.ambitionbox_rating ? Number(c.ambitionbox_rating) : null,
    talentdash_score: c.talentdash_score ? Number(c.talentdash_score) : null,
    created_at: c.created_at.toISOString(),
    updated_at: c.updated_at.toISOString(),
    salary_count: c._count.salaries,
    median_tc: computeMedian(c.salaries.map((s) => Number(s.total_compensation))),
    avg_rating: c.reviews.length > 0
      ? c.reviews.reduce((sum, r) => sum + Number(r.rating_overall), 0) / c.reviews.length
      : undefined,
  }));

  const industries = [...new Set(enriched.map((c) => c.industry).filter(Boolean))] as string[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#222222]">Companies</h1>
        <p className="text-[#717171] mt-1">Explore {enriched.length} companies — salaries, reviews, and culture scores.</p>
      </div>
      <CompaniesClient companies={enriched} industries={industries} />
    </div>
  );
}
