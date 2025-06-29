import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth/session'
import { cookies } from 'next/headers'

// 🎯 HYBRID AUTH - Phase 3: Client Authentication Status Endpoint
// Provides current user information for client-side authentication hooks

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies()
    const authToken = cookieStore.get('auth-token')?.value

    if (!authToken) {
      return NextResponse.json({ 
        user: null, 
        isAuthenticated: false 
      }, { status: 401 })
    }

    const sessionResult = await validateSession(authToken)

    if (!sessionResult.isValid || !sessionResult.user) {
      return NextResponse.json({ 
        user: null, 
        isAuthenticated: false,
        error: sessionResult.error?.message || 'Invalid session'
      }, { status: 401 })
    }

    return NextResponse.json({
      user: sessionResult.user,
      isAuthenticated: true
    }, { status: 200 })

  } catch (error) {
    console.error('Auth status check error:', error)
    return NextResponse.json({ 
      user: null, 
      isAuthenticated: false,
      error: 'Authentication check failed'
    }, { status: 500 })
  }
}