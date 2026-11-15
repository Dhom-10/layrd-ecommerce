# Sprint 2: database, checkout and orders

## What was added
- **Database (Supabase / PostgreSQL)**: project `layrd-ecommerce` (region ca-central-1)
  - `products`: catalog with retail price, wholesale price, wholesale minimum and stock
  - `profiles`: one row per login, with a role (`customer`, `wholesale`, `admin`)
  - `orders` + `order_items`: every order, its items, totals, delivery info, status and payment status
- **Database functions (RPC)**
  - `place_order(customer, items, delivery)`: checks stock and minimums and recalculates every price
    from the database (the browser's prices are never trusted). Adds delivery ($1.99, free from $75 or pickup)
    and 5% GST. Wholesale partners get wholesale prices automatically.
  - `get_order_by_token(id, token)`: used by the confirmation page; only works with the private token the buyer got
  - `confirm_order_payment(id, token, ref)`: marks an order paid (test mode, or after Stripe confirms)
  - `get_wholesale_catalog()`: wholesale prices, only for wholesale partners and admins
- **Row Level Security** on every table: guests can only read products (without wholesale prices),
  customers only see their own orders, and only admins can see all orders or change their status.

## Pages and API
| Route | What it does |
|---|---|
| `/api/products`, `/api/products/:id` | Product API (reads from the database, falls back to `lib/data.ts`) |
| `/cart` | Cart redesigned to match Figma. Saved in the browser so it survives reloads |
| `/checkout` | Customer info, delivery or pickup, payment (test mode, or Stripe if a key is set) |
| `/order/:id?token=…` | Order confirmation (Figma design) |
| `/admin/login`, `/admin/orders` | Admin login + orders dashboard: stats, search, filter, change status, view items |
| `/wholesale/login`, `/wholesale/catalog` | Partner login + wholesale catalog with minimums and invoice ordering |

## Run it
1. Copy `.env.example` to `.env.local` and fill in the Supabase URL and publishable key (ask Nasser).
2. `npm install` then `npm run dev`.
3. Test card in test mode: `4242 4242 4242 4242`, any future date, any CVC.
4. Demo admin and wholesale logins: ask Nasser (not stored in the repo).

## Stripe (optional)
Put a **test** secret key (`sk_test_…`) in `STRIPE_SECRET_KEY`. Checkout then sends customers to Stripe Checkout,
and the confirmation page checks with Stripe that the payment went through before marking the order paid.

## Known limits / Sprint 3
- Payment confirmation should move to a Stripe webhook with a server-only key.
- Promo codes, DoorDash tracking, Apple/Google Pay and PayPal are shown in the design but not wired up yet.
- Admin product management and the other admin pages (Dashboard, Customers, Analytics) are still to build.
