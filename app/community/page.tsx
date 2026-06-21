import type { Metadata } from "next";
import { CommunityFeed } from "@/components/features/CommunityFeed";

export const metadata: Metadata = {
  title: "Community — Anonymous Career Discussions | TalentDash",
  description: "Anonymous discussions on salaries, layoffs, offers, and company culture at India's top tech companies.",
};

export default function CommunityPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#222222]">Community</h1>
        <p className="text-[#717171] mt-1">Anonymous career discussions — salaries, offers, culture.</p>
      </div>
      <CommunityFeed />
    </div>
  );
}
