'use client'

import { ProductCard } from '@/features/products/components'
import type { Product } from '@/features/products/types'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface ProductListProps {
  products: Product[]
}

export function ProductList({ products }: ProductListProps) {
  const { locale } = useParams() as { locale: string }
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-zinc-400 text-lg mb-2">選択されたカテゴリーに商品がありません</p>
          <p className="text-zinc-600 text-sm">別のカテゴリーを選択してください</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
        {products.map((product) => (
        <div key={product.id} className="bg-slate-700 rounded-lg p-4 flex items-center space-x-4">
          <div className="w-20 h-20 bg-slate-600 rounded-lg flex-shrink-0 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <Link href={`/${locale}/products/${product.id}`}>
              <h3 className="text-lg font-semibold text-white truncate hover:text-red-400 transition-colors cursor-pointer">{product.name}</h3>
            </Link>
            <p className="text-zinc-400 text-sm mt-1 line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-white">¥{product.price.toLocaleString()}</span>
              </div>
              <Link href={`/${locale}/products/${product.id}`}>
                <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 text-sm font-medium">
                  詳細を見る
                </button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}