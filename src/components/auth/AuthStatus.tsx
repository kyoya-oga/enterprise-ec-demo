'use client'

import { useAuthContext } from '@/features/auth/context/AuthContext'
import { LogoutButton, LogoutLink } from './LogoutButton'
import type { User } from '@/features/auth/types'

interface AuthStatusProps {
  variant?: 'full' | 'minimal' | 'dropdown'
  locale?: string
  className?: string
  showLogout?: boolean
}

// 🎯 HYBRID AUTH - Phase 3: Authentication Status Display Component
// Shows current user information and authentication state

export function AuthStatus({ 
  variant = 'full',
  locale = 'ja',
  className,
  showLogout = true 
}: AuthStatusProps) {
  const { user, isLoading, isAuthenticated } = useAuthContext()
  
  if (isLoading) {
    return <AuthStatusSkeleton variant={variant} className={className} />
  }
  
  if (!isAuthenticated || !user) {
    return <UnauthenticatedStatus variant={variant} locale={locale} className={className} />
  }
  
  return <AuthenticatedStatus 
    user={user} 
    variant={variant} 
    locale={locale} 
    className={className}
    showLogout={showLogout}
  />
}

// Loading skeleton
function AuthStatusSkeleton({ variant, className }: { variant: string; className?: string }) {
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center space-x-2 ${className || ''}`}>
        <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }
  
  return (
    <div className={`flex items-center space-x-3 ${className || ''}`}>
      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
      <div className="space-y-1">
        <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  )
}

// Unauthenticated state
function UnauthenticatedStatus({ 
  variant, 
  locale, 
  className 
}: { 
  variant: string
  locale: string
  className?: string 
}) {
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center space-x-2 ${className || ''}`}>
        <a 
          href={`/${locale}/login`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ログイン
        </a>
      </div>
    )
  }
  
  return (
    <div className={`flex items-center space-x-3 ${className || ''}`}>
      <div className="flex space-x-2">
        <a 
          href={`/${locale}/login`}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
        >
          ログイン
        </a>
        <a 
          href={`/${locale}/register`}
          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-50 transition-colors"
        >
          登録
        </a>
      </div>
    </div>
  )
}

// Authenticated state
function AuthenticatedStatus({ 
  user, 
  variant, 
  locale, 
  className,
  showLogout 
}: { 
  user: User
  variant: string
  locale: string
  className?: string
  showLogout: boolean
}) {
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center space-x-2 ${className || ''}`}>
        <UserAvatar user={user} size="sm" />
        <span className="text-sm text-gray-700">{user.firstName}</span>
        {showLogout && <LogoutLink className="text-xs" showConfirmation={false} />}
      </div>
    )
  }
  
  if (variant === 'dropdown') {
    return (
      <div className={`relative group ${className || ''}`}>
        <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
          <UserAvatar user={user} size="sm" />
          <span className="text-sm font-medium">{user.firstName} {user.lastName}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
          <a href={`/${locale}/account/profile`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            プロフィール
          </a>
          {user.role === 'admin' && (
            <a href={`/${locale}/admin/dashboard`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              管理ダッシュボード
            </a>
          )}
          <div className="border-t border-gray-100 mt-1 pt-1">
            {showLogout && (
              <div className="px-4 py-2">
                <LogoutButton variant="ghost" size="sm" showConfirmation={false}>
                  ログアウト
                </LogoutButton>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
  
  // Full variant
  return (
    <div className={`flex items-center space-x-3 ${className || ''}`}>
      <UserAvatar user={user} />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-xs text-gray-500">{user.email}</p>
        {user.role === 'admin' && (
          <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mt-1">
            管理者
          </span>
        )}
      </div>
      {showLogout && (
        <LogoutButton variant="outline" size="sm">
          ログアウト
        </LogoutButton>
      )}
    </div>
  )
}

// User avatar component
function UserAvatar({ user, size = 'default' }: { user: User; size?: 'sm' | 'default' }) {
  const sizeClasses = size === 'sm' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'
  const initials = `${user.firstName[0]}${user.lastName[0]}`
  
  return (
    <div className={`${sizeClasses} bg-blue-500 text-white rounded-full flex items-center justify-center font-medium`}>
      {initials}
    </div>
  )
}

// Conditional rendering hook for authentication-based content
export function AuthContent({ 
  authenticated, 
  unauthenticated,
  loading
}: {
  authenticated?: React.ReactNode
  unauthenticated?: React.ReactNode
  loading?: React.ReactNode
}) {
  const { isAuthenticated, isLoading } = useAuthContext()
  
  if (isLoading) {
    return <>{loading || null}</>
  }
  
  if (isAuthenticated) {
    return <>{authenticated || null}</>
  }
  
  return <>{unauthenticated || null}</>
}