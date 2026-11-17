"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CreditCard, MessageCircle, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLenis } from "@/components/providers/SmoothScroll";
import { usePaystackCheckout } from "@/hooks/usePaystackCheckout";
import { formatGHS } from "@/utils/currency";
import {
  FULFILLMENT_LABELS,
  buildOrderMessage,
  buildWhatsAppUrl,
  type FulfillmentType,
} from "@/utils/whatsapp";
import QuantityStepper from "./QuantityStepper";

interface FormErrors {
  customerName?: string;
  deliveryLocation?: string;
}

const inputClass =
  "w-full rounded-xl border border-neutral-200/80 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 transition focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10";

export default function WhatsAppCartDrawer() {
  const { items, itemCount, subtotal, increment, decrement, removeItem, isDrawerOpen, closeDrawer } =
    useCart();
  const lenis = useLenis();
  const paystack = usePaystackCheckout();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  const [fulfillment, setFulfillment] = useState<FulfillmentType>("pickup");
  const [customerName, setCustomerName] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  // Pause page scrolling, focus the dialog and close on Escape while open.
  useEffect(() => {
    if (!isDrawerOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    lenis?.stop();
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = previousOverflow;
      lenis?.start();
      previouslyFocused?.focus();
    };
  }, [isDrawerOpen, lenis, closeDrawer]);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (customerName.trim().length < 2) next.customerName = "Please enter your name.";
    if (fulfillment === "delivery" && deliveryLocation.trim().length < 3) {
      next.deliveryLocation = "Tell us where to deliver (area or landmark).";
    }
    return next;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0 || items.length === 0) return;

    const message = buildOrderMessage({
      lines: items.map((item) => ({ name: item.name, quantity: item.quantity, unitPrice: item.price })),
      fulfillment,
      customerName,
      deliveryLocation: fulfillment === "delivery" ? deliveryLocation : undefined,
      note,
    });
    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  }

  function handlePrepay() {
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    paystack.startCheckout({
      items,
      customerName,
      fulfillment: FULFILLMENT_LABELS[fulfillment],
    });
  }

  return (
    <div
      className={`fixed inset-0 z-[60] ${isDrawerOpen ? "" : "pointer-events-none"}`}
      inert={!isDrawerOpen}
      aria-hidden={!isDrawerOpen}
    >
      <div
        onClick={closeDrawer}
        className={`absolute inset-0 bg-neutral-900/30 backdrop-blur-[2px] transition-opacity duration-300 motion-reduce:transition-none ${
          isDrawerOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-neutral-50 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          isDrawerOpen ? "translate-x-0 shadow-2xl" : "translate-x-full shadow-none"
        }`}
      >
        <header className="flex items-center justify-between border-b border-neutral-200/60 px-5 py-4">
          <div>
            <h2 id={titleId} className="text-lg font-semibold tracking-tight text-neutral-900">
              Your order
            </h2>
            <p className="text-xs text-neutral-500">
              {itemCount} {itemCount === 1 ? "item" : "items"} · sent to us on WhatsApp
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeDrawer}
            aria-label="Close order"
            className="grid size-10 place-items-center rounded-full text-neutral-600 transition hover:bg-neutral-200/60 focus-visible:outline-2 focus-visible:outline-neutral-900"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <ShoppingBag className="size-8 text-neutral-300" aria-hidden="true" />
            <p className="font-medium text-neutral-900">Your order is empty</p>
            <p className="text-sm text-neutral-500">Add a few dishes from the menu to get started.</p>
            <a
              href="#menu"
              onClick={closeDrawer}
              className="mt-2 rounded-full border border-neutral-200/80 px-4 py-2 text-sm font-medium text-neutral-800 transition hover:bg-white"
            >
              Browse the menu
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
            <div data-lenis-prevent className="flex-1 space-y-6 overflow-y-auto overscroll-contain px-5 py-5">
              <ul className="space-y-3">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-3 rounded-2xl border border-neutral-200/60 bg-white p-3"
                  >
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                      <Image src={item.image} alt={item.imageAlt} fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-medium text-neutral-900">{item.name}</p>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name} from order`}
                          className="-m-1 rounded-full p-1 text-neutral-400 transition hover:text-neutral-700 focus-visible:outline-2 focus-visible:outline-neutral-900"
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <QuantityStepper
                          size="sm"
                          quantity={item.quantity}
                          itemName={item.name}
                          onIncrement={() => increment(item.id)}
                          onDecrement={() => decrement(item.id)}
                        />
                        <span className="text-sm font-semibold tabular-nums text-neutral-900">
                          {formatGHS(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <fieldset>
                <legend className="mb-2 text-sm font-medium text-neutral-900">How would you like it?</legend>
                <div className="grid grid-cols-2 gap-1 rounded-full border border-neutral-200/60 bg-white p-1">
                  {(Object.keys(FULFILLMENT_LABELS) as FulfillmentType[]).map((option) => (
                    <label
                      key={option}
                      className={`cursor-pointer rounded-full px-3 py-2 text-center text-sm font-medium transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-neutral-900 ${
                        fulfillment === option
                          ? "bg-neutral-900 text-neutral-50"
                          : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      <input
                        type="radio"
                        name="fulfillment"
                        value={option}
                        checked={fulfillment === option}
                        onChange={() => setFulfillment(option)}
                        className="sr-only"
                      />
                      {FULFILLMENT_LABELS[option]}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="space-y-4">
                <div>
                  <label htmlFor="customer-name" className="mb-1.5 block text-sm font-medium text-neutral-900">
                    Your name
                  </label>
                  <input
                    id="customer-name"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      setErrors((prev) => ({ ...prev, customerName: undefined }));
                    }}
                    autoComplete="name"
                    aria-invalid={Boolean(errors.customerName)}
                    aria-describedby={errors.customerName ? "customer-name-error" : undefined}
                    className={inputClass}
                    placeholder="e.g. Kwame Mensah"
                  />
                  {errors.customerName && (
                    <p id="customer-name-error" className="mt-1 text-xs text-red-700">
                      {errors.customerName}
                    </p>
                  )}
                </div>

                {fulfillment === "delivery" && (
                  <div>
                    <label
                      htmlFor="delivery-location"
                      className="mb-1.5 block text-sm font-medium text-neutral-900"
                    >
                      Delivery location / landmark
                    </label>
                    <input
                      id="delivery-location"
                      value={deliveryLocation}
                      onChange={(e) => {
                        setDeliveryLocation(e.target.value);
                        setErrors((prev) => ({ ...prev, deliveryLocation: undefined }));
                      }}
                      autoComplete="street-address"
                      aria-invalid={Boolean(errors.deliveryLocation)}
                      aria-describedby={errors.deliveryLocation ? "delivery-location-error" : undefined}
                      className={inputClass}
                      placeholder="e.g. Kokrobite, near the junction"
                    />
                    {errors.deliveryLocation && (
                      <p id="delivery-location-error" className="mt-1 text-xs text-red-700">
                        {errors.deliveryLocation}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label htmlFor="order-note" className="mb-1.5 block text-sm font-medium text-neutral-900">
                    Order notes <span className="font-normal text-neutral-400">(optional)</span>
                  </label>
                  <textarea
                    id="order-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    className={`${inputClass} resize-none`}
                    placeholder="Spice level, allergies, extra plantain…"
                  />
                </div>
              </div>
            </div>

            <footer className="space-y-3 border-t border-neutral-200/60 bg-neutral-50 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Subtotal</span>
                <span className="text-base font-semibold tabular-nums text-neutral-900">
                  {formatGHS(subtotal)}
                </span>
              </div>
              {fulfillment === "delivery" && (
                <p className="text-xs text-neutral-500">Delivery fee is confirmed on WhatsApp.</p>
              )}
              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral-900 text-sm font-semibold text-neutral-50 transition hover:bg-neutral-700 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                Complete order on WhatsApp
              </button>

              {/* Paystack prepayment: enabled once NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is set. */}
              <div className="border-t border-dashed border-neutral-200 pt-3">
                <button
                  type="button"
                  onClick={handlePrepay}
                  disabled={!paystack.isEnabled}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-neutral-200/80 text-sm font-medium text-neutral-700 transition enabled:hover:bg-white disabled:cursor-not-allowed disabled:text-neutral-400"
                >
                  <CreditCard className="size-4" aria-hidden="true" />
                  {paystack.isEnabled ? "Pay now with card or MoMo" : "Card & MoMo prepayment coming soon"}
                </button>
              </div>
            </footer>
          </form>
        )}
      </aside>
    </div>
  );
}
