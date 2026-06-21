"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { StarRating } from "@/components/ui/StarRating";
import { formatSalary } from "@/lib/salary";
import type { Company } from "@/types";

type CompanyItem = Company & { salary_count: number; median_tc: number; avg_rating?: number };

interface Props {
  companies: CompanyItem[];
  industries: string[];
}

function CompanyBox({ company, onClick, active }: { company: CompanyItem; onClick: () => void; active: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-white border rounded-xl p-5 transition-all group ${
        active ? "border-[#FF5A5F] shadow-md ring-2 ring-[#FF5A5F]/20" : "border-[#EBEBEB] hover:border-[#FF5A5F] hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 bg-[#F7F7F7] rounded-lg flex items-center justify-center text-lg font-bold text-[#222222] border border-[#EBEBEB]">
          {company.name.charAt(0)}
        </div>
        {company.funding_stage && (
          <span className="text-xs px-2 py-0.5 bg-[#F7F7F7] text-[#717171] rounded-full border border-[#EBEBEB]">
            {company.funding_stage}
          </span>
        )}
      </div>

      <h3 className={`font-semibold transition-colors ${active ? "text-[#FF5A5F]" : "text-[#222222] group-hover:text-[#FF5A5F]"}`}>
        {company.name}
      </h3>
      <p className="text-xs text-[#717171] mt-0.5">{company.industry} · {company.headquarters}</p>

      {company.avg_rating != null && (
        <div className="mt-2">
          <StarRating value={company.avg_rating} />
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-[#EBEBEB] flex items-center justify-between">
        {company.median_tc > 0 ? (
          <div>
            <p className="text-xs text-[#717171]">Median TC</p>
            <p className="text-sm font-bold text-[#0369A1]">{formatSalary(company.median_tc, "INR")}</p>
          </div>
        ) : <div />}
        {company.salary_count > 0 && (
          <p className="text-xs text-[#717171]">{company.salary_count} salaries</p>
        )}
      </div>

      <p className={`text-xs font-medium mt-2 transition-colors ${active ? "text-[#FF5A5F]" : "text-[#717171] group-hover:text-[#FF5A5F]"}`}>
        {active ? "▼ Details shown below" : "Click to view details"}
      </p>
    </button>
  );
}

function CompanyDetailPanel({ company, onClose }: { company: CompanyItem; onClose: () => void }) {
  const facts = [
    { label: "Industry", value: company.industry ?? "—" },
    { label: "Headquarters", value: company.headquarters ?? "—" },
    { label: "Founded", value: company.founded_year ? String(company.founded_year) : "—" },
    { label: "Headcount", value: company.headcount_range ?? "—" },
    { label: "Funding Stage", value: company.funding_stage ?? "—" },
    { label: "Website", value: company.website ?? "—" },
  ];

  return (
    <div className="col-span-full bg-white border-2 border-[#FF5A5F] rounded-xl p-4 sm:p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#F7F7F7] border border-[#EBEBEB] rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold text-[#222222] shrink-0">
            {company.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-[#222222] truncate">{company.name}</h2>
            <p className="text-sm text-[#717171]">{company.industry} · {company.headquarters}</p>
            {company.avg_rating != null && (
              <div className="mt-1">
                <StarRating value={company.avg_rating} />
              </div>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-[#717171] hover:text-[#222222] text-xl leading-none p-1 rounded-lg hover:bg-[#F7F7F7] transition-colors"
          aria-label="Close panel"
        >
          ✕
        </button>
      </div>

      {/* Description */}
      {company.description && (
        <p className="text-sm text-[#484848] mb-5 leading-relaxed">{company.description}</p>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {company.median_tc > 0 && (
          <div className="bg-[#F7F7F7] rounded-lg p-3">
            <p className="text-xs text-[#717171] uppercase tracking-wide mb-0.5">Median TC</p>
            <p className="text-lg font-bold text-[#0369A1]">{formatSalary(company.median_tc, "INR")}</p>
          </div>
        )}
        {company.salary_count > 0 && (
          <div className="bg-[#F7F7F7] rounded-lg p-3">
            <p className="text-xs text-[#717171] uppercase tracking-wide mb-0.5">Salary Data Points</p>
            <p className="text-lg font-bold text-[#222222]">{company.salary_count}</p>
          </div>
        )}
        {company.talentdash_score != null && (
          <div className="bg-[#F7F7F7] rounded-lg p-3">
            <p className="text-xs text-[#717171] uppercase tracking-wide mb-0.5">TalentDash Score</p>
            <p className="text-lg font-bold text-[#008A05]">{company.talentdash_score.toFixed(1)}/100</p>
          </div>
        )}
        {company.avg_rating != null && (
          <div className="bg-[#F7F7F7] rounded-lg p-3">
            <p className="text-xs text-[#717171] uppercase tracking-wide mb-0.5">Employee Rating</p>
            <p className="text-lg font-bold text-[#222222]">{company.avg_rating.toFixed(1)}/5</p>
          </div>
        )}
      </div>

      {/* Quick facts grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {facts.map(({ label, value }) => (
          <div key={label} className="border border-[#EBEBEB] rounded-lg p-3">
            <p className="text-xs text-[#717171] uppercase tracking-wide">{label}</p>
            <p className="text-sm font-semibold text-[#222222] mt-0.5 truncate">
              {label === "Website" && value !== "—" ? (
                <a href={value} target="_blank" rel="noopener noreferrer" className="text-[#0369A1] hover:underline">
                  {value.replace("https://", "")}
                </a>
              ) : value}
            </p>
          </div>
        ))}
      </div>

      {/* CTA buttons */}
      <div className="flex flex-wrap gap-3">
        <Link
          href={`/companies/${company.slug}`}
          className="w-full sm:w-auto px-5 py-2.5 bg-[#FF5A5F] text-white text-sm font-semibold rounded-lg hover:bg-[#e84f54] transition-colors"
        >
          View Full Profile →
        </Link>
        <Link
          href={`/companies/${company.slug}#salaries`}
          className="w-full sm:w-auto px-5 py-2.5 border border-[#EBEBEB] text-sm font-medium text-[#484848] rounded-lg hover:bg-[#F7F7F7] transition-colors"
        >
          See Salaries
        </Link>
        <Link
          href={`/companies/${company.slug}#reviews`}
          className="w-full sm:w-auto px-5 py-2.5 border border-[#EBEBEB] text-sm font-medium text-[#484848] rounded-lg hover:bg-[#F7F7F7] transition-colors"
        >
          Read Reviews
        </Link>
        <Link
          href={`/compare?c1=${company.slug}`}
          className="w-full sm:w-auto px-5 py-2.5 border border-[#EBEBEB] text-sm font-medium text-[#484848] rounded-lg hover:bg-[#F7F7F7] transition-colors"
        >
          Compare
        </Link>
      </div>
    </div>
  );
}

export function CompaniesClient({ companies, industries }: Props) {
  const [industry, setIndustry] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("score");
  const [selected, setSelected] = useState<CompanyItem | null>(null);

  const filtered = useMemo(() => {
    let list = companies;
    if (industry !== "All") list = list.filter((c) => c.industry === industry);
    if (search.trim()) list = list.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
    if (sort === "score") list = [...list].sort((a, b) => (b.talentdash_score ?? 0) - (a.talentdash_score ?? 0));
    else if (sort === "salary") list = [...list].sort((a, b) => b.median_tc - a.median_tc);
    else if (sort === "rating") list = [...list].sort((a, b) => (b.avg_rating ?? 0) - (a.avg_rating ?? 0));
    else if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [companies, industry, search, sort]);

  // When filters change, close the panel
  const handleIndustry = (ind: string) => { setIndustry(ind); setSelected(null); };
  const handleSearch = (v: string) => { setSearch(v); setSelected(null); };

  const handleSelect = (c: CompanyItem) => {
    setSelected((prev) => prev?.id === c.id ? null : c);
  };

  // Insert detail panel after the row that contains the selected card
  // We split filtered into rows of 4 (matching xl:grid-cols-4) and inject panel after the row
  const COLS = 4;
  const rows: CompanyItem[][] = [];
  for (let i = 0; i < filtered.length; i += COLS) {
    rows.push(filtered.slice(i, i + COLS));
  }
  const selectedIndex = selected ? filtered.findIndex((c) => c.id === selected.id) : -1;
  const selectedRow = selectedIndex >= 0 ? Math.floor(selectedIndex / COLS) : -1;

  return (
    <>
      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 border border-[#EBEBEB] rounded-lg px-3 py-2 text-sm text-[#222222] placeholder:text-[#717171] focus:outline-none focus:border-[#FF5A5F]"
        />
        <div className="flex items-center gap-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="flex-1 sm:flex-none border border-[#EBEBEB] rounded-lg px-3 py-2 text-sm text-[#222222] bg-white focus:outline-none focus:border-[#FF5A5F]"
          >
            <option value="score">Sort: TalentDash Score</option>
            <option value="salary">Sort: Highest Salary</option>
            <option value="rating">Sort: Highest Rating</option>
            <option value="name">Sort: A–Z</option>
          </select>
          <span className="text-sm text-[#717171] whitespace-nowrap">{filtered.length} companies</span>
        </div>
      </div>

      {/* Industry pills - scrollable on mobile */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap no-scrollbar">
        {["All", ...industries].map((ind) => (
          <button
            key={ind}
            onClick={() => handleIndustry(ind)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
              industry === ind
                ? "bg-[#FF5A5F] text-white"
                : "bg-white border border-[#EBEBEB] text-[#484848] hover:border-[#FF5A5F] hover:text-[#FF5A5F]"
            }`}
          >
            {ind}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-[#717171] py-16">No companies match your filters.</p>
      ) : (
        <div className="space-y-0">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx}>
              {/* Cards row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
                {row.map((c) => (
                  <CompanyBox
                    key={c.id}
                    company={c}
                    onClick={() => handleSelect(c)}
                    active={selected?.id === c.id}
                  />
                ))}
              </div>
              {/* Detail panel injected after the row containing the selected card */}
              {selected && rowIdx === selectedRow && (
                <div className="mb-4">
                  <CompanyDetailPanel company={selected} onClose={() => setSelected(null)} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
