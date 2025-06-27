'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyJWT } from './jwt'
import { validateSession } from './session'
import type { User, JWTPayload, AuthError } from '@/features/auth/types'

// 🎯 HYBRID AUTH - Phase 2: Server Component Authentication Utilities
// 
// ✅ IMPLEMENTED FEATURES:
// - Server-side JWT verification with full DB access
// - Role-based access control with complete session validation
// - Robust error handling and automatic redirects
// - Performance optimized for Server Components
//
// 🔄 USAGE:
// - Replace middleware JWT verification with these utilities
// - Use in Server Components for complete authentication
// - Provides full DB access for session validation

export interface ServerAuthResult {
  user: User | null
  isAuthenticated: boolean
  error: AuthError | null
}

/**
 * Get current user session in Server Components
 * Performs complete JWT verification and session validation
 */
export async function getCurrentSession(): Promise<ServerAuthResult> {
  try {
    const cookieStore = cookies()
    const authToken = cookieStore.get('auth-token')?.value
    
    if (!authToken) {
      return {
        user: null,
        isAuthenticated: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'No authentication token found'
        }
      }
    }
    
    // Verify JWT with full validation
    const payload = await verifyJWT(authToken) as JWTPayload
    
    // Validate session against database/blacklist
    const sessionResult = await validateSession(authToken)
    
    if (!sessionResult.isValid || !sessionResult.user) {
      return {
        user: null,
        isAuthenticated: false,
        error: sessionResult.error || {
          code: 'UNAUTHORIZED',
          message: 'Invalid session'
        }
      }
    }
    
    return {
      user: sessionResult.user,
      isAuthenticated: true,
      error: null
    }
  } catch (error) {
    const authError = error as AuthError
    return {
      user: null,
      isAuthenticated: false,
      error: authError
    }
  }
}

/**
 * Require authentication in Server Components
 * Automatically redirects to login if not authenticated
 */
export async function requireAuth(locale: string = 'ja'): Promise<User> {
  const session = await getCurrentSession()
  
  if (!session.isAuthenticated || !session.user) {
    redirect(`/${locale}/login`)
  }
  
  return session.user
}

/**
 * Require specific role in Server Components
 * Automatically redirects to appropriate page if unauthorized
 */
export async function requireRole(
  role: 'user' | 'admin', 
  locale: string = 'ja'
): Promise<User> {
  const user = await requireAuth(locale)
  
  if (user.role !== role) {
    if (role === 'admin') {
      redirect(`/${locale}/forbidden`)
    } else {
      redirect(`/${locale}`)
    }
  }
  
  return user
}

/**
 * Check if user has specific role without redirecting
 */
export async function hasRole(role: 'user' | 'admin'): Promise<boolean> {
  try {
    const session = await getCurrentSession()
    return session.user?.role === role || false
  } catch {
    return false
  }
}

/**
 * Check if user is authenticated without redirecting
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getCurrentSession()
  return session.isAuthenticated
}

/**
 * Get user info for Server Components
 * Returns null if not authenticated (no redirect)
 */
export async function getUser(): Promise<User | null> {
  const session = await getCurrentSession()
  return session.user
}

/**
 * Clear authentication cookies (for logout)
 */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = cookies()
  cookieStore.delete('auth-token')
  cookieStore.delete('refresh-token')
}

/**
 * Enhanced authentication check with detailed error information
 * Useful for conditional rendering in Server Components
 */
export async function getAuthStatus(): Promise<{
  isAuthenticated: boolean
  user: User | null
  error: AuthError | null
  needsRedirect: boolean
  redirectUrl?: string
}> {
  const session = await getCurrentSession()
  
  return {
    isAuthenticated: session.isAuthenticated,
    user: session.user,
    error: session.error,
    needsRedirect: !session.isAuthenticated,
    redirectUrl: session.error ? '/ja/login' : undefined
  }
}