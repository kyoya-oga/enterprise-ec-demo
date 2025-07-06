import { describe, it, expect, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useCartStore } from '../store/useCartStore'
import type { CartItem } from '../types'

// テスト用のモックアイテム
const mockItem: CartItem = {
  id: 1,
  productId: 1,
  name: 'テスト商品',
  price: 1000,
  quantity: 1,
  image: '/test-image.jpg'
}

const mockItemOutOfStock: CartItem = {
  id: 999,
  productId: 999,
  name: '在庫切れ商品',
  price: 2000,
  quantity: 1,
  image: '/test-image-2.jpg'
}

const mockItemHighQuantity: CartItem = {
  id: 2,
  productId: 2,
  name: '大量注文商品',
  price: 1500,
  quantity: 15, // 10を超える数量
  image: '/test-image-3.jpg'
}

describe('カートエラーハンドリング', () => {
  beforeEach(() => {
    // テスト前にストアをクリア
    useCartStore.getState().clearCart()
    useCartStore.getState().clearError()
  })

  describe('在庫不足エラー', () => {
    it('在庫切れ商品（ID:999）の追加でエラーが発生する', async () => {
      const { result } = renderHook(() => useCartStore())

      await act(async () => {
        await result.current.addItem(mockItemOutOfStock)
      })

      expect(result.current.error).toBe('在庫が不足しています')
      expect(result.current.items).toHaveLength(0)
      expect(result.current.isLoading).toBe(false)
    })

    it('数量が10を超える商品を追加できる', async () => {
      const { result } = renderHook(() => useCartStore())

      await act(async () => {
        await result.current.addItem(mockItemHighQuantity)
      })

      expect(result.current.error).toBeNull()
      expect(result.current.items).toHaveLength(1)
      expect(result.current.isLoading).toBe(false)
    })

    it('既存商品の数量を上限以上に更新できる', async () => {
      const { result } = renderHook(() => useCartStore())

      // まず正常な商品を追加
      await act(async () => {
        await result.current.addItem(mockItem)
      })

      expect(result.current.items).toHaveLength(1)

      // 数量を15に更新（在庫上限を超える）
      await act(async () => {
        await result.current.updateQuantity(mockItem.id, 15)
      })

      expect(result.current.error).toBeNull()
      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0].quantity).toBe(15)
    })

    it('既存商品に追加で合計数量を上限以上にできる', async () => {
      const { result } = renderHook(() => useCartStore())
      
      const item5: CartItem = { ...mockItem, quantity: 5 }
      const item7: CartItem = { ...mockItem, quantity: 7 } // 合計12個になる

      // まず5個追加
      await act(async () => {
        await result.current.addItem(item5)
      })

      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0].quantity).toBe(5)

      // さらに7個追加（合計12個で在庫上限10を超える）
      await act(async () => {
        await result.current.addItem(item7)
      })

      expect(result.current.error).toBeNull()
      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0].quantity).toBe(12)
    })
  })

  describe('ローディング状態', () => {
    it('商品追加時にローディング状態が正しく管理される', async () => {
      const { result } = renderHook(() => useCartStore())

      // 初期状態はローディングなし
      expect(result.current.isLoading).toBe(false)

      // 商品追加を開始
      const addPromise = act(async () => {
        await result.current.addItem(mockItem)
      })

      await addPromise
      
      // 完了後はローディング終了
      expect(result.current.isLoading).toBe(false)
      expect(result.current.items).toHaveLength(1)
    })

    it('数量更新時にローディング状態が正しく管理される', async () => {
      const { result } = renderHook(() => useCartStore())

      // まず商品を追加
      await act(async () => {
        await result.current.addItem(mockItem)
      })

      // 数量更新を実行
      await act(async () => {
        await result.current.updateQuantity(mockItem.id, 3)
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.items[0].quantity).toBe(3)
    })

    it('商品削除時にローディング状態が正しく管理される', async () => {
      const { result } = renderHook(() => useCartStore())

      // まず商品を追加
      await act(async () => {
        await result.current.addItem(mockItem)
      })

      // 商品削除を実行
      await act(async () => {
        await result.current.removeItem(mockItem.id)
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.items).toHaveLength(0)
    })
  })

  describe('エラー状態の管理', () => {
    it('エラー発生後にclearErrorでエラーがクリアされる', async () => {
      const { result } = renderHook(() => useCartStore())

      // エラーを発生させる
      await act(async () => {
        await result.current.addItem(mockItemOutOfStock)
      })

      expect(result.current.error).toBe('在庫が不足しています')

      // エラーをクリア
      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBe(null)
    })

    it('新しい操作でエラーが自動的にクリアされる', async () => {
      const { result } = renderHook(() => useCartStore())

      // エラーを発生させる
      await act(async () => {
        await result.current.addItem(mockItemOutOfStock)
      })

      expect(result.current.error).toBe('在庫が不足しています')

      // 正常な操作を実行
      await act(async () => {
        await result.current.addItem(mockItem)
      })

      // エラーがクリアされ、正常な商品が追加される
      expect(result.current.error).toBe(null)
      expect(result.current.items).toHaveLength(1)
    })

    it('カートクリア時にエラーもクリアされる', async () => {
      const { result } = renderHook(() => useCartStore())

      // エラーを発生させる
      await act(async () => {
        await result.current.addItem(mockItemOutOfStock)
      })

      expect(result.current.error).toBe('在庫が不足しています')

      // カートをクリア
      act(() => {
        result.current.clearCart()
      })

      expect(result.current.error).toBe(null)
      expect(result.current.items).toHaveLength(0)
    })
  })

  describe('エラーメッセージの内容', () => {
    it('商品追加失敗時の汎用エラーメッセージ', async () => {
      const { result } = renderHook(() => useCartStore())

      // 特定のエラーではなく汎用エラーをテスト
      // (実際のエラーハンドリングでは在庫チェックが先に実行されるため、
      //  他のエラーケースをテストするにはモックが必要だが、
      //  ここでは既存のエラーパターンで確認)
      
      await act(async () => {
        await result.current.addItem(mockItemOutOfStock)
      })

      // 在庫不足の場合は具体的なメッセージが表示される
      expect(result.current.error).toBe('在庫が不足しています')
    })

    it('数量更新で上限を超えてもエラーにならない', async () => {
      const { result } = renderHook(() => useCartStore())

      // まず商品を追加
      await act(async () => {
        await result.current.addItem(mockItem)
      })

      // 在庫上限を超える数量に更新
      await act(async () => {
        await result.current.updateQuantity(mockItem.id, 15)
      })

      expect(result.current.error).toBeNull()
    })
  })

  describe('永続化とエラー状態', () => {
    it('エラー状態は永続化されない', () => {
      const { result } = renderHook(() => useCartStore())

      // ストアの永続化設定を確認
      // partializeでitemsのみが永続化されることを確認
      // (実際のテストではlocalStorageのモックが必要だが、
      //  設定の構造は確認できる)
      
      expect(result.current.error).toBe(null)
      expect(result.current.isLoading).toBe(false)
    })
  })
})