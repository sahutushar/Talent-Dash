interface RatingBarProps {
  label: string;
  value: number;
  max?: number;
}

export function RatingBar({ label, value, max = 5 }: RatingBarProps) {
  const pct = (value / max) * 100;
  const color = pct >= 80 ? "#008A05" : pct >= 60 ? "#0369A1" : pct >= 40 ? "#FFB400" : "#D93025";

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-[#484848] w-36 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-[#EBEBEB] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-sm font-medium text-[#222222] w-8 text-right">{value.toFixed(1)}</span>
    </div>
  );
}
