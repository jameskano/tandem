import React from 'react';
import { COLORS } from '../colors';
import { cn } from '../utils/format';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  height?: string | number;
  autoResize?: boolean;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  className,
  height = '120px',
  autoResize = false,
  ...props
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (!autoResize || !textareaRef.current) return;

    const resize = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    };

    const textarea = textareaRef.current;
    textarea.addEventListener('input', resize);
    resize();

    return () => textarea.removeEventListener('input', resize);
  }, [autoResize]);

  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  return (
    <div className="w-full space-y-2">
      {label && (
        <label
          className="block text-sm font-medium"
          style={{ color: COLORS.text }}
        >
          {label}
        </label>
      )}
      <textarea
        ref={textareaRef}
        {...props}
        className={cn(
          'w-full resize-none rounded-lg border-2 px-4 py-3 transition-colors focus:outline-none',
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
          height: autoResize ? 'auto' : heightStyle,
          minHeight: heightStyle,
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
  );
};

export default Textarea;
