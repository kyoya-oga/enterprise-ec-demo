'use client'

import { useState } from 'react'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { Button } from '@/components/ui/Button'

interface LogoutButtonProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  className?: string
  children?: React.ReactNode
  showConfirmation?: boolean
}

// 🎯 HYBRID AUTH - Phase 3: Logout Button Component
// Provides secure logout functionality with optional confirmation

export function LogoutButton({ 
  variant = 'outline',
  size = 'default',
  className,
  children,
  showConfirmation = true
}: LogoutButtonProps) {
  const { logout } = useAuthContext()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  
  const handleLogout = async () => {
    if (showConfirmation) {
      const confirmed = window.confirm('ログアウトしますか？')
      if (!confirmed) return
    }
    
    try {
      setIsLoggingOut(true)
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
      // Even if logout fails, the user state will be cleared
    } finally {
      setIsLoggingOut(false)
    }
  }
  
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      {isLoggingOut ? 'ログアウト中...' : (children || 'ログアウト')}
    </Button>
  )
}

// Simple text-based logout link
export function LogoutLink({ 
  className,
  showConfirmation = true 
}: { 
  className?: string
  showConfirmation?: boolean 
}) {
  const { logout } = useAuthContext()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (showConfirmation) {
      const confirmed = window.confirm('ログアウトしますか？')
      if (!confirmed) return
    }
    
    try {
      setIsLoggingOut(true)
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }
  
  return (
    <a
      href="#"
      onClick={handleLogout}
      className={`text-gray-700 hover:text-red-600 transition-colors ${
        isLoggingOut ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className || ''}`}
    >
      {isLoggingOut ? 'ログアウト中...' : 'ログアウト'}
    </a>
  )
}