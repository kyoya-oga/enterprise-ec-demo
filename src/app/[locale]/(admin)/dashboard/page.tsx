import { requireRole } from '@/lib/auth/server'

export default async function AdminDashboard({ params: { locale } }: { params: { locale: string } }) {
  // 🎯 HYBRID AUTH - Admin Role Authentication
  // Complete server-side role validation with DB access
  const admin = await requireRole('admin', locale)
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">管理ダッシュボード</h1>
        <div className="text-sm text-gray-600">
          ようこそ、{admin.lastName} {admin.firstName}さん
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">総売上</h3>
          <p className="text-3xl font-bold text-green-600">¥1,234,567</p>
          <p className="text-sm text-gray-500">前月比 +12%</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">注文数</h3>
          <p className="text-3xl font-bold text-blue-600">456</p>
          <p className="text-sm text-gray-500">前月比 +8%</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">新規顧客</h3>
          <p className="text-3xl font-bold text-purple-600">89</p>
          <p className="text-sm text-gray-500">前月比 +15%</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">在庫アラート</h3>
          <p className="text-3xl font-bold text-red-600">12</p>
          <p className="text-sm text-gray-500">要確認商品</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">最近の注文</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">#12345</p>
                <p className="text-sm text-gray-600">田中太郎</p>
              </div>
              <div className="text-right">
                <p className="font-medium">¥45,000</p>
                <p className="text-sm text-green-600">完了</p>
              </div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">#12344</p>
                <p className="text-sm text-gray-600">山田花子</p>
              </div>
              <div className="text-right">
                <p className="font-medium">¥29,800</p>
                <p className="text-sm text-yellow-600">処理中</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">人気商品</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">プレミアムヘッドフォン</p>
                <p className="text-sm text-gray-600">売上: 156個</p>
              </div>
              <p className="text-green-600 font-medium">¥4,648,800</p>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">スマートウォッチ</p>
                <p className="text-sm text-gray-600">売上: 89個</p>
              </div>
              <p className="text-green-600 font-medium">¥4,005,000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}