"use client";
import { useState } from "react";

function fmt(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export function HikeCalculatorTool() {
  const [current, setCurrent] = useState("");
  const [hike, setHike] = useState("");

  const cur = parseFloat(current) * 100000 || 0;
  const hikeVal = parseFloat(hike) || 0;
  const increase = (cur * hikeVal) / 100;
  const newCTC = cur + increase;

  return (
    <div className="bg-white border border-[#EBEBEB] rounded-xl p-6 space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#717171] uppercase tracking-wide mb-1">Current CTC (LPA)</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-sm text-[#717171]">₹</span>
            <input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="0" className="w-full border border-[#EBEBEB] rounded-lg pl-7 pr-10 py-2.5 text-sm focus:outline-none focus:border-[#FF5A5F]" />
            <span className="absolute right-3 top-2.5 text-xs text-[#717171]">L</span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#717171] uppercase tracking-wide mb-1">Hike Percentage (%)</label>
          <div className="relative">
            <input type="number" value={hike} onChange={(e) => setHike(e.target.value)} placeholder="0" className="w-full border border-[#EBEBEB] rounded-lg px-3 pr-8 py-2.5 text-sm focus:outline-none focus:border-[#FF5A5F]" />
            <span className="absolute right-3 top-2.5 text-sm text-[#717171]">%</span>
          </div>
        </div>
      </div>

      {cur > 0 && hikeVal > 0 && (
        <div className="bg-[#F7F7F7] rounded-xl p-5 grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xs text-[#717171] uppercase tracking-wide mb-1">Current CTC</p>
            <p className="text-lg font-bold text-[#222222]">{fmt(cur)}</p>
          </div>
          <div>
            <p className="text-xs text-[#717171] uppercase tracking-wide mb-1">Increase</p>
            <p className="text-lg font-bold text-[#008A05]">+{fmt(increase)}</p>
          </div>
          <div>
            <p className="text-xs text-[#717171] uppercase tracking-wide mb-1">New CTC</p>
            <p className="text-lg font-bold text-[#0369A1]">{fmt(newCTC)}</p>
          </div>
        </div>
      )}

      <div className="bg-[#FFF5F5] border border-[#FFE0E0] rounded-xl p-4">
        <p className="text-xs font-semibold text-[#484848] mb-2">Industry benchmarks for hikes in India:</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-center">
          {[["Average appraisal", "8–12%"], ["Job switch (same level)", "20–40%"], ["Promotion switch", "40–70%"]].map(([label, val]) => (
            <div key={label} className="bg-white rounded-lg p-2 border border-[#FFE0E0] flex sm:flex-col items-center sm:items-center justify-between sm:justify-center gap-2">
              <p className="text-[#717171]">{label}</p>
              <p className="font-bold text-[#222222]">{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
