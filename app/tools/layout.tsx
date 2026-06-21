import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Tools — Salary Calculator, Hike Calculator & More | TalentDash",
  description: "Free tools for Indian professionals: salary calculator, hike estimator, equity calculator, and offer comparison tool.",
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
