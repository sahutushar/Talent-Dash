"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatSalary, formatDelta } from "@/lib/salary";
import { LevelBadge } from "@/components/ui/Badge";
import type { Salary, CompareDelta } from "@/types";

interface CompareResult {
  record1: Salary & { company: { name: string; slug: string } };
  record2: Salary & { company: { name: string; slug: string } };
  delta: CompareDelta;
}

function CompareContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [s1, setS1] = useState(params.get("s1") ?? "");
  const [s2, setS2] = useState(params.get("s2") ?? "");
  const [result, setResult] = useState<CompareResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [allSalaries, setAllSalaries] = useState<(Salary & { company: { name: string; slug: string } })[]>([]);

  useEffect(() => {
    fetch("/api/salaries?limit=100&sort=total_comp_desc")
      .then((r) => r.json())
      .then((d) => setAllSalaries(d.data ?? []));
  }, []);

  const compare = useCallback(async (id1: string, id2: string) => {
    if (!id1 || !id2) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/compare?s1=${id1}&s2=${id2}`);
      const data = await res.json();
      if (!res.ok) { setError(data.message ?? "Error comparing records"); setResult(null); }
      else { setResult(data); router.replace(`/compare?s1=${id1}&s2=${id2}`, { scroll: false }); }
    } catch { setError("Failed to fetch comparison"); }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => {
    const p1 = params.get("s1"), p2 = params.get("s2");
    if (p1 && p2) { setS1(p1); setS2(p2); compare(p1, p2); }
  }, []); // eslint-disable-line

  const ROWS = [
    { label: "Company", key: "company", render: (s: Salary & { company: { name: string } }) => s.company?.name },
    { label: "Role", key: "role", render: (s: Salary) => s.role },
    { label: "Level", key: "level", render: (s: Salary) => <LevelBadge level={s.level} /> },
    { label: "Location", key: "location", render: (s: Salary) => s.location },
    { label: "Experience", key: "experience_years", render: (s: Salary) => `${s.experience_years} years` },
    { label: "Base Salary", key: "base_salary", render: (s: Salary) => formatSalary(s.base_salary, s.currency), delta: (d: CompareDelta) => d.base_delta },
    { label: "Bonus", key: "bonus", render: (s: Salary) => s.bonus > 0 ? formatSalary(s.bonus, s.currency) : "—", delta: (d: CompareDelta) => d.bonus_delta },
    { label: "Stock / ESOP", key: "stock", render: (s: Salary) => s.stock > 0 ? formatSalary(s.stock, s.currency) : "—", delta: (d: CompareDelta) => d.stock_delta },
    { label: "Total Comp", key: "total_compensation", render: (s: Salary) => <span className="text-[#0369A1] font-bold text-base">{formatSalary(s.total_compensation, s.currency)}</span>, delta: (d: CompareDelta) => d.tc_delta, dominant: true },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#222222] mb-2">Compare Offers</h1>
      <p className="text-[#717171] mb-8">Select two salary records to compare them side-by-side.</p>

      {/* Selectors */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {[
          { id: s1, setId: setS1, label: "Offer A" },
          { id: s2, setId: setS2, label: "Offer B" },
        ].map(({ id, setId, label }) => (
          <div key={label}>
            <label className="block text-xs font-semibold text-[#717171] uppercase tracking-wide mb-1.5">{label}</label>
            <select
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full border border-[#EBEBEB] rounded-xl px-3 py-2.5 text-sm text-[#222222] bg-white focus:outline-none focus:border-[#FF5A5F]"
            >
              <option value="">Select a salary record...</option>
              {allSalaries.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.company?.name} · {s.role} · {s.level} · {formatSalary(s.total_compensation, s.currency)} TC
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <button
        onClick={() => compare(s1, s2)}
        disabled={!s1 || !s2 || loading}
        className="mb-8 w-full sm:w-auto px-6 py-2.5 bg-[#FF5A5F] text-white font-medium rounded-xl hover:bg-[#e84f54] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Comparing..." : "Compare"}
      </button>

      {error && <p className="text-[#D93025] bg-red-50 border border-red-100 rounded-xl p-4 mb-6">{error}</p>}

      {result && (
        <div className="bg-white border border-[#EBEBEB] rounded-xl overflow-x-auto">
          {/* Winner banner */}
          <div className="grid grid-cols-[1fr_1fr_1fr] bg-[#F7F7F7] border-b border-[#EBEBEB]">
            <div className="px-3 sm:px-4 py-3 text-xs font-semibold text-[#717171] uppercase tracking-wide">Field</div>
            <div className="px-3 sm:px-4 py-3 text-center">
              <p className="text-xs font-semibold text-[#717171] uppercase tracking-wide mb-1">Offer A</p>
              {result.delta.tc_delta >= 0 && (
                <span className="inline-block text-xs px-2 py-0.5 bg-blue-50 text-[#0369A1] font-semibold rounded-full">Higher TC</span>
              )}
            </div>
            <div className="px-3 sm:px-4 py-3 text-center">
              <p className="text-xs font-semibold text-[#717171] uppercase tracking-wide mb-1">Offer B</p>
              {result.delta.tc_delta < 0 && (
                <span className="inline-block text-xs px-2 py-0.5 bg-blue-50 text-[#0369A1] font-semibold rounded-full">Higher TC</span>
              )}
            </div>
          </div>

          {ROWS.map(({ label, render, delta, dominant }) => {
            const d = delta ? delta(result.delta) : null;
            return (
              <div key={label} className={`grid grid-cols-[1fr_1fr_1fr] border-b border-[#EBEBEB] last:border-0 ${dominant ? "bg-[#f0f9ff]" : "hover:bg-[#F7F7F7]"}`}>
                <div className="px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium text-[#717171]">{label}</div>
                <div className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-[#222222] text-center">
                  {render(result.record1 as never)}
                  {d !== null && d !== 0 && (
                    <span className={`block text-xs font-medium mt-0.5 ${d > 0 ? "text-[#008A05]" : "text-[#D93025]"}`}>
                      {formatDelta(d, result.record1.currency)}
                    </span>
                  )}
                </div>
                <div className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-[#222222] text-center">
                  {render(result.record2 as never)}
                  {d !== null && d !== 0 && (
                    <span className={`block text-xs font-medium mt-0.5 ${-d > 0 ? "text-[#008A05]" : "text-[#D93025]"}`}>
                      {formatDelta(-d, result.record2.currency)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto px-4 py-8 text-[#717171]">Loading...</div>}>
      <CompareContent />
    </Suspense>
  );
}
