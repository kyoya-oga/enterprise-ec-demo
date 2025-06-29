'use client'

import { useState, useEffect } from 'react'
import type { User } from '@/features/auth/types'

// 🎯 HYBRID AUTH - Phase 3: Client-side Authentication Hook
// Provides client-side authentication state management and utilities

export interface UseAuthReturn {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        return { success: true }
      } else {
        const error = await response.json()
        return { success: false, error: error.message || 'Login failed' }
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Network error' 
      }
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      // Always clear local state, even if API call fails
      setUser(null)
      // Redirect to home page
      window.location.href = '/ja'
    }
  }

  const refresh = async (): Promise<void> => {
    await checkAuthStatus()
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refresh
  }
}

// Utility hook for checking specific roles
export function useRequireRole(role: 'user' | 'admin') {
  const { user, isLoading, isAuthenticated } = useAuth()
  
  const hasRequiredRole = isAuthenticated && user?.role === role
  const needsAuth = !isLoading && !isAuthenticated
  const needsRole = !isLoading && isAuthenticated && !hasRequiredRole

  return {
    hasRequiredRole,
    needsAuth,
    needsRole,
    isLoading,
    user
  }
}

// Utility hook for conditional authentication
export function useOptionalAuth() {
  const { user, isLoading } = useAuth()
  
  return {
    user,
    isLoading,
    isAuthenticated: !!user
  }
}