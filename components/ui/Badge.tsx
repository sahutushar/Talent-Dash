import { LEVEL_COLORS, LEVEL_LABELS } from "@/lib/config";
import type { Level } from "@/types";

export function LevelBadge({ level }: { level: Level }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${LEVEL_COLORS[level]}`}>
      {LEVEL_LABELS[level]}
    </span>
  );
}
