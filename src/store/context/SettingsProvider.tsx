import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { AppLocale, Currency, UserSettings } from '../../shared/types/user';
import { useUserSettingsQuery } from '../../hooks/useUserSettingsQuery';
import {
  getDefaultUserSettings,
  userSettingsQueryKey,
} from '../../services/API/userSettings';
import { useAuthContext } from './AuthProvider';

type SettingsContextType = {
  currency: Currency;
  locale: AppLocale;
  onboardingCompleted: boolean;
  isSettingsLoading: boolean;
  setCurrency: Dispatch<SetStateAction<Currency>>;
  setLocale: Dispatch<SetStateAction<AppLocale>>;
  setOnboardingCompleted: Dispatch<SetStateAction<boolean>>;
};

const SettingsContext = createContext({} as SettingsContextType);

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const { data: userSettings, isLoading, isFetching } = useUserSettingsQuery();
  const defaultSettings = user
    ? getDefaultUserSettings(user.id)
    : getDefaultUserSettings('anonymous');

  const settings = userSettings ?? defaultSettings;

  const setCurrency = useCallback<Dispatch<SetStateAction<Currency>>>(
    value => {
      if (!user) {
        return;
      }

      queryClient.setQueryData(
        userSettingsQueryKey(user.id),
        (current?: UserSettings) => {
        const previousSettings = current ?? getDefaultUserSettings(user.id);
        const nextCurrency =
          typeof value === 'function'
            ? value(previousSettings.currency)
            : value;

        return {
          ...previousSettings,
          currency: nextCurrency,
        };
        }
      );
    },
    [queryClient, user]
  );

  const setLocale = useCallback<Dispatch<SetStateAction<AppLocale>>>(
    value => {
      if (!user) {
        return;
      }

      queryClient.setQueryData(
        userSettingsQueryKey(user.id),
        (current?: UserSettings) => {
        const previousSettings = current ?? getDefaultUserSettings(user.id);
        const nextLocale =
          typeof value === 'function' ? value(previousSettings.locale) : value;

        return {
          ...previousSettings,
          locale: nextLocale,
        };
        }
      );
    },
    [queryClient, user]
  );

  const setOnboardingCompleted = useCallback<
    Dispatch<SetStateAction<boolean>>
  >(
    value => {
      if (!user) {
        return;
      }

      queryClient.setQueryData(
        userSettingsQueryKey(user.id),
        (current?: UserSettings) => {
        const previousSettings = current ?? getDefaultUserSettings(user.id);
        const nextOnboardingCompleted =
          typeof value === 'function'
            ? value(previousSettings.onboarding_completed)
            : value;

        return {
          ...previousSettings,
          onboarding_completed: nextOnboardingCompleted,
        };
        }
      );
    },
    [queryClient, user]
  );

  const value = useMemo(
    () => ({
      currency: settings.currency,
      locale: settings.locale,
      onboardingCompleted: settings.onboarding_completed,
      isSettingsLoading: Boolean(user) && (isLoading || isFetching),
      setCurrency,
      setLocale,
      setOnboardingCompleted,
    }),
    [
      isFetching,
      isLoading,
      setCurrency,
      setLocale,
      setOnboardingCompleted,
      settings.currency,
      settings.locale,
      settings.onboarding_completed,
      user,
    ]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error('useSettingsContext must be used within SettingsProvider');
  return context;
};
