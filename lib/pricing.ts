import { DeliveryMethod } from "@/types/models";

// Keep these in sync with the place_order() function in the database,
// which is the real source of truth for what the customer is charged.
export const TAX_RATE = 0.05; // GST (Alberta)
export const DELIVERY_FEE = 1.99;
export const FREE_DELIVERY_FROM = 75;

export function shippingFor(subtotal: number, method: DeliveryMethod | null) {
  if (method === null) return null; // not chosen yet
  if (method === "pickup" || subtotal >= FREE_DELIVERY_FROM) return 0;
  return DELIVERY_FEE;
}

export function money(n: number) {
  return `$${n.toFixed(2)}`;
}

export const roundCents = (n: number) => Math.round(n * 100) / 100;
