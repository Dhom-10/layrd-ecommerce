"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/footer";
import { CgTrash } from "react-icons/cg";

export default function CartPage() {
  const { items, getTotal, removeItem, increaseQuantity, decreaseQuantity } = useCart();

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="px-8 py-20 max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-extrabold tracking-wide">YOUR CART</h1>
          <p className="text-gray mt-4">Your cart is empty.</p>
          <Link href="/products" className="underline text-sm mt-4 inline-block">
            Browse products
          </Link>
        </main>
      </>
    );
  }

  const subtotal = getTotal();
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <>
      <Header />

      <main className="px-8 py-10 max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-wide mb-2">YOUR CART</h1>
        <p className="text-gray text-sm mb-8">
          Review your selections before completing your order.
        </p>

        <div className="flex gap-12 items-start">
          {/* Line items */}
          <div className="flex-1">
            <div className="flex justify-between border-b border-border pb-2 text-xs font-semibold tracking-wide text-gray">
              <span>PRODUCT</span>
              <span>QUANTITY</span>
              <span>TOTAL</span>
            </div>

            {items.map((item) => (
              <div
                key={`${item.product.productID}-${item.size ?? ""}`}
                className="flex items-center justify-between border-b border-border py-4"
              >
                <div className="flex items-center gap-4 w-1/3">
                  <div className="w-16 h-16 bg-gray-100 flex-shrink-0">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{item.product.name}</p>
                    {item.size && <p className="text-xs text-gray">Size: {item.size}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => decreaseQuantity(item.product.productID, item.size)}
                    className="border border-border w-6 h-6 flex items-center justify-center text-sm"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="text-sm w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item.product.productID, item.size)}
                    className="border border-border w-6 h-6 flex items-center justify-center text-sm"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.product.productID, item.size)}
                    aria-label="Remove item"
                    className="text-lg text-gray hover:text-black ml-2"
                  >
                    <CgTrash />
                  </button>
                </div>

                <span className="font-semibold text-sm w-16 text-right">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <Link href="/products" className="text-sm underline text-gray mt-6 inline-block">
              ← Continue Shopping
            </Link>
          </div>

          {/* Order summary */}
          <div className="w-80 border border-gold p-6 flex-shrink-0">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray">Shipping</span>
              <span className="text-gray">Calculated at checkout</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-gray">Estimated Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div className="border-t border-border pt-4 flex justify-between items-center mb-6">
              <span className="text-lg font-bold">Total</span>
              <span className="text-lg font-bold">${total.toFixed(2)}</span>
            </div>

            <button className="w-full bg-black text-white py-3 text-sm tracking-wide">
              PROCEED TO CHECKOUT →
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}