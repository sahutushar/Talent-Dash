import type { Interview, InterviewRound } from "@/types";
import { LEVEL_LABELS } from "@/lib/config";

const DIFFICULTY_SCORE: Record<string, number> = {
  EASY: 2, MEDIUM: 3, HARD: 4, VERY_HARD: 5,
};

const DIFFICULTY_LABELS: Record<string, string> = {
  EASY: "Easy", MEDIUM: "Medium", HARD: "Hard", VERY_HARD: "Very Hard",
};

const OUTCOME_CONFIG: Record<string, { label: string; classes: string }> = {
  OFFER: { label: "Offer received", classes: "bg-green-50 text-[#008A05] border border-green-200" },
  REJECT: { label: "Rejected", classes: "bg-red-50 text-[#D93025] border border-red-200" },
  GHOSTED: { label: "Ghosted", classes: "bg-gray-50 text-[#717171] border border-gray-200" },
  WITHDREW: { label: "Withdrew", classes: "bg-blue-50 text-blue-700 border border-blue-200" },
};

export function InterviewCard({
  interview,
  companyName,
  companySlug,
}: {
  interview: Interview;
  companyName?: string;
  companySlug?: string;
}) {
  const rounds = interview.rounds as InterviewRound[] | null;
  const diffScore = DIFFICULTY_SCORE[interview.difficulty] ?? 3;
  const outcome = OUTCOME_CONFIG[interview.outcome];
  const subtitle = [interview.level ? LEVEL_LABELS[interview.level] : null, interview.location]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="bg-white border border-[#EBEBEB] rounded-xl p-5 flex flex-col gap-3">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-semibold text-[#222222] text-base leading-snug">{interview.role}</h4>
            {(companyName || subtitle) && (
              <p className="text-xs text-[#717171] mt-0.5">
                {companySlug && companyName ? (
                  <a href={`/companies/${companySlug}`} className="hover:text-[#FF5A5F] transition-colors font-medium">
                    {companyName}
                  </a>
                ) : companyName}
                {companyName && subtitle ? " · " : ""}
                {subtitle}
              </p>
            )}
          </div>
          {outcome && (
            <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${outcome.classes}`}>
              {outcome.label}
            </span>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 text-xs text-[#717171]">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-[#222222] text-sm">{diffScore}/5</span>
          <span>difficulty</span>
        </div>
        <span className="text-[#EBEBEB]">|</span>
        <div className="flex items-center gap-1">
          <span className="font-semibold text-[#222222] text-sm">{rounds?.length ?? 0}</span>
          <span>rounds</span>
        </div>
        <span className="text-[#EBEBEB]">|</span>
        <span
          className={`px-2 py-0.5 rounded-full font-medium ${
            interview.difficulty === "EASY"
              ? "bg-green-50 text-[#008A05]"
              : interview.difficulty === "MEDIUM"
              ? "bg-yellow-50 text-[#FFB400]"
              : interview.difficulty === "HARD"
              ? "bg-orange-50 text-orange-700"
              : "bg-red-50 text-[#D93025]"
          }`}
        >
          {DIFFICULTY_LABELS[interview.difficulty]}
        </span>
      </div>

      {/* Description from rounds */}
      {rounds && rounds.length > 0 && (
        <p className="text-sm text-[#484848] leading-relaxed">
          {interview.role} interview at {companyName ?? "this company"} included{" "}
          {rounds.map((r) => r.type.toLowerCase()).join(", ")} rounds with clear expectations.
        </p>
      )}

      {/* Sample questions */}
      {rounds && rounds.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[#717171] uppercase tracking-wide mb-1.5">Sample questions</p>
          <ul className="space-y-1">
            {rounds.slice(0, 3).map((r) => (
              <li key={r.round} className="text-sm text-[#484848] flex gap-1.5">
                <span className="text-[#FF5A5F] shrink-0">·</span>
                <span>{r.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tip */}
      {interview.tips && (
        <div className="bg-[#F7F7F7] rounded-lg px-3 py-2">
          <span className="text-xs font-semibold text-[#717171] uppercase tracking-wide">Tip: </span>
          <span className="text-xs text-[#484848]">{interview.tips}</span>
        </div>
      )}

      {/* Footer */}
      {companySlug && (
        <a
          href={`/interviews/${companySlug}`}
          className="text-xs font-medium text-[#FF5A5F] hover:underline mt-1 self-start"
        >
          View role details →
        </a>
      )}
    </div>
  );
}
