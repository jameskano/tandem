import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo1 from '../assets/main-logo/logo1.png';
import { useI18n } from '../shared/i18n/useI18n';

const DesktopNav: React.FC = () => {
  const location = useLocation();
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-50 hidden border-b border-gray-200 bg-white md:block">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <img src={logo1} alt="Tandem Logo" className="w-8" />
            <span className="text-xl font-bold text-text">
              {t('common.appName')}
            </span>
          </Link>

          <nav className="hidden items-center space-x-6 md:flex">
            <Link
              to="/dashboard"
              className={`rounded-lg px-3 py-2 transition-colors ${
                location.pathname === '/dashboard'
                  ? 'bg-primary/10 text-primary'
                  : 'text-textMuted hover:text-text'
              }`}
            >
              {t('nav.dashboard')}
            </Link>
            <Link
              to="/planner"
              className={`rounded-lg px-3 py-2 transition-colors ${
                location.pathname === '/planner'
                  ? 'bg-primary/10 text-primary'
                  : 'text-textMuted hover:text-text'
              }`}
            >
              {t('nav.planner')}
            </Link>
            <Link
              to="/settings"
              className={`rounded-lg px-3 py-2 transition-colors ${
                location.pathname === '/settings'
                  ? 'bg-primary/10 text-primary'
                  : 'text-textMuted hover:text-text'
              }`}
            >
              {t('nav.settings')}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default DesktopNav;
