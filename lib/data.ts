import seedData from "@/data/seed.json";
import type { Collection, ContentPage, Product, StoreData } from "@/lib/types";

export const seed = seedData as StoreData;

export function formatMoney(value: number, currency = seed.settings.currency) {
  const locale = currency === "INR" ? "en-IN" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency
  }).format(value || 0);
}

export function getPublishedProducts(data: StoreData = seed): Product[] {
  return data.products.filter((product) => product.status === "published");
}

export function getProduct(slug: string, data: StoreData = seed): Product | undefined {
  return data.products.find((product) => product.slug === slug);
}

export function getCollection(slug: string, data: StoreData = seed): Collection | undefined {
  return data.collections.find((collection) => collection.slug === slug);
}

export function getPage(slug: string, data: StoreData = seed): ContentPage | undefined {
  return data.pages.find((page) => page.slug === slug);
}

export function productsForCollection(collection: Collection, data: StoreData = seed): Product[] {
  const productMap = new Map(data.products.map((product) => [product.slug, product]));
  return collection.productSlugs
    .map((slug) => productMap.get(slug))
    .filter((product): product is Product => Boolean(product));
}
