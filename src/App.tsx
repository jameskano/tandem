// './App.css';
import { useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { RouterProvider } from 'react-router-dom';
import BlockingLoader from './components/BlockingLoader';
import ToastViewport from './components/ToastViewport';
import QueryProvider from './shared/providers/QueryProvider';
import ThemeProvider from './shared/providers/ThemeProvider';
import { getAppRouteFromUrl } from './shared/utils/deepLinks';
import { isNativeApp } from './shared/utils/platform';
import { router } from './app/routes';
import { AuthProvider } from './store/context/AuthProvider';
import { RevenueCatProvider } from './store/context/RevenueCatProvider';
import { SettingsProvider } from './store/context/SettingsProvider';

const App = () => {
  useEffect(() => {
    if (!isNativeApp()) {
      return;
    }

    let listenerHandle: { remove: () => Promise<void> } | null = null;

    const navigateFromUrl = async (url?: string | null) => {
      if (!url) {
        return;
      }

      const nextRoute = getAppRouteFromUrl(url);
      if (!nextRoute) {
        return;
      }

      await router.navigate(nextRoute);
    };

    void CapacitorApp.getLaunchUrl().then(launchUrl => {
      void navigateFromUrl(launchUrl?.url);
    });

    void CapacitorApp.addListener('appUrlOpen', ({ url }) => {
      void navigateFromUrl(url);
    }).then(handle => {
      listenerHandle = handle;
    });

    return () => {
      if (listenerHandle) {
        void listenerHandle.remove();
      }
    };
  }, []);

  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <RevenueCatProvider>
            <SettingsProvider>
              <RouterProvider router={router} />
              <BlockingLoader />
              <ToastViewport />
            </SettingsProvider>
          </RevenueCatProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};

export default App;
