"use client";

import { useMemo, useRef, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { MENU_CATEGORIES, menuItems, type MenuCategory } from "@/data/menuData";
import { useCart } from "@/context/CartContext";
import { formatGHS } from "@/utils/currency";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";
import DishCard from "@/components/ui/DishCard";

type Filter = "All" | MenuCategory;

export default function MenuSection() {
  const ref = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const { itemCount, subtotal, openDrawer, isDrawerOpen } = useCart();

  // Only show tabs for categories that currently have dishes.
  const filters = useMemo<Filter[]>(
    () => ["All", ...MENU_CATEGORIES.filter((c) => menuItems.some((item) => item.category === c))],
    [],
  );

  const visible = useMemo(
    () => (filter === "All" ? menuItems : menuItems.filter((item) => item.category === filter)),
    [filter],
  );

  useStaggerReveal(ref, "[data-reveal]", [filter]);

  return (
    <section ref={ref} id="menu" aria-labelledby="menu-title" className="scroll-mt-20 border-t border-stone-200/60 bg-stone-100/50 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-600">Menu</p>
            <h2 id="menu-title" className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-stone-900 sm:text-4xl">
              Build your order
            </h2>
            <p className="mt-3 text-base leading-relaxed text-stone-500">
              Add dishes, then send the whole order to our kitchen on WhatsApp. We confirm availability and
              timing in minutes.
            </p>
          </div>
        </div>

        <div
          role="group"
          aria-label="Filter menu by category"
          className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {filters.map((option) => {
            const active = option === filter;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={active}
                aria-controls="menu-grid"
                onClick={() => setFilter(option)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 ${
                  active
                    ? "bg-brand-600 text-white"
                    : "border border-stone-200/60 bg-white text-stone-600 hover:text-stone-900"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        <p role="status" className="sr-only">
          {`Showing ${visible.length} ${visible.length === 1 ? "dish" : "dishes"}${filter === "All" ? "" : ` in ${filter}`}`}
        </p>
        <div id="menu-grid" className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item, index) => (
            <DishCard key={item.id} item={item} priority={index < 2} />
          ))}
        </div>
      </div>

      {/* Sticky mobile order bar */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-all duration-300 motion-reduce:transition-none md:hidden ${
          itemCount > 0 && !isDrawerOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
        }`}
        aria-hidden={itemCount === 0 || isDrawerOpen}
      >
        <button
          type="button"
          onClick={openDrawer}
          tabIndex={itemCount > 0 && !isDrawerOpen ? 0 : -1}
          className="flex h-14 w-full items-center justify-between rounded-full bg-brand-600 px-5 text-white shadow-[0_12px_32px_-12px_rgba(158,63,25,0.6)] active:scale-[0.99]"
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            <ShoppingBag className="size-4" aria-hidden="true" />
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
          <span className="text-sm font-semibold">
            View order · <span className="tabular-nums">{formatGHS(subtotal)}</span>
          </span>
        </button>
      </div>
    </section>
  );
}
