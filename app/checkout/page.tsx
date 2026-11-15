import Header from "@/app/components/Header";
import Footer from "@/app/components/footer";
import { connection } from "next/server";
import CheckoutForm from "./CheckoutForm";

export default async function CheckoutPage() {
  await connection(); // read the env at request time, not build time
  // Real card payments go through Stripe Checkout once a test key is added to .env.local
  const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY);
  return (
    <>
      <Header />
      <CheckoutForm stripeEnabled={stripeEnabled} />
      <Footer />
    </>
  );
}
