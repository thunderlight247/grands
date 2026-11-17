"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Clock, CreditCard, MessageCircle, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLenis } from "@/components/providers/SmoothScroll";
import { usePaystackCheckout } from "@/hooks/usePaystackCheckout";
import { useRestaurantStatus } from "@/hooks/useRestaurantStatus";
import { formatGHS } from "@/utils/currency";
import { businessInfo } from "@/data/businessInfo";
import { formatClock } from "@/utils/hours";
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

/** Name and delivery details are remembered so repeat customers don't retype them. */
const DETAILS_KEY = "grand-gees-customer-v1";

interface SavedDetails {
  customerName: string;
  deliveryLocation: string;
  fulfillment: FulfillmentType;
}

function loadDetails(): Partial<SavedDetails> {
  if (typeof window === "undefined") return {};
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(DETAILS_KEY) ?? "{}");
    if (typeof parsed !== "object" || parsed === null) return {};
    const record = parsed as Record<string, unknown>;
    return {
      customerName: typeof record.customerName === "string" ? record.customerName : undefined,
      deliveryLocation: typeof record.deliveryLocation === "string" ? record.deliveryLocation : undefined,
      fulfillment:
        record.fulfillment === "pickup" || record.fulfillment === "delivery" ? record.fulfillment : undefined,
    };
  } catch {
    return {};
  }
}

