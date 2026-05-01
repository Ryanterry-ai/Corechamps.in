"use client";

import Link from "next/link";
import { useMemo } from "react";
import { formatMoney } from "@/lib/data";
import { useCms } from "@/lib/cms-store";
import type { Product } from "@/lib/types";

function HomeMiniCard({ product, currency }: { product: Product; currency: string }) {
  const imagePrimary = product.images[0]?.src;
  const imageSecondary = product.images[1]?.src;

  return (
    <article className="group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative bg-transparent px-4 pb-5 pt-2">
          <div className="relative mx-auto h-[280px] w-full overflow-hidden sm:h-[320px]">
            {imagePrimary ? (
              <img
                src={imagePrimary}
                alt={product.title}
                className={`absolute inset-0 h-full w-full object-contain transition-all duration-500 ${
                  imageSecondary ? "group-hover:opacity-0" : "group-hover:scale-105"
                }`}
              />
            ) : null}

            {imageSecondary ? (
              <img
                src={imageSecondary}
                alt={product.title}
                className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            ) : null}

            {!product.available ? (
              <span className="absolute right-[14%] top-[40%] inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#cf3845]/85 text-center text-xs font-semibold uppercase tracking-[0.02em] text-white">
                Out of
                <br />
                stock
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      <div className="px-2 pb-2 text-center">
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 min-h-[44px] text-[15px] font-medium uppercase tracking-[0.02em] text-[#3a3a3a] hover:text-black sm:text-[20px]"
        >
          {product.title}
        </Link>
        <p className="mt-2 text-[16px] font-semibold text-[#cf3845] sm:text-[32px]">
          {formatMoney(product.price, currency)}
        </p>
      </div>
    </article>
  );
}

export function StorefrontHome() {
  const { data } = useCms();

  const heroSlides =
    (data.settings.heroSlides || []).filter((slide) => slide.image || slide.video) || [];
  const primaryHero = heroSlides[0];

  const getProductsBySlugs = useMemo(
    () => (slugs: string[]) =>
      slugs
        .map((slug) => data.products.find((product) => product.slug === slug))
        .filter(Boolean) as Product[],
    [data.products]
  );

  const homepageSections = useMemo(
    () => [
      {
        id: "hot-selling",
        title: "Hot Selling Products with Free Shipping",
        subtitle: "Hot off the shelves! Grab it before it's gone",
        collectionHref: "/collections/protein",
        bgClass: "bg-[#ececec]",
        viewAll: false,
        products: getProductsBySlugs([
          "isolate-whey",
          "rdx-pre-workout",
          "eaa-essential-amino-acids",
          "whey"
        ])
      },
      {
        id: "pre-workout",
        title: "Pre workout supplements",
        subtitle: "Premium Supplements Brand",
        collectionHref: "/collections/pre-workout",
        bgClass: "bg-white",
        viewAll: true,
        products: getProductsBySlugs([
          "rdx-pre-workout",
          "nitric-oxide",
          "agmatine-750mg",
          "l-citrulline"
        ])
      },
      {
        id: "muscle-building",
        title: "Muscle Building",
        subtitle: "The secret ingredient to muscle magic",
        collectionHref: "/collections/muscle-building",
        bgClass: "bg-[#ececec]",
        viewAll: false,
        products: getProductsBySlugs([
          "isolate-whey",
          "whey",
          "mass-gainer-6-lbs",
          "mass-gainer-15-lbs"
        ])
      },
      {
        id: "healthy-lifestyle",
        title: "Healthy Lifestyle",
        subtitle: "Vitamin & Mineral Supplements for A Healthy Lifestyle",
        collectionHref: "/collections/healthy-wellness",
        bgClass: "bg-white",
        viewAll: false,
        products: getProductsBySlugs([
          "multivitamin-90-tablets-usa-version",
          "zmb6",
          "omega-3-usa-version",
          "liver-support"
        ])
      }
    ],
    [getProductsBySlugs]
  );

  const categoryTiles = [
    {
      label: "FAT BURNERS",
      href: "/collections/weight-management",
      image: "/media/imported/shred-n-burn-core-champs-shred-n-burn-60-capsules-991d4dd6.png"
    },
    {
      label: "PRE-WORKOUTS",
      href: "/collections/pre-workout",
      image: "/media/imported/rdx-pre-workout-rdx-blue-raspberry-ed8c786b.png"
    },
    {
      label: "MUSCLE BUILDERS",
      href: "/collections/muscle-building",
      image: "/media/imported/eaa-essential-amino-acids-eaa-fruit-punch-transparent-5e647c5e.png"
    }
  ];

  return (
    <>
      <section className="relative h-[160px] overflow-hidden bg-black sm:h-[300px] lg:h-[600px]">
        {primaryHero?.image ? (
          <img
            src={primaryHero.image}
            alt={primaryHero.title || "Core Champs banner"}
            className="h-full w-full object-cover"
          />
        ) : null}
      </section>

      <section className="bg-[#f1f1f1] py-8 lg:py-10">
        <div className="container-wide mt-6 grid gap-4 md:grid-cols-3 lg:gap-6">
          {categoryTiles.map((tile) => (
            <Link key={tile.label} href={tile.href} className="group relative block overflow-hidden bg-[#111318]">
              <div className="relative h-[340px] lg:h-[520px]">
                <img
                  src={tile.image}
                  alt={tile.label}
                  className="h-full w-full object-contain p-6 transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/72 px-6 py-4">
                  <span className="text-[28px] font-bold uppercase tracking-[0.02em] text-white lg:text-[42px]">
                    {tile.label}
                  </span>
                  <span className="text-[44px] leading-none text-white lg:text-[56px]">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {homepageSections.map((section) => (
        <section
          key={section.id}
          className={`${section.bgClass} py-16 sm:py-20 lg:pb-24 lg:pt-40`}
        >
          <div className="container-wide">
            <div className="mb-10 text-center">
              <h2 className="text-[15px] font-normal tracking-[0.01em] text-[#232323] sm:text-[23px] lg:text-[38px] lg:leading-[42px] lg:tracking-[1px]">
                {section.title}
              </h2>
              {section.subtitle ? (
                <p className="mt-2 text-[12px] text-[#4f4f4f] sm:text-[16px] lg:hidden">
                  {section.subtitle}
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-10 lg:grid-cols-4">
              {section.products.map((product) => (
                <HomeMiniCard
                  key={`${section.id}-${product.slug}`}
                  product={product}
                  currency={data.settings.currency}
                />
              ))}
            </div>

            {section.viewAll ? (
              <div className="mt-10 text-center">
                <Link
                  href={section.collectionHref}
                  className="inline-flex items-center border border-[#cf3845] px-6 py-3 text-[14px] font-medium uppercase tracking-[0.04em] text-[#cf3845] hover:bg-[#cf3845] hover:text-white"
                >
                  View All
                </Link>
              </div>
            ) : null}
          </div>
        </section>
      ))}
    </>
  );
}
