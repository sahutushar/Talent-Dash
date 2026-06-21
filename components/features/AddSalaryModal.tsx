"use client";

import { useState, useEffect } from "react";
import { ALL_LEVELS, LEVEL_LABELS, LOCATIONS } from "@/lib/config";
import type { Level, Currency } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  defaultCompany?: string;
}

const CURRENCIES: Currency[] = ["INR", "USD", "GBP", "EUR"];
const ROLES = [
  "Software Engineer", "Senior Software Engineer", "Software Development Engineer",
  "Product Manager", "Data Scientist", "Data Analyst", "ML Engineer",
  "DevOps Engineer", "Frontend Engineer", "Backend Engineer", "Full Stack Engineer",
];

const EMPTY = {
  company: "", role: "", level: "", location: "", currency: "INR" as Currency,
  experience_years: "", base_salary: "", bonus: "", stock: "",
};

export function AddSalaryModal({ open, onClose, defaultCompany }: Props) {
  const [form, setForm] = useState(() => defaultCompany ? { ...EMPTY, company: defaultCompany } : EMPTY);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) { setForm(defaultCompany ? { ...EMPTY, company: defaultCompany } : EMPTY); setStatus("idle"); setError(""); }
  }, [open]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company || !form.role || !form.level || !form.location || !form.base_salary || !form.experience_years) {
      setError("Company, role, level, location, experience, and base salary are required.");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/ingest-salary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: form.company,
          role: form.role,
          level: form.level,
          location: form.location,
          currency: form.currency,
          experience_years: parseInt(form.experience_years),
          base_salary: parseFloat(form.base_salary),
          bonus: form.bonus ? parseFloat(form.bonus) : 0,
          stock: form.stock ? parseFloat(form.stock) : 0,
          source: "CONTRIBUTOR",
          confidence_score: 0.8,
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBEBEB]">
          <h2 className="text-lg font-bold text-[#222222]">Add Salary</h2>
          <button onClick={onClose} className="text-[#717171] hover:text-[#222222] text-xl leading-none">✕</button>
        </div>

        {status === "success" ? (
          <div className="p-10 text-center space-y-3">
            <div className="text-5xl">🎉</div>
            <p className="font-semibold text-[#222222]">Salary submitted!</p>
            <p className="text-sm text-[#717171]">Thank you for helping the community.</p>
            <button onClick={onClose} className="mt-2 px-5 py-2 bg-[#FF5A5F] text-white text-sm font-medium rounded-lg hover:bg-[#e04e53]">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className={labelCls}>Company *</label>
              <input type="text" placeholder="e.g. Google" value={form.company} onChange={(e) => set("company", e.target.value)} className={inputCls} required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Role *</label>
                <input list="salary-roles" type="text" placeholder="e.g. Software Engineer" value={form.role} onChange={(e) => set("role", e.target.value)} className={inputCls} required />
                <datalist id="salary-roles">{ROLES.map((r) => <option key={r} value={r} />)}</datalist>
              </div>
              <div>
                <label className={labelCls}>Level *</label>
                <select value={form.level} onChange={(e) => set("level", e.target.value)} className={inputCls} required>
                  <option value="">Select level</option>
                  {ALL_LEVELS.map((l) => <option key={l} value={l}>{LEVEL_LABELS[l as Level]}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Location *</label>
                <select value={form.location} onChange={(e) => set("location", e.target.value)} className={inputCls} required>
                  <option value="">Select location</option>
                  {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Currency *</label>
                <select value={form.currency} onChange={(e) => set("currency", e.target.value as Currency)} className={inputCls}>
                  {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}>Years of Experience *</label>
              <input type="number" min="1" max="50" placeholder="e.g. 3" value={form.experience_years} onChange={(e) => set("experience_years", e.target.value)} className={inputCls} required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className={labelCls}>Base Salary *</label>
                <input type="number" min="0" placeholder="Annual" value={form.base_salary} onChange={(e) => set("base_salary", e.target.value)} className={inputCls} required />
              </div>
              <div>
                <label className={labelCls}>Bonus</label>
                <input type="number" min="0" placeholder="Annual" value={form.bonus} onChange={(e) => set("bonus", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Stock (annual)</label>
                <input type="number" min="0" placeholder="Annual" value={form.stock} onChange={(e) => set("stock", e.target.value)} className={inputCls} />
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex-1 py-2.5 bg-[#FF5A5F] text-white text-sm font-medium rounded-lg hover:bg-[#e04e53] disabled:opacity-60 transition-colors"
              >
                {status === "loading" ? "Submitting…" : "Submit Salary"}
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
