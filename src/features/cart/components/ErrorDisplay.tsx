import React from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface ErrorDisplayProps {
  error: string
  onDismiss?: () => void
  variant?: 'error' | 'warning'
}

export function ErrorDisplay({ error, onDismiss, variant = 'error' }: ErrorDisplayProps) {
  const baseClasses = "flex items-center gap-3 p-4 rounded-lg border"
  const variantClasses = {
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800"
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]}`}>
      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
      <p className="flex-1 text-sm font-medium">{error}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 hover:bg-black/5 rounded transition-colors"
          aria-label="エラーを閉じる"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}