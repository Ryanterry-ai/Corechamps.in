import type { Metadata } from "next";
import { ContentPageView } from "@/components/storefront/ContentPageView";
import { StoreShell } from "@/components/storefront/StoreShell";
import { getPage, seed } from "@/lib/data";

export function generateStaticParams() {
  return seed.pages.map((page) => ({ slug: page.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = getPage(params.slug);
  return {
    title: page ? `${page.title} | CORE CHAMPS` : "Page | CORE CHAMPS"
  };
}

export default function PageRoute({ params }: { params: { slug: string } }) {
  return (
    <StoreShell>
      <ContentPageView slug={params.slug} />
    </StoreShell>
  );
}
