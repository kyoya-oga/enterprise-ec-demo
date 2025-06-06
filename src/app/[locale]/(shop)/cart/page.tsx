export default function CartPage({ params: { locale } }: { params: { locale: string } }) {
  const cartItems = [
    { id: 1, name: 'プレミアムヘッドフォン', price: 29800, quantity: 1 },
    { id: 2, name: 'スマートウォッチ', price: 45000, quantity: 2 },
  ]

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ショッピングカート</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">カートは空です</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-500 text-sm">画像</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-gray-600">¥{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded border flex items-center justify-center">-</button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button className="w-8 h-8 rounded border flex items-center justify-center">+</button>
                      </div>
                      <button className="text-red-600 hover:text-red-800">削除</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-lg mb-4">注文サマリー</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>小計</span>
                  <span>¥{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>送料</span>
                  <span>¥500</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>合計</span>
                    <span>¥{(total + 500).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-colors">
                レジに進む
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}