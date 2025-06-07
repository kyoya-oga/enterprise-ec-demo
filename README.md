# 🛍️ Enterprise EC Demo

**モダンなエンタープライズ級ECサイトのデモンストレーション**

Next.js 14 App Router、TypeScript、Tailwind CSSを使用したモダンなECサイトのフロントエンド実装デモです。

## 🌟 特徴

- **モダンUI/UX**: 洗練されたデザインとスムーズなインタラクション
- **レスポンシブデザイン**: モバイルファーストのアプローチ
- **国際化対応**: 多言語対応（日本語・英語）
- **タイプセーフ**: TypeScriptによる型安全性
- **パフォーマンス最適化**: Next.js 14の最新機能を活用
- **アクセシビリティ**: WCAG 2.1準拠
- **ダークモード対応**: システム設定に応じた自動切り替え

## 🛠️ 技術スタック

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, CSS Variables
- **UI Components**: カスタムデザインシステム
- **Build Tools**: Turbopack, ESLint, Prettier
- **Fonts**: Inter (Google Fonts)

## 🚀 Quick Start

```bash
# リポジトリのクローン
git clone https://github.com/username/enterprise-ec-demo.git
cd enterprise-ec-demo

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてデモサイトを確認できます。

## 📱 デモ機能

### 🏪 ショップ機能
- **製品一覧**: カテゴリ別の製品表示
- **製品詳細**: 詳細情報と画像ギャラリー
- **検索機能**: 製品名・カテゴリでの検索
- **カート機能**: 商品の追加・削除・数量変更
- **決済フロー**: チェックアウトプロセス

### 👤 ユーザー機能
- **アカウント管理**: プロフィール編集
- **注文履歴**: 過去の注文確認
- **お気に入り**: 製品のブックマーク
- **住所管理**: 配送先住所の登録

### 🔐 認証機能
- **ログイン・登録**: メール認証
- **パスワードリセット**: セキュアな復旧フロー
- **セッション管理**: 安全なユーザーセッション

### 🛡️ 管理機能
- **ダッシュボード**: 売上・注文状況の概要
- **製品管理**: 商品の追加・編集・削除
- **注文管理**: 注文状況の確認・更新
- **顧客管理**: ユーザー情報の管理

## 📁 プロジェクト構成

```
src/
├── app/                     # Next.js App Router
│   ├── [locale]/            # 多言語対応ルーティング
│   │   ├── (shop)/          # ショップ機能
│   │   ├── (account)/       # アカウント管理
│   │   ├── (auth)/          # 認証機能
│   │   └── (admin)/         # 管理機能
│   ├── globals.css          # グローバルスタイル
│   └── layout.tsx           # ルートレイアウト
├── components/              # 再利用可能コンポーネント
│   ├── ui/                  # UIコンポーネント
│   └── layout/              # レイアウトコンポーネント
├── features/                # 機能別モジュール
│   ├── auth/                # 認証機能
│   ├── cart/                # カート機能
│   ├── checkout/            # 決済機能
│   └── products/            # 製品機能
├── lib/                     # ユーティリティライブラリ
├── styles/                  # スタイルファイル
└── types/                   # TypeScript型定義
```

## 🎨 UI コンポーネント

### デザインシステム
- **Button**: グラデーション、ホバーエフェクト、サイズバリエーション
- **Card**: モダンなシャドウ、ホバーアニメーション
- **Input**: フォーカス状態、エラー表示、ヘルパーテキスト
- **Layout**: レスポンシブヘッダー・フッター

### スタイル特徴
- **カラーパレット**: Red/Pink グラデーション + Zinc グレースケール
- **タイポグラフィ**: Inter フォントファミリー
- **アニメーション**: スムーズなトランジション
- **ダークモード**: CSS Variables による自動切り替え

## 📄 ライセンス

このプロジェクトはデモンストレーション目的で作成されています。

---

## 🔧 詳細アーキテクチャ設計

```
src/
├── app/                     # Next.js App Router
├── components/              # 共通UIコンポーネント
├── features/                # 機能ベースのモジュール
├── server/                  # サーバーサイドコード
├── lib/                     # 共通ユーティリティ
├── i18n/                    # 国際化
├── monitoring/              # 監視・観測性
├── performance/             # パフォーマンス最適化
├── styles/                  # グローバルスタイル
├── types/                   # グローバル型定義
├── config/                  # アプリケーション設定
└── middleware.ts            # Next.js ミドルウェア
```

## 🗂️ app ディレクトリ（国際化対応）

```
app/
├── [locale]/                # 言語別ルーティング
│   ├── (shop)/              # ショップ関連ページ
│   │   ├── page.tsx         # ホームページ
│   │   ├── products/        # 製品関連ページ
│   │   │   ├── page.tsx     # 製品一覧
│   │   │   ├── [id]/        # 製品詳細
│   │   │   └── search/      # 製品検索
│   │   ├── categories/      # カテゴリー関連
│   │   ├── cart/            # カート
│   │   ├── checkout/        # 決済
│   │   ├── orders/          # 注文関連
│   │   └── layout.tsx       # ショップレイアウト
│   ├── (account)/           # アカウント関連ページ
│   │   ├── profile/         # プロフィール
│   │   ├── orders/          # 注文履歴
│   │   ├── addresses/       # 住所管理
│   │   ├── payment-methods/ # 支払い方法
│   │   ├── wishlist/        # お気に入り
│   │   ├── reviews/         # レビュー管理
│   │   └── layout.tsx       # アカウントレイアウト
│   ├── (auth)/              # 認証関連ページ
│   │   ├── login/           # ログイン
│   │   ├── register/        # 登録
│   │   ├── forgot-password/ # パスワードリセット
│   │   ├── mfa/             # 多要素認証
│   │   └── layout.tsx       # 認証レイアウト
│   ├── (admin)/             # 管理者ページ
│   │   ├── dashboard/       # ダッシュボード
│   │   ├── products/        # 製品管理
│   │   ├── orders/          # 注文管理
│   │   ├── customers/       # 顧客管理
│   │   ├── analytics/       # 分析
│   │   ├── experiments/     # A/Bテスト管理
│   │   ├── compliance/      # コンプライアンス
│   │   └── layout.tsx       # 管理者レイアウト
│   ├── layout.tsx           # ロケールレイアウト
│   ├── not-found.tsx        # 404ページ
│   └── error.tsx            # エラーページ
├── api/                     # API Routes
│   ├── webhook/             # Webhook エンドポイント
│   │   ├── stripe/          # Stripe Webhook
│   │   ├── analytics/       # アナリティクス Webhook
│   │   └── [...]/           # その他のWebhook
│   ├── graphql/             # GraphQL エンドポイント
│   ├── v1/                  # REST API v1
│   └── v2/                  # REST API v2
└── robots.txt               # ロボット設定
```

## 📊 features ディレクトリの詳細構成

```
features/
├── products/                # 製品関連機能
│   ├── components/          # 製品コンポーネント
│   ├── hooks/               # カスタムフック
│   ├── store/               # 状態管理
│   ├── types/               # 型定義
│   ├── utils/               # ユーティリティ
│   └── index.ts             # 公開API
├── cart/                    # カート関連機能
├── checkout/                # 決済関連機能
├── auth/                    # 認証関連機能
├── user/                    # ユーザー関連機能
├── orders/                  # 注文関連機能
├── search/                  # 検索関連機能
├── reviews/                 # レビュー関連機能
├── wishlist/                # お気に入り関連機能
├── notifications/           # 通知関連機能
├── experiments/             # A/Bテスト機能
│   ├── components/
│   │   └── ExperimentWrapper.tsx
│   ├── config/
│   ├── hooks/
│   └── tracking/
├── recommendations/         # レコメンデーション機能
└── chat/                    # カスタマーサポートチャット
```

## 🖥️ server ディレクトリの詳細構成

```
server/
├── db/                      # データベース関連
│   ├── schema/              # スキーマ定義
│   ├── repositories/        # データアクセスレイヤー
│   ├── migrations/          # データベース移行
│   └── seed/                # シードデータ
├── api/                     # API関連
│   ├── trpc/                # tRPC設定
│   │   ├── routers/         # tRPCルーター
│   │   ├── procedures.ts    # 共通プロシージャ
│   │   └── index.ts         # tRPCエクスポート
│   ├── graphql/             # GraphQL設定
│   │   ├── schema/          # GraphQLスキーマ
│   │   ├── resolvers/       # リゾルバー
│   │   └── directives/      # カスタムディレクティブ
│   └── rest/                # RESTエンドポイント
│       ├── v1/              # バージョン1
│       └── v2/              # バージョン2
├── services/                # ビジネスロジック
│   ├── product/             # 製品関連サービス
│   ├── order/               # 注文関連サービス
│   ├── payment/             # 決済関連サービス
│   ├── inventory/           # 在庫管理サービス
│   ├── notification/        # 通知サービス
│   ├── pricing/             # 価格計算サービス
│   └── shipping/            # 配送サービス
├── actions/                 # Server Actions
│   ├── product.ts           # 製品関連アクション
│   ├── cart.ts              # カート関連アクション
│   ├── checkout.ts          # 決済関連アクション
│   └── auth.ts              # 認証関連アクション
├── auth/                    # 認証・認可
│   ├── providers/           # 認証プロバイダー
│   ├── strategies/          # 認証戦略
│   ├── mfa/                 # 多要素認証
│   ├── sso/                 # シングルサインオン
│   ├── oauth/               # OAuth2プロバイダー
│   ├── passwordless/        # パスワードレス認証
│   ├── permissions.ts       # 権限管理
│   └── auth.config.ts       # Auth.js設定
├── security/                # セキュリティ
│   ├── csp.ts               # Content Security Policy
│   ├── rate-limiter.ts      # レート制限
│   ├── sanitization.ts      # 入力値サニタイゼーション
│   ├── encryption.ts        # 暗号化
│   ├── audit-log.ts         # 監査ログ
│   └── threat-detection.ts  # 脅威検知
├── events/                  # イベント駆動アーキテクチャ
│   ├── emitters/            # イベント発行
│   ├── handlers/            # イベントハンドラー
│   └── queue/               # メッセージキュー
│       ├── redis/           # Redis設定
│       ├── jobs/            # ジョブ定義
│       └── workers/         # ワーカープロセス
├── ai/                      # AI/ML機能
│   ├── recommendations/     # レコメンデーション
│   │   ├── collaborative/   # 協調フィルタリング
│   │   ├── content-based/   # コンテンツベース
│   │   └── hybrid/          # ハイブリッド
│   ├── search/              # 検索機能
│   │   ├── semantic/        # セマンティック検索
│   │   └── personalized/    # パーソナライズ検索
│   ├── chatbot/             # チャットボット
│   ├── fraud-detection/     # 不正検知
│   └── demand-forecasting/  # 需要予測
├── cache/                   # キャッシング
│   ├── strategies/          # キャッシュ戦略
│   ├── invalidation/        # キャッシュ無効化
│   ├── warmup/              # キャッシュウォームアップ
│   └── distributed/         # 分散キャッシュ
├── analytics/               # 分析・BI
│   ├── collectors/          # データ収集
│   ├── processors/          # データ処理
│   ├── export/              # データエクスポート
│   └── realtime/            # リアルタイム分析
├── compliance/              # コンプライアンス
│   ├── gdpr/                # GDPR対応
│   ├── pci-dss/             # PCI DSS準拠
│   ├── data-retention/      # データ保持ポリシー
│   └── privacy/             # プライバシー管理
├── integrations/            # 外部サービス連携
│   ├── payment/             # 決済サービス
│   │   ├── stripe/          # Stripe
│   │   ├── paypal/          # PayPal
│   │   └── square/          # Square
│   ├── shipping/            # 配送サービス
│   │   ├── fedex/           # FedEx
│   │   ├── ups/             # UPS
│   │   └── dhl/             # DHL
│   ├── email/               # メールサービス
│   │   ├── sendgrid/        # SendGrid
│   │   └── templates/       # メールテンプレート
│   ├── sms/                 # SMSサービス
│   ├── storage/             # ストレージサービス
│   │   ├── s3/              # AWS S3
│   │   └── cloudinary/      # Cloudinary
│   ├── analytics/           # アナリティクス
│   │   ├── google/          # Google Analytics
│   │   ├── mixpanel/        # Mixpanel
│   │   └── segment/         # Segment
│   └── crm/                 # CRM連携
├── middleware/              # サーバーミドルウェア
│   ├── logging.ts           # ロギング
│   ├── error-handling.ts    # エラーハンドリング
│   ├── request-id.ts        # リクエストID
│   └── correlation-id.ts    # 相関ID
├── utils/                   # サーバーユーティリティ
└── config/                  # サーバー設定
    ├── env.ts               # 環境変数
    ├── constants.ts         # 定数
    └── feature-flags.ts     # 機能フラグ
