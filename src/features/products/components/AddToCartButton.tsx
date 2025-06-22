'use client'

import React from 'react'
import type { Product } from '@/features/products/types'
import { Button } from '@/components/ui'
import { LoadingSpinner } from '@/features/cart/components'

interface AddToCartButtonProps {
  product: Product
  onAddToCart?: (product: Product) => Promise<void>
  className?: string
  isLoading?: boolean
}

export function AddToCartButton({ product, onAddToCart, className, isLoading = false }: AddToCartButtonProps) {
  const handleAddToCart = async () => {
    await onAddToCart?.(product)
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={product.stock === 0 || isLoading}
      className={className || "w-full"}
      variant="default"
    >
      {isLoading ? (
        <LoadingSpinner size="sm" />
      ) : product.stock > 0 ? (
        'カートに追加'
      ) : (
        '在庫切れ'
      )}
    </Button>
  )
}