"use client";

import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { useCms } from "@/lib/cms-store";

export function Footer() {
  const { data } = useCms();

  return (
    <footer className="bg-ink text-white">
      <div className="container-wide grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-4xl">{data.settings.storeName}</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/70">
            Core Champs is a science-based sports nutrition supplement brand
            delivering whey protein, mass gainer, creatine, EAA, nitric oxide,
            pre-workouts, vitamins, and daily support products.
          </p>
          <div className="mt-6 flex gap-3 text-white/70">
            <Twitter size={18} />
            <Facebook size={18} />
            <Instagram size={18} />
          </div>
        </div>

        <div>
          <p className="mb-4 text-sm font-black uppercase tracking-[0.2em]">
            Categories
          </p>
          <div className="grid gap-3 text-sm text-white/70">
            {data.navigation.categories.slice(0, 6).map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-4 text-sm font-black uppercase tracking-[0.2em]">
            Company
          </p>
          <div className="grid gap-3 text-sm text-white/70">
            {data.navigation.footer.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-4 text-sm font-black uppercase tracking-[0.2em]">
            Store Information
          </p>
          <div className="grid gap-4 text-sm text-white/70">
            <span className="flex gap-3">
              <MapPin size={18} className="shrink-0 text-ember" />
              {data.settings.address}
            </span>
            <span className="flex gap-3">
              <Phone size={18} className="shrink-0 text-ember" />
              {data.settings.phone}
            </span>
            <span className="flex gap-3">
              <Mail size={18} className="shrink-0 text-ember" />
              {data.settings.email}
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5">
        <div className="container-wide text-xs text-white/50">
          These statements have not been evaluated by the Food and Drug
          Administration. These products are not intended to diagnose, treat,
          cure, or prevent any disease. Copyright 2026 CORE CHAMPS.
        </div>
      </div>
    </footer>
  );
}
