"use client";

import { useState, useEffect } from "react";
import { ALL_LEVELS, LEVEL_LABELS, LOCATIONS } from "@/lib/config";
import type { Level } from "@/types";

interface Company { id: string; name: string; }

interface Props {
  open: boolean;
  onClose: () => void;
  defaultCompanyId?: string;
}

const RATINGS = [1, 2, 3, 4, 5];

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {RATINGS.map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
          className={`text-xl transition-colors ${s <= (hover || value) ? "text-[#FF5A5F]" : "text-[#EBEBEB]"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export function WriteReviewModal({ open, onClose, defaultCompanyId }: Props) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [form, setForm] = useState({
    company_id: defaultCompanyId ?? "",
    role: "", level: "", location: "", title: "", pros: "", cons: "",
    rating_overall: 0, rating_wlb: 0, rating_growth: 0,
    rating_mgmt: 0, rating_culture: 0, rating_compensation: 0,
    would_recommend: true,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    fetch("/api/companies")
      .then((r) => r.json())
      .then((data: Company[]) => setCompanies(data))
      .catch(() => {});
  }, [open]);

  useEffect(() => {
    if (defaultCompanyId) setForm((f) => ({ ...f, company_id: defaultCompanyId }));
  }, [defaultCompanyId]);

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company_id || !form.title || !form.rating_overall) {
      setError("Company, title, and overall rating are required.");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          rating_wlb: form.rating_wlb || null,
          rating_growth: form.rating_growth || null,
          rating_mgmt: form.rating_mgmt || null,
          rating_culture: form.rating_culture || null,
          rating_compensation: form.rating_compensation || null,
          level: form.level || null,
          location: form.location || null,
          role: form.role || null,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message ?? "Failed to submit");
      }
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  };

  if (!open) return null;

  const inputCls = "border border-[#EBEBEB] rounded-lg px-3 py-2 text-sm text-[#222222] focus:outline-none focus:border-[#FF5A5F] w-full bg-white";
  const labelCls = "text-xs font-medium text-[#717171] uppercase tracking-wide mb-1 block";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBEBEB]">
          <h2 className="text-lg font-bold text-[#222222]">Write a Review</h2>
          <button onClick={onClose} className="text-[#717171] hover:text-[#222222] text-xl leading-none">✕</button>
        </div>

        {status === "success" ? (
          <div className="p-10 text-center space-y-3">
            <div className="text-5xl">🎉</div>
            <p className="font-semibold text-[#222222]">Review submitted!</p>
            <p className="text-sm text-[#717171]">Thank you for helping the community.</p>
            <button onClick={onClose} className="mt-2 px-5 py-2 bg-[#FF5A5F] text-white text-sm font-medium rounded-lg hover:bg-[#e04e53]">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Company */}
            <div>
              <label className={labelCls}>Company *</label>
              <select value={form.company_id} onChange={(e) => set("company_id", e.target.value)} className={inputCls} required>
                <option value="">Select a company</option>
                {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Role & Level */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Role</label>
                <input type="text" placeholder="e.g. Software Engineer" value={form.role} onChange={(e) => set("role", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Level</label>
                <select value={form.level} onChange={(e) => set("level", e.target.value)} className={inputCls}>
                  <option value="">Select level</option>
                  {ALL_LEVELS.map((l) => <option key={l} value={l}>{LEVEL_LABELS[l as Level]}</option>)}
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className={labelCls}>Location</label>
              <select value={form.location} onChange={(e) => set("location", e.target.value)} className={inputCls}>
                <option value="">Select location</option>
                {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className={labelCls}>Review Title *</label>
              <input type="text" placeholder="Summarise your experience" value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} required />
            </div>

            {/* Overall rating */}
            <div>
              <label className={labelCls}>Overall Rating *</label>
              <StarPicker value={form.rating_overall} onChange={(v) => set("rating_overall", v)} />
            </div>

            {/* Sub-ratings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {([
                ["rating_wlb", "Work-Life Balance"],
                ["rating_growth", "Growth"],
                ["rating_mgmt", "Management"],
                ["rating_culture", "Culture"],
                ["rating_compensation", "Compensation"],
              ] as [string, string][]).map(([key, label]) => (
                <div key={key}>
                  <label className={labelCls}>{label}</label>
                  <StarPicker value={form[key as keyof typeof form] as number} onChange={(v) => set(key, v)} />
                </div>
              ))}
            </div>

            {/* Pros */}
            <div>
              <label className={labelCls}>Pros</label>
              <textarea rows={2} placeholder="What do you like?" value={form.pros} onChange={(e) => set("pros", e.target.value)} className={inputCls} />
            </div>

            {/* Cons */}
            <div>
              <label className={labelCls}>Cons</label>
              <textarea rows={2} placeholder="What could be better?" value={form.cons} onChange={(e) => set("cons", e.target.value)} className={inputCls} />
            </div>

            {/* Recommend */}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="recommend" checked={form.would_recommend} onChange={(e) => set("would_recommend", e.target.checked)} className="accent-[#FF5A5F]" />
              <label htmlFor="recommend" className="text-sm text-[#484848]">I would recommend this company</label>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex-1 py-2.5 bg-[#FF5A5F] text-white text-sm font-medium rounded-lg hover:bg-[#e04e53] disabled:opacity-60 transition-colors"
              >
                {status === "loading" ? "Submitting…" : "Submit Review"}
              </button>
              <button type="button" onClick={onClose} className="px-4 py-2.5 border border-[#EBEBEB] text-sm text-[#484848] rounded-lg hover:bg-[#F7F7F7]">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
