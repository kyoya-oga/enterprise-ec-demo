import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function AccountLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header locale={locale} />
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <nav className="bg-white rounded-lg shadow-md p-6">
                <h2 className="font-semibold mb-4">アカウント</h2>
                <ul className="space-y-2">
                  <li><a href={`/${locale}/profile`} className="block text-gray-700 hover:text-blue-600">プロフィール</a></li>
                  <li><a href={`/${locale}/orders`} className="block text-gray-700 hover:text-blue-600">注文履歴</a></li>
                  <li><a href={`/${locale}/addresses`} className="block text-gray-700 hover:text-blue-600">住所管理</a></li>
                  <li><a href={`/${locale}/payment-methods`} className="block text-gray-700 hover:text-blue-600">支払い方法</a></li>
                </ul>
              </nav>
            </div>
            <div className="lg:col-span-3">
              {children}
            </div>
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  )
}