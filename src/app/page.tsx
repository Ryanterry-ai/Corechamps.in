// @ts-nocheck
import { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { safeJsonParse } from '@/lib/utils'
import HeroSection from '@/components/sections/HeroSection'
import CategoryCardsSection from '@/components/sections/CategoryCardsSection'
import FeaturedProductsSection from '@/components/sections/FeaturedProductsSection'
import BrandBanner from '@/components/sections/BrandBanner'
import TrustBar from '@/components/sections/TrustBar'
import type { Product, SectionContent } from '@/types'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'CORE CHAMPS | Bred To Be A Champion',
  description: 'Science-based sports nutrition supplements for muscle building, performance and recovery. Shop Whey Protein, Pre-Workout, BCAAs, Creatine and more.',
}

async function getHomeSections() {
  try {
    return await prisma.pageSection.findMany({
      where: { page: 'home', visible: true },
      orderBy: { order: 'asc' },
    })
  } catch { return [] }
}

async function getProducts(handles: string[]): Promise<Product[]> {
  if (!handles.length) return []
  try {
    const products = await prisma.product.findMany({
      where: { handle: { in: handles }, visible: true },
    })
    // preserve handle order
    return handles
      .map((h) => products.find((p) => p.handle === h))
      .filter(Boolean)
      .map((p) => ({
        ...p!,
        images: safeJsonParse<string[]>(p!.images, []),
        tags: safeJsonParse<string[]>(p!.tags, []),
        variants: safeJsonParse(p!.variants, []),
        createdAt: p!.createdAt.toISOString(),
        updatedAt: p!.updatedAt.toISOString(),
      })) as Product[]
  } catch { return [] }
}

export default async function HomePage() {
  const sections = await getHomeSections()

  const sectionElements = await Promise.all(
    sections.map(async (section) => {
      const content = safeJsonParse<SectionContent>(section.content, {})

      switch (section.type) {
        case 'hero':
          return <HeroSection key={section.id} {...content} />

        case 'category-cards':
          return <CategoryCardsSection key={section.id} title={content.title} cards={content.cards} />

        case 'featured-products': {
          const handles = content.productHandles ?? []
          const products = await getProducts(handles)
          return (
            <FeaturedProductsSection
              key={section.id}
              title={content.title}
              subtitle={content.subtitle}
              products={products}
              viewAllUrl={content.viewAllUrl as string}
            />
          )
        }

        case 'brand-banner':
          return <BrandBanner key={section.id} {...content} />

        case 'trust-bar':
          return <TrustBar key={section.id} />

        default:
          return null
      }
    })
  )

  // Inject trust bar after hero if not in sections
  const hasTrustBar = sections.some((s) => s.type === 'trust-bar')

  return (
    <>
      {sectionElements[0]}
      {!hasTrustBar && <TrustBar />}
      {sectionElements.slice(1)}
    </>
  )
}
