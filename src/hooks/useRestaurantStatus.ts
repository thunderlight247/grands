"use client";

import { useSyncExternalStore } from "react";
import { isRestaurantOpen } from "@/utils/hours";

export type RestaurantStatus = "open" | "closed" | "unknown";

const CHECK_INTERVAL_MS = 30_000;

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, CHECK_INTERVAL_MS);
  document.addEventListener("visibilitychange", onChange);
  return () => {
    window.clearInterval(id);
    document.removeEventListener("visibilitychange", onChange);
  };
}

function getSnapshot(): RestaurantStatus {
  return isRestaurantOpen() ? "open" : "closed";
}

// The server can't know the visitor's clock, so the server render and the
// hydration pass both show "unknown"; the Africa/Accra check only runs in the
// browser after hydration. This avoids a hydration mismatch.
function getServerSnapshot(): RestaurantStatus {
  return "unknown";
}

/** Live open/closed status in Africa/Accra time, re-checked every 30 seconds. */
export function useRestaurantStatus(): RestaurantStatus {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
