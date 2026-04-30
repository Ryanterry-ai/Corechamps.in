"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { useCms } from "@/lib/cms-store";
import { formatMoney } from "@/lib/data";

export function ProductDetail({ slug }: { slug: string }) {
  const { data, addToCart } = useCms();
  const product = data.products.find((entry) => entry.slug === slug);
  const [variantId, setVariantId] = useState(product?.variants[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product?.images[0]?.src);
  const variant = useMemo(
    () => product?.variants.find((entry) => entry.id === variantId) || product?.variants[0],
    [product, variantId]
  );

  if (!product) {
    return (
      <section className="section-pad">
        <div className="container-wide">
          <h1 className="font-display text-5xl uppercase">Product not found</h1>
          <Link href="/collections/protein" className="mt-6 inline-block font-black uppercase text-ember">
            Back to supplements
          </Link>
        </div>
      </section>
    );
  }

  const image = activeImage || product.images[0]?.src;

  return (
    <section className="section-pad">
      <div className="container-wide">
        <Link
          href="/collections/protein"
          className="mb-8 inline-flex items-center gap-2 text-sm font-black uppercase text-black/60 hover:text-ember"
        >
          <ArrowLeft size={17} /> Back to supplements
        </Link>
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="bg-steel p-6">
              <div className="aspect-[4/5]">
                {image ? (
                  <img
                    src={image}
                    alt={product.title}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-black/5 font-bold text-black/40">
                    No image
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {product.images.map((item) => (
                <button
                  key={item.src}
                  onClick={() => setActiveImage(item.src)}
                  className={`h-24 w-24 shrink-0 border bg-steel p-2 ${
                    item.src === image ? "border-ember" : "border-black/10"
                  }`}
                  aria-label={`View ${product.title} image`}
                >
                  <img src={item.src} alt="" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-ember">
              {product.vendor}
            </p>
            <h1 className="mt-3 font-display text-6xl uppercase leading-none">
              {product.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-black/65">{product.summary}</p>
            <div className="mt-7 flex items-end gap-3">
              <span className="text-4xl font-black">
                {formatMoney(variant?.price || product.price, data.settings.currency)}
              </span>
              {product.compareAtPrice > product.price ? (
                <span className="pb-1 text-black/45 line-through">
                  {formatMoney(product.compareAtPrice, data.settings.currency)}
                </span>
              ) : null}
            </div>

            {product.variants.length > 1 ? (
              <label className="mt-7 block">
                <span className="text-xs font-black uppercase tracking-[0.2em]">
                  Flavor
                </span>
                <select
                  value={variantId}
                  onChange={(event) => setVariantId(event.target.value)}
                  className="focus-ring mt-2 h-12 w-full border border-black/15 px-3"
                >
                  {product.variants.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="flex h-14 border border-black/15">
                <button
                  className="focus-ring flex w-12 items-center justify-center"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={17} />
                </button>
                <span className="flex w-12 items-center justify-center border-x border-black/15 font-black">
                  {quantity}
                </span>
                <button
                  className="focus-ring flex w-12 items-center justify-center"
                  onClick={() => setQuantity((value) => value + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={17} />
                </button>
              </div>
              <button
                className="focus-ring inline-flex min-h-14 flex-1 items-center justify-center gap-2 bg-ember px-7 text-sm font-black uppercase text-white disabled:bg-black/25"
                disabled={!product.available || !variant?.available}
                onClick={() =>
                  addToCart({
                    slug: product.slug,
                    variantId: variant?.id,
                    title: product.title,
                    variantTitle: variant?.title,
                    price: variant?.price || product.price,
                    image,
                    quantity
                  })
                }
              >
                <ShoppingCart size={18} /> Add to cart
              </button>
            </div>

            <div className="mt-8 grid gap-3 border-y border-black/10 py-6 text-sm">
              <div className="flex justify-between">
                <span className="font-bold text-black/55">Availability</span>
                <span className="font-black">{product.available ? "In stock" : "Out of stock"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-black/55">Type</span>
                <span className="font-black">{product.type || "Supplement"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="prose-store mt-14 max-w-4xl whitespace-pre-line">
          <h2>Product details</h2>
          <p>{product.description}</p>
        </div>
      </div>
    </section>
  );
}