function saveDetails(details: SavedDetails) {
  try {
    window.localStorage.setItem(DETAILS_KEY, JSON.stringify(details));
  } catch {
    // Storage blocked: nothing to remember.
  }
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const inputClass =
  "w-full rounded-xl border border-stone-200/80 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 transition focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-600/15";

export default function WhatsAppCartDrawer() {
  const { items, itemCount, subtotal, increment, decrement, removeItem, clearCart, isDrawerOpen, closeDrawer } =
    useCart();
  const lenis = useLenis();
  const paystack = usePaystackCheckout();
  const status = useRestaurantStatus();
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const [fulfillment, setFulfillment] = useState<FulfillmentType>(() => loadDetails().fulfillment ?? "pickup");
  const [customerName, setCustomerName] = useState(() => loadDetails().customerName ?? "");
  const [deliveryLocation, setDeliveryLocation] = useState(() => loadDetails().deliveryLocation ?? "");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  /**
   * Cart contents at the moment the order was handed to WhatsApp. The "sent"
   * screen shows only while the cart still matches, so adding or changing
   * dishes afterwards brings the order form back.
   */
  const [sentSignature, setSentSignature] = useState<string | null>(null);
  const cartSignature = items.map((item) => `${item.id}:${item.quantity}`).join("|");
  const sent = sentSignature !== null && sentSignature === cartSignature;

  // Pause page scrolling, trap focus and close on Escape while open.
  useEffect(() => {
    if (!isDrawerOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    lenis?.stop();
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawer();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !dialogRef.current.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !dialogRef.current.contains(active))) {
        event.preventDefault();
        first.focus();
      }
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

  function focusFirstError(found: FormErrors) {
    if (found.customerName) document.getElementById("customer-name")?.focus();
    else if (found.deliveryLocation) document.getElementById("delivery-location")?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      focusFirstError(found);
      return;
    }
    if (items.length === 0) return;

    const message = buildOrderMessage({
      lines: items.map((item) => ({ name: item.name, quantity: item.quantity, unitPrice: item.price })),
      fulfillment,
      customerName,
      deliveryLocation: fulfillment === "delivery" ? deliveryLocation : undefined,
      note,
    });
    saveDetails({ customerName: customerName.trim(), deliveryLocation: deliveryLocation.trim(), fulfillment });
    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
    setSentSignature(cartSignature);
  }

  function handlePrepay() {
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      focusFirstError(found);
      return;
    }
    paystack.startCheckout({
      items,
      customerName,
      fulfillment: FULFILLMENT_LABELS[fulfillment],
    });
  }

  function finishOrder() {
    clearCart();
    setNote("");
    setSentSignature(null);
    closeDrawer();
  }

  const isClosed = status === "closed";

  return (
    <div
      className={`fixed inset-0 z-[60] ${isDrawerOpen ? "" : "pointer-events-none"}`}
      inert={!isDrawerOpen}
      aria-hidden={!isDrawerOpen}
    >
      <div
        onClick={closeDrawer}
        className={`absolute inset-0 bg-stone-900/30 backdrop-blur-[2px] transition-opacity duration-300 motion-reduce:transition-none ${
          isDrawerOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-stone-50 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          isDrawerOpen ? "translate-x-0 shadow-2xl" : "translate-x-full shadow-none"
        }`}
      >
        <header className="flex items-center justify-between border-b border-stone-200/60 px-5 py-4">
          <div>
            <h2 id={titleId} className="text-lg font-semibold tracking-tight text-stone-900">
              Your order
            </h2>
            <p className="text-xs text-stone-500">
              {itemCount} {itemCount === 1 ? "item" : "items"} · sent to us on WhatsApp
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeDrawer}
            aria-label="Close order"
            className="grid size-10 place-items-center rounded-full text-stone-600 transition hover:bg-stone-200/60 focus-visible:outline-2 focus-visible:outline-stone-900"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        {sent && items.length > 0 ? (
          <div role="status" className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <CheckCircle2 className="size-10 text-emerald-600" aria-hidden="true" />
            <p className="text-lg font-semibold text-stone-900">Order opened in WhatsApp</p>
            <p className="max-w-xs text-sm leading-relaxed text-stone-500">
              Press send in WhatsApp and we&apos;ll confirm availability, the total and timing in a few minutes.
            </p>
            <div className="mt-4 flex w-full flex-col gap-2">
              <button
                type="button"
                onClick={finishOrder}
                className="flex h-12 w-full items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
              >
                I&apos;ve sent it, clear my order
              </button>
              <button
                type="button"
                onClick={() => setSentSignature(null)}
                className="flex h-11 w-full items-center justify-center rounded-full border border-stone-200/80 text-sm font-medium text-stone-700 transition hover:bg-white"
              >
                Back to my order
              </button>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <ShoppingBag className="size-8 text-stone-300" aria-hidden="true" />
            <p className="font-medium text-stone-900">Your order is empty</p>
            <p className="text-sm text-stone-500">Add a few dishes from the menu to get started.</p>
            <a
              href="#menu"
              onClick={closeDrawer}
              className="mt-2 rounded-full border border-stone-200/80 px-4 py-2 text-sm font-medium text-stone-800 transition hover:bg-white"
            >
              Browse the menu
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
            <div data-lenis-prevent className="flex-1 space-y-6 overflow-y-auto overscroll-contain px-5 py-5">
              {isClosed && (
                <p className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm leading-relaxed text-amber-900">
                  <Clock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>
                    The kitchen is closed right now. You can still send your order and we&apos;ll confirm it
                    when we open at {formatClock(businessInfo.hours.opens)}.
                  </span>
                </p>
              )}
              {status === "closing-soon" && (
                <p className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm leading-relaxed text-amber-900">
                  <Clock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>
                    We close at {formatClock(businessInfo.hours.closes)}. Send your order soon so the kitchen
                    can fit it in.
                  </span>
                </p>
              )}

              <ul className="space-y-3">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-3 rounded-2xl border border-stone-200/60 bg-white p-3"
                  >
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                      <Image src={item.image} alt={item.imageAlt} fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-medium text-stone-900">{item.name}</p>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name} from order`}
                          className="-m-1 rounded-full p-1 text-stone-400 transition hover:text-stone-700 focus-visible:outline-2 focus-visible:outline-stone-900"
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
                        <span className="text-sm font-semibold tabular-nums text-stone-900">
                          {formatGHS(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <fieldset>
                <legend className="mb-2 text-sm font-medium text-stone-900">How would you like it?</legend>
                <div className="grid grid-cols-2 gap-1 rounded-full border border-stone-200/60 bg-white p-1">
                  {(Object.keys(FULFILLMENT_LABELS) as FulfillmentType[]).map((option) => (
                    <label
                      key={option}
                      className={`cursor-pointer rounded-full px-3 py-2 text-center text-sm font-medium transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-stone-900 ${
                        fulfillment === option
                          ? "bg-stone-900 text-stone-50"
                          : "text-stone-600 hover:bg-stone-100"
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
                  <label htmlFor="customer-name" className="mb-1.5 block text-sm font-medium text-stone-900">
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
                      className="mb-1.5 block text-sm font-medium text-stone-900"
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
                  <label htmlFor="order-note" className="mb-1.5 block text-sm font-medium text-stone-900">
                    Order notes <span className="font-normal text-stone-400">(optional)</span>
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

            <footer className="space-y-3 border-t border-stone-200/60 bg-stone-50 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-500">Subtotal</span>
                <span className="text-base font-semibold tabular-nums text-stone-900">
                  {formatGHS(subtotal)}
                </span>
              </div>
              {fulfillment === "delivery" && (
                <p className="text-xs text-stone-500">Delivery fee is confirmed on WhatsApp.</p>
              )}
              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-600 text-sm font-semibold text-white transition hover:bg-brand-700 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                Complete order on WhatsApp
              </button>

              {/* Paystack prepayment: shown only once NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is set. */}
              {paystack.isEnabled && (
                <button
                  type="button"
                  onClick={handlePrepay}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-stone-200/80 text-sm font-medium text-stone-700 transition hover:bg-white"
                >
                  <CreditCard className="size-4" aria-hidden="true" />
                  Pay now with card or MoMo
                </button>
              )}
            </footer>
          </form>
        )}
      </aside>
    </div>
  );
}