```

## 🌐 i18n ディレクトリ構成

```
i18n/
├── locales/                 # 言語別リソース
│   ├── ja/                  # 日本語
│   │   ├── common.json      # 共通
│   │   ├── products.json    # 製品関連
│   │   ├── checkout.json    # 決済関連
│   │   └── errors.json      # エラーメッセージ
│   ├── en/                  # 英語
│   └── [locale]/            # その他の言語
├── config.ts                # i18n設定
├── middleware.ts            # 言語検出ミドルウェア
├── utils/                   # i18nユーティリティ
└── types.ts                 # 型定義
```

## 📊 monitoring ディレクトリ構成

```
monitoring/
├── logger/                  # ロギング
│   ├── server.ts            # サーバーサイドロガー
│   ├── client.ts            # クライアントサイドロガー
│   └── structured.ts        # 構造化ロギング
├── metrics/                 # メトリクス
│   ├── performance.ts       # パフォーマンスメトリクス
│   ├── business.ts          # ビジネスメトリクス
│   └── custom.ts            # カスタムメトリクス
├── tracing/                 # トレーシング
│   ├── opentelemetry.ts     # OpenTelemetry設定
│   └── instrumentation.ts   # 計装
├── alerting/                # アラート
│   ├── rules.ts             # アラートルール
│   └── channels.ts          # 通知チャネル
└── dashboards/              # ダッシュボード設定
```

## 🚀 performance ディレクトリ構成

```
performance/
├── images/                  # 画像最適化
│   ├── optimization.ts      # 画像最適化
│   ├── lazy-loading.ts      # 遅延読み込み
│   └── responsive.ts        # レスポンシブ画像
├── prefetch/                # プリフェッチ
│   ├── routes.ts            # ルートプリフェッチ
│   └── resources.ts         # リソースプリフェッチ
├── web-vitals/              # Web Vitals
│   ├── monitoring.ts        # モニタリング
│   └── optimization.ts      # 最適化
├── bundle/                  # バンドル最適化
│   ├── splitting.ts         # コード分割
│   └── tree-shaking.ts      # Tree Shaking
└── caching/                 # クライアントキャッシュ
```

## 📦 packages ディレクトリ（Monorepo構成）

```
packages/
├── shared/                  # 共有ライブラリ
│   ├── ui/                  # UI コンポーネント
│   ├── utils/               # ユーティリティ
│   ├── types/               # 共有型定義
│   └── constants/           # 共有定数
├── product-service/         # 製品サービス（将来の分離準備）
├── order-service/           # 注文サービス
├── user-service/            # ユーザーサービス
├── payment-service/         # 決済サービス
├── notification-service/    # 通知サービス
└── analytics-service/       # 分析サービス
```

## 🧪 tests ディレクトリの詳細構成

```
tests/
├── unit/                    # ユニットテスト
│   ├── components/          # コンポーネントテスト
│   ├── hooks/               # フックテスト
│   ├── utils/               # ユーティリティテスト
│   └── services/            # サービステスト
├── integration/             # 統合テスト
│   ├── api/                 # APIテスト
│   ├── db/                  # データベーステスト
│   └── external/            # 外部サービステスト
├── e2e/                     # E2Eテスト
│   ├── critical-paths/      # クリティカルパステスト
│   │   ├── checkout.spec.ts # 決済フロー
│   │   ├── registration.spec.ts # 登録フロー
│   │   └── search.spec.ts   # 検索フロー
│   ├── visual-regression/   # ビジュアルリグレッション
│   └── accessibility/       # アクセシビリティテスト
├── performance/             # パフォーマンステスト
│   ├── load-testing/        # 負荷テスト
│   ├── stress-testing/      # ストレステスト
│   └── benchmark/           # ベンチマーク
├── security/                # セキュリティテスト
│   ├── penetration/         # ペネトレーションテスト
│   ├── vulnerability/       # 脆弱性テスト
│   └── compliance/          # コンプライアンステスト
├── fixtures/                # テストデータ
├── mocks/                   # モック
└── utils/                   # テストユーティリティ
```

## 📚 docs ディレクトリの詳細構成

```
docs/
├── architecture/            # アーキテクチャドキュメント
│   ├── overview.md          # 概要
│   ├── data-flow.md         # データフロー
│   ├── security.md          # セキュリティ設計
│   └── scalability.md       # スケーラビリティ設計
├── api/                     # API仕様書
│   ├── rest/                # REST API
│   ├── graphql/             # GraphQL API
│   └── websocket/           # WebSocket API
├── setup/                   # セットアップガイド
│   ├── development.md       # 開発環境
│   ├── production.md        # 本番環境
│   └── troubleshooting.md   # トラブルシューティング
├── development/             # 開発ガイド
│   ├── coding-standards.md  # コーディング規約
│   ├── git-workflow.md      # Gitワークフロー
│   └── testing-strategy.md  # テスト戦略
├── deployment/              # デプロイメントガイド
│   ├── ci-cd.md             # CI/CDパイプライン
│   ├── monitoring.md        # モニタリング設定
│   └── disaster-recovery.md # 災害復旧計画
└── business/                # ビジネスドキュメント
    ├── requirements.md      # 要件定義
    ├── roadmap.md           # ロードマップ
    └── kpi.md               # KPI定義
