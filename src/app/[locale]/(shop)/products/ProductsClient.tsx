'use client'

import { useState } from 'react'
import { ProductFilters } from './ProductFilters'
import { ProductGrid } from './ProductGrid'
import { ProductList } from './ProductList'
import { Pagination } from '@/components/ui'
import { useProductFiltering } from '@/features/products/hooks'
import type { Product } from '@/features/products/types'

interface ProductsClientProps {
  products: Product[]
  categories: string[]
}

export function ProductsClient({ products, categories }: ProductsClientProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  const {
    selectedCategory,
    sortBy,
    currentPage,
    paginatedData,
    handleCategoryChange,
    handleSortChange,
    handlePageChange
  } = useProductFiltering({ products, itemsPerPage: 8 })

  const handleAddToCart = (product: Product) => {
    console.log('商品をカートに追加:', product.name)
  }

  return (
    <>
      <ProductFilters
        categories={categories}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
        selectedCategory={selectedCategory}
        sortBy={sortBy}
      />

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <p className="text-zinc-400">
            {paginatedData.totalCount}件の商品が見つかりました
            {paginatedData.totalPages > 1 && (
              <span className="ml-2 text-zinc-500">
                (ページ {currentPage} / {paginatedData.totalPages})
              </span>
            )}
          </p>
          <div className="flex items-center space-x-2 text-sm text-zinc-500">
            <span>表示:</span>
            <div className="flex space-x-1">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'text-zinc-500 hover:text-zinc-400'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1 rounded transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'text-zinc-500 hover:text-zinc-400'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {viewMode === 'grid' ? (
        <ProductGrid products={paginatedData.products} onAddToCart={handleAddToCart} />
      ) : (
        <ProductList products={paginatedData.products} onAddToCart={handleAddToCart} />
      )}
      
      <Pagination
        currentPage={currentPage}
        totalPages={paginatedData.totalPages}
        onPageChange={handlePageChange}
      />
    </>
  )
}