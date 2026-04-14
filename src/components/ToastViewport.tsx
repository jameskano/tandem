import React from 'react';
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import type { ToastVariant } from '../shared/types/toast';
import { cn } from '../shared/utils/format';
import { useToastStore } from '../store/toastStore';

const toastStyles: Record<
  ToastVariant,
  {
    icon: React.ReactNode;
    accentClassName: string;
    iconClassName: string;
  }
> = {
  success: {
    icon: <CheckCircle2 size={18} aria-hidden="true" />,
    accentClassName: 'border-primary/30 bg-primary/5',
    iconClassName: 'text-primary',
  },
  error: {
    icon: <TriangleAlert size={18} aria-hidden="true" />,
    accentClassName: 'border-red-500/30 bg-red-500/5',
    iconClassName: 'text-red-600',
  },
  info: {
    icon: <Info size={18} aria-hidden="true" />,
    accentClassName: 'border-secondary/30 bg-secondary/5',
    iconClassName: 'text-secondary',
  },
};

const ToastViewport: React.FC = () => {
  const toasts = useToastStore(state => state.toasts);
  const { dismissToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-4 top-4 z-50 flex flex-col gap-3 sm:left-auto sm:right-4 sm:w-full sm:max-w-sm">
      {toasts.map(toast => {
        const styles = toastStyles[toast.variant];

        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto rounded-2xl border bg-surface p-4 text-text shadow-lg backdrop-blur-sm',
              styles.accentClassName
            )}
            role={toast.variant === 'error' ? 'alert' : 'status'}
          >
            <div className="flex items-start gap-3">
              <div className={cn('mt-0.5 shrink-0', styles.iconClassName)}>
                {styles.icon}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                {toast.title ? (
                  <p className="text-sm font-semibold text-text">{toast.title}</p>
                ) : null}
                <p className="text-sm leading-relaxed text-text">
                  {toast.description}
                </p>
              </div>

              <button
                type="button"
                className="text-textMuted transition-colors hover:text-text"
                onClick={() => dismissToast(toast.id)}
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ToastViewport;
