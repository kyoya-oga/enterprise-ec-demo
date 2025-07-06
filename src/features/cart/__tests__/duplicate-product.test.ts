import { describe, it, expect, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useCartStore } from '../store/useCartStore'
import type { CartItem } from '../types'

// テスト用のモック商品
const mockProduct1: CartItem = {
  id: 1,
  productId: 1,
  name: 'テスト商品1',
  price: 1000,
  quantity: 2,
  image: '/test-image-1.jpg'
}

const mockProduct1Again: CartItem = {
  id: 1, // 同じproductId
  productId: 1,
  name: 'テスト商品1',
  price: 1000,
  quantity: 3, // 異なる数量
  image: '/test-image-1.jpg'
}

const mockProduct2: CartItem = {
  id: 2,
  productId: 2,
  name: 'テスト商品2',
  price: 1500,
  quantity: 1,
  image: '/test-image-2.jpg'
}

describe('同じ商品の重複追加テスト', () => {
  beforeEach(() => {
    // テスト前にストアをクリア
    useCartStore.getState().clearCart()
    useCartStore.getState().clearError()
  })

  describe('同じ商品の追加', () => {
    it('同じ商品を2回追加すると数量が合算される', async () => {
      const { result } = renderHook(() => useCartStore())

      // 最初に商品1を2個追加
      await act(async () => {
        await result.current.addItem(mockProduct1)
      })

      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0]).toEqual({
        id: 1,
        productId: 1,
        name: 'テスト商品1',
        price: 1000,
        quantity: 2,
        image: '/test-image-1.jpg'
      })

      // 同じ商品を3個追加（合計5個になるはず）
      await act(async () => {
        await result.current.addItem(mockProduct1Again)
      })

      expect(result.current.items).toHaveLength(1) // アイテム数は1つのまま
      expect(result.current.items[0].quantity).toBe(5) // 数量が合算される
      expect(result.current.items[0].productId).toBe(1)
    })

    it('異なる商品は別々のアイテムとして追加される', async () => {
      const { result } = renderHook(() => useCartStore())

      // 商品1を追加
      await act(async () => {
        await result.current.addItem(mockProduct1)
      })

      // 商品2を追加
      await act(async () => {
        await result.current.addItem(mockProduct2)
      })

      expect(result.current.items).toHaveLength(2)
      
      const product1Item = result.current.items.find(item => item.productId === 1)
      const product2Item = result.current.items.find(item => item.productId === 2)
      
      expect(product1Item).toBeDefined()
      expect(product1Item?.quantity).toBe(2)
      
      expect(product2Item).toBeDefined()
      expect(product2Item?.quantity).toBe(1)
    })

    it('同じ商品を複数回追加しても1つのアイテムとして管理される', async () => {
      const { result } = renderHook(() => useCartStore())

      const addSameProduct = async (quantity: number) => {
        const item: CartItem = {
          id: 1,
          productId: 1,
          name: 'テスト商品1',
          price: 1000,
          quantity,
          image: '/test-image-1.jpg'
        }
        await result.current.addItem(item)
      }

      // 3回に分けて追加
      await act(async () => {
        await addSameProduct(1)
      })
      
      await act(async () => {
        await addSameProduct(2)
      })
      
      await act(async () => {
        await addSameProduct(3)
      })

      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0].quantity).toBe(6) // 1 + 2 + 3 = 6
      expect(result.current.items[0].productId).toBe(1)
    })
  })

  describe('在庫制限と重複商品', () => {
    it('同じ商品を追加すると数量が加算される', async () => {
      const { result } = renderHook(() => useCartStore())

      // まず7個追加
      const item7: CartItem = {
        id: 1,
        productId: 1,
        name: 'テスト商品1',
        price: 1000,
        quantity: 7,
        image: '/test-image-1.jpg'
      }

      await act(async () => {
        await result.current.addItem(item7)
      })

      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0].quantity).toBe(7)

      // さらに5個追加（合計12個で在庫上限10を超える）
      const item5: CartItem = {
        id: 1,
        productId: 1,
        name: 'テスト商品1',
        price: 1000,
        quantity: 5,
        image: '/test-image-1.jpg'
      }

      await act(async () => {
        await result.current.addItem(item5)
      })

      expect(result.current.error).toBeNull()
      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0].quantity).toBe(12)
    })
  })

  describe('計算の正確性', () => {
    it('同じ商品の数量合算で小計と合計が正しく計算される', async () => {
      const { result } = renderHook(() => useCartStore())

      const item2: CartItem = {
        id: 1,
        productId: 1,
        name: 'テスト商品1',
        price: 1000,
        quantity: 2,
        image: '/test-image-1.jpg'
      }

      const item3: CartItem = {
        id: 1,
        productId: 1,
        name: 'テスト商品1',
        price: 1000,
        quantity: 3,
        image: '/test-image-1.jpg'
      }

      await act(async () => {
        await result.current.addItem(item2)
      })

      expect(result.current.subtotal).toBe(2000) // 1000 × 2
      expect(result.current.itemCount).toBe(2)

      await act(async () => {
        await result.current.addItem(item3)
      })

      expect(result.current.subtotal).toBe(5000) // 1000 × 5
      expect(result.current.itemCount).toBe(5)
      expect(result.current.total).toBe(5000)
    })

    it('複数の異なる商品と同じ商品の追加で正しく計算される', async () => {
      const { result } = renderHook(() => useCartStore())

      // 商品1を2個
      await act(async () => {
        await result.current.addItem(mockProduct1)
      })

      // 商品2を1個
      await act(async () => {
        await result.current.addItem(mockProduct2)
      })

      // 商品1をさらに1個追加
      const additionalProduct1: CartItem = {
        id: 1,
        productId: 1,
        name: 'テスト商品1',
        price: 1000,
        quantity: 1,
        image: '/test-image-1.jpg'
      }

      await act(async () => {
        await result.current.addItem(additionalProduct1)
      })

      expect(result.current.items).toHaveLength(2)
      
      // 商品1: 3個 (2 + 1)
      const product1Item = result.current.items.find(item => item.productId === 1)
      expect(product1Item?.quantity).toBe(3)
      
      // 商品2: 1個
      const product2Item = result.current.items.find(item => item.productId === 2)
      expect(product2Item?.quantity).toBe(1)

      // 小計: (1000 × 3) + (1500 × 1) = 4500
      expect(result.current.subtotal).toBe(4500)
      expect(result.current.itemCount).toBe(4) // 3 + 1
    })
  })
})