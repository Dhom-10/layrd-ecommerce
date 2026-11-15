"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { PiArrowRight, PiAt, PiEye, PiEyeSlash, PiLockSimple } from "react-icons/pi";
import { GlassBackground, GlassCard, PillInput } from "@/app/components/GlassAuth";
import { homeForRole, signInAs } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const account = await signInAs(email, password, ["customer", "wholesale", "admin"]);
      // Go back to the page that sent them here (e.g. checkout), otherwise their home page
      const next = new URLSearchParams(window.location.search).get("next");
      router.push(next && next.startsWith("/") && !next.startsWith("//") ? next : homeForRole(account.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not log in.");
      setBusy(false);
    }
  }

  return (
    <GlassBackground image="/images/lotus-cheesecake.jpg">
      <div className="flex-1 flex flex-col gap-3 max-w-[369px] w-full mx-auto">
        <GlassCard className="px-8 py-6">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="flex items-start justify-between">
              <h1 className="text-[28px] font-medium">Log in</h1>
              <Link href="/signup" className="text-sm underline mt-2">Sign up</Link>
            </div>

            <div className="mt-8 flex flex-col gap-6">
              <PillInput icon={<PiAt />} label="E-mail address" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <div className="relative">
                <PillInput icon={<PiLockSimple />} label="Password" type={show ? "text" : "password"} required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-xl">
                  {show ? <PiEyeSlash /> : <PiEye />}
                </button>
              </div>
            </div>

            {error && <p role="alert" className="mt-4 text-sm bg-red-50/90 text-red-700 rounded px-3 py-2">{error}</p>}

            <div className="mt-8 flex items-end justify-between">
              <div className="text-xs">
                <p>Freshly layered. Made to order.</p>
                <p className="mt-2 text-ink/60">Cake in a can | Espresso shots</p>
              </div>
              <button type="submit" disabled={busy} aria-label="Log in" className="size-[41px] rounded-full bg-gold flex items-center justify-center text-2xl hover:brightness-110 disabled:opacity-50">
                <PiArrowRight />
              </button>
            </div>
          </form>
        </GlassCard>

        <GlassCard className="px-6 py-5">
          <h2 className="text-xl tracking-[0.05em]">WHOLESALE</h2>
          <p className="mt-2 text-xs">Our wholesale portal is designed for businesses that want premium layered desserts, delivered reliably and affordably.</p>
          <Link href="/wholesale/login" className="mt-5 flex h-[39px] items-center justify-center rounded-full bg-gold text-sm hover:brightness-110">
            Wholesale partner log in
          </Link>
        </GlassCard>
      </div>

      <GlassCard className="hidden md:flex flex-1 max-w-[379px] min-h-[678px] flex-col px-6 py-8 text-white">
        <p className="text-[64px] leading-none tracking-[0.12em] text-ink">LÄYRD</p>
        <p className="mt-3 text-lg">layered desserts</p>
        <div className="mt-auto mb-auto">
          <p className="text-lg">Made fresh, layered daily.</p>
          <p className="text-lg text-ink">Espresso shots &amp; event orders.</p>
          <p className="text-xs">CAKE IN A CAN</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl tracking-[0.1em] text-ink">LÄYRD</span>
          <Link href="/products" className="flex h-[39px] items-center gap-6 rounded-full bg-gold pl-4 pr-3 text-ink text-sm">
            Browse the shop <PiArrowRight className="text-xl" />
          </Link>
        </div>
      </GlassCard>
    </GlassBackground>
  );
}
