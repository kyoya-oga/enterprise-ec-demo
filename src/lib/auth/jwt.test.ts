import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import {
  generateJWT,
  generateRefreshToken,
  verifyJWT,
  verifyRefreshToken,
  getTokenPayload,
  isTokenExpired,
  refreshToken,
  extractTokenFromHeader,
  createTokenPair,
} from '@/lib/auth/jwt'
import type { JWTPayload } from '@/features/auth/types'

const mockPayload: Omit<JWTPayload, 'iat' | 'exp'> = {
  userId: 'test-user-id',
  email: 'test@example.com',
  role: 'user',
}

const originalEnv = process.env

describe('JWT ユーティリティ', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-32-chars'
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-testing-32-chars'
    process.env.JWT_ISSUER = 'test-issuer'
    process.env.JWT_AUDIENCE = 'test-audience'
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe('generateJWT - JWTトークン生成', () => {
    it('ユーザーペイロードから有効なJWTトークンを生成する', async () => {
      const token = await generateJWT(mockPayload)
      
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3)
    })

    it('JWT生成に失敗した場合はエラーをスローする', async () => {
      const originalSecret = process.env.JWT_SECRET
      process.env.JWT_SECRET = ''
      
      await expect(generateJWT(mockPayload)).rejects.toThrow('Failed to generate JWT token')
      
      process.env.JWT_SECRET = originalSecret
    })
  })

  describe('generateRefreshToken - リフレッシュトークン生成', () => {
    it('長期間有効なリフレッシュトークンを生成する', async () => {
      const refreshTokenValue = await generateRefreshToken(mockPayload)
      
      expect(refreshTokenValue).toBeDefined()
      expect(typeof refreshTokenValue).toBe('string')
      expect(refreshTokenValue.split('.')).toHaveLength(3)
    })

    it('リフレッシュトークン生成に失敗した場合はエラーをスローする', async () => {
      const originalSecret = process.env.JWT_REFRESH_SECRET
      process.env.JWT_REFRESH_SECRET = ''
      
      await expect(generateRefreshToken(mockPayload)).rejects.toThrow('Failed to generate refresh token')
      
      process.env.JWT_REFRESH_SECRET = originalSecret
    })
  })

  describe('verifyJWT - JWTトークン検証', () => {
    it('有効なトークンを検証してペイロードを返す', async () => {
      const token = await generateJWT(mockPayload)
      const payload = await verifyJWT(token)
      
      expect(payload.userId).toBe(mockPayload.userId)
      expect(payload.email).toBe(mockPayload.email)
      expect(payload.role).toBe(mockPayload.role)
      expect(payload.iat).toBeDefined()
      expect(payload.exp).toBeDefined()
    })

    it('無効なトークンを認証エラーで拒否する', async () => {
      const invalidToken = 'invalid.token.here'
      
      await expect(verifyJWT(invalidToken)).rejects.toMatchObject({
        code: 'TOKEN_EXPIRED',
        message: 'Invalid or expired token',
      })
    })

    it('間違ったシークレットキーのトークンを拒否する', async () => {
      const token = await generateJWT(mockPayload)
      const originalSecret = process.env.JWT_SECRET
      process.env.JWT_SECRET = 'different-secret-key-32-chars-long'
      
      await expect(verifyJWT(token)).rejects.toMatchObject({
        code: 'TOKEN_EXPIRED',
        message: 'Invalid or expired token',
      })
      
      process.env.JWT_SECRET = originalSecret
    })
  })

  describe('verifyRefreshToken - リフレッシュトークン検証', () => {
    it('異なるシークレットキーでリフレッシュトークンを検証する', async () => {
      const refreshTokenValue = await generateRefreshToken(mockPayload)
      const payload = await verifyRefreshToken(refreshTokenValue)
      
      expect(payload.userId).toBe(mockPayload.userId)
      expect(payload.email).toBe(mockPayload.email)
      expect(payload.role).toBe(mockPayload.role)
    })

    it('無効なリフレッシュトークンを拒否する', async () => {
      const invalidToken = 'invalid.refresh.token'
      
      await expect(verifyRefreshToken(invalidToken)).rejects.toMatchObject({
        code: 'TOKEN_EXPIRED',
        message: 'Invalid or expired refresh token',
      })
    })
  })

  describe('getTokenPayload - ペイロード抽出', () => {
    it('クライアント用に検証なしでペイロードを抽出する', async () => {
      const token = await generateJWT(mockPayload)
      const payload = getTokenPayload(token)
      
      expect(payload).toBeDefined()
      expect(payload?.userId).toBe(mockPayload.userId)
      expect(payload?.email).toBe(mockPayload.email)
      expect(payload?.role).toBe(mockPayload.role)
    })

    it('不正な形式のトークンに対してnullを返す', () => {
      const malformedToken = 'not.a.valid.token.format'
      const payload = getTokenPayload(malformedToken)
      
      expect(payload).toBeNull()
    })

    it('無効なJSONを含むトークンに対してnullを返す', () => {
      const invalidToken = 'header.invalidjson.signature'
      const payload = getTokenPayload(invalidToken)
      
      expect(payload).toBeNull()
    })
  })

  describe('isTokenExpired - トークン有効期限チェック', () => {
    it('有効期限内のトークンを有効と判定する', async () => {
      const token = await generateJWT(mockPayload)
      const expired = isTokenExpired(token)
      
      expect(expired).toBe(false)
    })

    it('不正な形式のトークンを期限切れとして扱う', () => {
      const malformedToken = 'malformed.token'
      const expired = isTokenExpired(malformedToken)
      
      expect(expired).toBe(true)
    })

    it('exp クレームがないトークンを期限切れとして扱う', () => {
      const tokenWithoutExp = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0In0.signature'
      const expired = isTokenExpired(tokenWithoutExp)
      
      expect(expired).toBe(true)
    })
  })

  describe('refreshToken - トークンリフレッシュ', () => {
    it('有効なリフレッシュトークンから新しいトークンペアを生成する', async () => {
      const originalRefreshToken = await generateRefreshToken(mockPayload)
      const result = await refreshToken(originalRefreshToken)
      
      expect(result.token).toBeDefined()
      expect(result.refreshToken).toBeDefined()
      expect(result.token).not.toBe(originalRefreshToken)
      expect(result.refreshToken).not.toBe(originalRefreshToken)
      
      const newPayload = await verifyJWT(result.token)
      expect(newPayload.userId).toBe(mockPayload.userId)
    })

    it('リフレッシュ時に無効なリフレッシュトークンを拒否する', async () => {
      const invalidRefreshToken = 'invalid.refresh.token'
      
      await expect(refreshToken(invalidRefreshToken)).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
        message: 'Failed to refresh token',
      })
    })
  })

  describe('extractTokenFromHeader - ヘッダーからトークン抽出', () => {
    it('Bearer認証ヘッダーからトークンを抽出する', () => {
      const token = 'test-jwt-token'
      const authHeader = `Bearer ${token}`
      const extracted = extractTokenFromHeader(authHeader)
      
      expect(extracted).toBe(token)
    })

    it('Bearer以外のヘッダーに対してnullを返す', () => {
      const authHeader = 'Basic user:pass'
      const extracted = extractTokenFromHeader(authHeader)
      
      expect(extracted).toBeNull()
    })

    it('nullヘッダーに対してnullを返す', () => {
      const extracted = extractTokenFromHeader(null)
      
      expect(extracted).toBeNull()
    })

    it('不正な形式のBearerヘッダーに対してnullを返す', () => {
      const authHeader = 'Bearer'
      const extracted = extractTokenFromHeader(authHeader)

      expect(extracted).toBeNull()
    })
  })

  describe('createTokenPair - トークンペア作成', () => {
    it('アクセストークンとリフレッシュトークンを同時に作成する', async () => {
      const tokenPair = await createTokenPair(mockPayload)
      
      expect(tokenPair.token).toBeDefined()
      expect(tokenPair.refreshToken).toBeDefined()
      expect(tokenPair.token).not.toBe(tokenPair.refreshToken)
      
      const accessPayload = await verifyJWT(tokenPair.token)
      const refreshPayload = await verifyRefreshToken(tokenPair.refreshToken)
      
      expect(accessPayload.userId).toBe(mockPayload.userId)
      expect(refreshPayload.userId).toBe(mockPayload.userId)
    })

    it('異なる有効期限を持つトークンを作成する', async () => {
      const tokenPair = await createTokenPair(mockPayload)
      
      const accessPayload = getTokenPayload(tokenPair.token)
      const refreshPayload = getTokenPayload(tokenPair.refreshToken)
      
      expect(accessPayload?.exp).toBeDefined()
      expect(refreshPayload?.exp).toBeDefined()
      expect(refreshPayload!.exp).toBeGreaterThan(accessPayload!.exp)
    })
  })
})