```

## 🔧 設定ファイル（ルートレベル）

```
/
├── .env.example             # 環境変数サンプル
├── .env.local               # ローカル環境変数
├── next.config.js           # Next.js設定
├── tailwind.config.js       # Tailwind CSS設定
├── tsconfig.json            # TypeScript設定
├── prisma/                  # Prisma設定
│   ├── schema.prisma        # スキーマ定義
│   └── migrations/          # マイグレーション
├── package.json             # パッケージ定義
├── turbo.json               # Turborepo設定
├── docker-compose.yml       # Docker Compose設定
├── Dockerfile               # Dockerfile
└── .github/                 # GitHub設定
    ├── workflows/           # GitHub Actions
    │   ├── ci.yml           # CI パイプライン
    │   ├── cd.yml           # CD パイプライン
    │   └── security.yml     # セキュリティスキャン
    └── CODEOWNERS           # コードオーナー
```

## 🚀 デプロイメント

このプロジェクトはモダンなホスティングプラットフォームでのデプロイメントを想定した設計となっています。

### 推奨プラットフォーム
- **Vercel**: Next.jsアプリケーションの最適化されたホスティング
- **Netlify**: 静的サイト生成とサーバーレス機能
- **Cloudflare Pages**: エッジコンピューティングプラットフォーム

### 環境変数設定例

```bash
# .env.example
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

## 🧪 テスト

ユニットテストは [Vitest](https://vitest.dev/) を利用します。

```bash
# ユニットテスト実行
npm run test

# E2Eテスト実行
npm run test:e2e

# カバレッジ確認
npm run test:coverage
```

## 🔧 開発ガイド

### コーディング規約
- **ESLint**: コード品質の維持
- **Prettier**: コードフォーマットの統一
- **TypeScript**: 型安全性の確保

### ブランチ戦略
- `main`: 本番環境用のブランチ
- `develop`: 開発環境用のブランチ
- `feature/*`: 機能開発用のブランチ

