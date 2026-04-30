"use client";

import Link from "next/link";
import { Menu, Search, ShoppingCart, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { useCms } from "@/lib/cms-store";

export function Header() {
  const { data, cart } = useCms();
  const [open, setOpen] = useState(false);
  const cartCount = useMemo(
    () => cart.reduce((total, line) => total + line.quantity, 0),
    [cart]
  );

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/95 backdrop-blur">
      <div className="bg-ink py-2 text-center text-xs font-bold uppercase tracking-[0.18em] text-white">
        {data.marketing.announcement}
      </div>
      <div className="container-wide flex min-h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center bg-ember text-lg font-black text-white">
            CC
          </span>
          <span>
            <span className="block font-display text-3xl leading-none">
              {data.design.logoText}
            </span>
            <span className="block text-xs font-bold uppercase tracking-[0.22em] text-ember">
              {data.settings.tagline}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-black uppercase lg:flex">
          {data.navigation.primary.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-ember">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/collections/protein"
            className="focus-ring hidden h-10 w-10 items-center justify-center border border-black/15 hover:bg-ink hover:text-white sm:flex"
            aria-label="Search products"
          >
            <Search size={18} />
          </Link>
          <Link
            href="/admin"
            className="focus-ring hidden h-10 w-10 items-center justify-center border border-black/15 hover:bg-ink hover:text-white sm:flex"
            aria-label="Admin"
          >
            <UserRound size={18} />
          </Link>
          <Link
            href="/cart"
            className="focus-ring relative flex h-10 w-10 items-center justify-center bg-ink text-white"
            aria-label="Cart"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-ember px-1 text-xs">
                {cartCount}
              </span>
            ) : null}
          </Link>
          <button
            className="focus-ring flex h-10 w-10 items-center justify-center border border-black/15 lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-black/10 bg-white lg:hidden">
          <nav className="container-wide grid gap-1 py-4 text-sm font-black uppercase">
            {data.navigation.primary.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-3"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/admin" className="py-3" onClick={() => setOpen(false)}>
              Admin
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
