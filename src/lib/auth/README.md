# 認証システム実装予定

## 📁 ディレクトリ構成

```
src/lib/auth/
├── README.md           # このファイル
├── jwt.ts             # JWT ユーティリティ (未実装)
├── cookies.ts         # Cookie 管理 (未実装)  
├── session.ts         # セッション管理 (未実装)
├── server.ts          # サーバー認証 (未実装)
└── middleware.ts      # Middleware ヘルパー (未実装)
```

## 🔧 実装予定ファイル

### jwt.ts - JWT ユーティリティ
```typescript
// TODO: JWT生成・検証機能
// - generateJWT(payload): JWT生成
// - verifyJWT(token): JWT検証  
// - refreshToken(token): トークンリフレッシュ
// - getTokenPayload(token): ペイロード取得
```

### cookies.ts - Cookie管理
```typescript  
// TODO: セキュアなCookie操作
// - setAuthCookie(response, token): 認証Cookie設定
// - getAuthCookie(request): 認証Cookie取得
// - clearAuthCookie(response): Cookie削除
// - validateCookieSettings(): Cookie設定検証
```

### session.ts - セッション管理
```typescript
// TODO: サーバー側セッション管理
// - createSession(user): セッション作成
// - getSession(token): セッション取得
// - updateSession(sessionId): セッション更新
// - invalidateSession(sessionId): セッション無効化
```

### server.ts - サーバー認証
```typescript
// TODO: サーバーコンポーネント用認証
// - getServerSession(): サーバー側セッション取得
// - getCurrentUser(): 現在ユーザー情報
// - requireAuth(): 認証必須ラッパー
// - hasRole(role): 役割チェック
```

### middleware.ts - Middleware ヘルパー
```typescript
// TODO: Middleware用ヘルパー関数
// - isProtectedRoute(pathname): 保護ルート判定
// - extractToken(request): トークン抽出
// - createRedirectResponse(url): リダイレクト応答
// - logAuthAttempt(request): 認証ログ
```

## 🎯 使用例 (実装後)

### サーバーコンポーネントでの認証チェック
```typescript
// app/account/page.tsx
import { getCurrentUser, requireAuth } from '@/lib/auth/server'

export default async function AccountPage() {
  const user = await requireAuth() // 認証必須
  
  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
    </div>
  )
}
```

### APIルートでの認証
```typescript
// app/api/protected/route.ts
import { getServerSession } from '@/lib/auth/server'

export async function GET() {
  const session = await getServerSession()
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // 認証済み処理
}
```

## 🚀 実装スケジュール

1. **Week 1**: jwt.ts + cookies.ts
2. **Week 2**: session.ts + server.ts  
3. **Week 3**: middleware.ts + 統合テスト
4. **Week 4**: UI統合 + E2Eテスト

## 📋 依存関係

```json
{
  "jsonwebtoken": "^9.0.0",
  "@types/jsonwebtoken": "^9.0.0",
  "jose": "^5.0.0"
}
```

## 🔒 セキュリティ要件

- JWT: RS256アルゴリズム必須
- Cookie: HTTPOnly, Secure, SameSite=Strict
- トークン有効期限: 15分 (リフレッシュ: 7日)
- Rate Limiting: 5回/分 (ログイン試行)
- CSRF: Double Submit Cookie パターン