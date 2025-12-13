import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function KristoffSpinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  }

  return (
    <div 
      className={cn(
        'animate-spin rounded-full border-2 border-gray-200 border-t-gray-900',
        sizeClasses[size],
        className
      )}
    />
  )
}
