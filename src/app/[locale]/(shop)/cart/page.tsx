'use client'

import { CartItem, CartSummary, EmptyCart } from '@/features/cart/components'
import { useCartStore } from '@/features/cart/store'

export default function CartPage({ params: { locale } }: { params: { locale: string } }) {
  const items = useCartStore(state => state.items)
  const updateQuantity = useCartStore(state => state.updateQuantity)
  const removeItem = useCartStore(state => state.removeItem)
  const subtotal = useCartStore(state => state.subtotal)
  const shipping = items.length > 0 ? 500 : 0
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-12">ショッピングカート</h1>
          
          {items.length === 0 ? (
            <EmptyCart locale={locale} />
          ) : (
            <div className="grid lg:grid-cols-12 gap-8">
              {/* カートアイテム一覧 */}
              <div className="lg:col-span-8 space-y-6">
                <div className="text-zinc-300 text-sm mb-4">
                  {items.length}個の商品
                </div>
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
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