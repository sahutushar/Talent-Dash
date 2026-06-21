"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconSearch } from "@/components/ui/Icons";

const SUGGESTIONS = [
  "Software Engineer at Google",
  "Product Manager at Flipkart",
  "SDE-II at Amazon",
  "Data Scientist at Meesho",
  "Staff Engineer at Microsoft",
];

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const params = new URLSearchParams();
    params.set("role", query.trim());
    router.push(`/salaries?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mt-6">
      <div className="flex items-center bg-white border-2 border-[#EBEBEB] rounded-2xl px-4 py-3 gap-3 shadow-sm hover:border-[#FF5A5F] focus-within:border-[#FF5A5F] transition-colors">
        <IconSearch className="w-5 h-5 text-[#717171] shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search role, company, or location..."
          className="flex-1 text-[#222222] placeholder:text-[#717171] text-sm bg-transparent outline-none"
        />
        <button
          type="submit"
          className="shrink-0 px-4 py-1.5 bg-[#FF5A5F] text-white text-sm font-medium rounded-xl hover:bg-[#e84f54] transition-colors"
        >
          Search
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar mt-3">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => router.push(`/salaries?role=${encodeURIComponent(s.split(" at ")[0])}`)}
            className="text-xs text-[#717171] hover:text-[#FF5A5F] transition-colors whitespace-nowrap"
          >
            {s}
          </button>
        ))}
      </div>
    </form>
  );
}
