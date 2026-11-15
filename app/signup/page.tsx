"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { PiArrowRight, PiAt, PiKey, PiUser } from "react-icons/pi";
import { GlassBackground, GlassCard, PillInput } from "@/app/components/GlassAuth";
import { signUp } from "@/lib/auth";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [busy, setBusy] = useState(false);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) return setError("Use at least 8 characters for the password.");
    if (form.password !== form.confirm) return setError("The passwords don't match.");
    setBusy(true);
    try {
      const { needsConfirmation } = await signUp(form.name, form.email, form.password);
      if (needsConfirmation) {
        setSentTo(form.email.trim());
        setBusy(false);
      } else {
        router.push("/home");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the account.");
      setBusy(false);
    }
  }

  return (
    <GlassBackground image="/images/classic-bundle.jpg">
      <GlassCard className="flex-1 max-w-[383px] w-full mx-auto px-8 py-6">
        <div className="flex items-start justify-between">
          <span className="text-2xl tracking-[0.1em] font-medium mt-1">LÄYRD</span>
          <Link href="/login" className="text-lg underline">Log in</Link>
        </div>

        {sentTo ? (
          <div className="mt-10">
            <h1 className="text-[28px] font-medium">Check your email</h1>
            <p className="mt-3 text-sm">
              We sent a confirmation link to <strong>{sentTo}</strong>. Click it, then log in.
            </p>
            <Link href="/login" className="mt-8 flex h-[29px] items-center justify-between rounded-full bg-gold pl-6 pr-3 text-sm">
              Go to log in <PiArrowRight />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h1 className="mt-6 text-[28px] font-medium">Create account</h1>
            <div className="mt-4 flex flex-col gap-4">
              <PillInput icon={<PiUser />} label="Full name" required autoComplete="name" value={form.name} onChange={update("name")} />
              <PillInput icon={<PiAt />} label="E-mail address" type="email" required autoComplete="email" value={form.email} onChange={update("email")} />
              <PillInput icon={<PiKey />} label="Password" type="password" required autoComplete="new-password" value={form.password} onChange={update("password")} />
              <PillInput icon={<PiKey />} label="Confirm Password" type="password" required autoComplete="new-password" value={form.confirm} onChange={update("confirm")} />
            </div>

            {error && <p role="alert" className="mt-4 text-sm bg-red-50/90 text-red-700 rounded px-3 py-2">{error}</p>}

            <button type="submit" disabled={busy} className="mt-8 w-full flex h-[29px] items-center justify-between rounded-full bg-gold pl-6 pr-3 text-sm hover:brightness-110 disabled:opacity-50">
              {busy ? "Creating…" : "Create my account"} <PiArrowRight />
            </button>
            <p className="mt-4 text-center text-xs">
              Ordering for a business? <Link href="/wholesale/login" className="text-gold underline">Wholesale sign up</Link>
            </p>
          </form>
        )}
      </GlassCard>

      <GlassCard className="hidden md:flex flex-1 max-w-[383px] min-h-[581px] flex-col px-8 py-16 text-white">
        <p className="text-[56px] leading-none tracking-[0.05em] font-medium">LÄYRD</p>
        <p className="mt-4 text-2xl text-gold">Made for you</p>
      </GlassCard>
    </GlassBackground>
  );
}
