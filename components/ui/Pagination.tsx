"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (p: number) => void;
}

export function Pagination({ page, totalPages, total, limit, onPageChange }: PaginationProps) {
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-[#EBEBEB]">
      <p className="text-sm text-[#717171]">
        Showing <span className="font-medium text-[#222222]">{from}–{to}</span> of{" "}
        <span className="font-medium text-[#222222]">{total}</span> records
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1.5 text-sm border border-[#EBEBEB] rounded-lg text-[#484848] hover:bg-[#F7F7F7] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1.5 text-sm border rounded-lg ${p === page ? "border-[#FF5A5F] text-[#FF5A5F] bg-[#fff5f5]" : "border-[#EBEBEB] text-[#484848] hover:bg-[#F7F7F7]"}`}
            >
              {p}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1.5 text-sm border border-[#EBEBEB] rounded-lg text-[#484848] hover:bg-[#F7F7F7] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
