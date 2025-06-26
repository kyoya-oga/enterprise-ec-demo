import { AuthCard } from '@/components/ui/AuthCard'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface ForbiddenPageProps {
  params: {
    locale: string
  }
}

export default function ForbiddenPage({ params }: ForbiddenPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 flex items-center justify-center p-4">
      <AuthCard 
        title="アクセス拒否"
        description="このページにアクセスする権限がありません。"
      >
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-red-600 dark:text-red-400">
              403
            </h1>
          </div>

          <div className="space-y-4">
            <div className="text-sm text-zinc-500 dark:text-zinc-500">
              <p>管理者権限が必要なページです。</p>
              <p>適切な権限をお持ちでない場合は、管理者にお問い合わせください。</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                asChild
                variant="default"
              >
                <Link href={`/${params.locale}`}>
                  ホームに戻る
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline"
              >
                <Link href={`/${params.locale}/login`}>
                  ログイン
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </AuthCard>
    </div>
  )
}