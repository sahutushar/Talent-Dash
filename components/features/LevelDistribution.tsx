import { ALL_LEVELS, LEVEL_LABELS, LEVEL_COLORS } from "@/lib/config";
import type { Level } from "@/types";

interface LevelDistributionProps {
  distribution: Partial<Record<Level, number>>;
}

export function LevelDistribution({ distribution }: LevelDistributionProps) {
  const total = Object.values(distribution).reduce((a, b) => a + (b ?? 0), 0);
  if (total === 0) return null;

  const levels = ALL_LEVELS.filter((l) => (distribution[l] ?? 0) > 0);

  const barColors: Record<Level, string> = {
    L3: "#94a3b8", SDE_I: "#94a3b8",
    L4: "#3b82f6", SDE_II: "#3b82f6",
    L5: "#6366f1", SDE_III: "#6366f1",
    L6: "#a855f7", STAFF: "#a855f7",
    PRINCIPAL: "#1e40af", IC4: "#7c3aed", IC5: "#c026d3",
  };

  return (
    <div>
      <div className="flex h-4 rounded-full overflow-hidden gap-0.5">
        {levels.map((l) => {
          const pct = ((distribution[l] ?? 0) / total) * 100;
          return (
            <div
              key={l}
              title={`${LEVEL_LABELS[l]}: ${distribution[l]} records (${pct.toFixed(0)}%)`}
              style={{ width: `${pct}%`, backgroundColor: barColors[l] }}
              className="transition-all"
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-3 mt-2">
        {levels.map((l) => (
          <div key={l} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: barColors[l] }} />
            <span className="text-xs text-[#484848]">
              {LEVEL_LABELS[l]} <span className="text-[#717171]">({distribution[l]})</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
