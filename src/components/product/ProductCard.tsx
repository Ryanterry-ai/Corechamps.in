'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/store/cartStore'
import { formatPrice, discountPercent } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const discount = discountPercent(product.price, product.comparePrice)
  const mainImage = product.images[0] || ''
  const hoverImage = product.images[1] || mainImage

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
  }

  return (
    <div className="group relative bg-brand-surface border border-brand-border rounded-xl overflow-hidden hover:border-brand-primary/50 transition-all duration-300 hover:shadow-[0_0_24px_rgba(255,107,0,0.15)]">
      <Link href={`/products/${product.handle}`} className="block">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-[#1a1a1a]">
          {mainImage ? (
            <>
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-0"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {hoverImage && (
                <Image
                  src={hoverImage}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount && (
              <span className="bg-brand-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                -{discount}%
              </span>
            )}
            {product.stock <= 10 && product.stock > 0 && (
              <span className="bg-yellow-500/90 text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Low Stock
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-gray-700 text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Sold Out
              </span>
            )}
          </div>

          {/* Add to cart overlay on hover */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-brand-primary hover:bg-brand-primary-dark disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-widest py-3 transition-colors"
            >
              {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-sm font-bold text-white leading-tight line-clamp-2 group-hover:text-brand-primary transition-colors mb-2">
            {product.name}
          </h3>
          {product.shortDesc && (
            <p className="text-xs text-gray-500 line-clamp-1 mb-2">{product.shortDesc}</p>
          )}
          <div className="flex items-baseline gap-2">
            <span className="text-base font-black text-brand-primary">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-xs text-gray-500 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
