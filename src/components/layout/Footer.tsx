import Link from 'next/link'

interface FooterProps {
  locale: string
}

export default function Footer({ locale }: FooterProps) {
  return (
    <footer className="bg-zinc-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5"></div>
      <div className="container mx-auto px-4 py-12 relative">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">Enterprise EC</h3>
            <p className="text-zinc-400 leading-relaxed">
              エンタープライズ級ECサイトのデモンストレーション
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">製品</h4>
            <ul className="space-y-3 text-zinc-400">
              <li><Link href={`/${locale}/products`} className="hover:text-red-400 transition-all duration-200 hover:translate-x-1">製品一覧</Link></li>
              <li><Link href={`/${locale}/products/search`} className="hover:text-red-400 transition-all duration-200 hover:translate-x-1">製品検索</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">アカウント</h4>
            <ul className="space-y-3 text-zinc-400">
              <li><Link href={`/${locale}/login`} className="hover:text-red-400 transition-all duration-200 hover:translate-x-1">ログイン</Link></li>
              <li><Link href={`/${locale}/register`} className="hover:text-red-400 transition-all duration-200 hover:translate-x-1">新規登録</Link></li>
              <li><Link href={`/${locale}/profile`} className="hover:text-red-400 transition-all duration-200 hover:translate-x-1">プロフィール</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">サポート</h4>
            <ul className="space-y-3 text-zinc-400">
              <li><a href="#" className="hover:text-red-400 transition-all duration-200 hover:translate-x-1">ヘルプ</a></li>
              <li><a href="#" className="hover:text-red-400 transition-all duration-200 hover:translate-x-1">お問い合わせ</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-zinc-800 mt-12 pt-8 text-center text-zinc-400">
          <p>&copy; 2024 Enterprise EC Demo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}