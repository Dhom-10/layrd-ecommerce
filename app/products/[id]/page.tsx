"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { PiArrowRight, PiInfo, PiMinus, PiPackage, PiPlus } from "react-icons/pi";
import Header from "@/app/components/Header";
import Footer from "@/app/components/footer";
import { useCart } from "@/context/CartContext";
import { categoryLabels, getProductById } from "@/lib/data";

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const product = getProductById(Number(params.id));
  const { addItem } = useCart();

  const [size, setSize] = useState(product?.sizes?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <>
        <Header />
        <main className="px-4 sm:px-10 py-20 text-center">
          <p className="text-xl">Product not found.</p>
          <Link href="/products" className="underline mt-4 inline-block">
            Back to our collection
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const images = [product.imageUrl, ...(product.gallery ?? [])];

  function handleAddToBag() {
    if (!product) return;
    addItem(product, quantity, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <>
      <Header />

      <main className="px-4 sm:px-10 md:px-14 py-10 md:py-12 max-w-[1440px] mx-auto">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-base md:text-2xl font-medium tracking-[0.15em] text-ink">
          <Link href={`/products?category=${product.category}`} className="underline uppercase">
            {categoryLabels[product.category]}
          </Link>
          <span className="uppercase">{` > ${product.name}`}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,766px)_1fr] lg:gap-7">
          {/* Images */}
          <div>
            <div className="relative aspect-square rounded-card border border-gold overflow-hidden">
              <Image
                src={images[activeImage]}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 1024px) 766px, 100vw"
                className="object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-4 mt-4">
                {images.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setActiveImage(i)}
                    aria-label={`Show image ${i + 1}`}
                    className={`relative size-[123px] rounded-card border overflow-hidden ${
                      i === activeImage ? "border-black border-2" : "border-gold"
                    }`}
                  >
                    <Image src={src} alt="" fill sizes="123px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="max-w-[554px]">
            <h1 className="text-[36px] md:text-[56px] font-bold tracking-[0.15em] text-ink leading-tight uppercase">
              {product.name}
            </h1>
            <p className="mt-2 text-lg md:text-2xl font-light text-[#353535]">{product.description}</p>
            <p className="mt-2 text-gold text-[32px] font-semibold tracking-[0.05em]">${product.price.toFixed(2)}</p>

            <hr className="mt-3 border-black/40" />

            <p className="mt-3 text-base md:text-xl leading-[30px] tracking-[0.05em] text-ink">
              {product.longDescription ?? product.description}
            </p>

            {product.sizes && (
              <fieldset className="mt-8">
                <legend className="text-base font-semibold tracking-[0.05em] text-ink">SIZE</legend>
                <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-5">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      aria-pressed={size === s}
                      className={`h-[42px] text-sm sm:text-xl tracking-[0.15em] border-2 border-black transition-colors ${
                        size === s ? "bg-black text-light" : "bg-white text-ink hover:bg-black/5"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <p className="mt-6 text-xs font-semibold tracking-[0.05em] text-[#010101]">QTY</p>
            <div className="mt-1 flex flex-col sm:flex-row gap-2">
              <div className="flex items-center h-[56px] w-[128px] border border-black/20">
                <button
                  className="w-10 h-full flex items-center justify-center disabled:opacity-30"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <PiMinus />
                </button>
                <span className="flex-1 text-center text-base" aria-live="polite">
                  {quantity}
                </span>
                <button
                  className="w-10 h-full flex items-center justify-center"
                  onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                  aria-label="Increase quantity"
                >
                  <PiPlus />
                </button>
              </div>

              <button
                onClick={handleAddToBag}
                className="flex-1 h-[56px] flex items-center justify-center gap-2 bg-black text-light text-lg sm:text-xl tracking-[0.15em] hover:bg-gold transition-colors"
              >
                {added ? "ADDED ✓" : (
                  <>
                    ADD TO BAG <PiArrowRight className="text-base" />
                  </>
                )}
              </button>
            </div>

            {added && (
              <p className="mt-3 text-sm">
                Added to your bag.{" "}
                <Link href="/cart" className="underline">
                  View bag
                </Link>
              </p>
            )}

            <hr className="mt-12 border-black/40" />

            <ul className="mt-3 space-y-4 text-sm text-[#444748] leading-5">
              <li className="flex gap-3">
                <PiPackage className="text-xl shrink-0" />
                Shelf-stable for 6 months. Best enjoyed at room temperature.
              </li>
              {product.category !== "coffee" && (
                <li className="flex gap-3">
                  <PiInfo className="text-xl shrink-0" />
                  Contains: Wheat, Milk, Eggs. Produced in a facility that also processes nuts.
                </li>
              )}
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
