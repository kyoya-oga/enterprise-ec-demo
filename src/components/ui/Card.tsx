import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', padding = 'md', children, ...props }, ref) => {
    const baseClasses = 'rounded-2xl transition-all duration-200'
    
    const variants = {
      default: 'bg-white shadow-sm border border-zinc-100 hover:shadow-md hover:border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700',
      elevated: 'bg-white shadow-lg hover:shadow-xl border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800',
      outlined: 'bg-white border-2 border-zinc-200 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 dark:hover:border-zinc-600'
    }
    
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    }
    
    const classes = `${baseClasses} ${variants[variant]} ${paddings[padding]} ${className}`
    
    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`mb-4 ${className}`} {...props} />
  )
)

CardHeader.displayName = 'CardHeader'

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={className} {...props} />
  )
)

CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`mt-4 ${className}`} {...props} />
  )
)

CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardContent, CardFooter }