import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import DesktopNav from './DesktopNav';

const Layout: React.FC = () => {
  const location = useLocation();
  const isMainPage = location.pathname === '/';

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      {!isMainPage && <DesktopNav />}

      <main
        className={
          isMainPage ? 'flex flex-1 pb-0' : 'flex flex-1 pb-20 md:pb-0'
        }
      >
        <Outlet />
      </main>

      {!isMainPage && <BottomNav />}
    </div>
  );
};

export default Layout;
