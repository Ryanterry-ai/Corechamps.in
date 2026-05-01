"use client";

import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  UserRound,
  X
} from "lucide-react";
import { useMemo, useState } from "react";
import { useCms } from "@/lib/cms-store";

export function Header() {
  const { data, cart } = useCms();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const cartCount = useMemo(
    () => cart.reduce((total, line) => total + line.quantity, 0),
    [cart]
  );

  return (
    <header className="sticky top-0 z-40 border-b border-white/15 bg-[#0a0a0d] text-white">
      <div className="border-b border-white/10 bg-[#08090c] py-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
        <div className="container-wide flex justify-center">
          <div className="flex flex-wrap items-center gap-2 text-white/75">
            <span>UNITED STATES</span>
            <span className="text-white/35">|</span>
            <span>EUROPE</span>
            <span className="text-white/35">|</span>
            <span>MIDDLE EAST &amp; ASIA</span>
          </div>
        </div>
      </div>

      <div className="hidden border-b border-white/10 py-3 text-[12px] font-medium sm:block">
        <div className="container-wide flex flex-wrap items-center justify-between gap-3">
          <div className="hidden items-center gap-2 text-white/70 sm:flex">
            <span className="text-ember">✉</span>
            <span>{data.settings.email}</span>
          </div>
          <div className="ml-auto flex items-center gap-5 text-white/70">
            <span className="inline-flex items-center gap-1">
              <UserRound size={14} />
              My Account
            </span>
            <span>English</span>
          </div>
        </div>
      </div>

      <div className="container-wide hidden min-h-24 items-center justify-between gap-4 lg:flex">
        <Link href="/" className="flex items-center gap-3">
          {data.settings.logoImage ? (
            <img
              src={data.settings.logoImage}
              alt={data.settings.storeName}
              className="h-12 w-auto object-contain sm:h-[74px]"
            />
          ) : (
            <span className="font-display text-3xl leading-none text-white">{data.design.logoText}</span>
          )}
        </Link>

        <nav className="hidden items-center gap-8 text-[13px] font-semibold uppercase tracking-[0.04em] lg:flex">
          {data.navigation.primary.map((item) => (
            <div key={item.href} className="group relative">
              <Link
                href={item.href}
                className="inline-flex items-center gap-1.5 py-8 text-[13px] text-white/85 hover:text-white"
              >
                {item.label}
                {item.children && item.children.length > 0 ? <ChevronDown size={13} /> : null}
              </Link>

              {item.children && item.children.length > 0 ? (
                <div className="pointer-events-none absolute left-0 top-full z-50 min-w-[320px] border border-white/15 bg-[#121419] p-3 opacity-0 shadow-xl transition group-hover:pointer-events-auto group-hover:opacity-100">
                  <div className="grid gap-1">
                    {item.children.map((child) => (
                      <Link
                        key={`${item.label}-${child.href}`}
                        href={child.href}
                        className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/80 hover:bg-white/10 hover:text-white"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/collections/protein"
            className="focus-ring hidden h-10 w-10 items-center justify-center text-white/70 hover:text-ember sm:flex"
            aria-label="Search products"
          >
            <Search size={18} />
          </Link>
          <Link
            href="/admin"
            className="focus-ring hidden h-10 w-10 items-center justify-center text-white/70 hover:text-ember sm:flex"
            aria-label="Admin"
          >
            <UserRound size={18} />
          </Link>
          <Link
            href="/cart"
            className="focus-ring relative flex h-10 w-10 items-center justify-center text-white/70 hover:text-ember"
            aria-label="Cart"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-ember px-1 text-[10px] text-white">
                {cartCount}
              </span>
            ) : null}
          </Link>
          <button
            className="focus-ring flex h-10 w-10 items-center justify-center border border-white/25 text-white lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div className="container-wide flex min-h-16 items-center justify-between gap-3 lg:hidden">
        <button
          className="focus-ring flex h-9 w-9 items-center justify-center text-ember"
          onClick={() => setOpen((value) => !value)}
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link href="/" className="flex items-center justify-center">
          {data.settings.logoImage ? (
            <img
              src={data.settings.logoImage}
              alt={data.settings.storeName}
              className="h-9 w-auto object-contain"
            />
          ) : (
            <span className="font-display text-lg leading-none text-white">{data.design.logoText}</span>
          )}
        </Link>

        <div className="flex items-center gap-3 text-white/80">
          <Link href="/collections/protein" aria-label="Search">
            <Search size={17} />
          </Link>
          <Link href="/pages/global-presence" aria-label="Wishlist">
            <Heart size={17} />
          </Link>
          <Link href="/admin" aria-label="Account">
            <UserRound size={17} />
          </Link>
          <Link href="/cart" className="relative" aria-label="Cart">
            <ShoppingCart size={17} />
            {cartCount > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-ember px-1 text-[9px] text-white">
                {cartCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-[#0d0f14] lg:hidden">
          <nav className="container-wide grid gap-1 py-4 text-sm font-semibold uppercase text-white">
            {data.navigation.primary.map((item) => (
              <div key={item.href} className="border-b border-white/10 py-1">
                <div className="flex items-center justify-between">
                  <Link href={item.href} className="py-3" onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                  {item.children && item.children.length > 0 ? (
                    <button
                      className="focus-ring p-2"
                      onClick={() =>
                        setExpanded((current) => (current === item.label ? null : item.label))
                      }
                      aria-label={`Toggle ${item.label}`}
                    >
                      <ChevronRight
                        size={16}
                        className={expanded === item.label ? "rotate-90" : ""}
                      />
                    </button>
                  ) : null}
                </div>
                {expanded === item.label && item.children && item.children.length > 0 ? (
                  <div className="grid gap-1 pb-2 pl-3 text-[12px] text-white/75">
                    {item.children.map((child) => (
                      <Link
                        key={`${item.label}-${child.href}`}
                        href={child.href}
                        className="py-2 text-black/75"
                        onClick={() => setOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}

            <div className="mt-2 grid gap-2 border-t border-white/10 pt-3 text-[12px] text-white/75">
              {data.navigation.categories.map((item) => (
                <Link key={`mobile-${item.href}`} href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </div>

            <Link href="/admin" className="py-3" onClick={() => setOpen(false)}>
              Admin
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
