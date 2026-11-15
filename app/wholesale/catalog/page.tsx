"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { PiSignOut } from "react-icons/pi";
import { signOut, useAccount } from "@/lib/auth";
import { money, roundCents, TAX_RATE } from "@/lib/pricing";
import { getSupabase } from "@/lib/supabase";
import { Category, Flavor } from "@/types/models";

interface WholesaleProduct {
  id: number;
  name: string;
  description: string;
  image_url: string;
  category: Category;
  flavors: Flavor[];
  pack_size: string;
  price: number;
  wholesale_price: number;
  wholesale_min_qty: number;
  stock: number;
}

const CATEGORIES: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "All products" },
  { value: "bundles", label: "Bundles" },
  { value: "cakes", label: "Cake in a can" },
  { value: "coffee", label: "Espresso shots" },
];
const FLAVORS: Flavor[] = ["fruity", "cookie", "chocolatey", "classic", "creamy"];

export default function WholesaleCatalogPage() {
  const router = useRouter();
  const { account, loading } = useAccount();
  const [products, setProducts] = useState<WholesaleProduct[]>([]);
  const [category, setCategory] = useState<Category | "all">("all");
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const allowed = account?.role === "wholesale" || account?.role === "admin";

  useEffect(() => {
    if (!loading && !allowed) router.replace("/wholesale/login");
  }, [loading, allowed, router]);

  useEffect(() => {
    if (!allowed) return;
    getSupabase()
      .rpc("get_wholesale_catalog")
      .then(({ data, error }) => {
        if (error) return setError(error.message);
        setProducts(
          (data as WholesaleProduct[]).map((p) => ({ ...p, price: Number(p.price), wholesale_price: Number(p.wholesale_price) }))
        );
      });
  }, [allowed]);

  const visible = products.filter(
    (p) => (category === "all" || p.category === category) && (flavors.length === 0 || p.flavors.some((f) => flavors.includes(f)))
  );

  const lines = useMemo(
    () => products.filter((p) => (quantities[p.id] ?? 0) > 0).map((p) => ({ product: p, qty: quantities[p.id] })),
    [products, quantities]
  );
  const subtotal = lines.reduce((s, l) => s + l.product.wholesale_price * l.qty, 0);
  const tax = roundCents(subtotal * TAX_RATE);

  function setQty(p: WholesaleProduct, value: number) {
    const qty = Math.max(0, Math.min(p.stock, Math.floor(value) || 0));
    setQuantities((q) => ({ ...q, [p.id]: qty }));
  }

  async function placeOrder(e: FormEvent) {
    e.preventDefault();
    setError("");
    const belowMin = lines.find((l) => l.qty < l.product.wholesale_min_qty);
    if (belowMin) return setError(`${belowMin.product.name}: the wholesale minimum is ${belowMin.product.wholesale_min_qty}.`);
    if (!account) return;
    setBusy(true);
    const { data, error } = await getSupabase().rpc("place_order", {
      p_customer: {
        name: account.businessName ?? account.fullName ?? account.email,
        email: account.email,
        phone,
        address,
        city: "Calgary",
        province: "AB",
      },
      p_items: lines.map((l) => ({ productId: l.product.id, quantity: l.qty })),
      p_delivery: "delivery",
    });
    setBusy(false);
    if (error) return setError(error.message);
    const order = data as { id: number; token: string };
    // Wholesale partners are invoiced (net 30), so the order goes straight to the admin as unpaid
    router.push(`/order/${order.id}?token=${order.token}`);
  }

  if (loading || !allowed) {
    return <main className="min-h-screen bg-[#1c1c1c] text-light flex items-center justify-center">Loading…</main>;
  }

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-light">
      <header className="h-[93px] border-b border-gold/60 px-6 sm:px-10 flex items-center gap-10">
        <Link href="/wholesale/catalog" className="flex items-baseline gap-4">
          <span className="text-[32px] font-semibold tracking-[0.1em] text-gold">LÄYRD</span>
          <span className="text-gold tracking-[0.1em]">wholesale</span>
        </Link>
        <nav className="hidden md:flex gap-16 font-semibold tracking-[0.1em]">
          <span className="opacity-50" title="Coming in Sprint 3">Dashboard</span>
          <span className="text-gold underline">Catalog</span>
          <span className="opacity-50" title="Coming in Sprint 3">Orders</span>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <span className="hidden sm:block">{account.businessName ?? account.email}</span>
          <button
            onClick={async () => { await signOut(); router.replace("/wholesale/login"); }}
            aria-label="Sign out"
            className="text-2xl hover:text-gold"
          >
            <PiSignOut />
          </button>
        </div>
      </header>

      <main className="px-6 sm:px-[69px] py-8">
        <h1 className="text-[32px] tracking-[0.15em] text-gold">Shop all</h1>

        <div className="mt-6 flex flex-col lg:flex-row gap-10 items-start">
          {/* Filters */}
          <aside className="w-full lg:w-[245px] shrink-0 bg-[#3a3a3a] border border-white/20 rounded px-6 py-6">
            <h2 className="text-xl">Filters</h2>
            <p className="mt-3 text-gold text-xs tracking-[0.1em]">CATEGORY</p>
            <ul className="mt-2 flex flex-col gap-2 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.value}>
                  <button onClick={() => setCategory(c.value)} className={category === c.value ? "text-gold underline" : "hover:underline"}>
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-gold text-xs tracking-[0.1em]">FLAVOUR</p>
            <ul className="mt-3 flex flex-col gap-3">
              {FLAVORS.map((f) => (
                <li key={f}>
                  <label className="flex items-center gap-3 capitalize cursor-pointer">
                    <input
                      type="checkbox"
                      checked={flavors.includes(f)}
                      onChange={() => setFlavors((list) => (list.includes(f) ? list.filter((x) => x !== f) : [...list, f]))}
                      className="size-5 accent-gold"
                    />
                    {f}
                  </label>
                </li>
              ))}
            </ul>
          </aside>

          {/* Products */}
          <section className="flex-1 grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {visible.map((p) => (
              <article key={p.id} className="bg-white text-ink rounded-card border-2 border-gold overflow-hidden flex flex-col">
                <div className="relative aspect-square">
                  <Image src={p.image_url} alt={p.name} fill sizes="(min-width: 1280px) 280px, 50vw" className="object-cover" />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg tracking-[0.1em]">{p.name}</h3>
                  <p className="text-xs mt-1">{p.description}</p>
                  <div className="mt-auto pt-3 flex items-end justify-between gap-2">
                    <div>
                      <p className="text-gold text-sm tracking-[0.05em] whitespace-nowrap">{money(p.wholesale_price)} / unit</p>
                      <p className="text-xs text-placeholder line-through">{money(p.price)} retail</p>
                      <p className="text-xs">Min. {p.wholesale_min_qty}</p>
                    </div>
                    <label className="flex flex-col items-end text-xs">
                      Qty
                      <input
                        type="number"
                        min={0}
                        max={p.stock}
                        step={1}
                        value={quantities[p.id] ?? 0}
                        onChange={(e) => setQty(p, Number(e.target.value))}
                        className="mt-1 w-20 h-9 bg-black text-light text-center"
                        aria-label={`Quantity of ${p.name}`}
                      />
                    </label>
                  </div>
                </div>
              </article>
            ))}
            {visible.length === 0 && !error && <p className="text-light/60">Loading products…</p>}
          </section>

          {/* Order panel */}
          <form onSubmit={placeOrder} className="w-full lg:w-[300px] shrink-0 bg-[#3a3a3a] border border-gold/60 rounded p-5 lg:sticky lg:top-6">
            <h2 className="text-xl tracking-[0.05em]">Wholesale Order</h2>
            {lines.length === 0 ? (
              <p className="mt-3 text-sm text-light/60">Add quantities to start an order.</p>
            ) : (
              <ul className="mt-3 flex flex-col gap-1 text-sm">
                {lines.map((l) => (
                  <li key={l.product.id} className="flex justify-between gap-2">
                    <span>{l.qty} × {l.product.name}</span>
                    <span>{money(l.product.wholesale_price * l.qty)}</span>
                  </li>
                ))}
              </ul>
            )}
            <dl className="mt-4 text-sm flex flex-col gap-1 border-t border-white/20 pt-3">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
              <div className="flex justify-between"><dt>Delivery</dt><dd>Free</dd></div>
              <div className="flex justify-between"><dt>GST</dt><dd>{money(tax)}</dd></div>
              <div className="flex justify-between text-lg font-semibold text-gold"><dt>Total</dt><dd>{money(subtotal + tax)}</dd></div>
            </dl>
            <label className="mt-4 block text-xs text-gold tracking-[0.1em]" htmlFor="ws-address">DELIVERY ADDRESS</label>
            <input id="ws-address" required value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 w-full h-10 bg-[#1c1c1c] border border-white/20 px-3" placeholder="Business address" />
            <label className="mt-3 block text-xs text-gold tracking-[0.1em]" htmlFor="ws-phone">PHONE</label>
            <input id="ws-phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full h-10 bg-[#1c1c1c] border border-white/20 px-3" placeholder="Optional" />
            {error && <p role="alert" className="mt-3 text-sm bg-red-900/40 border border-red-500/60 px-3 py-2">{error}</p>}
            <button
              type="submit"
              disabled={busy || lines.length === 0}
              className="mt-4 w-full h-12 bg-gold text-ink font-semibold tracking-[0.1em] disabled:opacity-40"
            >
              {busy ? "PLACING…" : "PLACE ORDER (INVOICE)"}
            </button>
            <p className="mt-2 text-xs text-light/60">Partners are invoiced. No card needed.</p>
          </form>
        </div>
      </main>
    </div>
  );
}
