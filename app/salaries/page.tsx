import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { SalaryTable } from "@/components/features/SalaryTable";
import { FilterBar } from "@/components/features/FilterBar";
import { PaginationLink } from "@/components/ui/PaginationLink";
import { TableSkeleton } from "@/components/ui/Skeleton";
import type { Currency, Level, Salary } from "@/types";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Software Engineer & Tech Salaries in India — All Levels | TalentDash",
  description: "Browse verified salary data for software engineers, product managers, and more across Amazon, Google, Flipkart and 100+ companies in India.",
  openGraph: {
    title: "Tech Salaries in India | TalentDash",
    description: "Real, verified salary data across levels and companies.",
  },
};

const DEFAULT_PAGE_SIZE = 25;

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

async function SalaryResults({ searchParams }: { searchParams: Record<string, string> }) {
  const level = searchParams.level as Level | undefined;
  const currency = searchParams.currency as Currency | undefined;
  const sort = searchParams.sort ?? "total_comp_desc";
  const page = Math.max(1, parseInt(searchParams.page ?? "1"));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.pageSize ?? String(DEFAULT_PAGE_SIZE))));
  const displayCurrency = (searchParams.displayCurrency ?? currency ?? "INR") as Currency;
  const minTotal = searchParams.minTotal ? Number(searchParams.minTotal) : undefined;
  const maxTotal = searchParams.maxTotal ? Number(searchParams.maxTotal) : undefined;
  const search = searchParams.search?.trim();

  const where: Record<string, unknown> = {};

  // Broad search: match company name, role, or location
  if (search) {
    where.OR = [
      { company: { normalized_name: { contains: search.toLowerCase() } } },
      { role: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
    ];
  }

  if (searchParams.company) where.company = { normalized_name: { contains: searchParams.company.toLowerCase() } };
  if (searchParams.role) where.role = { contains: searchParams.role, mode: "insensitive" };
  if (level) where.level = level;
  if (searchParams.location) where.location = { contains: searchParams.location, mode: "insensitive" };
  if (currency) where.currency = currency;
  if (minTotal !== undefined || maxTotal !== undefined) {
    where.total_compensation = {
      ...(minTotal !== undefined && { gte: minTotal }),
      ...(maxTotal !== undefined && { lte: maxTotal }),
    };
  }

  const orderBy =
    sort === "total_comp_asc" ? { total_compensation: "asc" as const } :
    sort === "date_desc" ? { submitted_at: "desc" as const } :
    { total_compensation: "desc" as const };

  const [total, rows] = await Promise.all([
    prisma.salary.count({ where }),
    prisma.salary.findMany({
      where, orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { company: true },
    }),
  ]);

  const salaries: Salary[] = rows.map((s) => ({
    ...s,
    base_salary: Number(s.base_salary),
    bonus: Number(s.bonus),
    stock: Number(s.stock),
    total_compensation: Number(s.total_compensation),
    confidence_score: Number(s.confidence_score),
    submitted_at: s.submitted_at.toISOString(),
    company: s.company ? {
      ...s.company,
      glassdoor_rating: s.company.glassdoor_rating ? Number(s.company.glassdoor_rating) : null,
      ambitionbox_rating: s.company.ambitionbox_rating ? Number(s.company.ambitionbox_rating) : null,
      talentdash_score: s.company.talentdash_score ? Number(s.company.talentdash_score) : null,
      created_at: s.company.created_at.toISOString(),
      updated_at: s.company.updated_at.toISOString(),
    } : undefined,
  }));

  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      <SalaryTable salaries={salaries} displayCurrency={displayCurrency} />
      {total > pageSize && (
        <div className="bg-white border border-[#EBEBEB] rounded-b-xl border-t-0">
          <PaginationLink page={page} totalPages={totalPages} total={total} limit={pageSize} />
        </div>
      )}
    </>
  );
}

export default async function SalariesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // JSON-LD for the salary explorer page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": "TalentDash India Tech Salary Dataset",
    "description": "Verified salary data for software engineers and tech professionals in India",
    "keywords": ["salary", "software engineer", "India", "compensation"],
    "license": "https://creativecommons.org/licenses/by/4.0/",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#222222]">Salary Explorer</h1>
          <p className="text-[#717171] mt-1">Verified compensation data across levels, roles, and companies in India.</p>
        </div>

        <Suspense fallback={<div className="h-20 bg-white rounded-xl border border-[#EBEBEB] animate-pulse mb-6" />}>
          <FilterBar />
        </Suspense>

        <Suspense fallback={<div className="bg-white rounded-xl border border-[#EBEBEB] overflow-hidden"><TableSkeleton rows={10} /></div>}>
          <SalaryResults searchParams={params} />
        </Suspense>
      </div>
    </>
  );
}
