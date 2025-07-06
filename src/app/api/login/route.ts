// 🎯 HYBRID AUTH - Login API Implementation
// Complete authentication flow with JWT generation and cookie management

import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import bcrypt from 'bcrypt'
import { validateLoginInput } from '@/lib/validation'
import { createTokenPair } from '@/lib/auth/jwt'
import type { ApiUser } from '@/features/auth/types'


const dataFile = process.env.USERS_FILE ||
  path.join(process.cwd(), 'src/lib/data/users.json')

async function readUsers(): Promise<readonly ApiUser[]> {
  try {
    const data = await readFile(dataFile, 'utf-8')
    const users = JSON.parse(data) as ApiUser[]
    return Object.freeze(users.map(user => Object.freeze(user)))
  } catch (error) {
    // Re-throw the error to be caught by the main error handler
    throw new Error(`Failed to read or parse user data: ${error instanceof Error ? error.message : String(error)}`)
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
    
    // 🎯 HYBRID AUTH - JWT Token Generation and Cookie Setup
    try {
      const tokens = await createTokenPair({
        userId: userResponse.id,
        email: userResponse.email,
        role: userResponse.role
      })
      
      const response = NextResponse.json(Object.freeze({ 
        message: 'Login successful',
        user: Object.freeze(userResponse)
      }), { status: 200 })
      
      // Set HTTPOnly cookies for security
      response.cookies.set('auth-token', tokens.token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict',
        maxAge: 15 * 60 // 15 minutes
      })
      
      response.cookies.set('refresh-token', tokens.refreshToken, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      })
      
      return response
    } catch (tokenError) {
      console.error('Token generation error:', tokenError)
      return NextResponse.json({ message: 'Authentication service error' }, { status: 500 })
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}