import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import type { Product } from '@/types'

interface FeaturedProductsSectionProps {
  title?: string
  subtitle?: string
  products: Product[]
  viewAllUrl?: string
  viewAllLabel?: string
}

export default function FeaturedProductsSection({
  title = 'FEATURED PRODUCTS',
  subtitle,
  products,
  viewAllUrl = '/collections/all',
  viewAllLabel = 'View All Products',
}: FeaturedProductsSectionProps) {
  if (!products.length) return null

  return (
    <section className="py-16 sm:py-20 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            {subtitle && (
              <p className="text-brand-primary text-xs font-bold uppercase tracking-widest mb-2">
                {subtitle}
              </p>
            )}
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              {title}
            </h2>
          </div>
          <Link
            href={viewAllUrl}
            className="text-sm text-gray-400 hover:text-brand-primary transition-colors font-semibold flex items-center gap-1 whitespace-nowrap"
          >
            {viewAllLabel}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
