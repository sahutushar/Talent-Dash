"use client";
import Link from "next/link";
import { useState } from "react";
import { IconSalary, IconTrendingUp, IconChart, IconScale, IconArrowRight } from "@/components/ui/Icons";

const TOOLS = [
  {
    slug: "salary-calculator",
    Icon: IconSalary,
    title: "Salary Calculator",
    desc: "Calculate your real take-home pay after taxes. Base + Bonus + ESOP → Net monthly in-hand.",
    cta: "Calculate Now",
  },
  {
    slug: "hike-calculator",
    Icon: IconTrendingUp,
    title: "Hike Calculator",
    desc: "Estimate your new CTC based on current salary and expected hike percentage.",
    cta: "Calculate Hike",
  },
  {
    slug: "equity-calculator",
    Icon: IconChart,
    title: "Equity / ESOP Calculator",
    desc: "Understand your ESOP vesting schedule and annual value at different share price scenarios.",
    cta: "Calculate Equity",
  },
  {
    slug: "offer-comparison",
    Icon: IconScale,
    title: "Offer Comparison",
    desc: "Compare two job offers side-by-side. See the real difference in TC, growth potential, and more.",
    cta: "Compare Offers",
  },
];

const FAQS = [
  {
    q: "Are these tools free to use?",
    a: "Yes, all tools on TalentDash are completely free with no sign-up required.",
  },
  {
    q: "How accurate is the salary calculator?",
    a: "The salary calculator uses standard Indian tax slabs and deduction rules. Results are estimates — consult a CA for precise tax advice.",
  },
  {
    q: "What is CTC vs take-home pay?",
    a: "CTC (Cost to Company) is the total amount a company spends on you. Take-home is what hits your bank after tax, PF, and other deductions.",
  },
  {
    q: "How does the ESOP calculator work?",
    a: "Enter your grant size, vesting schedule, strike price, and expected share price. The tool shows your vested value across scenarios.",
  },
  {
    q: "Can I compare more than two offers?",
    a: "Currently the offer comparison tool supports two offers side-by-side. Multi-offer support is on the roadmap.",
  },
];

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#EBEBEB] py-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-left gap-4"
      >
        <span className="text-sm font-medium text-[#222222]">{q}</span>
        <span className="text-[#FF5A5F] text-lg leading-none flex-shrink-0">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="mt-2 text-sm text-[#717171]">{a}</p>}
    </div>
  );
}

export default function ToolsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#222222]">Career Tools</h1>
        <p className="text-[#717171] mt-1">Free tools to help you make confident career decisions.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        {TOOLS.map(({ slug, Icon, title, desc, cta }) => (
          <Link
            key={slug}
            href={`/tools/${slug}`}
            className="bg-white border border-[#EBEBEB] rounded-xl p-6 hover:border-[#FF5A5F] hover:shadow-sm transition-all group block"
          >
            <div className="w-11 h-11 rounded-xl bg-[#FFF0F0] flex items-center justify-center mb-4 group-hover:bg-[#FF5A5F] transition-colors">
              <Icon className="w-5 h-5 text-[#FF5A5F] group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-lg font-semibold text-[#222222] group-hover:text-[#FF5A5F] transition-colors mb-2">{title}</h2>
            <p className="text-sm text-[#717171] mb-4">{desc}</p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-[#FF5A5F]">
              {cta} <IconArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold text-[#222222] mb-1">Frequently Asked Questions</h2>
        <p className="text-sm text-[#717171] mb-4">Quick answers about our career tools.</p>
        <div className="bg-white border border-[#EBEBEB] rounded-xl px-6">
          {FAQS.map((faq) => (
            <FAQ key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </div>
  );
}
