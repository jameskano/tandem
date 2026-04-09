import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { COLORS } from '../shared/colors';
import logo1 from '../assets/main-logo/logo1.png';
import { useI18n } from '../shared/i18n/useI18n';
import Card from '../shared/ui/Card';
import Button from '../shared/ui/Button';

const NotFound: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <div
      className="flex min-h-screen min-w-full flex-col"
      style={{ backgroundColor: COLORS.bg }}
    >
      <div className="px-4 py-6 text-center">
        <Link to="/" className="inline-block">
          <img src={logo1} alt="Tandem Logo" className="mx-auto mb-4 w-14" />
        </Link>
        <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>
          {t('notFound.title')}
        </h1>
        <p className="mt-1 text-sm" style={{ color: COLORS.muted }}>
          {t('notFound.subtitle')}
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <p className="mb-4">{t('notFound.body')}</p>
          <Button
            variant="primary"
            onClick={() => navigate('/')}
            className="mx-auto"
          >
            {t('notFound.goHome')}
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
