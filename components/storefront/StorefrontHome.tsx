"use client";

import Link from "next/link";
import { ArrowRight, Dumbbell, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { ProductCard } from "@/components/storefront/ProductCard";
import { useCms } from "@/lib/cms-store";

export function StorefrontHome() {
  const { data } = useCms();
  const heroProducts = data.products.filter((product) => product.status === "published").slice(0, 8);
  const muscle = data.collections.find((collection) => collection.slug === "muscle-building");
  const healthy = data.collections.find((collection) => collection.slug === "healthy-wellness");

  return (
    <>
      <section className="relative min-h-[calc(100svh-112px)] overflow-hidden bg-ink text-white">
        {data.settings.heroImage ? (
          <img
            src={data.settings.heroImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/10" />
        <div className="container-wide relative flex min-h-[calc(100svh-112px)] items-center py-16">
          <div className="max-w-2xl animate-[fadeIn_.7s_ease-out]">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-ember">
              {data.settings.tagline}
            </p>
            <h1 className="font-display text-6xl uppercase leading-[0.86] sm:text-8xl lg:text-[8.5rem]">
              {data.settings.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">
              {data.settings.heroBody}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/collections/protein"
                className="focus-ring inline-flex items-center gap-2 bg-ember px-6 py-4 text-sm font-black uppercase text-white"
              >
                Shop supplements <ArrowRight size={18} />
              </Link>
              <Link
                href="/admin"
                className="focus-ring inline-flex items-center gap-2 border border-white/30 px-6 py-4 text-sm font-black uppercase text-white hover:bg-white hover:text-ink"
              >
                Open CMS
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-white">
        <div className="container-wide grid gap-px bg-black/10 md:grid-cols-4">
          {[
            ["Free shipping focus", Truck],
            ["Science-based nutrition", Sparkles],
            ["Training essentials", Dumbbell],
            ["Authenticity support", ShieldCheck]
          ].map(([label, Icon]) => (
            <div key={String(label)} className="flex items-center gap-3 bg-white py-5">
              <Icon className="text-ember" size={22} />
              <span className="text-sm font-black uppercase">{String(label)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-ember">
                Hot selling products
              </p>
              <h2 className="mt-3 font-display text-5xl uppercase leading-none">
                Free shipping favorites
              </h2>
            </div>
            <Link
              href="/collections/protein"
              className="inline-flex items-center gap-2 text-sm font-black uppercase hover:text-ember"
            >
              View all <ArrowRight size={17} />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {heroProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink text-white">
        <div className="container-wide grid gap-8 py-16 lg:grid-cols-3">
          {data.marketing.banners.map((banner) => (
            <Link
              key={banner.id}
              href={banner.href}
              className="group relative min-h-80 overflow-hidden bg-black"
            >
              {banner.image ? (
                <img
                  src={banner.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-500 group-hover:scale-105"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-4xl uppercase leading-none">
                  {banner.title}
                </h3>
                <p className="mt-4 inline-flex items-center gap-2 text-sm font-black uppercase text-ember">
                  {banner.cta} <ArrowRight size={17} />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-wide grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-ember">
              {muscle?.title || "Muscle Building"}
            </p>
            <h2 className="mt-3 font-display text-6xl uppercase leading-none">
              Bred to be a champion
            </h2>
            <p className="mt-5 text-lg leading-8 text-black/65">
              {muscle?.subtitle ||
                "Protein, mass gainer, and performance staples built around focused training."}
            </p>
            <Link
              href="/collections/muscle-building"
              className="mt-8 inline-flex items-center gap-2 bg-ink px-6 py-4 text-sm font-black uppercase text-white hover:bg-ember"
            >
              Shop muscle building <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {(muscle?.productSlugs || [])
              .map((slug) => data.products.find((product) => product.slug === slug))
              .filter(Boolean)
              .slice(0, 4)
              .map((product) => (
                <ProductCard key={product!.slug} product={product!} />
              ))}
          </div>
        </div>
      </section>

      <section className="bg-steel py-16">
        <div className="container-wide grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-ember">
              {healthy?.title || "Healthy Lifestyle"}
            </p>
            <h2 className="mt-3 font-display text-5xl uppercase leading-none">
              Daily support for hard training
            </h2>
          </div>
          <form className="flex flex-col gap-3 sm:flex-row">
            <input
              className="focus-ring min-h-14 flex-1 border border-black/15 bg-white px-4"
              placeholder="Enter your email"
              type="email"
            />
            <button className="focus-ring min-h-14 bg-ember px-7 text-sm font-black uppercase text-white">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
