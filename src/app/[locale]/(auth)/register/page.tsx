'use client'

import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Checkbox } from '@/components/ui/Checkbox'

export default function RegisterPage({ params: { locale } }: { params: { locale: string } }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-black border-zinc-800">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center text-zinc-100">
          新しいアカウントを作成
        </CardTitle>
        <CardDescription className="text-center text-zinc-400">
          または{' '}
          <Link href={`/${locale}/login`} className="text-red-400 hover:text-red-300 hover:underline">
            既存のアカウントでログイン
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-zinc-300">姓</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="田中"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-zinc-300">名</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="太郎"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300">メールアドレス</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your-email@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-300">パスワード</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="パスワード"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-zinc-300">パスワード（確認）</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="パスワード（確認）"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              name="terms"
              checked={formData.terms}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, terms: checked === true }))
              }
              required
            />
            <Label htmlFor="terms" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-300">
              <a href="#" className="text-red-400 hover:text-red-300 hover:underline">利用規約</a>と
              <a href="#" className="text-red-400 hover:text-red-300 hover:underline">プライバシーポリシー</a>に同意します
            </Label>
          </div>

          <Button type="submit" className="w-full">
            アカウントを作成
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}