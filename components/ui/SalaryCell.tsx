import { formatSalary } from "@/lib/salary";
import type { Currency } from "@/types";

interface SalaryCellProps {
  amount: number;
  currency: Currency;
  displayCurrency?: Currency;
  dominant?: boolean;
}

export function SalaryCell({ amount, currency, displayCurrency, dominant }: SalaryCellProps) {
  if (!amount || amount <= 0) return <span className="text-[#717171]">—</span>;
  const formatted = formatSalary(amount, currency, displayCurrency);
  if (dominant) {
    return <span className="text-[#0369A1] font-bold text-base">{formatted}</span>;
  }
  return <span className="text-[#484848]">{formatted}</span>;
}
