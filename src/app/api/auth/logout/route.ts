import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { invalidateSession } from '@/lib/auth/session'

// 🎯 HYBRID AUTH - Phase 3: Logout API Endpoint
// Handles secure logout with session invalidation and cookie clearing

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies()
    const authToken = cookieStore.get('auth-token')?.value
    const refreshToken = cookieStore.get('refresh-token')?.value

    // Invalidate sessions if tokens exist
    if (authToken) {
      invalidateSession(authToken)
    }
    if (refreshToken) {
      invalidateSession(refreshToken)
    }

    // Create response and clear cookies
    const response = NextResponse.json({ 
      message: 'Logged out successfully' 
    }, { status: 200 })

    // Clear authentication cookies
    response.cookies.delete('auth-token')
    response.cookies.delete('refresh-token')

    // Additional security: Set expired cookies to ensure cleanup
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0)
    })

    response.cookies.set('refresh-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0)
    })

    return response

  } catch (error) {
    console.error('Logout error:', error)
    
    // Even if there's an error, still clear cookies for security
    const response = NextResponse.json({ 
      message: 'Logout completed' 
    }, { status: 200 })

    response.cookies.delete('auth-token')
    response.cookies.delete('refresh-token')

    return response
  }
}