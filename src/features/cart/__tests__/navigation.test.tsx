import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { AddToCartSection } from '@/app/[locale]/(shop)/products/[id]/AddToCartSection'
import { useCartStore } from '../store/useCartStore'
import type { Product } from '@/features/products/types'

// Next.jsのuseRouterをモック
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}))

const mockProduct: Product = {
  id: 1,
  name: 'テスト商品',
  price: 1000,
  stock: 10,
  image: '/test.jpg',
  description: 'テスト用の商品です',
  category: 'テストカテゴリ'
}

describe('カート追加後のナビゲーション', () => {
  beforeEach(() => {
    // ストアをクリア
    useCartStore.getState().clearCart()
    useCartStore.getState().clearError()
    // モック関数をリセット
    mockPush.mockClear()
  })

  it('商品をカートに追加後、カートページに遷移する', async () => {
    render(<AddToCartSection product={mockProduct} locale="ja" />)
    
    const addButton = screen.getByRole('button', { name: 'カートに追加' })
    
    // カートに追加ボタンをクリック
    fireEvent.click(addButton)
    
    // 非同期処理を待機
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/ja/cart')
    })
    
    // カートに商品が追加されていることを確認
    const cartState = useCartStore.getState()
    expect(cartState.items).toHaveLength(1)
    expect(cartState.items[0].productId).toBe(mockProduct.id)
  })

  it('エラーが発生した場合は遷移しない', async () => {
    // 在庫切れ商品（ID:999）でエラーを発生させる
    const outOfStockProduct: Product = {
      ...mockProduct,
      id: 999
    }
    
    render(<AddToCartSection product={outOfStockProduct} locale="ja" />)
    
    const addButton = screen.getByRole('button', { name: 'カートに追加' })
    fireEvent.click(addButton)
    
    // エラーが発生するまで待機
    await waitFor(() => {
      const cartState = useCartStore.getState()
      expect(cartState.error).toBeTruthy()
    })
    
    // ナビゲーションが呼ばれていないことを確認
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('異なるlocaleでも正しいパスに遷移する', async () => {
    render(<AddToCartSection product={mockProduct} locale="en" />)
    
    const addButton = screen.getByRole('button', { name: 'カートに追加' })
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/en/cart')
    })
  })

  it('数量を変更して追加した場合も遷移する', async () => {
    render(<AddToCartSection product={mockProduct} locale="ja" />)
    
    // 数量を3に変更
    const plusButton = screen.getByRole('button', { name: '+' })
    act(() => {
      fireEvent.click(plusButton)
      fireEvent.click(plusButton)
    })
    
    // 数量が3になっていることを確認
    expect(screen.getByText('3')).toBeInTheDocument()
    
    // カートに追加
    const addButton = screen.getByRole('button', { name: 'カートに追加' })
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/ja/cart')
    })
    
    // カートに正しい数量で追加されていることを確認
    const cartState = useCartStore.getState()
    expect(cartState.items[0].quantity).toBe(3)
  })

  it('同じ商品を複数回追加した場合の遷移', async () => {
    // 最初に商品を追加
    await useCartStore.getState().addItem({
      id: mockProduct.id,
      productId: mockProduct.id,
      name: mockProduct.name,
      price: mockProduct.price,
      quantity: 2,
      image: mockProduct.image
    })

    render(<AddToCartSection product={mockProduct} locale="ja" />)
    
    const addButton = screen.getByRole('button', { name: 'カートに追加' })
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/ja/cart')
    })
    
    // 数量が合算されていることを確認
    const cartState = useCartStore.getState()
    expect(cartState.items).toHaveLength(2)
    expect(cartState.items[0].quantity + cartState.items[1].quantity).toBe(3)
  })
})