"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { ALL_LEVELS, LEVEL_LABELS, LOCATIONS } from "@/lib/config";
import { AddSalaryModal } from "@/components/features/AddSalaryModal";
import type { Currency, Level } from "@/types";

const ROLES = [
  "Software Engineer", "Product Manager", "Data Scientist", "Data Analyst",
  "Software Development Engineer", "Senior Software Engineer", "DevOps Engineer",
  "ML Engineer", "Frontend Engineer", "Backend Engineer", "Full Stack Engineer",
];

const COMPANIES = [
  "Google", "Amazon", "Microsoft", "Flipkart", "Swiggy", "Zomato",
  "Paytm", "PhonePe", "Razorpay", "Meesho", "Ola", "Uber", "Atlassian",
  "Adobe", "Oracle", "Salesforce", "IBM", "Infosys", "TCS", "Wipro",
];

const CURRENCIES: Currency[] = ["INR", "USD", "GBP", "EUR"];
const PAGE_SIZES = [10, 25, 50, 100];

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showAddSalary, setShowAddSalary] = useState(false);

  const [draft, setDraft] = useState({
    search: params.get("search") ?? "",
    company: params.get("company") ?? "",
    role: params.get("role") ?? "",
    level: params.get("level") ?? "",
    location: params.get("location") ?? "",
    currency: params.get("currency") ?? "",
    displayCurrency: params.get("displayCurrency") ?? "INR",
    minTotal: params.get("minTotal") ?? "",
    maxTotal: params.get("maxTotal") ?? "",
    pageSize: params.get("pageSize") ?? "25",
  });

  const set = (key: string, value: string) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const apply = () => {
    const p = new URLSearchParams();
    Object.entries(draft).forEach(([k, v]) => { if (v) p.set(k, v); });
    p.set("page", "1");
    startTransition(() => router.push(`${pathname}?${p.toString()}`));
  };

  const reset = () => {
    setDraft({ search: "", company: "", role: "", level: "", location: "", currency: "", displayCurrency: "INR", minTotal: "", maxTotal: "", pageSize: "25" });
    startTransition(() => router.push(pathname));
  };

  const inputCls = "border border-[#EBEBEB] rounded-lg px-3 py-2 text-sm text-[#222222] placeholder:text-[#717171] focus:outline-none focus:border-[#FF5A5F] bg-white w-full";
  const labelCls = "text-xs font-medium text-[#717171] uppercase tracking-wide mb-1 block";

  return (
    <div className="bg-white border border-[#EBEBEB] rounded-xl p-4 mb-6 space-y-4">
      {/* Top search bar */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717171]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by company, role, or location..."
          value={draft.search}
          onChange={(e) => set("search", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          className="border border-[#EBEBEB] rounded-lg pl-9 pr-4 py-2.5 text-sm text-[#222222] placeholder:text-[#717171] focus:outline-none focus:border-[#FF5A5F] w-full"
        />
      </div>

      {/* Filter grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {/* Company */}
        <div className="col-span-2 sm:col-span-1">
          <label className={labelCls}>Company</label>
          <select value={draft.company} onChange={(e) => set("company", e.target.value)} className={inputCls}>
            <option value="">All companies</option>
            {COMPANIES.map((c) => <option key={c} value={c.toLowerCase()}>{c}</option>)}
          </select>
        </div>

        {/* Role */}
        <div className="col-span-2 sm:col-span-1">
          <label className={labelCls}>Role</label>
          <select value={draft.role} onChange={(e) => set("role", e.target.value)} className={inputCls}>
            <option value="">All roles</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Level */}
        <div className="col-span-1">
          <label className={labelCls}>Level</label>
          <select value={draft.level} onChange={(e) => set("level", e.target.value)} className={inputCls}>
            <option value="">All levels</option>
            {ALL_LEVELS.map((l) => <option key={l} value={l}>{LEVEL_LABELS[l as Level]}</option>)}
          </select>
        </div>

        {/* Location */}
        <div className="col-span-1">
          <label className={labelCls}>Location</label>
          <select value={draft.location} onChange={(e) => set("location", e.target.value)} className={inputCls}>
            <option value="">All locations</option>
            {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* Currency */}
        <div className="col-span-1">
          <label className={labelCls}>Currency</label>
          <select value={draft.currency} onChange={(e) => set("currency", e.target.value)} className={inputCls}>
            <option value="">All currencies</option>
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Advanced filters — hidden on mobile, shown from sm */}
        <div className="hidden sm:block">
          <label className={labelCls}>Display currency</label>
          <select value={draft.displayCurrency} onChange={(e) => set("displayCurrency", e.target.value)} className={inputCls}>
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="hidden sm:block">
          <label className={labelCls}>Min total</label>
          <input
            type="number"
            placeholder="e.g. 500000"
            value={draft.minTotal}
            onChange={(e) => set("minTotal", e.target.value)}
            className={inputCls}
          />
        </div>

        <div className="hidden sm:block">
          <label className={labelCls}>Max total</label>
          <input
            type="number"
            placeholder="e.g. 5000000"
            value={draft.maxTotal}
            onChange={(e) => set("maxTotal", e.target.value)}
            className={inputCls}
          />
        </div>

        <div className="hidden sm:block">
          <label className={labelCls}>Page size</label>
          <select value={draft.pageSize} onChange={(e) => set("pageSize", e.target.value)} className={inputCls}>
            {PAGE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          onClick={apply}
          disabled={isPending}
          className="flex-1 sm:flex-none px-5 py-2 bg-[#FF5A5F] text-white text-sm font-medium rounded-lg hover:bg-[#e04e53] disabled:opacity-60 transition-colors"
        >
          {isPending ? "Applying…" : "Apply filters"}
        </button>
        <button
          onClick={reset}
          className="flex-1 sm:flex-none px-5 py-2 border border-[#EBEBEB] text-sm font-medium text-[#484848] rounded-lg hover:bg-[#F7F7F7] transition-colors"
        >
          Reset
        </button>
        <button
          onClick={() => setShowAddSalary(true)}
          className="w-full sm:w-auto sm:ml-auto px-5 py-2 border border-[#FF5A5F] text-[#FF5A5F] text-sm font-medium rounded-lg hover:bg-[#fff5f5] transition-colors"
        >
          + Add Salary
        </button>
      </div>
      <AddSalaryModal open={showAddSalary} onClose={() => setShowAddSalary(false)} />
    </div>
  );
}
