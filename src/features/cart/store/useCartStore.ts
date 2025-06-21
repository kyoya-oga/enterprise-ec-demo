import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '../types'

export interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  subtotal: number
  total: number
  itemCount: number
}

const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  return { subtotal, total, itemCount }
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      total: 0,
      itemCount: 0,
      addItem: (item) =>
        set((state) => {
          const newItems = [...state.items, item]
          return { items: newItems, ...calculateTotals(newItems) }
        }),
      removeItem: (id) =>
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== id)
          return { items: newItems, ...calculateTotals(newItems) }
        }),
      updateQuantity: (id, quantity) =>
        set((state) => {
          const newItems = state.items
            .map((item) =>
              item.id === id ? { ...item, quantity } : item
            )
            .filter((item) => item.quantity > 0)
          return { items: newItems, ...calculateTotals(newItems) }
        }),
      clearCart: () => set({ items: [], subtotal: 0, total: 0, itemCount: 0 }),
    }),
    { name: 'cart-storage' }
  )
)
