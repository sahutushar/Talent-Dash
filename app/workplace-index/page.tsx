import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { RatingBar } from "@/components/ui/RatingBar";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Workplace Index — Best Employers in India Ranked | TalentDash",
  description:
    "TalentDash Workplace Index ranks India's top employers on compensation, WLB, growth, culture, D&I, and remote work.",
};

// ─── Medal SVGs ──────────────────────────────────────────────────────────────

function GoldMedal() {
  return (
    <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none">
      <circle cx="16" cy="20" r="10" fill="#FEF3C7" />
      <circle cx="16" cy="20" r="10" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
      <circle cx="16" cy="20" r="6.5" stroke="#F59E0B" strokeWidth="1" fill="none" />
      <text x="16" y="24.5" textAnchor="middle" fontSize="8" fontWeight="800" fill="#B45309">1</text>
      <path d="M11 10 L8 4 L12 6 L16 3 L20 6 L24 4 L21 10" stroke="#F59E0B" strokeWidth="1.5" fill="#FEF3C7" strokeLinejoin="round" />
    </svg>
  );
}

function SilverMedal() {
  return (
    <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none">
      <circle cx="16" cy="20" r="10" fill="#F3F4F6" />
      <circle cx="16" cy="20" r="10" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />
      <circle cx="16" cy="20" r="6.5" stroke="#9CA3AF" strokeWidth="1" fill="none" />
      <text x="16" y="24.5" textAnchor="middle" fontSize="8" fontWeight="800" fill="#4B5563">2</text>
      <path d="M11 10 L8 4 L12 6 L16 3 L20 6 L24 4 L21 10" stroke="#9CA3AF" strokeWidth="1.5" fill="#F3F4F6" strokeLinejoin="round" />
    </svg>
  );
}

function BronzeMedal() {
  return (
    <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none">
      <circle cx="16" cy="20" r="10" fill="#FEF0E6" />
      <circle cx="16" cy="20" r="10" stroke="#CD7C2F" strokeWidth="1.5" fill="none" />
      <circle cx="16" cy="20" r="6.5" stroke="#CD7C2F" strokeWidth="1" fill="none" />
      <text x="16" y="24.5" textAnchor="middle" fontSize="8" fontWeight="800" fill="#92400E">3</text>
      <path d="M11 10 L8 4 L12 6 L16 3 L20 6 L24 4 L21 10" stroke="#CD7C2F" strokeWidth="1.5" fill="#FEF0E6" strokeLinejoin="round" />
    </svg>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 0) return <GoldMedal />;
  if (rank === 1) return <SilverMedal />;
  if (rank === 2) return <BronzeMedal />;
  return (
    <div className="w-8 h-8 rounded-full bg-[#F7F7F7] border border-[#EBEBEB] flex items-center justify-center">
      <span className="text-xs font-bold text-[#717171] tabular-nums">{rank + 1}</span>
    </div>
  );
}

// ─── Dimension Icons ──────────────────────────────────────────────────────────

function IconComp() {
  return (
    <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 2v16M6.5 14.5c0 1.1 1.567 2 3.5 2s3.5-.9 3.5-2-1.567-2-3.5-2-3.5-.9-3.5-2 1.567-2 3.5-2 3.5.9 3.5 2" />
    </svg>
  );
}

function IconGrowth() {
  return (
    <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 14l4.5-5 3 3L14 6l4 4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 6h2v2" />
    </svg>
  );
}

function IconWLB() {
  return (
    <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="10" cy="10" r="7.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 5.5V10l3 2" />
    </svg>
  );
}

function IconCulture() {
  return (
    <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.5C9 3.5 5 5 5 9.5c0 3 2.5 5.5 5 6.5 2.5-1 5-3.5 5-6.5C15 5 11 3.5 11 3.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 7v3.5l2 1.5" />
    </svg>
  );
}

function IconDEI() {
  return (
    <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="7" cy="7" r="2.5" />
      <circle cx="13" cy="7" r="2.5" />
      <path strokeLinecap="round" d="M3 16c0-2.2 1.8-4 4-4h6c2.2 0 4 1.8 4 4" />
    </svg>
  );
}

function IconRemote() {
  return (
    <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="14" height="10" rx="2" />
      <path strokeLinecap="round" d="M7 17h6M10 14v3" />
    </svg>
  );
}

