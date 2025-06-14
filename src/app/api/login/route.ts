// TODO: サーバーコンポーネント認証対応実装予定
// Phase 1: JWT/Cookie セッション管理追加
// - ログイン成功時にJWTトークン生成
// - HTTPOnly Cookie設定
// - リフレッシュトークン機能
// Phase 2: セキュリティ強化
// - Rate Limiting (ログイン試行制限)
// - CSRF トークン検証
// - IP制限・ジオロケーション確認

import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import bcrypt from 'bcrypt'
import { validateLoginInput } from '@/lib/validation'
import type { ApiUser } from '@/features/auth/types'


const dataFile = process.env.USERS_FILE ||
  path.join(process.cwd(), 'src/lib/data/users.json')

async function readUsers(): Promise<readonly ApiUser[]> {
  try {
    const data = await readFile(dataFile, 'utf-8')
    const users = JSON.parse(data) as ApiUser[]
    return Object.freeze(users.map(user => Object.freeze(user)))
  } catch {
    return Object.freeze([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    const validation = validateLoginInput({ email, password })
    if (!validation.isValid) {
      return NextResponse.json({ 
        message: 'Validation failed', 
        errors: validation.errors 
      }, { status: 400 })
    }

    const users = await readUsers()
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const { passwordHash: _, ...userResponse } = user
    
    // TODO: JWT トークン生成とCookie設定
    // const token = await generateJWT(userResponse)
    // const response = NextResponse.json({ message: 'Login successful', user: userResponse })
    // response.cookies.set('auth-token', token, { httpOnly: true, secure: true, sameSite: 'strict' })
    // return response
    
    return NextResponse.json(Object.freeze({ 
      message: 'Login successful',
      user: Object.freeze(userResponse)
    }), { status: 200 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}