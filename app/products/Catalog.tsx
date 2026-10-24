"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { PiCaretDown } from "react-icons/pi";
import ProductTag from "@/app/components/ProductTag";
import { products } from "@/lib/data";
import { Category, Flavor, Product } from "@/types/models";

type SortOption = "newest" | "price-asc" | "price-desc" | "name";

const categoryOptions: { label: string; value: Category | "limited" }[] = [
  { label: "Cakes", value: "cakes" },
  { label: "Coffee", value: "coffee" },
  { label: "Bundles", value: "bundles" },
  { label: "Limited", value: "limited" },
];

const priceOptions = [
  { label: "Under $5", test: (p: number) => p < 5 },
  { label: "$6-15", test: (p: number) => p >= 5 && p <= 15 },
  { label: "$15+", test: (p: number) => p > 15 },
];

const sizeOptions: Product["packSize"][] = ["150ml", "100ml", "50ml", "4-Pack", "6+ Pack"];

const flavorOptions: { label: string; value: Flavor }[] = [
  { label: "Fruity", value: "fruity" },
  { label: "Cookie", value: "cookie" },
  { label: "Chocolatey", value: "chocolatey" },
  { label: "Classic", value: "classic" },
  { label: "Creamy", value: "creamy" },
];

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function Catalog({ initialCategory }: { initialCategory?: Category }) {
  const [categories, setCategories] = useState<(Category | "limited")[]>(initialCategory ? [initialCategory] : []);
  const [prices, setPrices] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [sort, setSort] = useState<SortOption>("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const visibleProducts = useMemo(() => {
    const min = minPrice === "" ? -Infinity : Number(minPrice);
    const max = maxPrice === "" ? Infinity : Number(maxPrice);

    const filtered = products.filter((p) => {
      const categoryMatch =
        categories.length === 0 ||
        categories.some((c) => (c === "limited" ? p.tag === "LIMITED" : p.category === c));
      const priceMatch =
        prices.length === 0 || priceOptions.some((o) => prices.includes(o.label) && o.test(p.price));
      const rangeMatch = p.price >= min && p.price <= max;
      const sizeMatch = sizes.length === 0 || sizes.includes(p.packSize);
      const flavorMatch = flavors.length === 0 || p.flavors.some((f) => flavors.includes(f));
      return categoryMatch && priceMatch && rangeMatch && sizeMatch && flavorMatch;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name);
      return a.addedOrder - b.addedOrder;
    });
  }, [categories, prices, minPrice, maxPrice, sizes, flavors, sort]);

  const hasFilters =
    categories.length + prices.length + sizes.length + flavors.length > 0 || minPrice !== "" || maxPrice !== "";

  function clearFilters() {
    setCategories([]);
    setPrices([]);
    setMinPrice("");
    setMaxPrice("");
    setSizes([]);
    setFlavors([]);
  }

  return (
    <main className="px-4 sm:px-10 py-10 md:py-12 max-w-[1440px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
        {/* Filters sidebar */}
        <aside className="lg:w-[300px] shrink-0">
          <button
            className="lg:hidden w-full border border-black py-2 text-sm font-medium tracking-[0.1em]"
            onClick={() => setFiltersOpen((o) => !o)}
            aria-expanded={filtersOpen}
          >
            {filtersOpen ? "HIDE FILTERS" : "SHOW FILTERS"}
          </button>

          <div className={`${filtersOpen ? "block" : "hidden"} lg:block mt-6 lg:mt-0`}>
            <FilterGroup title="Categories">
              {categoryOptions.map((o) => (
                <Checkbox
                  key={o.value}
                  label={o.label}
                  checked={categories.includes(o.value)}
                  onChange={() => setCategories((c) => toggle(c, o.value))}
                />
              ))}
            </FilterGroup>

            <FilterGroup title="Price">
              {priceOptions.map((o) => (
                <Checkbox
                  key={o.label}
                  label={o.label}
                  checked={prices.includes(o.label)}
                  onChange={() => setPrices((p) => toggle(p, o.label))}
                />
              ))}
              <div className="flex items-center gap-2 mt-1 pl-[37px]">
                <input
                  type="number"
                  min={0}
                  placeholder="Min"
                  aria-label="Minimum price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-16 h-6 bg-[#efefef] border border-black rounded-[2px] px-1 text-sm placeholder:text-placeholder"
                />
                <span>-</span>
                <input
                  type="number"
                  min={0}
                  placeholder="Max"
                  aria-label="Maximum price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-16 h-6 bg-[#efefef] border border-black rounded-[2px] px-1 text-sm placeholder:text-placeholder"
                />
              </div>
            </FilterGroup>

            <FilterGroup title="Size">
              {sizeOptions.map((s) => (
                <Checkbox key={s} label={s} checked={sizes.includes(s)} onChange={() => setSizes((v) => toggle(v, s))} />
              ))}
            </FilterGroup>

            <FilterGroup title="Flavor Profile">
              {flavorOptions.map((o) => (
                <Checkbox
                  key={o.value}
                  label={o.label}
                  checked={flavors.includes(o.value)}
                  onChange={() => setFlavors((f) => toggle(f, o.value))}
                />
              ))}
            </FilterGroup>

            {hasFilters && (
              <button onClick={clearFilters} className="text-sm underline tracking-[0.05em]">
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        {/* Product grid */}
        <section className="flex-1">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <h1 className="text-[32px] md:text-[48px] font-bold tracking-[0.15em] text-ink leading-none">
              OUR COLLECTION
            </h1>
            <div className="flex items-center gap-8 text-sm font-medium">
              <span className="text-[#636363]">Showing {visibleProducts.length} items</span>
              <label className="relative flex items-center gap-1 text-ink tracking-[0.05em]">
                SORT BY:
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="appearance-none bg-transparent pr-7 cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
                <PiCaretDown className="absolute right-0 text-2xl pointer-events-none" />
              </label>
            </div>
          </div>

          {visibleProducts.length === 0 ? (
            <p className="text-gray py-20 text-center">No products match these filters.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((product) => (
                <CatalogCard key={product.productID} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="mb-8">
      <legend className="text-[28px] md:text-[32px] font-medium tracking-[0.05em] text-black mb-2">{title}</legend>
      <div className="flex flex-col gap-1">{children}</div>
    </fieldset>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-[13px] text-xl md:text-2xl tracking-[0.05em] cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-6 appearance-none border border-black checked:bg-gold checked:border-gold cursor-pointer shrink-0"
      />
      {label}
    </label>
  );
}

function CatalogCard({ product }: { product: Product }) {
  return (
    <article className="flex flex-col rounded-card border-2 border-gold overflow-hidden bg-white">
      <Link href={`/products/${product.productID}`} className="relative block aspect-square">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 300px, (min-width: 640px) 50vw, 100vw"
          className="object-cover hover:scale-[1.03] transition-transform"
        />
        <ProductTag tag={product.tag} size="sm" />
      </Link>

      <div className="px-[27px] pt-4 pb-5 flex flex-col flex-1">
        <h2 className="text-base font-medium tracking-[0.15em] text-black">{product.name}</h2>
        <p className="text-xs font-light text-black mt-1 flex-1">{product.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-gold text-sm font-medium tracking-[0.15em]">FROM ${product.price}</span>
          <Link
            href={`/products/${product.productID}`}
            className="w-[125px] h-[28px] flex items-center justify-center bg-black text-light text-xs font-medium tracking-[0.15em] hover:bg-gold transition-colors"
          >
            Customize
          </Link>
        </div>
      </div>
    </article>
  );
}
