import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import BottomNav from '../BottomNav/BottomNav'
import DesktopNav from '../DesktopNav/DesktopNav'
import TopNav from '../TopNav/TopNav'

const Layout: React.FC = () => {
  const location = useLocation()
  const isMainPage = location.pathname === '/'

  return (
    <div className="min-h-screen bg-bg">
      {!isMainPage && <DesktopNav />}

      <main className={isMainPage ? 'pb-0' : 'pb-20 md:pb-0'}>
        <Outlet />
      </main>

      {!isMainPage && <BottomNav />}
    </div>
  )
}

export default Layout
