import { useEffect } from 'react';
import { LoaderCircle } from 'lucide-react';
import {
  useBlockingLoader,
  useBlockingLoaderState,
} from '../hooks/useBlockingLoader';
import { useI18n } from '../shared/i18n/useI18n';

const BlockingLoader = () => {
  const { t } = useI18n();
  const { clearLoaders } = useBlockingLoader();
  const { isVisible, message } = useBlockingLoaderState();

  useEffect(() => clearLoaders, [clearLoaders]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/30 px-4 backdrop-blur-[2px]"
      aria-live="polite"
      aria-busy="true"
      role="status"
    >
      <div className="flex min-w-[220px] max-w-sm flex-col items-center gap-4 rounded-2xl border border-appBorder bg-surface/95 px-6 py-5 text-center shadow-xl">
        <LoaderCircle
          className="animate-spin text-primary"
          size={34}
          aria-hidden="true"
        />
        <p className="text-sm font-medium text-text">
          {message || t('common.loading')}
        </p>
      </div>
    </div>
  );
};

export default BlockingLoader;
