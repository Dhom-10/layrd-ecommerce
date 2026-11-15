"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { PiArrowRight, PiAt, PiEye, PiEyeSlash, PiKey } from "react-icons/pi";
import { Role, signInAs } from "@/lib/auth";

interface Props {
  title: string;
  subtitle: string;
  allowed: Role[];
  redirectTo: string;
  background: string;
  sidePanel: React.ReactNode;
}

/** Glass-style login card from the Figma "wholesale login page", reused for the admin login. */
export default function PortalLogin({ title, subtitle, allowed, redirectTo, background, sidePanel }: Props) {
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
      await signInAs(email, password, allowed);
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
      setBusy(false);
    }
  }

  return (
    <main
      className="relative min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative flex flex-col md:flex-row gap-6 md:gap-[83px] w-full max-w-[821px]">
        <form
          onSubmit={handleSubmit}
          className="flex-1 min-h-[497px] rounded-card border border-white/30 bg-white/25 backdrop-blur-md shadow-xl px-10 py-6 flex flex-col text-ink"
        >
          <div className="flex items-start justify-between text-sm">
            <span className="mt-8 font-medium tracking-[0.1em]">LÄYRD</span>
            <Link href="/login" className="hover:underline">Customer log in</Link>
          </div>
          <h1 className="mt-6 text-[32px] font-medium">{title}</h1>
          <p className="text-lg text-ink/60">{subtitle}</p>

          <label className="mt-8 flex items-center gap-2 h-10 rounded-full bg-white/50 px-3 focus-within:ring-2 focus-within:ring-gold">
            <PiAt className="text-xl shrink-0" aria-hidden />
            <span className="sr-only">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="E-mail address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent outline-none placeholder:text-ink/50"
            />
          </label>
          <label className="mt-6 flex items-center gap-2 h-10 rounded-full bg-white/50 px-3 focus-within:ring-2 focus-within:ring-gold">
            <PiKey className="text-xl shrink-0" aria-hidden />
            <span className="sr-only">Password</span>
            <input
              type={show ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent outline-none placeholder:text-ink/50"
            />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"}>
              {show ? <PiEyeSlash className="text-xl" /> : <PiEye className="text-xl" />}
            </button>
          </label>

          {error && <p role="alert" className="mt-4 text-sm bg-red-50/90 text-red-700 rounded px-3 py-2">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            aria-label="Sign in"
            className="mt-auto self-end size-[41px] rounded-full bg-gold flex items-center justify-center text-ink text-2xl hover:brightness-110 disabled:opacity-50"
          >
            <PiArrowRight />
          </button>
        </form>

        <div className="hidden md:flex flex-1 min-h-[497px] rounded-card border border-white/30 bg-white/20 backdrop-blur-xl shadow-xl p-6 flex-col text-white">
          {sidePanel}
        </div>
      </div>
    </main>
  );
}
