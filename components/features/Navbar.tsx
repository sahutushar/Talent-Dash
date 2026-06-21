"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { IconSearch } from "@/components/ui/Icons";
import { AddSalaryModal } from "@/components/features/AddSalaryModal";
import { WriteReviewModal } from "@/components/features/WriteReviewModal";

const NAV_LINKS = [
  { href: "/companies", label: "Companies" },
  { href: "/salaries", label: "Salaries" },
  { href: "/reviews", label: "Reviews" },
  { href: "/interviews", label: "Interviews" },
  { href: "/jobs", label: "Jobs" },
  { href: "/community", label: "Community" },
  { href: "/tools", label: "Tools" },
  { href: "/workplace-index", label: "Workplace Index" },
];

type ContributeModal = "salary" | "review" | "interview" | null;

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [contributeOpen, setContributeOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ContributeModal>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    setSearchOpen(false);
    setSearchVal("");
    router.push(`/salaries?role=${encodeURIComponent(searchVal.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#EBEBEB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-0.5 shrink-0">
            <span className="text-xl font-bold text-[#FF5A5F]">Talent</span>
            <span className="text-xl font-bold text-[#222222]">Dash</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${active ? "text-[#FF5A5F] font-medium bg-[#fff5f5]" : "text-[#484848] hover:text-[#222222] hover:bg-[#F7F7F7]"}`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {/* Search icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#484848] hover:bg-[#F7F7F7] rounded-lg transition-colors flex"
              aria-label="Search"
            >
              <IconSearch className="w-4 h-4" />
            </button>

            {/* Contribute button — icon only on xs, full button from sm */}
            <button
              onClick={() => { setContributeOpen(!contributeOpen); }}
              className="sm:hidden p-2 text-[#FF5A5F] hover:bg-[#fff5f5] rounded-lg transition-colors"
              aria-label="Contribute"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
            {/* Contribute dropdown - desktop only */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setContributeOpen(!contributeOpen)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#FF5A5F] text-white text-sm font-medium rounded-lg hover:bg-[#e84f54] transition-colors"
              >
                Contribute
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {contributeOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setContributeOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-[#EBEBEB] rounded-xl shadow-lg py-1 z-50">
                  <button
                    onClick={() => { setContributeOpen(false); setActiveModal("salary"); }}
                    className="w-full text-left block px-4 py-3 hover:bg-[#F7F7F7] transition-colors"
                  >
                    <p className="text-sm font-medium text-[#222222]">Add Salary</p>
                    <p className="text-xs text-[#717171] mt-0.5">Share your TC anonymously</p>
                  </button>
                  <button
                    onClick={() => { setContributeOpen(false); setActiveModal("review"); }}
                    className="w-full text-left block px-4 py-3 hover:bg-[#F7F7F7] transition-colors"
                  >
                    <p className="text-sm font-medium text-[#222222]">Write a Review</p>
                    <p className="text-xs text-[#717171] mt-0.5">Rate your employer</p>
                  </button>
                  <Link
                    href="/interviews"
                    onClick={() => setContributeOpen(false)}
                    className="block px-4 py-3 hover:bg-[#F7F7F7] transition-colors"
                  >
                    <p className="text-sm font-medium text-[#222222]">Share Interview</p>
                    <p className="text-xs text-[#717171] mt-0.5">Help others prepare</p>
                  </Link>
                  </div>
                </>
              )}
            </div>

            {/* Modals */}
            <AddSalaryModal open={activeModal === "salary"} onClose={() => setActiveModal(null)} />
            <WriteReviewModal open={activeModal === "review"} onClose={() => setActiveModal(null)} />

            {/* Mobile menu button */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-[#484848] hover:bg-[#F7F7F7] rounded-lg" aria-label="Menu">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Inline search bar */}
        {searchOpen && (
          <div className="border-t border-[#EBEBEB] py-3">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <IconSearch className="w-4 h-4 text-[#717171] shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search role, company, or location..."
                className="flex-1 text-sm text-[#222222] placeholder:text-[#717171] outline-none bg-transparent"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="text-xs text-[#717171] hover:text-[#222222]">
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="lg:hidden border-t border-[#EBEBEB] py-2 max-h-[calc(100vh-56px)] overflow-y-auto">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 text-sm border-b border-[#F7F7F7] last:border-0 ${pathname.startsWith(href) ? "text-[#FF5A5F] font-medium bg-[#fff5f5]" : "text-[#484848]"}`}
              >
                {label}
              </Link>
            ))}
            <div className="px-4 py-3 border-t border-[#EBEBEB] mt-1 space-y-1">
              <p className="text-xs font-semibold text-[#717171] uppercase tracking-wide mb-2">Contribute</p>
              <button onClick={() => { setMobileOpen(false); setActiveModal("salary"); }} className="flex w-full items-center gap-2 py-2.5 text-sm font-medium text-[#FF5A5F]">
                <span className="w-6 h-6 rounded-full bg-[#fff5f5] flex items-center justify-center text-xs">+</span>
                Add Salary
              </button>
              <button onClick={() => { setMobileOpen(false); setActiveModal("review"); }} className="flex w-full items-center gap-2 py-2.5 text-sm font-medium text-[#FF5A5F]">
                <span className="w-6 h-6 rounded-full bg-[#fff5f5] flex items-center justify-center text-xs">+</span>
                Write a Review
              </button>
              <Link href="/interviews" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2.5 text-sm font-medium text-[#FF5A5F]">
                <span className="w-6 h-6 rounded-full bg-[#fff5f5] flex items-center justify-center text-xs">+</span>
                Share Interview
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
