'use client'

import Link from 'next/link'
import { useState } from 'react'

interface MobileMenuProps {
  locale: string
}

export function MobileMenu({ locale }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-300"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="md:hidden border-t border-zinc-800 py-4 bg-zinc-950/95 backdrop-blur-sm">
          <nav className="flex flex-col space-y-4">
            <Link href={`/${locale}/products`} className="text-zinc-300 hover:text-red-400 transition-colors font-medium">
              製品
            </Link>
            <Link href={`/${locale}/cart`} className="text-zinc-300 hover:text-red-400 transition-colors font-medium flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m8.5-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
              </svg>
              カート
              <span className="ml-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full px-1.5 py-0.5">0</span>
            </Link>
            <Link href={`/${locale}/profile`} className="text-zinc-300 hover:text-red-400 transition-colors font-medium">
              アカウント
            </Link>
            <hr className="border-zinc-800" />
            <Link href={`/${locale}/login`} className="text-zinc-300 hover:text-red-400 transition-colors font-medium">
              ログイン
            </Link>
            <Link href={`/${locale}/register`} className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2.5 rounded-xl hover:from-red-400 hover:to-pink-400 transition-all duration-200 font-semibold text-center shadow-lg">
              登録
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}