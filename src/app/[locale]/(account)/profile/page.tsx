import { requireAuth } from '@/lib/auth/server'

export default async function ProfilePage({ params: { locale } }: { params: { locale: string } }) {
  // 🎯 HYBRID AUTH - Server Component Authentication
  // Replaces middleware JWT verification with complete server-side validation
  const user = await requireAuth(locale)
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">プロフィール</h1>
      
      <form className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">姓</label>
            <input 
              type="text" 
              defaultValue={user.lastName}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">名</label>
            <input 
              type="text" 
              defaultValue={user.firstName}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
          <input 
            type="email" 
            defaultValue={user.email}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">電話番号</label>
          <input 
            type="tel" 
            defaultValue="090-1234-5678"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">生年月日</label>
          <input 
            type="date" 
            defaultValue="1990-01-01"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="pt-4">
          <button 
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            変更を保存
          </button>
        </div>
      </form>
    </div>
  )
}