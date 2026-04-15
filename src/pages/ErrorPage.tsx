import React from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { COLORS } from '../shared/colors';
import logo1 from '../assets/main-logo/logo1.png';
import { useI18n } from '../shared/i18n/useI18n';
import Card from '../shared/ui/Card';
import Button from '../shared/ui/Button';
import NotFound from './NotFound';
import AppShell from '../components/AppShell';

const ErrorPage: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const error = useRouteError() as any;

  const isNotFound =
    error?.status === 404 || /not found/i.test(error?.message || '');

  if (isNotFound) {
    return (
      <AppShell>
        <NotFound />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex w-full flex-col" style={{ backgroundColor: COLORS.bg }}>
        <div className="px-4 py-6 text-center">
          <img src={logo1} alt="Tandem Logo" className="mx-auto mb-4 w-14" />
          <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>
            {t('errorPage.title')}
          </h1>
          <p className="mt-1 text-sm" style={{ color: COLORS.muted }}>
            {t('errorPage.subtitle')}
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-8">
          <Card className="w-full max-w-md space-y-6">
            <div>
              <p className="mb-4 text-sm" style={{ color: COLORS.muted }}>
                {error?.message ?? t('common.unknownError')}
              </p>
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1"
                  onClick={() => window.location.reload()}
                >
                  {t('errorPage.reload')}
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  className="flex-1"
                  onClick={() => navigate('/')}
                >
                  {t('common.home')}
                </Button>
              </div>
            </div>

            <div className="text-xs" style={{ color: COLORS.muted }}>
              {t('errorPage.support')}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
};

export default ErrorPage;
