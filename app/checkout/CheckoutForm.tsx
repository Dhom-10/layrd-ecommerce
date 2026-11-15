"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { FaCcMastercard, FaCcVisa, FaApplePay, FaGooglePay, FaPaypal } from "react-icons/fa";
import { PiCreditCard, PiMapPinLine, PiStorefront } from "react-icons/pi";
import { SiDoordash } from "react-icons/si";
import OrderSummaryCard from "@/app/components/OrderSummaryCard";
import { useCart } from "@/context/CartContext";
import { useAccount } from "@/lib/auth";
import { roundCents, shippingFor, TAX_RATE } from "@/lib/pricing";
import { getSupabase } from "@/lib/supabase";
import { DeliveryMethod } from "@/types/models";

const PICKUP_ADDRESS = "123 St. NE, Calgary";
const TEST_CARD = "4242424242424242";

interface PlacedOrder {
  id: number;
  orderNumber: string;
  token: string;
  total: number;
}

export default function CheckoutForm({ stripeEnabled }: { stripeEnabled: boolean }) {
  const router = useRouter();
  const { items, ready, getTotal, clearCart } = useCart();

  const [form, setForm] = useState({
    email: "",
    phone: "",
    name: "",
    address: "",
    city: "Calgary",
    province: "AB",
    postalCode: "",
  });
  const [delivery, setDelivery] = useState<DeliveryMethod>("delivery");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { account } = useAccount();

  // Logged-in customers: fill in what we already know (the order is also linked to their account)
  useEffect(() => {
    if (!account) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- prefill once the account has loaded
    setForm((f) => ({ ...f, email: f.email || account.email, name: f.name || (account.fullName ?? "") }));
  }, [account]);

  const subtotal = getTotal();
  const shipping = shippingFor(subtotal, delivery) ?? 0;
  const tax = roundCents(subtotal * TAX_RATE);
  const total = roundCents(subtotal + shipping + tax);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validateTestCard() {
    const digits = card.number.replace(/\s/g, "");
    if (digits !== TEST_CARD) return "Test mode: use the card 4242 4242 4242 4242.";
    const match = card.expiry.match(/^(\d{2})\s*\/\s*(\d{2})$/);
    if (!match || Number(match[1]) < 1 || Number(match[1]) > 12) return "Enter the expiry as MM/YY.";
    const expires = new Date(2000 + Number(match[2]), Number(match[1])); // first day of the month after expiry
    if (expires <= new Date()) return "This card has expired.";
    if (!/^\d{3,4}$/.test(card.cvc)) return "Enter the 3 or 4 digit security code.";
    return "";
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (items.length === 0) return setError("Your cart is empty.");
    if (!stripeEnabled) {
      const cardError = validateTestCard();
      if (cardError) return setError(cardError);
    }

    setSubmitting(true);
    try {
      const supabase = getSupabase();
      const { data, error: orderError } = await supabase.rpc("place_order", {
        p_customer: { ...form, address: delivery === "delivery" ? form.address : PICKUP_ADDRESS },
        p_items: items.map((i) => ({ productId: i.product.productID, quantity: i.quantity, size: i.size ?? "" })),
        p_delivery: delivery,
      });
      if (orderError) throw new Error(orderError.message);
      const order = data as PlacedOrder;

      if (stripeEnabled) {
        const res = await fetch("/api/checkout/stripe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.id, token: order.token }),
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? "Could not start the payment.");
        window.location.href = body.url; // Stripe-hosted payment page
        return;
      }

      const { error: payError } = await supabase.rpc("confirm_order_payment", { p_id: order.id, p_token: order.token });
      if (payError) throw new Error(payError.message);
      clearCart();
      router.push(`/order/${order.id}?token=${order.token}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (ready && items.length === 0) {
    return (
      <main className="flex-1 px-4 py-20 text-center">
        <p className="text-xl">Your cart is empty.</p>
        <Link href="/products" className="mt-4 inline-block underline">← Continue Shopping</Link>
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 sm:px-[50px] py-6 max-w-[1440px] w-full mx-auto">
      <div className="flex flex-wrap justify-between gap-2">
        <Link href="/cart" className="underline tracking-[0.05em] text-ink">← Return to Cart</Link>
        {account ? (
          <span className="text-sm text-[#353535]">Logged in as {account.email}</span>
        ) : (
          <Link href="/login?next=/checkout" className="text-sm underline">Have an account? Log in</Link>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col lg:flex-row gap-10 lg:gap-[88px] items-start">
        <div className="w-full lg:flex-1 flex flex-col gap-8 max-w-[826px]">
          <Section title="Customer Information">
            <div className="grid sm:grid-cols-2 gap-6">
              <Field label="EMAIL ADDRESS" id="email" type="email" autoComplete="email" required value={form.email} onChange={(v) => update("email", v)} placeholder="john.doe@gmail.com" />
              <Field label="PHONE NUMBER" id="phone" type="tel" autoComplete="tel" value={form.phone} onChange={(v) => update("phone", v)} placeholder="+1 (123) 456-7890" />
            </div>
          </Section>

          <Section title="Delivery Method">
            <div className="grid sm:grid-cols-2 gap-6" role="radiogroup" aria-label="Delivery method">
              <MethodButton selected={delivery === "delivery"} onClick={() => setDelivery("delivery")} icon={<PiMapPinLine />} title="Ship to Address">
                <span className="flex items-center gap-1 tracking-[0.1em]">
                  POWERED BY <SiDoordash className="text-[#eb1700] text-2xl" /> <span className="font-medium text-xl tracking-[0.05em]">DoorDash</span>
                </span>
              </MethodButton>
              <MethodButton selected={delivery === "pickup"} onClick={() => setDelivery("pickup")} icon={<PiStorefront />} title="Pickup">
                <span className="tracking-[0.1em]">Pickup at 123 St. NE</span>
              </MethodButton>
            </div>
          </Section>

          {delivery === "delivery" && (
            <Section title="Delivery Information">
              <div className="grid sm:grid-cols-2 gap-6">
                <Field label="FULL NAME" id="name" autoComplete="name" required value={form.name} onChange={(v) => update("name", v)} placeholder="John Doe" />
                <Field label="STREET ADDRESS" id="address" autoComplete="street-address" required value={form.address} onChange={(v) => update("address", v)} placeholder="456, Example Ave, SE" />
              </div>
              <div className="mt-4 grid sm:grid-cols-[276px_1fr_1fr] gap-6">
                <Field label="CITY" id="city" autoComplete="address-level2" required value={form.city} onChange={(v) => update("city", v)} />
                <Field label="PROVINCE" id="province" autoComplete="address-level1" required value={form.province} onChange={(v) => update("province", v)} />
                <Field label="POSTAL CODE" id="postal" autoComplete="postal-code" required value={form.postalCode} onChange={(v) => update("postalCode", v)} placeholder="T2X 1A1" />
              </div>
            </Section>
          )}
          {delivery === "pickup" && (
            <Section title="Pickup Information">
              <Field label="FULL NAME" id="name" autoComplete="name" required value={form.name} onChange={(v) => update("name", v)} placeholder="John Doe" />
            </Section>
          )}

          <Section title="Payment Details">
            {stripeEnabled ? (
              <div className="border border-gold px-6 py-6 flex items-center justify-between gap-4">
                <span className="flex items-center gap-3 text-xl sm:text-2xl font-light tracking-[0.05em]"><PiCreditCard className="text-3xl" /> Credit/ Debit Card</span>
                <span className="text-sm text-[#353535]">You will pay securely on Stripe after you click Complete Order.</span>
              </div>
            ) : (
              <div className="border border-gold px-[10px] py-[25px]">
                <div className="flex items-center justify-between gap-4 px-1">
                  <span className="flex items-center gap-3 text-xl sm:text-2xl font-light tracking-[0.05em] text-black">
                    <PiCreditCard className="text-3xl" /> Credit/ Debit Card
                  </span>
                  <span className="flex gap-3 text-[40px]"><FaCcVisa className="text-[#1434cb]" /><FaCcMastercard className="text-[#f79e1b]" /></span>
                </div>
                <p className="mt-3 px-1 text-sm bg-announce/20 py-2 rounded">
                  <strong>TEST MODE:</strong> no real money is charged. Use card 4242 4242 4242 4242, any future date and any CVC.
                </p>
                <div className="mt-4 grid sm:grid-cols-[1fr_190px_135px] gap-4">
                  <Field label="CARD NUMBER" id="card" inputMode="numeric" autoComplete="cc-number" required value={card.number} onChange={(v) => setCard((c) => ({ ...c, number: v }))} placeholder="0000 0000 0000 0000" small />
                  <Field label="EXPIRATION" id="exp" autoComplete="cc-exp" required value={card.expiry} onChange={(v) => setCard((c) => ({ ...c, expiry: v }))} placeholder="MM/YY" small />
                  <Field label="SECURITY CODE" id="cvc" inputMode="numeric" autoComplete="cc-csc" required value={card.cvc} onChange={(v) => setCard((c) => ({ ...c, cvc: v }))} placeholder="CVC" small />
                </div>
              </div>
            )}
            <ul className="mt-4 flex flex-col gap-4" aria-label="Other payment methods (coming soon)">
              <WalletRow label="Apple Pay" icon={<FaApplePay className="text-5xl" />} />
              <WalletRow label="Google Pay" icon={<FaGooglePay className="text-5xl" />} />
              <WalletRow label="PayPal" icon={<FaPaypal className="text-3xl text-[#179bd7]" />} />
            </ul>
          </Section>
        </div>

        <div className="w-full lg:w-auto lg:sticky lg:top-6">
          <OrderSummaryCard
            lines={items.map((i) => ({
              key: `${i.product.productID}-${i.size ?? ""}`,
              name: i.product.name,
              detail: i.size ? `${i.size[0]}${i.size.slice(1).toLowerCase()} Size` : "Standard Size",
              quantity: i.quantity,
              lineTotal: i.product.price * i.quantity,
              imageUrl: i.product.imageUrl,
            }))}
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
          >
            {error && (
              <p role="alert" className="mt-5 text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">{error}</p>
            )}
            <button
              type="submit"
              disabled={submitting || !ready}
              className="mt-6 flex h-14 w-full items-center justify-center bg-black text-light text-lg sm:text-xl tracking-[0.15em] hover:bg-ink disabled:opacity-50"
            >
              {submitting ? "PLACING ORDER…" : "COMPLETE ORDER"}
            </button>
          </OrderSummaryCard>
        </div>
      </form>
    </main>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl sm:text-[32px] font-medium tracking-[0.05em] text-[#353535] pb-2 border-b border-gold/60">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

interface FieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "numeric" | "text";
  small?: boolean;
}

function Field({ label, id, value, onChange, type = "text", placeholder, required, autoComplete, inputMode, small }: FieldProps) {
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={id} className={small ? "font-medium text-black" : "text-xl sm:text-2xl text-[#353535]"}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-14 border border-black/20 px-5 text-ink placeholder:text-placeholder outline-none focus:border-gold"
      />
    </div>
  );
}

function MethodButton({ selected, onClick, icon, title, children }: { selected: boolean; onClick: () => void; icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`h-[180px] flex flex-col items-center justify-center gap-2 border text-ink transition-colors ${selected ? "border-gold border-2 bg-gold/5" : "border-black hover:border-gold"}`}
    >
      <span className="text-[32px]">{icon}</span>
      <span>{title}</span>
      {children}
    </button>
  );
}

function WalletRow({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <li className="flex h-16 items-center justify-between border border-ink px-[25px] opacity-60" title="Coming soon">
      <span className="text-2xl sm:text-[32px] font-medium text-ink">{label} <span className="text-sm font-normal align-middle">(coming soon)</span></span>
      <span className="bg-white rounded-md px-3 shadow-sm flex items-center">{icon}</span>
    </li>
  );
}
