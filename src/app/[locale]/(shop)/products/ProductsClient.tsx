'use client'

import { useState } from 'react'
import { ProductFilters } from './ProductFilters'
import { ProductGrid } from './ProductGrid'
import type { Product } from '@/features/products/types'

interface ProductsClientProps {
  products: Product[]
  categories: string[]
}

export function ProductsClient({ products, categories }: ProductsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating' | 'newest'>('newest')

  const filteredProducts = products.filter(product => 
    selectedCategory === 'all' || product.category === selectedCategory
  )

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price
      case 'price_desc':
        return b.price - a.price
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      case 'newest':
      default:
        return b.id - a.id
    }
  })

  const handleAddToCart = (product: Product) => {
    console.log('商品をカートに追加:', product.name)
  }

  return (
    <>
      <ProductFilters
        categories={categories}
        onCategoryChange={setSelectedCategory}
        onSortChange={setSortBy}
        selectedCategory={selectedCategory}
        sortBy={sortBy}
      />

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <p className="text-zinc-400">
            {sortedProducts.length}件の商品が見つかりました
          </p>
          <div className="flex items-center space-x-2 text-sm text-zinc-500">
            <span>表示:</span>
            <div className="flex space-x-1">
              <button className="p-1 rounded bg-red-500/20 text-red-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button className="p-1 rounded text-zinc-500 hover:text-zinc-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <ProductGrid products={sortedProducts} onAddToCart={handleAddToCart} />
    </>
  )
}