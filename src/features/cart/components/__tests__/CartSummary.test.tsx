import React from 'react'
import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CartSummary } from '@/features/cart/components/CartSummary'

// Mock the formatPrice utility
vi.mock('@/lib/utils', () => ({
  formatPrice: (price: number) => `¥${price.toLocaleString()}`
}))

// Mock UI components
vi.mock('@/components/ui/Button', () => ({
  Button: ({ children, className, asChild, ...props }: any) => {
    if (asChild) {
      return <div className={className} {...props}>{children}</div>
    }
    return <button className={className} {...props}>{children}</button>
  }
}))

vi.mock('@/components/ui/Card', () => ({
  Card: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>{children}</div>
  )
}))

describe('カートサマリー', () => {
  const defaultProps = {
    subtotal: 5000,
    shipping: 500,
    total: 5500,
    locale: 'ja'
  }

  describe('レンダリング', () => {
    test('サマリータイトルをレンダリングする', () => {
      render(<CartSummary {...defaultProps} />)
      
      expect(screen.getByText('注文サマリー')).toBeInTheDocument()
    })

    test('小計、配送料、合計金額を表示する', () => {
      render(<CartSummary {...defaultProps} />)
      
      expect(screen.getByText('小計')).toBeInTheDocument()
      expect(screen.getByText('配送料')).toBeInTheDocument()
      expect(screen.getByText('合計')).toBeInTheDocument()
      
      expect(screen.getByText('¥5,000')).toBeInTheDocument()
      expect(screen.getByText('¥500')).toBeInTheDocument()
      expect(screen.getByText('¥5,500')).toBeInTheDocument()
    })

    test('正しいロケールリンクでチェックアウトボタンをレンダリングする', () => {
      render(<CartSummary {...defaultProps} />)
      
      const checkoutButton = screen.getByRole('link', { name: 'レジに進む' })
      expect(checkoutButton).toBeInTheDocument()
      expect(checkoutButton).toHaveAttribute('href', '/ja/checkout')
    })

    test('セキュリティバッジと情報テキストをレンダリングする', () => {
      render(<CartSummary {...defaultProps} />)
      
      expect(screen.getByText('安全な決済')).toBeInTheDocument()
      expect(screen.getByText('送料は商品やお住まいの地域により変動する場合があります')).toBeInTheDocument()
    })
  })

  describe('価格フォーマット', () => {
    test('ゼロ金額を処理する', () => {
      const zeroProps = {
        subtotal: 0,
        shipping: 0,
        total: 0,
        locale: 'ja'
      }
      
      render(<CartSummary {...zeroProps} />)
      
      const zeroAmounts = screen.getAllByText('¥0')
      expect(zeroAmounts).toHaveLength(3) // subtotal, shipping, total
    })

    test('大きな金額を処理する', () => {
      const largeProps = {
        subtotal: 1234567,
        shipping: 89012,
        total: 1323579,
        locale: 'ja'
      }
      
      render(<CartSummary {...largeProps} />)
      
      expect(screen.getByText('¥1,234,567')).toBeInTheDocument()
      expect(screen.getByText('¥89,012')).toBeInTheDocument()
      expect(screen.getByText('¥1,323,579')).toBeInTheDocument()
    })

    test('小数点金額を処理する', () => {
      const decimalProps = {
        subtotal: 1234.56,
        shipping: 78.90,
        total: 1313.46,
        locale: 'ja'
      }
      
      render(<CartSummary {...decimalProps} />)
      
      expect(screen.getByText('¥1,234.56')).toBeInTheDocument()
      expect(screen.getByText('¥78.9')).toBeInTheDocument()
      expect(screen.getByText('¥1,313.46')).toBeInTheDocument()
    })
  })

  describe('ロケールサポート', () => {
    test('チェックアウトリンクの異なるロケールを処理する', () => {
      const englishProps = { ...defaultProps, locale: 'en' }
      
      render(<CartSummary {...englishProps} />)
      
      const checkoutButton = screen.getByRole('link', { name: 'レジに進む' })
      expect(checkoutButton).toHaveAttribute('href', '/en/checkout')
    })

    test('空のロケールを処理する', () => {
      const emptyLocaleProps = { ...defaultProps, locale: '' }
      
      render(<CartSummary {...emptyLocaleProps} />)
      
      const checkoutButton = screen.getByRole('link', { name: 'レジに進む' })
      expect(checkoutButton).toHaveAttribute('href', '/checkout')
    })
  })

  describe('レイアウトとスタイル', () => {
    test('レイアウトに適切なCSSクラスを持つ', () => {
      const { container } = render(<CartSummary {...defaultProps} />)
      
      const card = container.querySelector('.bg-zinc-800')
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass('p-8', 'sticky', 'top-8')
    })

    test('チェックアウトボタンをグラデーションでスタイルする', () => {
      render(<CartSummary {...defaultProps} />)
      
      const checkoutButton = screen.getByRole('link', { name: 'レジに進む' })
      expect(checkoutButton).toHaveClass('bg-gradient-to-r', 'from-red-500', 'to-pink-600')
    })

    test('セキュリティバッジ用SVGアイコンをレンダリングする', () => {
      render(<CartSummary {...defaultProps} />)
      
      const svgIcon = document.querySelector('svg')
      expect(svgIcon).toBeInTheDocument()
      expect(svgIcon).toHaveClass('w-4', 'h-4')
    })
  })

  describe('アクセシビリティ', () => {
    test('適切な見出し構造を持つ', () => {
      render(<CartSummary {...defaultProps} />)
      
      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveTextContent('注文サマリー')
    })

    test('アクセシブルなチェックアウトボタンを持つ', () => {
      render(<CartSummary {...defaultProps} />)
      
      const checkoutButton = screen.getByRole('link', { name: 'レジに進む' })
      expect(checkoutButton).toBeInTheDocument()
      expect(checkoutButton).toHaveAttribute('href')
    })
  })

  describe('コンテンツ検証', () => {
    test('一貫した価格構造を表示する', () => {
      render(<CartSummary {...defaultProps} />)
      
      // Check that all pricing elements are present
      const priceLabels = ['小計', '配送料', '合計']
      priceLabels.forEach(label => {
        expect(screen.getByText(label)).toBeInTheDocument()
      })
    })

    test('負の金額を適切に処理する', () => {
      const negativeProps = {
        subtotal: -1000,
        shipping: -100,
        total: -1100,
        locale: 'ja'
      }
      
      render(<CartSummary {...negativeProps} />)
      
      expect(screen.getByText('¥-1,000')).toBeInTheDocument()
      expect(screen.getByText('¥-100')).toBeInTheDocument()
      expect(screen.getByText('¥-1,100')).toBeInTheDocument()
    })
  })

  describe('エッジケース', () => {
    test('極端に大きな数値を処理する', () => {
      const extremeProps = {
        subtotal: Number.MAX_SAFE_INTEGER,
        shipping: 1000,
        total: Number.MAX_SAFE_INTEGER + 1000,
        locale: 'ja'
      }
      
      render(<CartSummary {...extremeProps} />)
      
      // Should not crash with very large numbers
      expect(screen.getByText('注文サマリー')).toBeInTheDocument()
    })

    test('特殊なロケール文字を処理する', () => {
      const specialLocaleProps = { ...defaultProps, locale: 'ja-JP' }
      
      render(<CartSummary {...specialLocaleProps} />)
      
      const checkoutButton = screen.getByRole('link', { name: 'レジに進む' })
      expect(checkoutButton).toHaveAttribute('href', '/ja-JP/checkout')
    })
  })
})