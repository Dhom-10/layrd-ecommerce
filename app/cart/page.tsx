"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PiMinus, PiPlus, PiTrash } from "react-icons/pi";
import Header from "@/app/components/Header";
import Footer from "@/app/components/footer";
import OrderSummaryCard from "@/app/components/OrderSummaryCard";
import { useCart } from "@/context/CartContext";
import { money, roundCents, TAX_RATE } from "@/lib/pricing";

export default function CartPage() {
  const { items, ready, getTotal, removeItem, increaseQuantity, decreaseQuantity } = useCart();
  const [promo, setPromo] = useState("");
  const [promoMessage, setPromoMessage] = useState("");

  const subtotal = getTotal();
  const tax = roundCents(subtotal * TAX_RATE);

  return (
    <>
      <Header />

      <main className="flex-1 px-4 sm:px-10 py-10 max-w-[1440px] w-full mx-auto">
        <h1 className="text-4xl sm:text-[56px] font-bold tracking-[0.15em] text-ink">Your Cart</h1>
        <p className="mt-1 font-light text-[#353535]">Review your selections before completing your order.</p>

        {ready && items.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-xl text-[#353535]">Your cart is empty.</p>
            <Link href="/products" className="mt-4 inline-block underline text-lg">
              ← Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 flex flex-col lg:flex-row gap-10 lg:gap-[97px] items-start">
            {/* Items */}
            <section className="w-full lg:flex-1">
              <div className="hidden sm:grid grid-cols-[1fr_128px_32px_118px] gap-6 text-xl sm:text-2xl tracking-[0.15em] text-ink pb-2 border-b border-gold">
                <span>PRODUCT</span>
                <span className="text-center">QUANTITY</span>
                <span />
                <span className="text-right">TOTAL</span>
              </div>

              <ul>
                {items.map((item) => {
                  const id = item.product.productID;
                  return (
                    <li
                      key={`${id}-${item.size ?? ""}`}
                      className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_128px_32px_118px] gap-4 sm:gap-6 items-center py-6 border-b border-gold/40"
                    >
                      <div className="flex items-start gap-2 col-span-2 sm:col-span-1">
                        <div className="relative size-24 sm:size-32 shrink-0 overflow-hidden rounded-card border border-gold border-t-[3px]">
                          <Image src={item.product.imageUrl} alt={item.product.name} fill sizes="128px" className="object-cover" />
                        </div>
                        <div className="flex flex-col justify-between self-stretch py-2 text-[#353535]">
                          <Link href={`/products/${id}`} className="text-2xl sm:text-[32px] font-medium leading-tight hover:underline">
                            {item.product.name}
                          </Link>
                          <span className="font-light">{item.size ? `${item.size[0]}${item.size.slice(1).toLowerCase()} Size` : "Standard Size"}</span>
                        </div>
                      </div>

                      <div className="flex h-14 w-32 items-center border border-black/20">
                        <button
                          className="h-full w-10 flex items-center justify-center hover:bg-black/5"
                          aria-label={`Decrease ${item.product.name}`}
                          onClick={() => decreaseQuantity(id, item.size)}
                        >
                          <PiMinus />
                        </button>
                        <span className="flex-1 text-center" aria-live="polite">{item.quantity}</span>
                        <button
                          className="h-full w-10 flex items-center justify-center hover:bg-black/5 disabled:opacity-30"
                          aria-label={`Increase ${item.product.name}`}
                          disabled={item.product.stock !== undefined && item.quantity >= item.product.stock}
                          onClick={() => increaseQuantity(id, item.size)}
                        >
                          <PiPlus />
                        </button>
                      </div>

                      <button
                        className="text-[32px] justify-self-end sm:justify-self-center hover:text-gold"
                        aria-label={`Remove ${item.product.name}`}
                        onClick={() => removeItem(id, item.size)}
                      >
                        <PiTrash />
                      </button>

                      <p className="text-2xl sm:text-[32px] font-semibold text-[#353535] sm:text-right col-span-2 sm:col-span-1">
                        {money(item.product.price * item.quantity)}
                      </p>
                    </li>
                  );
                })}
              </ul>

              <Link href="/products" className="mt-8 inline-block text-2xl sm:text-[32px] tracking-[0.05em] underline">
                ← Continue Shopping
              </Link>
            </section>

            {/* Summary */}
            <OrderSummaryCard subtotal={subtotal} shipping={null} tax={tax} total={subtotal + tax}>
              <form
                className="mt-6 flex h-14 items-center border border-black/20 px-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  setPromoMessage(promo.trim() ? "Promo codes are coming soon." : "");
                }}
              >
                <label htmlFor="promo" className="sr-only">Promo code</label>
                <input
                  id="promo"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  placeholder="Promo Code"
                  className="flex-1 bg-transparent outline-none placeholder:text-placeholder"
                />
                <button type="submit" className="text-[#010101] hover:text-gold">APPLY</button>
              </form>
              {promoMessage && <p className="mt-2 text-sm text-[#353535]">{promoMessage}</p>}

              <Link
                href="/checkout"
                aria-disabled={items.length === 0}
                className={`mt-8 flex h-14 items-center justify-center bg-black text-light text-lg sm:text-xl tracking-[0.15em] hover:bg-ink ${items.length === 0 ? "pointer-events-none opacity-40" : ""}`}
              >
                PROCEED TO CHECKOUT →
              </Link>
            </OrderSummaryCard>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
