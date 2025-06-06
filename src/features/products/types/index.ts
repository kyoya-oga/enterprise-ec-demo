export interface Product {
  id: number
  name: string
  description?: string
  price: number
  image?: string
  category?: string
  stock: number
  rating?: number
  reviews?: number
}

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  inStock?: boolean
}

export interface ProductSearchParams {
  query?: string
  filters?: ProductFilters
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest'
  page?: number
  limit?: number
}