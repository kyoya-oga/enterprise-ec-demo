import React from 'react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CartItemControls } from '@/features/cart/components/CartItemControls'
import type { CartItem } from '@/features/cart/types'

// Mock UI components
vi.mock('@/components/ui', () => ({
  Button: ({ children, onClick, className, disabled, ...props }: any) => (
    <button 
      onClick={onClick} 
      className={className} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}))

describe('カートアイテムコントロール', () => {
  const mockItem: CartItem = {
    id: 1,
    productId: 1,
    name: 'テスト商品',
    price: 1000,
    quantity: 2,
    image: '/test-image.jpg'
  }

  const mockOnUpdateQuantity = vi.fn()
  const mockOnRemove = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('レンダリング', () => {
    test('数量コントロールと削除ボタンをレンダリングする', () => {
      render(
        <CartItemControls
          item={mockItem}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      )

      // Check quantity display
      expect(screen.getByText('2')).toBeInTheDocument()
      
      // Check buttons are present
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(3) // decrease, increase, remove
    })

    test('現在の数量を表示する', () => {
      const itemWithDifferentQuantity = { ...mockItem, quantity: 5 }
      
      render(
        <CartItemControls
          item={itemWithDifferentQuantity}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      )

      expect(screen.getByText('5')).toBeInTheDocument()
    })
  })

  describe('数量増加', () => {
    test('増加ボタンクリック時に増加した数量でonUpdateQuantityを呼び出す', () => {
      render(
        <CartItemControls
          item={mockItem}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      )

      const increaseButton = screen.getByRole('button', { 
        name: /plus/i 
      }) || screen.getAllByRole('button')[1] // Second button is increase
      
      fireEvent.click(increaseButton)

      expect(mockOnUpdateQuantity).toHaveBeenCalledWith(1, 3) // quantity 2 -> 3
      expect(mockOnUpdateQuantity).toHaveBeenCalledTimes(1)
    })

    test('数量1で動作する', () => {
      const singleItem = { ...mockItem, quantity: 1 }
      
      render(
        <CartItemControls
          item={singleItem}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      )

      const increaseButton = screen.getAllByRole('button')[1]
      fireEvent.click(increaseButton)

      expect(mockOnUpdateQuantity).toHaveBeenCalledWith(1, 2)
    })
  })

  describe('数量減少', () => {
    test('数量 > 1の時に減少した数量でonUpdateQuantityを呼び出す', () => {
      render(
        <CartItemControls
          item={mockItem}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      )

      const decreaseButton = screen.getAllByRole('button')[0] // First button is decrease
      fireEvent.click(decreaseButton)

      expect(mockOnUpdateQuantity).toHaveBeenCalledWith(1, 1) // quantity 2 -> 1
      expect(mockOnRemove).not.toHaveBeenCalled()
    })

    test('数量が1で減少ボタンがクリックされた時にonRemoveを呼び出す', () => {
      const singleItem = { ...mockItem, quantity: 1 }
      
      render(
        <CartItemControls
          item={singleItem}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      )

      const decreaseButton = screen.getAllByRole('button')[0]
      fireEvent.click(decreaseButton)

      expect(mockOnRemove).toHaveBeenCalledWith(1)
      expect(mockOnUpdateQuantity).not.toHaveBeenCalled()
    })

    test('大量の数量で動作する', () => {
      const itemWithLargeQuantity = { ...mockItem, quantity: 100 }
      
      render(
        <CartItemControls
          item={itemWithLargeQuantity}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      )

      const decreaseButton = screen.getAllByRole('button')[0]
      fireEvent.click(decreaseButton)

      expect(mockOnUpdateQuantity).toHaveBeenCalledWith(1, 99)
    })
  })

  describe('削除機能', () => {
    test('削除ボタンクリック時にonRemoveを呼び出す', () => {
      render(
        <CartItemControls
          item={mockItem}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      )

      const removeButton = screen.getAllByRole('button')[2] // Third button is remove
      fireEvent.click(removeButton)

      expect(mockOnRemove).toHaveBeenCalledWith(1)
      expect(mockOnRemove).toHaveBeenCalledTimes(1)
      expect(mockOnUpdateQuantity).not.toHaveBeenCalled()
    })
  })

  describe('コールバック処理', () => {
    test('onUpdateQuantityコールバックの欠如を適切に処理する', () => {
      render(
        <CartItemControls
          item={mockItem}
          onRemove={mockOnRemove}
        />
      )

      const increaseButton = screen.getAllByRole('button')[1]
      
      expect(() => {
        fireEvent.click(increaseButton)
      }).not.toThrow()
    })

    test('onRemoveコールバックの欠如を適切に処理する', () => {
      render(
        <CartItemControls
          item={mockItem}
          onUpdateQuantity={mockOnUpdateQuantity}
        />
      )

      const removeButton = screen.getAllByRole('button')[2]
      
      expect(() => {
        fireEvent.click(removeButton)
      }).not.toThrow()
    })

    test('両方のコールバックが欠如している場合を適切に処理する', () => {
      render(<CartItemControls item={mockItem} />)

      const buttons = screen.getAllByRole('button')
      
      expect(() => {
        buttons.forEach(button => fireEvent.click(button))
      }).not.toThrow()
    })
  })

  describe('ボタンスタイルとアクセシビリティ', () => {
    test('適切なボタンクラスを持つ', () => {
      render(
        <CartItemControls
          item={mockItem}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      )

      const buttons = screen.getAllByRole('button')
      
      // Decrease button
      expect(buttons[0]).toHaveClass('w-8', 'h-8')
      
      // Increase button  
      expect(buttons[1]).toHaveClass('w-8', 'h-8')
      
      // Remove button
      expect(buttons[2]).toHaveClass('w-8', 'h-8')
    })

    test('ボタン内にSVGアイコンをレンダリングする', () => {
      render(
        <CartItemControls
          item={mockItem}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      )

      const svgElements = document.querySelectorAll('svg')
      expect(svgElements).toHaveLength(3) // One for each button
    })
  })

  describe('エッジケース', () => {
    test('ID 0のアイテムを処理する', () => {
      const itemWithZeroId = { ...mockItem, id: 0 }
      
      render(
        <CartItemControls
          item={itemWithZeroId}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      )

      const increaseButton = screen.getAllByRole('button')[1]
      fireEvent.click(increaseButton)

      expect(mockOnUpdateQuantity).toHaveBeenCalledWith(0, 3)
    })

    test('非常に大きな数量のアイテムを処理する', () => {
      const itemWithLargeQuantity = { ...mockItem, quantity: 999999 }
      
      render(
        <CartItemControls
          item={itemWithLargeQuantity}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      )

      expect(screen.getByText('999999')).toBeInTheDocument()
      
      const increaseButton = screen.getAllByRole('button')[1]
      fireEvent.click(increaseButton)

      expect(mockOnUpdateQuantity).toHaveBeenCalledWith(1, 1000000)
    })
  })
})