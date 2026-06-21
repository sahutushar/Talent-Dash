import type { Metadata } from "next";
import { EquityCalculatorTool } from "@/components/features/EquityCalculatorTool";

export const metadata: Metadata = {
  title: "ESOP & Equity Calculator India — Vesting Schedule Value | TalentDash",
  description: "Calculate the real value of your ESOPs and RSUs. 4-year vesting schedule with cliff, at any share price scenario.",
};

export default function EquityCalculatorPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-[#222222] mb-2">Equity / ESOP Calculator</h1>
      <p className="text-[#717171] mb-8">Understand the real value of your stock grants at different price scenarios.</p>
      <EquityCalculatorTool />
    </div>
  );
}
