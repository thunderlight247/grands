"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowDown, MapPin, MessageCircle } from "lucide-react";
import { businessInfo } from "@/data/businessInfo";
import { buildWhatsAppUrl } from "@/utils/whatsapp";
import BlurText from "@/components/ui/BlurText";
import StatusBadge from "@/components/ui/StatusBadge";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  useStaggerReveal(ref, "[data-reveal]");

  return (
    <section ref={ref} id="top" className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 md:pt-14 lg:pb-24">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <div data-reveal className="mb-6 flex flex-wrap items-center gap-2">
            <StatusBadge showDetail />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200/60 px-3 py-1 text-xs text-neutral-500">
              <MapPin className="size-3.5" aria-hidden="true" />
              Skyways Hotel, Bortianor
            </span>
          </div>

          <BlurText
            text="Ghanaian, Nigerian & continental plates, cooked fresh daily."
            className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-neutral-900 sm:text-5xl lg:text-6xl"
          />

          <p data-reveal className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-neutral-500 sm:text-lg">
            From fufu and light soup to seafood okra and smoky party jollof, every plate is prepared to
            order inside Skyways Hotel at Jack Mullar Beach Junction, Bortianor. Dine in, take away or order straight on WhatsApp.
          </p>

          <div data-reveal className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="#menu"
              className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-neutral-900 px-6 text-sm font-semibold text-neutral-50 transition hover:bg-neutral-700 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
            >
              View menu & order
              <ArrowDown className="size-4" aria-hidden="true" />
            </a>
            <a
              href={buildWhatsAppUrl(`Hello ${businessInfo.name}! I have a quick question.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-neutral-200/80 bg-white px-6 text-sm font-semibold text-neutral-800 transition hover:border-neutral-300 hover:bg-neutral-100 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Chat on WhatsApp
            </a>
            <a
              href={businessInfo.googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-medium text-neutral-600 underline-offset-4 transition hover:text-neutral-900 hover:underline focus-visible:outline-2 focus-visible:outline-neutral-900"
            >
              <MapPin className="size-4" aria-hidden="true" />
              Directions
            </a>
          </div>

          <dl data-reveal className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-neutral-200/60 pt-6">
            <div>
              <dt className="text-xs text-neutral-400">Hours</dt>
              <dd className="mt-1 text-sm font-medium text-neutral-800">8 AM – 12:30 AM</dd>
            </div>
            <div>
              <dt className="text-xs text-neutral-400">Average plate</dt>
              <dd className="mt-1 text-sm font-medium text-neutral-800">{businessInfo.priceRange}</dd>
            </div>
            <div>
              <dt className="text-xs text-neutral-400">Open</dt>
              <dd className="mt-1 text-sm font-medium text-neutral-800">Every day</dd>
            </div>
          </dl>
        </div>

        <div data-reveal className="lg:col-span-6">
          <div className="relative mx-auto aspect-square w-full max-w-[560px] overflow-hidden rounded-[2rem] border border-neutral-200/60 bg-neutral-100">
            <Image
              src="/images/hero-mixed-platter.jpg"
              alt="Grand Gees mixed platter with jollof rice, fried rice, spaghetti, fried plantain, peppered beef and grilled chicken"
              fill
              priority
              sizes="(min-width: 1024px) 560px, 92vw"
              className="object-cover"
            />
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-2xl bg-white/85 px-4 py-3 backdrop-blur-md">
              <div>
                <p className="text-sm font-semibold text-neutral-900">Grand Mixed Platter</p>
                <p className="text-xs text-neutral-500">Jollof · fried rice · plantain · chicken</p>
              </div>
              <a
                href="#menu"
                className="rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-neutral-50 transition hover:bg-neutral-700"
              >
                Order
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
