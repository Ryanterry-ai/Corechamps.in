'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartState, CartItem, Product, ProductVariant } from '@/types'
import { cartLineId } from '@/lib/utils'

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      get subtotal() {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },
      get itemCount() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (product: Product, variant?: ProductVariant, qty = 1) => {
        const id = cartLineId(product.id, variant?.id)
        const price = variant?.price ?? product.price
        const image = (variant?.image ?? product.images[0]) || ''
        const variantTitle = variant?.title

        set((state) => {
          const existing = state.items.find((i) => i.id === id)
          const stock = variant?.stock ?? product.stock
          if (existing) {
            const newQty = Math.min(existing.quantity + qty, stock)
            return {
              items: state.items.map((i) =>
                i.id === id ? { ...i, quantity: newQty } : i
              ),
              isOpen: true,
            }
          }
          const newItem: CartItem = {
            id,
            productId: product.id,
            variantId: variant?.id,
            name: product.name,
            variantTitle,
            price,
            quantity: qty,
            image,
            handle: product.handle,
            stock,
          }
          return { items: [...state.items, newItem], isOpen: true }
        })
      },

      removeItem: (id: string) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id: string, qty: number) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) =>
                  i.id === id
                    ? { ...i, quantity: Math.min(qty, i.stock) }
                    : i
                ),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'corechamps-cart',
      skipHydration: false,
    }
  )
)
