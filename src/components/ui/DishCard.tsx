"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import type { MenuItem } from "@/data/menuData";
import { useCart } from "@/context/CartContext";
import { formatGHS } from "@/utils/currency";
import QuantityStepper from "./QuantityStepper";

interface DishCardProps {
  item: MenuItem;
  /** Load eagerly when the card is likely above the fold. */
  priority?: boolean;
}

export default function DishCard({ item, priority = false }: DishCardProps) {
  const { getQuantity, addItem, increment, decrement } = useCart();
  const quantity = getQuantity(item.id);

  return (
    <article
      data-reveal
      className="group flex flex-col overflow-hidden rounded-3xl border border-stone-200/60 bg-white transition-shadow duration-300 hover:shadow-[0_12px_40px_-16px_rgba(23,23,23,0.18)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
        />
        {item.signature && (
          <span className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-medium tracking-wide text-brand-700 backdrop-blur">
            House favourite
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base font-semibold tracking-tight text-stone-900">{item.name}</h3>
          <p className="shrink-0 text-sm font-semibold tabular-nums text-stone-900">
            {formatGHS(item.price)}
          </p>
        </div>
        <p className="text-sm leading-relaxed text-stone-500">{item.description}</p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xs text-stone-400">{item.category}</span>
          {!item.available ? (
            <span className="rounded-full border border-stone-200/60 px-4 py-2 text-sm text-stone-400">
              Sold out today
            </span>
          ) : quantity > 0 ? (
            <QuantityStepper
              quantity={quantity}
              itemName={item.name}
              onIncrement={() => increment(item.id)}
              onDecrement={() => decrement(item.id)}
            />
          ) : (
            <button
              type="button"
              onClick={() => addItem(item.id)}
              className="inline-flex h-10 items-center gap-1.5 rounded-full bg-brand-600 px-4 text-sm font-medium text-white transition hover:bg-brand-700 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
            >
              <Plus className="size-4" aria-hidden="true" />
              Add to order
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
