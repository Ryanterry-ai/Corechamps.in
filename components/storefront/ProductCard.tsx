"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCms } from "@/lib/cms-store";
import { formatMoney } from "@/lib/data";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, data } = useCms();
  const image = product.images[0]?.src;
  const variant = product.variants[0];

  return (
    <article className="group grid min-h-full grid-rows-[auto_1fr] border border-black/10 bg-white">
      <Link href={`/products/${product.slug}`} className="bg-steel p-5">
        <div className="relative aspect-[4/5] overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={product.title}
              className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-black/5 text-sm font-bold uppercase text-black/40">
              No image
            </div>
          )}
          <span className="absolute left-0 top-0 bg-ink px-3 py-2 text-xs font-black uppercase text-white">
            {product.available ? "In stock" : "Out of stock"}
          </span>
        </div>
      </Link>
      <div className="flex flex-col p-5">
        <Link
          href={`/products/${product.slug}`}
          className="min-h-14 text-lg font-black uppercase leading-tight hover:text-ember"
        >
          {product.title}
        </Link>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-black/60">
          {product.summary}
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-xl font-black">
              {formatMoney(product.price, data.settings.currency)}
            </p>
            {product.compareAtPrice > product.price ? (
              <p className="text-xs text-black/45 line-through">
                {formatMoney(product.compareAtPrice, data.settings.currency)}
              </p>
            ) : null}
          </div>
          <button
            className="focus-ring flex h-11 w-11 items-center justify-center bg-ember text-white disabled:cursor-not-allowed disabled:bg-black/25"
            disabled={!product.available}
            aria-label={`Add ${product.title} to cart`}
            onClick={() =>
              addToCart({
                slug: product.slug,
                variantId: variant?.id,
                title: product.title,
                variantTitle: variant?.title,
                price: product.price,
                image,
                quantity: 1
              })
            }
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
