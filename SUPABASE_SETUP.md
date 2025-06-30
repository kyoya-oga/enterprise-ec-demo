# Supabase セットアップ

このプロジェクトでは、バックエンドのデータベースおよび認証プロバイダーとして [Supabase](https://supabase.com/) を使用できます。以下の手順では、プロジェクトの作成、APIキーの取得、環境の設定方法について概説します。

## 1. Supabaseプロジェクトの作成
1. [supabase.com](https://supabase.com/) にサインインし、新しいプロジェクトを作成します。
2. **データベースのパスワード**を選択し、プロジェクトがプロビジョニングされるのを待ちます。

## 2. APIキーの取得
1. Supabaseプロジェクトで、**Settings → API** に移動します。
2. **Project URL** をコピーします。これが `SUPABASE_URL` になります。
3. **anon public key** をコピーします。これが `SUPABASE_ANON_KEY` になります。
4. **service role key** をコピーします。これが `SUPABASE_SERVICE_ROLE_KEY` になります。
5. **Database → Connection string** で、PostgreSQL接続用の **URI** をコピーします。この値は `DATABASE_URL` として使用されます。

## 3. 環境変数の設定
コピーした値で `.env.local`（または共有する場合は `.env.example`）を更新します。

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://username:password@db.your-project.supabase.co:5432/postgres
```

## 4. Prismaマイグレーションの実行
変数を設定した後、依存関係をインストールし、マイグレーションを実行します。

```bash
npx prisma migrate dev
```

このコマンドは、SupabaseのPostgreSQLインスタンスにデータベーススキーマを作成します。