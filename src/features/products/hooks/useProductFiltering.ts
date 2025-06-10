'use client'

import { useState, useMemo } from 'react'
import type { Product } from '../types'

export interface UseProductFilteringProps {
  products: Product[]
  itemsPerPage?: number
}

export interface UseProductFilteringReturn {
  // State
  selectedCategory: string
  sortBy: 'price_asc' | 'price_desc' | 'rating' | 'newest'
  currentPage: number
  
  // Computed values
  filteredProducts: Product[]
  paginatedData: {
    products: Product[]
    totalPages: number
    totalCount: number
  }
  
  // Actions
  handleCategoryChange: (category: string) => void
  handleSortChange: (sort: 'price_asc' | 'price_desc' | 'rating' | 'newest') => void
  handlePageChange: (page: number) => void
}

export function useProductFiltering({ 
  products, 
  itemsPerPage = 8 
}: UseProductFilteringProps): UseProductFilteringReturn {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating' | 'newest'>('newest')
  const [currentPage, setCurrentPage] = useState<number>(1)

  const filteredProducts = useMemo(() => 
    products.filter(product => 
      selectedCategory === 'all' || product.category === selectedCategory
    ), [products, selectedCategory]
  )

  const paginatedData = useMemo(() => {
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

    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentProducts = sortedProducts.slice(startIndex, endIndex)

    return {
      products: currentProducts,
      totalPages,
      totalCount: sortedProducts.length
    }
  }, [filteredProducts, sortBy, currentPage, itemsPerPage])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handleSortChange = (sort: 'price_asc' | 'price_desc' | 'rating' | 'newest') => {
    setSortBy(sort)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return {
    selectedCategory,
    sortBy,
    currentPage,
    filteredProducts,
    paginatedData,
    handleCategoryChange,
    handleSortChange,
    handlePageChange
  }
}