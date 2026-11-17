"use client";

import { useRef } from "react";
import { ExternalLink, PenLine, Star } from "lucide-react";
import { reviewLinks, reviews, type Review } from "@/data/reviewsData";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function Stars({ rating }: { rating: Review["rating"] }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={`size-4 ${i < rating ? "fill-neutral-900 text-neutral-900" : "text-neutral-300"}`}
        />
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const ref = useRef<HTMLElement>(null);
  useStaggerReveal(ref, "[data-reveal]");

  const average =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null;

  return (
    <section
      ref={ref}
      id="reviews"
      aria-labelledby="reviews-title"
      className="scroll-mt-20 border-t border-neutral-200/60 bg-neutral-100/50 py-16 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p data-reveal className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
              Google reviews
            </p>
            <h2
              data-reveal
              id="reviews-title"
              className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-neutral-900 sm:text-4xl"
            >
              What guests are saying
            </h2>
            {average !== null && (
              <p data-reveal className="mt-3 text-base text-neutral-500">
                {average.toFixed(1)} average from {reviews.length} curated Google reviews
              </p>
            )}
          </div>
          <div data-reveal className="flex flex-col gap-2 sm:flex-row">
            <a
              href={reviewLinks.readMore}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-neutral-200/80 bg-white px-5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-neutral-900"
            >
              Read on Google
              <ExternalLink className="size-4" aria-hidden="true" />
            </a>
            <a
              href={reviewLinks.write}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 text-sm font-semibold text-neutral-50 transition hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
            >
              <PenLine className="size-4" aria-hidden="true" />
              Leave a review
            </a>
          </div>
        </div>

        {reviews.length > 0 ? (
          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, index) => (
              <li
                key={review.id}
                data-reveal
                className={`flex flex-col gap-4 rounded-3xl border border-neutral-200/60 bg-white p-6 ${
                  index === 0 ? "lg:col-span-2" : ""
                }`}
              >
                <Stars rating={review.rating} />
                <blockquote className="text-pretty text-base leading-relaxed text-neutral-700">
                  &ldquo;{review.comment}&rdquo;
                </blockquote>
                <footer className="mt-auto flex items-center justify-between text-sm">
                  <span className="font-medium text-neutral-900">{review.reviewerName}</span>
                  <time dateTime={review.date} className="text-neutral-400">
                    {dateFormatter.format(new Date(`${review.date}T00:00:00Z`))}
                  </time>
                </footer>
              </li>
            ))}
          </ul>
        ) : (
          <div
            data-reveal
            className="mt-10 rounded-3xl border border-dashed border-neutral-300 bg-white/60 p-8 text-center sm:p-12"
          >
            <p className="text-lg font-semibold tracking-tight text-neutral-900">Eaten with us recently?</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-neutral-500">
              Your review on Google helps other food lovers in Bortianor find us. It only takes a minute.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
