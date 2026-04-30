// @ts-nocheck
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { safeJsonParse } from '@/lib/utils'
import ProductCard from '@/components/product/ProductCard'
import type { Product } from '@/types'

export const revalidate = 60

interface Props {
  params: { handle: string }
  searchParams: { sort?: string }
}

async function getCollection(handle: string) {
  try {
    if (handle === 'all') {
      const products = await prisma.product.findMany({
        where: { visible: true },
        orderBy: { createdAt: 'desc' },
      })
      return {
        name: 'All Products',
        description: 'Browse the complete Core Champs supplement range.',
        image: '',
        products,
      }
    }
    const col = await prisma.collection.findUnique({
      where: { handle },
      include: { products: { where: { visible: true } } },
    })
    return col
  } catch { return null }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const col = await getCollection(params.handle)
  if (!col) return { title: 'Not Found' }
  return {
    title: `${col.name} | CORE CHAMPS`,
    description: col.description || `Shop ${col.name} supplements at CORE CHAMPS.`,
  }
}

function sortProducts(products: Product[], sort?: string): Product[] {
  switch (sort) {
    case 'price-asc': return [...products].sort((a, b) => a.price - b.price)
    case 'price-desc': return [...products].sort((a, b) => b.price - a.price)
    case 'name-asc': return [...products].sort((a, b) => a.name.localeCompare(b.name))
    default: return products
  }
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const col = await getCollection(params.handle)
  if (!col) notFound()

  const rawProducts = col.products.map((p) => ({
    ...p,
    images: safeJsonParse<string[]>(p.images, []),
    tags: safeJsonParse<string[]>(p.tags, []),
    variants: safeJsonParse(p.variants, []),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  })) as Product[]

  const products = sortProducts(rawProducts, searchParams.sort)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-2">
          {col.name}
        </h1>
        {col.description && (
          <p className="text-gray-400 text-sm max-w-2xl">{col.description}</p>
        )}
        <p className="text-gray-500 text-xs mt-2">{products.length} product{products.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Sort */}
      <div className="flex justify-end mb-6">
        <form>
          <select
            name="sort"
            defaultValue={searchParams.sort ?? ''}
            onChange={(e) => { (e.target.form as HTMLFormElement).submit() }}
            className="bg-brand-surface border border-brand-border text-sm text-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-primary"
          >
            <option value="">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A–Z</option>
          </select>
        </form>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="text-center py-24 text-gray-500">No products found in this collection.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
