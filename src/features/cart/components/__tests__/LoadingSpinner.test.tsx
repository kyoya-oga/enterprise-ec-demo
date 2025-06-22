import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoadingSpinner } from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  describe('基本表示', () => {
    it('スピナーアイコンが表示される', () => {
      const { container } = render(<LoadingSpinner />)
      
      const spinner = container.querySelector('svg')
      expect(spinner).toBeInTheDocument()
    })

    it('デフォルトサイズ（md）が適用される', () => {
      const { container } = render(<LoadingSpinner />)
      
      const spinner = container.querySelector('svg')
      expect(spinner).toHaveClass('w-6', 'h-6')
    })

    it('animate-spinクラスが適用される', () => {
      const { container } = render(<LoadingSpinner />)
      
      const spinner = container.querySelector('svg')
      expect(spinner).toHaveClass('animate-spin')
    })

    it('適切な色クラスが適用される', () => {
      const { container } = render(<LoadingSpinner />)
      
      const spinner = container.querySelector('svg')
      expect(spinner).toHaveClass('text-gray-600')
    })
  })

  describe('サイズバリエーション', () => {
    it('スモールサイズ（sm）が正しく適用される', () => {
      const { container } = render(<LoadingSpinner size="sm" />)
      
      const spinner = container.querySelector('svg')
      expect(spinner).toHaveClass('w-4', 'h-4')
    })

    it('ミディアムサイズ（md）が正しく適用される', () => {
      const { container } = render(<LoadingSpinner size="md" />)
      
      const spinner = container.querySelector('svg')
      expect(spinner).toHaveClass('w-6', 'h-6')
    })

    it('ラージサイズ（lg）が正しく適用される', () => {
      const { container } = render(<LoadingSpinner size="lg" />)
      
      const spinner = container.querySelector('svg')
      expect(spinner).toHaveClass('w-8', 'h-8')
    })
  })

  describe('テキスト表示', () => {
    it('テキストが提供されない場合、テキストが表示されない', () => {
      render(<LoadingSpinner />)
      
      const container = screen.getByRole('generic')
      expect(container.children).toHaveLength(1) // スピナーのみ
    })

    it('テキストが提供される場合、テキストが表示される', () => {
      render(<LoadingSpinner text="読み込み中..." />)
      
      expect(screen.getByText('読み込み中...')).toBeInTheDocument()
    })

    it('テキストに適切なスタイルが適用される', () => {
      render(<LoadingSpinner text="処理中" />)
      
      const text = screen.getByText('処理中')
      expect(text).toHaveClass('text-sm', 'text-gray-600')
    })

    it('スピナーとテキストが正しい順序で表示される', () => {
      render(<LoadingSpinner text="読み込み中" />)
      
      const container = screen.getByRole('generic')
      const children = Array.from(container.children)
      
      expect(children).toHaveLength(2)
      expect(children[0].tagName).toBe('svg')  // スピナー
      expect(children[1].tagName).toBe('SPAN') // テキスト
      expect(children[1]).toHaveTextContent('読み込み中')
    })
  })

  describe('レイアウト', () => {
    it('基本的なレイアウトクラスが適用される', () => {
      render(<LoadingSpinner />)
      
      const container = screen.getByRole('generic')
      expect(container).toHaveClass(
        'flex',
        'items-center',
        'justify-center',
        'gap-2',
        'p-2'
      )
    })

    it('テキストありの場合もレイアウトが維持される', () => {
      render(<LoadingSpinner text="テスト" />)
      
      const container = screen.getByRole('generic')
      expect(container).toHaveClass(
        'flex',
        'items-center',
        'justify-center',
        'gap-2',
        'p-2'
      )
    })
  })

  describe('アクセシビリティ', () => {
    it('Loader2アイコンが使用される', () => {
      render(<LoadingSpinner />)
      
      // Loader2コンポーネントが正しく描画されることを確認
      const spinner = screen.getByRole('generic').querySelector('svg')
      expect(spinner).toBeInTheDocument()
    })

    it('スクリーンリーダー向けの適切な構造になっている', () => {
      render(<LoadingSpinner text="データを読み込んでいます" />)
      
      // テキストがスクリーンリーダーで読める形式で表示される
      const text = screen.getByText('データを読み込んでいます')
      expect(text.tagName).toBe('SPAN')
    })
  })

  describe('プロパティの組み合わせ', () => {
    it('スモールサイズとテキストの組み合わせ', () => {
      render(<LoadingSpinner size="sm" text="処理中" />)
      
      const spinner = screen.getByRole('generic').querySelector('svg')
      const text = screen.getByText('処理中')
      
      expect(spinner).toHaveClass('w-4', 'h-4')
      expect(text).toBeInTheDocument()
    })

    it('ラージサイズとテキストの組み合わせ', () => {
      render(<LoadingSpinner size="lg" text="大きな処理実行中" />)
      
      const spinner = screen.getByRole('generic').querySelector('svg')
      const text = screen.getByText('大きな処理実行中')
      
      expect(spinner).toHaveClass('w-8', 'h-8')
      expect(text).toBeInTheDocument()
    })
  })

  describe('エッジケース', () => {
    it('空のテキストでも正常に動作する', () => {
      render(<LoadingSpinner text="" />)
      
      const container = screen.getByRole('generic')
      expect(container.children).toHaveLength(2) // スピナー + 空のspan
      expect(screen.getByText('')).toBeInTheDocument()
    })

    it('長いテキストでも正常に表示される', () => {
      const longText = 'とても長いローディングメッセージです。'.repeat(5)
      render(<LoadingSpinner text={longText} />)
      
      expect(screen.getByText(longText)).toBeInTheDocument()
    })

    it('特殊文字を含むテキストが正常に表示される', () => {
      const specialText = '読み込み中... 100% 完了まで あと少し！'
      render(<LoadingSpinner text={specialText} />)
      
      expect(screen.getByText(specialText)).toBeInTheDocument()
    })
  })
})