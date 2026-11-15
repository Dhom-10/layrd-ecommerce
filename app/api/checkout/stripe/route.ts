import Stripe from "stripe";
import { getOrderByToken } from "@/lib/orders";

// POST /api/checkout/stripe  { orderId, token }  ->  { url } of a Stripe Checkout page
export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return Response.json({ error: "Stripe is not set up" }, { status: 501 });

  const { orderId, token } = await request.json().catch(() => ({}));
  const order = await getOrderByToken(Number(orderId), String(token ?? ""));
  if (!order) return Response.json({ error: "Order not found" }, { status: 404 });
  if (order.paymentStatus !== "unpaid") return Response.json({ error: "Order is already paid" }, { status: 409 });

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
  const cents = (n: number) => Math.round(n * 100);
  const extraLine = (name: string, amount: number) => ({
    quantity: 1,
    price_data: { currency: "cad", unit_amount: cents(amount), product_data: { name } },
  });

  // Amounts come from the saved order in the database, not from the browser
  const session = await new Stripe(secret).checkout.sessions.create({
    mode: "payment",
    line_items: [
      ...order.items.map((i) => ({
        quantity: i.quantity,
        price_data: {
          currency: "cad",
          unit_amount: cents(i.unitPrice),
          product_data: { name: i.size ? `${i.name} (${i.size})` : i.name },
        },
      })),
      ...(order.shipping > 0 ? [extraLine("Delivery", order.shipping)] : []),
      extraLine("GST (5%)", order.tax),
    ],
    metadata: { order_id: String(order.id) },
    success_url: `${site}/order/${order.id}?token=${token}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${site}/checkout`,
  });

  return Response.json({ url: session.url });
}
