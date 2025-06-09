import Link from 'next/link'
import { MobileMenu } from './MobileMenu'

interface HeaderProps {
  locale: string
}

export default function Header({ locale }: HeaderProps) {
  return (
    <header className="bg-zinc-950/95 backdrop-blur-md shadow-lg border-b border-zinc-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href={`/${locale}`} className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent hover:from-red-300 hover:to-pink-300 transition-all duration-200">
            Enterprise EC
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href={`/${locale}/products`} className="text-zinc-300 hover:text-red-400 transition-all duration-200 font-medium relative group">
              製品
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-400 to-pink-400 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link href={`/${locale}/cart`} className="text-zinc-300 hover:text-red-400 transition-all duration-200 font-medium relative group flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m8.5-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
              </svg>
              カート
              <span className="ml-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center shadow-lg">0</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-400 to-pink-400 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link href={`/${locale}/profile`} className="text-zinc-300 hover:text-red-400 transition-all duration-200 font-medium relative group">
              アカウント
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-400 to-pink-400 group-hover:w-full transition-all duration-200"></span>
            </Link>
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link href={`/${locale}/login`} className="text-zinc-300 hover:text-red-400 transition-all duration-200 font-medium">
              ログイン
            </Link>
            <Link href={`/${locale}/register`} className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2.5 rounded-xl hover:from-red-400 hover:to-pink-400 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:shadow-red-500/25 active:scale-95">
              登録
            </Link>
          </div>

          <MobileMenu locale={locale} />
        </div>
      </div>
    </header>
  )
}