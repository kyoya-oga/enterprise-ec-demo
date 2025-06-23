import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest'
import {
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
} from '@/lib/auth/session'
import * as jwtModule from '@/lib/auth/jwt'
import * as cookiesModule from '@/lib/auth/cookies'
import type { User, AuthError } from '@/features/auth/types'

const mockUser: User = {
  id: 'test-user-id',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'user',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}


describe('セッション管理', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-32-chars'
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-testing-32-chars'
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('createSession - セッション作成', () => {
    it('ユーザー用の新しいセッションとトークンを作成する', async () => {
      const mockTokens = {
        token: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      }
      
      vi.spyOn(jwtModule, 'createTokenPair').mockResolvedValue(mockTokens)
      vi.spyOn(crypto, 'randomUUID').mockReturnValue('mock-session-id')
      
      const result = await createSession(mockUser)
      
      expect(result.session).toBeDefined()
      expect(result.tokens).toEqual(mockTokens)
      expect(result.session.id).toBe('mock-session-id')
      expect(result.session.userId).toBe(mockUser.id)
      expect(result.session.token).toBe(mockTokens.token)
      expect(result.session.refreshToken).toBe(mockTokens.refreshToken)
      expect(result.session.expiresAt).toBeDefined()
      expect(result.session.createdAt).toBeDefined()
    })

    it('トークン生成に失敗した場合はエラーをスローする', async () => {
      vi.spyOn(jwtModule, 'createTokenPair').mockRejectedValue(new Error('Token generation failed'))
      
      await expect(createSession(mockUser)).rejects.toThrow('Failed to create session')
    })
  })

  describe('getSession - セッション取得', () => {
    it('有効なトークンに対してユーザーとセッションを返す', async () => {
      const mockToken = 'valid-token'
      const mockPayload = {
        userId: '1',
        email: 'user@example.com',
        role: 'user' as const,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 900,
      }
      
      vi.spyOn(cookiesModule, 'getAuthCookie').mockReturnValue(mockToken)
      vi.spyOn(cookiesModule, 'getRefreshCookie').mockReturnValue('refresh-token')
      vi.spyOn(jwtModule, 'verifyJWT').mockResolvedValue(mockPayload)
      
      const result = await getSession()
      
      expect(result.user).toBeDefined()
      expect(result.session).toBeDefined()
      expect(result.error).toBeNull()
      expect(result.user?.id).toBe('1')
      expect(result.user?.email).toBe('user@example.com')
    })

    it('トークンが提供されない場合はエラーを返す', async () => {
      vi.spyOn(cookiesModule, 'getAuthCookie').mockReturnValue(null)
      
      const result = await getSession()
      
      expect(result.user).toBeNull()
      expect(result.session).toBeNull()
      expect(result.error).toMatchObject({
        code: 'UNAUTHORIZED',
        message: 'No authentication token found',
      })
    })

    it('トークンがブラックリストにある場合はエラーを返す', async () => {
      const blacklistedToken = 'blacklisted-token'
      invalidateSession(blacklistedToken)
      
      const result = await getSession(blacklistedToken)
      
      expect(result.user).toBeNull()
      expect(result.session).toBeNull()
      expect(result.error).toMatchObject({
        code: 'UNAUTHORIZED',
        message: 'Session has been invalidated',
      })
    })

    it('JWT検証に失敗した場合はエラーを返す', async () => {
      const invalidToken = 'invalid-token'
      const mockError: AuthError = {
        code: 'TOKEN_EXPIRED',
        message: 'Invalid or expired token',
      }
      
      vi.spyOn(jwtModule, 'verifyJWT').mockRejectedValue(mockError)
      
      const result = await getSession(invalidToken)
      
      expect(result.user).toBeNull()
      expect(result.session).toBeNull()
      expect(result.error).toEqual(mockError)
    })

    it('ユーザーが見つからない場合はエラーを返す', async () => {
      const mockPayload = {
        userId: 'non-existent-user',
        email: 'test@example.com',
        role: 'user' as const,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 900,
      }
      
      vi.spyOn(jwtModule, 'verifyJWT').mockResolvedValue(mockPayload)
      
      const result = await getSession('valid-token')
      
      expect(result.user).toBeNull()
      expect(result.session).toBeNull()
      expect(result.error).toMatchObject({
        code: 'UNAUTHORIZED',
        message: 'User not found',
      })
    })
  })

  describe('getCurrentSession - 現在セッション取得', () => {
    it('パラメーターなしでgetSessionに委託する', async () => {
      vi.spyOn(cookiesModule, 'getAuthCookie').mockReturnValue('token')
      vi.spyOn(jwtModule, 'verifyJWT').mockResolvedValue({
        userId: '1',
        email: 'user@example.com',
        role: 'user',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 900,
      })
      
      const result = await getCurrentSession()
      
      expect(result).toBeDefined()
      expect(result.user).toBeDefined()
    })
  })

  describe('getCurrentUser - 現在ユーザー取得', () => {
    it('現在のセッションからユーザーを返す', async () => {
      vi.spyOn(cookiesModule, 'getAuthCookie').mockReturnValue('token')
      vi.spyOn(jwtModule, 'verifyJWT').mockResolvedValue({
        userId: '1',
        email: 'user@example.com',
        role: 'user',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 900,
      })
      
      const user = await getCurrentUser()
      
      expect(user).toBeDefined()
      expect(user?.id).toBe('1')
    })

    it('有効なセッションがない場合はnullを返す', async () => {
      vi.spyOn(cookiesModule, 'getAuthCookie').mockReturnValue(null)
      
      const user = await getCurrentUser()
      
      expect(user).toBeNull()
    })
  })

  describe('updateSession - セッション更新', () => {
    it('セッション更新に対してtrueを返す', async () => {
      const result = await updateSession('session-id')
      
      expect(result).toBe(true)
    })

    it('エラーを適切に処理する', async () => {
      const result = await updateSession('invalid-session')
      
      expect(typeof result).toBe('boolean')
    })
  })

  describe('invalidateSession - セッション無効化', () => {
    it('トークンをブラックリストに追加する', () => {
      const token = 'token-to-invalidate'
      
      expect(() => invalidateSession(token)).not.toThrow()
    })

    it('ブラックリストのトークンへのアクセスを防ぐ', async () => {
      const token = 'blacklisted-token'
      invalidateSession(token)
      
      const result = await getSession(token)
      
      expect(result.error?.code).toBe('UNAUTHORIZED')
      expect(result.error?.message).toBe('Session has been invalidated')
    })
  })

  describe('invalidateUserSessions - ユーザーセッション無効化', () => {
    it('無効化試行をログ出力する', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      await invalidateUserSessions('user-id')
      
      expect(consoleSpy).toHaveBeenCalledWith('Invalidating all sessions for user: user-id')
      
      consoleSpy.mockRestore()
    })
  })

  describe('isAuthenticated - 認証状態チェック', () => {
    it('有効な認証に対してtrueを返す', async () => {
      vi.spyOn(cookiesModule, 'getAuthCookie').mockReturnValue('valid-token')
      vi.spyOn(jwtModule, 'verifyJWT').mockResolvedValue({
        userId: '1',
        email: 'user@example.com',
        role: 'user',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 900,
      })
      
      const result = await isAuthenticated()
      
      expect(result).toBe(true)
    })

    it('無効な認証に対してfalseを返す', async () => {
      vi.spyOn(cookiesModule, 'getAuthCookie').mockReturnValue(null)
      
      const result = await isAuthenticated()
      
      expect(result).toBe(false)
    })
  })

  describe('requireAuth - 認証必須', () => {
    it('有効な認証に対してユーザーを返す', async () => {
      vi.spyOn(cookiesModule, 'getAuthCookie').mockReturnValue('valid-token')
      vi.spyOn(jwtModule, 'verifyJWT').mockResolvedValue({
        userId: '1',
        email: 'user@example.com',
        role: 'user',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 900,
      })
      
      const user = await requireAuth()
      
      expect(user).toBeDefined()
      expect(user.id).toBe('1')
    })

    it('無効な認証に対してエラーをスローする', async () => {
      vi.spyOn(cookiesModule, 'getAuthCookie').mockReturnValue(null)
      
      await expect(requireAuth()).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      })
    })
  })

  describe('hasRole - ロールチェック', () => {
    it('一致するユーザーロールに対してtrueを返す', async () => {
      vi.spyOn(cookiesModule, 'getAuthCookie').mockReturnValue('valid-token')
      vi.spyOn(jwtModule, 'verifyJWT').mockResolvedValue({
        userId: '1',
        email: 'user@example.com',
        role: 'user',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 900,
      })
      
      const result = await hasRole('user')
      
      expect(result).toBe(true)
    })

    it('一致しないロールに対してfalseを返す', async () => {
      vi.spyOn(cookiesModule, 'getAuthCookie').mockReturnValue('valid-token')
      vi.spyOn(jwtModule, 'verifyJWT').mockResolvedValue({
        userId: '1',
        email: 'user@example.com',
        role: 'user',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 900,
      })
      
      const result = await hasRole('admin')
      
      expect(result).toBe(false)
    })

    it('認証されていない場合はfalseを返す', async () => {
      vi.spyOn(cookiesModule, 'getAuthCookie').mockReturnValue(null)
      
      const result = await hasRole('user')
      
      expect(result).toBe(false)
    })
  })

  describe('requireRole - ロール必須', () => {
    it('一致するロールに対してユーザーを返す', async () => {
      vi.spyOn(cookiesModule, 'getAuthCookie').mockReturnValue('valid-token')
      vi.spyOn(jwtModule, 'verifyJWT').mockResolvedValue({
        userId: '2',
        email: 'admin@example.com',
        role: 'admin',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 900,
      })
      
      const user = await requireRole('admin')
      
      expect(user).toBeDefined()
      expect(user.role).toBe('admin')
    })

    it('不十分なロールに対してエラーをスローする', async () => {
      vi.spyOn(cookiesModule, 'getAuthCookie').mockReturnValue('valid-token')
      vi.spyOn(jwtModule, 'verifyJWT').mockResolvedValue({
        userId: '1',
        email: 'user@example.com',
        role: 'user',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 900,
      })
      
      await expect(requireRole('admin')).rejects.toMatchObject({
        code: 'FORBIDDEN',
        message: "Role 'admin' required",
        details: { userRole: 'user', requiredRole: 'admin' },
      })
    })
  })

  describe('validateSession - セッション検証', () => {
    it('エラーをスローすることなく検証結果を返す', async () => {
      vi.spyOn(cookiesModule, 'getAuthCookie').mockReturnValue('valid-token')
      vi.spyOn(jwtModule, 'verifyJWT').mockResolvedValue({
        userId: '1',
        email: 'user@example.com',
        role: 'user',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 900,
      })
      
      const result = await validateSession()
      
      expect(result.isValid).toBe(true)
      expect(result.user).toBeDefined()
      expect(result.error).toBeNull()
    })

    it('エラーに対して無効な結果を返す', async () => {
      vi.spyOn(cookiesModule, 'getAuthCookie').mockReturnValue(null)
      
      const result = await validateSession()
      
      expect(result.isValid).toBe(false)
      expect(result.user).toBeNull()
      expect(result.error).toBeDefined()
    })

    it('例外を適切に処理する', async () => {
      vi.spyOn(cookiesModule, 'getAuthCookie').mockImplementation(() => {
        throw new Error('Cookie access failed')
      })
      
      const result = await validateSession()
      
      expect(result.isValid).toBe(false)
      expect(result.error).toMatchObject({
        code: 'UNAUTHORIZED',
        message: 'Session validation failed',
      })
    })
  })
})