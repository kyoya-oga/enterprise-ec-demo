'use client'

import { useFormState } from 'react-dom'
import { loginAction, type LoginFormState } from '@/lib/actions/login'

interface LoginFormProps {
  locale: string
  redirectTo?: string
}

export default function LoginForm({ locale, redirectTo }: LoginFormProps) {
  const [state, formAction] = useFormState(loginAction, {} as LoginFormState)

  return (
    <form action={formAction} className="mt-8 space-y-6">
      {redirectTo && (
        <input type="hidden" name="redirect" value={redirectTo} />
      )}
      
      {state.message && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {state.message}
        </div>
      )}

      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="email" className="sr-only">
            メールアドレス
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="メールアドレス"
          />
          {state.errors?.email && (
            <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            パスワード
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="パスワード"
          />
          {state.errors?.password && (
            <p className="mt-1 text-sm text-red-600">{state.errors.password[0]}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            ログイン状態を保持
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            パスワードを忘れた方
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          ログイン
        </button>
      </div>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">または</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button type="button" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            Google
          </button>
          <button type="button" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            GitHub
          </button>
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>テストアカウント:</p>
        <p>ユーザー: user@example.com / password</p>
        <p>管理者: admin@example.com / password</p>
      </div>
    </form>
  )
}