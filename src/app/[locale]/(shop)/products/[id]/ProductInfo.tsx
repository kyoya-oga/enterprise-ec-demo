import type { Product } from '@/features/products/types'
import { AddToCartSection } from './AddToCartSection'

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="space-y-6">
      {/* Category */}
      {product.category && (
        <div>
          <span className="inline-block bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 text-red-400 text-sm px-3 py-1 rounded-full">
            {product.category}
          </span>
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
        {product.name}
      </h1>

      {/* Rating */}
      {product.rating && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-lg ${
                  i < Math.floor(product.rating!) ? 'text-yellow-400' : 'text-zinc-600'
                }`}
              >
                ★
              </span>
            ))}
            <span className="text-zinc-300 ml-2">{product.rating}</span>
          </div>
          {product.reviews && (
            <span className="text-zinc-500">({product.reviews}件のレビュー)</span>
          )}
        </div>
      )}

      {/* Price */}
      <div className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
        ¥{product.price.toLocaleString()}
      </div>

      {/* Description */}
        {product.description && (
        <div className="bg-slate-700/40 backdrop-blur-sm border border-slate-600 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-3">商品説明</h3>
          <p className="text-zinc-300 leading-relaxed">{product.description}</p>
        </div>
      )}

      {/* Stock Status */}
      <div className="flex items-center gap-3">
        <span className="text-zinc-400">在庫状況:</span>
        <span
          className={`font-medium ${
            product.stock > 0 ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {product.stock > 0 ? `在庫あり (${product.stock}個)` : '在庫切れ'}
        </span>
      </div>

      {/* Add to Cart Section - Client Component */}
      <AddToCartSection product={product} />
    </div>
  )
}