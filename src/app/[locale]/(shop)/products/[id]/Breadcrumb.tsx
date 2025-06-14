'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

interface BreadcrumbProps {
  productName: string
}

export function Breadcrumb({ productName }: BreadcrumbProps) {
  const { locale } = useParams() as { locale: string }
  return (
    <nav className="mb-8">
      <div className="flex items-center space-x-2 text-sm">
        <Link href={`/${locale}/products`} className="text-zinc-400 hover:text-white transition-colors">
          製品一覧
        </Link>
        <span className="text-zinc-600">/</span>
        <span className="text-white">{productName}</span>
      </div>
    </nav>
  )
}