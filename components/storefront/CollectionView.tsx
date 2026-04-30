"use client";

import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/storefront/ProductCard";
import { useCms } from "@/lib/cms-store";

export function CollectionView({ slug }: { slug: string }) {
  const { data } = useCms();
  const collection =
    data.collections.find((entry) => entry.slug === slug) ||
    data.collections.find((entry) => entry.slug === "protein");
  const products = collection
    ? collection.productSlugs
        .map((productSlug) => data.products.find((product) => product.slug === productSlug))
        .filter(Boolean)
    : data.products;

  return (
    <section className="section-pad">
      <div className="container-wide">
        <div className="mb-10 grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-ember">
              Collection
            </p>
            <h1 className="mt-3 font-display text-6xl uppercase leading-none">
              {collection?.title || "Supplements"}
            </h1>
          </div>
          <div>
            <p className="max-w-2xl text-lg leading-8 text-black/65">
              {collection?.subtitle ||
                "Shop the imported Core Champs supplement catalog."}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {data.collections.map((item) => (
                <Link
                  key={item.slug}
                  href={`/collections/${item.slug}`}
                  className={`border px-4 py-2 text-xs font-black uppercase ${
                    item.slug === collection?.slug
                      ? "border-ember bg-ember text-white"
                      : "border-black/15 hover:border-black"
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between border-y border-black/10 py-4">
          <p className="text-sm font-bold text-black/60">
            {products.length} products imported
          </p>
          <span className="flex items-center gap-2 text-sm font-black uppercase">
            <SlidersHorizontal size={16} /> Sort: Featured
          </span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) =>
            product ? <ProductCard key={product.slug} product={product} /> : null
          )}
        </div>
      </div>
    </section>
  );
}
