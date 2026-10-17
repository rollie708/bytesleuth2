import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

export interface ButtonProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  asChild?: boolean
  onClick?: () => void
  children: ReactNode
}

export function Button({ 
  variant = 'default', 
  size = 'md', 
  className, 
  asChild = false, 
  onClick, 
  children 
}: ButtonProps) {
  const variantStyles = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-primary text-primary hover:bg-primary/10',
    ghost: 'hover:bg-primary/10',
  }

  const sizeStyles = {
    sm: 'h-8 rounded-md px-3 text-sm',
    md: 'h-10 rounded-md px-4 text-base',
    lg: 'h-12 rounded-md px-6 text-lg',
  }

  const classes = `inline-flex items-center justify-center rounded-md ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}`

  if (asChild) {
    return <div onClick={onClick} className={classes}>{children}</div>
  }

  return (
    <button
      onClick={onClick}
      className={classes}
      type="button"
    >
      {children}
    </button>
  )
}