export type ToastVariant = 'success' | 'error' | 'info';

export type Toast = {
  id: string;
  title?: string;
  description: string;
  variant: ToastVariant;
  duration: number;
  createdAt: number;
};

export type ShowToastInput = {
  title?: string;
  description: string;
  variant?: ToastVariant;
  duration?: number;
};
