import { ProductsClient } from './ProductsClient';
import { apiClient } from '@/lib/api';

export default async function ProductsPage() {
  const { products, categories } = await apiClient.get<{
    products: any[];
    categories: string[];
  }>('/api/products');

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-pink-500/5"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
            製品一覧
          </h1>
          <p className="text-zinc-400">
            最新のテクノロジー製品をお探しください
          </p>
        </div>

        <ProductsClient products={products} categories={categories} />
      </div>
    </div>
  );
}
