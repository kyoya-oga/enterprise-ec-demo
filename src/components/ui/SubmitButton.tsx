'use client'

import { useFormStatus } from 'react-dom'
import { Button } from './Button'

interface SubmitButtonProps {
  children: React.ReactNode
  className?: string
}

export function SubmitButton({ children, className }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button 
      type="submit" 
      disabled={pending}
      className={className}
    >
      {pending ? '処理中...' : children}
    </Button>
  )
}