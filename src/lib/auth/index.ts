// JWT utilities
export {
  generateJWT,
  generateRefreshToken,
  verifyJWT,
  verifyRefreshToken,
  getTokenPayload,
  isTokenExpired,
  refreshToken,
  extractTokenFromHeader,
  createTokenPair,
} from './jwt'

// Cookie management
export {
  setAuthCookie,
  setRefreshCookie,
  setCSRFCookie,
  setAuthCookies,
  getAuthCookie,
  getRefreshCookie,
  getCSRFCookie,
  getAuthCookieFromRequest,
  getRefreshCookieFromRequest,
  getCSRFCookieFromRequest,
  clearAuthCookies,
  clearAuthCookie,
  clearRefreshCookie,
  validateCookieSettings,
  generateCSRFToken,
  verifyCSRFToken,
  getCookieNames,
} from './cookies'

// Session management
export {
  createSession,
  getSession,
  getCurrentSession,
  getCurrentUser,
  updateSession,
  invalidateSession,
  invalidateUserSessions,
  isAuthenticated,
  requireAuth,
  hasRole,
  requireRole,
  validateSession,
} from './session'

// Re-export types for convenience
export type {
  User,
  Session,
  JWTPayload,
  AuthError,
  ServerAuthResult,
  LoginCredentials,
  RegisterData,
  AuthState,
  AuthActions,
} from '@/features/auth/types'