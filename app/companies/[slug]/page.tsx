import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { computeMedian, formatSalary } from "@/lib/salary";
import { SalaryTable } from "@/components/features/SalaryTable";
import { ReviewCard } from "@/components/features/ReviewCard";
import { InterviewCard } from "@/components/features/InterviewCard";
import { LevelDistribution } from "@/components/features/LevelDistribution";
import { RatingBar } from "@/components/ui/RatingBar";
import { StarRating } from "@/components/ui/StarRating";
import { LEVEL_LABELS, LEVEL_COLORS } from "@/lib/config";
import type { Level, Salary, Review, Interview } from "@/types";
import { AddSalaryButton } from "@/components/features/AddSalaryButton";

export const revalidate = 3600;

export async function generateStaticParams() {
  const companies = await prisma.company.findMany({ select: { slug: true } });
  return companies.map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = await prisma.company.findUnique({ where: { slug } });
  if (!company) return { title: "Company Not Found" };
  return {
    title: `${company.name} Salaries, Reviews & Culture | TalentDash`,
    description: `Explore salaries, reviews, and interview experiences at ${company.name}. Real data from employees in ${company.headquarters ?? "India"}.`,
    openGraph: { title: `${company.name} | TalentDash` },
  };
}

const PERKS_MAP: Record<string, string[]> = {
  google: ["Free gourmet meals", "Health & dental insurance", "₹1L+ learning budget", "Parental leave 18 weeks", "On-site gym", "ESOPs"],
  amazon: ["Sign-on bonus", "RSU vesting schedule", "Health insurance", "Relocation support", "Employee discount"],
  meta: ["Free meals & snacks", "Unlimited PTO", "Mental health support", "Home office stipend", "RSUs", "Fertility benefits"],
  microsoft: ["Health & vision insurance", "Employee stock purchase", "Flexible work hours", "Learning & dev budget", "Hybrid work"],
  flipkart: ["Health insurance", "ESOPs", "Flexible work", "Team offsites", "Performance bonus"],
  meesho: ["ESOPs", "Health insurance", "Free meals", "Flexible hours", "Remote-friendly"],
  nvidia: ["Competitive RSUs", "Premium health cover", "Free EV charging", "Learning budget", "Gym membership"],
  tcs: ["PF & Gratuity", "Health insurance", "Training programs", "Sabbatical leave", "Housing loan"],
  infosys: ["PF & Gratuity", "Health insurance", "Infosys BPM training", "Annual bonus", "Flexi-time"],
  wipro: ["PF & Gratuity", "Health insurance", "Wipro WASE program", "Performance bonus"],
  razorpay: ["ESOPs", "Health & dental", "Free meals", "Learning budget ₹50K/yr", "Flexible work"],
  zepto: ["ESOPs", "Health insurance", "Meal vouchers", "Fast-paced growth", "Performance bonus"],
};

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params;

  const company = await prisma.company.findUnique({
    where: { slug },
    include: {
      salaries: { orderBy: { total_compensation: "desc" } },
      reviews: { orderBy: { submitted_at: "desc" } },
      interviews: { orderBy: { submitted_at: "desc" } },
      workplace_score: true,
    },
  });

  if (!company) notFound();

  // Similar companies (same industry, excluding self)
  const similar = await prisma.company.findMany({
    where: { industry: company.industry ?? undefined, slug: { not: slug } },
    take: 4,
    orderBy: { talentdash_score: "desc" },
  });

  const salaries: Salary[] = company.salaries.map((s) => ({
    ...s,
    base_salary: Number(s.base_salary),
    bonus: Number(s.bonus),
    stock: Number(s.stock),
    total_compensation: Number(s.total_compensation),
    confidence_score: Number(s.confidence_score),
    submitted_at: s.submitted_at.toISOString(),
  }));

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

  const interviews: Interview[] = company.interviews.map((i) => ({
    ...i,
    submitted_at: i.submitted_at.toISOString(),
    rounds: i.rounds as Interview["rounds"],
  }));

  const tcValues = salaries.map((s) => s.total_compensation);
  const medianTC = computeMedian(tcValues);
  const minTC = tcValues.length > 0 ? Math.min(...tcValues) : 0;
  const maxTC = tcValues.length > 0 ? Math.max(...tcValues) : 0;

  // Salary by level
  const byLevel: Partial<Record<Level, Salary[]>> = {};
  for (const s of salaries) {
    if (!byLevel[s.level]) byLevel[s.level] = [];
    byLevel[s.level]!.push(s);
  }

  const levelDist: Partial<Record<Level, number>> = {};
  for (const [lvl, entries] of Object.entries(byLevel)) {
    levelDist[lvl as Level] = entries!.length;
  }

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating_overall, 0) / reviews.length
    : null;

  const ratingAvg = (key: keyof Review) => {
    const filtered = reviews.filter((r) => r[key] != null);
    return filtered.length > 0 ? filtered.reduce((s, r) => s + (r[key] as number), 0) / filtered.length : 0;
  };

  const ws = company.workplace_score;
  const perks = PERKS_MAP[slug] ?? [];

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "salaries", label: `Salaries (${salaries.length})` },
    { id: "reviews", label: `Reviews (${reviews.length})` },
    { id: "interviews", label: `Interviews (${interviews.length})` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": company.name,
    "url": company.website ?? undefined,
    "foundingYear": company.founded_year ?? undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <div className="bg-white border-b border-[#EBEBEB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-start gap-4 sm:gap-5 mb-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#F7F7F7] border border-[#EBEBEB] rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold text-[#222222] shrink-0">
              {company.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#222222] truncate">{company.name}</h1>
                  <p className="text-[#717171] mt-0.5 text-sm">
                    {[company.industry, company.headquarters, company.founded_year ? `Est. ${company.founded_year}` : null, company.headcount_range].filter(Boolean).join(" · ")}
                  </p>
                  {avgRating && <div className="mt-1.5"><StarRating value={avgRating} count={reviews.length} /></div>}
                </div>
                <div className="flex gap-2 shrink-0 flex-wrap">
                  <Link href={`/compare?c1=${slug}`} className="px-3 sm:px-4 py-2 border border-[#EBEBEB] text-sm font-medium text-[#484848] rounded-lg hover:bg-[#F7F7F7] whitespace-nowrap">
                    Compare
                  </Link>
                  <AddSalaryButton company={company.name} />
                </div>
              </div>
            </div>
          </div>
          {/* Tab nav - scrollable on mobile */}
          <div className="flex gap-0 border-b border-[#EBEBEB] -mb-px overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <a key={tab.id} href={`#${tab.id}`} className="px-3 sm:px-4 py-2.5 text-sm font-medium text-[#484848] border-b-2 border-transparent hover:border-[#FF5A5F] hover:text-[#FF5A5F] transition-colors whitespace-nowrap">
                {tab.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">

        {/* Overview */}
        <section id="overview" className="scroll-mt-20">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Compensation */}
            <div className="md:col-span-2 bg-white border border-[#EBEBEB] rounded-xl p-6">
              <h2 className="text-lg font-semibold text-[#222222] mb-4">Compensation Overview</h2>
              <div className="flex flex-wrap gap-6 mb-6">
                <div>
                  <p className="text-xs text-[#717171] uppercase tracking-wide mb-1">Median TC</p>
                  <p className="text-3xl font-bold text-[#0369A1]">{medianTC > 0 ? formatSalary(medianTC, "INR") : "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#717171] uppercase tracking-wide mb-1">Range</p>
                  <p className="text-lg font-semibold text-[#222222]">{minTC > 0 ? `${formatSalary(minTC, "INR")} – ${formatSalary(maxTC, "INR")}` : "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#717171] uppercase tracking-wide mb-1">Data Points</p>
                  <p className="text-lg font-semibold text-[#222222]">{salaries.length}</p>
                </div>
              </div>
              {Object.keys(levelDist).length > 0 && (
                <div>
                  <p className="text-xs text-[#717171] uppercase tracking-wide mb-2">Level Distribution</p>
                  <LevelDistribution distribution={levelDist} />
                </div>
              )}
            </div>

            {/* Culture */}
            <div className="bg-white border border-[#EBEBEB] rounded-xl p-6">
              <h2 className="text-lg font-semibold text-[#222222] mb-4">Culture Scores</h2>
              {reviews.length > 0 ? (
                <div className="space-y-3">
                  <RatingBar label="Work-Life Balance" value={ratingAvg("rating_wlb")} />
                  <RatingBar label="Career Growth" value={ratingAvg("rating_growth")} />
                  <RatingBar label="Management" value={ratingAvg("rating_mgmt")} />
                  <RatingBar label="Culture" value={ratingAvg("rating_culture")} />
                </div>
              ) : (
                <p className="text-sm text-[#717171]">No reviews yet.</p>
              )}
              {ws && (
                <div className="mt-4 pt-4 border-t border-[#EBEBEB]">
                  <p className="text-xs text-[#717171] uppercase tracking-wide mb-1">Workplace Index</p>
                  <p className="text-2xl font-bold text-[#222222]">{Number(ws.composite_score).toFixed(1)}<span className="text-sm font-normal text-[#717171]">/100</span></p>
                </div>
              )}
            </div>
          </div>

          {/* Quick facts */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Industry", value: company.industry ?? "—" },
              { label: "Headquarters", value: company.headquarters ?? "—" },
              { label: "Founded", value: company.founded_year ? String(company.founded_year) : "—" },
              { label: "Headcount", value: company.headcount_range ?? "—" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white border border-[#EBEBEB] rounded-xl p-4">
                <p className="text-xs text-[#717171] uppercase tracking-wide">{label}</p>
                <p className="text-sm font-semibold text-[#222222] mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {/* Perks */}
          {perks.length > 0 && (
            <div className="mt-6 bg-white border border-[#EBEBEB] rounded-xl p-6">
              <h2 className="text-lg font-semibold text-[#222222] mb-3">Perks & Benefits</h2>
              <div className="flex flex-wrap gap-2">
                {perks.map((p) => (
                  <span key={p} className="px-3 py-1.5 bg-[#F7F7F7] border border-[#EBEBEB] text-sm text-[#484848] rounded-full">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Salary by Level */}
        {Object.keys(byLevel).length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-[#222222] mb-4">Salary by Level</h2>
            <div className="bg-white border border-[#EBEBEB] rounded-xl p-6 space-y-3">
              {(Object.entries(byLevel) as [Level, Salary[]][])
                .sort((a, b) => computeMedian(b[1].map(s => s.total_compensation)) - computeMedian(a[1].map(s => s.total_compensation)))
                .map(([level, entries]) => {
                  const med = computeMedian(entries.map((s) => s.total_compensation));
                  const pct = maxTC > 0 ? Math.round((med / maxTC) * 100) : 0;
                  const avgBase = Math.round(entries.reduce((s, e) => s + e.base_salary, 0) / entries.length);
                  const avgBonus = Math.round(entries.reduce((s, e) => s + e.bonus, 0) / entries.length);
                  const avgStock = Math.round(entries.reduce((s, e) => s + e.stock, 0) / entries.length);
                  return (
                    <div key={level} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-2 border-b border-[#EBEBEB] last:border-0">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit ${LEVEL_COLORS[level]}`}>
                        {LEVEL_LABELS[level]}
                      </span>
                      <div className="flex-1 h-2 bg-[#EBEBEB] rounded-full overflow-hidden">
                        <div className="h-full bg-[#0369A1] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex gap-4 text-xs text-[#717171] shrink-0 flex-wrap">
                        <span>Base <span className="font-semibold text-[#222222]">{formatSalary(avgBase, "INR")}</span></span>
                        {avgBonus > 0 && <span>Bonus <span className="font-semibold text-[#222222]">{formatSalary(avgBonus, "INR")}</span></span>}
                        {avgStock > 0 && <span>Stock <span className="font-semibold text-[#222222]">{formatSalary(avgStock, "INR")}</span></span>}
                        <span>TC <span className="font-bold text-[#0369A1]">{formatSalary(med, "INR")}</span></span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        )}

        {/* All Salaries */}
        <section id="salaries" className="scroll-mt-20">
          <h2 className="text-xl font-bold text-[#222222] mb-4">Salaries at {company.name}</h2>
          <SalaryTable salaries={salaries} showCompany={false} />
        </section>

        {/* Reviews */}
        <section id="reviews" className="scroll-mt-20">
          <h2 className="text-xl font-bold text-[#222222] mb-4">Employee Reviews</h2>
          {reviews.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
            </div>
          ) : (
            <p className="text-[#717171] bg-white border border-[#EBEBEB] rounded-xl p-8 text-center">No reviews yet. Be the first to review {company.name}.</p>
          )}
        </section>

        {/* Interviews */}
        <section id="interviews" className="scroll-mt-20">
          <h2 className="text-xl font-bold text-[#222222] mb-4">Interview Experiences</h2>
          {interviews.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {interviews.map((i) => <InterviewCard key={i.id} interview={i} />)}
            </div>
          ) : (
            <p className="text-[#717171] bg-white border border-[#EBEBEB] rounded-xl p-8 text-center">No interview experiences yet.</p>
          )}
        </section>

        {/* Similar Companies */}
        {similar.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-[#222222] mb-4">Similar Companies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {similar.map((c) => (
                <Link key={c.id} href={`/companies/${c.slug}`} className="bg-white border border-[#EBEBEB] rounded-xl p-4 hover:border-[#FF5A5F] transition-colors group">
                  <div className="w-10 h-10 bg-[#F7F7F7] rounded-lg flex items-center justify-center font-bold text-[#222222] mb-2">
                    {c.name.charAt(0)}
                  </div>
                  <p className="font-semibold text-sm text-[#222222] group-hover:text-[#FF5A5F] transition-colors">{c.name}</p>
                  <p className="text-xs text-[#717171]">{c.headquarters}</p>
                  {c.talentdash_score && (
                    <p className="text-xs font-medium text-[#0369A1] mt-1">Score {Number(c.talentdash_score).toFixed(1)}</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
