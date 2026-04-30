'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useCart } from '@/store/cartStore'
import { formatPrice, discountPercent } from '@/lib/utils'
import type { Product, ProductVariant } from '@/types'

interface Props { product: Product }

export default function ProductDetailClient({ product }: Props) {
  const { addItem } = useCart()
  const [activeImage, setActiveImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants[0]
  )
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'usage' | 'allergen'>('description')

  const price = selectedVariant?.price ?? product.price
  const comparePrice = selectedVariant?.comparePrice ?? product.comparePrice
  const stock = selectedVariant?.stock ?? product.stock
  const discount = discountPercent(price, comparePrice)

  const handleAddToCart = () => {
    addItem(product, selectedVariant, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const images = product.images.length ? product.images : ['/images/placeholder-product.jpg']

  // Group variant options
  const optionKeys = product.variants.length
    ? Object.keys(product.variants[0]?.options ?? {})
    : []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
      {/* Gallery */}
      <div className="space-y-3">
        {/* Main image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-brand-surface border border-brand-border">
          <Image
            src={images[activeImage]}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {discount && (
            <div className="absolute top-4 left-4 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full">
              -{discount}% OFF
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                  activeImage === i ? 'border-brand-primary' : 'border-brand-border hover:border-brand-primary/50'
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase leading-tight tracking-tight">
            {product.name}
          </h1>
          {product.shortDesc && (
            <p className="text-gray-400 text-sm mt-2">{product.shortDesc}</p>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-black text-brand-primary">{formatPrice(price)}</span>
          {comparePrice && comparePrice > price && (
            <span className="text-base text-gray-500 line-through">{formatPrice(comparePrice)}</span>
          )}
          {discount && (
            <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
              Save {formatPrice(comparePrice! - price)}
            </span>
          )}
        </div>

        {/* Stock */}
        <div className="flex items-center gap-2 text-sm">
          {stock > 10 ? (
            <><span className="w-2 h-2 bg-green-400 rounded-full" /><span className="text-green-400">In Stock</span></>
          ) : stock > 0 ? (
            <><span className="w-2 h-2 bg-yellow-400 rounded-full" /><span className="text-yellow-400">Low Stock — {stock} left</span></>
          ) : (
            <><span className="w-2 h-2 bg-red-500 rounded-full" /><span className="text-red-400">Out of Stock</span></>
          )}
        </div>

        {/* Variants */}
        {optionKeys.map((key) => {
          const values = [...new Set(product.variants.map((v) => v.options[key]))]
          return (
            <div key={key}>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                {key}: <span className="text-white">{selectedVariant?.options[key]}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {values.map((val) => {
                  const v = product.variants.find((x) => x.options[key] === val)
                  const isSelected = selectedVariant?.options[key] === val
                  return (
                    <button
                      key={val}
                      onClick={() => v && setSelectedVariant(v)}
                      disabled={!v || v.stock === 0}
                      className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all ${
                        isSelected
                          ? 'border-brand-primary bg-brand-primary/10 text-white'
                          : 'border-brand-border text-gray-400 hover:border-brand-primary/50 hover:text-white'
                      } disabled:opacity-30 disabled:cursor-not-allowed`}
                    >
                      {val}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Qty */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Quantity</p>
          <div className="inline-flex items-center border border-brand-border rounded-lg overflow-hidden">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-surface text-xl transition-colors"
            >−</button>
            <span className="w-12 text-center font-bold text-white">{qty}</span>
            <button
              onClick={() => setQty(Math.min(stock, qty + 1))}
              disabled={qty >= stock}
              className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-surface text-xl transition-colors disabled:opacity-30"
            >+</button>
          </div>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={stock === 0}
          className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all duration-200 ${
            added
              ? 'bg-green-500 text-white'
              : stock === 0
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-brand-primary hover:bg-brand-primary-dark text-white hover:shadow-[0_0_24px_rgba(255,107,0,0.4)]'
          }`}
        >
          {added ? '✓ Added to Cart!' : stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>

        {/* Snapmint EMI */}
        <div className="bg-brand-surface border border-brand-border rounded-xl px-4 py-3 text-xs text-gray-400">
          <span className="text-brand-primary font-bold">0% EMI</span> available via Snapmint
          · Pay in easy installments · No cost EMI on eligible orders
        </div>

        {/* Share */}
        <div className="flex items-center gap-3 pt-2">
          <span className="text-xs text-gray-500 uppercase tracking-widest">Share:</span>
          {['Facebook', 'Twitter', 'WhatsApp'].map((s) => (
            <a
              key={s}
              href="#"
              className="text-xs text-gray-400 hover:text-brand-primary transition-colors font-semibold"
            >
              {s}
            </a>
          ))}
        </div>

        {/* Tabs */}
        <div className="border-t border-brand-border pt-6">
          <div className="flex gap-0 border-b border-brand-border mb-4">
            {(['description', 'usage', 'allergen'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
                  activeTab === tab
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab === 'usage' ? 'Suggested Use' : tab === 'allergen' ? 'Allergen Info' : 'Description'}
              </button>
            ))}
          </div>

          <div className="text-sm text-gray-400 leading-relaxed">
            {activeTab === 'description' && <p>{product.description}</p>}
            {activeTab === 'usage' && (
              product.suggestedUse
                ? <p>{product.suggestedUse}</p>
                : <p className="text-gray-600">No usage information available.</p>
            )}
            {activeTab === 'allergen' && (
              product.allergenInfo
                ? <p>{product.allergenInfo}</p>
                : <p className="text-gray-600">No allergen information available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
