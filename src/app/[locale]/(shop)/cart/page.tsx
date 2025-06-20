import { CartItem, CartSummary, EmptyCart } from '@/features/cart/components'
import { CartItem as CartItemType } from '@/features/cart/types'

export default function CartPage({ params: { locale } }: { params: { locale: string } }) {
  const cartItems: CartItemType[] = [
    { id: 1, productId: 1, name: 'プレミアムヘッドフォン', price: 29800, quantity: 1, image: '/images/placeholder.jpg' },
    { id: 2, productId: 2, name: 'スマートウォッチ', price: 45000, quantity: 2, image: '/images/placeholder.jpg' },
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 500
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-12">ショッピングカート</h1>
          
          {cartItems.length === 0 ? (
            <EmptyCart locale={locale} />
          ) : (
            <div className="grid lg:grid-cols-12 gap-8">
              {/* カートアイテム一覧 */}
              <div className="lg:col-span-8 space-y-6">
                <div className="text-zinc-300 text-sm mb-4">
                  {cartItems.length}個の商品
                </div>
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
              
              {/* 注文サマリー */}
              <div className="lg:col-span-4">
                <CartSummary
                  subtotal={subtotal}
                  shipping={shipping}
                  total={total}
                  locale={locale}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}