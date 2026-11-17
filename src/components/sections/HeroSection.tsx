"use client";

import { useRef } from "react";
import { ArrowDown, MapPin, MessageCircle, Plus } from "lucide-react";
import { businessInfo } from "@/data/businessInfo";
import { getMenuItem } from "@/data/menuData";
import { useCart } from "@/context/CartContext";
import { formatGHS } from "@/utils/currency";
import { formatHoursRange } from "@/utils/hours";
import { buildWhatsAppUrl } from "@/utils/whatsapp";
import BlurText from "@/components/ui/BlurText";
import HeroVideo from "@/components/ui/HeroVideo";
import StatusBadge from "@/components/ui/StatusBadge";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";

const FEATURED_ID = "grand-mixed-platter";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { addItem, openDrawer } = useCart();
  const featured = getMenuItem(FEATURED_ID);
  useStaggerReveal(ref, "[data-reveal]");

  function orderFeatured() {
    addItem(FEATURED_ID);
    openDrawer();
  }

  return (
    <section ref={ref} id="top" className="px-2 pb-16 pt-2 sm:px-4 lg:pb-24">
      {/* bg-brand-800 matches the edge colour of the hero video, so the two blend without a seam. */}
      <div className="relative isolate mx-auto flex max-w-7xl flex-col overflow-hidden rounded-[2rem] bg-brand-800 text-white lg:min-h-[min(760px,calc(100svh-5rem))]">
        {/*
          The food gets its own space instead of sitting behind the text:
          a band above the headline on phones and tablets, the right half on desktop.
        */}
        <HeroVideo className="relative aspect-[6/5] w-full [mask-image:linear-gradient(to_bottom,black_75%,transparent)] sm:aspect-[4/3] [&>*]:scale-110 sm:[&>*]:scale-100 lg:absolute lg:right-0 lg:top-1/2 lg:aspect-square lg:w-[54%] lg:-translate-y-1/2 lg:[mask-image:radial-gradient(closest-side,black_86%,transparent)]" />

        <div className="relative -mt-6 flex flex-1 flex-col justify-between gap-10 px-5 pb-8 sm:-mt-10 sm:px-10 sm:pb-12 lg:static lg:mt-0 lg:max-w-[50%] lg:py-16 lg:pl-14 lg:pr-0">
          <div>
            <div data-reveal className="mb-6 flex flex-wrap items-center gap-2">
              <StatusBadge showDetail announce tone="light" />
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/80 backdrop-blur">
                <MapPin className="size-3.5" aria-hidden="true" />
                Skyways Hotel, Bortianor
              </span>
            </div>

            <BlurText
              text="Ghanaian, Nigerian & continental plates, cooked fresh daily."
              className="text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.02em] text-white sm:text-5xl xl:text-6xl"
            />

            <p data-reveal className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-white/80 sm:text-lg">
              From fufu and light soup to seafood okra and smoky party jollof, every plate is prepared to order
              inside Skyways Hotel at Jack Mullar Beach Junction. Dine in, take away or order straight on
              WhatsApp.
            </p>

            <div data-reveal className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#menu"
                className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white px-6 text-sm font-semibold text-brand-800 shadow-lg shadow-black/10 transition hover:bg-brand-50 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                View menu &amp; order
                <ArrowDown className="size-4" aria-hidden="true" />
              </a>
              <a
                href={buildWhatsAppUrl(`Hello ${businessInfo.name}! I have a quick question.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/30 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                Chat on WhatsApp
              </a>
              <a
                href={businessInfo.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-medium text-white/80 underline-offset-4 transition hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-white"
              >
                <MapPin className="size-4" aria-hidden="true" />
                Directions
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <dl data-reveal className="grid max-w-md grid-cols-3 gap-4 border-t border-white/20 pt-6">
              <div>
                <dt className="text-xs text-white/65">Hours</dt>
                <dd className="mt-1 text-sm font-medium text-white">{formatHoursRange()}</dd>
              </div>
              <div>
                <dt className="text-xs text-white/65">Average plate</dt>
                <dd className="mt-1 text-sm font-medium text-white">{businessInfo.priceRange}</dd>
              </div>
              <div>
                <dt className="text-xs text-white/65">Open</dt>
                <dd className="mt-1 text-sm font-medium text-white">Every day</dd>
              </div>
            </dl>

            {featured && (
              <div
                data-reveal
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/20 bg-white/10 p-3 pl-4 backdrop-blur-md sm:max-w-sm lg:absolute lg:bottom-10 lg:right-10 lg:w-80"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand-200">House favourite</p>
                  <p className="mt-0.5 truncate text-sm font-semibold text-white">{featured.name}</p>
                  <p className="text-xs tabular-nums text-white/75">{formatGHS(featured.price)}</p>
                </div>
                <button
                  type="button"
                  onClick={orderFeatured}
                  aria-label={`Add ${featured.name} to your order`}
                  className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-semibold text-stone-900 transition hover:bg-brand-50 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <Plus className="size-4" aria-hidden="true" />
                  Add
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
