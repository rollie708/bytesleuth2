import { cn } from '@/lib/utils'

export interface CardProps {
  className?: string
  children: React.ReactNode
}

export function Card({ className, children }: CardProps) {
  return (
    <div className={`rounded-lg bg-white p-6 shadow-sm ${cn('border border-border', className)}`}>
      {children}
    </div>
  )
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`flex flex-col space-y-2 ${cn('text-sm font-medium', className)}`}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <h3 className={`font-semibold text-primary ${cn('tracking-wider', className)}`}>
      {children}
    </h3>
  )
}

export function CardDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <p className={`text-muted-foreground text-sm ${cn('leading-relaxed', className)}`}>
      {children}
    </p>
  )
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`pt-2 ${cn('text-sm', className)}`}>
      {children}
    </div>
  )
}