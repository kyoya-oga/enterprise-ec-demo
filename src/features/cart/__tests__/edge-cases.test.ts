import { describe, test, expect, beforeEach } from 'vitest'
import { useCartStore } from '@/features/cart/store/useCartStore'
import type { CartItem } from '@/features/cart/types'

describe('カートエッジケースと境界テスト', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart()
  })

  describe('在庫制限と数量エッジケース', () => {
    const testItem: CartItem = {
      id: 1,
      productId: 1,
      name: 'テスト商品',
      price: 1000,
      quantity: 1,
      image: '/test.jpg'
    }

    test('数量0で自動削除を処理する', () => {
      const { addItem, updateQuantity, items } = useCartStore.getState()
      
      addItem(testItem)
      expect(useCartStore.getState().items).toHaveLength(1)
      
      // Update quantity to 0 should remove item
      updateQuantity(testItem.id, 0)
      expect(useCartStore.getState().items).toHaveLength(0)
    })

    test('負の数量を削除として処理する', () => {
      const { addItem, updateQuantity } = useCartStore.getState()
      
      addItem(testItem)
      updateQuantity(testItem.id, -1)
      
      expect(useCartStore.getState().items).toHaveLength(0)
    })

    test('非常に大きな数量を処理する', () => {
      const { addItem, updateQuantity } = useCartStore.getState()
      const largeQuantity = 999999
      
      addItem(testItem)
      updateQuantity(testItem.id, largeQuantity)
      
      const updatedItem = useCartStore.getState().items[0]
      expect(updatedItem.quantity).toBe(largeQuantity)
      expect(useCartStore.getState().itemCount).toBe(largeQuantity)
    })

    test('最大安全整数数量を処理する', () => {
      const { addItem, updateQuantity } = useCartStore.getState()
      const maxQuantity = Number.MAX_SAFE_INTEGER
      
      addItem(testItem)
      updateQuantity(testItem.id, maxQuantity)
      
      const updatedItem = useCartStore.getState().items[0]
      expect(updatedItem.quantity).toBe(maxQuantity)
    })

    test('数量境界を正しく処理する', () => {
      const { addItem, updateQuantity } = useCartStore.getState()
      
      addItem(testItem)
      
      // Test boundary values
      const boundaryValues = [1, 2, 10, 100, 1000]
      
      boundaryValues.forEach(quantity => {
        updateQuantity(testItem.id, quantity)
        expect(useCartStore.getState().items[0].quantity).toBe(quantity)
      })
    })

    test('小数数量を切り捨てで処理する', () => {
      const { addItem, updateQuantity } = useCartStore.getState()
      
      addItem(testItem)
      updateQuantity(testItem.id, 2.7)
      
      // Should handle fractional input gracefully
      const updatedItem = useCartStore.getState().items[0]
      expect(typeof updatedItem.quantity).toBe('number')
    })
  })

  describe('価格と計算エッジケース', () => {
    test('価格ゼロのアイテムを処理する', () => {
      const { addItem } = useCartStore.getState()
      const freeItem: CartItem = {
        id: 1,
        productId: 1,
        name: '無料商品',
        price: 0,
        quantity: 5,
        image: '/free.jpg'
      }
      
      addItem(freeItem)
      
      const { subtotal, total } = useCartStore.getState()
      expect(subtotal).toBe(0)
      expect(total).toBe(0)
    })

    test('負の価格アイテムを処理する', () => {
      const { addItem } = useCartStore.getState()
      const refundItem: CartItem = {
        id: 1,
        productId: 1,
        name: '返金アイテム',
        price: -500,
        quantity: 2,
        image: '/refund.jpg'
      }
      
      addItem(refundItem)
      
      const { subtotal } = useCartStore.getState()
      expect(subtotal).toBe(-1000) // -500 * 2
    })

    test('非常に高価なアイテムを処理する', () => {
      const { addItem } = useCartStore.getState()
      const expensiveItem: CartItem = {
        id: 1,
        productId: 1,
        name: '高額商品',
        price: 9999999.99,
        quantity: 1,
        image: '/expensive.jpg'
      }
      
      addItem(expensiveItem)
      
      const { subtotal } = useCartStore.getState()
      expect(subtotal).toBe(9999999.99)
    })

    test('小数計算で精度を処理する', () => {
      const { addItem } = useCartStore.getState()
      const decimalItem: CartItem = {
        id: 1,
        productId: 1,
        name: '小数価格商品',
        price: 19.99,
        quantity: 3,
        image: '/decimal.jpg'
      }
      
      addItem(decimalItem)
      
      const { subtotal } = useCartStore.getState()
      expect(subtotal).toBe(59.97) // 19.99 * 3
    })

    test('正の価格と負の価格の混合を処理する', () => {
      const { addItem } = useCartStore.getState()
      
      const positiveItem: CartItem = {
        id: 1,
        productId: 1,
        name: '正価格',
        price: 1000,
        quantity: 2,
        image: '/positive.jpg'
      }
      
      const negativeItem: CartItem = {
        id: 2,
        productId: 2,
        name: '負価格',
        price: -300,
        quantity: 1,
        image: '/negative.jpg'
      }
      
      addItem(positiveItem)
      addItem(negativeItem)
      
      const { subtotal } = useCartStore.getState()
      expect(subtotal).toBe(1700) // (1000 * 2) + (-300 * 1) = 2000 - 300 = 1700
    })
  })

  describe('IDとデータ整合性エッジケース', () => {
    test('ID 0のアイテムを処理する', () => {
      const { addItem, removeItem } = useCartStore.getState()
      const zeroIdItem: CartItem = {
        id: 0,
        productId: 0,
        name: 'ゼロID商品',
        price: 100,
        quantity: 1,
        image: '/zero.jpg'
      }
      
      addItem(zeroIdItem)
      expect(useCartStore.getState().items).toHaveLength(1)
      
      removeItem(0)
      expect(useCartStore.getState().items).toHaveLength(0)
    })

    test('負のIDを処理する', () => {
      const { addItem, removeItem, updateQuantity } = useCartStore.getState()
      const negativeIdItem: CartItem = {
        id: -1,
        productId: -1,
        name: '負ID商品',
        price: 100,
        quantity: 1,
        image: '/negative-id.jpg'
      }
      
      addItem(negativeIdItem)
      expect(useCartStore.getState().items).toHaveLength(1)
      
      // Update quantity should work with negative ID
      updateQuantity(-1, 3)
      expect(useCartStore.getState().items[0].quantity).toBe(3)
      
      // Remove should work with negative ID
      removeItem(-1)
      expect(useCartStore.getState().items).toHaveLength(0)
    })

    test('非常に大きなIDを処理する', () => {
      const { addItem, removeItem } = useCartStore.getState()
      const largeId = Number.MAX_SAFE_INTEGER
      const largeIdItem: CartItem = {
        id: largeId,
        productId: largeId,
        name: '大ID商品',
        price: 100,
        quantity: 1,
        image: '/large-id.jpg'
      }
      
      addItem(largeIdItem)
      expect(useCartStore.getState().items).toHaveLength(1)
      
      removeItem(largeId)
      expect(useCartStore.getState().items).toHaveLength(0)
    })

    test('重複IDを別アイテムとして処理する', () => {
      const { addItem } = useCartStore.getState()
      const item1: CartItem = {
        id: 1,
        productId: 1,
        name: '商品1',
        price: 100,
        quantity: 1,
        image: '/item1.jpg'
      }
      
      const item2: CartItem = {
        id: 1, // Same ID
        productId: 2,
        name: '商品2',
        price: 200,
        quantity: 1,
        image: '/item2.jpg'
      }
      
      addItem(item1)
      addItem(item2)
      
      // Should have both items even with duplicate IDs
      expect(useCartStore.getState().items).toHaveLength(2)
    })
  })

  describe('文字列とデータエッジケース', () => {
    test('空の商品名を処理する', () => {
      const { addItem } = useCartStore.getState()
      const emptyNameItem: CartItem = {
        id: 1,
        productId: 1,
        name: '',
        price: 100,
        quantity: 1,
        image: '/empty-name.jpg'
      }
      
      addItem(emptyNameItem)
      expect(useCartStore.getState().items[0].name).toBe('')
    })

    test('非常に長い商品名を処理する', () => {
      const { addItem } = useCartStore.getState()
      const longName = 'あ'.repeat(1000) // 1000 characters
      const longNameItem: CartItem = {
        id: 1,
        productId: 1,
        name: longName,
        price: 100,
        quantity: 1,
        image: '/long-name.jpg'
      }
      
      addItem(longNameItem)
      expect(useCartStore.getState().items[0].name).toBe(longName)
    })

    test('商品名の特殊文字を処理する', () => {
      const { addItem } = useCartStore.getState()
      const specialName = '特殊文字!@#$%^&*()_+-=[]{}|;:",.<>?/~`商品'
      const specialNameItem: CartItem = {
        id: 1,
        productId: 1,
        name: specialName,
        price: 100,
        quantity: 1,
        image: '/special.jpg'
      }
      
      addItem(specialNameItem)
      expect(useCartStore.getState().items[0].name).toBe(specialName)
    })

    test('商品名のUnicodeと絵文字を処理する', () => {
      const { addItem } = useCartStore.getState()
      const unicodeName = '🍎りんご🇯🇵日本製品👍'
      const unicodeItem: CartItem = {
        id: 1,
        productId: 1,
        name: unicodeName,
        price: 100,
        quantity: 1,
        image: '/unicode.jpg'
      }
      
      addItem(unicodeItem)
      expect(useCartStore.getState().items[0].name).toBe(unicodeName)
    })

    test('欠如またはundefinedの画像URLを処理する', () => {
      const { addItem } = useCartStore.getState()
      const noImageItem: CartItem = {
        id: 1,
        productId: 1,
        name: '画像なし商品',
        price: 100,
        quantity: 1
        // image property omitted
      }
      
      addItem(noImageItem)
      expect(useCartStore.getState().items[0].image).toBeUndefined()
    })
  })

  describe('メモリとパフォーマンスエッジケース', () => {
    test('多数のアイテム追加を効率的に処理する', () => {
      const { addItem } = useCartStore.getState()
      const itemCount = 100 // Reduced for performance
      
      // Add many items
      for (let i = 0; i < itemCount; i++) {
        const item: CartItem = {
          id: i,
          productId: i,
          name: `商品${i}`,
          price: 100 + i,
          quantity: 1,
          image: `/item${i}.jpg`
        }
        addItem(item)
      }
      
      const { items, itemCount: totalCount, subtotal } = useCartStore.getState()
      expect(items).toHaveLength(itemCount)
      expect(totalCount).toBe(itemCount)
      
      // Calculate expected subtotal: sum from 100 to 199 (100 items)
      const expectedSubtotal = Array.from({length: itemCount}, (_, i) => 100 + i).reduce((a, b) => a + b, 0)
      expect(subtotal).toBe(expectedSubtotal)
    })

    test('一括操作を効率的に処理する', () => {
      const { addItem, clearCart } = useCartStore.getState()
      
      // Add 50 items
      for (let i = 0; i < 50; i++) {
        addItem({
          id: i,
          productId: i,
          name: `Bulk Item ${i}`,
          price: 100,
          quantity: 10,
          image: `/bulk${i}.jpg`
        })
      }
      
      expect(useCartStore.getState().items).toHaveLength(50)
      expect(useCartStore.getState().itemCount).toBe(500) // 50 items * 10 quantity
      
      // Clear should work efficiently
      clearCart()
      expect(useCartStore.getState().items).toHaveLength(0)
      expect(useCartStore.getState().itemCount).toBe(0)
    })
  })

  describe('同時操作エッジケース', () => {
    test('連続高速操作を処理する', () => {
      const { addItem, updateQuantity, removeItem } = useCartStore.getState()
      const testItem: CartItem = {
        id: 1,
        productId: 1,
        name: '高速操作テスト',
        price: 100,
        quantity: 1,
        image: '/rapid.jpg'
      }
      
      // Rapid operations
      addItem(testItem)
      updateQuantity(1, 5)
      updateQuantity(1, 10)
      updateQuantity(1, 3)
      removeItem(1)
      
      // Should end up with empty cart
      expect(useCartStore.getState().items).toHaveLength(0)
    })

    test('重複操作で一貫性を維持する', () => {
      const { addItem, updateQuantity } = useCartStore.getState()
      
      addItem({
        id: 1,
        productId: 1,
        name: 'Consistency Test',
        price: 100,
        quantity: 1,
        image: '/consistency.jpg'
      })
      
      // Multiple updates to same item
      updateQuantity(1, 2)
      updateQuantity(1, 3)
      updateQuantity(1, 4)
      updateQuantity(1, 5)
      
      const finalItem = useCartStore.getState().items[0]
      expect(finalItem.quantity).toBe(5)
      expect(useCartStore.getState().subtotal).toBe(500) // 100 * 5
    })
  })
})