import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StackProps {
  children: ReactNode
  space?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  direction?: 'vertical' | 'horizontal'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  className?: string
}

const spaceMap = {
  xs: 'gap-1',
  sm: 'gap-2', 
  md: 'gap-3',
  lg: 'gap-4',
  xl: 'gap-6'
}

const alignMap = {
  start: 'items-start',
  center: 'items-center', 
  end: 'items-end',
  stretch: 'items-stretch'
}

const justifyMap = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end', 
  between: 'justify-between',
  around: 'justify-around'
}

export function Stack({ 
  children, 
  space = 'md', 
  direction = 'vertical',
  align = 'stretch',
  justify = 'start',
  className = '' 
}: StackProps) {
  const flexDirection = direction === 'vertical' ? 'flex-col' : 'flex-row'
  const gapClass = spaceMap[space]
  const alignClass = alignMap[align]
  const justifyClass = justifyMap[justify]
  
  const finalClassName = cn('flex', flexDirection, gapClass, alignClass, justifyClass, className)
  
  // Debug: log the final className
  if (process.env.NODE_ENV === 'development' && className.includes('p-5')) {
    console.log('Stack className:', finalClassName)
  }
  
  return (
    <div className={finalClassName}>
      {children}
    </div>
  )
}