import { create } from 'zustand';
import type { ShowToastInput, Toast } from '../shared/types/toast';
import { generateId } from '../shared/utils/format';

const DEFAULT_TOAST_DURATION = 4000;
const MAX_TOASTS = 4;

const timeoutMap = new Map<string, ReturnType<typeof setTimeout>>();

const clearToastTimeout = (toastId: string) => {
  const timeout = timeoutMap.get(toastId);
  if (timeout) {
    clearTimeout(timeout);
    timeoutMap.delete(toastId);
  }
};

type ToastState = {
  toasts: Toast[];
  showToast: (input: ShowToastInput) => string;
  dismissToast: (toastId: string) => void;
  clearToasts: () => void;
};

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  showToast: ({
    title,
    description,
    variant = 'info',
    duration = DEFAULT_TOAST_DURATION,
  }) => {
    const toastId = generateId();
    const nextToast: Toast = {
      id: toastId,
      title,
      description,
      variant,
      duration,
      createdAt: Date.now(),
    };
    const overflowToasts = get().toasts.slice(MAX_TOASTS - 1);

    set(state => ({
      toasts: [nextToast, ...state.toasts].slice(0, MAX_TOASTS),
    }));

    for (const overflowToast of overflowToasts) {
      clearToastTimeout(overflowToast.id);
    }

    if (duration > 0) {
      const timeout = setTimeout(() => {
        get().dismissToast(toastId);
      }, duration);

      timeoutMap.set(toastId, timeout);
    }

    return toastId;
  },
  dismissToast: toastId => {
    clearToastTimeout(toastId);
    set(state => ({
      toasts: state.toasts.filter(toast => toast.id !== toastId),
    }));
  },
  clearToasts: () => {
    for (const toastId of timeoutMap.keys()) {
      clearToastTimeout(toastId);
    }

    set({ toasts: [] });
  },
}));
