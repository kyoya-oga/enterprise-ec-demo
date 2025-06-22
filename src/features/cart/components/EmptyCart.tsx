import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface EmptyCartProps {
  locale: string
}

export function EmptyCart({ locale }: EmptyCartProps) {
  return (
    <Card className="text-center py-16 bg-zinc-700 border-zinc-600">
      <div className="space-y-4">
        <div className="w-16 h-16 mx-auto bg-zinc-600 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5-1.5M7 13h10M7 13v4a2 2 0 002 2h10a2 2 0 002-2v-4m-14 0H5" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">カートは空です</h3>
          <p className="text-zinc-400 text-sm">
            お気に入りの商品を見つけてカートに追加しましょう
          </p>
        </div>
        <Button 
          className="mt-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
          asChild
        >
          <a href={`/${locale}/products`}>商品を見る</a>
        </Button>
      </div>
    </Card>
  )
}