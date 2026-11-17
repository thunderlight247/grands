"use client";

import { useRestaurantStatus } from "@/hooks/useRestaurantStatus";
import { getStatusDetail } from "@/utils/hours";

export default function StatusBadge({ showDetail = false }: { showDetail?: boolean }) {
  const status = useRestaurantStatus();

  const label = status === "unknown" ? "Checking hours" : status === "open" ? "Open now" : "Closed";
  const detail = status === "unknown" ? null : getStatusDetail(status === "open");

  return (
    <span
      role="status"
      aria-live="polite"
      className="inline-flex items-center gap-2 rounded-full border border-neutral-200/60 bg-white/70 px-3 py-1 text-xs font-medium text-neutral-700 backdrop-blur"
    >
      <span className="relative flex size-2">
        {status === "open" && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500/60 motion-reduce:hidden" />
        )}
        <span
          className={`relative inline-flex size-2 rounded-full ${
            status === "open" ? "bg-emerald-500" : status === "closed" ? "bg-neutral-400" : "bg-neutral-300"
          }`}
        />
      </span>
      <span>{label}</span>
      {showDetail && detail && <span className="text-neutral-500">· {detail}</span>}
    </span>
  );
}
