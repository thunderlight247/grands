"use client";

import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  quantity: number;
  itemName: string;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: "sm" | "md";
}

export default function QuantityStepper({
  quantity,
  itemName,
  onIncrement,
  onDecrement,
  size = "md",
}: QuantityStepperProps) {
  const button =
    size === "sm"
      ? "size-8"
      : "size-10";

  return (
    <div className="inline-flex items-center rounded-full border border-neutral-200/60 bg-neutral-50">
      <button
        type="button"
        onClick={onDecrement}
        aria-label={`Remove one ${itemName}`}
        className={`${button} grid place-items-center rounded-full text-neutral-700 transition hover:bg-neutral-200/60 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900`}
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <span className="min-w-8 text-center text-sm font-semibold tabular-nums text-neutral-900" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        aria-label={`Add one more ${itemName}`}
        className={`${button} grid place-items-center rounded-full text-neutral-700 transition hover:bg-neutral-200/60 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900`}
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
