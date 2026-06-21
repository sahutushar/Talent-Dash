"use client";
import { useState } from "react";

export function EquityCalculatorTool() {
  const [grants, setGrants] = useState("");
  const [strikePrice, setStrikePrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [vestingYears, setVestingYears] = useState("4");
  const [cliffMonths, setCliffMonths] = useState("12");

  const g = parseFloat(grants) || 0;
  const sp = parseFloat(strikePrice) || 0;
  const cp = parseFloat(currentPrice) || 0;
  const vy = parseFloat(vestingYears) || 4;
  const cliff = parseFloat(cliffMonths) || 12;

  const cliffPct = cliff / (vy * 12);
  const cliffGrants = Math.floor(g * cliffPct);
  const remaining = g - cliffGrants;
  const monthlyAfterCliff = remaining / ((vy * 12) - cliff);

  const annualVesting = [
    { year: 1, grants: cliffGrants },
    ...Array.from({ length: Math.max(0, vy - 1) }, (_, i) => ({ year: i + 2, grants: Math.floor(monthlyAfterCliff * 12) })),
  ];

  const profitPerShare = cp - sp;
  const hasValue = g > 0 && cp > 0;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#EBEBEB] rounded-xl p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "Total Grants (units)", val: grants, set: setGrants, placeholder: "e.g. 1000" },
            { label: "Strike / Exercise Price (₹)", val: strikePrice, set: setStrikePrice, placeholder: "e.g. 100" },
            { label: "Current / Expected Price (₹)", val: currentPrice, set: setCurrentPrice, placeholder: "e.g. 500" },
            { label: "Vesting Period (years)", val: vestingYears, set: setVestingYears, placeholder: "4" },
          ].map(({ label, val, set, placeholder }) => (
            <div key={label}>
              <label className="block text-xs font-semibold text-[#717171] uppercase tracking-wide mb-1">{label}</label>
              <input type="number" value={val} onChange={(e) => set(e.target.value)} placeholder={placeholder} className="w-full border border-[#EBEBEB] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5A5F]" />
            </div>
          ))}
        </div>
      </div>

      {hasValue && (
        <div className="bg-white border border-[#EBEBEB] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#222222] mb-4">Vesting Schedule</h2>
          <div className="space-y-3 mb-5">
            {annualVesting.map(({ year, grants: g2 }) => {
              const value = g2 * profitPerShare;
              return (
                <div key={year} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <span className="text-sm text-[#717171] w-16">Year {year}</span>
                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex-1 h-2 bg-[#EBEBEB] rounded-full overflow-hidden">
                      <div className="h-full bg-[#0369A1] rounded-full" style={{ width: `${(g2 / g) * 100}%` }} />
                    </div>
                    <span className="text-sm font-medium text-[#222222] whitespace-nowrap">{g2.toLocaleString()} units</span>
                    <span className={`text-sm font-medium whitespace-nowrap ${value >= 0 ? "text-[#008A05]" : "text-[#D93025]"}`}>
                      ₹{(Math.abs(value) / 100000).toFixed(1)}L
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bg-[#F7F7F7] rounded-xl p-4 text-center">
            <p className="text-xs text-[#717171] uppercase tracking-wide mb-1">Total Value at ₹{cp}/share</p>
            <p className={`text-2xl font-bold ${g * profitPerShare >= 0 ? "text-[#008A05]" : "text-[#D93025]"}`}>
              ₹{((g * profitPerShare) / 100000).toFixed(1)}L
            </p>
            <p className="text-xs text-[#717171] mt-1">
              Profit per share: ₹{(cp - sp).toFixed(0)} × {g.toLocaleString()} units
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
