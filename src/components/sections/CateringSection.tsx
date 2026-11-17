"use client";

import Image from "next/image";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { CalendarDays, MessageCircle, Users } from "lucide-react";
import { buildCateringMessage, buildWhatsAppUrl } from "@/utils/whatsapp";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";

interface CateringForm {
  fullName: string;
  phone: string;
  eventDate: string;
  guestCount: string;
  eventLocation: string;
  notes: string;
}

type CateringErrors = Partial<Record<keyof CateringForm, string>>;

const INITIAL: CateringForm = {
  fullName: "",
  phone: "",
  eventDate: "",
  guestCount: "",
  eventLocation: "",
  notes: "",
};

const inputClass =
  "w-full rounded-xl border border-neutral-200/80 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 transition focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 aria-[invalid=true]:border-red-300";

function todayISO(): string {
  // Event dates are compared in Ghana time (GMT, no daylight saving).
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Accra" }).format(new Date());
}

function validate(form: CateringForm): CateringErrors {
  const errors: CateringErrors = {};
  if (form.fullName.trim().length < 2) errors.fullName = "Please enter your full name.";

  const digits = form.phone.replace(/[^\d]/g, "");
  if (digits.length < 9 || digits.length > 15) errors.phone = "Enter a valid phone number.";

  if (!form.eventDate) errors.eventDate = "Choose your event date.";
  else if (form.eventDate < todayISO()) errors.eventDate = "The event date can't be in the past.";

  const guests = Number(form.guestCount);
  if (!Number.isInteger(guests) || guests < 10) errors.guestCount = "Catering starts from 10 guests.";
  else if (guests > 5000) errors.guestCount = "For events over 5,000 guests, call us directly.";

  if (form.eventLocation.trim().length < 3) errors.eventLocation = "Where is the event taking place?";
  return errors;
}

const GALLERY = [
  {
    src: "/images/hero-mixed-platter.jpg",
    alt: "Party platter of jollof rice, fried rice, spaghetti, plantain and grilled chicken",
    className: "col-span-2 row-span-2",
    sizes: "(min-width: 1024px) 360px, 60vw",
  },
  {
    src: "/images/egusi-soup-pounded-yam.jpg",
    alt: "Bowls of egusi soup served with pounded yam",
    className: "",
    sizes: "(min-width: 1024px) 180px, 30vw",
  },
  {
    src: "/images/okra-soup-seafood.jpg",
    alt: "Seafood okra soup with prawns",
    className: "",
    sizes: "(min-width: 1024px) 180px, 30vw",
  },
] as const;

export default function CateringSection() {
  const ref = useRef<HTMLElement>(null);
  const [form, setForm] = useState<CateringForm>(INITIAL);
  const [errors, setErrors] = useState<CateringErrors>({});
  const [sent, setSent] = useState(false);
  useStaggerReveal(ref, "[data-reveal]");

  function update(field: keyof CateringForm) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(form);
    setErrors(found);
    const firstInvalid = (Object.keys(found) as (keyof CateringForm)[])[0];
    if (firstInvalid) {
      document.getElementById(`catering-${firstInvalid}`)?.focus();
      return;
    }
    const message = buildCateringMessage({
      fullName: form.fullName,
      phone: form.phone,
      eventDate: form.eventDate,
      guestCount: Number(form.guestCount),
      eventLocation: form.eventLocation,
      notes: form.notes,
    });
    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  function field(
    name: keyof CateringForm,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) {
    const errorId = `catering-${name}-error`;
    return (
      <div>
        <label htmlFor={`catering-${name}`} className="mb-1.5 block text-sm font-medium text-neutral-900">
          {label}
        </label>
        <input
          id={`catering-${name}`}
          name={name}
          value={form[name]}
          onChange={update(name)}
          aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? errorId : undefined}
          className={inputClass}
          {...props}
        />
        {errors[name] && (
          <p id={errorId} className="mt-1 text-xs text-red-700">
            {errors[name]}
          </p>
        )}
      </div>
    );
  }

  return (
    <section ref={ref} id="catering" aria-labelledby="catering-title" className="scroll-mt-20 py-16 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p data-reveal className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
            Event catering
          </p>
          <h2
            data-reveal
            id="catering-title"
            className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-neutral-900 sm:text-4xl"
          >
            Weddings, birthdays, office lunches: we bring the pots.
          </h2>
          <p data-reveal className="mt-4 text-base leading-relaxed text-neutral-500">
            Bulk platters of jollof, fried rice, soups and swallow for private events across Bortianor,
            Kokrobite, Weija and greater Accra. Tell us about your event and we&apos;ll send a quote on
            WhatsApp.
          </p>

          <ul data-reveal className="mt-6 space-y-3 text-sm text-neutral-600">
            <li className="flex items-center gap-3">
              <Users className="size-4 text-neutral-400" aria-hidden="true" />
              From 10 to several hundred guests
            </li>
            <li className="flex items-center gap-3">
              <CalendarDays className="size-4 text-neutral-400" aria-hidden="true" />
              Book at least 3 days ahead for large events
            </li>
          </ul>

          {/* Asymmetric bento gallery */}
          <div data-reveal className="mt-8 grid auto-rows-[96px] grid-cols-3 gap-3 sm:auto-rows-[120px]">
            {GALLERY.map((photo) => (
              <div
                key={photo.src}
                className={`relative overflow-hidden rounded-2xl border border-neutral-200/60 bg-neutral-100 ${photo.className}`}
              >
                <Image src={photo.src} alt={photo.alt} fill sizes={photo.sizes} className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7">
          <form
            data-reveal
            onSubmit={handleSubmit}
            noValidate
            className="rounded-3xl border border-neutral-200/60 bg-white p-5 sm:p-8"
          >
            <h3 className="text-lg font-semibold tracking-tight text-neutral-900">Request a catering quote</h3>
            <p className="mt-1 text-sm text-neutral-500">Opens WhatsApp with your details filled in.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {field("fullName", "Full name", { autoComplete: "name", placeholder: "Abena Owusu" })}
              {field("phone", "Phone number", {
                type: "tel",
                inputMode: "tel",
                autoComplete: "tel",
                placeholder: "024 000 0000",
              })}
              {field("eventDate", "Event date", { type: "date" })}
              {field("guestCount", "Estimated guests", {
                type: "number",
                inputMode: "numeric",
                min: 10,
                step: 1,
                placeholder: "e.g. 80",
              })}
              <div className="sm:col-span-2">
                {field("eventLocation", "Event location", { placeholder: "Venue, area or landmark" })}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="catering-notes" className="mb-1.5 block text-sm font-medium text-neutral-900">
                  Preferred dishes / notes <span className="font-normal text-neutral-400">(optional)</span>
                </label>
                <textarea
                  id="catering-notes"
                  name="notes"
                  value={form.notes}
                  onChange={update("notes")}
                  rows={4}
                  className={`${inputClass} resize-none`}
                  placeholder="Jollof and fried rice with chicken, fufu & light soup station, small chops…"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral-900 text-sm font-semibold text-neutral-50 transition hover:bg-neutral-700 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 sm:w-auto sm:px-8"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Send enquiry on WhatsApp
            </button>
            <p role="status" className="mt-3 text-sm text-neutral-500">
              {sent ? "WhatsApp opened in a new tab. Press send there and we'll reply with a quote." : ""}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
