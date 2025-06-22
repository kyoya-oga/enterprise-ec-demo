'use client'

import { CartItem, CartSummary, EmptyCart, ErrorDisplay } from '@/features/cart/components'
import { useCartStore } from '@/features/cart/store'

export default function CartPage({ params: { locale } }: { params: { locale: string } }) {
  const items = useCartStore(state => state.items)
  const isLoading = useCartStore(state => state.isLoading)
  const error = useCartStore(state => state.error)
  const updateQuantity = useCartStore(state => state.updateQuantity)
  const removeItem = useCartStore(state => state.removeItem)
  const clearError = useCartStore(state => state.clearError)
  const subtotal = useCartStore(state => state.subtotal)
  const shipping = items.length > 0 ? 500 : 0
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-12">ショッピングカート</h1>
          
          {/* エラー表示 */}
          {error && (
            <div className="mb-6">
              <ErrorDisplay error={error} onDismiss={clearError} />
            </div>
          )}
          
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
                    isLoading={isLoading}
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