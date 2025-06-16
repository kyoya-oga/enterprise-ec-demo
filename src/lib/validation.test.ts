import { describe, it, expect } from 'vitest'
import { 
  isValidEmail, 
  isValidPassword, 
  validateRegistrationInput, 
  validateLoginInput 
} from './validation'

describe('バリデーションユーティリティ', () => {
  describe('isValidEmail', () => {
    it('正しいメールアドレス形式を受け入れる', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name+tag@domain.co.jp')).toBe(true)
      expect(isValidEmail('admin@sub.domain.com')).toBe(true)
    })

    it('無効なメールアドレス形式を拒否する', () => {
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('@domain.com')).toBe(false)
      expect(isValidEmail('user@')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })
  })

  describe('isValidPassword', () => {
    it('最小長を満たすパスワードを受け入れる', () => {
      expect(isValidPassword('password123')).toBe(true)
      expect(isValidPassword('12345678')).toBe(true)
    })

    it('短いパスワードを拒否する', () => {
      expect(isValidPassword('short')).toBe(false)
      expect(isValidPassword('1234567')).toBe(false)
      expect(isValidPassword('')).toBe(false)
    })
  })

  describe('validateRegistrationInput', () => {
    it('有効な入力に対してイミュータブルなバリデーション結果を返す', () => {
      const input = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      }
      
      const result = validateRegistrationInput(input)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(Object.isFrozen(result)).toBe(true)
      expect(Object.isFrozen(result.errors)).toBe(true)
    })

    it('無効な入力に対してイミュータブルなバリデーションエラーを返す', () => {
      const input = {
        email: 'invalid-email',
        password: 'short',
        firstName: '',
        lastName: ''
      }
      
      const result = validateRegistrationInput(input)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Invalid email format')
      expect(result.errors).toContain('Password must be at least 8 characters long')
      expect(result.errors).toContain('First name is required')
      expect(result.errors).toContain('Last name is required')
      expect(Object.isFrozen(result)).toBe(true)
      expect(Object.isFrozen(result.errors)).toBe(true)
    })

    it('結果オブジェクトを変更できない', () => {
      const input = { email: 'test@example.com', password: 'password123', firstName: 'Test', lastName: 'User' }
      const result = validateRegistrationInput(input)
      
      expect(() => {
        // @ts-expect-error - Intentionally trying to mutate frozen object
        result.isValid = false
      }).toThrow()
      
      expect(() => {
        // @ts-expect-error - Intentionally trying to mutate frozen array
        result.errors.push('new error')
      }).toThrow()
    })
  })

  describe('validateLoginInput', () => {
    it('有効な入力に対してイミュータブルなバリデーション結果を返す', () => {
      const input = {
        email: 'test@example.com',
        password: 'password123'
      }
      
      const result = validateLoginInput(input)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(Object.isFrozen(result)).toBe(true)
      expect(Object.isFrozen(result.errors)).toBe(true)
    })

    it('無効な入力に対してイミュータブルなバリデーションエラーを返す', () => {
      const input = {
        email: 'invalid-email',
        password: ''
      }
      
      const result = validateLoginInput(input)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Invalid email format')
      expect(result.errors).toContain('Password is required')
      expect(Object.isFrozen(result)).toBe(true)
      expect(Object.isFrozen(result.errors)).toBe(true)
    })

    it('結果オブジェクトを変更できない', () => {
      const input = { email: 'test@example.com', password: 'password123' }
      const result = validateLoginInput(input)
      
      expect(() => {
        // @ts-expect-error - Intentionally trying to mutate frozen object
        result.isValid = false
      }).toThrow()
      
      expect(() => {
        // @ts-expect-error - Intentionally trying to mutate frozen array
        result.errors.push('new error')
      }).toThrow()
    })
  })
})