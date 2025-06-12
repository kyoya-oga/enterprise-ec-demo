'use client'

import type { Product } from '@/features/products/types'
import { Button } from '@/components/ui'

interface AddToCartButtonProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export function AddToCartButton({ product, onAddToCart }: AddToCartButtonProps) {
  const handleAddToCart = () => {
    onAddToCart?.(product)
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={product.stock === 0}
      className="w-full"
      variant="default"
    >
      {product.stock > 0 ? 'カートに追加' : '在庫切れ'}
    </Button>
  )
}