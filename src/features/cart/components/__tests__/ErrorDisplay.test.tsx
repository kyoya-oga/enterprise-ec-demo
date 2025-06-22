import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorDisplay } from '../ErrorDisplay'

describe('ErrorDisplay', () => {
  describe('基本表示', () => {
    it('エラーメッセージが正しく表示される', () => {
      render(<ErrorDisplay error="テストエラーメッセージ" />)
      
      expect(screen.getByText('テストエラーメッセージ')).toBeInTheDocument()
    })

    it('デフォルトでerrorバリアントが適用される', () => {
      render(<ErrorDisplay error="エラー" />)
      
      const container = screen.getByText('エラー').closest('div')
      expect(container).toHaveClass('bg-red-50', 'border-red-200', 'text-red-800')
    })

    it('warningバリアントが正しく適用される', () => {
      render(<ErrorDisplay error="警告" variant="warning" />)
      
      const container = screen.getByText('警告').closest('div')
      expect(container).toHaveClass('bg-yellow-50', 'border-yellow-200', 'text-yellow-800')
    })

    it('アイコンが表示される', () => {
      render(<ErrorDisplay error="エラー" />)
      
      // AlertTriangleアイコンが表示されることを確認
      const icon = screen.getByText('エラー').closest('div')?.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('閉じるボタン', () => {
    it('onDismissが提供されない場合、閉じるボタンが表示されない', () => {
      render(<ErrorDisplay error="エラー" />)
      
      expect(screen.queryByLabelText('エラーを閉じる')).not.toBeInTheDocument()
    })

    it('onDismissが提供される場合、閉じるボタンが表示される', () => {
      const onDismiss = vi.fn()
      render(<ErrorDisplay error="エラー" onDismiss={onDismiss} />)
      
      expect(screen.getByLabelText('エラーを閉じる')).toBeInTheDocument()
    })

    it('閉じるボタンをクリックするとonDismissが呼ばれる', () => {
      const onDismiss = vi.fn()
      render(<ErrorDisplay error="エラー" onDismiss={onDismiss} />)
      
      const closeButton = screen.getByLabelText('エラーを閉じる')
      fireEvent.click(closeButton)
      
      expect(onDismiss).toHaveBeenCalledTimes(1)
    })

    it('閉じるボタンにXアイコンが表示される', () => {
      const onDismiss = vi.fn()
      render(<ErrorDisplay error="エラー" onDismiss={onDismiss} />)
      
      const closeButton = screen.getByLabelText('エラーを閉じる')
      const icon = closeButton.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('スタイリング', () => {
    it('基本的なCSSクラスが適用される', () => {
      render(<ErrorDisplay error="エラー" />)
      
      const container = screen.getByText('エラー').closest('div')
      expect(container).toHaveClass(
        'flex',
        'items-center',
        'gap-3',
        'p-4',
        'rounded-lg',
        'border'
      )
    })

    it('errorバリアントの固有スタイルが適用される', () => {
      render(<ErrorDisplay error="エラー" variant="error" />)
      
      const container = screen.getByText('エラー').closest('div')
      expect(container).toHaveClass('bg-red-50', 'border-red-200', 'text-red-800')
    })

    it('warningバリアントの固有スタイルが適用される', () => {
      render(<ErrorDisplay error="警告" variant="warning" />)
      
      const container = screen.getByText('警告').closest('div')
      expect(container).toHaveClass('bg-yellow-50', 'border-yellow-200', 'text-yellow-800')
    })
  })

  describe('アクセシビリティ', () => {
    it('閉じるボタンに適切なaria-labelが設定される', () => {
      const onDismiss = vi.fn()
      render(<ErrorDisplay error="エラー" onDismiss={onDismiss} />)
      
      const closeButton = screen.getByLabelText('エラーを閉じる')
      expect(closeButton).toHaveAttribute('aria-label', 'エラーを閉じる')
    })

    it('エラーメッセージテキストが適切な要素で表示される', () => {
      render(<ErrorDisplay error="重要なエラー" />)
      
      const message = screen.getByText('重要なエラー')
      expect(message.tagName).toBe('P')
      expect(message).toHaveClass('flex-1', 'text-sm', 'font-medium')
    })
  })

  describe('レイアウト', () => {
    it('アイコン、メッセージ、閉じるボタンが正しい順序で配置される', () => {
      const onDismiss = vi.fn()
      render(<ErrorDisplay error="テストメッセージ" onDismiss={onDismiss} />)
      
      const container = screen.getByText('テストメッセージ').closest('div')!
      const children = Array.from(container.children)
      
      // 1番目: アイコン (svg)
      expect(children[0].tagName).toBe('svg')
      
      // 2番目: メッセージ (p)
      expect(children[1].tagName).toBe('P')
      expect(children[1]).toHaveTextContent('テストメッセージ')
      
      // 3番目: 閉じるボタン (button)
      expect(children[2].tagName).toBe('BUTTON')
    })

    it('閉じるボタンがない場合、アイコンとメッセージのみ表示される', () => {
      render(<ErrorDisplay error="メッセージ" />)
      
      const container = screen.getByText('メッセージ').closest('div')!
      const children = Array.from(container.children)
      
      expect(children).toHaveLength(2)
      expect(children[0].tagName).toBe('svg') // アイコン
      expect(children[1].tagName).toBe('P')   // メッセージ
    })
  })

  describe('エッジケース', () => {
    it('空のエラーメッセージでも正常に表示される', () => {
      const { container } = render(<ErrorDisplay error="" />)
      
      // 空のテキストを持つp要素を確認
      const message = container.querySelector('p')
      expect(message).toBeInTheDocument()
      expect(message?.textContent).toBe('')
    })

    it('非常に長いエラーメッセージでも正常に表示される', () => {
      const longError = 'とても長いエラーメッセージ'.repeat(20)
      render(<ErrorDisplay error={longError} />)
      
      expect(screen.getByText(longError)).toBeInTheDocument()
    })

    it('HTMLが含まれるエラーメッセージがエスケープされる', () => {
      const htmlError = '<script>alert("xss")</script>エラー'
      render(<ErrorDisplay error={htmlError} />)
      
      // HTMLタグがエスケープされてテキストとして表示される
      expect(screen.getByText(htmlError)).toBeInTheDocument()
      expect(screen.queryByText('alert("xss")')).not.toBeInTheDocument()
    })
  })
})