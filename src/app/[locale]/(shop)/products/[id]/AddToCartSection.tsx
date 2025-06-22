'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { AddToCartButton } from '@/features/products/components'
import { ErrorDisplay } from '@/features/cart/components'
import type { Product } from '@/features/products/types'
import { useCartStore } from '@/features/cart/store'
import type { CartItem } from '@/features/cart/types'

interface AddToCartSectionProps {
  product: Product
  locale: string
}

export function AddToCartSection({ product, locale }: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()
  const addItem = useCartStore(state => state.addItem)
  const isLoading = useCartStore(state => state.isLoading)
  const error = useCartStore(state => state.error)
  const clearError = useCartStore(state => state.clearError)

  const handleAddToCart = async (product: Product) => {
    const item: CartItem = {
      id: product.id, // productIdと同じ値を使用
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image
    }
    await addItem(item)
    
    // 成功時にカートページに遷移
    if (!useCartStore.getState().error) {
      setQuantity(1)
      router.push(`/${locale}/cart`)
    }
  }

  return (
    <div className="space-y-4">
      {/* エラー表示 */}
      {error && (
        <ErrorDisplay error={error} onDismiss={clearError} />
      )}

      {/* Quantity Selector */}
      {product.stock > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-zinc-400">数量:</span>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={isLoading}
              className="px-3 py-1 border-zinc-700 text-zinc-300 hover:border-zinc-600 disabled:opacity-50"
            >
              -
            </Button>
            <span className="mx-4 text-white font-medium w-8 text-center">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              disabled={isLoading}
              className="px-3 py-1 border-zinc-700 text-zinc-300 hover:border-zinc-600 disabled:opacity-50"
            >
              +
            </Button>
          </div>
        </div>
      )}

      {/* Add to Cart */}
      <div className="pt-4">
        <AddToCartButton 
          product={product} 
          onAddToCart={handleAddToCart}
          isLoading={isLoading}
          className="w-full py-3 text-lg"
        />
      </div>
    </div>
  )
}