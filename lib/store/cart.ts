"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CartItem = {
  productId: string
  slug: string
  name: string
  /** Precio unitario (con descuento aplicado si tenía sale). */
  unitPrice: number
  image: string | null
  /** Stock máximo conocido al añadir. Solo informativo. */
  stockAtAdd: number
  quantity: number
}

type CartState = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void
  setQuantity: (productId: string, qty: number) => void
  removeItem: (productId: string) => void
  clear: () => void
  /** Conteo total de unidades. */
  count: () => number
  subtotal: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.productId === item.productId)
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: clamp(i.quantity + qty, 1, item.stockAtAdd || 999) }
                  : i,
              ),
            }
          }
          return { items: [...s.items, { ...item, quantity: clamp(qty, 1, item.stockAtAdd || 999) }] }
        }),

      setQuantity: (productId, qty) =>
        set((s) => ({
          items: s.items
            .map((i) =>
              i.productId === productId
                ? { ...i, quantity: clamp(qty, 0, i.stockAtAdd || 999) }
                : i,
            )
            .filter((i) => i.quantity > 0),
        })),

      removeItem: (productId) =>
        set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),

      clear: () => set({ items: [] }),

      count: () => get().items.reduce((a, i) => a + i.quantity, 0),
      subtotal: () => get().items.reduce((a, i) => a + i.unitPrice * i.quantity, 0),
    }),
    {
      name: "maraya-cart",
      partialize: (s) => ({ items: s.items }),
    },
  ),
)

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}
