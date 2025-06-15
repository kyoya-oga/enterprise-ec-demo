'use server'

import { redirect } from 'next/navigation'

export interface RegisterFormState {
  errors?: {
    firstName?: string[]
    lastName?: string[]
    email?: string[]
    password?: string[]
    confirmPassword?: string[]
    terms?: string[]
  }
  message?: string
}

export async function registerAction(
  prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const terms = formData.get('terms') as string

  // Validation
  const errors: RegisterFormState['errors'] = {}

  if (!firstName?.trim()) {
    errors.firstName = ['姓を入力してください']
  }

  if (!lastName?.trim()) {
    errors.lastName = ['名を入力してください']
  }

  if (!email?.trim()) {
    errors.email = ['メールアドレスを入力してください']
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = ['有効なメールアドレスを入力してください']
  }

  if (!password?.trim()) {
    errors.password = ['パスワードを入力してください']
  } else if (password.length < 8) {
    errors.password = ['パスワードは8文字以上で入力してください']
  }

  if (!confirmPassword?.trim()) {
    errors.confirmPassword = ['パスワード（確認）を入力してください']
  } else if (password !== confirmPassword) {
    errors.confirmPassword = ['パスワードが一致しません']
  }

  if (!terms) {
    errors.terms = ['利用規約とプライバシーポリシーに同意してください']
  }

  if (Object.keys(errors).length > 0) {
    return { errors }
  }

  // TODO: ここでユーザー登録処理を実装
  console.log('Registration data:', {
    firstName,
    lastName,
    email,
    password,
    terms
  })

  // 成功した場合はログインページにリダイレクト
  redirect('/ja/login')
}