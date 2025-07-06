import React from 'react'
import { describe, test, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { AddToCartSection } from '@/app/[locale]/(shop)/products/[id]/AddToCartSection'
import { CartSummary } from '@/features/cart/components/CartSummary'
import { CartItem } from '@/features/cart/components/CartItem'
import { useCartStore } from '@/features/cart/store/useCartStore'
import type { Product } from '@/features/products/types'

// Mock the formatPrice utility
vi.mock('@/lib/utils', () => ({
  formatPrice: (price: number) => `¥${price.toLocaleString()}`,
  cn: (...args: any[]) => args.filter(Boolean).join(' ')
}))

// Mock UI components
vi.mock('@/components/ui', () => ({
  Button: ({ children, onClick, className, disabled, asChild, ...props }: any) => {
    if (asChild) {
      return <div className={className} {...props}>{children}</div>
    }
    return (
      <button 
        onClick={onClick} 
        className={className} 
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  },
  Card: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>{children}</div>
  ),
  CardContent: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>{children}</div>
  )
}))

// Mock Next.js router
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

vi.mock('@/components/ui/Button', () => ({
  Button: ({ children, onClick, className, disabled, asChild, ...props }: any) => {
    if (asChild) {
      return <div className={className} {...props}>{children}</div>
    }
    return (
      <button 
        onClick={onClick} 
        className={className} 
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  }
}))


// Mock products components
vi.mock('@/features/products/components', () => ({
  AddToCartButton: ({ product, onAddToCart, className }: any) => (
    <button 
      onClick={() => onAddToCart?.(product)}
      disabled={product.stock === 0}
      className={className}
    >
      {product.stock > 0 ? 'カートに追加' : '在庫切れ'}
    </button>
  )
}))

describe('カートに追加統合フロー', () => {
  const mockProduct: Product = {
    id: 1,
    name: 'テスト商品',
    price: 2000,
    description: 'テスト用の商品説明',
    image: '/test-product.jpg',
    category: 'テストカテゴリ',
    stock: 5,
    rating: 4.5,
    reviews: 10
  }

  beforeEach(() => {
    // Reset cart state before each test
    useCartStore.getState().clearCart()
  })

  describe('商品追加セクション機能', () => {
    test('デフォルト数量で商品をカートに追加する', async () => {
      render(<AddToCartSection product={mockProduct} locale="ja" />)
      
      const addButton = screen.getByRole('button', { name: 'カートに追加' })
      act(() => {
        fireEvent.click(addButton)
      })
      
      const cartState = useCartStore.getState()
      expect(cartState.items).toHaveLength(1)
      expect(cartState.items[0]).toMatchObject({
        productId: 1,
        name: 'テスト商品',
        price: 2000,
        quantity: 1
      })
    })

    test('選択した数量で商品を追加する', async () => {
      render(<AddToCartSection product={mockProduct} locale="ja" />)
      
      // Increase quantity to 3
      const increaseButton = screen.getByRole('button', { name: '+' })
      act(() => {
        fireEvent.click(increaseButton)
        fireEvent.click(increaseButton)
      })
      
      // Verify quantity display
      expect(screen.getByText(/3/)).toBeInTheDocument()
      
      // Add to cart
      const addButton = screen.getByRole('button', { name: 'カートに追加' })
      act(() => {
        fireEvent.click(addButton)
      })
      
      const cartState = useCartStore.getState()
      expect(cartState.items[0].quantity).toBe(3)
    })

    test('数量増加時に在庫制限を守る', async () => {
      render(<AddToCartSection product={mockProduct} locale="ja" />)
      
      const increaseButton = screen.getByRole('button', { name: '+' })
      
      // Try to increase beyond stock (stock is 5)
      act(() => {
        for (let i = 0; i < 10; i++) {
          fireEvent.click(increaseButton)
        }
      })
      
      // Should not exceed stock
      expect(screen.getByText('5')).toBeInTheDocument()
      
      // Add to cart and verify
      const addButton = screen.getByRole('button', { name: 'カートに追加' })
      act(() => {
        fireEvent.click(addButton)
      })
      
      const cartState = useCartStore.getState()
      expect(cartState.items[0].quantity).toBe(5)
    })

    test('カート追加後に数量を1にリセットする', async () => {
      render(<AddToCartSection product={mockProduct} locale="ja" />)
      
      // Set quantity to 3
      const increaseButton = screen.getByRole('button', { name: '+' })
      act(() => {
        fireEvent.click(increaseButton)
        fireEvent.click(increaseButton)
      })
      
      expect(screen.getByText(/3/)).toBeInTheDocument()
      
      // Add to cart
      const addButton = screen.getByRole('button', { name: 'カートに追加' })
      act(() => {
        fireEvent.click(addButton)
      })
      
      // Quantity should reset to 1
      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument()
      })
    })

    test('在庫切れ商品を適切に処理する', async () => {
      const outOfStockProduct = { ...mockProduct, stock: 0 }
      
      render(<AddToCartSection product={outOfStockProduct} locale="ja" />)
      
      // Should show out of stock message
      expect(screen.getByRole('button', { name: '在庫切れ' })).toBeInTheDocument()
      
      // Should not show quantity selector
      expect(screen.queryByText('数量:')).not.toBeInTheDocument()
      
      // Button should be disabled
      const addButton = screen.getByRole('button', { name: '在庫切れ' })
      expect(addButton).toBeDisabled()
    })
  })

  describe('カート状態統合', () => {
    test('アイテム追加時にカート計算を更新する', async () => {
      render(<AddToCartSection product={mockProduct} locale="ja" />)
      
      // Add item to cart
      const addButton = screen.getByRole('button', { name: 'カートに追加' })
      act(() => {
        fireEvent.click(addButton)
      })
      
      const cartState = useCartStore.getState()
      expect(cartState.subtotal).toBe(2000) // 1 item * 2000 price
      expect(cartState.itemCount).toBe(1)
      expect(cartState.total).toBe(2000)
    })

    test('同じ商品の複数追加を処理する', async () => {
      render(<AddToCartSection product={mockProduct} locale="ja" />)
      
      const addButton = screen.getByRole('button', { name: 'カートに追加' })
      
      // Add same product twice
      act(() => {
        fireEvent.click(addButton)
        fireEvent.click(addButton)
      })
      
      const cartState = useCartStore.getState()
      expect(cartState.items).toHaveLength(2) // Two separate items
      expect(cartState.subtotal).toBe(4000) // 2 items * 2000 price
      expect(cartState.itemCount).toBe(2)
    })

    test('カートアイテムに一意のIDを生成する', async () => {
      render(<AddToCartSection product={mockProduct} locale="ja" />)
      
      const addButton = screen.getByRole('button', { name: 'カートに追加' })
      
      // Add same product multiple times with delay
      act(() => {
        fireEvent.click(addButton)
      })
      
      // Small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 1))
      
      act(() => {
        fireEvent.click(addButton)
      })
      
      const cartState = useCartStore.getState()
      expect(cartState.items).toHaveLength(2)
      expect(cartState.items[0].id).not.toBe(cartState.items[1].id)
    })
  })

  describe('カート表示統合', () => {
    test('追加後にカートアイテムを正しく表示する', async () => {
      // Add item to cart first
      render(<AddToCartSection product={mockProduct} locale="ja" />)
      const addButton = screen.getByRole('button', { name: 'カートに追加' })
      act(() => {
        fireEvent.click(addButton)
      })
      
      // Get cart state and render CartItem
      const cartState = useCartStore.getState()
      const cartItem = cartState.items[0]
      
      const mockOnUpdateQuantity = vi.fn()
      const mockOnRemove = vi.fn()
      
      render(
        <CartItem
          item={cartItem}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      )
      
      // Verify cart item displays correctly (assuming CartItem renders product name)
      expect(screen.getByText('テスト商品')).toBeInTheDocument()
    })

    test('カート合計で正しい金額を表示する', async () => {
      // Add multiple items with different quantities
      render(<AddToCartSection product={mockProduct} locale="ja" />)
      
      // Increase quantity to 2
      const increaseButton = screen.getByRole('button', { name: '+' })
      await act(async () => {
        fireEvent.click(increaseButton)
      })
      
      // Add to cart
      const addButton = screen.getByRole('button', { name: 'カートに追加' })
      await act(async () => {
        fireEvent.click(addButton)
      })
      
      // Get cart totals
      const cartState = useCartStore.getState()
      
      // Render CartSummary with cart totals
      render(
        <CartSummary
          subtotal={cartState.subtotal}
          shipping={500}
          total={cartState.subtotal + 500}
          locale="ja"
        />
      )
      
      expect(screen.getByText('¥4,000')).toBeInTheDocument() // subtotal: 2 * 2000
      expect(screen.getByText('¥500')).toBeInTheDocument() // shipping
      expect(screen.getByText('¥4,500')).toBeInTheDocument() // total
    })
  })

  describe('エッジケースとエラーハンドリング', () => {
    test('連続クリックを適切に処理する', async () => {
      render(<AddToCartSection product={mockProduct} locale="ja" />)
      
      const addButton = screen.getByRole('button', { name: 'カートに追加' })
      
      // Rapidly click add button
      act(() => {
        for (let i = 0; i < 5; i++) {
          fireEvent.click(addButton)
        }
      })
      
      const cartState = useCartStore.getState()
      expect(cartState.items).toHaveLength(5)
      expect(cartState.itemCount).toBe(5)
    })

    test('価格ゼロの商品を処理する', async () => {
      const freeProduct = { ...mockProduct, price: 0 }
      
      render(<AddToCartSection product={freeProduct} locale="ja" />)
      
      const addButton = screen.getByRole('button', { name: 'カートに追加' })
      act(() => {
        fireEvent.click(addButton)
      })
      
      const cartState = useCartStore.getState()
      expect(cartState.items[0].price).toBe(0)
      expect(cartState.subtotal).toBe(0)
    })

    test('大量在庫商品を処理する', async () => {
      const highStockProduct = { ...mockProduct, stock: 9999 }
      
      render(<AddToCartSection product={highStockProduct} locale="ja" />)
      
      const increaseButton = screen.getByRole('button', { name: '+' })
      
      // Try to increase quantity many times
      await act(async () => {
        for (let i = 0; i < 100; i++) {
          fireEvent.click(increaseButton)
        }
      })
      
      // Should be able to select up to 101 (started at 1)
      expect(screen.getByText(/101/)).toBeInTheDocument()
    })

    test('数量を最小値まで減らすことを処理する', async () => {
      render(<AddToCartSection product={mockProduct} locale="ja" />)
      
      const decreaseButton = screen.getByRole('button', { name: '-' })
      
      // Try to decrease below 1 (should stay at 1)
      await act(async () => {
        for (let i = 0; i < 5; i++) {
          fireEvent.click(decreaseButton)
        }
      })
      
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })

  describe('商品バリエーション', () => {
    test('商品名に特殊文字を含む商品を処理する', async () => {
      const specialProduct = {
        ...mockProduct,
        name: '特殊文字テスト: !@#$%^&*()'
      }
      
      render(<AddToCartSection product={specialProduct} locale="ja" />)
      
      const addButton = screen.getByRole('button', { name: 'カートに追加' })
      act(() => {
        fireEvent.click(addButton)
      })
      
      const cartState = useCartStore.getState()
      expect(cartState.items[0].name).toBe('特殊文字テスト: !@#$%^&*()')
    })

    test('非常に高額な商品を処理する', async () => {
      const expensiveProduct = { ...mockProduct, price: 999999 }
      
      render(<AddToCartSection product={expensiveProduct} locale="ja" />)
      
      const addButton = screen.getByRole('button', { name: 'カートに追加' })
      act(() => {
        fireEvent.click(addButton)
      })
      
      const cartState = useCartStore.getState()
      expect(cartState.items[0].price).toBe(999999)
      expect(cartState.subtotal).toBe(999999)
    })

    test('在庫1個の商品を処理する', async () => {
      const limitedProduct = { ...mockProduct, stock: 1 }
      
      render(<AddToCartSection product={limitedProduct} locale="ja" />)
      
      // Should not be able to increase quantity above 1
      const increaseButton = screen.getByRole('button', { name: '+' })
      act(() => {
        fireEvent.click(increaseButton)
      })
      
      expect(screen.getByText('1')).toBeInTheDocument() // Should stay at 1
      
      // Add to cart
      const addButton = screen.getByRole('button', { name: 'カートに追加' })
      act(() => {
        fireEvent.click(addButton)
      })
      
      const cartState = useCartStore.getState()
      expect(cartState.items[0].quantity).toBe(1)
    })
  })
})