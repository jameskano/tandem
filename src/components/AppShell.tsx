import React from 'react';
import { Capacitor } from '@capacitor/core';
import { useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import DesktopNav from './DesktopNav';
import { useAuthContext } from '../store/context/AuthProvider';
import { getPlatformClassName } from '../shared/utils/platform';

type AppShellProps = {
  children: React.ReactNode;
};

const AppShell = ({ children }: AppShellProps) => {
  const location = useLocation();
  const { user, loading } = useAuthContext();

  const isMainPage = location.pathname === '/';
  const isStandalonePage = ['/privacy', '/terms'].includes(location.pathname);
  const showNavigation =
    !isMainPage && !isStandalonePage && !loading && Boolean(user);
  const isNativePlatform = Capacitor.isNativePlatform();

  return (
    <div
      className={`flex min-h-screen flex-col bg-bg ${getPlatformClassName()}`}
    >
      {showNavigation && !isNativePlatform ? <DesktopNav /> : null}

      <main
        className={
          showNavigation && isNativePlatform
            ? 'flex flex-1 pb-20'
            : showNavigation && !isNativePlatform
              ? 'flex flex-1 justify-center'
              : 'flex flex-1 pb-0'
        }
      >
        {children}
      </main>

      {showNavigation && isNativePlatform ? <BottomNav /> : null}
    </div>
  );
};

export default AppShell;
