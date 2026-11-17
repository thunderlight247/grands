"use client";

import { useRestaurantStatus } from "@/hooks/useRestaurantStatus";
import { getStatusDetail } from "@/utils/hours";

const LABELS = {
  unknown: "Checking hours",
  open: "Open now",
  "closing-soon": "Closing soon",
  closed: "Closed",
} as const;

const DOT = {
  unknown: "bg-stone-300",
  open: "bg-emerald-500",
  "closing-soon": "bg-amber-500",
  closed: "bg-stone-400",
} as const;

interface StatusBadgeProps {
  showDetail?: boolean;
  /**
   * Announce status changes to screen readers. Enable on exactly one badge per
   * page, otherwise every badge announces the same change.
   */
  announce?: boolean;
  /** Light text for use on dark backgrounds such as the hero video. */
  tone?: "light" | "dark";
}

export default function StatusBadge({ showDetail = false, announce = false, tone = "dark" }: StatusBadgeProps) {
  const status = useRestaurantStatus();
  const isOpen = status === "open" || status === "closing-soon";
  const detail = status === "unknown" ? null : getStatusDetail(isOpen);

  return (
    <span
      role={announce ? "status" : undefined}
      aria-live={announce ? "polite" : undefined}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur ${
        tone === "light"
          ? "border-white/20 bg-white/10 text-white"
          : "border-stone-200/60 bg-white/70 text-stone-700"
      }`}
    >
      <span className="relative flex size-2">
        {isOpen && (
          <span
            className={`absolute inline-flex size-full animate-ping rounded-full motion-reduce:hidden ${
              status === "open" ? "bg-emerald-500/60" : "bg-amber-500/60"
            }`}
          />
        )}
        <span className={`relative inline-flex size-2 rounded-full ${DOT[status]}`} />
      </span>
      <span>{LABELS[status]}</span>
      {showDetail && detail && (
        <span className={tone === "light" ? "text-white/70" : "text-stone-500"}>· {detail}</span>
      )}
    </span>
  );
}
