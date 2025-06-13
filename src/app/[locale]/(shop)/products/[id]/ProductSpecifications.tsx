import type { Product } from '@/features/products/types'

interface ProductSpecificationsProps {
  product: Product
}

export function ProductSpecifications({ product }: ProductSpecificationsProps) {
  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">商品仕様</h3>
      <div className="space-y-2">
        <div className="flex justify-between py-2 border-b border-zinc-800 last:border-b-0">
          <span className="text-zinc-400">商品ID</span>
          <span className="text-zinc-300">{product.id}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-zinc-800 last:border-b-0">
          <span className="text-zinc-400">カテゴリー</span>
          <span className="text-zinc-300">{product.category || '未分類'}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-zinc-800 last:border-b-0">
          <span className="text-zinc-400">在庫数</span>
          <span className="text-zinc-300">{product.stock}個</span>
        </div>
      </div>
    </div>
  )
}