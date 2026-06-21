"use client";

import { useState } from "react";
import { AddSalaryModal } from "@/components/features/AddSalaryModal";

export function AddSalaryButton({ company }: { company: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-[#FF5A5F] text-white text-sm font-medium rounded-lg hover:bg-[#e84f54]"
      >
        Add Salary
      </button>
      <AddSalaryModal open={open} onClose={() => setOpen(false)} defaultCompany={company} />
    </>
  );
}
