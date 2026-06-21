"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface Props {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

export function PaginationLink({ page, totalPages, total, limit }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const go = (p: number) => {
    const q = new URLSearchParams(params.toString());
    q.set("page", String(p));
    router.push(`${pathname}?${q.toString()}`);
  };

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-[#EBEBEB]">
      <p className="text-sm text-[#717171]">
        Showing <span className="font-medium text-[#222222]">{from}–{to}</span> of{" "}
        <span className="font-medium text-[#222222]">{total}</span> records
      </p>
      <div className="flex gap-2">
        <button onClick={() => go(page - 1)} disabled={page <= 1}
          className="px-3 py-1.5 text-sm border border-[#EBEBEB] rounded-lg text-[#484848] hover:bg-[#F7F7F7] disabled:opacity-40 disabled:cursor-not-allowed">
          Previous
        </button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
          if (p < 1 || p > totalPages) return null;
          return (
            <button key={p} onClick={() => go(p)}
              className={`px-3 py-1.5 text-sm border rounded-lg ${p === page ? "border-[#FF5A5F] text-[#FF5A5F] bg-[#fff5f5]" : "border-[#EBEBEB] text-[#484848] hover:bg-[#F7F7F7]"}`}>
              {p}
            </button>
          );
        })}
        <button onClick={() => go(page + 1)} disabled={page >= totalPages}
          className="px-3 py-1.5 text-sm border border-[#EBEBEB] rounded-lg text-[#484848] hover:bg-[#F7F7F7] disabled:opacity-40 disabled:cursor-not-allowed">
          Next
        </button>
      </div>
    </div>
  );
}
