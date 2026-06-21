import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatSalary, computeMedian } from "@/lib/salary";
import { SalaryTable } from "@/components/features/SalaryTable";
import { LEVEL_LABELS, LEVEL_COLORS } from "@/lib/config";
import type { Salary, Level } from "@/types";

export const revalidate = 3600;

type Props = { params: Promise<{ role: string }> };

export async function generateStaticParams() {
  const roles = await prisma.salary.findMany({ select: { role: true }, distinct: ["role"] });
  return roles.map((r) => ({ role: encodeURIComponent(r.role) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { role } = await params;
  const decoded = decodeURIComponent(role);
  return {
    title: `${decoded} Salary in India — All Levels & Companies | TalentDash`,
    description: `Verified ${decoded} salaries across levels and companies in India. See median TC, base, bonus, and stock.`,
  };
}

export default async function RoleSalaryPage({ params }: Props) {
  const { role } = await params;
  const decoded = decodeURIComponent(role);

  const rows = await prisma.salary.findMany({
    where: { role: { equals: decoded, mode: "insensitive" } },
    orderBy: { total_compensation: "desc" },
    include: { company: true },
  });

  if (rows.length === 0) notFound();

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

  const tcValues = salaries.map((s) => s.total_compensation);
  const medianTC = computeMedian(tcValues);
  const maxTC = Math.max(...tcValues);
  const minTC = Math.min(...tcValues);

  // Per-level breakdown
  const byLevel: Partial<Record<Level, Salary[]>> = {};
  for (const s of salaries) {
    if (!byLevel[s.level]) byLevel[s.level] = [];
    byLevel[s.level]!.push(s);
  }

  // Per-company medians
  const byCompany: Record<string, { name: string; slug: string; median: number; count: number }> = {};
  for (const s of salaries) {
    const cname = s.company?.name ?? "Unknown";
    const cslug = s.company?.slug ?? "";
    if (!byCompany[cname]) byCompany[cname] = { name: cname, slug: cslug, median: 0, count: 0 };
    byCompany[cname].count++;
  }
  for (const [cname, val] of Object.entries(byCompany)) {
    const tcs = salaries.filter((s) => s.company?.name === cname).map((s) => s.total_compensation);
    byCompany[cname].median = computeMedian(tcs);
  }
  const companiesSorted = Object.values(byCompany).sort((a, b) => b.median - a.median);
  const topMedian = companiesSorted[0]?.median ?? 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm text-[#717171] mb-1">
          <Link href="/salaries" className="hover:text-[#FF5A5F]">Salaries</Link> / {decoded}
        </p>
        <h1 className="text-3xl font-bold text-[#222222]">{decoded} Salary in India</h1>
        <p className="text-[#717171] mt-1">{salaries.length} verified data points across {companiesSorted.length} companies</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Median TC", value: formatSalary(medianTC, "INR"), color: "text-[#0369A1]" },
          { label: "Highest TC", value: formatSalary(maxTC, "INR"), color: "text-[#008A05]" },
          { label: "Lowest TC", value: formatSalary(minTC, "INR"), color: "text-[#717171]" },
          { label: "Data Points", value: String(salaries.length), color: "text-[#222222]" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-[#EBEBEB] rounded-xl p-5">
            <p className="text-xs text-[#717171] uppercase tracking-wide mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Level breakdown */}
      {Object.keys(byLevel).length > 1 && (
        <div className="bg-white border border-[#EBEBEB] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#222222] mb-4">Salary by Level</h2>
          <div className="space-y-3">
            {(Object.entries(byLevel) as [Level, Salary[]][])
              .sort((a, b) => computeMedian(b[1].map(s => s.total_compensation)) - computeMedian(a[1].map(s => s.total_compensation)))
              .map(([level, entries]) => {
                const med = computeMedian(entries.map((s) => s.total_compensation));
                const pct = Math.round((med / maxTC) * 100);
                return (
                  <div key={level} className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-20 text-center shrink-0 ${LEVEL_COLORS[level]}`}>
                      {LEVEL_LABELS[level]}
                    </span>
                    <div className="flex-1 h-2.5 bg-[#EBEBEB] rounded-full overflow-hidden">
                      <div className="h-full bg-[#0369A1] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-sm font-semibold text-[#222222] w-20 text-right shrink-0">
                      {formatSalary(med, "INR")}
                    </span>
                    <span className="text-xs text-[#717171] w-16 text-right shrink-0">
                      {entries.length} sample{entries.length > 1 ? "s" : ""}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Company breakdown */}
      <div className="bg-white border border-[#EBEBEB] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[#222222] mb-4">By Company</h2>
        <div className="space-y-3">
          {companiesSorted.map((c) => {
            const pct = Math.round((c.median / topMedian) * 100);
            return (
              <div key={c.name} className="flex items-center gap-3">
                <Link href={`/companies/${c.slug}`} className="text-sm font-medium text-[#222222] hover:text-[#FF5A5F] w-28 shrink-0 truncate">
                  {c.name}
                </Link>
                <div className="flex-1 h-2.5 bg-[#EBEBEB] rounded-full overflow-hidden">
                  <div className="h-full bg-[#FF5A5F] rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-sm font-semibold text-[#222222] w-20 text-right shrink-0">
                  {formatSalary(c.median, "INR")}
                </span>
                <span className="text-xs text-[#717171] w-16 text-right shrink-0">
                  {c.count} sample{c.count > 1 ? "s" : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full table */}
      <div>
        <h2 className="text-lg font-semibold text-[#222222] mb-4">All {decoded} Salaries</h2>
        <SalaryTable salaries={salaries} />
      </div>
    </div>
  );
}
