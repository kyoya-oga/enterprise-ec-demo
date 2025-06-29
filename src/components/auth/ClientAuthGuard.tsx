'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/features/auth/context/AuthContext';
import type { User } from '@/features/auth/types';

interface ClientAuthGuardProps {
  children: React.ReactNode;
  requireRole?: 'user' | 'admin';
  locale?: string;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

// 🎯 HYBRID AUTH - Phase 3: Client-side Authentication Guard
// Provides authentication protection for client components with role-based access

export function ClientAuthGuard({
  children,
  requireRole,
  locale = 'ja',
  fallback,
  redirectTo,
}: ClientAuthGuardProps) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuthContext();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    // Handle unauthenticated users
    if (!isAuthenticated) {
      const loginUrl = redirectTo || `/${locale}/login`;
      const currentPath = window.location.pathname;
      const redirectQuery =
        currentPath !== `/${locale}`
          ? `?redirect=${encodeURIComponent(currentPath)}`
          : '';
      router.push(`${loginUrl}${redirectQuery}`);
      return;
    }

    // Handle role requirements
    if (requireRole && user?.role !== requireRole) {
      if (requireRole === 'admin') {
        router.push(`/${locale}/forbidden`);
      } else {
        router.push(`/${locale}`);
      }
      return;
    }
  }, [
    isLoading,
    isAuthenticated,
    user,
    requireRole,
    locale,
    redirectTo,
    router,
  ]);

  // Show loading state
  if (isLoading) {
    return fallback || <AuthLoadingFallback />;
  }

  // Show fallback for unauthenticated users
  if (!isAuthenticated) {
    return fallback || <AuthRequiredFallback locale={locale} />;
  }

  // Show fallback for insufficient role
  if (requireRole && user?.role !== requireRole) {
    return (
      fallback || (
        <InsufficientRoleFallback
          requireRole={requireRole}
          userRole={user?.role}
        />
      )
    );
  }

  // Render protected content
  return <>{children}</>;
}

// Default fallback components
function AuthLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">認証状態を確認中...</p>
      </div>
    </div>
  );
}

function AuthRequiredFallback({ locale }: { locale: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          認証が必要です
        </h1>
        <p className="text-gray-600 mb-6">
          このページにアクセスするにはログインが必要です。
        </p>
        <Link
          href={`/${locale}/login`}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          ログインする
        </Link>
      </div>
    </div>
  );
}

function InsufficientRoleFallback({
  requireRole,
  userRole,
}: {
  requireRole: string;
  userRole?: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          アクセス権限が不足しています
        </h1>
        <p className="text-gray-600 mb-2">
          必要な権限: <span className="font-semibold">{requireRole}</span>
        </p>
        <p className="text-gray-600 mb-6">
          現在の権限:{' '}
          <span className="font-semibold">{userRole || 'なし'}</span>
        </p>
        <button
          onClick={() => window.history.back()}
          className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          戻る
        </button>
      </div>
    </div>
  );
}

// Higher-order component for easy usage
export function withClientAuth<T extends object>(
  Component: React.ComponentType<T>,
  options?: { requireRole?: 'user' | 'admin'; locale?: string }
) {
  return function AuthenticatedComponent(props: T) {
    return (
      <ClientAuthGuard
        requireRole={options?.requireRole}
        locale={options?.locale}
      >
        <Component {...props} />
      </ClientAuthGuard>
    );
  };
}

// Hook-based guard for conditional rendering
export function useClientAuthGuard(requireRole?: 'user' | 'admin') {
  const { user, isLoading, isAuthenticated } = useAuthContext();

  const hasAccess =
    isAuthenticated && (!requireRole || user?.role === requireRole);

  const needsAuth = !isLoading && !isAuthenticated;
  const needsRole =
    !isLoading && isAuthenticated && requireRole && user?.role !== requireRole;

  return {
    hasAccess,
    needsAuth,
    needsRole,
    isLoading,
    user,
  };
}
