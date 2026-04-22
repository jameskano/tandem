import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo1 from '../assets/main-logo/logo1.png';
import { appNavigationItems } from '../shared/constants/navigation';
import { useI18n } from '../shared/i18n/useI18n';
import { cn } from '../shared/utils/format';

const DesktopNav: React.FC = () => {
  const location = useLocation();
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-50 border-b border-appBorder bg-surface/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link to="/dashboard" className="flex min-w-0 items-center gap-3">
          <img src={logo1} alt="Tandem Logo" className="h-10 w-10 rounded-xl" />
          <div className="min-w-0">
            <p className="text-textMuted text-xs font-medium uppercase tracking-[0.24em]">
              {t('common.appName')}
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 rounded-2xl border border-appBorder bg-bg/70 p-1">
          {appNavigationItems.map(({ path, labelKey }) => {
            const isActive = location.pathname === path;

            return (
              <Link
                key={path}
                to={path}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-primaryForeground bg-primary shadow-sm'
                    : 'text-textMuted hover:bg-surface hover:text-text'
                )}
              >
                <span>{t(labelKey)}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default DesktopNav;
