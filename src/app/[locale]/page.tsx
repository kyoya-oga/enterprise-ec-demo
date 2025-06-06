import Link from 'next/link'

export default function LocaleHome({ params: { locale } }: { params: { locale: string } }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Enterprise EC Demo
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {locale === 'ja' 
              ? 'エンタープライズ級ECサイトの完全アーキテクチャデモサイトです。本格的なeコマースソリューションの実装例をご覧いただけます。'
              : 'A complete enterprise-grade e-commerce architecture demo site. View examples of authentic e-commerce solution implementations.'
            }
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            <Link href={`/${locale}/products`} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold mb-4">🛍️ 製品管理</h3>
              <p className="text-gray-600">
                高度な製品カタログシステム
              </p>
            </Link>
            
            <Link href={`/${locale}/cart`} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold mb-4">🛒 ショッピングカート</h3>
              <p className="text-gray-600">
                リアルタイムカート管理
              </p>
            </Link>
            
            <Link href={`/${locale}/admin/dashboard`} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold mb-4">📊 管理ダッシュボード</h3>
              <p className="text-gray-600">
                リアルタイム分析と管理
              </p>
            </Link>
            
            <Link href={`/${locale}/login`} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold mb-4">🔐 認証システム</h3>
              <p className="text-gray-600">
                セキュアな認証・認可
              </p>
            </Link>
            
            <Link href={`/${locale}/profile`} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold mb-4">👤 アカウント管理</h3>
              <p className="text-gray-600">
                ユーザープロフィール管理
              </p>
            </Link>
            
            <Link href={`/${locale}/checkout`} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold mb-4">💳 決済システム</h3>
              <p className="text-gray-600">
                セキュアな決済処理
              </p>
            </Link>
          </div>
          
          <div className="mt-12 flex gap-4 justify-center">
            <Link 
              href="/ja"
              className={`px-4 py-2 rounded ${locale === 'ja' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              日本語
            </Link>
            <Link 
              href="/en"
              className={`px-4 py-2 rounded ${locale === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              English
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}