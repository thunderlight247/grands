export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface OpeningHours {
  /** Days the hours below apply to. */
  days: readonly DayOfWeek[];
  /** 24h "HH:MM" local opening time. */
  opens: string;
  /** 24h "HH:MM" local closing time. Earlier than `opens` means it closes after midnight. */
  closes: string;
  /** IANA timezone the hours are expressed in. */
  timeZone: string;
}

export interface BusinessInfo {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  siteUrl: string;
  phoneDisplay: string;
  phoneE164: string;
  whatsappNumber: string;
  address: {
    landmark: string;
    streetAddress: string;
    locality: string;
    region: string;
    countryCode: string;
    countryName: string;
  };
  geo: { latitude: number; longitude: number };
  hours: OpeningHours;
  hoursLabel: string;
  priceRange: string;
  priceRangeSchema: string;
  currency: string;
  cuisines: readonly string[];
  services: readonly string[];
  googleMapsUrl: string;
  googleMapsDirectionsUrl: string;
  googleMapsEmbedUrl: string;
  googleReviewsUrl: string;
  googleWriteReviewUrl: string;
}

const ALL_DAYS: readonly DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/**
 * Search query used for the Google Maps links until the exact Google Business
 * Profile share link is pasted into `googleMapsUrl` / `googleReviewsUrl`.
 */
const MAPS_QUERY = encodeURIComponent(
  "Grand Gees Food Court, Skyways Hotel, Bortianor, Accra, Ghana",
);

export const businessInfo: BusinessInfo = {
  name: "Grand Gees Food Court",
  shortName: "Grand Gees",
  tagline: "Fresh Ghanaian, Nigerian & Continental Dishes in Bortianor",
  description:
    "Freshly prepared Ghanaian, Nigerian and continental dishes inside Skyways Hotel at Jack Mullar Beach Junction, Bortianor. Dine in, take away, order on WhatsApp or book us to cater your event.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  phoneDisplay: "+233 54 345 0564",
  phoneE164: "+233543450564",
  whatsappNumber: "233543450564",
  address: {
    landmark: "Inside Skyways Hotel, Jack Mullar Beach Junction",
    streetAddress: "Skyways Hotel, Jack Mullar Beach Junction",
    locality: "Bortianor",
    region: "Greater Accra",
    countryCode: "GH",
    countryName: "Ghana",
  },
  // Approximate coordinates for Bortianor; replace with the exact GBP pin.
  geo: { latitude: 5.5232, longitude: -0.3416 },
  hours: {
    days: ALL_DAYS,
    opens: "08:00",
    closes: "00:30",
    timeZone: "Africa/Accra",
  },
  hoursLabel: "Daily, 8:00 AM – 12:30 AM",
  priceRange: "GHS 100 – 150",
  priceRangeSchema: "GHS 100-150",
  currency: "GHS",
  cuisines: ["Ghanaian", "Nigerian", "West African", "Continental"],
  services: ["Dine-in", "Takeaway", "Event Catering", "WhatsApp Ordering"],
  // Replace with the exact Google Business Profile share link (maps.app.goo.gl/...).
  googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`,
  googleMapsDirectionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${MAPS_QUERY}`,
  // Replace with the GBP "Embed a map" src for Skyways Hotel, Bortianor.
  googleMapsEmbedUrl: `https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`,
  // Replace with the GBP reviews link and the "Ask for reviews" short link.
  googleReviewsUrl: `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`,
  googleWriteReviewUrl: `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`,
};
