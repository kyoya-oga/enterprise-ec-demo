# ハイブリッド型認証移行計画

## 🎯 目標
現在のミドルウェア重視型認証を、効率的で堅牢なハイブリッド型認証システムに移行する

## 📊 現在の問題点

### ❌ **現在のミドルウェア実装の課題**
```typescript
// middleware.ts - 現在の実装
export async function middleware(request: NextRequest) {
  // 🔴 問題点:
  const payload = await verifyJWT(authToken) // エッジでJWT検証（重い）
  // 🔴 データベースアクセス不可
  // 🔴 セッション無効化チェック不可
  // 🔴 デバッグが困難
}
```

## 🚀 ハイブリッド型アーキテクチャ

### 1. **軽量ミドルウェア** - 高速な事前チェック
```typescript
// middleware.ts - 軽量版
export async function middleware(request: NextRequest) {
  // ✅ トークン存在チェックのみ（軽量）
  const hasToken = request.cookies.get('auth-token')?.value
  
  if (!hasToken && isProtectedPath(pathname)) {
    return NextResponse.redirect('/login')
  }
  
  // ✅ JWT検証は行わない（Server Componentで実行）
  return NextResponse.next()
}
```

### 2. **Server Component認証** - 堅牢な詳細チェック
```typescript
// app/account/page.tsx
export default async function AccountPage() {
  // ✅ フルNode.js環境でDB接続可能
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // ✅ 最新のユーザー情報で認証
  return <AccountContent user={user} />
}
```

## 📋 移行ロードマップ

### Phase 1: ミドルウェア軽量化 🔥 **最優先**
```typescript
// TODO: middleware.ts の軽量化
// 
// 変更内容:
// - JWT検証を削除
// - トークン存在チェックのみ
// - ヘッダー注入を削除
// - 役割ベースアクセス制御を削除
//
// 期待効果:
// - エッジでの実行時間 <10ms
// - エラー発生率の低下
// - デバッグの簡易化
```

### Phase 2: Server Component認証強化 ⚡
```typescript
// TODO: src/lib/auth/server.ts の強化
//
// 新機能追加:
// - requireAuth(): 認証必須ラッパー
// - requireRole(): 役割必須ラッパー  
// - getAuthHeaders(): ヘッダーからユーザー情報取得
// - withAuth(): 高階コンポーネント
//
// 使用例:
// export default withAuth(async function AdminPage() {
//   return <AdminContent />
// }, { requireRole: 'admin' })
```

### Phase 3: 保護されたページの更新 🛡️
```typescript
// TODO: 各保護ページの更新
//
// 対象ページ:
// - app/[locale]/(account)/*
// - app/[locale]/(admin)/*  
// - app/[locale]/(shop)/checkout/page.tsx
//
// 変更内容:
// - requireAuth() または withAuth() を追加
// - 個別の認証チェック実装
// - エラーハンドリング強化
```

## 🔧 実装詳細

### 軽量ミドルウェア設計
```typescript
// middleware.ts - 新しい実装
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Locale extraction
  const localeMatch = pathname.match(/^\/([a-z]{2})\//)
  const locale = localeMatch ? localeMatch[1] : 'ja'
  
  // Protected route patterns
  const protectedPatterns = ['/account/', '/admin/', '/checkout']
  const isProtected = protectedPatterns.some(pattern => 
    pathname.includes(`/${locale}${pattern}`)
  )
  
  if (!isProtected) {
    return NextResponse.next()
  }
  
  // 軽量チェック: トークン存在のみ
  const hasAuthToken = request.cookies.has('auth-token')
  
  if (!hasAuthToken) {
    const loginUrl = new URL(`/${locale}/login`, request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  return NextResponse.next()
}
```

