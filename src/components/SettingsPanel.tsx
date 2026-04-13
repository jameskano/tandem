import React, { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '../shared/ui/Card';
import Button from '../shared/ui/Button';
import Dropdown from '../shared/ui/Dropdown';
import { useI18n } from '../shared/i18n/useI18n';
import { useTheme } from '../shared/providers/ThemeProvider';
import { getAllSavedActivities } from '../services/API/savedActivities';
import { generateInviteCode } from '../shared/utils/format';
import { downloadJsonFile } from '../shared/utils/export';
import type { AppLocale, Currency } from '../shared/types/user';
import { useAuthContext } from '../store/context/AuthProvider';
import { useSettingsContext } from '../store/context/SettingsProvider';
import {
  updateUserSettings,
  userSettingsQueryKey,
} from '../services/API/userSettings';

const SettingsPanel: React.FC = () => {
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const { currency, locale, isSettingsLoading, setCurrency, setLocale } =
    useSettingsContext();
  const [inviteCode] = useState(generateInviteCode());

  const languageOptions = useMemo(
    () => [
      { value: 'en-US' as AppLocale, label: t('settings.languageEnglish') },
      { value: 'es-ES' as AppLocale, label: t('settings.languageSpanish') },
    ],
    [t]
  );

  const currencyOptions = useMemo(
    () => [
      { value: 'EUR' as Currency, label: t('settings.currencyEuro') },
      { value: 'USD' as Currency, label: t('settings.currencyDollar') },
    ],
    [t]
  );

  const themeOptions = useMemo(
    () => [
      { value: 'light', label: t('settings.themeLight') },
      { value: 'dark', label: t('settings.themeDark') },
    ],
    []
  );

  const updateSettingsMutation = useMutation({
    mutationFn: async (
      patch: Partial<{ locale: AppLocale; currency: Currency }>
    ) => {
      if (!user) {
        throw new Error('User is required to update settings.');
      }

      return updateUserSettings({
        userId: user.id,
        patch,
      });
    },
    onSuccess: updatedSettings => {
      queryClient.setQueryData(userSettingsQueryKey(user?.id), updatedSettings);
    },
  });

  const exportSavedActivitiesMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error('User is required to export saved activities.');
      }

      const activities = await getAllSavedActivities(user.id);
      const exportedAt = new Date().toISOString();

      downloadJsonFile(
        `tandem-saved-activities-${exportedAt.slice(0, 10)}.json`,
        {
          app: 'Tandem',
          resource: 'saved_activities',
          exported_at: exportedAt,
          total: activities.length,
          activities,
        }
      );
    },
  });

  const handleLocaleChange = async (nextLocale: AppLocale) => {
    const previousLocale = locale;
    setLocale(nextLocale);

    try {
      await updateSettingsMutation.mutateAsync({ locale: nextLocale });
    } catch (error) {
      console.error('Error updating language preference:', error);
      setLocale(previousLocale);
    }
  };

  const handleCurrencyChange = async (nextCurrency: Currency) => {
    const previousCurrency = currency;
    setCurrency(nextCurrency);

    try {
      await updateSettingsMutation.mutateAsync({ currency: nextCurrency });
    } catch (error) {
      console.error('Error updating currency preference:', error);
      setCurrency(previousCurrency);
    }
  };

  const handleExportSavedActivities = async () => {
    try {
      await exportSavedActivitiesMutation.mutateAsync();
    } catch (error) {
      console.error('Error exporting saved activities:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Partner Link */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-text">
          {t('settings.partnerLink')}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-text">
              {t('settings.inviteCode')}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inviteCode}
                readOnly
                className="flex-1 rounded-lg border border-appBorder bg-surface px-3 py-2 text-text"
              />
              <Button size="sm" variant="outline">
                {t('common.copy')}
              </Button>
            </div>
            <p className="text-textMuted mt-2 text-sm">
              {t('settings.inviteDescription')}
            </p>
          </div>
        </div>
      </Card>

      {/* App Settings */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-text">
          {t('settings.appSettings')}
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-medium text-text">
                {t('settings.language')}
              </h3>
            </div>
            <Dropdown
              options={languageOptions}
              value={locale}
              disabled={
                !user || isSettingsLoading || updateSettingsMutation.isPending
              }
              onChange={value => void handleLocaleChange(value as AppLocale)}
              className="min-w-[160px]"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-medium text-text">
                {t('settings.currencyPreference')}
              </h3>
            </div>
            <Dropdown
              options={currencyOptions}
              value={currency}
              disabled={
                !user || isSettingsLoading || updateSettingsMutation.isPending
              }
              onChange={value => void handleCurrencyChange(value as Currency)}
              className="min-w-[160px]"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-text">{t('settings.theme')}</h3>
            </div>
            <Dropdown
              options={themeOptions}
              value={theme}
              onChange={value => setTheme(value as 'light' | 'dark')}
              className="min-w-[160px]"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-text">
                {t('settings.dataExport')}
              </h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={!user || exportSavedActivitiesMutation.isPending}
              onClick={() => void handleExportSavedActivities()}
            >
              {exportSavedActivitiesMutation.isPending
                ? t('settings.exporting')
                : t('settings.export')}
            </Button>
          </div>
        </div>
      </Card>

      {/* About */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-text">
          {t('settings.about')}
        </h2>
        <div className="text-textMuted space-y-2 text-sm">
          <p>{t('settings.version')}</p>
          <p>{t('settings.builtForCouples')}</p>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPanel;
