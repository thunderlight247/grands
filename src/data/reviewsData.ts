import { businessInfo } from "./businessInfo";

export interface Review {
  id: string;
  reviewerName: string;
  /** Whole-star rating from 1 to 5. */
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  /** ISO date (YYYY-MM-DD) the review was posted on Google. */
  date: string;
  /** Optional direct link to the review on Google. */
  sourceUrl?: string;
}

/**
 * Curated reviews copied word-for-word from the Google Business Profile.
 * Only add real reviews here. The Reviews section shows a "be the first to
 * review" call to action while this list is empty.
 *
 * Example entry:
 * {
 *   id: "g-2026-11-02-ama",
 *   reviewerName: "Ama K.",
 *   rating: 5,
 *   comment: "Exact text from Google…",
 *   date: "2026-11-02",
 * }
 */
export const reviews: readonly Review[] = [];

export const reviewLinks = {
  readMore: businessInfo.googleReviewsUrl,
  write: businessInfo.googleWriteReviewUrl,
} as const;
