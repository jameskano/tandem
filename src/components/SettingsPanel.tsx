import React, { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '../shared/ui/Card';
import Button from '../shared/ui/Button';
import Dropdown from '../shared/ui/Dropdown';
import { useToast } from '../hooks/useToast';
import { useBlockingLoader } from '../hooks/useBlockingLoader';
import Input from '../shared/ui/Input';
import { useI18n } from '../shared/i18n/useI18n';
import { useTheme } from '../shared/providers/ThemeProvider';
import { getAllSavedActivities } from '../services/API/savedActivities';
import { downloadJsonFile } from '../shared/utils/export';
import { signOut, updateEmail, updatePassword } from '../shared/utils/auth';
import type { AppLocale, Currency } from '../shared/types/user';
import { useAuthContext } from '../store/context/AuthProvider';
import { useRevenueCatContext } from '../store/context/RevenueCatProvider';
import { useSettingsContext } from '../store/context/SettingsProvider';
import {
  updateUserSettings,
  userSettingsQueryKey,
} from '../services/API/userSettings';
import {
  REVENUECAT_PRODUCTS,
  TANDEM_PRO_ENTITLEMENT_ID,
} from '../services/revenueCat';

const SettingsPanel: React.FC = () => {
  const { t } = useI18n();
  const toast = useToast();
  const blockingLoader = useBlockingLoader();
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  const { user, refresh, deleteUser } = useAuthContext();
  const {
    isAvailable: isRevenueCatAvailable,
    isLoading: isSubscriptionLoading,
    error: subscriptionError,
    hasTandemPro,
    customerInfo,
    currentOffering,
    presentPaywall,
    purchaseProduct,
    restorePurchases,
    presentCustomerCenter,
  } = useRevenueCatContext();
  const { currency, locale, isSettingsLoading, setCurrency, setLocale } =
    useSettingsContext();
  const [email, setEmail] = useState('');
  const [passwordForm, setPasswordForm] = useState({
    password: '',
    confirmPassword: '',
  });
  const [emailError, setEmailError] = useState<string>();
  const [passwordErrors, setPasswordErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

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
    [t]
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

  const updateEmailMutation = useMutation({
    mutationFn: updateEmail,
    onSuccess: async (_data, nextEmail) => {
      await refresh();
      setEmail('');
      toast.success(t('settings.emailUpdateSuccess', { email: nextEmail }));
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: async () => {
      await refresh();
      setPasswordForm({
        password: '',
        confirmPassword: '',
      });
      toast.success(t('settings.passwordUpdateSuccess'));
    },
  });

  const signOutMutation = useMutation({
    mutationFn: () =>
      blockingLoader.run(() => signOut(), {
        message: t('settings.loggingOut'),
      }),
    onSuccess: () => {
      toast.success(t('settings.logoutSuccess'));
    },
    onError: (error: any) => {
      toast.error(error?.message || t('settings.logoutFailed'));
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: () =>
      blockingLoader.run(() => deleteUser(), {
        message: t('settings.deletingAccount'),
        delay: 0,
      }),
    onSuccess: deleted => {
      if (!deleted) {
        return;
      }

      toast.success(t('settings.deleteAccountSuccess'));
    },
    onError: (error: any) => {
      toast.error(error?.message || t('settings.deleteAccountFailed'));
    },
  });

  const presentPaywallMutation = useMutation({
    mutationFn: presentPaywall,
    onSuccess: unlocked => {
      if (unlocked) {
        toast.success(t('settings.subscriptionUpdated'));
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || t('settings.subscriptionActionFailed'));
    },
  });

  const purchaseProductMutation = useMutation({
    mutationFn: purchaseProduct,
    onSuccess: nextCustomerInfo => {
      toast.success(
        nextCustomerInfo.entitlements.active[TANDEM_PRO_ENTITLEMENT_ID]
          ? t('settings.subscriptionUpdated')
          : t('settings.subscriptionPurchaseComplete')
      );
    },
    onError: (error: any) => {
      if (error?.userCancelled) {
        return;
      }
      toast.error(error?.message || t('settings.subscriptionActionFailed'));
    },
  });

  const restorePurchasesMutation = useMutation({
    mutationFn: restorePurchases,
    onSuccess: nextCustomerInfo => {
      toast.success(
        nextCustomerInfo.entitlements.active[TANDEM_PRO_ENTITLEMENT_ID]
          ? t('settings.subscriptionRestored')
          : t('settings.subscriptionNothingToRestore')
      );
    },
    onError: (error: any) => {
      toast.error(error?.message || t('settings.subscriptionActionFailed'));
    },
  });

  const customerCenterMutation = useMutation({
    mutationFn: presentCustomerCenter,
    onError: (error: any) => {
      toast.error(error?.message || t('settings.subscriptionActionFailed'));
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
      toast.error(t('settings.preferenceUpdateFailed'));
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
      toast.error(t('settings.preferenceUpdateFailed'));
    }
  };

  const handleExportSavedActivities = async () => {
    try {
      await exportSavedActivitiesMutation.mutateAsync();
      toast.success(t('settings.exportSuccess'));
    } catch (error) {
      console.error('Error exporting saved activities:', error);
      toast.error(t('settings.exportFailed'));
    }
  };

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const currentEmail = user?.email?.trim().toLowerCase();
    const pendingEmail = user?.new_email?.trim().toLowerCase();

    setEmailError(undefined);

    if (!normalizedEmail) {
      setEmailError(t('auth.emailRequired'));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setEmailError(t('auth.invalidEmail'));
      return;
    }

    if (normalizedEmail === currentEmail || normalizedEmail === pendingEmail) {
      setEmailError(t('settings.emailUnchanged'));
      return;
    }

    try {
      await updateEmailMutation.mutateAsync(normalizedEmail);
    } catch (error: any) {
      setEmailError(error?.message || t('settings.emailUpdateFailed'));
    }
  };

  const handlePasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const nextErrors: typeof passwordErrors = {};

    if (!passwordForm.password) {
      nextErrors.password = t('auth.passwordRequired');
    } else if (passwordForm.password.length < 8) {
      nextErrors.password = t('auth.passwordMinLength');
    }

    if (!passwordForm.confirmPassword) {
      nextErrors.confirmPassword = t('auth.confirmPasswordMissing');
    } else if (passwordForm.password !== passwordForm.confirmPassword) {
      nextErrors.confirmPassword = t('auth.passwordsDoNotMatch');
    }

    setPasswordErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      await updatePasswordMutation.mutateAsync(passwordForm.password);
    } catch (error: any) {
      setPasswordErrors({
        password: error?.message || t('settings.passwordUpdateFailed'),
      });
    }
  };

  const pendingEmail = user?.new_email?.trim() ?? '';
  const hasPendingEmailChange =
    Boolean(pendingEmail) && pendingEmail !== user?.email?.trim();
  const monthlyPackage =
    currentOffering?.monthly ??
    currentOffering?.availablePackages.find(
      item =>
        item.identifier === REVENUECAT_PRODUCTS.monthly ||
        item.product.identifier === REVENUECAT_PRODUCTS.monthly
    );
  const yearlyPackage =
    currentOffering?.annual ??
    currentOffering?.availablePackages.find(
      item =>
        item.identifier === REVENUECAT_PRODUCTS.yearly ||
        item.product.identifier === REVENUECAT_PRODUCTS.yearly
    );
  const activeEntitlement =
    customerInfo?.entitlements.active[TANDEM_PRO_ENTITLEMENT_ID];
  const subscriptionActionPending =
    isSubscriptionLoading ||
    presentPaywallMutation.isPending ||
    purchaseProductMutation.isPending ||
    restorePurchasesMutation.isPending ||
    customerCenterMutation.isPending;

  return (
    <div className="space-y-6">
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

      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-text">
          {t('settings.subscription')}
        </h2>
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="font-medium text-text">
              {hasTandemPro
                ? t('settings.subscriptionActive')
                : t('settings.subscriptionInactive')}
            </h3>
            <p className="text-textMuted text-sm">
              {activeEntitlement?.expirationDate
                ? t('settings.subscriptionRenews', {
                    date: new Date(
                      activeEntitlement.expirationDate
                    ).toLocaleDateString(),
                  })
                : t('settings.subscriptionDescription')}
            </p>
            {!isRevenueCatAvailable ? (
              <p className="text-textMuted text-sm">
                {t('settings.subscriptionNativeOnly')}
              </p>
            ) : null}
            {subscriptionError ? (
              <p className="text-sm text-red-600">{subscriptionError}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              type="button"
              className="w-full sm:w-auto"
              disabled={
                !user || !isRevenueCatAvailable || subscriptionActionPending
              }
              onClick={() => void presentPaywallMutation.mutateAsync()}
            >
              {t('settings.viewPlans')}
            </Button>

            <Button
              type="button"
              variant="outlineSoft"
              className="w-full sm:w-auto"
              disabled={
                !user || !isRevenueCatAvailable || subscriptionActionPending
              }
              onClick={() =>
                void purchaseProductMutation.mutateAsync('monthly')
              }
            >
              {monthlyPackage?.product.priceString
                ? t('settings.subscribeMonthlyPrice', {
                    price: monthlyPackage.product.priceString,
                  })
                : t('settings.subscribeMonthly')}
            </Button>

            <Button
              type="button"
              variant="outlineSoft"
              className="w-full sm:w-auto"
              disabled={
                !user || !isRevenueCatAvailable || subscriptionActionPending
              }
              onClick={() => void purchaseProductMutation.mutateAsync('yearly')}
            >
              {yearlyPackage?.product.priceString
                ? t('settings.subscribeYearlyPrice', {
                    price: yearlyPackage.product.priceString,
                  })
                : t('settings.subscribeYearly')}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              disabled={
                !user || !isRevenueCatAvailable || subscriptionActionPending
              }
              onClick={() => void restorePurchasesMutation.mutateAsync()}
            >
              {t('settings.restorePurchases')}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full sm:w-auto"
              disabled={
                !user || !isRevenueCatAvailable || subscriptionActionPending
              }
              onClick={() => void customerCenterMutation.mutateAsync()}
            >
              {t('settings.manageSubscription')}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-text">
          {t('settings.accountSecurity')}
        </h2>
        <div className="space-y-6">
          <form className="space-y-4" onSubmit={handleEmailSubmit}>
            <div className="space-y-1">
              <h3 className="font-medium text-text">
                {t('settings.emailAddress')}
              </h3>
              <p className="text-textMuted text-sm">
                {hasPendingEmailChange
                  ? t('settings.pendingEmailChange', { email: pendingEmail })
                  : t('settings.emailChangeDescription')}
              </p>
            </div>

            <Input
              type="email"
              label={t('settings.newEmail')}
              value={email}
              onChange={event => {
                setEmail(event.target.value);
                setEmailError(undefined);
              }}
              error={emailError}
              disabled={!user || updateEmailMutation.isPending}
              autoComplete="email"
              placeholder={t('settings.emailPlaceholder')}
            />

            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={!user || updateEmailMutation.isPending}
            >
              {updateEmailMutation.isPending
                ? t('settings.updatingEmail')
                : t('settings.changeEmail')}
            </Button>
          </form>

          <div className="border-t border-appBorder pt-6" />

          <form className="space-y-4" onSubmit={handlePasswordSubmit}>
            <div className="space-y-1">
              <h3 className="font-medium text-text">
                {t('settings.passwordSecurity')}
              </h3>
              <p className="text-textMuted text-sm">
                {t('settings.passwordChangeDescription')}
              </p>
            </div>

            <Input
              type="password"
              label={t('settings.newPassword')}
              value={passwordForm.password}
              onChange={event => {
                setPasswordForm(prev => ({
                  ...prev,
                  password: event.target.value,
                }));
                setPasswordErrors(prev => ({
                  ...prev,
                  password: undefined,
                }));
              }}
              error={passwordErrors.password}
              disabled={!user || updatePasswordMutation.isPending}
              autoComplete="new-password"
              helperText={t('register.passwordHelper')}
            />

            <Input
              type="password"
              label={t('common.confirmPassword')}
              value={passwordForm.confirmPassword}
              onChange={event => {
                setPasswordForm(prev => ({
                  ...prev,
                  confirmPassword: event.target.value,
                }));
                setPasswordErrors(prev => ({
                  ...prev,
                  confirmPassword: undefined,
                }));
              }}
              error={passwordErrors.confirmPassword}
              disabled={!user || updatePasswordMutation.isPending}
              autoComplete="new-password"
              placeholder={t('resetPassword.passwordPlaceholder')}
            />

            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={!user || updatePasswordMutation.isPending}
            >
              {updatePasswordMutation.isPending
                ? t('settings.updatingPassword')
                : t('settings.changePassword')}
            </Button>
          </form>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-text">
          {t('settings.accountActions')}
        </h2>
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              disabled={
                !user ||
                signOutMutation.isPending ||
                deleteAccountMutation.isPending
              }
              onClick={() => void signOutMutation.mutateAsync()}
            >
              {signOutMutation.isPending
                ? t('settings.loggingOut')
                : t('settings.logout')}
            </Button>

            <Button
              type="button"
              variant="primaryOutline"
              className="w-full border-red-500 text-red-600 hover:bg-red-500/10 focus:ring-red-500 sm:w-auto"
              disabled={
                !user ||
                signOutMutation.isPending ||
                deleteAccountMutation.isPending
              }
              onClick={() => void deleteAccountMutation.mutateAsync()}
            >
              {deleteAccountMutation.isPending
                ? t('settings.deletingAccount')
                : t('settings.deleteAccount')}
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
