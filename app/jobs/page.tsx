import type { Metadata } from "next";
import { JobsFilter } from "@/components/features/JobsFilter";

export const metadata: Metadata = {
  title: "Tech Jobs in India — Software Engineer, PM & Data Science | TalentDash",
  description: "Browse open roles at top tech companies in India with real salary ranges based on TalentDash data.",
};

export default function JobsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#222222]">Jobs</h1>
        <p className="text-[#717171] mt-1">Open roles with real salary context, powered by TalentDash data.</p>
      </div>
      <JobsFilter />
    </div>
  );
}
