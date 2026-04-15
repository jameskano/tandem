import { useCallback } from 'react';
import type { ShowBlockingLoaderInput } from '../shared/types/blockingLoader';
import { useBlockingLoaderStore } from '../store/blockingLoaderStore';

export const useBlockingLoader = () => {
  const showLoader = useBlockingLoaderStore(state => state.showLoader);
  const hideLoader = useBlockingLoaderStore(state => state.hideLoader);
  const clearLoaders = useBlockingLoaderStore(state => state.clearLoaders);

  const show = useCallback(
    (input?: ShowBlockingLoaderInput) => showLoader(input),
    [showLoader]
  );

  const hide = useCallback(
    (loaderId: string) => hideLoader(loaderId),
    [hideLoader]
  );

  const run = useCallback(
    async <T>(
      task: () => Promise<T>,
      input?: ShowBlockingLoaderInput
    ): Promise<T> => {
      const loaderId = showLoader(input);

      try {
        return await task();
      } finally {
        hideLoader(loaderId);
      }
    },
    [showLoader, hideLoader]
  );

  return {
    show,
    hide,
    run,
    clearLoaders,
  };
};

export const useBlockingLoaderState = () => {
  const isVisible = useBlockingLoaderStore(state => state.isVisible);
  const message = useBlockingLoaderStore(state => state.message);

  return {
    isVisible,
    message,
  };
};
