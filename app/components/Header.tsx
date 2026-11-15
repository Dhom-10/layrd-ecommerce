"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PiList, PiMagnifyingGlass, PiUser, PiTote, PiX } from "react-icons/pi";
import { useCart } from "@/context/CartContext";
import { homeForRole, signOut, useAccount } from "@/lib/auth";

const navLinks = [
  { label: "DRINKS", href: "/products?category=coffee" },
  { label: "CAKE-IN-A-CAN", href: "/products?category=cakes" },
  { label: "BUNDLES", href: "/products?category=bundles" },
  { label: "EVENT ORDERING", href: "#" },
  { label: "MORE", href: "#" },
];

export default function Header() {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { account } = useAccount();
  const router = useRouter();

  async function handleSignOut() {
    setAccountOpen(false);
    await signOut();
    router.push("/");
  }

  return (
    <div className="sticky top-0 z-50">
      {/* Announcement bar */}
      <div className="bg-black text-announce text-center text-[11px] sm:text-sm md:text-base font-semibold py-3 px-4">
        NEW LIMITED EDITION FLAVORS OUT THIS WEEKEND !{" "}
        <Link href="/products?category=cakes" className="underline">
          LEARN MORE
        </Link>
      </div>

      {/* Main header */}
      <header className="bg-white border-b-2 border-gold px-4 sm:px-10 pt-5 pb-4">
        <div className="relative flex items-center justify-between">
          <button
            className="text-[32px] text-ink"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <PiX /> : <PiList />}
          </button>

          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 text-[32px] sm:text-[48px] leading-none tracking-[0.12em] font-medium text-ink"
          >
            LÄYRD
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 text-[26px] sm:text-[32px] text-ink">
            <button aria-label="Search" className="hidden sm:block">
              <PiMagnifyingGlass />
            </button>
            {account ? (
              <div className="relative">
                <button
                  onClick={() => setAccountOpen((o) => !o)}
                  aria-label="Account menu"
                  aria-expanded={accountOpen}
                  className="relative block text-gold"
                >
                  <PiUser />
                  <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-gold ring-2 ring-white" />
                </button>
                {accountOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-white border border-gold shadow-lg text-sm text-ink z-50">
                    <p className="px-4 pt-3 pb-2 border-b border-border truncate">
                      Hi, {account.fullName?.split(" ")[0] ?? account.email}
                    </p>
                    <Link href="/account" onClick={() => setAccountOpen(false)} className="block px-4 py-2 hover:bg-gold/10">
                      My account &amp; orders
                    </Link>
                    {account.role !== "customer" && (
                      <Link href={homeForRole(account.role)} onClick={() => setAccountOpen(false)} className="block px-4 py-2 hover:bg-gold/10">
                        {account.role === "admin" ? "Admin dashboard" : "Wholesale portal"}
                      </Link>
                    )}
                    <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 border-t border-border hover:bg-gold/10">
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" aria-label="Log in">
                <PiUser />
              </Link>
            )}
            <Link href="/cart" aria-label={`Cart, ${itemCount} items`} className="relative">
              <PiTote />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-gold text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex justify-center gap-12 mt-6 text-base font-semibold tracking-[0.05em]">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="underline underline-offset-4 hover:text-gold">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile / dropdown nav */}
        {menuOpen && (
          <nav className="flex flex-col gap-4 mt-5 pt-4 border-t border-border text-sm font-semibold tracking-[0.05em] md:items-center">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </div>
  );
}
