import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatPrice } from '@/lib/utils'

interface CartSummaryProps {
  subtotal: number
  shipping: number
  total: number
  locale: string
}

export function CartSummary({ subtotal, shipping, total, locale }: CartSummaryProps) {
  return (
    <Card className="p-8 sticky top-8 bg-zinc-800 border-zinc-700">
      <h3 className="font-semibold text-2xl text-white mb-8">注文サマリー</h3>
      
      <div className="space-y-6 mb-8">
        <div className="flex justify-between text-zinc-300 text-lg">
          <span>小計</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-zinc-300 text-lg">
          <span>配送料</span>
          <span>{formatPrice(shipping)}</span>
        </div>
        <div className="border-t border-zinc-600 pt-6">
          <div className="flex justify-between font-bold text-xl text-white">
            <span>合計</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
      
      <Button 
        className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-4 text-lg h-auto shadow-lg"
        asChild
      >
        <a href={`/${locale}/checkout`}>レジに進む</a>
      </Button>
      
      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-center text-zinc-400 text-sm">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          安全な決済
        </div>
        <p className="text-xs text-zinc-500 text-center">
          送料は商品やお住まいの地域により変動する場合があります
        </p>
      </div>
    </Card>
  )
}