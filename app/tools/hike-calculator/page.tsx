import type { Metadata } from "next";
import { HikeCalculatorTool } from "@/components/features/HikeCalculatorTool";

export const metadata: Metadata = {
  title: "Salary Hike Calculator India — Expected CTC After Appraisal | TalentDash",
  description: "Calculate your new CTC after hike. See how much salary increase you can expect and what to negotiate.",
};

export default function HikeCalculatorPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-[#222222] mb-2">Hike Calculator</h1>
      <p className="text-[#717171] mb-8">Estimate your new CTC after appraisal or job switch.</p>
      <HikeCalculatorTool />
    </div>
  );
}
