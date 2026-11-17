import { businessInfo, type OpeningHours } from "@/data/businessInfo";

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Minutes since local midnight in the given IANA timezone. */
export function minutesInTimeZone(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return hour * 60 + minute;
}

/**
 * Whether the restaurant is open at `now`, evaluated in the business timezone
 * (Africa/Accra). Handles closing times that fall after midnight: with
 * 08:00 → 00:30 it is open from 08:00 until 23:59 and from 00:00 until 00:29.
 * Hours are the same every day, so the day after midnight needs no check.
 */
export function isRestaurantOpen(
  now: Date = new Date(),
  hours: OpeningHours = businessInfo.hours,
): boolean {
  const current = minutesInTimeZone(now, hours.timeZone);
  const opens = toMinutes(hours.opens);
  const closes = toMinutes(hours.closes);

  if (closes > opens) {
    return current >= opens && current < closes;
  }
  // Overnight window (or 24h when opens === closes).
  return current >= opens || current < closes;
}

/**
 * Minutes left until closing, or null while closed. Accounts for closing
 * times after midnight.
 */
export function minutesUntilClose(
  now: Date = new Date(),
  hours: OpeningHours = businessInfo.hours,
): number | null {
  if (!isRestaurantOpen(now, hours)) return null;
  const current = minutesInTimeZone(now, hours.timeZone);
  const closes = toMinutes(hours.closes);
  return (closes - current + 24 * 60) % (24 * 60);
}

/** "8:00 AM – 12:30 AM" style range built from the opening hours. */
export function formatHoursRange(hours: OpeningHours = businessInfo.hours): string {
  return `${formatClock(hours.opens)} – ${formatClock(hours.closes)}`;
}

export function formatClock(hhmm: string): string {
  const total = toMinutes(hhmm);
  const h24 = Math.floor(total / 60);
  const m = total % 60;
  const suffix = h24 < 12 ? "AM" : "PM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** Short helper text such as "Closes 12:30 AM" or "Opens 8:00 AM". */
export function getStatusDetail(
  open: boolean,
  hours: OpeningHours = businessInfo.hours,
): string {
  return open ? `Closes ${formatClock(hours.closes)}` : `Opens ${formatClock(hours.opens)}`;
}
