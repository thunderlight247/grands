"use client";

import { useEffect, useState } from "react";
import { Menu as MenuIcon, ShoppingBag, X } from "lucide-react";
import { businessInfo } from "@/data/businessInfo";
import { useCart } from "@/context/CartContext";
import StatusBadge from "@/components/ui/StatusBadge";

const NAV_LINKS = [
  { href: "#menu", label: "Menu" },
  { href: "#catering", label: "Catering" },
  { href: "#reviews", label: "Reviews" },
  { href: "#location", label: "Location" },
] as const;

export default function Navbar() {
  const { itemCount, openDrawer } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || mobileOpen
          ? "border-b border-stone-200/60 bg-stone-50/85 backdrop-blur-md"
          : "border-b border-transparent bg-stone-50/0"
      }`}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <a
          href="#top"
          className="flex min-w-0 items-baseline gap-1.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900"
        >
          <span className="truncate text-base font-semibold tracking-tight text-stone-900">
            {businessInfo.shortName}
          </span>
          <span className="hidden text-xs font-medium uppercase tracking-[0.18em] text-stone-400 sm:inline">
            Food Court
          </span>
        </a>

        <div className="hidden sm:block">
          <StatusBadge />
        </div>

        <ul className="ml-auto hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-full px-3 py-2 text-sm text-stone-600 transition hover:bg-stone-200/50 hover:text-stone-900 focus-visible:outline-2 focus-visible:outline-stone-900"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-1 md:ml-2">
          <button
            type="button"
            onClick={openDrawer}
            aria-label={`Open order, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
            className="relative grid size-10 place-items-center rounded-full text-stone-800 transition hover:bg-stone-200/60 active:scale-95 focus-visible:outline-2 focus-visible:outline-stone-900"
          >
            <ShoppingBag className="size-5" aria-hidden="true" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-[11px] font-semibold tabular-nums text-white">
                {itemCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            className="grid size-10 place-items-center rounded-full text-stone-800 transition hover:bg-stone-200/60 focus-visible:outline-2 focus-visible:outline-stone-900 md:hidden"
          >
            {mobileOpen ? <X className="size-5" aria-hidden="true" /> : <MenuIcon className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <div id="mobile-nav" hidden={!mobileOpen} className="border-t border-stone-200/60 px-4 pb-4 md:hidden">
        <div className="py-3 sm:hidden">
          <StatusBadge showDetail />
        </div>
        <ul className="grid grid-cols-2 gap-2">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-2xl border border-stone-200/60 bg-white px-4 py-3 text-sm font-medium text-stone-800 transition hover:bg-stone-100"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
