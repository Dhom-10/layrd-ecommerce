import Header from "@/app/components/Header";
import Footer from "@/app/components/footer";
import Catalog from "./Catalog";
import { Category } from "@/types/models";

const validCategories: Category[] = ["cakes", "coffee", "bundles"];

export default async function ProductCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const initialCategory = validCategories.includes(category as Category) ? (category as Category) : undefined;

  return (
    <>
      <Header />
      {/* key resets the filters when the user clicks a different menu link */}
      <Catalog key={initialCategory ?? "all"} initialCategory={initialCategory} />
      <Footer />
    </>
  );
}
