import { requireAuth } from '@/lib/auth/server'

export default async function CheckoutPage({ params: { locale } }: { params: { locale: string } }) {
  // 🎯 HYBRID AUTH - User Authentication Required for Checkout
  const user = await requireAuth(locale)
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">決済</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">配送先情報</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">姓</label>
                  <input type="text" className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">名</label>
                  <input type="text" className="w-full border rounded px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">メールアドレス</label>
                <input type="email" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">住所</label>
                <input type="text" className="w-full border rounded px-3 py-2" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">市区町村</label>
                  <input type="text" className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">都道府県</label>
                  <input type="text" className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">郵便番号</label>
                  <input type="text" className="w-full border rounded px-3 py-2" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">支払い方法</h2>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="radio" name="payment" className="mr-3" />
                <span>クレジットカード</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="payment" className="mr-3" />
                <span>PayPay</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="payment" className="mr-3" />
                <span>銀行振込</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">注文内容</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>プレミアムヘッドフォン × 1</span>
                <span>¥29,800</span>
              </div>
              <div className="flex justify-between">
                <span>スマートウォッチ × 2</span>
                <span>¥90,000</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span>小計</span>
                  <span>¥119,800</span>
                </div>
                <div className="flex justify-between">
                  <span>送料</span>
                  <span>¥500</span>
                </div>
                <div className="flex justify-between">
                  <span>税込</span>
                  <span>¥12,030</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>合計</span>
                  <span>¥132,330</span>
                </div>
              </div>
            </div>
          </div>
          
          <button className="w-full bg-green-600 text-white py-3 rounded text-lg font-semibold hover:bg-green-700 transition-colors">
            注文を確定する
          </button>
        </div>
      </div>
    </div>
  )
}