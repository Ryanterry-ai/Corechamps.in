// @ts-nocheck
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { safeJsonParse } from '@/lib/utils'
import ProductDetailClient from '@/components/product/ProductDetailClient'
import ProductCard from '@/components/product/ProductCard'
import type { Product, ProductVariant } from '@/types'

export const revalidate = 60

interface Props { params: { handle: string } }

async function getProduct(handle: string): Promise<Product | null> {
  try {
    const p = await prisma.product.findUnique({
      where: { handle },
      include: { collection: true },
    })
    if (!p) return null
    return {
      ...p,
      images: safeJsonParse<string[]>(p.images, []),
      tags: safeJsonParse<string[]>(p.tags, []),
      variants: safeJsonParse<ProductVariant[]>(p.variants, []),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    } as Product
  } catch { return null }
}

async function getRelated(product: Product): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        visible: true,
        handle: { not: product.handle },
        collectionId: product.collectionId ?? undefined,
      },
      take: 4,
    })
    return products.map((p) => ({
      ...p,
      images: safeJsonParse<string[]>(p.images, []),
      tags: safeJsonParse<string[]>(p.tags, []),
      variants: safeJsonParse<ProductVariant[]>(p.variants, []),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    })) as Product[]
  } catch { return [] }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.handle)
  if (!product) return { title: 'Not Found' }
  return {
    title: `${product.name} | CORE CHAMPS`,
    description: product.seoDesc || product.shortDesc,
    openGraph: { images: product.images[0] ? [product.images[0]] : [] },
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.handle)
  if (!product) notFound()
  const related = await getRelated(product)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-8 flex items-center gap-2">
        <a href="/" className="hover:text-brand-primary transition-colors">Home</a>
        <span>/</span>
        {product.collection && (
          <>
            <a href={`/collections/${product.collection.handle}`} className="hover:text-brand-primary transition-colors">
              {product.collection.name}
            </a>
            <span>/</span>
          </>
        )}
        <span className="text-gray-300 truncate max-w-[200px]">{product.name}</span>
      </nav>

      <ProductDetailClient product={product} />

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-8">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
