// 🎯 HYBRID AUTH - Feature Exports
// Complete authentication system with client and server components

// Types
export type { User, Session, JWTPayload, AuthError, ServerAuthResult } from './types'

// Server-side authentication
export { 
  getCurrentSession, 
  requireAuth, 
  requireRole, 
  hasRole, 
  isAuthenticated, 
  getUser,
  getAuthStatus,
  clearAuthCookies 
} from '@/lib/auth/server'

// Client-side authentication
export { useAuth, useRequireRole, useOptionalAuth } from './hooks/useAuth'
export { 
  AuthProvider, 
  useAuthContext, 
  useCurrentUser, 
  useIsAuthenticated, 
  useAuthActions 
} from './context/AuthContext'

// Components
export { ClientAuthGuard, withClientAuth, useClientAuthGuard } from '@/components/auth/ClientAuthGuard'
export { LogoutButton, LogoutLink } from '@/components/auth/LogoutButton'
export { AuthStatus, AuthContent } from '@/components/auth/AuthStatus'
export { AuthGuard, withAuth, AuthStatus as ServerAuthStatus } from '@/components/auth/AuthGuard'

// JWT utilities
export { 
  generateJWT, 
  generateRefreshToken, 
  verifyJWT, 
  verifyRefreshToken, 
  refreshToken, 
  createTokenPair,
  isTokenExpired,
  getTokenPayload
} from '@/lib/auth/jwt'

// Session management
export { 
  createSession, 
  getSession, 
  updateSession, 
  invalidateSession, 
  invalidateUserSessions,
  validateSession
} from '@/lib/auth/session'