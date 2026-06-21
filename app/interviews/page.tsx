import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { InterviewsFilter } from "@/components/features/InterviewsFilter";
import type { Interview } from "@/types";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Interview Experiences at Top India Companies | TalentDash",
  description: "Real interview experiences from Google, Amazon, Flipkart and more.",
};

const OUTCOME_LABELS: Record<string, string> = {
  OFFER: "Got Offer", REJECT: "Rejected", GHOSTED: "Ghosted", WITHDREW: "Withdrew",
};

export default async function InterviewsPage() {
  const rows = await prisma.interview.findMany({
    orderBy: { submitted_at: "desc" },
    take: 50,
    include: { company: true },
  });

  const interviews = rows.map((i) => ({
    ...i,
    submitted_at: i.submitted_at.toISOString(),
    rounds: i.rounds as Interview["rounds"],
    company: {
      ...i.company,
      glassdoor_rating: i.company.glassdoor_rating ? Number(i.company.glassdoor_rating) : null,
      ambitionbox_rating: i.company.ambitionbox_rating ? Number(i.company.ambitionbox_rating) : null,
      talentdash_score: i.company.talentdash_score ? Number(i.company.talentdash_score) : null,
      created_at: i.company.created_at.toISOString(),
      updated_at: i.company.updated_at.toISOString(),
    },
  }));

  const totalInterviews = interviews.length;
  const offerRate =
    totalInterviews > 0
      ? Math.round(
          (interviews.filter((i) => i.outcome === "OFFER").length / totalInterviews) * 100
        )
      : 0;

  const DIFFICULTY_SCORE: Record<string, number> = { EASY: 2, MEDIUM: 3, HARD: 4, VERY_HARD: 5 };
  const avgDifficulty =
    totalInterviews > 0
      ? Math.round((interviews.reduce((s, i) => s + (DIFFICULTY_SCORE[i.difficulty] ?? 3), 0) / totalInterviews) * 10) / 10
      : 0;

  const avgRounds =
    totalInterviews > 0
      ? Math.round((interviews.reduce((s, i) => s + ((i.rounds as unknown[])?.length ?? 0), 0) / totalInterviews) * 10) / 10
      : 0;

  const difficultyCounts = (["EASY", "MEDIUM", "HARD", "VERY_HARD"] as const).map((d) => ({
    label: d.replace("_", " "),
    key: d,
    count: interviews.filter((i) => i.difficulty === d).length,
    pct:
      totalInterviews > 0
        ? Math.round(
            (interviews.filter((i) => i.difficulty === d).length / totalInterviews) * 100
          )
        : 0,
  }));

  const outcomeCounts = (["OFFER", "REJECT", "GHOSTED", "WITHDREW"] as const).map((o) => ({
    label: OUTCOME_LABELS[o],
    key: o,
    count: interviews.filter((i) => i.outcome === o).length,
  }));

  const uniqueCompaniesCount = new Set(interviews.map((i) => i.company.name)).size;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#222222]">Interview Experiences</h1>
        <p className="text-[#717171] mt-1">
          Round-by-round experiences shared anonymously by candidates.
        </p>
      </div>
      <InterviewsFilter
        interviews={interviews}
        difficultyCounts={difficultyCounts}
        outcomeCounts={outcomeCounts}
        offerRate={offerRate}
        uniqueCompaniesCount={uniqueCompaniesCount}
        avgDifficulty={avgDifficulty}
        avgRounds={avgRounds}
      />
    </div>
  );
}
