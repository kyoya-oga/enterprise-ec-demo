import { getAuthStatus } from '@/lib/auth/server'
import { redirect } from 'next/navigation'
import type { User } from '@/features/auth/types'

interface AuthGuardProps {
  children: React.ReactNode
  requireRole?: 'user' | 'admin'
  locale?: string
  fallback?: React.ReactElement
}

// 🎯 HYBRID AUTH - Phase 2: Server Component Auth Guard
// Provides comprehensive authentication with graceful error handling
export async function AuthGuard({
  children,
  requireRole,
  locale = 'ja',
  fallback
}: AuthGuardProps): Promise<JSX.Element> {
  const authStatus = await getAuthStatus()
  
  // Handle unauthenticated users
  if (!authStatus.isAuthenticated) {
    if (authStatus.needsRedirect && authStatus.redirectUrl) {
      redirect(`${authStatus.redirectUrl}?redirect=${encodeURIComponent(`/${locale}`)}`)
    }
    
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">認証が必要です</h1>
          <p className="text-gray-600 mb-6">このページにアクセスするにはログインが必要です。</p>
          <a 
            href={`/${locale}/login`}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            ログインする
          </a>
        </div>
      </div>
    )
  }
  
  // Handle role-based access
  if (requireRole && authStatus.user?.role !== requireRole) {
    if (requireRole === 'admin') {
      redirect(`/${locale}/forbidden`)
    } else {
      redirect(`/${locale}`)
    }
  }
  
  return <>{children}</>
}

// Higher-order component for protected pages
export function withAuth<T extends { params: { locale: string } }>(
  Component: React.ComponentType<T>,
  options?: { requireRole?: 'user' | 'admin' }
) {
  return async function AuthenticatedComponent(props: T) {
    return (
      <AuthGuard 
        requireRole={options?.requireRole}
        locale={props.params.locale}
      >
        <Component {...props} />
      </AuthGuard>
    )
  }
}

// Hook-like utility for conditional rendering based on auth status
export async function AuthStatus({ 
  children, 
  fallback, 
  requireRole,
  locale = 'ja' 
}: {
  children: (user: User) => React.ReactNode
  fallback?: React.ReactNode
  requireRole?: 'user' | 'admin'
  locale?: string
}) {
  const authStatus = await getAuthStatus()
  
  if (!authStatus.isAuthenticated || !authStatus.user) {
    return fallback || null
  }
  
  if (requireRole && authStatus.user.role !== requireRole) {
    return fallback || null
  }
  
  return <>{children(authStatus.user)}</>
}