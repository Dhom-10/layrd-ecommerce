import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { products as localProducts } from "@/lib/data";
import { Product } from "@/types/models";

/** Row shape of the "products" table in Supabase */
export interface ProductRow {
  id: number;
  name: string;
  price: number | string;
  tag: Product["tag"];
  description: string;
  long_description: string | null;
  image_url: string;
  category: Product["category"];
  flavors: Product["flavors"];
  pack_size: Product["packSize"];
  sizes: string[] | null;
  added_order: number;
  stock: number;
}

const COLUMNS =
  "id, name, price, tag, description, long_description, image_url, category, flavors, pack_size, sizes, added_order, stock";

export function rowToProduct(row: ProductRow): Product {
  return {
    productID: row.id,
    name: row.name,
    price: Number(row.price),
    tag: row.tag,
    description: row.description,
    longDescription: row.long_description ?? undefined,
    imageUrl: row.image_url,
    category: row.category,
    flavors: row.flavors,
    packSize: row.pack_size,
    sizes: row.sizes ?? undefined,
    addedOrder: row.added_order,
    stock: row.stock,
  };
}

/** All active products from the database. Falls back to the local list if the database is unreachable. */
export async function fetchProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) return localProducts;
  const { data, error } = await getSupabase().from("products").select(COLUMNS).eq("active", true).order("added_order");
  if (error || !data) {
    console.error("Could not load products from Supabase, using local data:", error?.message);
    return localProducts;
  }
  return (data as ProductRow[]).map(rowToProduct);
}

export async function fetchProduct(id: number): Promise<Product | undefined> {
  if (!Number.isInteger(id)) return undefined;
  if (!isSupabaseConfigured) return localProducts.find((p) => p.productID === id);
  const { data, error } = await getSupabase().from("products").select(COLUMNS).eq("id", id).eq("active", true).maybeSingle();
  if (error) {
    console.error("Could not load product from Supabase, using local data:", error.message);
    return localProducts.find((p) => p.productID === id);
  }
  return data ? rowToProduct(data as ProductRow) : undefined;
}
