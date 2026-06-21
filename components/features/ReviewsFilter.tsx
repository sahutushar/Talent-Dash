"use client";

import { useState, useMemo } from "react";
import { ReviewCard } from "@/components/features/ReviewCard";
import { StarRating } from "@/components/ui/StarRating";
import type { Review } from "@/types";

type ReviewWithCompany = Review & {
  company: {
    id: string; name: string; slug: string; normalized_name: string;
    glassdoor_rating: number | null; ambitionbox_rating: number | null;
    talentdash_score: number | null; created_at: string; updated_at: string;
  };
};

interface ReviewsFilterProps {
  reviews: ReviewWithCompany[];
  avgOverall: number;
  recommendCount: number;
  verifiedCount: number;
  ratingDist: { star: number; count: number; pct: number }[];
  uniqueCompaniesCount: number;
}

type Sentiment = "All sentiment" | "Positive" | "Neutral" | "Negative";

function avg(reviews: ReviewWithCompany[], key: keyof ReviewWithCompany) {
  const vals = reviews.map((r) => r[key] as number | null).filter((v): v is number => v != null);
  return vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : null;
}

function ScorePill({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-2xl font-black text-[#222222]">{value != null ? value.toFixed(1) : "—"}</span>
      <span className="text-xs text-[#717171]">{label}</span>
    </div>
  );
}

function RatingInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[#484848]">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button key={s} type="button" onClick={() => onChange(s)}>
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill={s <= value ? "#FFB400" : "#EBEBEB"}>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

interface CompanyOption { id: string; name: string; slug: string; }

export function ReviewsFilter({
  reviews: initialReviews,
  avgOverall,
  ratingDist,
}: ReviewsFilterProps) {
  const [companyFilter, setCompanyFilter] = useState("");
  const [sentiment, setSentiment] = useState<Sentiment>("All sentiment");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalCompany, setModalCompany] = useState("");
  const [allCompanies, setAllCompanies] = useState<CompanyOption[]>([]);
  const [liveReviews, setLiveReviews] = useState<ReviewWithCompany[]>(initialReviews);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // form state
  const [form, setForm] = useState({
    title: "", role: "", location: "", pros: "", cons: "",
    rating_overall: 0, rating_culture: 0, rating_compensation: 0,
    rating_wlb: 0, rating_growth: 0, rating_mgmt: 0,
    would_recommend: true,
  });

  const filtered = useMemo(() => {
    return liveReviews.filter((r) => {
      if (companyFilter && r.company.slug !== companyFilter) return false;
      if (sentiment === "Positive" && r.rating_overall < 4) return false;
      if (sentiment === "Neutral" && (r.rating_overall < 3 || r.rating_overall >= 4)) return false;
      if (sentiment === "Negative" && r.rating_overall >= 3) return false;
      if (search && !r.title.toLowerCase().includes(search.toLowerCase()) &&
        !r.company.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [liveReviews, companyFilter, sentiment, search]);

  const avgCulture = avg(liveReviews, "rating_culture");
  const avgComp = avg(liveReviews, "rating_compensation");
  const avgWlb = avg(liveReviews, "rating_wlb");

  async function openModal(companyId = "") {
    if (allCompanies.length === 0) {
      const data: CompanyOption[] = await fetch("/api/companies").then((r) => r.json());
      setAllCompanies(data);
    }
    setModalCompany(companyId);
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!modalCompany || form.rating_overall === 0 || !form.title.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: modalCompany,
          ...form,
          rating_wlb: form.rating_wlb || null,
          rating_growth: form.rating_growth || null,
          rating_mgmt: form.rating_mgmt || null,
          rating_culture: form.rating_culture || null,
          rating_compensation: form.rating_compensation || null,
        }),
      });
      if (res.ok) {
        const newReview = await res.json();
        setLiveReviews((prev) => [newReview, ...prev]);
        setSubmitted(true);
        setTimeout(() => { setShowModal(false); setSubmitted(false); }, 1500);
        setForm({ title: "", role: "", location: "", pros: "", cons: "", rating_overall: 0, rating_culture: 0, rating_compensation: 0, rating_wlb: 0, rating_growth: 0, rating_mgmt: 0, would_recommend: true });
      }
    } finally { setSubmitting(false); }
  }

  return (
    <div>
      {/* Sentiment summary */}
      <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-[#717171] uppercase tracking-wide mb-1">Company reviews and sentiment</h2>
        <p className="text-xs text-[#717171] mb-5">Compare employee sentiment, culture signals, compensation feedback, and work-life balance scores across companies.</p>
        <div className="flex flex-wrap gap-4 sm:gap-8 items-center mb-6">
          <div className="flex flex-col items-center gap-1">
            <span className="text-4xl font-black text-[#222222]">{avgOverall.toFixed(1)}</span>
            <StarRating value={avgOverall} />
            <span className="text-xs text-[#717171]">Average rating</span>
          </div>
          <div className="h-12 w-px bg-[#EBEBEB] hidden sm:block" />
          <ScorePill label="Culture" value={avgCulture} />
          <ScorePill label="Compensation" value={avgComp} />
          <ScorePill label="Work-life balance" value={avgWlb} />
        </div>

        {/* Rating distribution */}
        <div className="space-y-1.5 max-w-xs">
          <p className="text-xs font-semibold text-[#717171] mb-2">Rating distribution</p>
          {ratingDist.map(({ star, count, pct }) => (
            <div key={star} className="flex items-center gap-2 text-xs">
              <span className="text-[#717171] w-4">{star}★</span>
              <div className="flex-1 h-2 bg-[#F7F7F7] rounded-full overflow-hidden">
                <div className="h-full bg-[#FF5A5F] rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-[#717171] w-4 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search reviews"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-[#EBEBEB] rounded-xl px-3 py-2 text-sm text-[#222222] bg-white focus:outline-none focus:border-[#FF5A5F] w-full sm:w-48"
        />
        <div className="flex gap-2 flex-1">
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="flex-1 border border-[#EBEBEB] rounded-xl px-3 py-2 text-sm text-[#222222] bg-white focus:outline-none focus:border-[#FF5A5F]"
          >
            <option value="">All companies</option>
            {[...new Set(liveReviews.map((r) => r.company.slug))].map((slug) => {
              const name = liveReviews.find((r) => r.company.slug === slug)?.company.name ?? slug;
              return <option key={slug} value={slug}>{name}</option>;
            })}
          </select>
          <select
            value={sentiment}
            onChange={(e) => setSentiment(e.target.value as Sentiment)}
            className="flex-1 border border-[#EBEBEB] rounded-xl px-3 py-2 text-sm text-[#222222] bg-white focus:outline-none focus:border-[#FF5A5F]"
          >
            {(["All sentiment", "Positive", "Neutral", "Negative"] as Sentiment[]).map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => openModal()}
          className="w-full sm:w-auto px-4 py-2 bg-[#FF5A5F] text-white text-sm font-medium rounded-xl hover:bg-[#e84f54] transition-colors"
        >
          Write a review
        </button>
      </div>



      {/* Reviews grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((r) => (
          <div key={r.id}>
            <p className="text-xs font-medium text-[#717171] mb-1.5">
              <a href={`/companies/${r.company.slug}`} className="hover:text-[#FF5A5F] transition-colors">
                {r.company.name}
              </a>
            </p>
            <ReviewCard review={r} />
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-[#717171] py-16">No reviews match your filters.</p>
      )}

      {/* Write a Review Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBEBEB]">
              <h3 className="font-semibold text-[#222222]">Write a Review</h3>
              <button onClick={() => setShowModal(false)} className="text-[#717171] hover:text-[#222222] text-xl leading-none">✕</button>
            </div>
            {submitted ? (
              <div className="px-6 py-12 text-center">
                <p className="text-2xl mb-2">🎉</p>
                <p className="font-semibold text-[#222222]">Review submitted!</p>
                <p className="text-sm text-[#717171] mt-1">Your review is now live.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#717171] uppercase tracking-wide mb-1">Company *</label>
                  <select
                    value={modalCompany}
                    onChange={(e) => setModalCompany(e.target.value)}
                    required
                    className="w-full border border-[#EBEBEB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5A5F]"
                  >
                    <option value="">Select a company...</option>
                    {allCompanies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#717171] uppercase tracking-wide mb-1">Review title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Summarize your experience"
                    required
                    className="w-full border border-[#EBEBEB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5A5F]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#717171] uppercase tracking-wide mb-1">Role</label>
                    <input type="text" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} placeholder="e.g. SDE-2" className="w-full border border-[#EBEBEB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5A5F]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#717171] uppercase tracking-wide mb-1">Location</label>
                    <input type="text" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="e.g. Bengaluru" className="w-full border border-[#EBEBEB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5A5F]" />
                  </div>
                </div>
                <div className="space-y-2 border border-[#EBEBEB] rounded-xl p-4">
                  <p className="text-xs font-semibold text-[#717171] uppercase tracking-wide mb-2">Ratings</p>
                  <RatingInput label="Overall *" value={form.rating_overall} onChange={(v) => setForm((f) => ({ ...f, rating_overall: v }))} />
                  <RatingInput label="Culture" value={form.rating_culture} onChange={(v) => setForm((f) => ({ ...f, rating_culture: v }))} />
                  <RatingInput label="Compensation" value={form.rating_compensation} onChange={(v) => setForm((f) => ({ ...f, rating_compensation: v }))} />
                  <RatingInput label="Work-life balance" value={form.rating_wlb} onChange={(v) => setForm((f) => ({ ...f, rating_wlb: v }))} />
                  <RatingInput label="Growth" value={form.rating_growth} onChange={(v) => setForm((f) => ({ ...f, rating_growth: v }))} />
                  <RatingInput label="Management" value={form.rating_mgmt} onChange={(v) => setForm((f) => ({ ...f, rating_mgmt: v }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#717171] uppercase tracking-wide mb-1">Pros</label>
                  <textarea value={form.pros} onChange={(e) => setForm((f) => ({ ...f, pros: e.target.value }))} rows={2} placeholder="What do you like?" className="w-full border border-[#EBEBEB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5A5F] resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#717171] uppercase tracking-wide mb-1">Cons</label>
                  <textarea value={form.cons} onChange={(e) => setForm((f) => ({ ...f, cons: e.target.value }))} rows={2} placeholder="What could be better?" className="w-full border border-[#EBEBEB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5A5F] resize-none" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="recommend" checked={form.would_recommend} onChange={(e) => setForm((f) => ({ ...f, would_recommend: e.target.checked }))} className="w-4 h-4 accent-[#FF5A5F]" />
                  <label htmlFor="recommend" className="text-sm text-[#484848]">I would recommend this company</label>
                </div>
                <button
                  type="submit"
                  disabled={submitting || form.rating_overall === 0 || !form.title.trim() || !modalCompany}
                  className="w-full py-3 bg-[#FF5A5F] text-white font-medium rounded-xl hover:bg-[#e84f54] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
