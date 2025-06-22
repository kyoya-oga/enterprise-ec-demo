import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCartStore } from '../store/useCartStore'
import type { CartItem } from '../types'

// Next.jsのuseRouterをモック
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

const mockCartItem: CartItem = {
  id: 1,
  productId: 1,
  name: 'テスト商品',
  price: 1000,
  quantity: 1,
  image: '/test.jpg'
}

describe('カート追加後のナビゲーション（ストアレベル）', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart()
    useCartStore.getState().clearError()
    mockPush.mockClear()
  })

  it('商品追加が成功する', async () => {
    const { addItem } = useCartStore.getState()
    
    await addItem(mockCartItem)
    
    const state = useCartStore.getState()
    expect(state.items).toHaveLength(1)
    expect(state.items[0].productId).toBe(1)
    expect(state.error).toBeNull()
  })

  it('同じ商品を追加すると数量が統合される', async () => {
    const { addItem } = useCartStore.getState()
    
    // 最初に1個追加
    await addItem(mockCartItem)
    
    // さらに2個追加
    await addItem({ ...mockCartItem, quantity: 2 })
    
    const state = useCartStore.getState()
    expect(state.items).toHaveLength(1)
    expect(state.items[0].quantity).toBe(3) // 1 + 2
    expect(state.error).toBeNull()
  })

  it('在庫不足エラーが発生する', async () => {
    const { addItem } = useCartStore.getState()
    
    const outOfStockItem: CartItem = {
      ...mockCartItem,
      id: 999,
      productId: 999
    }
    
    await addItem(outOfStockItem)
    
    const state = useCartStore.getState()
    expect(state.items).toHaveLength(0)
    expect(state.error).toBe('在庫が不足しています')
  })
})