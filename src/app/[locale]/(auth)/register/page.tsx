'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useFormState } from 'react-dom'

import { FormField } from '@/components/ui/FormField'
import { Label } from '@/components/ui/Label'
import { AuthCard } from '@/components/ui/AuthCard'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { registerAction, type RegisterFormState } from '@/lib/actions/auth'

export default function RegisterPage() {
  const pathname = usePathname()
  const locale = pathname.split('/')[1]
  const initialState: RegisterFormState = {}
  const [state, formAction] = useFormState(registerAction, initialState)

  return (
    <AuthCard
      title="新しいアカウントを作成"
      description={
        <>
          または{' '}
          <Link
            href={`/${locale}/login`}
            className="text-red-400 hover:text-red-300 hover:underline"
          >
            既存のアカウントでログイン
          </Link>
        </>
      }
    >
      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FormField
              id="firstName"
              name="firstName"
              label="姓"
              placeholder="田中"
              required
            />
            {state.errors?.firstName && (
              <p className="text-red-400 text-sm mt-1">{state.errors.firstName[0]}</p>
            )}
          </div>
          <div>
            <FormField
              id="lastName"
              name="lastName"
              label="名"
              placeholder="太郎"
              required
            />
            {state.errors?.lastName && (
              <p className="text-red-400 text-sm mt-1">{state.errors.lastName[0]}</p>
            )}
          </div>
        </div>

        <div>
          <FormField
            id="email"
            name="email"
            type="email"
            label="メールアドレス"
            placeholder="your-email@example.com"
            required
          />
          {state.errors?.email && (
            <p className="text-red-400 text-sm mt-1">{state.errors.email[0]}</p>
          )}
        </div>

        <div>
          <FormField
            id="password"
            name="password"
            type="password"
            label="パスワード"
            placeholder="パスワード"
            required
          />
          {state.errors?.password && (
            <p className="text-red-400 text-sm mt-1">{state.errors.password[0]}</p>
          )}
        </div>

        <div>
          <FormField
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="パスワード（確認）"
            placeholder="パスワード（確認）"
            required
          />
          {state.errors?.confirmPassword && (
            <p className="text-red-400 text-sm mt-1">{state.errors.confirmPassword[0]}</p>
          )}
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              value="true"
              required
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-zinc-600 bg-zinc-800 rounded"
            />
            <Label htmlFor="terms" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-300">
              <a
                href="#"
                className="text-red-400 hover:text-red-300 hover:underline"
              >
                利用規約
              </a>
              と
              <a
                href="#"
                className="text-red-400 hover:text-red-300 hover:underline"
              >
                プライバシーポリシー
              </a>
              に同意します
            </Label>
          </div>
          {state.errors?.terms && (
            <p className="text-red-400 text-sm mt-1">{state.errors.terms[0]}</p>
          )}
        </div>

        {state.message && (
          <p className="text-red-400 text-sm">{state.message}</p>
        )}

        <SubmitButton className="w-full">
          アカウントを作成
        </SubmitButton>
      </form>
    </AuthCard>
  )
}