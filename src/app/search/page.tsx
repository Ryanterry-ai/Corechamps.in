// @ts-nocheck
import { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { safeJsonParse } from '@/lib/utils'
import ProductCard from '@/components/product/ProductCard'
import type { Product } from '@/types'

export const metadata: Metadata = { title: 'Search | CORE CHAMPS' }

interface Props { searchParams: { q?: string } }

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q?.trim() ?? ''
  let results: Product[] = []

  if (query.length >= 2) {
    try {
      const raw = await prisma.product.findMany({
        where: {
          visible: true,
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
            { shortDesc: { contains: query } },
            { tags: { contains: query } },
          ],
        },
        take: 24,
        orderBy: { createdAt: 'desc' },
      })
      results = raw.map((p) => ({
        ...p,
        images: safeJsonParse<string[]>(p.images, []),
        tags: safeJsonParse<string[]>(p.tags, []),
        variants: safeJsonParse(p.variants, []),
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })) as Product[]
    } catch { /* empty */ }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Search bar */}
      <form method="GET" action="/search" className="mb-10">
        <div className="flex gap-3 max-w-xl">
          <input
            name="q"
            defaultValue={query}
            placeholder="Search supplements, protein, pre-workout…"
            autoFocus
            className="flex-1 bg-brand-surface border border-brand-border text-white text-sm rounded-xl px-5 py-3.5 focus:outline-none focus:border-brand-primary placeholder-gray-600"
          />
          <button
            type="submit"
            className="bg-brand-primary hover:bg-brand-primary-dark text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {query ? (
        <>
          <h1 className="text-xl font-bold text-white mb-1">
            {results.length > 0
              ? `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
              : `No results for "${query}"`}
          </h1>
          {results.length === 0 && (
            <p className="text-gray-500 text-sm mt-2 mb-8">
              Try a different search term, or{' '}
              <a href="/collections/all" className="text-brand-primary hover:underline">browse all products</a>.
            </p>
          )}
          {results.length > 0 && (
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {results.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-500 text-sm">Enter a search term above to find products.</p>
      )}
    </div>
  )
}
