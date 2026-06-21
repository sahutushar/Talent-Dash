import type { Metadata } from "next";
import { SalaryCalculatorTool } from "@/components/features/SalaryCalculatorTool";

export const metadata: Metadata = {
  title: "Salary Calculator India — CTC to In-Hand Calculator 2025 | TalentDash",
  description: "Calculate your monthly in-hand salary from CTC in India. Includes PF, professional tax, income tax deductions.",
};

export default function SalaryCalculatorPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#222222]">Salary Calculator</h1>
        <p className="text-[#717171] mt-1">Calculate your real take-home salary from CTC in India.</p>
      </div>
      <SalaryCalculatorTool />
    </div>
  );
}
