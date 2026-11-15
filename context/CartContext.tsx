"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { CartItem, Product } from "@/types/models";

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  addItem: (product: Product, quantity?: number, size?: string) => void;
  removeItem: (productID: number, size?: string) => void;
  increaseQuantity: (productID: number, size?: string) => void;
  decreaseQuantity: (productID: number, size?: string) => void;
  getTotal: () => number;
  clearCart: () => void;
  /** false until the saved cart has been read from the browser */
  ready: boolean;
}

const STORAGE_KEY = "layrd-cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

// The same product in a different size is a separate line in the cart.
function isSameLine(item: CartItem, productID: number, size?: string) {
  return item.product.productID === productID && item.size === size;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  // Keep the cart when the page reloads or the customer comes back from payment
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser storage after mount
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // storage blocked or bad data: start with an empty cart
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage full or blocked: the cart still works for this visit
    }
  }, [items, ready]);

  function clearCart() {
    setItems([]);
  }

  function addItem(product: Product, quantity = 1, size?: string) {
    setItems((prevItems) => {
      const existing = prevItems.find((i) => isSameLine(i, product.productID, size));

      if (existing) {
        return prevItems.map((i) =>
          isSameLine(i, product.productID, size) ? { ...i, quantity: i.quantity + quantity } : i
        );
      }

      return [...prevItems, { product, quantity, size }];
    });
  }

  function removeItem(productID: number, size?: string) {
    setItems((prevItems) => prevItems.filter((i) => !isSameLine(i, productID, size)));
  }

  function increaseQuantity(productID: number, size?: string) {
    setItems((prevItems) =>
      prevItems.map((i) => (isSameLine(i, productID, size) ? { ...i, quantity: i.quantity + 1 } : i))
    );
  }

  function decreaseQuantity(productID: number, size?: string) {
    setItems((prevItems) =>
      prevItems
        .map((i) => (isSameLine(i, productID, size) ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  }

  function getTotal(): number {
    return items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, itemCount, addItem, removeItem, increaseQuantity, decreaseQuantity, getTotal, clearCart, ready }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside a CartProvider");
  return context;
}
