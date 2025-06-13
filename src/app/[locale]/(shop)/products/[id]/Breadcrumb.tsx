import Link from 'next/link'

interface BreadcrumbProps {
  locale: string
  productName: string
}

export function Breadcrumb({ locale, productName }: BreadcrumbProps) {
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