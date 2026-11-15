import ProductDetails from "./ProductDetails";
import { fetchProduct } from "@/lib/products";

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await fetchProduct(Number(id));
  return <ProductDetails product={product} />;
}
