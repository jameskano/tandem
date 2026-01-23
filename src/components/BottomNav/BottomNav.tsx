import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Calendar, Camera, Settings } from '../../shared/icons'
import { cn } from '../../shared/utils/format'

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/discover', icon: Search, label: 'Discover' },
  { path: '/planner', icon: Calendar, label: 'Planner' },
  { path: '/moments', icon: Camera, label: 'Moments' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

const BottomNav: React.FC = () => {
  const location = useLocation()

  return (
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white md:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex min-h-[44px] min-w-[44px] flex-col items-center justify-center rounded-lg px-2 py-1 transition-colors',
                isActive ? 'text-primary' : 'text-textMuted hover:text-text'
              )}
            >
              <Icon size={20} />
              <span className="mt-1 hidden text-xs sm:block">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
