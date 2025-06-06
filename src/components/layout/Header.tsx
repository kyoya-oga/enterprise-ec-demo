import Link from 'next/link'

interface HeaderProps {
  locale: string
}

export default function Header({ locale }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-zinc-200 sticky top-0 z-50 dark:bg-zinc-900/80 dark:border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href={`/${locale}`} className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent hover:from-red-600 hover:to-pink-600 transition-all duration-200">
            Enterprise EC
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link href={`/${locale}/products`} className="text-zinc-700 hover:text-red-500 transition-all duration-200 font-medium dark:text-zinc-300 dark:hover:text-red-400">
              製品
            </Link>
            <Link href={`/${locale}/cart`} className="text-zinc-700 hover:text-red-500 transition-all duration-200 font-medium dark:text-zinc-300 dark:hover:text-red-400">
              カート
            </Link>
            <Link href={`/${locale}/profile`} className="text-zinc-700 hover:text-red-500 transition-all duration-200 font-medium dark:text-zinc-300 dark:hover:text-red-400">
              アカウント
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link href={`/${locale}/login`} className="text-zinc-700 hover:text-red-500 transition-all duration-200 font-medium dark:text-zinc-300 dark:hover:text-red-400">
              ログイン
            </Link>
            <Link href={`/${locale}/register`} className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2.5 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl active:scale-95">
              登録
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}