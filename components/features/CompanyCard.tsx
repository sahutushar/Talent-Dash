import Link from "next/link";
import { StarRating } from "@/components/ui/StarRating";
import { formatSalary } from "@/lib/salary";
import type { Company } from "@/types";

interface CompanyCardProps {
  company: Company & { salary_count?: number; median_tc?: number; avg_rating?: number };
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link href={`/companies/${company.slug}`} className="block bg-white border border-[#EBEBEB] rounded-xl p-5 hover:border-[#FF5A5F] hover:shadow-sm transition-all group">
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
      <h3 className="font-semibold text-[#222222] group-hover:text-[#FF5A5F] transition-colors">{company.name}</h3>
      <p className="text-xs text-[#717171] mt-0.5">{company.industry} · {company.headquarters}</p>

      {company.avg_rating != null && (
        <div className="mt-2">
          <StarRating value={company.avg_rating} />
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-[#EBEBEB] flex items-center justify-between">
        {company.median_tc != null && company.median_tc > 0 ? (
          <div>
            <p className="text-xs text-[#717171]">Median TC</p>
            <p className="text-sm font-bold text-[#0369A1]">{formatSalary(company.median_tc, "INR")}</p>
          </div>
        ) : <div />}
        {company.salary_count != null && (
          <p className="text-xs text-[#717171]">{company.salary_count} salaries</p>
        )}
      </div>
    </Link>
  );
}
