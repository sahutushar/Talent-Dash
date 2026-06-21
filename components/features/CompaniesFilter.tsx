"use client";

import { useState } from "react";
import { StarRating } from "@/components/ui/StarRating";
import { formatSalary } from "@/lib/salary";

type Company = {
  id: string;
  name: string;
  slug: string;
  normalized_name: string;
  industry?: string | null;
  headquarters?: string | null;
  founded_year?: number | null;
  headcount_range?: string | null;
  logo_url?: string | null;
  website?: string | null;
  funding_stage?: string | null;
  description?: string | null;
  glassdoor_rating?: number | null;
  ambitionbox_rating?: number | null;
  talentdash_score?: number | null;
  created_at: string;
  updated_at: string;
  salary_count: number;
  median_tc: number;
  avg_rating?: number;
};

interface CompaniesFilterProps {
  companies: Company[];
  industries: string[];
}

function CompanyCardButton({ company, onClick }: { company: Company; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-[#EBEBEB] rounded-xl p-5 hover:border-[#FF5A5F] hover:shadow-sm transition-all group cursor-pointer"
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
      <h3 className="font-semibold text-[#222222] group-hover:text-[#FF5A5F] transition-colors">
        {company.name}
      </h3>
      <p className="text-xs text-[#717171] mt-0.5">
        {company.industry} · {company.headquarters}
      </p>
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
      <p className="text-xs text-[#FF5A5F] mt-2 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
        Quick view →
      </p>
    </button>
  );
}

export function CompaniesFilter({ companies, industries }: CompaniesFilterProps) {
  const [active, setActive] = useState<string>("All");
  const [selected, setSelected] = useState<Company | null>(null);

  const filtered =
    active === "All" ? companies : companies.filter((c) => c.industry === active);

  return (
    <>
      {/* Industry filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {["All", ...industries].map((ind) => (
          <button
            key={ind}
            onClick={() => setActive(ind)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
              active === ind
                ? "bg-[#FF5A5F] text-white"
                : "bg-white border border-[#EBEBEB] text-[#484848] hover:border-[#FF5A5F] hover:text-[#FF5A5F]"
            }`}
          >
            {ind}
            {ind !== "All" && (
              <span className="ml-1.5 text-xs opacity-70">
                ({companies.filter((c) => c.industry === ind).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-sm text-[#717171] mb-4">
        Showing <span className="font-semibold text-[#222222]">{filtered.length}</span>{" "}
        {active === "All" ? "companies" : `${active} companies`}
        <span className="ml-2 text-xs text-[#717171]">· Click a card for quick view</span>
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((c) => (
          <CompanyCardButton key={c.id} company={c} onClick={() => setSelected(c)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-[#EBEBEB]">
          <p className="text-lg font-semibold text-[#222222]">No companies found</p>
          <p className="text-sm text-[#717171] mt-1">Try a different industry filter.</p>
        </div>
      )}

      {/* Quick view popup */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-[#222222]">{selected.name}</h3>
                <p className="text-xs text-[#717171]">{selected.industry} · {selected.headquarters}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-[#717171] hover:text-[#222222] text-xl leading-none">×</button>
            </div>
            {selected.median_tc > 0 && <p className="text-sm text-[#717171]">Median TC: <span className="font-bold text-[#0369A1]">{formatSalary(selected.median_tc, "INR")}</span></p>}
            <a href={`/companies/${selected.slug}`} className="mt-4 block text-center px-4 py-2 bg-[#FF5A5F] text-white text-sm font-medium rounded-lg hover:bg-[#e84f54]">View Full Profile →</a>
          </div>
        </div>
      )}
    </>
  );
}
