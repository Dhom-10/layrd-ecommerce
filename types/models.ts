export type Category = "cakes" | "coffee" | "bundles";

export type Flavor = "fruity" | "cookie" | "chocolatey" | "classic" | "creamy";

export type ProductTag = "" | "LIMITED" | "CLASSIC" | "POPULAR";

export interface Product {
  productID: number;
  name: string;
  price: number;
  tag: ProductTag;
  description: string;
  longDescription?: string;
  imageUrl: string;
  gallery?: string[];
  category: Category;
  flavors: Flavor[];
  /** Pack size used by the "Size" filter on the catalog page */
  packSize: "150ml" | "100ml" | "50ml" | "4-Pack" | "6+ Pack";
  /** Size options shown on the product details page */
  sizes?: string[];
  /** Days added to the catalog, used for "Newest" sorting (lower = newer) */
  addedOrder: number;
  /** Units in stock (from the database) */
  stock?: number;
}

export interface User {
  userID: number;
  name: string;
  email: string;
  passwords: string;
  phone: string;
}

export interface Customer extends User {
  customerId: number;
  address: string;
  loyaltypoints: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

export interface Cart {
  cartId: number;
  items: CartItem[];
}

export type DeliveryMethod = "delivery" | "pickup";

export type OrderStatus = "pending_payment" | "processing" | "out_for_delivery" | "delivered" | "cancelled";

export type PaymentStatus = "unpaid" | "paid" | "test_paid";

export interface OrderItem {
  productId: number | null;
  name: string;
  size: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderSummary {
  id: number;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryMethod: DeliveryMethod;
  customerName: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  items: OrderItem[];
}
