import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { CompanyCard } from "@/components/features/CompanyCard";
import { HeroSearch } from "@/components/features/HeroSearch";
import { formatSalary } from "@/lib/salary";
import { computeMedian } from "@/lib/salary";
import { IconSalary, IconBuilding, IconTarget, IconArrowRight, IconShield, IconUsers, IconSparkles, IconAward } from "@/components/ui/Icons";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "TalentDash — Real Salary Data & Career Intelligence for India",
  description: "Explore verified salaries, company reviews, and interview experiences for India's top tech companies. Make data-driven career decisions.",
};

const TRENDING = ["Software Engineer", "Product Manager", "Data Scientist", "SDE-II", "Staff Engineer"];

const TOP_ROLES = [
  { role: "Staff Engineer", median: 5200000, yoy: "+18%" },
  { role: "ML Engineer", median: 4000000, yoy: "+24%" },
  { role: "Product Manager L5", median: 4800000, yoy: "+15%" },
  { role: "SDE-III", median: 3600000, yoy: "+12%" },
  { role: "Data Scientist", median: 2800000, yoy: "+19%" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Browse Real Data", desc: "Explore salary, review, and interview data contributed by verified professionals across India.", Icon: IconShield },
  { step: "02", title: "Compare & Benchmark", desc: "See where you stand vs peers at the same level, company, and city. No guesswork.", Icon: IconAward },
  { step: "03", title: "Negotiate Confidently", desc: "Walk into any salary conversation backed by data. Know the range, know your worth.", Icon: IconSparkles },
];

const SOCIAL_PROOF = [
  { quote: "Finally negotiated a 40% hike at a product startup because I had the exact market range from TalentDash.", role: "SDE-II → SDE-III switch", company: "Bengaluru" },
  { quote: "Compared two offers side-by-side and realised the 'lower' offer had 2x better equity vesting. Chose wisely.", role: "PM, L4", company: "Mumbai" },
  { quote: "The Workplace Index helped me filter out companies with poor WLB before even applying.", role: "Data Scientist", company: "Hyderabad" },
];

async function getStats() {
  const [salaryCount, companyCount, topCompanies] = await Promise.all([
    prisma.salary.count(),
    prisma.company.count(),
    prisma.company.findMany({
      take: 8,
      include: {
        salaries: { select: { total_compensation: true } },
        _count: { select: { salaries: true } },
      },
      orderBy: { talentdash_score: "desc" },
    }),
  ]);
  return { salaryCount, companyCount, topCompanies };
}

export default async function HomePage() {
  const { salaryCount, companyCount, topCompanies } = await getStats();

  const companies = topCompanies.map((c) => ({
    ...c,
    glassdoor_rating: c.glassdoor_rating ? Number(c.glassdoor_rating) : null,
    ambitionbox_rating: c.ambitionbox_rating ? Number(c.ambitionbox_rating) : null,
    talentdash_score: c.talentdash_score ? Number(c.talentdash_score) : null,
    salary_count: c._count.salaries,
    median_tc: computeMedian(c.salaries.map((s) => Number(s.total_compensation))),
    created_at: c.created_at.toISOString(),
    updated_at: c.updated_at.toISOString(),
  }));

  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b border-[#EBEBEB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-12 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFF0F0] border border-[#FFE0E0] rounded-full text-xs font-medium text-[#FF5A5F] mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A5F] animate-pulse" />
              Live data from verified contributors
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#222222] leading-tight mb-4">
              Know your worth.<br />
              <span className="text-[#FF5A5F]">Negotiate with data.</span>
            </h1>
            <p className="text-base sm:text-lg text-[#484848] mb-6 leading-relaxed">
              Real salaries from real people at India&apos;s top companies. Compare offers, explore compensation by level, and make confident career decisions.
            </p>
            <HeroSearch />
            <div className="flex flex-wrap gap-3 mt-6">
              <Link href="/salaries" className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 bg-[#FF5A5F] text-white font-semibold rounded-xl hover:bg-[#e84f54] transition-colors">
                Explore Salaries
              </Link>
              <Link href="/companies" className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 border-2 border-[#222222] text-[#222222] font-semibold rounded-xl hover:bg-[#F7F7F7] transition-colors">
                Browse Companies
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-[#F7F7F7] border-b border-[#EBEBEB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center py-2">
              <p className="text-2xl font-bold text-[#222222]">{salaryCount.toLocaleString("en-IN")}+</p>
              <p className="text-sm text-[#717171]">Salary Records</p>
            </div>
            <div className="text-center py-2">
              <p className="text-2xl font-bold text-[#222222]">{companyCount}+</p>
              <p className="text-sm text-[#717171]">Companies</p>
            </div>
            <div className="text-center py-2">
              <p className="text-2xl font-bold text-[#222222]">11</p>
              <p className="text-sm text-[#717171]">Seniority Levels</p>
            </div>
            <div className="text-center py-2">
              <p className="text-2xl font-bold text-[#222222]">15+</p>
              <p className="text-sm text-[#717171]">Cities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending searches */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-sm font-medium text-[#717171] mb-3">Trending searches</p>
        <div className="flex flex-wrap gap-2">
          {TRENDING.map((t) => (
            <Link key={t} href={`/salaries?role=${encodeURIComponent(t)}`} className="px-4 py-2 bg-white border border-[#EBEBEB] rounded-full text-sm text-[#484848] hover:border-[#FF5A5F] hover:text-[#FF5A5F] transition-colors">
              {t}
            </Link>
          ))}
        </div>
      </section>

      {/* Top roles by salary */}
      <section className="bg-white border-y border-[#EBEBEB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-[#222222]">Top Paying Roles in India</h2>
            <Link href="/salaries" className="text-sm text-[#FF5A5F] hover:underline font-medium">Explore all →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {TOP_ROLES.map((r, i) => (
              <Link key={r.role} href={`/salaries?role=${encodeURIComponent(r.role)}`}
                className="bg-[#F7F7F7] hover:bg-[#FFF0F0] border border-[#EBEBEB] hover:border-[#FF5A5F] rounded-xl p-4 transition-all group">
                <p className="text-xs text-[#717171] mb-1">#{i + 1}</p>
                <p className="text-sm font-semibold text-[#222222] group-hover:text-[#FF5A5F] transition-colors leading-tight">{r.role}</p>
                <p className="text-base font-bold text-[#0369A1] mt-1">{formatSalary(r.median, "INR")}</p>
                <p className="text-xs text-[#008A05] mt-0.5">{r.yoy} YoY</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top companies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#222222]">Top Companies</h2>
          <Link href="/companies" className="text-sm text-[#FF5A5F] hover:underline font-medium">View all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {companies.map((c) => (
            <CompanyCard key={c.id} company={{ ...c, avg_rating: c.glassdoor_rating ?? undefined }} />
          ))}
        </div>
      </section>

      {/* CTA sections */}
      <section className="bg-white border-y border-[#EBEBEB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-3 gap-6">
          {[
            { Icon: IconSalary, title: "Salary Data", desc: "Level-by-level compensation data across 12+ companies and 15 cities.", href: "/salaries", cta: "Explore Salaries" },
            { Icon: IconBuilding, title: "Company Reviews", desc: "Anonymous reviews on WLB, culture, growth, and management.", href: "/reviews", cta: "Read Reviews" },
            { Icon: IconTarget, title: "Interview Prep", desc: "Real interview experiences with round-by-round breakdowns.", href: "/interviews", cta: "View Experiences" },
          ].map(({ Icon, title, desc, href, cta }) => (
            <div key={title} className="p-6 rounded-xl border border-[#EBEBEB] hover:border-[#FF5A5F] transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-[#FFF0F0] flex items-center justify-center mb-4 group-hover:bg-[#FF5A5F] transition-colors">
                <Icon className="w-5 h-5 text-[#FF5A5F] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-[#222222] mb-2">{title}</h3>
              <p className="text-sm text-[#717171] mb-4">{desc}</p>
              <Link href={href} className="inline-flex items-center gap-1 text-sm font-medium text-[#FF5A5F] hover:underline">{cta} <IconArrowRight className="w-3.5 h-3.5" /></Link>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#222222]">How TalentDash Works</h2>
          <p className="text-[#717171] mt-1 text-sm">Three steps to take control of your career trajectory</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map(({ step, title, desc, Icon }) => (
            <div key={step} className="relative bg-white border border-[#EBEBEB] rounded-2xl p-6">
              <div className="absolute top-4 right-4 text-5xl font-black text-[#F7F7F7] select-none">{step}</div>
              <div className="w-10 h-10 bg-[#FFF0F0] rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-[#FF5A5F]" />
              </div>
              <h3 className="font-semibold text-[#222222] mb-2">{title}</h3>
              <p className="text-sm text-[#717171] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="bg-[#F7F7F7] border-y border-[#EBEBEB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center gap-2 mb-6">
            <IconUsers className="w-5 h-5 text-[#FF5A5F]" />
            <h2 className="text-xl font-bold text-[#222222]">From the Community</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {SOCIAL_PROOF.map((p, i) => (
              <div key={i} className="bg-white border border-[#EBEBEB] rounded-xl p-5">
                <p className="text-[#484848] text-sm leading-relaxed italic mb-4">&ldquo;{p.quote}&rdquo;</p>
                <div className="flex items-center gap-2 pt-3 border-t border-[#EBEBEB]">
                  <div className="w-8 h-8 bg-[#FFF0F0] rounded-full flex items-center justify-center text-xs font-bold text-[#FF5A5F]">{i + 1}</div>
                  <div>
                    <p className="text-xs font-semibold text-[#222222]">{p.role}</p>
                    <p className="text-xs text-[#717171]">{p.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-[#222222] rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Got a new offer?</h2>
          <p className="text-[#717171] mb-6 max-w-xl mx-auto">Use our free tools to calculate your real take-home pay, compare two offers side-by-side, or understand your ESOP vesting value.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/tools/salary-calculator" className="px-5 py-2.5 bg-[#FF5A5F] text-white font-medium rounded-xl hover:bg-[#e84f54] transition-colors text-sm">Salary Calculator</Link>
            <Link href="/tools/offer-comparison" className="px-5 py-2.5 bg-white text-[#222222] font-medium rounded-xl hover:bg-[#F7F7F7] transition-colors text-sm">Compare Offers</Link>
            <Link href="/tools/equity-calculator" className="px-5 py-2.5 border border-[#444] text-white font-medium rounded-xl hover:bg-[#333] transition-colors text-sm">Equity Calculator</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
