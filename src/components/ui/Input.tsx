import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, type = 'text', ...props }, ref) => {
    const baseClasses = 'w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
    
    const stateClasses = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-950 dark:border-red-800'
      : 'border-zinc-200 focus:border-red-500 focus:ring-red-500 bg-white dark:bg-zinc-900 dark:border-zinc-700 dark:focus:border-red-400'
    
    const classes = `${baseClasses} ${stateClasses} ${className}`
    
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={classes}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input