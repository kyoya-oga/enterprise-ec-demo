# サーバーコンポーネント認証実装計画

## 🎯 目標
現在のステートレス認証システムをサーバーコンポーネント対応の完全な認証システムに拡張する

## 📋 実装ロードマップ

### Phase 1: セッション管理基盤 🔐
```typescript
// TODO: JWT/Cookie ベースのセッション管理実装

// 1. JWT ユーティリティ作成
// src/lib/auth/jwt.ts
// - JWT生成・検証関数
// - リフレッシュトークン機能
// - トークン有効期限管理

// 2. Cookie管理ユーティリティ
// src/lib/auth/cookies.ts  
// - HTTPOnly Cookie設定
// - セキュアフラグ対応
// - CSRF対策

// 3. セッション管理
// src/lib/auth/session.ts
// - サーバー側セッション検証
// - ユーザー情報取得
// - セッション無効化
```

### Phase 2: Middleware実装 🛡️
```typescript
// TODO: Next.js Middleware でルート保護

// middleware.ts (プロジェクトルート)
// - 認証が必要なルートの定義
// - JWTトークン検証
// - 未認証時のリダイレクト
// - 役割ベースアクセス制御

// 保護対象ルート:
// - /[locale]/(account)/* - ユーザーアカウント
// - /[locale]/(admin)/*   - 管理者専用
// - /[locale]/checkout    - チェックアウト
```

### Phase 3: サーバーコンポーネント認証 ⚡
```typescript
// TODO: サーバーコンポーネント用認証ユーティリティ

// src/lib/auth/server.ts
// - getServerSession(): サーバー側でセッション取得
// - getCurrentUser(): 現在のユーザー情報
// - requireAuth(): 認証必須コンポーネント用
// - hasRole(): 役割チェック

// 使用例:
// const user = await getCurrentUser()
// if (!user) redirect('/login')
```

### Phase 4: 状態管理・Context 🔄
```typescript
// TODO: クライアント側認証状態管理

// src/features/auth/context/AuthContext.tsx
// - 認証状態のContext Provider
// - login/logout アクション
// - 自動トークンリフレッシュ

// src/features/auth/hooks/useAuth.ts
// - 認証状態フック
// - ログイン/ログアウト関数
// - ローディング状態管理
```

### Phase 5: UI統合 🎨
```typescript
// TODO: 認証状態対応UI実装

// src/components/layout/Header.tsx
// - 認証状態による表示切り替え
// - ユーザーメニュー表示
// - ログアウト機能

// src/components/auth/
// - ProtectedRoute コンポーネント
// - LoginForm/RegisterForm 改良
// - AuthButton コンポーネント
```

## 🔧 技術仕様

### セキュリティ要件
- JWT: RS256アルゴリズム使用
- Cookie: HTTPOnly, Secure, SameSite=Strict
- CSRF: Double Submit Cookie パターン
- Rate Limiting: ログイン試行制限

### パフォーマンス要件  
- セッション検証: < 50ms
- JWT有効期限: 15分 (リフレッシュ: 7日)
- Cookie有効期限: 30日

### データベース移行
- JSON ファイル → PostgreSQL/MySQL
- ユーザーテーブル設計
- セッションテーブル追加
- インデックス最適化

## 📁 ファイル構成計画

```
src/
├── lib/auth/
│   ├── jwt.ts           # JWT ユーティリティ
│   ├── cookies.ts       # Cookie 管理
│   ├── session.ts       # セッション管理
│   ├── server.ts        # サーバー認証
│   └── middleware.ts    # Middleware ヘルパー
├── features/auth/
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useSession.ts
│   └── components/
│       ├── ProtectedRoute.tsx
│       └── AuthButton.tsx
└── middleware.ts        # Next.js Middleware
```

## ✅ 実装チェックリスト

### 基盤実装
- [ ] JWT ユーティリティ作成
- [ ] Cookie 管理実装
- [ ] セッション管理実装
- [ ] Middleware 作成

### サーバーコンポーネント対応
- [ ] getServerSession 実装
- [ ] requireAuth ユーティリティ
- [ ] 役割ベースアクセス制御

### UI統合
- [ ] AuthContext 実装
- [ ] useAuth フック作成
- [ ] Header コンポーネント更新
- [ ] ProtectedRoute 実装

### セキュリティ・テスト
- [ ] セキュリティテスト実装
- [ ] E2E テスト追加
- [ ] パフォーマンステスト
- [ ] セキュリティ監査

## 🚀 優先度

1. **High**: JWT + Cookie セッション管理
2. **High**: Middleware 実装
3. **Medium**: サーバーコンポーネント統合
4. **Medium**: Context/フック実装
5. **Low**: UI改良・UX向上

## 📝 注意事項

- 現在のAPI (/api/login, /api/register) は保持
- 既存のvalidation.tsは再利用
- 段階的実装でブレーキングチェンジを最小化
- テストファーストで開発推進