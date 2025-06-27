'use server'

import { redirect } from 'next/navigation'

export interface LoginFormState {
  errors?: {
    email?: string[]
    password?: string[]
  }
  message?: string
}

export async function loginAction(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Validation
  const errors: LoginFormState['errors'] = {}

  if (!email?.trim()) {
    errors.email = ['メールアドレスを入力してください']
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = ['有効なメールアドレスを入力してください']
  }

  if (!password?.trim()) {
    errors.password = ['パスワードを入力してください']
  }

  if (Object.keys(errors).length > 0) {
    return { errors }
  }

  try {
    // Call login API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      if (response.status === 401) {
        return {
          errors: {
            email: ['メールアドレスまたはパスワードが正しくありません'],
            password: ['メールアドレスまたはパスワードが正しくありません']
          }
        }
      }
      throw new Error('Login failed')
    }

    // Success - redirect to dashboard or intended page
    const redirectTo = formData.get('redirect') as string || '/ja'
    redirect(redirectTo)
  } catch (error) {
    console.error('Login action error:', error)
    return {
      message: 'ログイン処理中にエラーが発生しました。しばらく後でお試しください。'
    }
  }
}