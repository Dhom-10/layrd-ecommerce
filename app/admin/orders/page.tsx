"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import {
  PiArrowClockwise, PiChartBar, PiCube, PiGear, PiGift, PiIdentificationCard, PiMagnifyingGlass,
  PiMoney, PiSignOut, PiSquaresFour, PiStorefront, PiTag, PiTote, PiWarning,
} from "react-icons/pi";
import { signOut, useAccount } from "@/lib/auth";
import { money } from "@/lib/pricing";
import { getSupabase } from "@/lib/supabase";
import { OrderStatus, PaymentStatus } from "@/types/models";

interface AdminOrder {
  id: number;
  order_number: string;
  created_at: string;
  customer_name: string;
  email: string;
  phone: string | null;
  delivery_method: "delivery" | "pickup";
  address: string | null;
  city: string | null;
  is_wholesale: boolean;
  total: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  order_items: { product_name: string; size: string | null; quantity: number; line_total: number }[];
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "Pending Payment",
  processing: "Processing",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending_payment: "text-[#e04848]",
  processing: "text-gold",
  out_for_delivery: "text-white underline font-semibold",
  delivered: "text-light font-semibold",
  cancelled: "text-placeholder line-through",
};

const NAV = [
  { label: "Dashboard", icon: PiSquaresFour },
  { label: "Products", icon: PiCube },
  { label: "Bundles", icon: PiGift },
  { label: "Orders", icon: PiTote, active: true },
  { label: "Customers", icon: PiIdentificationCard },
  { label: "Promotions", icon: PiTag },
  { label: "Analytics", icon: PiChartBar },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const time = d.toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" });
  if (d.toDateString() === today.toDateString()) return `Today, ${time}`;
  const yesterday = new Date(today.getTime() - 86_400_000);
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`;
  return `${d.toLocaleDateString("en-CA")}, ${time}`;
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const { account, loading } = useAccount();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [openId, setOpenId] = useState<number | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);

  const isAdmin = account?.role === "admin";

  useEffect(() => {
    if (!loading && !isAdmin) router.replace("/admin/login");
  }, [loading, isAdmin, router]);

  const loadOrders = useCallback(async () => {
    setError("");
    const { data, error } = await getSupabase()
      .from("orders")
      .select(
        "id, order_number, created_at, customer_name, email, phone, delivery_method, address, city, is_wholesale, total, status, payment_status, order_items(product_name, size, quantity, line_total)"
      )
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) setError(error.message);
    else setOrders((data as AdminOrder[]).map((o) => ({ ...o, total: Number(o.total) })));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch once we know the user is an admin
    if (isAdmin) loadOrders();
  }, [isAdmin, loadOrders]);

  async function updateStatus(order: AdminOrder, status: OrderStatus) {
    setSavingId(order.id);
    const { error } = await getSupabase().from("orders").update({ status }).eq("id", order.id);
    setSavingId(null);
    if (error) return setError(`Could not update ${order.order_number}: ${error.message}`);
    setOrders((list) => list.map((o) => (o.id === order.id ? { ...o, status } : o)));
  }

  const stats = useMemo(() => {
    const paid = orders.filter((o) => o.payment_status !== "unpaid" && o.status !== "cancelled");
    return {
      revenue: paid.reduce((sum, o) => sum + o.total, 0),
      total: orders.length,
      toFulfil: orders.filter((o) => o.status === "processing" || o.status === "out_for_delivery").length,
      wholesale: orders.filter((o) => o.is_wholesale).length,
    };
  }, [orders]);

  const visible = orders.filter((o) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || o.order_number.toLowerCase().includes(q) || o.customer_name.toLowerCase().includes(q) || o.email.includes(q);
    return matchesSearch && (statusFilter === "all" || o.status === statusFilter);
  });

  const alerts = orders.filter((o) => o.status === "pending_payment").slice(0, 3);

  if (loading || !isAdmin) {
    return <main className="min-h-screen bg-[#1c1c1c] text-light flex items-center justify-center">Loading…</main>;
  }

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-light flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-[270px] shrink-0 flex-col border-r border-gold/60 px-8 py-6">
        <p className="text-[32px] tracking-[0.12em] text-gold">LÄYRD</p>
        <p className="mt-2 text-lg tracking-[0.05em]">Admin Dashboard</p>
        <span className="mt-4 h-10 rounded bg-gold text-ink text-xs flex items-center justify-center opacity-60" title="Coming in Sprint 3">
          + Create New Product
        </span>
        <nav className="mt-8 flex flex-col gap-6 text-lg tracking-[0.05em]">
          {NAV.map(({ label, icon: Icon, active }) => (
            <span
              key={label}
              className={`flex items-center gap-4 ${active ? "text-gold underline" : "opacity-60"}`}
              title={active ? undefined : "Coming in Sprint 3"}
            >
              <Icon className="text-[28px]" /> {label}
            </span>
          ))}
        </nav>
        <div className="mt-auto border-t border-gold/60 pt-6 flex flex-col gap-4 text-lg">
          <span className="flex items-center gap-4 opacity-60"><PiGear className="text-[28px]" /> Settings</span>
          <button
            onClick={async () => { await signOut(); router.replace("/admin/login"); }}
            className="flex items-center gap-4 text-[#e04848] hover:underline"
          >
            <PiSignOut className="text-[28px]" /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="h-[90px] border-b border-gold/60 px-6 lg:px-8 flex items-center gap-6">
          <label className="flex items-center gap-3 bg-[#4b4b4b] px-4 h-12 w-full max-w-[355px]">
            <PiMagnifyingGlass className="text-xl" aria-hidden />
            <span className="sr-only">Search orders</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders, customers…"
              className="flex-1 bg-transparent outline-none placeholder:text-light/70"
            />
          </label>
          <p className="hidden md:block text-[32px] font-semibold tracking-[0.1em] text-gold">LÄYRD Admin</p>
          <p className="ml-auto text-sm truncate">{account.fullName ?? account.email}</p>
        </header>

        <main className="px-6 lg:px-11 py-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-[40px] tracking-[0.05em] text-light/90">Orders</h1>
              <p className="text-light/50 tracking-[0.05em]">View and manage orders</p>
            </div>
            <button onClick={loadOrders} className="flex items-center gap-2 border border-gold/60 px-4 h-10 hover:bg-white/5">
              <PiArrowClockwise /> Refresh
            </button>
          </div>

          {error && <p role="alert" className="mt-4 bg-red-900/40 border border-red-500/60 px-4 py-2">{error}</p>}

          <section className="mt-8 grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard label="REVENUE" value={money(stats.revenue)} icon={<PiMoney />} note="Paid orders" />
            <StatCard label="TOTAL ORDERS" value={String(stats.total)} icon={<PiTote />} note="All time" />
            <StatCard label="TO FULFIL" value={String(stats.toFulfil)} icon={<PiTote />} note="Processing or out for delivery" />
            <StatCard label="WHOLESALE ORDERS" value={String(stats.wholesale)} icon={<PiStorefront />} note="From partner portal" />
          </section>

          <div className="mt-8 flex flex-col xl:flex-row gap-6 items-start">
            <section className="flex-1 min-w-0 w-full bg-[#3a3a3a] border border-gold/60 rounded">
              <div className="flex items-center justify-between px-6 py-6">
                <h2 className="text-2xl tracking-[0.05em]">RECENT ORDERS</h2>
                <label className="text-sm flex items-center gap-2">
                  <span className="text-gold">STATUS</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
                    className="bg-[#1c1c1c] border border-gold/60 px-2 py-1"
                  >
                    <option value="all">All</option>
                    {Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#2a2a2a] text-left text-base">
                    <tr>
                      <th className="px-6 py-3 font-medium">Order ID</th>
                      <th className="px-4 py-3 font-medium">Customer</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.length === 0 && (
                      <tr><td colSpan={5} className="px-6 py-10 text-center text-light/60">No orders yet.</td></tr>
                    )}
                    {visible.map((o) => (
                      <Fragment key={o.id}>
                        <tr className="border-t border-white/10 even:bg-white/[0.03] hover:bg-white/5">
                          <td className="px-6 py-3">
                            <button onClick={() => setOpenId(openId === o.id ? null : o.id)} className="hover:underline" aria-expanded={openId === o.id}>
                              #{o.is_wholesale ? o.order_number.replace("ORD-", "ORD-W-") : o.order_number}
                            </button>
                          </td>
                          <td className={`px-4 py-3 ${o.is_wholesale ? "underline font-semibold" : ""}`}>{o.customer_name}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{formatDate(o.created_at)}</td>
                          <td className="px-4 py-3">
                            <label className="sr-only" htmlFor={`status-${o.id}`}>Status for {o.order_number}</label>
                            <select
                              id={`status-${o.id}`}
                              value={o.status}
                              disabled={savingId === o.id}
                              onChange={(e) => updateStatus(o, e.target.value as OrderStatus)}
                              className={`bg-transparent cursor-pointer ${STATUS_COLORS[o.status]}`}
                            >
                              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                                <option key={value} value={value} className="bg-[#1c1c1c] text-light no-underline">{label}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3 text-right">{money(o.total)}</td>
                        </tr>
                        {openId === o.id && (
                          <tr className="bg-black/30">
                            <td colSpan={5} className="px-6 py-4">
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-gold text-xs tracking-[0.1em]">ITEMS</p>
                                  <ul className="mt-2 flex flex-col gap-1">
                                    {o.order_items.map((i, n) => (
                                      <li key={n} className="flex justify-between gap-4">
                                        <span>{i.quantity} × {i.product_name}{i.size ? ` (${i.size})` : ""}</span>
                                        <span>{money(Number(i.line_total))}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="text-light/80">
                                  <p className="text-gold text-xs tracking-[0.1em]">CUSTOMER</p>
                                  <p className="mt-2">{o.email}{o.phone ? ` · ${o.phone}` : ""}</p>
                                  <p>{o.delivery_method === "delivery" ? `Delivery to ${o.address ?? ""}${o.city ? `, ${o.city}` : ""}` : "Pickup"}</p>
                                  <p>Payment: {o.payment_status === "test_paid" ? "Paid (test mode)" : o.payment_status === "paid" ? "Paid (Stripe)" : "Not paid"}</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <aside className="w-full xl:w-[245px] bg-[#3a3a3a] border border-gold/60 rounded p-4">
              <h2 className="flex items-center gap-2 text-xl tracking-[0.05em]"><PiWarning className="text-[#e04848]" /> Priority Alerts</h2>
              {alerts.length === 0 ? (
                <p className="mt-4 text-sm text-light/60">Nothing needs attention.</p>
              ) : (
                <ul className="mt-4 flex flex-col gap-3">
                  {alerts.map((o) => (
                    <li key={o.id} className="bg-[#2a2a2a] border border-white/10 p-2 text-xs">
                      <p className="text-sm text-[#e04848]">Payment not received</p>
                      <p className="mt-1">{o.customer_name} started order #{o.order_number} ({money(o.total)}) but did not finish paying.</p>
                      <button onClick={() => { setSearch(o.order_number); setOpenId(o.id); }} className="mt-1 text-gold underline">Review</button>
                    </li>
                  ))}
                </ul>
              )}
              <Link href="/" className="mt-6 block text-sm text-gold underline">View store →</Link>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, note }: { label: string; value: string; icon: React.ReactNode; note: string }) {
  return (
    <div className="bg-[#3a3a3a] border border-gold/60 rounded px-5 py-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold tracking-[0.05em]">{label}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="mt-2 text-[32px] font-semibold">{value}</p>
      <p className="mt-2 text-xs text-light/70">{note}</p>
    </div>
  );
}
