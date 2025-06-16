import { z } from 'zod'

// TODO: サーバーコンポーネント認証実装時の拡張予定
// - メール重複チェック機能追加
// - ドメインブラックリスト対応
// - 国際化対応エラーメッセージ

// TODO: パスワード強度チェック強化予定
// - 大文字・小文字・数字・記号の組み合わせチェック
// - よくあるパスワードのブラックリスト
// - パスワード履歴チェック (過去5回分)
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters long')

const emailSchema = z.string({ required_error: 'Email is required' })
  .email('Invalid email format')
  .min(1, 'Email is required')

const registrationSchema = z.object({
  email: emailSchema,
  password: z.string({ required_error: 'Password is required' }).min(8, 'Password must be at least 8 characters long'),
  firstName: z.string({ required_error: 'First name is required' }).min(1, 'First name is required'),
  lastName: z.string({ required_error: 'Last name is required' }).min(1, 'Last name is required')
})

const loginSchema = z.object({
  email: emailSchema,
  password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required')
})

export function validateRegistrationInput(data: {
  email?: string
  password?: string
  firstName?: string
  lastName?: string
}): Readonly<{ isValid: boolean; errors: readonly string[] }> {
  try {
    registrationSchema.parse(data)
    return Object.freeze({
      isValid: true,
      errors: Object.freeze([])
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => err.message)
      return Object.freeze({
        isValid: false,
        errors: Object.freeze(errors)
      })
    }
    return Object.freeze({
      isValid: false,
      errors: Object.freeze(['Validation error'])
    })
  }
}

export function validateLoginInput(data: {
  email?: string
  password?: string
}): Readonly<{ isValid: boolean; errors: readonly string[] }> {
  try {
    loginSchema.parse(data)
    return Object.freeze({
      isValid: true,
      errors: Object.freeze([])
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => err.message)
      return Object.freeze({
        isValid: false,
        errors: Object.freeze(errors)
      })
    }
    return Object.freeze({
      isValid: false,
      errors: Object.freeze(['Validation error'])
    })
  }
}

// Legacy functions for backward compatibility
export function isValidEmail(email: string): boolean {
  return emailSchema.safeParse(email).success
}

export function isValidPassword(password: string): boolean {
  return passwordSchema.safeParse(password).success
}