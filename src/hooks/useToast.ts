import { useCallback } from 'react';
import type { ShowToastInput } from '../shared/types/toast';
import { useToastStore } from '../store/toastStore';

export const useToast = () => {
  const showToast = useToastStore(state => state.showToast);
  const dismissToast = useToastStore(state => state.dismissToast);
  const clearToasts = useToastStore(state => state.clearToasts);

  const toast = useCallback(
    (input: ShowToastInput) => showToast(input),
    [showToast]
  );

  const success = useCallback(
    (description: string, options?: Omit<ShowToastInput, 'description' | 'variant'>) =>
      showToast({
        ...options,
        description,
        variant: 'success',
      }),
    [showToast]
  );

  const error = useCallback(
    (description: string, options?: Omit<ShowToastInput, 'description' | 'variant'>) =>
      showToast({
        ...options,
        description,
        variant: 'error',
      }),
    [showToast]
  );

  const info = useCallback(
    (description: string, options?: Omit<ShowToastInput, 'description' | 'variant'>) =>
      showToast({
        ...options,
        description,
        variant: 'info',
      }),
    [showToast]
  );

  return {
    toast,
    success,
    error,
    info,
    dismissToast,
    clearToasts,
  };
};
