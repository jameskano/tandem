import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import BottomNav from '../BottomNav/BottomNav'
import TopNav from '../TopNav/TopNav'

const Layout: React.FC = () => {
  const location = useLocation()
  const isMainPage = location.pathname === '/'

  return (
    <div className="min-h-screen bg-bg">
      {/* Top Navigation - Desktop only, hidden on Main page */}
      {!isMainPage && (
        <div className="hidden md:block">
          <TopNav />
        </div>
      )}

      {/* Main Content */}
      <main className={isMainPage ? 'pb-0' : 'pb-20 md:pb-0'}>
        <Outlet />
      </main>

      {/* Bottom Navigation - Mobile only, hidden on Main page */}
      {!isMainPage && (
        <div className="md:hidden">
          <BottomNav />
        </div>
      )}
    </div>
  )
}

export default Layout
