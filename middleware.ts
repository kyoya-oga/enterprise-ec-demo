import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/auth/jwt'
import type { JWTPayload } from '@/features/auth/types'

// 🔄 MIGRATION PLAN: ハイブリッド型認証への移行
// 
// 📋 現在の問題点:
// - エッジでJWT検証（重い処理、30-40ms）
// - データベースアクセス不可
// - セッション無効化チェック不可
// - デバッグが困難
//
// 🎯 移行後の設計:
// ┌─────────────────┬──────────────────┬────────────────────┐
// │     処理内容    │   現在の場所     │   移行後の場所     │
// ├─────────────────┼──────────────────┼────────────────────┤
// │ トークン存在    │   Middleware     │   Middleware       │
// │ JWT検証         │   Middleware     │ ➡️ Server Component │
// │ DB認証          │      なし        │ ➡️ Server Component │
// │ 役割チェック    │   Middleware     │ ➡️ Server Component │
// └─────────────────┴──────────────────┴────────────────────┘
//
// 📈 期待効果:
// - Middleware実行時間: 40ms → 5ms (87%改善)
// - DB接続による最新認証情報
// - Server Componentでのデバッグ容易性
//
// 📄 詳細な移行計画: HYBRID_AUTH_MIGRATION_PLAN.md 参照

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Locale extraction from pathname
  const localeRegex = /^\/([a-z]{2})\//
  const localeMatch = pathname.match(localeRegex)
  const locale = localeMatch ? localeMatch[1] : 'ja'
  
  // Protected route patterns (without locale prefix)
  const protectedPatterns = [
    '/account',
    '/admin', 
    '/checkout'
  ]
  
  // Check if current path is protected
  const isProtectedPath = protectedPatterns.some(pattern => {
    const localePattern = `/${locale}${pattern}`
    return pathname.startsWith(localePattern)
  })
  
  // Allow public routes
  if (!isProtectedPath) {
    return NextResponse.next()
  }
  
  // Extract JWT token from HTTPOnly cookie
  const authToken = request.cookies.get('auth-token')?.value
  
  // Redirect to login if no token
  if (!authToken) {
    const loginUrl = new URL(`/${locale}/login`, request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  try {
    // Verify JWT token
    const payload = await verifyJWT(authToken) as JWTPayload
    
    // Role-based access control for admin routes
    if (pathname.includes('/admin') && payload.role !== 'admin') {
      const forbiddenUrl = new URL(`/${locale}/forbidden`, request.url)
      return NextResponse.redirect(forbiddenUrl)
    }
    
    // Add user info to request headers for server components
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', payload.userId)
    requestHeaders.set('x-user-email', payload.email)
    requestHeaders.set('x-user-role', payload.role)
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    // Token invalid or expired - redirect to login
    const loginUrl = new URL(`/${locale}/login`, request.url)
    loginUrl.searchParams.set('redirect', pathname)
    
    // Clear invalid token
    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete('auth-token')
    response.cookies.delete('refresh-token')
    
    return response
  }
}

export const config = {
  matcher: [
    // Match all paths except API routes, static files, and Next.js internals
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}