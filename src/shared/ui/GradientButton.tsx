import React from 'react'
import { cn } from '../utils/format'

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const GradientButton: React.FC<GradientButtonProps> = ({
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

  const sizeClasses = {
    sm: 'h-8 px-3 text-sm min-w-[44px]',
    md: 'h-11 px-4 text-base min-w-[44px]',
    lg: 'h-12 px-6 text-lg min-w-[44px]',
  }

  return (
    <button
      className={cn(
        baseClasses,
        'bg-gradient-to-r from-primary via-accent to-highlight text-white hover:from-primary/90 hover:via-accent/90 hover:to-highlight/90 focus:ring-primary shadow-lg hover:shadow-xl transform hover:scale-105',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default GradientButton