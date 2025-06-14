// TODO: サーバーコンポーネント認証実装時の型拡張予定
// - Session インターフェース追加
// - JWTPayload インターフェース追加  
// - AuthError エラー型追加
// - RefreshToken 型追加
export interface User {
  readonly id: string
  readonly email: string
  readonly firstName: string
  readonly lastName: string
  readonly avatar?: string
  readonly role: 'user' | 'admin'
  readonly createdAt: string
  readonly updatedAt: string
}

export interface ApiUser extends User {
  readonly passwordHash: string
}

export interface AuthState {
  readonly user: User | null
  readonly isAuthenticated: boolean
  readonly isLoading: boolean
  // TODO: 将来追加予定のフィールド
  // readonly sessionExpiry: string | null
  // readonly lastActivity: string | null
  // readonly refreshing: boolean
}

export interface LoginCredentials {
  readonly email: string
  readonly password: string
}

export interface RegisterData {
  readonly email: string
  readonly password: string
  readonly firstName: string
  readonly lastName: string
}

export interface AuthActions {
  readonly login: (credentials: LoginCredentials) => Promise<void>
  readonly register: (data: RegisterData) => Promise<void>
  readonly logout: () => void
  readonly refreshUser: () => Promise<void>
}

// TODO: 将来実装予定の追加インターフェース
/*
export interface Session {
  readonly id: string
  readonly userId: string
  readonly token: string
  readonly refreshToken: string
  readonly expiresAt: string
  readonly createdAt: string
}

export interface JWTPayload {
  readonly userId: string
  readonly email: string
  readonly role: 'user' | 'admin'
  readonly iat: number
  readonly exp: number
}

export interface AuthError {
  readonly code: 'INVALID_CREDENTIALS' | 'TOKEN_EXPIRED' | 'UNAUTHORIZED' | 'FORBIDDEN'
  readonly message: string
  readonly details?: Record<string, unknown>
}

export interface ServerAuthResult {
  readonly user: User | null
  readonly session: Session | null
  readonly error: AuthError | null
}
*/