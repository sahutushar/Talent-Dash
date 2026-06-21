import Link from "next/link";
import { LevelBadge } from "@/components/ui/Badge";
import { SalaryCell } from "@/components/ui/SalaryCell";
import type { Salary, Currency } from "@/types";

interface SalaryTableProps {
  salaries: Salary[];
  displayCurrency?: Currency;
  showCompany?: boolean;
}

export function SalaryTable({ salaries, displayCurrency = "INR", showCompany = true }: SalaryTableProps) {
  if (salaries.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-[#EBEBEB]">
        <p className="text-lg font-semibold text-[#222222]">No records found for these filters.</p>
        <p className="text-sm text-[#717171] mt-1">Try removing a filter.</p>
        <Link href="/salaries" className="mt-4 inline-block text-sm text-[#FF5A5F] hover:underline">
          Clear all filters
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#EBEBEB] overflow-hidden">
      {/* Mobile card view */}
      <div className="sm:hidden divide-y divide-[#EBEBEB]">
        {salaries.map((s) => (
          <div key={s.id} className="p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                {showCompany && (
                  <Link href={`/companies/${s.company?.slug ?? s.company_id}`} className="font-semibold text-[#222222] hover:text-[#FF5A5F] text-sm block truncate">
                    {s.company?.name ?? s.company_id}
                  </Link>
                )}
                <p className="text-sm text-[#484848] truncate">{s.role}</p>
                <p className="text-xs text-[#717171]">{s.location} · {s.experience_years}y exp</p>
              </div>
              <LevelBadge level={s.level} />
            </div>
            <div className="flex items-center gap-3 pt-1 border-t border-[#F7F7F7]">
              <div>
                <p className="text-xs text-[#717171]">Base</p>
                <SalaryCell amount={s.base_salary} currency={s.currency} displayCurrency={displayCurrency} />
              </div>
              {s.stock > 0 && (
                <div>
                  <p className="text-xs text-[#717171]">Stock</p>
                  <SalaryCell amount={s.stock} currency={s.currency} displayCurrency={displayCurrency} />
                </div>
              )}
              <div className="ml-auto">
                <p className="text-xs text-[#717171]">Total TC</p>
                <SalaryCell amount={s.total_compensation} currency={s.currency} displayCurrency={displayCurrency} dominant />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#EBEBEB] bg-[#F7F7F7]">
              {showCompany && <th className="text-left px-4 py-3 text-xs font-semibold text-[#717171] uppercase tracking-wide whitespace-nowrap">Company</th>}
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#717171] uppercase tracking-wide whitespace-nowrap">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#717171] uppercase tracking-wide">Level</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#717171] uppercase tracking-wide">Location</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#717171] uppercase tracking-wide whitespace-nowrap">Exp</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#717171] uppercase tracking-wide whitespace-nowrap">Base</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#717171] uppercase tracking-wide">Stock</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#717171] uppercase tracking-wide whitespace-nowrap">Total Comp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EBEBEB]">
            {salaries.map((s) => (
              <tr key={s.id} className="hover:bg-[#F2F2F2] transition-colors">
                {showCompany && (
                  <td className="px-4 py-3">
                    <Link href={`/companies/${s.company?.slug ?? s.company_id}`} className="font-medium text-[#222222] hover:text-[#FF5A5F]">
                      {s.company?.name ?? s.company_id}
                    </Link>
                  </td>
                )}
                <td className="px-4 py-3 text-[#484848] max-w-[200px] truncate">{s.role}</td>
                <td className="px-4 py-3"><LevelBadge level={s.level} /></td>
                <td className="px-4 py-3 text-[#484848] whitespace-nowrap">{s.location}</td>
                <td className="px-4 py-3 text-[#484848] whitespace-nowrap">{s.experience_years}y</td>
                <td className="px-4 py-3"><SalaryCell amount={s.base_salary} currency={s.currency} displayCurrency={displayCurrency} /></td>
                <td className="px-4 py-3">
                  {s.stock > 0 ? <SalaryCell amount={s.stock} currency={s.currency} displayCurrency={displayCurrency} /> : <span className="text-[#717171]">—</span>}
                </td>
                <td className="px-4 py-3"><SalaryCell amount={s.total_compensation} currency={s.currency} displayCurrency={displayCurrency} dominant /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
