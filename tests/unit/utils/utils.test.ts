import { describe, it, expect } from 'vitest'
import { formatPrice, slugify } from '@/lib/utils'

describe('utils', () => {
  it('formatPrice formats number to JPY currency', () => {
    expect(formatPrice(1200)).toBe('￥1,200')
  })

  it('slugify converts text to URL friendly slug', () => {
    expect(slugify('Hello World!')).toBe('hello-world')
  })
})
