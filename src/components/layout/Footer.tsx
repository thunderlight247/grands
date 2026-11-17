import { businessInfo } from "@/data/businessInfo";
import { buildWhatsAppUrl } from "@/utils/whatsapp";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200/60 bg-neutral-100/60 pb-28 pt-12 md:pb-12">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-base font-semibold tracking-tight text-neutral-900">{businessInfo.name}</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-neutral-500">{businessInfo.tagline}.</p>
          <p className="mt-4 text-sm text-neutral-500">
            {businessInfo.address.landmark}, {businessInfo.address.locality}, Accra
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-neutral-900">Visit</p>
          <ul className="mt-3 space-y-2 text-sm text-neutral-500">
            <li>{businessInfo.hoursLabel}</li>
            <li>Average plate {businessInfo.priceRange}</li>
            <li>{businessInfo.services.join(" · ")}</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium text-neutral-900">Contact</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={`tel:${businessInfo.phoneE164}`} className="text-neutral-500 transition hover:text-neutral-900">
                {businessInfo.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 transition hover:text-neutral-900"
              >
                WhatsApp us
              </a>
            </li>
            <li>
              <a
                href={businessInfo.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 transition hover:text-neutral-900"
              >
                Google Maps
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl px-4 text-xs text-neutral-400 sm:px-6">
        © {businessInfo.name}. Prices in Ghana cedis (GHS) and subject to change.
      </div>
    </footer>
  );
}
