"use client";

import { useState } from "react";

function calcTax(annual: number): number {
  // New tax regime FY 2025-26
  if (annual <= 300000) return 0;
  if (annual <= 700000) return (annual - 300000) * 0.05;
  if (annual <= 1000000) return 20000 + (annual - 700000) * 0.1;
  if (annual <= 1200000) return 50000 + (annual - 1000000) * 0.15;
  if (annual <= 1500000) return 80000 + (annual - 1200000) * 0.2;
  return 140000 + (annual - 1500000) * 0.3;
}

function fmt(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export function SalaryCalculatorTool() {
  const [ctc, setCtc] = useState("");
  const [bonus, setBonus] = useState("");
  const [stock, setStock] = useState("");

  const ctcVal = parseFloat(ctc) * 100000 || 0;
  const bonusVal = parseFloat(bonus) * 100000 || 0;
  const stockVal = parseFloat(stock) * 100000 || 0;
  const totalTC = ctcVal + bonusVal + stockVal;

  // PF: 12% of basic (basic = 40% of CTC), capped at 1800/month
  const basic = ctcVal * 0.4;
  const pfEmployee = Math.min(basic * 0.12, 21600);
  const pfEmployer = Math.min(basic * 0.12, 21600);
  const professionalTax = 2400; // ~200/month
  const grossTaxable = ctcVal - pfEmployee - pfEmployer;
  const incomeTax = calcTax(grossTaxable);
  const cess = incomeTax * 0.04;
  const totalTax = incomeTax + cess;
  const inHand = ctcVal - pfEmployee - professionalTax - totalTax;
  const monthlyInHand = inHand / 12;

  const hasValue = ctcVal > 0;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#EBEBEB] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[#222222] mb-4">Enter Your Compensation</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: "Base CTC (LPA)", val: ctc, set: setCtc, hint: "Annual fixed pay" },
            { label: "Annual Bonus (LPA)", val: bonus, set: setBonus, hint: "Performance bonus" },
            { label: "Stock / ESOP (LPA)", val: stock, set: setStock, hint: "Annual vesting value" },
          ].map(({ label, val, set, hint }) => (
            <div key={label}>
              <label className="block text-xs font-semibold text-[#717171] uppercase tracking-wide mb-1">{label}</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-[#717171]">₹</span>
                <input
                  type="number"
                  value={val}
                  onChange={(e) => set(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full border border-[#EBEBEB] rounded-lg pl-7 pr-12 py-2.5 text-sm focus:outline-none focus:border-[#FF5A5F]"
                />
                <span className="absolute right-3 top-2.5 text-xs text-[#717171]">L</span>
              </div>
              <p className="text-xs text-[#717171] mt-0.5">{hint}</p>
            </div>
          ))}
        </div>
      </div>

      {hasValue && (
        <div className="bg-white border border-[#EBEBEB] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#222222] mb-4">Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              {[
                { label: "Gross CTC", val: ctcVal, color: "text-[#222222]" },
                { label: "PF (Employee, 12%)", val: -pfEmployee, color: "text-[#D93025]" },
                { label: "Professional Tax", val: -professionalTax, color: "text-[#D93025]" },
                { label: "Income Tax + Cess", val: -totalTax, color: "text-[#D93025]" },
              ].map(({ label, val, color }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-[#F7F7F7]">
                  <span className="text-sm text-[#484848]">{label}</span>
                  <span className={`text-sm font-medium ${color}`}>{val < 0 ? `-${fmt(Math.abs(val))}` : fmt(val)}</span>
                </div>
              ))}
            </div>
            <div className="bg-[#F7F7F7] rounded-xl p-5 flex flex-col items-center justify-center text-center">
              <p className="text-xs text-[#717171] uppercase tracking-wide mb-2">Annual In-Hand</p>
              <p className="text-3xl font-bold text-[#008A05]">{fmt(inHand)}</p>
              <p className="text-sm text-[#717171] mt-2">Monthly In-Hand</p>
              <p className="text-xl font-bold text-[#0369A1] mt-0.5">{fmt(monthlyInHand)}</p>
              {totalTC > ctcVal && (
                <div className="mt-4 pt-4 border-t border-[#EBEBEB] w-full">
                  <p className="text-xs text-[#717171]">Total Comp (with bonus + stock)</p>
                  <p className="text-lg font-bold text-[#222222]">{fmt(totalTC)}</p>
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-[#717171] mt-4">* Calculated using new tax regime (FY 2025-26). Actual figures may vary based on deductions, city, and employer benefits.</p>
        </div>
      )}
    </div>
  );
}
