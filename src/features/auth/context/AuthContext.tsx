'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useAuth, type UseAuthReturn } from '../hooks/useAuth'

// 🎯 HYBRID AUTH - Phase 3: Authentication Context Provider
// Provides global authentication state management for client components

const AuthContext = createContext<UseAuthReturn | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(): UseAuthReturn {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

// Convenience hooks that use the context
export function useCurrentUser() {
  const { user, isLoading } = useAuthContext()
  return { user, isLoading }
}

export function useIsAuthenticated() {
  const { isAuthenticated, isLoading } = useAuthContext()
  return { isAuthenticated, isLoading }
}

export function useAuthActions() {
  const { login, logout, refresh } = useAuthContext()
  return { login, logout, refresh }
}