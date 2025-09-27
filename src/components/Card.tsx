import React from 'react'
import { cn } from '../utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'outlined' | 'elevated'
}

const cardVariants = {
  default: 'bg-white',
  outlined: 'bg-white border border-gray-200',
  elevated: 'bg-white shadow-lg',
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-lg p-6',
        cardVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
