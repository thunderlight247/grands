"use client";

import { useCallback } from "react";
import type { CartItem } from "@/context/CartContext";

/**
 * Payload in the shape Paystack Inline (`PaystackPop.newTransaction`) expects.
 * Amounts are in pesewas (GHS × 100).
 */
export interface PaystackCheckoutRequest {
  key: string;
  amount: number;
  currency: "GHS";
  reference: string;
  metadata: {
    customerName: string;
    fulfillment: string;
    items: { id: string; name: string; quantity: number; unitPrice: number }[];
  };
}

export interface PaystackCheckout {
  /** True once NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is set. */
  isEnabled: boolean;
  /**
   * Builds the transaction from the cart and hands it to the payment layer by
   * dispatching a `grandgees:paystack-checkout` window event. Returns the
   * request, or null when Paystack isn't configured or the cart is empty.
   */
  startCheckout: (input: CheckoutInput) => PaystackCheckoutRequest | null;
}

interface CheckoutInput {
  items: readonly CartItem[];
  customerName: string;
  fulfillment: string;
}

export const PAYSTACK_CHECKOUT_EVENT = "grandgees:paystack-checkout";

const PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "";

/**
 * Prepayment hook. The cart drawer already calls `startCheckout`; to go live,
 * set the public key, load https://js.paystack.co/v2/inline.js, listen for
 * PAYSTACK_CHECKOUT_EVENT and pass `event.detail` (plus the customer's email)
 * to `new PaystackPop().newTransaction(...)`. Verify every
 * payment on a server route with the secret key before treating it as paid.
 */
export function usePaystackCheckout(): PaystackCheckout {
  const startCheckout = useCallback<PaystackCheckout["startCheckout"]>(
    ({ items, customerName, fulfillment }) => {
      if (!PUBLIC_KEY || items.length === 0) return null;
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const request: PaystackCheckoutRequest = {
        key: PUBLIC_KEY,
        amount: Math.round(subtotal * 100),
        currency: "GHS",
        reference: `GG-${Date.now().toString(36).toUpperCase()}`,
        metadata: {
          customerName,
          fulfillment,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
          })),
        },
      };
      window.dispatchEvent(new CustomEvent(PAYSTACK_CHECKOUT_EVENT, { detail: request }));
      return request;
    },
    [],
  );

  return { isEnabled: PUBLIC_KEY.length > 0, startCheckout };
}
