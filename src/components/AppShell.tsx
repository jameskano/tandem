import React from 'react';
import { useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import DesktopNav from './DesktopNav';
import { useAuthContext } from '../store/context/AuthProvider';

type AppShellProps = {
  children: React.ReactNode;
};

const AppShell = ({ children }: AppShellProps) => {
  const location = useLocation();
  const { user, loading } = useAuthContext();

  const isMainPage = location.pathname === '/';
  const showNavigation = !isMainPage && !loading && Boolean(user);

  return (
    <div className="flex h-screen flex-col bg-bg">
      {showNavigation && <DesktopNav />}

      <main className={showNavigation ? 'flex flex-1' : 'flex flex-1 pb-0'}>
        {children}
      </main>

      {showNavigation && <BottomNav />}
    </div>
  );
};

export default AppShell;
