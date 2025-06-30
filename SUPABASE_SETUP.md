# Supabase Setup

This project can use [Supabase](https://supabase.com/) as the backend database and authentication provider. The following steps outline how to create a project, obtain API keys and configure the environment.

## 1. Create a Supabase project
1. Sign in at [supabase.com](https://supabase.com/) and create a new project.
2. Choose a **database password** and wait for the project to be provisioned.

## 2. Obtain API keys
1. In your Supabase project navigate to **Settings → API**.
2. Copy the **Project URL** – this becomes `SUPABASE_URL`.
3. Copy the **anon public key** – this becomes `SUPABASE_ANON_KEY`.
4. Copy the **service role key** – this becomes `SUPABASE_SERVICE_ROLE_KEY`.
5. Under **Database → Connection string** copy the **URI** for the PostgreSQL connection. This value will be used for `DATABASE_URL`.

## 3. Configure environment variables
Update `.env.local` (or `.env.example` when sharing) with the values you copied:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://username:password@db.your-project.supabase.co:5432/postgres
```

## 4. Run Prisma migrations
After configuring the variables, install dependencies and run the migrations:

```bash
npx prisma migrate dev
```

This command creates the database schema in your Supabase PostgreSQL instance.
