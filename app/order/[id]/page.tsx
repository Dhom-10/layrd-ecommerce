import Link from "next/link";
import Stripe from "stripe";
import { PiArrowUpRight } from "react-icons/pi";
import Header from "@/app/components/Header";
import Footer from "@/app/components/footer";
import OrderSummaryCard from "@/app/components/OrderSummaryCard";
import { getOrderByToken } from "@/lib/orders";
import { getSupabase } from "@/lib/supabase";
import { products as localProducts } from "@/lib/data";
import ClearCart from "./ClearCart";

/** When the customer comes back from Stripe, check the payment really went through before marking the order paid. */
async function confirmStripePayment(orderId: number, token: string, sessionId: string) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return;
  try {
    const session = await new Stripe(secret).checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid" && session.metadata?.order_id === String(orderId)) {
      await getSupabase().rpc("confirm_order_payment", { p_id: orderId, p_token: token, p_ref: session.id });
    }
  } catch (err) {
    console.error("Stripe session check failed", err);
  }
}

function deliveryWindow(createdAt: string) {
  const start = new Date(new Date(createdAt).getTime() + 45 * 60_000);
  const end = new Date(start.getTime() + 20 * 60_000);
  const fmt = (d: Date) => d.toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit", timeZone: "America/Edmonton" });
  return `Today, ${fmt(start)} - ${fmt(end)}`;
}

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string; session_id?: string }>;
}) {
  const { id } = await params;
  const { token = "", session_id } = await searchParams;
  const orderId = Number(id);

  if (session_id) await confirmStripePayment(orderId, token, session_id);
  const order = await getOrderByToken(orderId, token);

  if (!order) {
    return (
      <>
        <Header />
        <main className="flex-1 px-4 py-20 text-center">
          <h1 className="text-3xl font-bold">Order not found</h1>
          <p className="mt-2 text-[#353535]">Check the link from your confirmation, or contact us.</p>
          <Link href="/products" className="mt-6 inline-block underline">Return to shop</Link>
        </main>
        <Footer />
      </>
    );
  }

  const paid = order.paymentStatus !== "unpaid";
  const images = new Map(localProducts.map((p) => [p.productID, p.imageUrl]));

  return (
    <>
      <Header />
      {paid && <ClearCart />}
      <main className="flex-1 px-4 py-12 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-[56px] font-bold tracking-[0.05em] text-ink">
          {paid ? "Order Confirmed" : "Payment Pending"}
        </h1>
        <p className="mt-2 max-w-[482px] font-light text-[#353535]">
          {paid
            ? "Thank you for your order. We are preparing your selections with care."
            : "We saved your order but have not received the payment yet."}
        </p>
        {order.paymentStatus === "test_paid" && (
          <p className="mt-3 text-xs tracking-[0.1em] bg-announce/20 px-3 py-1 rounded">TEST MODE PAYMENT · NO MONEY CHARGED</p>
        )}

        <div className="mt-10 w-full max-w-[533px] grid grid-cols-2 border-y border-gold py-4 tracking-[0.05em]">
          <div className="border-r border-gold/60 px-2">
            <p className="text-ink">ORDER NUMBER</p>
            <p className="mt-3 font-medium text-gold">#{order.orderNumber}</p>
          </div>
          <div className="px-2">
            <p className="text-ink">{order.deliveryMethod === "delivery" ? "DoorDash Delivery Estimate" : "Pickup"}</p>
            <p className="mt-3 font-medium text-gold">
              {order.deliveryMethod === "delivery" ? deliveryWindow(order.createdAt) : "Ready in about 30 minutes"}
            </p>
          </div>
        </div>

        <div className="mt-5 text-left w-full flex justify-center">
          <OrderSummaryCard
            lines={order.items.map((i, n) => ({
              key: `${i.productId}-${n}`,
              name: i.name,
              detail: i.size ? `${i.size[0]}${i.size.slice(1).toLowerCase()} Size` : "Standard Size",
              quantity: i.quantity,
              lineTotal: i.lineTotal,
              imageUrl: i.productId ? images.get(i.productId) : undefined,
            }))}
            subtotal={order.subtotal}
            shipping={order.shipping}
            tax={order.tax}
            total={order.total}
          />
        </div>

        {order.deliveryMethod === "delivery" && (
          <span
            className="mt-5 flex h-14 w-full max-w-[369px] items-center justify-center gap-2 bg-black text-light text-lg sm:text-xl tracking-[0.15em] opacity-60 cursor-not-allowed"
            title="DoorDash tracking will be connected in a later sprint"
          >
            TRACK ON DOORDASH <PiArrowUpRight className="text-2xl" />
          </span>
        )}
        <Link
          href="/products"
          className="mt-5 flex h-14 w-full max-w-[369px] items-center justify-center bg-black/5 border border-black/50 text-ink text-lg sm:text-xl tracking-[0.15em] hover:bg-black/10"
        >
          RETURN TO SHOP
        </Link>
      </main>
      <Footer />
    </>
  );
}
