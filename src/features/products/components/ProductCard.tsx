'use client';

import type { Product } from '@/features/products/types';
import { Card, CardContent } from '@/components/ui';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { locale } = useParams() as { locale: string };
  return (
    <Card className="bg-slate-700/70 backdrop-blur-sm border-slate-600 hover:shadow-xl hover:border-slate-500 transition-all duration-300 group overflow-hidden">
      <Link href={`/${locale}/products/${product.id}`} className="block">
        <div className="aspect-square bg-slate-600 flex items-center justify-center overflow-hidden relative">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              priority={false}
            />
          ) : (
            <div className="text-white text-center">
              <div className="w-16 h-16 mx-auto bg-slate-600 rounded mb-2"></div>
              <span className="text-sm">画像なし</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </Link>

      <CardContent className="p-5 space-y-4">
        {product.category && (
          <div>
            <span className="inline-block bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 text-white text-xs px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>
        )}

        <Link
          href={`/${locale}/products/${product.id}`}
          className="inline-block"
        >
          <h3 className="font-semibold text-lg text-white line-clamp-2 hover:text-gray-200 transition-colors leading-relaxed cursor-pointer">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="text-white text-sm line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
            ¥{product.price.toLocaleString()}
          </div>

          {product.rating && (
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span className="text-white">{product.rating}</span>
              {product.reviews && (
                <span className="text-white">({product.reviews})</span>
              )}
            </div>
          )}
        </div>

        <span
          className={`text-sm ${
            product.stock > 0 ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {product.stock > 0 ? `在庫: ${product.stock}個` : '在庫切れ'}
        </span>

        <Link href={`/${locale}/products/${product.id}`} className="block">
          <button
            disabled={product.stock === 0}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-slate-600 disabled:to-slate-600 disabled:text-white text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
          >
            {product.stock > 0 ? '詳細を見る' : '在庫切れ'}
          </button>
        </Link>
      </CardContent>
    </Card>
  );
}
