// TODO: サーバーコンポーネント認証対応実装予定
// Phase 1: ユーザー登録強化
// - メール確認機能追加
// - 自動ログインオプション
// Phase 2: データベース移行
// - JSONファイル → PostgreSQL/MySQL
// - トランザクション対応
// - ユーザーテーブル設計

import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import bcrypt from 'bcrypt'
import { validateRegistrationInput } from '@/lib/validation'
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

async function writeUsers(users: readonly ApiUser[]): Promise<void> {
  await writeFile(dataFile, JSON.stringify(users, null, 2))
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await req.json()

    const validation = validateRegistrationInput({ email, password, firstName, lastName })
    if (!validation.isValid) {
      return NextResponse.json({ 
        message: 'Validation failed', 
        errors: validation.errors 
      }, { status: 400 })
    }

    const existingUsers = await readUsers()
    if (existingUsers.some(user => user.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const now = new Date().toISOString()
    const newUser: ApiUser = Object.freeze({
      id: randomUUID(),
      email: email.toLowerCase(),
      firstName,
      lastName,
      passwordHash,
      role: 'user' as const,
      createdAt: now,
      updatedAt: now,
    })

    const updatedUsers = Object.freeze([...existingUsers, newUser])
    await writeUsers(updatedUsers)

    const { passwordHash: _, ...userResponse } = newUser
    
    // TODO: 登録後の自動ログインオプション
    // const token = await generateJWT(userResponse)
    // const response = NextResponse.json(userResponse, { status: 201 })
    // response.cookies.set('auth-token', token, { httpOnly: true, secure: true, sameSite: 'strict' })
    // return response
    
    return NextResponse.json(Object.freeze(userResponse), { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
