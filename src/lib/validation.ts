// TODO: サーバーコンポーネント認証実装時の拡張予定
// - メール重複チェック機能追加
// - ドメインブラックリスト対応
// - 国際化対応エラーメッセージ
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

// TODO: パスワード強度チェック強化予定
// - 大文字・小文字・数字・記号の組み合わせチェック
// - よくあるパスワードのブラックリスト
// - パスワード履歴チェック (過去5回分)
export function isValidPassword(password: string): boolean {
  return password.length >= 8
}

function getEmailErrors(email?: string): readonly string[] {
  if (!email) return ['Email is required']
  if (!isValidEmail(email)) return ['Invalid email format']
  return []
}

function getPasswordErrors(password?: string): readonly string[] {
  if (!password) return ['Password is required']
  if (!isValidPassword(password)) return ['Password must be at least 8 characters long']
  return []
}

function getRequiredFieldError(fieldName: string, value?: string): readonly string[] {
  return !value ? [`${fieldName} is required`] : []
}

export function validateRegistrationInput(data: {
  email?: string
  password?: string
  firstName?: string
  lastName?: string
}): Readonly<{ isValid: boolean; errors: readonly string[] }> {
  const allErrors = [
    ...getEmailErrors(data.email),
    ...getPasswordErrors(data.password),
    ...getRequiredFieldError('First name', data.firstName),
    ...getRequiredFieldError('Last name', data.lastName)
  ] as const

  return Object.freeze({
    isValid: allErrors.length === 0,
    errors: Object.freeze(allErrors)
  })
}

export function validateLoginInput(data: {
  email?: string
  password?: string
}): Readonly<{ isValid: boolean; errors: readonly string[] }> {
  const allErrors = [
    ...getEmailErrors(data.email),
    ...getRequiredFieldError('Password', data.password)
  ] as const

  return Object.freeze({
    isValid: allErrors.length === 0,
    errors: Object.freeze(allErrors)
  })
}