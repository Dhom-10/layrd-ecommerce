"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

/** Empties the cart once the customer lands on a paid order (needed after the Stripe redirect). */
export default function ClearCart() {
  const { clearCart, ready } = useCart();
  useEffect(() => {
    if (ready) clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);
  return null;
}
