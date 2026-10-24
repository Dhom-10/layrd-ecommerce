"use client";

import Link from "next/link";
import { useState } from "react";
import { PiList, PiMagnifyingGlass, PiUser, PiTote, PiX } from "react-icons/pi";
import { useCart } from "@/context/CartContext";

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
            <Link href="/login" aria-label="Account">
              <PiUser />
            </Link>
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
