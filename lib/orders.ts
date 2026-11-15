import { getSupabase } from "@/lib/supabase";
import { OrderSummary } from "@/types/models";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Loads an order with the private token the buyer got when they placed it. */
export async function getOrderByToken(id: number, token: string): Promise<OrderSummary | null> {
  if (!Number.isInteger(id) || !UUID.test(token)) return null;
  const { data, error } = await getSupabase().rpc("get_order_by_token", { p_id: id, p_token: token });
  if (error || !data) return null;
  const o = data as OrderSummary;
  // numeric columns come back as strings from Postgres
  return {
    ...o,
    subtotal: Number(o.subtotal),
    shipping: Number(o.shipping),
    tax: Number(o.tax),
    total: Number(o.total),
    items: o.items.map((i) => ({ ...i, unitPrice: Number(i.unitPrice), lineTotal: Number(i.lineTotal) })),
  };
}
