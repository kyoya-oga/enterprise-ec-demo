# サーバーコンポーネント認証実装計画

## 🎯 目標
現在の部分実装済み認証システムを完全なサーバーコンポーネント対応認証システムに完成させる

**現在の実装状況: 約60%完了** ✅
- セッション管理基盤（JWT/Cookie/Session）: 完了
- 登録システム（UI + Server Actions + API）: 完了  
- 型定義システム: 完了
- バリデーション機能: 完了

## 📋 実装ロードマップ

### Phase 1: セッション管理基盤 🔐 ✅ **完了済み**
```typescript
// ✅ COMPLETED: JWT/Cookie ベースのセッション管理実装

// ✅ 1. JWT ユーティリティ作成
// src/lib/auth/jwt.ts
// - JWT生成・検証関数 ✅
// - リフレッシュトークン機能 ✅
// - トークン有効期限管理 ✅

// ✅ 2. Cookie管理ユーティリティ
// src/lib/auth/cookies.ts  
// - HTTPOnly Cookie設定 ✅
// - セキュアフラグ対応 ✅
// - CSRF対策 ✅

// ✅ 3. セッション管理
// src/lib/auth/session.ts
// - サーバー側セッション検証 ✅
// - ユーザー情報取得 ✅
// - セッション無効化 ✅
```

### Phase 2: Middleware実装 🛡️ ⚠️ **最優先**
```typescript
// 🔥 NEXT: Next.js Middleware でルート保護
// 現在: コメントアウトされた実装のみ存在

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

### Phase 3: サーバーコンポーネント認証 ⚡ ✅ **完了済み**
```typescript
// ✅ COMPLETED: サーバーコンポーネント用認証ユーティリティ

// ✅ src/lib/auth/server.ts
// - getServerSession(): サーバー側でセッション取得 ✅
// - getCurrentUser(): 現在のユーザー情報 ✅  
// - requireAuth(): 認証必須コンポーネント用 ✅
// - hasRole(): 役割チェック ✅

// 使用例:
// const user = await getCurrentUser()
// if (!user) redirect('/login')
```

### Phase 4: 状態管理・Context 🔄 ⚠️ **次の優先実装**
```typescript
// 🔥 TODO: クライアント側認証状態管理
// 現在: features/auth/hooks/ と features/auth/context/ ディレクトリは空

// src/features/auth/context/AuthContext.tsx
// - 認証状態のContext Provider
// - login/logout アクション
// - 自動トークンリフレッシュ

// src/features/auth/hooks/useAuth.ts
// - 認証状態フック
// - ログイン/ログアウト関数
// - ローディング状態管理
```

### Phase 5: UI統合 🎨 🔶 **部分実装**
```typescript
// 🔶 PARTIAL: 認証状態対応UI実装
// ✅ 登録UI: 完全実装済み
// ❌ ログインUI: 基本UIのみ、機能なし
// ❌ 認証コンポーネント: 未実装

// src/components/layout/Header.tsx
// - 認証状態による表示切り替え
// - ユーザーメニュー表示
// - ログアウト機能

// src/features/auth/components/
// - ProtectedRoute コンポーネント ❌
// - LoginForm 機能実装 ❌（UIは存在）
// - AuthButton コンポーネント ❌
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

### 基盤実装 ✅ **完了済み**
- [x] JWT ユーティリティ作成
- [x] Cookie 管理実装
- [x] セッション管理実装
- [ ] Middleware 作成 🔥 **最優先**

### サーバーコンポーネント対応 ✅ **完了済み**
- [x] getServerSession 実装
- [x] requireAuth ユーティリティ
- [x] 役割ベースアクセス制御

### 認証機能統合 🔶 **部分実装**
- [x] 登録システム（UI + API + Server Actions）
- [ ] ログイン機能完成 🔥 **最優先**
- [ ] API統合完了（JWT生成部分）

### UI統合 ❌ **未実装**
- [ ] AuthContext 実装
- [ ] useAuth フック作成
- [ ] Header コンポーネント更新
- [ ] ProtectedRoute 実装

### セキュリティ・テスト
- [ ] セキュリティテスト実装
- [ ] E2E テスト追加
- [ ] パフォーマンステスト
- [ ] セキュリティ監査

## 🚀 更新された優先度（現在の実装状況ベース）

### 🔥 **最優先（Immediate）**
1. **ログイン機能完成** - UIは完成、機能実装のみ
2. **認証ミドルウェア実装** - middleware.ts の有効化  
3. **API統合完了** - login/register APIのJWT生成部分

### ⚠️ **次の優先（Next）**
4. **クライアントサイド状態管理** - AuthContext + useAuth
5. **認証コンポーネント** - ProtectedRoute実装

### 📝 **後回し（Later）**
6. **Header更新** - 認証状態対応UI
7. **セキュリティテスト・監査**

## 📝 注意事項・更新情報

### ✅ **実装済み項目の保持**
- 現在のAPI (/api/login, /api/register) は保持
- 既存のvalidation.tsは再利用
- JWT/Cookie/Session管理は完成品として利用
- 型定義システムは完成品として利用

### 🔄 **実装方針の更新**
- **段階的完成**: 残り40%を効率的に実装
- **既存資産活用**: 高品質な実装済み部分を最大限活用
- **最小工数**: ログイン機能 → Middleware → クライアント状態管理の順
- **テスト統合**: 実装完了後に包括的テスト実施

### 📊 **現在の実装状況サマリー**
- **実装完了**: セッション管理、登録システム、型定義、バリデーション
- **部分実装**: ログイン（UIのみ）、API統合（JWT生成部分）
- **未実装**: Middleware、クライアント状態管理、認証コンポーネント