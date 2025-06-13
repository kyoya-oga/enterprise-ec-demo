'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import { AddToCartButton } from '@/features/products/components'
import type { Product } from '@/features/products/types'

interface AddToCartSectionProps {
  product: Product
}

export function AddToCartSection({ product }: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = (product: Product) => {
    console.log('Added to cart:', product, 'Quantity:', quantity)
  }

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      {product.stock > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-zinc-400">数量:</span>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1 border-zinc-700 text-zinc-300 hover:border-zinc-600"
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
              className="px-3 py-1 border-zinc-700 text-zinc-300 hover:border-zinc-600"
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
          className="w-full py-3 text-lg"
        />
      </div>
    </div>
  )
}