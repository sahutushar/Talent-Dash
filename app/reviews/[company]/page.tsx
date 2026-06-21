import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ReviewCard } from "@/components/features/ReviewCard";
import { notFound } from "next/navigation";
import type { Review } from "@/types";

export const revalidate = 7200;

export async function generateStaticParams() {
  const companies = await prisma.company.findMany({ select: { slug: true } });
  return companies.map((c) => ({ company: c.slug }));
}

type Props = { params: Promise<{ company: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { company: slug } = await params;
  const company = await prisma.company.findUnique({ where: { slug } });
  if (!company) return { title: "Not Found" };
  return { title: `${company.name} Reviews — Employee Insights | TalentDash` };
}

export default async function CompanyReviewsPage({ params }: Props) {
  const { company: slug } = await params;
  const company = await prisma.company.findUnique({
    where: { slug },
    include: { reviews: { orderBy: { submitted_at: "desc" } } },
  });
  if (!company) notFound();

  const reviews: Review[] = company.reviews.map((r) => ({
    ...r,
    rating_overall: Number(r.rating_overall),
    rating_wlb: r.rating_wlb ? Number(r.rating_wlb) : null,
    rating_growth: r.rating_growth ? Number(r.rating_growth) : null,
    rating_mgmt: r.rating_mgmt ? Number(r.rating_mgmt) : null,
    rating_culture: r.rating_culture ? Number(r.rating_culture) : null,
    rating_compensation: r.rating_compensation ? Number(r.rating_compensation) : null,
    submitted_at: r.submitted_at.toISOString(),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-[#222222] mb-2">{company.name} Reviews</h1>
      <p className="text-[#717171] mb-8">{reviews.length} employee reviews</p>
      <div className="grid md:grid-cols-2 gap-4">
        {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
      </div>
      {reviews.length === 0 && <p className="text-center text-[#717171] py-16">No reviews yet for {company.name}.</p>}
    </div>
  );
}
