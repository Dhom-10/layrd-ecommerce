import { fetchProducts } from "@/lib/products";

// GET /api/products  ->  every active product
export async function GET() {
  const products = await fetchProducts();
  return Response.json({ products });
}
