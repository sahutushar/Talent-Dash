import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ReviewsFilter } from "@/components/features/ReviewsFilter";
import type { Review } from "@/types";

export const revalidate = 7200;

export const metadata: Metadata = {
  title: "Company Reviews — Work Culture, WLB & Management in India | TalentDash",
  description: "Anonymous employee reviews from Google, Amazon, TCS, Infosys and 100+ companies.",
};

export default async function ReviewsPage() {
  const rows = await prisma.review.findMany({
    orderBy: { submitted_at: "desc" },
    take: 50,
    include: { company: true },
  });

  const reviews = rows.map((r) => ({
    ...r,
    rating_overall: Number(r.rating_overall),
    rating_wlb: r.rating_wlb ? Number(r.rating_wlb) : null,
    rating_growth: r.rating_growth ? Number(r.rating_growth) : null,
    rating_mgmt: r.rating_mgmt ? Number(r.rating_mgmt) : null,
    rating_culture: r.rating_culture ? Number(r.rating_culture) : null,
    rating_compensation: r.rating_compensation ? Number(r.rating_compensation) : null,
    submitted_at: r.submitted_at.toISOString(),
    company: {
      ...r.company,
      glassdoor_rating: r.company.glassdoor_rating ? Number(r.company.glassdoor_rating) : null,
      ambitionbox_rating: r.company.ambitionbox_rating ? Number(r.company.ambitionbox_rating) : null,
      talentdash_score: r.company.talentdash_score ? Number(r.company.talentdash_score) : null,
      created_at: r.company.created_at.toISOString(),
      updated_at: r.company.updated_at.toISOString(),
    },
  }));

  const avgOverall =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating_overall, 0) / reviews.length
      : 0;
  const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating_overall) === star).length,
    pct:
      reviews.length > 0
        ? Math.round(
            (reviews.filter((r) => Math.round(r.rating_overall) === star).length /
              reviews.length) *
              100
          )
        : 0,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#222222]">Company Reviews</h1>
        <p className="text-[#717171] mt-1">
          Anonymous insights from employees at India&apos;s top companies.
        </p>
      </div>
      <ReviewsFilter
        reviews={reviews}
        avgOverall={avgOverall}
        ratingDist={ratingDist}
        recommendCount={0}
        verifiedCount={0}
        uniqueCompaniesCount={0}
      />
    </div>
  );
}
