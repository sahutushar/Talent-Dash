import type { Review } from "@/types";
import { StarRating } from "@/components/ui/StarRating";
import { LEVEL_LABELS } from "@/lib/config";

export function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.submitted_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  return (
    <div className="bg-white border border-[#EBEBEB] rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-[#222222]">{review.title}</h4>
          <p className="text-xs text-[#717171] mt-0.5">
            {[review.role, review.level ? LEVEL_LABELS[review.level] : null, review.location].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div className="text-right">
          <StarRating value={Number(review.rating_overall)} />
          <p className="text-xs text-[#717171] mt-0.5">{date}</p>
        </div>
      </div>
      {review.pros && (
        <div className="mb-2">
          <span className="text-xs font-semibold text-[#008A05] uppercase tracking-wide">Pros</span>
          <p className="text-sm text-[#484848] mt-0.5">{review.pros}</p>
        </div>
      )}
      {review.cons && (
        <div className="mb-3">
          <span className="text-xs font-semibold text-[#D93025] uppercase tracking-wide">Cons</span>
          <p className="text-sm text-[#484848] mt-0.5">{review.cons}</p>
        </div>
      )}
      <div className="flex items-center gap-2 pt-3 border-t border-[#EBEBEB]">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${review.would_recommend ? "bg-green-50 text-[#008A05]" : "bg-red-50 text-[#D93025]"}`}>
          {review.would_recommend ? "✓ Recommends" : "✗ Doesn't recommend"}
        </span>
        {review.is_verified && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">Verified</span>}
      </div>
    </div>
  );
}
