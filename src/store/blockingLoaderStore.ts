import { create } from 'zustand';
import type {
  BlockingLoader,
  ShowBlockingLoaderInput,
} from '../shared/types/blockingLoader';
import { generateId } from '../shared/utils/format';

const DEFAULT_BLOCKING_LOADER_DELAY = 180;

const timeoutMap = new Map<string, ReturnType<typeof setTimeout>>();

const clearLoaderTimeout = (loaderId: string) => {
  const timeout = timeoutMap.get(loaderId);
  if (timeout) {
    clearTimeout(timeout);
    timeoutMap.delete(loaderId);
  }
};

const getVisibleLoader = (loaders: BlockingLoader[]) =>
  [...loaders]
    .filter(loader => loader.visible)
    .sort((left, right) => right.createdAt - left.createdAt)[0];

type BlockingLoaderState = {
  loaders: BlockingLoader[];
  isVisible: boolean;
  message?: string;
  showLoader: (input?: ShowBlockingLoaderInput) => string;
  revealLoader: (loaderId: string) => void;
  hideLoader: (loaderId: string) => void;
  clearLoaders: () => void;
};

export const useBlockingLoaderStore = create<BlockingLoaderState>(
  (set, get) => ({
    loaders: [],
    isVisible: false,
    message: undefined,
    showLoader: ({ message, delay = DEFAULT_BLOCKING_LOADER_DELAY } = {}) => {
      const loaderId = generateId();
      const nextLoader: BlockingLoader = {
        id: loaderId,
        message,
        delay,
        visible: delay <= 0,
        createdAt: Date.now(),
      };

      set(state => {
        const nextLoaders = [...state.loaders, nextLoader];
        const visibleLoader = getVisibleLoader(nextLoaders);

        return {
          loaders: nextLoaders,
          isVisible: Boolean(visibleLoader),
          message: visibleLoader?.message,
        };
      });

      if (delay > 0) {
        const timeout = setTimeout(() => {
          get().revealLoader(loaderId);
        }, delay);

        timeoutMap.set(loaderId, timeout);
      }

      return loaderId;
    },
    revealLoader: loaderId => {
      clearLoaderTimeout(loaderId);

      set(state => {
        const nextLoaders = state.loaders.map(loader =>
          loader.id === loaderId ? { ...loader, visible: true } : loader
        );
        const visibleLoader = getVisibleLoader(nextLoaders);

        return {
          loaders: nextLoaders,
          isVisible: Boolean(visibleLoader),
          message: visibleLoader?.message,
        };
      });
    },
    hideLoader: loaderId => {
      clearLoaderTimeout(loaderId);

      set(state => {
        const nextLoaders = state.loaders.filter(
          loader => loader.id !== loaderId
        );
        const visibleLoader = getVisibleLoader(nextLoaders);

        return {
          loaders: nextLoaders,
          isVisible: Boolean(visibleLoader),
          message: visibleLoader?.message,
        };
      });
    },
    clearLoaders: () => {
      for (const loaderId of timeoutMap.keys()) {
        clearLoaderTimeout(loaderId);
      }

      set({
        loaders: [],
        isVisible: false,
        message: undefined,
      });
    },
  })
);
