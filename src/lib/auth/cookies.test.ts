import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextResponse } from 'next/server'
import {
  setAuthCookie,
  setRefreshCookie,
  setCSRFCookie,
  setAuthCookies,
  clearAuthCookies,
  clearAuthCookie,
  clearRefreshCookie,
  validateCookieSettings,
  generateCSRFToken,
  verifyCSRFToken,
  getCookieNames,
} from '@/lib/auth/cookies'

// Mock NextResponse
const mockNextResponse = {
  cookies: {
    set: vi.fn(),
  },
} as unknown as NextResponse

describe('Cookie 管理', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('setAuthCookie - 認証Cookie設定', () => {
    it('セキュア設定で認証Cookieを設定する', () => {
      const token = 'test-auth-token'
      setAuthCookie(mockNextResponse, token)
      
      expect(mockNextResponse.cookies.set).toHaveBeenCalledWith(
        'auth-token',
        token,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 15 * 60, // 15 minutes
          path: '/',
        }
      )
    })

    it('環境に基づいてセキュアフラグを設定する', () => {
      vi.stubEnv('NODE_ENV', 'production')
      
      setAuthCookie(mockNextResponse, 'token')
      
      expect(mockNextResponse.cookies.set).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({ secure: true })
      )
      
      vi.unstubAllEnvs()
    })
  })

  describe('setRefreshCookie - リフレッシュCookie設定', () => {
    it('長い有効期限でリフレッシュトークンを設定する', () => {
      const refreshToken = 'test-refresh-token'
      setRefreshCookie(mockNextResponse, refreshToken)
      
      expect(mockNextResponse.cookies.set).toHaveBeenCalledWith(
        'refresh-token',
        refreshToken,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60, // 7 days
          path: '/',
        }
      )
    })
  })

  describe('setCSRFCookie - CSRFトークン設定', () => {
    it('JavaScriptからアクセス可能なCSRFトークンを設定する', () => {
      const csrfToken = 'test-csrf-token'
      setCSRFCookie(mockNextResponse, csrfToken)
      
      expect(mockNextResponse.cookies.set).toHaveBeenCalledWith(
        'csrf-token',
        csrfToken,
        {
          httpOnly: false, // Must be accessible to JS
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60, // 24 hours
          path: '/',
        }
      )
    })
  })

  describe('setAuthCookies - 認証Cookie一括設定', () => {
    it('認証CookieとリフレッシュCookieの両方を設定する', () => {
      setAuthCookies(mockNextResponse, 'auth-token', 'refresh-token')
      
      expect(mockNextResponse.cookies.set).toHaveBeenCalledTimes(2)
      expect(mockNextResponse.cookies.set).toHaveBeenNthCalledWith(
        1,
        'auth-token',
        'auth-token',
        expect.any(Object)
      )
      expect(mockNextResponse.cookies.set).toHaveBeenNthCalledWith(
        2,
        'refresh-token',
        'refresh-token',
        expect.any(Object)
      )
    })

    it('CSRFトークンが提供された場合はCSRF Cookieも設定する', () => {
      setAuthCookies(mockNextResponse, 'auth-token', 'refresh-token', 'csrf-token')
      
      expect(mockNextResponse.cookies.set).toHaveBeenCalledTimes(3)
      expect(mockNextResponse.cookies.set).toHaveBeenNthCalledWith(
        3,
        'csrf-token',
        'csrf-token',
        expect.any(Object)
      )
    })

    it('CSRFトークンが提供されない場合はCSRF Cookieをスキップする', () => {
      setAuthCookies(mockNextResponse, 'auth-token', 'refresh-token', undefined)
      
      expect(mockNextResponse.cookies.set).toHaveBeenCalledTimes(2)
    })
  })

  describe('clearAuthCookies - 認証Cookie削除', () => {
    it('maxAge 0で全ての認証Cookieを削除する', () => {
      clearAuthCookies(mockNextResponse)
      
      expect(mockNextResponse.cookies.set).toHaveBeenCalledTimes(3)
      
      // Auth cookie
      expect(mockNextResponse.cookies.set).toHaveBeenNthCalledWith(
        1,
        'auth-token',
        '',
        expect.objectContaining({ maxAge: 0, httpOnly: true })
      )
      
      // Refresh cookie
      expect(mockNextResponse.cookies.set).toHaveBeenNthCalledWith(
        2,
        'refresh-token',
        '',
        expect.objectContaining({ maxAge: 0, httpOnly: true })
      )
      
      // CSRF cookie
      expect(mockNextResponse.cookies.set).toHaveBeenNthCalledWith(
        3,
        'csrf-token',
        '',
        expect.objectContaining({ maxAge: 0, httpOnly: false })
      )
    })
  })

  describe('clearAuthCookie - 認証Cookie単体削除', () => {
    it('認証Cookieのみを削除する', () => {
      clearAuthCookie(mockNextResponse)
      
      expect(mockNextResponse.cookies.set).toHaveBeenCalledTimes(1)
      expect(mockNextResponse.cookies.set).toHaveBeenCalledWith(
        'auth-token',
        '',
        expect.objectContaining({ maxAge: 0 })
      )
    })
  })

  describe('clearRefreshCookie - リフレッシュCookie削除', () => {
    it('リフレッシュトークンCookieのみを削除する', () => {
      clearRefreshCookie(mockNextResponse)
      
      expect(mockNextResponse.cookies.set).toHaveBeenCalledTimes(1)
      expect(mockNextResponse.cookies.set).toHaveBeenCalledWith(
        'refresh-token',
        '',
        expect.objectContaining({ maxAge: 0 })
      )
    })
  })

  describe('validateCookieSettings - Cookie設定検証', () => {
    it('問題がない場合は有効として返す', () => {
      const result = validateCookieSettings()
      
      expect(result.isValid).toBe(true)
      expect(result.issues).toHaveLength(0)
    })

    it('将来の検証ルール用の構造を提供する', () => {
      const result = validateCookieSettings()
      
      expect(result).toHaveProperty('isValid')
      expect(result).toHaveProperty('issues')
      expect(Array.isArray(result.issues)).toBe(true)
    })
  })

  describe('generateCSRFToken - CSRFトークン生成', () => {
    it('ランダムなCSRFトークンを生成する', () => {
      const token1 = generateCSRFToken()
      const token2 = generateCSRFToken()
      
      expect(token1).toBeDefined()
      expect(token2).toBeDefined()
      expect(token1).not.toBe(token2)
      expect(typeof token1).toBe('string')
      expect(token1.length).toBeGreaterThan(0)
    })

    it('crypto.getRandomValuesが利用可能な場合は使用する', () => {
      const originalCrypto = global.crypto
      global.crypto = {
        getRandomValues: vi.fn((array) => {
          for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256)
          }
          return array
        }),
      } as any
      
      const token = generateCSRFToken()
      
      expect(global.crypto.getRandomValues).toHaveBeenCalled()
      expect(token).toBeDefined()
      expect(token.length).toBe(64) // 32 bytes * 2 hex chars
      
      global.crypto = originalCrypto
    })

    it('cryptoが利用不可の場合はMath.randomにフォールバックする', () => {
      const originalCrypto = global.crypto
      const originalRequire = global.require
      
      global.crypto = undefined as any
      global.require = undefined as any
      
      const token = generateCSRFToken()
      
      expect(token).toBeDefined()
      expect(token).toContain('-') // Should use fallback format
      
      global.crypto = originalCrypto
      global.require = originalRequire
    })
  })

  describe('verifyCSRFToken - CSRFトークン検証', () => {
    it('一致するトークンに対してtrueを返す', () => {
      const token = 'matching-csrf-token'
      const isValid = verifyCSRFToken(token, token)
      
      expect(isValid).toBe(true)
    })

    it('一致しないトークンに対してfalseを返す', () => {
      const isValid = verifyCSRFToken('token1', 'token2')
      
      expect(isValid).toBe(false)
    })

    it('ヘッダートークンがnullの場合はfalseを返す', () => {
      const isValid = verifyCSRFToken(null, 'cookie-token')
      
      expect(isValid).toBe(false)
    })

    it('CookieトークンがnullのCookieはfalseを返す', () => {
      const isValid = verifyCSRFToken('header-token', null)
      
      expect(isValid).toBe(false)
    })

    it('両方のトークンがnullの場合はfalseを返す', () => {
      const isValid = verifyCSRFToken(null, null)
      
      expect(isValid).toBe(false)
    })
  })

  describe('getCookieNames - Cookie名取得', () => {
    it('参照用に全てのCookie名を返す', () => {
      const names = getCookieNames()
      
      expect(names).toEqual({
        AUTH_COOKIE_NAME: 'auth-token',
        REFRESH_COOKIE_NAME: 'refresh-token',
        CSRF_COOKIE_NAME: 'csrf-token',
      })
    })

    it('アプリケーション全体で一貫した命名を提供する', () => {
      const names = getCookieNames()
      
      expect(names.AUTH_COOKIE_NAME).toBeDefined()
      expect(names.REFRESH_COOKIE_NAME).toBeDefined()
      expect(names.CSRF_COOKIE_NAME).toBeDefined()
      expect(typeof names.AUTH_COOKIE_NAME).toBe('string')
    })
  })
})