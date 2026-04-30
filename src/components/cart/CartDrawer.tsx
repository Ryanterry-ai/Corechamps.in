'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, itemCount } = useCart()

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-overlay" onClick={closeCart} aria-hidden />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#111111] z-50 flex flex-col shadow-2xl border-l border-brand-border">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border">
          <h2 className="text-lg font-bold text-white uppercase tracking-wide">
            Your Cart
            {itemCount > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-400">({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
            )}
          </h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-600">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <p className="text-gray-400 text-sm">Your cart is empty</p>
              <button
                onClick={closeCart}
                className="text-brand-primary text-sm font-semibold hover:underline"
              >
                Continue Shopping →
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 py-4 border-b border-brand-border last:border-0">
                {/* Image */}
                <div className="w-20 h-20 rounded-lg bg-brand-surface border border-brand-border flex-shrink-0 overflow-hidden relative">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No img</div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.handle}`}
                    onClick={closeCart}
                    className="text-sm font-semibold text-white hover:text-brand-primary transition-colors line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  {item.variantTitle && (
                    <p className="text-xs text-gray-500 mt-0.5">{item.variantTitle}</p>
                  )}
                  <p className="text-brand-primary font-bold text-sm mt-1">
                    {formatPrice(item.price)}
                  </p>

                  {/* Qty controls */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-brand-border rounded-md overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-surface transition-colors text-lg leading-none"
                        aria-label="Decrease quantity"
                      >−</button>
                      <span className="w-8 text-center text-sm font-semibold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-8 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-surface transition-colors text-lg leading-none disabled:opacity-30"
                        aria-label="Increase quantity"
                      >+</button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                      aria-label="Remove item"
                    >Remove</button>
                  </div>
                </div>

                {/* Line total */}
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-white">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-brand-border space-y-4 bg-[#0f0f0f]">
            {/* Subtotal */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span className="font-bold text-white text-base">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-gray-500">Taxes and shipping calculated at checkout</p>

            {/* Snapmint badge */}
            <div className="bg-brand-surface border border-brand-border rounded-lg px-3 py-2 text-xs text-gray-400 flex items-center gap-2">
              <span className="text-brand-primary font-bold text-sm">0%</span>
              EMI available via Snapmint · No cost EMI on eligible orders
            </div>

            {/* Checkout */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-brand-primary hover:bg-brand-primary-dark text-white text-center font-bold text-sm uppercase tracking-widest py-4 rounded-lg transition-colors"
            >
              Proceed to Checkout
            </Link>

            <button
              onClick={closeCart}
              className="block w-full text-center text-sm text-gray-400 hover:text-white transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
