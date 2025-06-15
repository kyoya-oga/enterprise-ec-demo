import Link from 'next/link'

export default function RegisterPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="bg-zinc-800/50 backdrop-blur-sm p-8 rounded-lg border border-zinc-700/50 shadow-2xl">
      <div>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-zinc-100">
            新しいアカウントを作成
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-400">
            または{' '}
            <Link href={`/${locale}/login`} className="font-medium text-red-400 hover:text-red-300">
              既存のアカウントでログイン
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-zinc-300">
                  姓
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-zinc-600 bg-zinc-800 placeholder-zinc-500 text-zinc-100 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="田中"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-zinc-300">
                  名
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-zinc-600 bg-zinc-800 placeholder-zinc-500 text-zinc-100 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="太郎"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-zinc-600 bg-zinc-800 placeholder-zinc-500 text-zinc-100 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="your-email@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-zinc-600 bg-zinc-800 placeholder-zinc-500 text-zinc-100 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="パスワード"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300">
                パスワード（確認）
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-zinc-600 bg-zinc-800 placeholder-zinc-500 text-zinc-100 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="パスワード（確認）"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-zinc-600 bg-zinc-800 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-zinc-300">
              <a href="#" className="text-red-400 hover:text-red-300">利用規約</a>と
              <a href="#" className="text-red-400 hover:text-red-300">プライバシーポリシー</a>に同意します
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-zinc-900"
            >
              アカウントを作成
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}