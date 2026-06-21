"use client";

import { useState, useMemo } from "react";
import { InterviewCard } from "@/components/features/InterviewCard";
import { ALL_LEVELS, LEVEL_LABELS, LOCATIONS } from "@/lib/config";
import type { Interview, Level } from "@/types";

type InterviewWithCompany = Interview & {
  company: {
    id: string; name: string; slug: string; normalized_name: string;
    glassdoor_rating: number | null; ambitionbox_rating: number | null;
    talentdash_score: number | null; created_at: string; updated_at: string;
  };
};

const OUTCOME_LABELS: Record<string, string> = {
  OFFER: "Got Offer", REJECT: "Rejected", GHOSTED: "Ghosted", WITHDREW: "Withdrew",
};

const DIFFICULTY_BAR_COLORS: Record<string, string> = {
  EASY: "bg-green-400", MEDIUM: "bg-yellow-400", HARD: "bg-orange-400", VERY_HARD: "bg-red-400",
};

const SORT_OPTIONS = ["Most Recent", "Hardest First", "Easiest First"] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

const DIFFICULTY_ORDER: Record<string, number> = { EASY: 1, MEDIUM: 2, HARD: 3, VERY_HARD: 4 };

interface InterviewsFilterProps {
  interviews: InterviewWithCompany[];
  difficultyCounts: { label: string; key: string; count: number; pct: number }[];
  outcomeCounts: { label: string; key: string; count: number }[];
  offerRate: number;
  uniqueCompaniesCount: number;
  avgDifficulty: number;
  avgRounds: number;
}

const EMPTY_FORM = {
  company_id: "", role: "", level: "", location: "",
  difficulty: "", outcome: "", tips: "", years_experience: "",
};

