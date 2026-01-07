import React from 'react'
import { cn } from '../shared/utils/format'
import { COLORS } from '../shared/colors'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className,
  ...props
}) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-medium" style={{ color: COLORS.text }}>
          {label}
        </label>
      )}
      <input
        {...props}
        className={cn(
          'w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none',
          'placeholder:text-textMuted',
          error
            ? 'border-red-500 focus:border-red-600'
            : 'border-gray-200 focus:border-primary',
          className
        )}
        style={{
          backgroundColor: COLORS.bg,
          color: COLORS.text,
          borderColor: error ? '#ef4444' : undefined,
        }}
      />
      {error && (
        <p className="text-sm" style={{ color: '#ef4444' }}>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm" style={{ color: COLORS.muted }}>
          {helperText}
        </p>
      )}
    </div>
  )
}

export default Input
