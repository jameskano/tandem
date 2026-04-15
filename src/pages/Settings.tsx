import React from 'react';
import SettingsPanel from '../components/SettingsPanel';
import { useI18n } from '../shared/i18n/useI18n';

const Settings: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-full w-full bg-bg">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-bold text-text">
            {t('settings.title')}
          </h1>
          <p className="text-textMuted">{t('settings.subtitle')}</p>
        </div>

        <SettingsPanel />
      </div>
    </div>
  );
};

export default Settings;