export function InterviewsFilter({
  interviews,
  difficultyCounts,
  outcomeCounts,
  offerRate,
  uniqueCompaniesCount,
  avgDifficulty,
  avgRounds,
}: InterviewsFilterProps) {
  const [sort, setSort] = useState<SortOption>("Most Recent");
  const [diffFilter, setDiffFilter] = useState<string>("All");
  const [liveInterviews, setLiveInterviews] = useState<InterviewWithCompany[]>(interviews);

  // modal
  const [showModal, setShowModal] = useState(false);
  const [allCompanies, setAllCompanies] = useState<{ id: string; name: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [rounds, setRounds] = useState([{ round: 1, type: "", description: "" }]);

  const filtered = useMemo(() => {
    let list = [...liveInterviews];
    if (diffFilter !== "All") list = list.filter((i) => i.difficulty === diffFilter);
    if (sort === "Hardest First") list.sort((a, b) => DIFFICULTY_ORDER[b.difficulty] - DIFFICULTY_ORDER[a.difficulty]);
    if (sort === "Easiest First") list.sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]);
    return list;
  }, [liveInterviews, sort, diffFilter]);

  async function openModal() {
    if (allCompanies.length === 0) {
      const data = await fetch("/api/companies").then((r) => r.json());
      setAllCompanies(data);
    }
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company_id || !form.role || !form.difficulty || !form.outcome) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          years_experience: form.years_experience ? Number(form.years_experience) : null,
          level: form.level || null,
          location: form.location || null,
          rounds: rounds.filter((r) => r.type),
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setLiveInterviews((prev) => [created, ...prev]);
        setSubmitted(true);
        setTimeout(() => { setShowModal(false); setSubmitted(false); }, 1500);
        setForm(EMPTY_FORM);
        setRounds([{ round: 1, type: "", description: "" }]);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls = "w-full border border-[#EBEBEB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5A5F]";
  const labelCls = "block text-xs font-semibold text-[#717171] uppercase tracking-wide mb-1";

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main content */}
      <div className="flex-1 min-w-0 order-2 lg:order-1">
        {/* Sort tabs */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {SORT_OPTIONS.map((tab) => (
            <button
              key={tab}
              onClick={() => setSort(tab)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                sort === tab
                  ? "bg-[#FF5A5F] text-white"
                  : "bg-white border border-[#EBEBEB] text-[#484848] hover:border-[#FF5A5F] hover:text-[#FF5A5F]"
              }`}
            >
              {tab}
            </button>
          ))}
          <button
            onClick={openModal}
            className="ml-auto px-4 py-1.5 bg-[#FF5A5F] text-white text-sm font-medium rounded-full hover:bg-[#e84f54] transition-colors lg:hidden"
          >
            + Add Experience
          </button>
        </div>

        {/* Difficulty filter */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {["All", "EASY", "MEDIUM", "HARD", "VERY_HARD"].map((d) => (
            <button
              key={d}
              onClick={() => setDiffFilter(d)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                diffFilter === d
                  ? "bg-[#222222] text-white"
                  : "bg-white border border-[#EBEBEB] text-[#717171] hover:border-[#222222] hover:text-[#222222]"
              }`}
            >
              {d === "All" ? "All Difficulties" : d.replace("_", " ")}
            </button>
          ))}
          <span className="text-xs text-[#717171] ml-1">{filtered.length} results</span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((i) => (
            <div key={i.id}>
              <p className="text-xs font-medium text-[#717171] mb-1.5">
                <a href={`/companies/${i.company.slug}`} className="hover:text-[#FF5A5F] transition-colors">
                  {i.company.name}
                </a>
              </p>
              <InterviewCard interview={i} companyName={i.company.name} companySlug={i.company.slug} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-[#EBEBEB]">
            <p className="text-[#717171]">No interviews match this filter.</p>
            <button onClick={() => setDiffFilter("All")} className="mt-3 text-sm text-[#FF5A5F] hover:underline">
              Clear filter
            </button>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="lg:w-72 shrink-0 space-y-4 order-1 lg:order-2">
        {/* At a glance stats - always visible */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl p-4">
          <h3 className="font-semibold text-[#222222] mb-3 text-sm">At a Glance</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Difficulty", value: `${avgDifficulty}/5` },
              { label: "Rounds", value: avgRounds.toString() },
              { label: "Offer rate", value: `${offerRate}%` },
              { label: "Companies", value: uniqueCompaniesCount.toString() },
            ].map(({ label, value }) => (
              <div key={label} className="text-center p-2 bg-[#F7F7F7] rounded-lg">
                <p className="text-base font-bold text-[#222222]">{value}</p>
                <p className="text-xs text-[#717171] leading-tight mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block bg-white border border-[#EBEBEB] rounded-xl p-5">
          <h3 className="font-semibold text-[#222222] mb-3 text-sm">Difficulty Breakdown</h3>
          <div className="space-y-2">
            {difficultyCounts.map(({ label, key, count, pct }) => (
              <button
                key={key}
                onClick={() => setDiffFilter(diffFilter === key ? "All" : key)}
                className={`w-full flex items-center gap-2 text-xs rounded-lg px-1 py-0.5 transition-colors ${diffFilter === key ? "bg-[#F7F7F7]" : "hover:bg-[#F7F7F7]"}`}
              >
                <span className="text-[#717171] w-16 text-left capitalize">{label.toLowerCase()}</span>
                <div className="flex-1 h-1.5 bg-[#F7F7F7] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${DIFFICULTY_BAR_COLORS[key]}`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[#717171] w-4 text-right">{count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="hidden lg:block bg-white border border-[#EBEBEB] rounded-xl p-5">
          <h3 className="font-semibold text-[#222222] mb-3 text-sm">Outcomes</h3>
          <div className="space-y-2">
            {outcomeCounts.map(({ label, key, count }) => (
              <div key={key} className="flex items-center justify-between text-sm">
                <span className="text-[#484848]">{label}</span>
                <span className="text-xs text-[#717171] bg-[#F7F7F7] px-2 py-0.5 rounded-full">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block bg-[#222222] rounded-xl p-5">
          <h3 className="font-semibold text-white text-sm mb-2">Share your interview</h3>
          <p className="text-xs text-[#717171] leading-relaxed mb-4">Help others prepare by sharing your experience anonymously.</p>
          <button
            onClick={openModal}
            className="inline-flex items-center gap-1.5 text-xs text-white font-medium bg-[#FF5A5F] px-3 py-2 rounded-lg hover:bg-[#e84f54] transition-colors"
          >
            Add Experience
          </button>
        </div>
      </div>

      {/* Add Experience Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBEBEB]">
              <h3 className="font-semibold text-[#222222]">Add Interview Experience</h3>
              <button onClick={() => setShowModal(false)} className="text-[#717171] hover:text-[#222222] text-xl leading-none">✕</button>
            </div>

            {submitted ? (
              <div className="px-6 py-12 text-center">
                <p className="text-2xl mb-2">🎉</p>
                <p className="font-semibold text-[#222222]">Experience submitted!</p>
                <p className="text-sm text-[#717171] mt-1">Your experience is now live.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                {/* Company */}
                <div>
                  <label className={labelCls}>Company *</label>
                  <select value={form.company_id} onChange={(e) => setForm((f) => ({ ...f, company_id: e.target.value }))} required className={inputCls}>
                    <option value="">Select a company...</option>
                    {allCompanies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                {/* Role */}
                <div>
                  <label className={labelCls}>Role *</label>
                  <input type="text" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} placeholder="e.g. Software Engineer" required className={inputCls} />
                </div>

                {/* Level & Location */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Level</label>
                    <select value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))} className={inputCls}>
                      <option value="">Select level</option>
                      {ALL_LEVELS.map((l) => <option key={l} value={l}>{LEVEL_LABELS[l as Level]}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Location</label>
                    <select value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className={inputCls}>
                      <option value="">Select location</option>
                      {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>

                {/* Difficulty & Outcome */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Difficulty *</label>
                    <select value={form.difficulty} onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))} required className={inputCls}>
                      <option value="">Select...</option>
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                      <option value="VERY_HARD">Very Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Outcome *</label>
                    <select value={form.outcome} onChange={(e) => setForm((f) => ({ ...f, outcome: e.target.value }))} required className={inputCls}>
                      <option value="">Select...</option>
                      {Object.entries(OUTCOME_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                </div>

                {/* Years of experience */}
                <div>
                  <label className={labelCls}>Years of Experience</label>
                  <input type="number" min="0" max="40" value={form.years_experience} onChange={(e) => setForm((f) => ({ ...f, years_experience: e.target.value }))} placeholder="e.g. 3" className={inputCls} />
                </div>

                {/* Rounds */}
                <div className="border border-[#EBEBEB] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-[#717171] uppercase tracking-wide">Interview Rounds</p>
                    <button type="button" onClick={() => setRounds((r) => [...r, { round: r.length + 1, type: "", description: "" }])} className="text-xs text-[#FF5A5F] hover:underline">
                      + Add round
                    </button>
                  </div>
                  {rounds.map((r, idx) => (
                    <div key={idx} className="grid grid-cols-2 gap-2">
                      <select
                        value={r.type}
                        onChange={(e) => setRounds((prev) => prev.map((rr, i) => i === idx ? { ...rr, type: e.target.value } : rr))}
                        className="border border-[#EBEBEB] rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-[#FF5A5F]"
                      >
                        <option value="">Round type</option>
                        <option value="Online Assessment">Online Assessment</option>
                        <option value="Technical">Technical</option>
                        <option value="System Design">System Design</option>
                        <option value="Behavioural">Behavioural</option>
                        <option value="HR">HR</option>
                        <option value="Managerial">Managerial</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Brief description"
                        value={r.description}
                        onChange={(e) => setRounds((prev) => prev.map((rr, i) => i === idx ? { ...rr, description: e.target.value } : rr))}
                        className="border border-[#EBEBEB] rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-[#FF5A5F]"
                      />
                    </div>
                  ))}
                </div>

                {/* Tips */}
                <div>
                  <label className={labelCls}>Tips for Candidates</label>
                  <textarea value={form.tips} onChange={(e) => setForm((f) => ({ ...f, tips: e.target.value }))} rows={2} placeholder="Any advice for future candidates?" className={`${inputCls} resize-none`} />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !form.company_id || !form.role || !form.difficulty || !form.outcome}
                  className="w-full py-3 bg-[#FF5A5F] text-white font-medium rounded-xl hover:bg-[#e84f54] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? "Submitting..." : "Submit Experience"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
