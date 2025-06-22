import Image from 'next/image'
import type { Product } from '@/features/products/types'

interface ProductImageProps {
  product: Product
}

export function ProductImage({ product }: ProductImageProps) {
  return (
    <div className="space-y-4">
      <div className="aspect-square bg-zinc-800/80 backdrop-blur-sm border border-zinc-700 rounded-lg overflow-hidden">
        <Image
          src={product.image || '/images/placeholder.jpg'}
          alt={product.name}
          width={600}
          height={600}
          className="w-full h-full object-cover"
          priority
        />
      </div>
    </div>
  )
}