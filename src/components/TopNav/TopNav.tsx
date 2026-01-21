import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Heart } from '../../shared/icons'

const TopNav: React.FC = () => {
  const location = useLocation()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="text-primary" size={24} />
            <span className="text-xl font-bold text-text">Tandem</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/dashboard'
                  ? 'text-primary bg-primary/10'
                  : 'text-textMuted hover:text-text'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/discover"
              className={`px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/discover'
                  ? 'text-primary bg-primary/10'
                  : 'text-textMuted hover:text-text'
              }`}
            >
              Discover
            </Link>
            <Link
              to="/planner"
              className={`px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/planner'
                  ? 'text-primary bg-primary/10'
                  : 'text-textMuted hover:text-text'
              }`}
            >
              Planner
            </Link>
            <Link
              to="/goals"
              className={`px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/goals'
                  ? 'text-primary bg-primary/10'
                  : 'text-textMuted hover:text-text'
              }`}
            >
              Goals
            </Link>
            <Link
              to="/moments"
              className={`px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/moments'
                  ? 'text-primary bg-primary/10'
                  : 'text-textMuted hover:text-text'
              }`}
            >
              Moments
            </Link>
            <Link
              to="/settings"
              className={`px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/settings'
                  ? 'text-primary bg-primary/10'
                  : 'text-textMuted hover:text-text'
              }`}
            >
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default TopNav
