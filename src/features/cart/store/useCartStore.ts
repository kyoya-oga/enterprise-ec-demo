import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '../types'

export interface CartStore {
  items: CartItem[]
  isLoading: boolean
  error: string | null
  addItem: (item: CartItem) => Promise<void>
  removeItem: (id: number) => Promise<void>
  updateQuantity: (id: number, quantity: number) => Promise<void>
  clearCart: () => void
  clearError: () => void
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

// エラーハンドリング用のユーティリティ関数
const handleAsyncOperation = async <T>(
  operation: () => T,
  set: (partial: Partial<CartStore>) => void,
  errorMessage: string
): Promise<void> => {
  set({ isLoading: true, error: null })
  try {
    operation()
    set({ isLoading: false })
  } catch (error) {
    set({
      isLoading: false,
      error: error instanceof Error ? error.message : errorMessage
    })
  }
}

// 在庫チェック機能
const checkInventory = (productId: number, quantity: number): boolean => {
  // 実際のAPIコールの代わりに、モックロジックを実装
  // 商品ID 999は在庫切れとして扱う
  if (productId === 999) {
    throw new Error('在庫が不足しています')
  }
  return true
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      subtotal: 0,
      total: 0,
      itemCount: 0,
      
      addItem: async (item) => {
        await handleAsyncOperation(
          () => {
            // 在庫チェック
            checkInventory(item.productId, item.quantity)
            
            const state = get()
            const existingItem = state.items.find(i => i.id === item.id)
            
            let newItems: CartItem[]
            if (existingItem) {
              const newQuantity = existingItem.quantity + item.quantity
              // 在庫チェック（合計数量）
              checkInventory(item.productId, newQuantity)

              newItems = state.items.map(i =>
                i.id === item.id ? { ...i, quantity: newQuantity } : i
              )
            } else {
              newItems = [...state.items, item]
            }
            
            set({ items: newItems, ...calculateTotals(newItems) })
          },
          set,
          'カートに商品を追加できませんでした'
        )
      },
      
      removeItem: async (id) => {
        await handleAsyncOperation(
          () => {
            const state = get()
            const newItems = state.items.filter((item) => item.id !== id)
            set({ items: newItems, ...calculateTotals(newItems) })
          },
          set,
          '商品を削除できませんでした'
        )
      },
      
      updateQuantity: async (id, quantity) => {
        await handleAsyncOperation(
          () => {
            const state = get()
            const targetItem = state.items.find(item => item.id === id)
            
            // 在庫チェック
            if (quantity > 0 && targetItem) {
              checkInventory(targetItem.productId, quantity)
            }
            
            const newItems = state.items
              .map((item) =>
                item.id === id ? { ...item, quantity } : item
              )
              .filter((item) => item.quantity > 0)
            set({ items: newItems, ...calculateTotals(newItems) })
          },
          set,
          '数量を更新できませんでした'
        )
      },
      
      clearCart: () => set({ 
        items: [], 
        subtotal: 0, 
        total: 0, 
        itemCount: 0,
        isLoading: false,
        error: null 
      }),
      
      clearError: () => set({ error: null }),
    }),
    { 
      name: 'cart-storage',
      // エラーやローディング状態は永続化しない
      partialize: (state) => ({ items: state.items })
    }
  )
)
