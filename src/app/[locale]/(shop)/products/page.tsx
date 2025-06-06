export default function ProductsPage({ params: { locale } }: { params: { locale: string } }) {
  const products = [
    { id: 1, name: 'プレミアムヘッドフォン', price: 29800, image: '/api/placeholder/300/300' },
    { id: 2, name: 'スマートウォッチ', price: 45000, image: '/api/placeholder/300/300' },
    { id: 3, name: 'ワイヤレスイヤホン', price: 18000, image: '/api/placeholder/300/300' },
    { id: 4, name: 'ポータブルスピーカー', price: 12000, image: '/api/placeholder/300/300' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">製品一覧</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">画像</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-2xl font-bold text-blue-600">¥{product.price.toLocaleString()}</p>
              <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
                カートに追加
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}