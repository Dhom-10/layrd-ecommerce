import { Product, Customer } from "@/types/models";

const CAKE_SIZES = ["SMALL", "REGULAR", "LARGE"];

// Product list based on the Figma "Product Catalog" frame.
// Prices are the "FROM" prices shown in the design (taken from the LÄYRD Instagram).
export const products: Product[] = [
  {
    productID: 1,
    name: "Strawberry Matcha",
    price: 9,
    tag: "LIMITED",
    description: "Vibrant, creamy fusion of earthy matcha and sweet strawberry.",
    imageUrl: "/images/strawberry-matcha.jpg",
    category: "cakes",
    flavors: ["fruity", "creamy"],
    packSize: "150ml",
    sizes: CAKE_SIZES,
    addedOrder: 1,
  },
  {
    productID: 2,
    name: "Single Espresso",
    price: 4,
    tag: "CLASSIC",
    description: "Compact shot of rich, bold coffee sealed for freshness and ready to enjoy anywhere.",
    imageUrl: "/images/single-espresso.jpg",
    category: "coffee",
    flavors: ["classic"],
    packSize: "50ml",
    addedOrder: 2,
  },
  {
    productID: 3,
    name: "Oreo Cheesecake",
    price: 8,
    tag: "POPULAR",
    description: "Creamy desert that blends cheesecake with crushed Oreos.",
    imageUrl: "/images/oreo-cheesecake.jpg",
    category: "cakes",
    flavors: ["cookie"],
    packSize: "150ml",
    sizes: CAKE_SIZES,
    addedOrder: 3,
  },
  {
    productID: 4,
    name: "Fruit Salad",
    price: 9,
    tag: "",
    description: "Bright, creamy cheesecake layered with mixed fresh fruits for a refreshing bite.",
    longDescription:
      "A bright, creamy cheesecake layered with mixed fresh fruits for a refreshing bite, delivering a vibrant blend of sweetness and tang that feels light, juicy, and uplifting. Each spoonful brings a burst of fresh flavor wrapped in smooth, velvety cheesecake for a perfectly balanced treat.",
    imageUrl: "/images/fruit-salad.jpg",
    category: "cakes",
    flavors: ["fruity"],
    packSize: "150ml",
    sizes: CAKE_SIZES,
    addedOrder: 4,
  },
  {
    productID: 5,
    name: "Lotus Cheesecake",
    price: 8,
    tag: "",
    description: "Lotus-infused cheesecake for a sweet, deeply comforting flavor.",
    imageUrl: "/images/lotus-cheesecake.jpg",
    category: "cakes",
    flavors: ["cookie"],
    packSize: "150ml",
    sizes: CAKE_SIZES,
    addedOrder: 5,
  },
  {
    productID: 6,
    name: "Kinder Bueno",
    price: 9,
    tag: "",
    description: "Hazelnut-cream cheesecake blended with chocolate wafers for Kinder Bueno lovers.",
    imageUrl: "/images/kinder-bueno.jpg",
    category: "cakes",
    flavors: ["chocolatey"],
    packSize: "150ml",
    sizes: CAKE_SIZES,
    addedOrder: 6,
  },
  {
    productID: 7,
    name: "Tiramisu",
    price: 9,
    tag: "",
    description: "Infused with espresso and cocoa, capturing the rich indulgence of classic tiramisu.",
    imageUrl: "/images/tiramisu.jpg",
    category: "cakes",
    flavors: ["classic", "creamy"],
    packSize: "150ml",
    sizes: CAKE_SIZES,
    addedOrder: 7,
  },
  {
    productID: 8,
    name: "Double Espresso",
    price: 4,
    tag: "",
    description: "Bold, concentrated burst of rich coffee, with the grab-and-go convenience.",
    imageUrl: "/images/double-espresso.jpg",
    category: "coffee",
    flavors: ["classic"],
    packSize: "100ml",
    addedOrder: 8,
  },
  {
    productID: 9,
    name: "Classic Bundle",
    price: 30,
    tag: "",
    description: "Curated 4-pack including Tiramisu, Lotus, Oreo, and Fruit Salad cheesecakes.",
    imageUrl: "/images/classic-bundle.jpg",
    category: "bundles",
    flavors: ["classic"],
    packSize: "4-Pack",
    addedOrder: 9,
  },
  {
    productID: 10,
    name: "Espresso Duo",
    price: 6,
    tag: "",
    description: "Single and double duo offers a balanced caffeine pairing.",
    imageUrl: "/images/espresso-duo.jpg",
    category: "bundles",
    flavors: ["classic"],
    packSize: "100ml",
    addedOrder: 10,
  },
  {
    productID: 11,
    name: "Espresso Bundle",
    price: 14,
    tag: "",
    description: "Mixed espresso bundle for four. Or four for yourself.",
    // TODO: replace with the espresso bundle photo from the Figma file
    imageUrl: "/images/double-espresso.jpg",
    category: "bundles",
    flavors: ["classic"],
    packSize: "4-Pack",
    addedOrder: 11,
  },
];

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.productID === id);
}

export const categoryLabels: Record<Product["category"], string> = {
  cakes: "Cake-in-a-Can",
  coffee: "Drinks",
  bundles: "Bundles",
};

export const customers: Customer[] = [
  {
    userID: 1,
    customerId: 1001,
    name: "Jordan Diaz",
    email: "jordan@example.com",
    passwords: "password123",
    phone: "403-555-0101",
    address: "123 Main St",
    loyaltypoints: 100,
  },
];

export function login(email: string, passwords: string): Customer | null {
  return customers.find((item) => item.email === email && item.passwords === passwords) ?? null;
}
