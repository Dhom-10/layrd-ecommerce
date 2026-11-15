"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/footer";
import { signOut, useAccount } from "@/lib/auth";
import { money } from "@/lib/pricing";
import { getSupabase } from "@/lib/supabase";
import { OrderStatus } from "@/types/models";

interface MyOrder {
  id: number;
  order_number: string;
  created_at: string;
  total: number;
  status: OrderStatus;
  order_items: { product_name: string; quantity: number }[];
}

const STATUS: Record<OrderStatus, string> = {
  pending_payment: "Waiting for payment",
  processing: "Being prepared",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function AccountPage() {
  const router = useRouter();
  const { account, loading } = useAccount();
  const [orders, setOrders] = useState<MyOrder[] | null>(null);

  useEffect(() => {
    if (!loading && !account) router.replace("/login?next=/account");
  }, [loading, account, router]);

  useEffect(() => {
    if (!account) return;
    // Row Level Security only returns this customer's own orders
    getSupabase()
      .from("orders")
      .select("id, order_number, created_at, total, status, order_items(product_name, quantity)")
      .eq("user_id", account.userId)
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders(((data ?? []) as MyOrder[]).map((o) => ({ ...o, total: Number(o.total) }))));
  }, [account]);

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <>
      <Header />
      <main className="flex-1 px-4 sm:px-10 py-10 max-w-[1000px] w-full mx-auto">
        {!account ? (
          <p className="py-20 text-center">Loading…</p>
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-4xl sm:text-[56px] font-bold tracking-[0.1em] text-ink">My Account</h1>
                <p className="mt-1 font-light text-[#353535]">
                  {account.fullName ? `${account.fullName} · ` : ""}{account.email}
                </p>
              </div>
              <button onClick={handleSignOut} className="h-12 px-8 border border-black/50 tracking-[0.15em] hover:bg-black/5">
                LOG OUT
              </button>
            </div>

            {account.role !== "customer" && (
              <p className="mt-6 bg-gold/10 border border-gold px-4 py-3">
                You are signed in as {account.role}.{" "}
                <Link href={account.role === "admin" ? "/admin/orders" : "/wholesale/catalog"} className="underline">
                  Go to the {account.role === "admin" ? "admin dashboard" : "wholesale portal"}
                </Link>
              </p>
            )}

            <h2 className="mt-10 text-2xl sm:text-[32px] font-medium tracking-[0.05em] text-[#353535] pb-2 border-b border-gold/60">My Orders</h2>
            {orders === null ? (
              <p className="mt-6 text-[#353535]">Loading orders…</p>
            ) : orders.length === 0 ? (
              <p className="mt-6 text-[#353535]">
                No orders yet. <Link href="/products" className="underline">Start shopping</Link>
              </p>
            ) : (
              <ul className="mt-4">
                {orders.map((o) => (
                  <li key={o.id} className="py-4 border-b border-gold/30 flex flex-wrap justify-between gap-2">
                    <div>
                      <p className="font-medium text-gold">#{o.order_number}</p>
                      <p className="text-sm text-[#353535]">
                        {new Date(o.created_at).toLocaleDateString("en-CA")} · {o.order_items.map((i) => `${i.quantity} × ${i.product_name}`).join(", ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{money(o.total)}</p>
                      <p className="text-sm">{STATUS[o.status]}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
