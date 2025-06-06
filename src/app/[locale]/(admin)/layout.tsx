export default function AdminLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="w-64 bg-gray-900 text-white min-h-screen">
          <div className="p-6">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <nav className="mt-6">
            <a href={`/${locale}/admin/dashboard`} className="block px-6 py-3 hover:bg-gray-800">
              📊 ダッシュボード
            </a>
            <a href={`/${locale}/admin/products`} className="block px-6 py-3 hover:bg-gray-800">
              📦 製品管理
            </a>
            <a href={`/${locale}/admin/orders`} className="block px-6 py-3 hover:bg-gray-800">
              📋 注文管理
            </a>
            <a href={`/${locale}/admin/customers`} className="block px-6 py-3 hover:bg-gray-800">
              👥 顧客管理
            </a>
            <a href={`/${locale}/admin/analytics`} className="block px-6 py-3 hover:bg-gray-800">
              📈 分析
            </a>
          </nav>
        </aside>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}