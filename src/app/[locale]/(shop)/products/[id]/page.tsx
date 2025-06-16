import { notFound } from 'next/navigation'
import { Breadcrumb } from './Breadcrumb'
import { ProductImage } from './ProductImage'
import { ProductInfo } from './ProductInfo'
import { ProductSpecifications } from './ProductSpecifications'
import { apiClient } from '@/lib/api'
import type { Product } from '@/features/products/types'

interface ProductDetailPageProps {
  params: {
    locale: string
    id: string
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const getProduct = async (): Promise<Product> => {
    try {
      return await apiClient.get<Product>(`/api/products/${params.id}`)
    } catch (error) {
      notFound()
      // This line won't be reached due to notFound(), but TypeScript requires a return
      throw error
    }
  }

  const product = await getProduct()

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-pink-500/5"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <Breadcrumb productName={product.name} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductImage product={product} />
          
          <div className="space-y-6">
            <ProductInfo product={product} />
            <ProductSpecifications product={product} />
          </div>
        </div>
      </div>
    </div>
  )
}