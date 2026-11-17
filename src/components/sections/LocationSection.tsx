"use client";

import { useRef } from "react";
import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { businessInfo } from "@/data/businessInfo";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";
import StatusBadge from "@/components/ui/StatusBadge";

export default function LocationSection() {
  const ref = useRef<HTMLElement>(null);
  useStaggerReveal(ref, "[data-reveal]");
  const { address } = businessInfo;

  return (
    <section ref={ref} id="location" aria-labelledby="location-title" className="scroll-mt-20 py-16 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12">
        <div data-reveal className="order-2 lg:order-1 lg:col-span-7">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-stone-200/60 bg-stone-100 lg:aspect-auto lg:h-full lg:min-h-[420px]">
            <iframe
              src={businessInfo.googleMapsEmbedUrl}
              title={`Map showing ${businessInfo.name} inside Skyways Hotel, Bortianor`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 size-full border-0 grayscale-[35%]"
            />
          </div>
        </div>

        <div className="order-1 flex flex-col lg:order-2 lg:col-span-5">
          <p data-reveal className="text-xs font-medium uppercase tracking-[0.2em] text-brand-600">
            Find us
          </p>
          <h2
            data-reveal
            id="location-title"
            className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-stone-900 sm:text-4xl"
          >
            Inside Skyways Hotel, Bortianor
          </h2>

          <dl className="mt-8 space-y-6">
            <div data-reveal className="flex gap-4">
              <MapPin className="mt-0.5 size-5 shrink-0 text-stone-400" aria-hidden="true" />
              <div>
                <dt className="text-sm font-medium text-stone-900">Address</dt>
                <dd className="mt-1 text-sm leading-relaxed text-stone-500">
                  {address.landmark}
                  <br />
                  {address.locality}, Accra, {address.countryName}
                </dd>
                <dd className="mt-2 text-sm leading-relaxed text-stone-500">
                  Coming along the Kasoa road, turn towards the beach at Jack Mullar Beach Junction. Skyways
                  Hotel is right at the junction, and we&apos;re inside.
                </dd>
              </div>
            </div>
            <div data-reveal className="flex gap-4">
              <Clock className="mt-0.5 size-5 shrink-0 text-stone-400" aria-hidden="true" />
              <div>
                <dt className="text-sm font-medium text-stone-900">Opening hours</dt>
                <dd className="mt-1 text-sm text-stone-500">{businessInfo.hoursLabel}</dd>
                <dd className="mt-2">
                  <StatusBadge showDetail />
                </dd>
              </div>
            </div>
            <div data-reveal className="flex gap-4">
              <Phone className="mt-0.5 size-5 shrink-0 text-stone-400" aria-hidden="true" />
              <div>
                <dt className="text-sm font-medium text-stone-900">Phone & WhatsApp</dt>
                <dd className="mt-1 text-sm text-stone-500">{businessInfo.phoneDisplay}</dd>
              </div>
            </div>
          </dl>

          <div data-reveal className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-auto lg:pt-8">
            <a
              href={`tel:${businessInfo.phoneE164}`}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
            >
              <Phone className="size-4" aria-hidden="true" />
              Call us
            </a>
            <a
              href={businessInfo.googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-stone-200/80 bg-white px-6 text-sm font-semibold text-stone-800 transition hover:bg-stone-100 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
            >
              <Navigation className="size-4" aria-hidden="true" />
              Get directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
