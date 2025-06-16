import { describe, it, expect } from 'vitest'
import { formatPrice, formatDate } from './utils'

describe('ユーティリティ関数', () => {
  describe('formatPrice', () => {
    it('日本のロケールで価格を正しくフォーマットする', () => {
      expect(formatPrice(1000, 'JPY', 'ja-JP')).toBe('￥1,000')
      expect(formatPrice(1234.56, 'JPY', 'ja-JP')).toBe('￥1,235')
      expect(formatPrice(0, 'JPY', 'ja-JP')).toBe('￥0')
    })

    it('英語のロケールで価格を正しくフォーマットする', () => {
      expect(formatPrice(1000, 'USD', 'en-US')).toBe('$1,000.00')
      expect(formatPrice(1234.56, 'USD', 'en-US')).toBe('$1,234.56')
      expect(formatPrice(0, 'USD', 'en-US')).toBe('$0.00')
    })
  })

  describe('formatDate', () => {
    it('日付を正しくフォーマットする', () => {
      const date = new Date('2023-12-25T10:30:00Z')
      const formatted = formatDate(date, 'en')
      expect(formatted).toMatch(/Dec/)
      expect(formatted).toMatch(/25/)
      expect(formatted).toMatch(/2023/)
    })
  })
})