import { type User, type Session, type JWTPayload, type AuthError, type ServerAuthResult } from '@/features/auth/types'
import { verifyJWT, createTokenPair, isTokenExpired } from './jwt'
import { getAuthCookie, getRefreshCookie } from './cookies'
import { v4 as uuidv4 } from 'uuid'

const blacklistedSessions = new Set<string>()

export async function createSession(user: User): Promise<{
  session: Session
  tokens: { token: string; refreshToken: string }
}> {
  try {
    const sessionId = uuidv4()
    const now = new Date().toISOString()
    
    const jwtPayload: Omit<JWTPayload, 'iat' | 'exp'> = {
      userId: user.id,
      email: user.email,
      role: user.role,
    }
    
    const tokens = await createTokenPair(jwtPayload)
    
    const session: Session = {
      id: sessionId,
      userId: user.id,
      token: tokens.token,
      refreshToken: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      createdAt: now,
    }
    
    return { session, tokens }
  } catch (error) {
    throw new Error('Failed to create session')
  }
}

export async function getSession(token?: string): Promise<ServerAuthResult> {
  try {
    const authToken = token || getAuthCookie()
    
    if (!authToken) {
      return {
        user: null,
        session: null,
        error: {
          code: 'UNAUTHORIZED',
          message: 'No authentication token found',
        },
      }
    }
    
    if (blacklistedSessions.has(authToken)) {
      return {
        user: null,
        session: null,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Session has been invalidated',
        },
      }
    }
    
    const payload = await verifyJWT(authToken)
    
    const user = await getUserById(payload.userId)
    
    if (!user) {
      return {
        user: null,
        session: null,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not found',
        },
      }
    }
    
    const session: Session = {
      id: uuidv4(),
      userId: user.id,
      token: authToken,
      refreshToken: getRefreshCookie() || '',
      expiresAt: new Date(payload.exp * 1000).toISOString(),
      createdAt: new Date(payload.iat * 1000).toISOString(),
    }
    
    return {
      user,
      session,
      error: null,
    }
  } catch (error) {
    const authError = error as AuthError
    return {
      user: null,
      session: null,
      error: authError,
    }
  }
}

export async function getCurrentSession(): Promise<ServerAuthResult> {
  return getSession()
}

export async function getCurrentUser(): Promise<User | null> {
  const result = await getCurrentSession()
  return result.user
}

export async function updateSession(sessionId: string): Promise<boolean> {
  try {
    return true
  } catch (error) {
    return false
  }
}

export function invalidateSession(token: string): void {
  blacklistedSessions.add(token)
  
  setTimeout(() => {
    if (isTokenExpired(token)) {
      blacklistedSessions.delete(token)
    }
  }, 24 * 60 * 60 * 1000)
}

export async function invalidateUserSessions(userId: string): Promise<void> {
  console.log(`Invalidating all sessions for user: ${userId}`)
}

export async function isAuthenticated(): Promise<boolean> {
  const result = await getCurrentSession()
  return result.user !== null && result.error === null
}

export async function requireAuth(): Promise<User> {
  const result = await getCurrentSession()
  
  if (!result.user || result.error) {
    const error: AuthError = {
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
      details: result.error?.details,
    }
    throw error
  }
  
  return result.user
}

export async function hasRole(role: 'user' | 'admin'): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    return user?.role === role || false
  } catch (error) {
    return false
  }
}

export async function requireRole(role: 'user' | 'admin'): Promise<User> {
  const user = await requireAuth()
  
  if (user.role !== role) {
    const error: AuthError = {
      code: 'FORBIDDEN',
      message: `Role '${role}' required`,
      details: { userRole: user.role, requiredRole: role },
    }
    throw error
  }
  
  return user
}

async function getUserById(userId: string): Promise<User | null> {
  const mockUsers: Record<string, User> = {
    '1': {
      id: '1',
      email: 'user@example.com',
      firstName: '太郎',
      lastName: '田中',
      role: 'user',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    '2': {
      id: '2',
      email: 'admin@example.com',
      firstName: '花子',
      lastName: '佐藤',
      role: 'admin',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  }
  
  return mockUsers[userId] || null
}

export async function validateSession(token?: string): Promise<{
  isValid: boolean
  user: User | null
  error: AuthError | null
}> {
  try {
    const result = await getSession(token)
    return {
      isValid: result.user !== null && result.error === null,
      user: result.user,
      error: result.error,
    }
  } catch (error) {
    return {
      isValid: false,
      user: null,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Session validation failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      },
    }
  }
}