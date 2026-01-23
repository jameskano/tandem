import { Link, useLocation } from 'react-router-dom'
import logo1 from '../../assets/main-logo/logo1.png'
import { Settings } from '../../shared/icons'
import { cn } from '../../shared/utils/format'

const TopNav = () => {
  const location = useLocation()

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-gray-200 bg-white md:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <img src={logo1} alt="Tandem Logo" className="w-8" />
          <span className="text-xl font-bold text-text">Tandem</span>
        </Link>

        <Link
          key="/settings"
          to="/settings"
          className={cn(
            'flex min-h-[44px] min-w-[44px] flex-col items-center justify-center rounded-lg px-2 py-1 transition-colors',
            location.pathname === '/settings'
              ? 'text-primary'
              : 'text-ttx textMuted hover:text-text'
          )}
        >
          <Settings size={20} />
          <span className="mt-1 hidden text-xs sm:block">Settings</span>
        </Link>
      </div>
    </header>
  )
}

export default TopNav