### 強化されたServer Component認証
```typescript
// src/lib/auth/server.ts - 新機能追加
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

// 認証必須ラッパー
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return user
}

// 役割必須ラッパー
export async function requireRole(role: string): Promise<User> {
  const user = await requireAuth()
  
  if (user.role !== role) {
    redirect('/forbidden')
  }
  
  return user
}

// 高階コンポーネント
export function withAuth<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  options?: { requireRole?: string }
) {
  return async function AuthenticatedComponent(props: T) {
    const user = options?.requireRole 
      ? await requireRole(options.requireRole)
      : await requireAuth()
    
    return <Component {...props} user={user} />
  }
}
```

### ページ実装例
```typescript
// app/[locale]/(account)/profile/page.tsx
import { requireAuth } from '@/lib/auth/server'

export default async function ProfilePage() {
  // ✅ 認証チェック + DB検証
  const user = await requireAuth()
  
  return (
    <div>
      <h1>プロフィール</h1>
      <p>ようこそ、{user.name}さん</p>
    </div>
  )
}

// app/[locale]/(admin)/dashboard/page.tsx  
import { requireRole } from '@/lib/auth/server'

export default async function AdminDashboard() {
  // ✅ 管理者権限チェック
  const admin = await requireRole('admin')
  
  return <AdminDashboardContent admin={admin} />
}

// または高階コンポーネント版
export default withAuth(async function AdminDashboard({ user }) {
  return <AdminDashboardContent admin={user} />
}, { requireRole: 'admin' })
```

## 📊 パフォーマンス比較

### 現在の実装
```
ミドルウェア: JWT検証(~30ms) + 権限チェック(~10ms) = 40ms
Server Component: ユーザー情報取得(~20ms) = 20ms
合計: ~60ms
```

### ハイブリッド型
```
ミドルウェア: トークン存在チェック(~5ms) = 5ms
Server Component: JWT検証 + DB検証 + 認証(~40ms) = 40ms  
合計: ~45ms (25%改善)
```

## ✅ 移行チェックリスト

### Phase 1: ミドルウェア軽量化
- [ ] JWT検証ロジックを削除
- [ ] トークン存在チェックのみに簡素化
- [ ] ヘッダー注入機能を無効化
- [ ] 役割ベースアクセス制御を削除
- [ ] テスト実行・検証

### Phase 2: Server Component認証強化  
- [ ] requireAuth() 関数実装
- [ ] requireRole() 関数実装
- [ ] withAuth() 高階コンポーネント実装
- [ ] エラーハンドリング強化
- [ ] テスト実装

### Phase 3: ページ更新
- [ ] /account/* ページ更新
- [ ] /admin/* ページ更新  
- [ ] /checkout ページ更新
- [ ] E2Eテスト実行
- [ ] パフォーマンステスト

### Phase 4: 最適化・監視
- [ ] パフォーマンス測定
- [ ] エラーログ監視設定
- [ ] ドキュメント更新
- [ ] 運用マニュアル作成

## 🎯 期待される効果

### パフォーマンス向上
- **エッジ実行時間**: 40ms → 5ms (87%改善)
- **全体レスポンス**: 60ms → 45ms (25%改善)
- **エラー発生率**: 大幅削減

### 開発・運用改善
- **デバッグ容易性**: ミドルウェアのデバッグ困難さを解消
- **柔軟性**: 複雑な認証ロジックに対応可能
- **可読性**: 認証ロジックの分離で理解しやすい
- **テスタビリティ**: Server Componentは通常のテストが可能

### セキュリティ強化
- **最新情報チェック**: DB接続でリアルタイム認証
- **セッション管理**: ログアウト済みトークンの検証
- **詳細な監査**: Server Componentでの詳細ログ

## 🚀 実装開始の推奨順序

1. **Phase 1実装** (即座に開始可能) - ミドルウェア軽量化
2. **Phase 2実装** (Phase 1完了後) - Server Component強化  
3. **Phase 3実装** (段階的) - ページ更新
4. **最終検証** - E2E テスト・パフォーマンス測定

この移行により、現在の機能を保持しながら、より効率的で堅牢な認証システムを実現できます。