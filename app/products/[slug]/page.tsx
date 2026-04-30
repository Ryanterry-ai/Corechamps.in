import type { Metadata } from "next";
import { ProductDetail } from "@/components/storefront/ProductDetail";
import { StoreShell } from "@/components/storefront/StoreShell";
import { getProduct, seed } from "@/lib/data";

export function generateStaticParams() {
  return seed.products.map((product) => ({ slug: product.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProduct(params.slug);
  return {
    title: product ? `${product.title} | CORE CHAMPS` : "Product | CORE CHAMPS"
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  return (
    <StoreShell>
      <ProductDetail slug={params.slug} />
    </StoreShell>
  );
}
