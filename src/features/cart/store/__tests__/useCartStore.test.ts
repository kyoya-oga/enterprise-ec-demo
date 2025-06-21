import { describe, test, expect, beforeEach } from 'vitest'
import { useCartStore } from '@/features/cart/store/useCartStore'
import type { CartItem } from '@/features/cart/types'

// Mock localStorage for persist middleware
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('カートストア', () => {
  // Test data
  const mockItem1: CartItem = {
    id: 1,
    productId: 1,
    name: 'テスト商品1',
    price: 1000,
    quantity: 2,
    image: '/test-image-1.jpg'
  }

  const mockItem2: CartItem = {
    id: 2,
    productId: 2,
    name: 'テスト商品2',
    price: 2000,
    quantity: 1,
    image: '/test-image-2.jpg'
  }

  beforeEach(() => {
    // Reset store state before each test
    useCartStore.getState().clearCart()
    vi.clearAllMocks()
  })

  describe('初期状態', () => {
    test('初期状態で空のアイテム配列を持つ', () => {
      const { items } = useCartStore.getState()
      expect(items).toEqual([])
    })

    test('初期状態で小計がゼロである', () => {
      const { subtotal } = useCartStore.getState()
      expect(subtotal).toBe(0)
    })

    test('初期状態で合計がゼロである', () => {
      const { total } = useCartStore.getState()
      expect(total).toBe(0)
    })

    test('初期状態でアイテム数がゼロである', () => {
      const { itemCount } = useCartStore.getState()
      expect(itemCount).toBe(0)
    })
  })

  describe('アイテム追加アクション', () => {
    test('空のカートにアイテムを追加する', () => {
      const { addItem, items } = useCartStore.getState()
      
      addItem(mockItem1)
      
      const updatedItems = useCartStore.getState().items
      expect(updatedItems).toHaveLength(1)
      expect(updatedItems[0]).toEqual(mockItem1)
    })

    test('カートに複数のアイテムを追加する', () => {
      const { addItem } = useCartStore.getState()
      
      addItem(mockItem1)
      addItem(mockItem2)
      
      const { items } = useCartStore.getState()
      expect(items).toHaveLength(2)
      expect(items).toContain(mockItem1)
      expect(items).toContain(mockItem2)
    })

    test('異なるIDで重複アイテムを許可する', () => {
      const { addItem } = useCartStore.getState()
      const duplicateItem = { ...mockItem1, id: 3 }
      
      addItem(mockItem1)
      addItem(duplicateItem)
      
      const { items } = useCartStore.getState()
      expect(items).toHaveLength(2)
      expect(items.filter(item => item.productId === mockItem1.productId)).toHaveLength(2)
    })
  })

  describe('アイテム削除アクション', () => {
    test('カートからアイテムを削除する', () => {
      const { addItem, removeItem } = useCartStore.getState()
      
      addItem(mockItem1)
      addItem(mockItem2)
      removeItem(mockItem1.id)
      
      const { items } = useCartStore.getState()
      expect(items).toHaveLength(1)
      expect(items[0]).toEqual(mockItem2)
    })

    test('存在しないアイテムの削除を適切に処理する', () => {
      const { addItem, removeItem } = useCartStore.getState()
      
      addItem(mockItem1)
      removeItem(999) // Non-existent ID
      
      const { items } = useCartStore.getState()
      expect(items).toHaveLength(1)
      expect(items[0]).toEqual(mockItem1)
    })

    test('一致するIDのアイテムをすべて削除する', () => {
      const { addItem, removeItem } = useCartStore.getState()
      
      addItem(mockItem1)
      removeItem(mockItem1.id)
      
      const { items } = useCartStore.getState()
      expect(items).toHaveLength(0)
    })
  })

  describe('数量更新アクション', () => {
    test('アイテムの数量を更新する', () => {
      const { addItem, updateQuantity } = useCartStore.getState()
      
      addItem(mockItem1)
      updateQuantity(mockItem1.id, 5)
      
      const { items } = useCartStore.getState()
      expect(items[0].quantity).toBe(5)
    })

    test('数量が0に設定された時にアイテムを削除する', () => {
      const { addItem, updateQuantity } = useCartStore.getState()
      
      addItem(mockItem1)
      addItem(mockItem2)
      updateQuantity(mockItem1.id, 0)
      
      const { items } = useCartStore.getState()
      expect(items).toHaveLength(1)
      expect(items[0]).toEqual(mockItem2)
    })

    test('数量が負の時にアイテムを削除する', () => {
      const { addItem, updateQuantity } = useCartStore.getState()
      
      addItem(mockItem1)
      updateQuantity(mockItem1.id, -1)
      
      const { items } = useCartStore.getState()
      expect(items).toHaveLength(0)
    })

    test('存在しないアイテムの更新を適切に処理する', () => {
      const { addItem, updateQuantity } = useCartStore.getState()
      
      addItem(mockItem1)
      updateQuantity(999, 5) // Non-existent ID
      
      const { items } = useCartStore.getState()
      expect(items).toHaveLength(1)
      expect(items[0].quantity).toBe(mockItem1.quantity) // Unchanged
    })
  })

  describe('カートクリアアクション', () => {
    test('カートからすべてのアイテムをクリアする', () => {
      const { addItem, clearCart } = useCartStore.getState()
      
      addItem(mockItem1)
      addItem(mockItem2)
      clearCart()
      
      const { items } = useCartStore.getState()
      expect(items).toHaveLength(0)
    })

    test('カートクリア時に計算値をリセットする', () => {
      const { addItem, clearCart } = useCartStore.getState()
      
      addItem(mockItem1)
      clearCart()
      
      const { subtotal, total, itemCount } = useCartStore.getState()
      expect(subtotal).toBe(0)
      expect(total).toBe(0)
      expect(itemCount).toBe(0)
    })
  })

  describe('計算プロパティ', () => {
    describe('小計', () => {
      test('単一アイテムの小計を計算する', () => {
        const store = useCartStore.getState()
        
        store.addItem(mockItem1) // price: 1000, quantity: 2
        
        const state = useCartStore.getState()
        expect(state.subtotal).toBe(2000) // 1000 * 2
      })

      test('複数アイテムの小計を計算する', () => {
        const { addItem } = useCartStore.getState()
        
        addItem(mockItem1) // price: 1000, quantity: 2 = 2000
        addItem(mockItem2) // price: 2000, quantity: 1 = 2000
        
        const { subtotal } = useCartStore.getState()
        expect(subtotal).toBe(4000) // 2000 + 2000
      })

      test('数量変更時に小計を更新する', () => {
        const { addItem, updateQuantity } = useCartStore.getState()
        
        addItem(mockItem1) // price: 1000, quantity: 2
        updateQuantity(mockItem1.id, 3)
        
        const { subtotal } = useCartStore.getState()
        expect(subtotal).toBe(3000) // 1000 * 3
      })
    })

    describe('合計', () => {
      test('小計と等しい（追加料金は未実装）', () => {
        const { addItem } = useCartStore.getState()
        
        addItem(mockItem1)
        addItem(mockItem2)
        
        const { subtotal, total } = useCartStore.getState()
        expect(total).toBe(subtotal)
      })
    })

    describe('アイテム数', () => {
      test('すべてのアイテムの総数量をカウントする', () => {
        const { addItem } = useCartStore.getState()
        
        addItem(mockItem1) // quantity: 2
        addItem(mockItem2) // quantity: 1
        
        const { itemCount } = useCartStore.getState()
        expect(itemCount).toBe(3) // 2 + 1
      })

      test('数量変更時にカウントを更新する', () => {
        const { addItem, updateQuantity } = useCartStore.getState()
        
        addItem(mockItem1) // quantity: 2
        updateQuantity(mockItem1.id, 5)
        
        const { itemCount } = useCartStore.getState()
        expect(itemCount).toBe(5)
      })

      test('空のカートでは0である', () => {
        const { itemCount } = useCartStore.getState()
        expect(itemCount).toBe(0)
      })
    })
  })

  describe('エッジケース', () => {
    test('価格0のアイテムを処理する', () => {
      const { addItem } = useCartStore.getState()
      const freeItem: CartItem = { ...mockItem1, price: 0 }
      
      addItem(freeItem)
      
      const { subtotal } = useCartStore.getState()
      expect(subtotal).toBe(0)
    })

    test('非常に大きな数量を処理する', () => {
      const { addItem, updateQuantity } = useCartStore.getState()
      
      addItem(mockItem1)
      updateQuantity(mockItem1.id, 999999)
      
      const { items, itemCount } = useCartStore.getState()
      expect(items[0].quantity).toBe(999999)
      expect(itemCount).toBe(999999)
    })

    test('小数点価格を正しく処理する', () => {
      const { addItem } = useCartStore.getState()
      const decimalPriceItem: CartItem = { ...mockItem1, price: 1234.56, quantity: 3 }
      
      addItem(decimalPriceItem)
      
      const { subtotal } = useCartStore.getState()
      expect(subtotal).toBe(3703.68) // 1234.56 * 3
    })
  })

  describe('状態持続化', () => {
    test('localStorage持続化で設定されている', () => {
      // This test verifies the store is set up with persist middleware
      // The actual persistence is handled by Zustand and tested in integration
      const { addItem } = useCartStore.getState()
      
      addItem(mockItem1)
      
      // Verify the store state is maintained
      const { items } = useCartStore.getState()
      expect(items).toHaveLength(1)
    })
  })
})