import type { Metadata } from "next";
import { CollectionView } from "@/components/storefront/CollectionView";
import { StoreShell } from "@/components/storefront/StoreShell";
import { getCollection, seed } from "@/lib/data";

export function generateStaticParams() {
  return seed.collections.map((collection) => ({ slug: collection.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const collection = getCollection(params.slug);
  return {
    title: collection ? `${collection.title} | CORE CHAMPS` : "Collection | CORE CHAMPS"
  };
}

export default function CollectionPage({ params }: { params: { slug: string } }) {
  return (
    <StoreShell>
      <CollectionView slug={params.slug} />
    </StoreShell>
  );
}
