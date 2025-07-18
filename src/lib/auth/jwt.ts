import { SignJWT, jwtVerify } from 'jose'
import { type JWTPayload, type AuthError } from '@/features/auth/types'

// Throw error if secrets are not provided in production
if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-secret-key') {
    throw new Error('JWT_SECRET must be set in production environment')
  }
  if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET === 'your-refresh-secret-key') {
    throw new Error('JWT_REFRESH_SECRET must be set in production environment')
  }
}

const getJWTSecret = (): string => {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT secret not provided')
  return secret
}

const getRefreshSecret = (): string => {
  const secret = process.env.JWT_REFRESH_SECRET
  if (!secret) throw new Error('Refresh secret not provided')
  return secret
}

const getSecretKey = (secret: string) => new TextEncoder().encode(secret)

const JWT_EXPIRY = '15m'
const REFRESH_TOKEN_EXPIRY = '7d'
const ALGORITHM = 'HS256'

const generateJti = () =>
  (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : Math.random().toString(36).slice(2))

export async function generateJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  try {
    const secretKey = getSecretKey(getJWTSecret())

    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRY)
      .setJti(generateJti())
      .setIssuer(process.env.JWT_ISSUER || 'enterprise-ec-demo')
      .setAudience(process.env.JWT_AUDIENCE || 'enterprise-ec-demo')
      .sign(secretKey)

    return jwt
  } catch (error) {
    throw new Error('Failed to generate JWT token')
  }
}

export async function generateRefreshToken(
  payload: Omit<JWTPayload, 'iat' | 'exp'>,
): Promise<string> {
  try {
    const secretKey = getSecretKey(getRefreshSecret())

    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(REFRESH_TOKEN_EXPIRY)
      .setJti(generateJti())
      .setIssuer(process.env.JWT_ISSUER || 'enterprise-ec-demo')
      .setAudience(process.env.JWT_AUDIENCE || 'enterprise-ec-demo')
      .sign(secretKey)

    return jwt
  } catch (error) {
    throw new Error('Failed to generate refresh token')
  }
}

export async function verifyJWT(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(getJWTSecret()), {
      algorithms: [ALGORITHM],
      issuer: process.env.JWT_ISSUER || 'enterprise-ec-demo',
      audience: process.env.JWT_AUDIENCE || 'enterprise-ec-demo',
    })

    return payload as unknown as JWTPayload
  } catch (error) {
    const authError: AuthError = {
      code: 'TOKEN_EXPIRED',
      message: 'Invalid or expired token',
      details: { error: error instanceof Error ? error.message : 'Unknown error' },
    }
    throw authError
  }
}

export async function verifyRefreshToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(getRefreshSecret()), {
      algorithms: [ALGORITHM],
      issuer: process.env.JWT_ISSUER || 'enterprise-ec-demo',
      audience: process.env.JWT_AUDIENCE || 'enterprise-ec-demo',
    })

    return payload as unknown as JWTPayload
  } catch (error) {
    const authError: AuthError = {
      code: 'TOKEN_EXPIRED',
      message: 'Invalid or expired refresh token',
      details: { error: error instanceof Error ? error.message : 'Unknown error' },
    }
    throw authError
  }
}

export function getTokenPayload(token: string): JWTPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString('utf8')
    )

    return payload as unknown as JWTPayload
  } catch (error) {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = getTokenPayload(token)
    if (!payload || !payload.exp) {
      return true
    }

    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp < currentTime
  } catch {
    return true
  }
}

export async function refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
  try {
    const payload = await verifyRefreshToken(refreshToken)
    const newTokenPayload = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    }

    const newToken = await generateJWT(newTokenPayload)
    const newRefreshToken = await generateRefreshToken(newTokenPayload)

    return {
      token: newToken,
      refreshToken: newRefreshToken,
    }
  } catch (error) {
    const authError: AuthError = {
      code: 'UNAUTHORIZED',
      message: 'Failed to refresh token',
      details: { error: error instanceof Error ? error.message : 'Unknown error' },
    }
    throw authError
  }
}

export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  return authHeader.substring(7)
}

export async function createTokenPair(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<{
  token: string
  refreshToken: string
}> {
  const [token, refreshToken] = await Promise.all([
    generateJWT(payload),
    generateRefreshToken(payload),
  ])

  return { token, refreshToken }
}
