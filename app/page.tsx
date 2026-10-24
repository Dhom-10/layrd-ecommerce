import Image from "next/image";
import Link from "next/link";
import { PiInstagramLogo } from "react-icons/pi";
import Header from "@/app/components/Header";
import Footer from "@/app/components/footer";
import ProductTag from "@/app/components/ProductTag";
import { getProductById, products } from "@/lib/data";
import { Product } from "@/types/models";

// Featured products in the Figma "Main Page - REVISED" frame
const featuredIds = [3, 2, 1]; // Oreo Cheesecake, Single Espresso, Strawberry Matcha

const brandValues = [
  {
    title: "PREMIUM CAKES-IN-A-CAN",
    description:
      "A refined twist on classic deserts. Beautifully layered and sealed. Ready to enjoy anywhere. Each can delivers a premium, spoon-ready experience from the very first bite.",
    image: "/images/oreo-cheesecake.jpg",
  },
  {
    title: "SIMPLE, FRESH INGREDIENTS",
    description:
      "Real, recognizable, and fresh ingredients that bring richness and elegance into every bite. Each element carefully selected for purity and taste.",
    image: "/images/fruit-salad.jpg",
  },
  {
    title: "ESPRESSO, ELEVATED",
    description:
      "Freshly ground beans, perfectly measured and tamped. Sealed to preserve purity, and extracted into a shot.",
    image: "/images/single-espresso.jpg",
  },
];

export default function HomePage() {
  const featured = featuredIds
    .map((id) => getProductById(id))
    .filter((p): p is Product => Boolean(p));

  // Placeholder Instagram grid — swap with real Instagram posts later
  const instagramPosts = products.slice(0, 9);

  return (
    <>
      <Header />

      <main>
        {/* Hero */}
        <section className="relative h-[560px] md:h-[814px] border-y-[3px] border-gold overflow-hidden">
          {/* TODO: replace with the hero photo from the Figma file */}
          <Image
            src="/images/classic-bundle.jpg"
            alt="LÄYRD cakes-in-a-can lined up on a table"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />

          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
            <h1 className="text-[26px] sm:text-[48px] md:text-[64px] leading-tight tracking-[0.03em] font-normal">
              ESPRESSO SHOTS &amp;
              <br />
              CAKE-IN-A-CAN
              <br />
              <span className="text-[22px] sm:text-[44px] md:text-[60px]">MADE FRESH. KEPT SIMPLE.</span>
            </h1>
            <p className="mt-4 max-w-[731px] text-sm sm:text-base tracking-[0.03em]">
              Discover a new standard of premium cakes crafted with fresh and simple ingredients. Delivered in our
              signature cans.
            </p>
            <Link
              href="/products"
              className="mt-8 w-full max-w-[364px] h-[50px] flex items-center justify-center bg-white text-ink border border-black/50 text-sm font-medium tracking-[0.15em] hover:bg-gold hover:text-white transition-colors"
            >
              EXPLORE OUR CATALOGUE
            </Link>
          </div>
        </section>

        {/* Featured collection */}
        <section className="bg-[#f5f5f5] px-4 sm:px-10 py-16 md:py-20">
          <div className="max-w-[1332px] mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 md:mb-14">
              <h2 className="text-2xl md:text-[32px] font-medium tracking-[0.15em] text-ink">
                OUR <span className="text-gold">FEATURED</span> COLLECTION
              </h2>
              <Link href="/products" className="text-base font-semibold tracking-[0.15em] underline text-ink">
                VIEW ALL PRODUCTS
              </Link>
            </div>

            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {featured.map((product) => (
                <FeaturedCard key={product.productID} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Premium. Simple. Elevated. */}
        <section className="bg-black text-white px-4 sm:px-10 md:px-20 py-14">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="text-gold text-[32px] md:text-[52px] font-semibold tracking-[0.05em]">
              PREMIUM. SIMPLE. ELEVATED
            </h2>

            <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_auto] items-center">
              <div>
                <ul className="space-y-8">
                  {brandValues.map((value) => (
                    <li key={value.title} className="flex items-center gap-6">
                      <div className="relative shrink-0 size-[96px] md:size-[132px] rounded-full overflow-hidden border-2 border-gold">
                        <Image src={value.image} alt="" fill sizes="132px" className="object-cover" />
                      </div>
                      <div className="max-w-[511px]">
                        <h3 className="text-lg md:text-xl font-medium tracking-[0.1em]">{value.title}</h3>
                        <p className="mt-1 text-sm md:text-base tracking-[0.05em]">{value.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <button className="mt-10 w-[176px] h-[40px] bg-black border-2 border-white text-light text-sm font-semibold tracking-[0.15em] hover:bg-white hover:text-black transition-colors">
                  OUR STORY
                </button>
              </div>

              {/* Video placeholders from the design (VIDEO LAYRD 1 / VIDEO 1) */}
              <div className="flex gap-6 items-center justify-center">
                <div className="relative w-[240px] sm:w-[395px] h-[260px] sm:h-[388px] rounded-card border-2 border-gold overflow-hidden">
                  <Image src="/images/tiramisu.jpg" alt="Tiramisu cake-in-a-can" fill sizes="395px" className="object-cover" />
                </div>
                <div className="relative hidden sm:block w-[208px] h-[373px] rounded-card border-2 border-gold overflow-hidden">
                  <Image src="/images/espresso-duo.jpg" alt="LÄYRD espresso shots" fill sizes="208px" className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Instagram */}
        <section className="px-4 sm:px-10 py-16 text-center">
          <h2 className="text-[40px] md:text-[64px] font-medium tracking-[0.15em] text-black">@l.a.y.r.d</h2>
          <p className="mt-2 text-gold text-base font-medium tracking-[0.1em]">Share your moments with #LAYRD</p>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 max-w-[1150px] mx-auto">
            {instagramPosts.map((post) => (
              <div key={post.productID} className="relative aspect-square border-2 border-gold overflow-hidden">
                <Image src={post.imageUrl} alt={post.name} fill sizes="(min-width: 768px) 360px, 50vw" className="object-cover" />
              </div>
            ))}
          </div>

          <a
            href="https://www.instagram.com/l.a.y.r.d"
            target="_blank"
            rel="noreferrer"
            className="mt-12 inline-flex items-center gap-3 text-ink text-lg md:text-[36px] underline"
          >
            <PiInstagramLogo className="text-3xl md:text-[57px] shrink-0" />
            Follow us on our Instagram for more announcements !
          </a>
        </section>
      </main>

      <Footer />
    </>
  );
}

function FeaturedCard({ product }: { product: Product }) {
  return (
    <article className="flex flex-col items-center">
      <div className="relative w-full aspect-square rounded-card border-2 border-gold overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 428px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        <ProductTag tag={product.tag} />
      </div>

      <div className="w-full px-4 sm:px-[39px] mt-2">
        <h3 className="text-base tracking-[0.15em] underline uppercase">{product.name}</h3>
        <p className="text-base tracking-[0.05em] mt-1 min-h-[48px]">{product.description}</p>
      </div>

      <p className="mt-2 text-gold text-base font-medium tracking-[0.15em]">FROM ${product.price}</p>
      <Link
        href={`/products/${product.productID}`}
        className="mt-2 w-[176px] h-[40px] flex items-center justify-center bg-black text-light text-sm font-medium tracking-[0.15em] hover:bg-gold transition-colors"
      >
        DETAILS
      </Link>
    </article>
  );
}
