import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { TopNav } from '../components/TopNav'

export const Layout: React.FC = () => {
  const location = useLocation()
  const isMainPage = location.pathname === '/'

  return (
    <div className="min-h-screen bg-bg">
      {/* Top Navigation - Desktop only */}
      <div className="hidden md:block">
        <TopNav />
      </div>

      {/* Main Content */}
      <main className="pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* Bottom Navigation - Mobile only */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  )
}