// ─── Trophy Icon ──────────────────────────────────────────────────────────────

function TrophyIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-[#F59E0B]" fill="currentColor">
      <path d="M4 1h8v5a4 4 0 0 1-8 0V1ZM2 2h2v3.5a6 6 0 0 0 .02.5H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Zm12 0a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2.02c.01-.16.02-.33.02-.5V2h2ZM7 10h2v2H7Zm-2 2h6v.5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5V12Z" />
    </svg>
  );
}

// ─── Score color helper ───────────────────────────────────────────────────────

function scoreStyle(score: number) {
  if (score >= 85) return { bg: "bg-emerald-50 border border-emerald-200", text: "text-emerald-700" };
  if (score >= 70) return { bg: "bg-blue-50 border border-blue-200", text: "text-blue-700" };
  return { bg: "bg-[#F7F7F7] border border-[#EBEBEB]", text: "text-[#484848]" };
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const DIMENSIONS: { key: string; label: string; Icon: () => JSX.Element; color: string }[] = [
  { key: "score_compensation", label: "Compensation", Icon: IconComp, color: "text-emerald-600" },
  { key: "score_growth",       label: "Career Growth", Icon: IconGrowth, color: "text-blue-600" },
  { key: "score_wlb",          label: "Work-Life Balance", Icon: IconWLB, color: "text-violet-600" },
  { key: "score_culture",      label: "Culture", Icon: IconCulture, color: "text-rose-600" },
  { key: "score_dei",          label: "D&I", Icon: IconDEI, color: "text-amber-600" },
  { key: "score_remote",       label: "Remote", Icon: IconRemote, color: "text-sky-600" },
];

const METHODOLOGY = [
  { label: "Compensation Fairness", weight: "30%", Icon: IconComp, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { label: "Career Growth",         weight: "25%", Icon: IconGrowth, color: "bg-blue-50 text-blue-700 border-blue-200" },
  { label: "Work-Life Balance",     weight: "20%", Icon: IconWLB, color: "bg-violet-50 text-violet-700 border-violet-200" },
  { label: "Culture & Inclusion",   weight: "15%", Icon: IconCulture, color: "bg-rose-50 text-rose-700 border-rose-200" },
  { label: "Diversity & Inclusion", weight: "5%",  Icon: IconDEI, color: "bg-amber-50 text-amber-700 border-amber-200" },
  { label: "Remote Policy",         weight: "5%",  Icon: IconRemote, color: "bg-sky-50 text-sky-700 border-sky-200" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function WorkplaceIndexPage() {
  const scores = await prisma.workplaceScore.findMany({
    orderBy: { composite_score: "desc" },
    include: { company: true },
  });

  const leaders: Record<string, string> = {};
  for (const dim of DIMENSIONS) {
    const top = [...scores].sort(
      (a, b) => Number((b as never)[dim.key]) - Number((a as never)[dim.key])
    )[0];
    if (top) leaders[dim.key] = top.company.name;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* ── Hero ── */}
      <div className="bg-white border-b border-[#EBEBEB]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF5A5F] to-[#E0484D] flex items-center justify-center shadow-sm shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5h3.75M3 9h3.75M3 18h3.75M7.5 3h9A2.25 2.25 0 0 1 18.75 5.25v13.5A2.25 2.25 0 0 1 16.5 21h-9A2.25 2.25 0 0 1 5.25 18.75V5.25A2.25 2.25 0 0 1 7.5 3Z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#FF5A5F]">TalentDash</span>
                <span className="text-xs text-[#EBEBEB]">·</span>
                <span className="text-xs font-medium text-[#717171]">Annual Report</span>
              </div>
              <h1 className="text-3xl font-extrabold text-[#222222] tracking-tight leading-tight">
                Workplace Index
              </h1>
              <p className="text-[#717171] mt-1 text-sm">
                India&apos;s most comprehensive employer ranking — scored across 6 dimensions of workplace quality.
              </p>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { label: "Companies Ranked", value: scores.length.toString() },
              { label: "Dimensions", value: "6" },
              { label: "Data Points", value: "Verified" },
            ].map(({ label, value }) => (
              <div key={label} className="text-center p-3 sm:p-4 bg-[#F7F7F7] rounded-xl border border-[#EBEBEB]">
                <p className="text-lg sm:text-xl font-bold text-[#222222]">{value}</p>
                <p className="text-xs text-[#717171] mt-0.5 leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── Methodology ── */}
        <section className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <svg viewBox="0 0 20 20" className="w-4 h-4 text-[#717171]" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 2a1 1 0 0 0 0 2h.01M10 6v8m-3 2h6" />
            </svg>
            <h2 className="text-sm font-semibold text-[#222222] uppercase tracking-wider">Scoring Methodology</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {METHODOLOGY.map(({ label, weight, Icon, color }) => (
              <div key={label} className={`flex items-center gap-3 p-3 rounded-xl border ${color}`}>
                <div className="shrink-0"><Icon /></div>
                <div className="min-w-0">
                  <p className="text-xs font-medium leading-snug truncate">{label}</p>
                  <p className="text-base font-bold">{weight}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Category Leaders ── */}
        <section className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrophyIcon />
            <h2 className="text-sm font-semibold text-[#222222] uppercase tracking-wider">Category Leaders</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {DIMENSIONS.map(({ key, label, Icon, color }) => (
              <div key={key} className="flex items-center gap-3 p-3 bg-[#FAFAFA] rounded-xl border border-[#EBEBEB]">
                <div className={`shrink-0 ${color}`}><Icon /></div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-[#717171] font-medium">{label}</p>
                  <p className="text-sm font-semibold text-[#222222] truncate">{leaders[key] ?? "—"}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Rankings ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <svg viewBox="0 0 20 20" className="w-4 h-4 text-[#717171]" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h14M3 10h10M3 15h6" />
            </svg>
            <h2 className="text-sm font-semibold text-[#222222] uppercase tracking-wider">Full Rankings</h2>
            <span className="ml-auto text-xs text-[#717171]">{scores.length} companies</span>
          </div>

          <div className="space-y-3">
            {scores.map((ws, idx) => {
              const scoreVal = Number(ws.composite_score);
              const { bg, text } = scoreStyle(scoreVal);
              const initials = ws.company.name
                .split(" ")
                .slice(0, 2)
                .map((w) => w[0])
                .join("")
                .toUpperCase();

              return (
                <Link
                  key={ws.id}
                  href={`/companies/${ws.company.slug}`}
                  className="flex items-start gap-4 bg-white border border-[#EBEBEB] rounded-2xl p-5 hover:border-[#FF5A5F] hover:shadow-md transition-all duration-150 group"
                >
                  {/* Rank */}
                  <div className="shrink-0 flex items-center justify-center pt-0.5">
                    <RankBadge rank={idx} />
                  </div>

                  {/* Logo */}
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#F7F7F7] to-[#EBEBEB] border border-[#EBEBEB] flex items-center justify-center font-bold text-[#484848] text-sm shrink-0 shadow-sm">
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header row */}
                    <div className="flex items-start justify-between flex-wrap gap-2 mb-4">
                      <div>
                        <h3 className="font-bold text-[#222222] group-hover:text-[#FF5A5F] transition-colors leading-tight">
                          {ws.company.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="text-xs text-[#717171]">{ws.company.industry}</span>
                          {ws.company.headquarters && (
                            <>
                              <span className="text-[#EBEBEB] text-xs">·</span>
                              <span className="text-xs text-[#717171]">{ws.company.headquarters}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Score badge */}
                      <div className={`flex flex-col items-center px-4 py-2 rounded-xl ${bg}`}>
                        <span className={`text-2xl font-extrabold tabular-nums leading-none ${text}`}>
                          {scoreVal.toFixed(1)}
                        </span>
                        <span className={`text-[10px] font-medium uppercase tracking-widest mt-0.5 ${text} opacity-70`}>
                          Score
                        </span>
                      </div>
                    </div>

                    {/* Dimension bars */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2">
                      <RatingBar label="Compensation" value={Number(ws.score_compensation)} max={100} />
                      <RatingBar label="Growth"       value={Number(ws.score_growth)} max={100} />
                      <RatingBar label="WLB"          value={Number(ws.score_wlb)} max={100} />
                      <RatingBar label="Culture"      value={Number(ws.score_culture)} max={100} />
                      <RatingBar label="D&I"          value={Number(ws.score_dei)} max={100} />
                      <RatingBar label="Remote"       value={Number(ws.score_remote)} max={100} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
