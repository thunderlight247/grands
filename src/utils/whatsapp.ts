import { businessInfo } from "@/data/businessInfo";
import { formatGHS } from "./currency";

export type FulfillmentType = "pickup" | "delivery";

export const FULFILLMENT_LABELS: Record<FulfillmentType, string> = {
  pickup: "Dine-in / Pickup",
  delivery: "Delivery",
};

export interface OrderLine {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderDetails {
  lines: readonly OrderLine[];
  fulfillment: FulfillmentType;
  customerName: string;
  deliveryLocation?: string;
  note?: string;
}

export interface CateringInquiry {
  fullName: string;
  phone: string;
  eventDate: string;
  guestCount: number;
  eventLocation: string;
  notes?: string;
}

export function orderSubtotal(lines: readonly OrderLine[]): number {
  return lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
}

/** Builds the plain-text order receipt sent through WhatsApp. */
export function buildOrderMessage(order: OrderDetails): string {
  const itemLines = order.lines.map(
    (line) =>
      `• ${line.quantity} × ${line.name} — ${formatGHS(line.unitPrice * line.quantity)}`,
  );

  const parts: string[] = [
    `Hello ${businessInfo.name}! I'd like to place an order.`,
    "",
    "*Order*",
    ...itemLines,
    "",
    `*Subtotal:* ${formatGHS(orderSubtotal(order.lines))}`,
    `*Fulfillment:* ${FULFILLMENT_LABELS[order.fulfillment]}`,
    `*Name:* ${order.customerName.trim()}`,
  ];

  if (order.fulfillment === "delivery" && order.deliveryLocation?.trim()) {
    parts.push(`*Delivery location:* ${order.deliveryLocation.trim()}`);
  }
  if (order.note?.trim()) {
    parts.push(`*Notes:* ${order.note.trim()}`);
  }
  parts.push("", "Please confirm availability and the total. Thank you!");

  return parts.join("\n");
}

/** Builds the event catering enquiry sent through WhatsApp. */
export function buildCateringMessage(inquiry: CateringInquiry): string {
  const parts: string[] = [
    `Hello ${businessInfo.name}! I'd like to enquire about event catering.`,
    "",
    `*Name:* ${inquiry.fullName.trim()}`,
    `*Phone:* ${inquiry.phone.trim()}`,
    `*Event date:* ${inquiry.eventDate}`,
    `*Estimated guests:* ${inquiry.guestCount}`,
    `*Event location:* ${inquiry.eventLocation.trim()}`,
  ];
  if (inquiry.notes?.trim()) {
    parts.push(`*Preferred dishes / notes:* ${inquiry.notes.trim()}`);
  }
  parts.push("", "Looking forward to your quote. Thank you!");
  return parts.join("\n");
}

/** wa.me deep link for the business number with an optional pre-filled message. */
export function buildWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${businessInfo.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
