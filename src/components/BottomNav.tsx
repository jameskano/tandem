import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings } from '../shared/icons';
import { useI18n } from '../shared/i18n/useI18n';
import { cn } from '../shared/utils/format';
import { FileHeart } from 'lucide-react';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const { t } = useI18n();

  const navItems = [
    { path: '/dashboard', icon: Home, label: t('nav.dashboard') },
    {
      path: '/saved-activities',
      icon: FileHeart,
      label: t('nav.savedActivities'),
    },
    { path: '/settings', icon: Settings, label: t('nav.settings') },
  ];

  return (
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white md:hidden">
      <div className="relative grid h-16 grid-cols-3 items-center">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/3 top-1/2 h-8 -translate-x-1/2 -translate-y-1/2 border-l border-gray-200"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-2/3 top-1/2 h-8 -translate-x-1/2 -translate-y-1/2 border-l border-gray-200"
        />
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex h-full min-h-[44px] w-full min-w-[44px] flex-col items-center justify-center rounded-lg px-2 py-1 text-center transition-colors',
                isActive ? 'text-primary' : 'text-textMuted hover:text-text'
              )}
            >
              <Icon size={20} />
              <span className="mt-1 hidden text-xs sm:block">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
