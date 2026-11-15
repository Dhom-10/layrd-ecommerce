import { fetchProduct } from "@/lib/products";

// GET /api/products/:id  ->  one product, or 404
export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const product = await fetchProduct(Number(id));
  if (!product) return Response.json({ error: "Product not found" }, { status: 404 });
  return Response.json({ product });
}
