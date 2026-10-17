import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'
import { Search, ExternalLink } from 'lucide-react'

export interface InputProps {
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

export function Input({ 
  type = 'text', 
  placeholder = '',
  value, 
  onChange, 
  className 
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${className || ''}`}
    />
  )
}