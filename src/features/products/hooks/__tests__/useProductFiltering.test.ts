import { renderHook, act } from '@testing-library/react'
import { useProductFiltering } from '../useProductFiltering'
import type { Product } from '../../types'

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Product 1',
    price: 100,
    category: 'electronics',
    stock: 10,
    rating: 4.5
  },
  {
    id: 2,
    name: 'Product 2',
    price: 200,
    category: 'clothing',
    stock: 5,
    rating: 3.5
  },
  {
    id: 3,
    name: 'Product 3',
    price: 150,
    category: 'electronics',
    stock: 0,
    rating: 5.0
  },
  {
    id: 4,
    name: 'Product 4',
    price: 300,
    category: 'books',
    stock: 15,
    rating: 4.0
  },
  {
    id: 5,
    name: 'Product 5',
    price: 50,
    category: 'electronics',
    stock: 8,
  }
]

describe('useProductFiltering', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', {
      value: vi.fn(),
      writable: true
    })
  })

  it('デフォルト値で初期化される', () => {
    const { result } = renderHook(() => 
      useProductFiltering({ products: mockProducts })
    )

    expect(result.current.selectedCategory).toBe('all')
    expect(result.current.sortBy).toBe('newest')
    expect(result.current.currentPage).toBe(1)
  })

  it('カテゴリで商品をフィルタリングできる', () => {
    const { result } = renderHook(() => 
      useProductFiltering({ products: mockProducts })
    )

    act(() => {
      result.current.handleCategoryChange('electronics')
    })

    expect(result.current.selectedCategory).toBe('electronics')
    expect(result.current.filteredProducts).toHaveLength(3)
    expect(result.current.filteredProducts.every((p: Product) => p.category === 'electronics')).toBe(true)
    expect(result.current.currentPage).toBe(1)
  })

  it('カテゴリが"all"の場合は全商品を表示する', () => {
    const { result } = renderHook(() => 
      useProductFiltering({ products: mockProducts })
    )

    act(() => {
      result.current.handleCategoryChange('electronics')
    })

    act(() => {
      result.current.handleCategoryChange('all')
    })

    expect(result.current.selectedCategory).toBe('all')
    expect(result.current.filteredProducts).toHaveLength(5)
  })

  describe('ソート機能', () => {
    it('価格昇順でソートできる', () => {
      const { result } = renderHook(() => 
        useProductFiltering({ products: mockProducts, itemsPerPage: 10 })
      )

      act(() => {
        result.current.handleSortChange('price_asc')
      })

      expect(result.current.sortBy).toBe('price_asc')
      expect(result.current.paginatedData.products[0].price).toBe(50)
      expect(result.current.paginatedData.products[4].price).toBe(300)
    })

    it('価格降順でソートできる', () => {
      const { result } = renderHook(() => 
        useProductFiltering({ products: mockProducts, itemsPerPage: 10 })
      )

      act(() => {
        result.current.handleSortChange('price_desc')
      })

      expect(result.current.sortBy).toBe('price_desc')
      expect(result.current.paginatedData.products[0].price).toBe(300)
      expect(result.current.paginatedData.products[4].price).toBe(50)
    })

    it('評価でソートできる', () => {
      const { result } = renderHook(() => 
        useProductFiltering({ products: mockProducts, itemsPerPage: 10 })
      )

      act(() => {
        result.current.handleSortChange('rating')
      })

      expect(result.current.sortBy).toBe('rating')
      expect(result.current.paginatedData.products[0].rating).toBe(5.0)
      expect(result.current.paginatedData.products[1].rating).toBe(4.5)
    })

    it('新着順（ID降順）でソートできる', () => {
      const { result } = renderHook(() => 
        useProductFiltering({ products: mockProducts, itemsPerPage: 10 })
      )

      act(() => {
        result.current.handleSortChange('newest')
      })

      expect(result.current.sortBy).toBe('newest')
      expect(result.current.paginatedData.products[0].id).toBe(5)
      expect(result.current.paginatedData.products[4].id).toBe(1)
    })

    it('ソート変更時にページが1にリセットされる', () => {
      const { result } = renderHook(() => 
        useProductFiltering({ products: mockProducts, itemsPerPage: 2 })
      )

      act(() => {
        result.current.handlePageChange(2)
      })

      expect(result.current.currentPage).toBe(2)

      act(() => {
        result.current.handleSortChange('price_asc')
      })

      expect(result.current.currentPage).toBe(1)
    })
  })

  describe('ページネーション機能', () => {
    it('商品を正しくページ分割する', () => {
      const { result } = renderHook(() => 
        useProductFiltering({ products: mockProducts, itemsPerPage: 2 })
      )

      expect(result.current.paginatedData.products).toHaveLength(2)
      expect(result.current.paginatedData.totalPages).toBe(3)
      expect(result.current.paginatedData.totalCount).toBe(5)
    })

    it('ページ変更を処理できる', () => {
      const { result } = renderHook(() => 
        useProductFiltering({ products: mockProducts, itemsPerPage: 2 })
      )

      act(() => {
        result.current.handlePageChange(2)
      })

      expect(result.current.currentPage).toBe(2)
      expect(result.current.paginatedData.products).toHaveLength(2)
    })

    it('ページ変更時にトップにスクロールする', () => {
      const scrollToSpy = vi.spyOn(window, 'scrollTo')
      
      const { result } = renderHook(() => 
        useProductFiltering({ products: mockProducts, itemsPerPage: 2 })
      )

      act(() => {
        result.current.handlePageChange(2)
      })

      expect(scrollToSpy).toHaveBeenCalledWith({ 
        top: 0, 
        behavior: 'smooth' 
      })
    })

    it('最後のページで正しい数の商品を表示する', () => {
      const { result } = renderHook(() => 
        useProductFiltering({ products: mockProducts, itemsPerPage: 2 })
      )

      act(() => {
        result.current.handlePageChange(3)
      })

      expect(result.current.paginatedData.products).toHaveLength(1)
    })
  })

  describe('フィルタリングとページネーションの組み合わせ', () => {
    it('カテゴリフィルタ変更時にページネーションがリセットされる', () => {
      const { result } = renderHook(() => 
        useProductFiltering({ products: mockProducts, itemsPerPage: 2 })
      )

      act(() => {
        result.current.handlePageChange(2)
      })

      expect(result.current.currentPage).toBe(2)

      act(() => {
        result.current.handleCategoryChange('electronics')
      })

      expect(result.current.currentPage).toBe(1)
      expect(result.current.selectedCategory).toBe('electronics')
    })

    it('フィルタリング結果を正しくページ分割する', () => {
      const { result } = renderHook(() => 
        useProductFiltering({ products: mockProducts, itemsPerPage: 2 })
      )

      act(() => {
        result.current.handleCategoryChange('electronics')
      })

      expect(result.current.paginatedData.totalCount).toBe(3)
      expect(result.current.paginatedData.totalPages).toBe(2)
      expect(result.current.paginatedData.products).toHaveLength(2)
    })
  })

  describe('エッジケース', () => {
    it('空の商品配列を処理できる', () => {
      const { result } = renderHook(() => 
        useProductFiltering({ products: [] })
      )

      expect(result.current.paginatedData.products).toHaveLength(0)
      expect(result.current.paginatedData.totalPages).toBe(0)
      expect(result.current.paginatedData.totalCount).toBe(0)
    })

    it('評価なしの商品を処理できる', () => {
      const productsWithoutRating: Product[] = [
        { id: 1, name: 'Product 1', price: 100, category: 'test', stock: 10 },
        { id: 2, name: 'Product 2', price: 200, category: 'test', stock: 5, rating: 4.0 }
      ]

      const { result } = renderHook(() => 
        useProductFiltering({ products: productsWithoutRating, itemsPerPage: 10 })
      )

      act(() => {
        result.current.handleSortChange('rating')
      })

      expect(result.current.paginatedData.products[0].rating).toBe(4.0)
      expect(result.current.paginatedData.products[1].rating).toBeUndefined()
    })

    it('itemsPerPageが指定されていない場合はデフォルト値を使用する', () => {
      const { result } = renderHook(() => 
        useProductFiltering({ products: mockProducts })
      )

      expect(result.current.paginatedData.products).toHaveLength(5)
      expect(result.current.paginatedData.totalPages).toBe(1)
    })
  })
})